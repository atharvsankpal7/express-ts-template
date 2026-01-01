import { describe, expect } from "@jest/globals"
import { and, eq } from "drizzle-orm"
import request from "supertest"

import app from "../src/app"
import { db } from "../src/drizzle/drizzle"
import { users } from "../src/drizzle/schema"
import { truncateAllTables } from "./utils"
describe("POST /auth/register", () => {
  // Database Truncate
  beforeEach(async () => {
    await truncateAllTables()
  })

  describe("given all valid fields", () => {
    const userData = {
      fullName: "test user",
      email: "test@email.com",
      password: "testP@ssw0rd",
    }
    const registerUser = async () => {
      const response = await request(app).post("/auth/register").send(userData)
      return response
    }

    it("should return 201", async () => {
      const response = await registerUser()
      expect(response.statusCode).toBe(201)
    })

    it("should return json", async () => {
      const response = await registerUser()
      expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"))
    })

    it("should insert user in db", async () => {
      const dbUser = await db
        .select()
        .from(users)
        .where(and(eq(users.email, userData.email), eq(users.fullName, userData.fullName)))
      expect(dbUser).not.toBeNull()
    })
  })

  describe("given missing fields", () => {
    it("should return 400 when fullName is missing", async () => {
      const userData = {
        email: "test@email.com",
        password: "testP@ssw0rd",
      }
      const response = await request(app).post("/auth/register").send(userData)
      expect(response.statusCode).toBe(400)
    })

    it("should return 400 when email is missing", async () => {
      const userData = {
        fullName: "test user",
        password: "testP@ssw0rd",
      }
      const response = await request(app).post("/auth/register").send(userData)
      expect(response.statusCode).toBe(400)
    })

    it("should return 400 when password is missing", async () => {
      const userData = {
        fullName: "test user",
        email: "test@email.com",
      }
      const response = await request(app).post("/auth/register").send(userData)
      expect(response.statusCode).toBe(400)
    })
  })

  describe("given invalid email format", () => {
    it("should return 400 when email is invalid", async () => {
      const userData = {
        fullName: "test user",
        email: "invalid-email",
        password: "testP@ssw0rd",
      }
      const response = await request(app).post("/auth/register").send(userData)
      expect(response.statusCode).toBe(400)
    })
  })
})
