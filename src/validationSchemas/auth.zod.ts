import { z } from "zod"

import { FULLNAME_REGEX, PASSWORD_REGEX } from "../utils/constants"

export const RegisterBodySchema = z.object({
  fullName: z.string().regex(FULLNAME_REGEX),
  email: z.email().min(3).max(254),
  password: z.string().regex(PASSWORD_REGEX),
})

export const LoginBody = z.object({
  email: z.email().min(3).max(254),
  password: z.string().regex(PASSWORD_REGEX),
})

export const UpdateProfileSchema = z
  .object({
    fullName: z.string().regex(FULLNAME_REGEX).optional(),
    email: z.email().min(3).max(254).optional(),
  })
  .refine((data) => data.fullName ?? data.email, {
    message: "At least one field (fullName or email) must be provided",
  })

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().regex(PASSWORD_REGEX),
})
