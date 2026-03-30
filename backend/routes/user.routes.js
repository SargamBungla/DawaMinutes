import express from "express"
import { getCurrentUser } from "../controllers/user.controllers.js"
import isAuth from "../middlewares/isAuth.js"

const userRouter = express.Router()

// isAuth middleware — pehle token check karega
// phir getCurrentUser chalega
userRouter.get("/current", isAuth, getCurrentUser)

export default userRouter