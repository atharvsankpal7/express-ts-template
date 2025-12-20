import request from "supertest"

import app from "../src/app"
describe("POST /auth/register", () => {
  // happy path
  describe("given all valid fields", () => {
    it("should return 201", async () => {
      const userData = {
        fullName: "test user",
        email: "test@email.com",
        password: "test_password",
      }
      const response = await request(app).post("/auth/register").send(userData)

      expect(response.statusCode).toBe(201)
    })
  })

  // sad path
})
