import { describe, expect, test } from "@jest/globals"
import request from "supertest"

import app from "../app"

describe("app", () => {
  test("app health", async () => {
    await request(app).get("/health").send().expect(200)
  })
  test("non-matching routes", async () => {
    const response = await request(app).get("/this-route-does-not-exist").send()
    expect(response.statusCode).toBe(404)
  })
})
