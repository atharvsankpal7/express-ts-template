import express from "express"

import auth from "./auth.routes"

const routers = express.Router()

routers.use("/auth", auth)

export default routers
