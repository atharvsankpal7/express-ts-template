import express from "express"

import { AuthController } from "../controllers/auth.controller"

const auth = express.Router()
const authController = new AuthController()
auth.post("/register", (req, res, next) => authController.register(req, res).catch(next))

export default auth
