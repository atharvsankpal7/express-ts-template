import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import Config from "../config"
import { logger } from "../config/logger"
import * as schema from "./schema"

// Create a connection pool for better connection management
const pool = new Pool({
  connectionString: Config.DB_URI,
  ssl: Config.DB_SSL ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

pool.on("error", (err) => {
  logger.error("Unexpected error on idle database client", { error: err })
})

export const db = drizzle({ client: pool, schema })

export const closeDbConnection = async (): Promise<void> => {
  try {
    await pool.end()
    logger.info("Database pool closed successfully")
  } catch (error) {
    logger.error("Error closing database pool", { error })
    throw error
  }
}
