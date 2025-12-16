import { config } from "dotenv"

config()

const { PORT, NODE_ENV } = process.env
const Config = {
  PORT,
  isDev: NODE_ENV === "development",
}

Object.freeze(Config)

export default Config
