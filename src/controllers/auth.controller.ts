import { eq } from "drizzle-orm"
import { Request, Response } from "express"
import httpStatus from "http-status"

import { logger } from "../config/logger"
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
      throw new ApiError(httpStatus.CONFLICT, `User with this email already exists : ${existingUser[0].email}`)
    }

    const hashedPassword = await hashPassword(password)

    const [createdUser] = await db
      .insert(users)
      .values({
        fullName,
        email,
        password: hashedPassword,
      })
      .returning({ id: users.id })

    res.send(
      new ApiResponse({ statusCode: httpStatus.CREATED, data: createdUser, message: "user created successfully" }),
    )
    logger.info(`registered user with id: ${createdUser.id}`)
  }
}
