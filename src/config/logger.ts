import winston from "winston"

import Config from "./index"

const { isDev } = Config

const format = winston.format.combine(
  winston.format.colorize(),
  winston.format.splat(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp }) => `${level}:[${timestamp as string}]: ${message as string}`),
)

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "auth-service" },
  transports: [
    new winston.transports.Console({
      level: isDev ? "debug" : "error",
      format,
    }),

    new winston.transports.File({
      level: isDev ? "debug" : "error",
      dirname: "logs",
      filename: "app.log",
      format,
    }),
  ],
})
