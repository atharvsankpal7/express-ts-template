import bcrypt from "bcrypt"
import { getTableColumns, sql } from "drizzle-orm"
import { integer, pgEnum, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum("user_role_enum", ["customer", "manager", "admin"])

export const users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    userRole: userRoleEnum("user_role").notNull().default("customer"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "string" })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
)
export type IUserLogin = typeof users.$inferSelect
export type IUser = Omit<IUserLogin, "password">
export type IUserInsert = typeof users.$inferInsert

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

export const { password, ...userWithoutPassword } = getTableColumns(users)
