import { sql } from "drizzle-orm"

import { db } from "../../src/drizzle/drizzle"

export async function truncateAllTables() {
  const query = sql`
    DO $$ DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END $$;
  `
  await db.execute(query)
}
