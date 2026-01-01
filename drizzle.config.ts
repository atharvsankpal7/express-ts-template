import "dotenv/config"
import { defineConfig } from "drizzle-kit"
import Config from "./src/config"

export default defineConfig({
  out: "./drizzle",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: Config.DB_URI,
  },
})
