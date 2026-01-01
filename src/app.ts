import express from "express"
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"

import Config from "./config"
import { logger } from "./config/logger"
import { responseEnhancer } from "./middleware/utils"
import routers from "./routes"
import ApiError from "./utils/apiError"
import ApiResponse from "./utils/apiResponse"

const app = express()
app.use(express.json())
app.use(responseEnhancer)
app.get("/health", (req: Request, res: Response) => {
  res.send(new ApiResponse(httpStatus.OK, null, "app is running"))
})

app.use(routers)

app.use((_req, _res) => {
  throw new ApiError(httpStatus.NOT_FOUND, "Api Not found")
})

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    logger.error(err.message, { statusCode: err.statusCode, stack: err.stack })
    return res.status(err.statusCode).send(new ApiResponse(err.statusCode, null, err.message))
  }

  const statusCode = httpStatus.INTERNAL_SERVER_ERROR
  const message = err instanceof Error ? err.message : "Internal Server Error"
  const stack = err instanceof Error ? err.stack : undefined

  logger.error(message, { statusCode, stack })

  return res.send(new ApiResponse(statusCode, Config.isDev ? { stack } : null, message))
})

export default app
