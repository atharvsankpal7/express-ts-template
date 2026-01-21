import app from "./app"
import Config from "./config"
import { logger } from "./config/logger"
import { setupGracefulShutdown } from "./utils/gracefulShutdown"

const startServer = () => {
  const PORT = Config.PORT
  try {
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      logger.debug(`Environment: ${process.env.NODE_ENV}`)
    })

    setupGracefulShutdown({
      server,
      timeout: 30000,
    })
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

startServer()
