import express from "express"
import authRoutes from "./routes/auth.route"
import messageRoutes from "./routes/message.route"
import cookieParser from "cookie-parser"

import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = 4000 // Define your port

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
