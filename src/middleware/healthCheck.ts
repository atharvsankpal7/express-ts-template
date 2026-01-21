import { sql } from "drizzle-orm"
import { Request, Response, Router } from "express"
import httpStatus from "http-status"

import { logger } from "../config/logger"
import { db } from "../drizzle/drizzle"
import ApiResponse from "../utils/apiResponse"

const healthRouter = Router()

interface HealthStatus {
  status: "healthy" | "unhealthy"
  timestamp: string
  uptime: number
  checks?: {
    database?: {
      status: "up" | "down"
      latencyMs?: number
      error?: string
    }
  }
}

/**
 * Liveness probe - checks if the application is running
 * Use for Kubernetes liveness probes
 * Should be lightweight and fast
 */
healthRouter.get("/live", (_req: Request, res: Response) => {
  const health: HealthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }

  res.status(httpStatus.OK).json(
    new ApiResponse({
      statusCode: httpStatus.OK,
      data: health,
      message: "Service is alive",
    }),
  )
})

/**
 * Readiness probe - checks if the application is ready to serve traffic
 * Use for Kubernetes readiness probes
 * Checks database connectivity
 */
healthRouter.get("/ready", async (_req: Request, res: Response) => {
  const health: HealthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {},
  }

  try {
    // Check database connectivity
    const startTime = Date.now()
    await db.execute(sql`SELECT 1`)
    const latencyMs = Date.now() - startTime

    health.checks!.database = {
      status: "up",
      latencyMs,
    }

    res.status(httpStatus.OK).json(
      new ApiResponse({
        statusCode: httpStatus.OK,
        data: health,
        message: "Service is ready",
      }),
    )
  } catch (error) {
    health.status = "unhealthy"
    health.checks!.database = {
      status: "down",
      error: error instanceof Error ? error.message : "Unknown error",
    }

    logger.error("Health check failed", { error })

    res.status(httpStatus.SERVICE_UNAVAILABLE).json(
      new ApiResponse({
        statusCode: httpStatus.SERVICE_UNAVAILABLE,
        data: health,
        error: "Service is not ready",
      }),
    )
  }
})

/**
 * Combined health check - returns detailed status
 * Useful for monitoring dashboards
 */
healthRouter.get("/", async (_req: Request, res: Response) => {
  const health: HealthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {},
  }

  let overallHealthy = true

  try {
    const startTime = Date.now()
    await db.execute(sql`SELECT 1`)
    const latencyMs = Date.now() - startTime

    health.checks!.database = {
      status: "up",
      latencyMs,
    }
  } catch (error) {
    overallHealthy = false
    health.checks!.database = {
      status: "down",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }

  health.status = overallHealthy ? "healthy" : "unhealthy"

  const statusCode = overallHealthy ? httpStatus.OK : httpStatus.SERVICE_UNAVAILABLE

  res.status(statusCode).json(
    new ApiResponse({
      statusCode,
      data: health,
      message: overallHealthy ? "All systems operational" : "Some systems are degraded",
    }),
  )
})

export default healthRouter
