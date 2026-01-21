import rateLimit from "express-rate-limit"

import { logger } from "../config/logger"

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
  handler: (req, res, _next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`)
    res.status(options.statusCode).json(options.message)
  },
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many authentication attempts, please try again after 15 minutes.",
  },
  handler: (req, res, _next, options) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip} on ${req.path}`)
    res.status(options.statusCode).json(options.message)
  },
  skipSuccessfulRequests: true, // Only count failed attempts
})

export const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many attempts, please try again after an hour.",
  },
  handler: (req, res, _next, options) => {
    logger.warn(`Sensitive operation rate limit exceeded for IP: ${req.ip}`)
    res.status(options.statusCode).json(options.message)
  },
})
