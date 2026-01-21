import { eq } from "drizzle-orm"
import jwt from "jsonwebtoken"

import Config from "../config"
import { db } from "../drizzle/drizzle"
import { IUser, refreshTokens } from "../drizzle/schema"

interface TokenPayload {
  id: number
  email: string
}

export const generateAccessToken = (user: IUser): string => {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
  }

  return jwt.sign(payload, Config.JWT_SECRET, {
    expiresIn: "15m",
  })
}

export const generateRefreshToken = (user: IUser): string => {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
  }

  return jwt.sign(payload, Config.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  })
}

export const storeRefreshToken = async (userId: number, token: string): Promise<void> => {
  await db.insert(refreshTokens).values({
    userId,
    token,
  })
}

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, Config.REFRESH_TOKEN_SECRET) as TokenPayload
}

export const findRefreshToken = async (token: string) => {
  const [refreshToken] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token)).limit(1)

  return refreshToken
}

export const deleteRefreshToken = async (token: string): Promise<void> => {
  await db.delete(refreshTokens).where(eq(refreshTokens.token, token))
}

export const deleteAllUserRefreshTokens = async (userId: number): Promise<void> => {
  await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId))
}

export const cleanupExpiredTokens = async (): Promise<void> => {
  const now = new Date()
  await db.delete(refreshTokens).where(eq(refreshTokens.expiresAt, now))
}
