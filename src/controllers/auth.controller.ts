import { eq } from "drizzle-orm"
import { Request, Response } from "express"
import httpStatus from "http-status"

import { db } from "../drizzle/drizzle"
import { hashPassword, users } from "../drizzle/schema"
import ApiError from "../utils/apiError"
import ApiResponse from "../utils/apiResponse"
import { validateType } from "../utils/zodValidator"
import { RegisterBodySchema } from "../validationSchemas/auth.zod"

export class AuthController {
  async register(req: Request, res: Response) {
    const { fullName, email, password } = validateType(RegisterBodySchema, req.body)

    const existingUser = await db.select().from(users).where(eq(users.email, email))

    if (existingUser.length > 0) {
      throw new ApiError(httpStatus.CONFLICT, "User with this email already exists")
    }

    const hashedPassword = await hashPassword(password)

    const [user] = await db
      .insert(users)
      .values({
        fullName,
        email,
        password: hashedPassword,
      })
      .returning()

    res.send(new ApiResponse(httpStatus.CREATED, user, "user created successfully"))
  }
}
