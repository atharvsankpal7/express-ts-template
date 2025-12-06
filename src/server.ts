import app from "./app"
import Config from "./config"
import { logger } from "./config/logger"

const startServer = () => {
  const PORT = Config.PORT
  try {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

startServer()
