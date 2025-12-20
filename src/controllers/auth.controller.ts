import { Request, Response } from "express"
import httpStatus from "http-status"

import ApiResponse from "../utils/apiResponse"
import { validateType } from "../utils/zodValidator"
import { RegisterBodySchema } from "../validationSchemas/auth.zod"

export class AuthController {
  register(req: Request, res: Response) {
    const { fullName, email, password } = validateType(RegisterBodySchema, req.body)

    res.send(new ApiResponse(httpStatus.CREATED, { fullName, email, password }, "user created successfully"))
  }
}
