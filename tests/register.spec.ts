import { describe, expect } from "@jest/globals"
import { eq } from "drizzle-orm"
import request from "supertest"

import app from "../src/app"
import { db } from "../src/drizzle/drizzle"
import { IUser, users } from "../src/drizzle/schema"
import { IRegisterResponse } from "../src/types/apiEndPointTypes/auth.types"
import { truncateAllTables } from "./utils"
import { TypedResponse } from "./utils/tests.types"
describe("POST /auth/register", () => {
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
      return response as TypedResponse<IRegisterResponse>
    }

    it("should return 201", async () => {
      const response = await registerUser()
      expect(response.statusCode).toBe(201)
    })

    it("should return json", async () => {
      const response = await registerUser()
      expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"))
    })

    it("should return id of created user", async () => {
      const response = await registerUser()
      expect(typeof response.body.data.id).toBe("number")
    })

    const registerAndGetUser = async () => {
      const response = await registerUser()
      const id = response.body.data.id

      const [dbUser] = (await db.select().from(users).where(eq(users.id, id))) as IUser[]

      return { response, dbUser }
    }

    it("creates a user", async () => {
      const { response, dbUser } = await registerAndGetUser()

      expect(response.status).toBe(201)
      expect(dbUser).toBeDefined()
    })

    it("hashes the password before saving", async () => {
      const { dbUser } = await registerAndGetUser()

      expect(dbUser.password).not.toBe(userData.password)
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
