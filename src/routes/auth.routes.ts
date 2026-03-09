import { Request, Response, Router } from "express"
import passport from "passport"

import * as authController from "../controllers/auth.controller"
import { validateType } from "../utils/zodValidator"
import { LoginBody, RegisterBodySchema } from "../validationSchemas/auth.zod"

const router = Router()

router.post("/register", async (req: Request, res: Response) => {
  const { fullName, email, password } = validateType(RegisterBodySchema, req.body)

  const createdUser = await authController.registerUser({ fullName, email, password })

  await authController.setTokensAndRespond(createdUser, res)
})

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = validateType(LoginBody, req.body)

  const user = await authController.loginUser({ email, password })

  await authController.setTokensAndRespond(user, res)
})

router.post("/refresh", authController.refreshAccessToken)

// router.post("/logout", authController.logoutUser)

router.use(passport.authenticate("jwt", { session: false }))
router.patch("/profile", authController.updateProfile)
router.post("/change-password", authController.changePassword)
router.post("/logout-all", authController.logoutAllDevices)

router.get("/me", (req: Request, res: Response) => {
  const user = req.user
  res.json({ success: true, data: user })
})

export default router
