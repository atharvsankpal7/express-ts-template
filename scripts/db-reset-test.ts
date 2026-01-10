import { execSync } from "child_process"
import { Client } from "pg"

import Config from "../src/config"
import { logger } from "../src/config/logger"

if (!Config.isTest) {
  logger.error("Test DB reset blocked in non test db, \nconfig" + JSON.stringify(Config))
  process.exit(1)
}

const TEST_DB_URL = Config.DB_URI
if (!TEST_DB_URL) {
  logger.error("DB_URI not set, please set it in env \nconfig" + JSON.stringify(Config))
  process.exit(1)
}

const url = new URL(TEST_DB_URL)
const testDbName = url.pathname.slice(1)

// connect to postgres system database
url.pathname = "/postgres"

const adminClient = new Client({
  connectionString: url.toString(),
})

const reset = async () => {
  await adminClient.connect()

  await adminClient.query(
    `
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = $1
      AND pid <> pg_backend_pid()
  `,
    [testDbName],
  )

  await adminClient.query(`DROP DATABASE IF EXISTS "${testDbName}"`)
  await adminClient.query(`CREATE DATABASE "${testDbName}"`)

  await adminClient.end()

  execSync("cross-env ENVIRONMENT=test pnpm drizzle-kit migrate", { stdio: "inherit" })
}

reset()
  .then()
  .catch((error) => {
    logger.error(error)
  })
