class ApiError extends Error {
  statusCode: number
  isOperational: boolean
  constructor(statusCode: number, error: string, isOperational = true, stack = "") {
    super(error)
    this.statusCode = statusCode
    this.isOperational = isOperational
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default ApiError
