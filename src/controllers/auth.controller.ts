import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"
import { CookieOptions, Request, Response } from "express"
import httpStatus from "http-status"
import z from "zod"

import Config from "../config"
import { logger } from "../config/logger"
import { db } from "../drizzle/drizzle"
import { hashPassword, IUser, users, userWithoutPassword } from "../drizzle/schema"
import * as tokenService from "../services/token.service"
import { ILoginRequest } from "../types/apiEndPointTypes/auth.types"
import ApiError from "../utils/apiError"
import ApiResponse from "../utils/apiResponse"
import { validateType } from "../utils/zodValidator"
import { ChangePasswordSchema, RegisterBodySchema, UpdateProfileSchema } from "../validationSchemas/auth.zod"

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: !Config.isDev,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export const setTokensAndRespond = async (user: IUser, res: Response) => {
  const accessToken = tokenService.generateAccessToken(user)
  const refreshToken = tokenService.generateRefreshToken(user)

  await tokenService.storeRefreshToken(user.id, refreshToken)

  res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)

  return res.send(
    new ApiResponse({
      statusCode: httpStatus.CREATED,
      data: {
        accessToken,
        user,
      },
      message: "Login successful",
    }),
  )
}

export const registerUser = async ({
  fullName,
  email,
  password,
}: z.infer<typeof RegisterBodySchema>): Promise<IUser> => {
  try {
    const hashedPassword = await hashPassword(password)

    const [createdUser] = await db
      .insert(users)
      .values({
        fullName,
        email,
        password: hashedPassword,
      })
      .returning(userWithoutPassword)

    logger.info(`registered user with id: ${createdUser.id}`)

    return createdUser
  } catch (err: unknown) {
    const error = err as { cause?: { code?: string } }
    if (error.cause?.code === "23505") {
      throw new ApiError(httpStatus.CONFLICT, "Email already registered")
    }
    throw err
  }
}

export const loginUser = async ({ email, password }: ILoginRequest): Promise<IUser> => {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid email or password")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid email or password")
  }

  logger.info(`successful login for email: ${email}`)

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string

  if (!refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token not found")
  }

  const decoded = tokenService.verifyRefreshToken(refreshToken)

  const storedToken = await tokenService.findRefreshToken(refreshToken)

  if (!storedToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token")
  }

  if (new Date() > storedToken.expiresAt) {
    await tokenService.deleteRefreshToken(refreshToken)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token expired")
  }

  const [user] = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1)

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not found")
  }

  const { password: _, ...userWithoutPassword } = user
  const newAccessToken = tokenService.generateAccessToken(userWithoutPassword)

  logger.info(`access token refreshed for user id: ${user.id}`)

  return res.send(
    new ApiResponse({
      statusCode: httpStatus.OK,
      data: {
        accessToken: newAccessToken,
      },
      message: "Token refreshed successfully",
    }),
  )
}

// export const logoutUser = async (req: Request, res: Response) => {}

export const updateProfile = async (req: Request, res: Response) => {
  const user = req.user as IUser

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated")
  }

  const { fullName, email } = validateType(UpdateProfileSchema, req.body)

  const updateData: Partial<{ fullName: string; email: string }> = {}
  if (fullName) updateData.fullName = fullName
  if (email) updateData.email = email

  try {
    const updatedUser = await db.update(users).set(updateData).where(eq(users.id, user.id)).returning()

    logger.info(`profile updated for user id: ${user.id}`)

    return res.send(
      new ApiResponse({
        statusCode: httpStatus.OK,
        data: { user: updatedUser[0] },
        message: "Profile updated successfully",
      }),
    )
  } catch (err: unknown) {
    const error = err as { cause?: { code?: string } }
    if (error.cause?.code === "23505") {
      throw new ApiError(httpStatus.CONFLICT, "Email already in use")
    }
    throw err
  }
}

export const changePassword = async (req: Request, res: Response) => {
  const user = req.user as IUser

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated")
  }

  const { oldPassword, newPassword } = validateType(ChangePasswordSchema, req.body)

  const [currentUser] = await db.select().from(users).where(eq(users.id, user.id)).limit(1)

  if (!currentUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found")
  }

  const isOldPasswordValid = await bcrypt.compare(oldPassword, currentUser.password)

  if (!isOldPasswordValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Current password is incorrect")
  }

  if (oldPassword === newPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "New password must be different from current password")
  }

  const hashedPassword = await bcrypt.hash(oldPassword, 10)

  await db.update(users).set({ password: hashedPassword }).where(eq(users.id, user.id))

  logger.info(`password changed for user id: ${user.id}`)

  return res.send(
    new ApiResponse({
      statusCode: httpStatus.OK,
      data: null,
      message: "Password changed successfully",
    }),
  )
}

export const logoutAllDevices = async (req: Request, res: Response) => {
  const user = req.user as IUser

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated")
  }

  await tokenService.deleteAllUserRefreshTokens(user.id)

  res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS)

  logger.info(`user ${user.id} logged out from all devices`)

  return res.send(
    new ApiResponse({
      statusCode: httpStatus.OK,
      data: null,
      message: "Logged out from all devices successfully",
    }),
  )
}
