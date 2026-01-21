import { sql } from "drizzle-orm"
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"

import { users } from "./users.schema"

export const refreshTokens = pgTable("refresh_tokens", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar({ length: 255 }).notNull(),
  expiresAt: timestamp("expires_at")
    .notNull()
    .default(sql`NOW() + INTERVAL '7 days'`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type IRefreshToken = typeof refreshTokens.$inferSelect
export type IRefreshTokenInsert = typeof refreshTokens.$inferInsert
