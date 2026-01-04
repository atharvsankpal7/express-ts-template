import bcrypt from "bcrypt"
import { integer, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core"

export const users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    fullName: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
)
export type IUser = typeof users.$inferSelect

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}
export type IUserInsert = typeof users.$inferInsert
