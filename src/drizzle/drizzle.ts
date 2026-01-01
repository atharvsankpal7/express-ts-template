import { drizzle } from "drizzle-orm/node-postgres"

import Config from "../config"

// You can specify any property from the node-postgres connection options
export const db = drizzle({
  connection: {
    connectionString: Config.DB_URI,
    ssl: Config.DB_SSL,
  },
})
