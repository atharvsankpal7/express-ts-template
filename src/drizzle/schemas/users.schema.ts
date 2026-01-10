import bcrypt from "bcrypt"
import { integer, pgEnum, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum("user_role_enum", ["customer", "manager", "admin"])

export const users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    userRole: userRoleEnum("user_role").notNull().default("customer"),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
)
export type IUser = typeof users.$inferSelect

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}
export type IUserInsert = typeof users.$inferInsert
