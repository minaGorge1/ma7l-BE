import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./income.validation.js";
import * as incomeController from "./controller/income.js"
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./income.endPoint.js";



const incomeRouter = Router()


incomeRouter.get("/",
    incomeController.getIncomeList)

incomeRouter.post("/create",
    auth(endpoint.create),
    validation(validators.createIncome),
    incomeController.createIncome)

incomeRouter.post("/:incomeId/update",
    auth(endpoint.update),
    validation(validators.updateIncome),
    incomeController.updateIncome)

/* incomeRouter.delete("/:incomeId/delete",
    auth(endpoint.delete),
    validation(validators.deleteIncome),
    incomeController.deleteIncome); */

export default incomeRouter