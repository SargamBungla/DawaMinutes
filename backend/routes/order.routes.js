import express from "express"
import { placeOrder, getMyOrders, getAllOrdersAdmin, getPendingOrders, acceptOrder, markDelivered, getAcceptedOrders, updateRiderLocation } from "../controllers/order.controllers.js"
import isAuth from "../middlewares/isAuth.js"

const orderRouter = express.Router()

orderRouter.post("/place", isAuth, placeOrder)
orderRouter.get("/my", isAuth, getMyOrders)
orderRouter.get("/admin/all", getAllOrdersAdmin)
orderRouter.get("/pending", isAuth, getPendingOrders)
orderRouter.get("/accepted", isAuth, getAcceptedOrders)
orderRouter.put("/accept", isAuth, acceptOrder)
orderRouter.put("/delivered", isAuth, markDelivered)
orderRouter.put("/rider-location", isAuth, updateRiderLocation)

export default orderRouter