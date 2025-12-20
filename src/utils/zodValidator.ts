import httpStatus from "http-status"
import { z } from "zod"

import ApiError from "./apiError"
export function validateType<T extends z.ZodType<unknown>>(schema: T, object_: unknown): z.infer<T> {
  try {
    return schema.parse(object_) as z.infer<T>
  } catch (err) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Unable to validate the expected schema",
      true,
      err instanceof Error ? err.stack : undefined,
    )
  }
}
