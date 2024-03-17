import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./brand.validation.js";
import * as brandController from "./controller/brand.js"
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./brend.endPoint.js";



const brandRouter = Router()


brandRouter.get("/",
    brandController.getBrandList)

brandRouter.post("/create",
    auth(endpoint.create),
    validation(validators.createBrand),
    brandController.createBrand)

brandRouter.post("/:brandId/update",
    auth(endpoint.update),
    validation(validators.updateBrand),
    brandController.updateBrand)

brandRouter.delete("/:brandId/delete",
    auth(endpoint.delete),
    validation(validators.deleteBrand),
    brandController.deleteBrand);

export default brandRouter