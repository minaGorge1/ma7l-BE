import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./subcategory.validation.js";
import * as subcategoryController from "./controller/subcategory.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./subcategory.endPoint.js";

const subcategoryRouter = Router(/* { mergeParams: true } */)

subcategoryRouter.get("/",
    subcategoryController.getSubcategoryList)

subcategoryRouter.post("/create/c/:categoryId",
    auth(endpoint.create),
    validation(validators.createSubcategory),
    subcategoryController.createSubcategory)

subcategoryRouter.post("/:subcategoryId/update",
    auth(endpoint.update),
    validation(validators.updateSubcategory),
    subcategoryController.updateSubcategory)

subcategoryRouter.delete("/:subcategoryId/delete",
    auth(endpoint.delete),
    validation(validators.deleteSubcategory),
    subcategoryController.deleteSubcategory);

export default subcategoryRouter