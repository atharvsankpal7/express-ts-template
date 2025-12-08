import { NextFunction, Request, Response } from "express"

interface ResponseWithStatus {
  statusCode: number
}

const hasStatusCode = (body: unknown): body is ResponseWithStatus => {
  return (
    typeof body === "object" &&
    body !== null &&
    "statusCode" in body &&
    typeof (body as Record<string, unknown>).statusCode === "number"
  )
}

export const responseEnhancer = (_req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send

  res.send = function (body: unknown) {
    if (hasStatusCode(body)) {
      res.status(body.statusCode)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return originalSend.call(this, body as any)
  }

  next()
}
