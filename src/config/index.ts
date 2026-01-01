import { config } from "dotenv"
import path from "path"
config({ path: path.join(__dirname, `../../env.${process.env.ENVIRONMENT ?? ""}`) })

const { PORT, NODE_ENV, DB_URI, DB_SSL } = process.env
const Config = {
  PORT: PORT ?? 8081,
  isDev: NODE_ENV === "development",
  DB_URI: DB_URI ?? "postgresql://root:root@host.docker.internal:5432/auth",
  DB_SSL: DB_SSL === "true" ? true : false,
} as const // make read only

Object.freeze(Config)

export default Config
