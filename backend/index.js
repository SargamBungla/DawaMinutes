import express from "express"
import dotenv from "dotenv"
dotenv.config()
import "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import orderRouter from "./routes/order.routes.js"
import cors from "cors"

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://dawa-minutes.vercel.app',
    'https://dawa-minutes-pscctl3zm-sargam-bungla.vercel.app'
  ],
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/orders", orderRouter)

app.listen(port, () => {
  console.log(`server started at ${port}`)
})