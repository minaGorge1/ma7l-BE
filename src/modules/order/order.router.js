import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./order.validation.js";
import * as orderController from "./controller/order.js"
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./order.endPoint.js";




const orderRouter = Router()

//get
orderRouter.get("/", orderController.getOrders)

//create
orderRouter.post('/create',
    auth(endpoint.create),
    orderController.createOrder)

//update
orderRouter.put("/:orderId/update",
    auth(endpoint.update),
    validation(validators.updateOrder),
    orderController.updateOrder)

//cancel
orderRouter.patch('/cancel/:orderId',
    auth(endpoint.cancel),
    validation(validators.cancelOrder),
    orderController.cancelOrder)


export default orderRouter