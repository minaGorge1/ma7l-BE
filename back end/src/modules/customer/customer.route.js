import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { endpoint } from "./customer.endPoint.js";
import * as customerController from "./controller/customer.js";
import * as validators from "./customer.validation.js";
const customerRouter = Router()

customerRouter.get("/test", customerController.test)

//get customer
customerRouter.get("/",
customerController.customerProfiles)


//create customer
customerRouter.post("/create",
    auth(endpoint.create),
    validation(validators.createCustomer),
    customerController.createCustomer)

//update customer
customerRouter.post("/:customerId/update",
    auth(endpoint.update),
    validation(validators.updateCustomer),
    customerController.updateCustomer)

//delete customer
customerRouter.delete("/:customerId/delete",
    auth(endpoint.delete),
    validation(validators.deleteCustomer),
    customerController.deleteCustomer)

export default customerRouter