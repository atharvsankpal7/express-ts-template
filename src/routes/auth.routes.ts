import express from "express"

import { AuthController } from "../controllers/auth.controller"

const auth = express.Router()
const authController = new AuthController()
auth.post("/register", (req, res) => {
  authController.register(req, res)
})

export default auth
