import { describe, expect, test } from "@jest/globals"
import request from "supertest"

import app from "../app"
import { calculateDiscount } from "./appTestUtils"

describe("app", () => {
  test("discount", () => {
    expect(calculateDiscount(100, 10)).toBe(90)
  })
  test("app health", async () => {
    await request(app).get("/health").send().expect(200)
  })
  test("non-matching routes", async () => {
    const response = await request(app).get("/this-route-does-not-exist").send()
    expect(response.statusCode).toBe(404)
  })
})
