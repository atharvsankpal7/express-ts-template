import express from "express"

const app = express()

app.get("/api", (req, res) => {
  res.send("hello world")
})

export default app
