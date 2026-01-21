import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import passport from "passport"

import Config from "./config"
import { logger } from "./config/logger"
import passportStratergry from "./config/passport"
import healthRouter from "./middleware/healthCheck"
import { generalLimiter } from "./middleware/rateLimiter"
import { securityHeaders } from "./middleware/security"
import { responseEnhancer } from "./middleware/utils"
import routers from "./routes"
import ApiError from "./utils/apiError"
import ApiResponse from "./utils/apiResponse"
import { shutdownMiddleware } from "./utils/gracefulShutdown"

const app = express()

app.use(shutdownMiddleware())

app.use(securityHeaders)

app.use(
  cors({
    origin: Config.isDev ? "http://localhost:3000" : process.env.FRONTEND_URL,
    credentials: true,
  }),
)

if (!Config.isTest) {
  app.use(generalLimiter)
}

passportStratergry(passport)
app.use(passport.initialize())

app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(cookieParser())

app.use(express.static("static-assets"))

app.use(responseEnhancer)

app.use("/health", healthRouter)

app.use(routers)

// non-exising routes
app.use((_req, _res) => {
  throw new ApiError(httpStatus.NOT_FOUND, "Api Not found", false)
})

// global error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    if (err.isOperational) logger.error(err.message, { statusCode: err.statusCode, stack: err.stack })
    return res
      .status(err.statusCode)
      .send(new ApiResponse({ statusCode: err.statusCode, data: null, error: err.message }))
  }

  const statusCode = httpStatus.INTERNAL_SERVER_ERROR
  const errorMessage = err instanceof Error ? err.message : "Internal Server Error"
  const stack = err instanceof Error ? err.stack : undefined

  logger.error(errorMessage, { statusCode, stack })

  return res.send(new ApiResponse({ statusCode, data: Config.isDev ? { stack } : null, error: errorMessage }))
})

export default app
