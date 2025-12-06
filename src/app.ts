import express from "express"
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"

import { logger } from "./config/logger"
import ApiError from "./utils/apiError"
import ApiResponse from "./utils/apiResponse"

const app = express()

app.get("/health", (req: Request, res: Response) => {
  res.send(new ApiResponse(httpStatus.OK, null, "app is running"))
})

app.use((_req, _res) => {
  throw new ApiError(httpStatus.NOT_FOUND, "Api Not found")
})
app.use((err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(`${err.statusCode}, ${err.message}`)
  res.send(new ApiResponse(err.statusCode, null, err.message))
})

export default app
