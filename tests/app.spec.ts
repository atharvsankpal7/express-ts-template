import { describe, expect, test } from "@jest/globals"
import request from "supertest"

import app from "../src/app"
import { db } from "../src/drizzle/drizzle"

describe("app", () => {
  test("app health", async () => {
    await request(app).get("/health").send().expect(200)
  })
  test("non-matching routes", async () => {
    const response = await request(app).get("/this-route-does-not-exist").send()
    expect(response.statusCode).toBe(404)
  })
})

describe("db", () => {
  test("db connection", async () => {
    const oneFromSelectQuery = await db.execute("select 1 as ok")
    expect(oneFromSelectQuery.rows[0].ok).toBe(1)
  })

  test("db has read permission", async () => {
    await db.execute("select * from users limit 1")
  })

  test("db has write permission", async () => {
    await db.execute(`
      insert into users (full_name, email, password)
      values ('test user', 'dbinsertion@test.com', 'hashed')
    `)
    const result = await db.execute(`select email from users where email = 'dbinsertion@test.com'`)

    expect(result.rows.length).toBe(1)
  })
})
