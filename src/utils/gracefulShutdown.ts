import { Server } from "http"

import { logger } from "../config/logger"
import { closeDbConnection } from "../drizzle/drizzle"

interface ShutdownConfig {
  server: Server
  timeout?: number // Timeout in ms before forcing shutdown
}

let isShuttingDown = false

/**
 * Sets up graceful shutdown handlers for the application
 * Handles SIGTERM (Kubernetes/Docker) and SIGINT (Ctrl+C) signals
 */
export function setupGracefulShutdown({ server, timeout = 30000 }: ShutdownConfig): void {
  const shutdown = async (signal: string) => {
    if (isShuttingDown) {
      logger.warn("Shutdown already in progress, ignoring signal")
      return
    }

    isShuttingDown = true
    logger.info(`Received ${signal}, starting graceful shutdown...`)

    // Set a hard timeout to force exit if graceful shutdown takes too long
    const forceExitTimeout = setTimeout(() => {
      logger.error("Graceful shutdown timed out, forcing exit")
      process.exit(1)
    }, timeout)

    try {
      // Step 1: Stop accepting new connections
      logger.info("Closing HTTP server...")
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            logger.error("Error closing HTTP server", { error: err })
            reject(err)
          } else {
            logger.info("HTTP server closed successfully")
            resolve()
          }
        })
      })

      // Step 2: Close database connections
      logger.info("Closing database connections...")
      await closeDbConnection()
      logger.info("Database connections closed successfully")

      // Step 3: Clean up any other resources here
      // e.g., Redis, message queues, etc.

      clearTimeout(forceExitTimeout)
      logger.info("Graceful shutdown completed successfully")
      process.exit(0)
    } catch (error) {
      clearTimeout(forceExitTimeout)
      logger.error("Error during graceful shutdown", { error })
      process.exit(1)
    }
  }

  // Handle termination signals
  process.on("SIGTERM", () => void shutdown("SIGTERM"))
  process.on("SIGINT", () => void shutdown("SIGINT"))

  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception", { error })
    void shutdown("uncaughtException")
  })

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled promise rejection", { reason, promise })
    void shutdown("unhandledRejection")
  })

  logger.info("Graceful shutdown handlers registered")
}

/**
 * Middleware to reject requests during shutdown
 */
export function shutdownMiddleware() {
  return function (
    _req: unknown,
    res: { status: (code: number) => { json: (body: unknown) => void } },
    next: () => void,
  ) {
    if (isShuttingDown) {
      return res.status(503).json({
        success: false,
        error: "Server is shutting down",
      })
    }
    next()
  }
}

/**
 * Check if shutdown is in progress
 */
export function isShutdownInProgress(): boolean {
  return isShuttingDown
}
