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
