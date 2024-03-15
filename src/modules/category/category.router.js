import subcategoryRouter from "../subcategory/subcategory.router.js";
import * as categoryController from "./controller/category.js";
import * as validators from "./category.validation.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./category.endPoint.js";
import { Router } from "express";


const categoryRouter = Router(/* { mergeParams: true } */)

/* categoryRouter.use("/:categoryId/subcategory", subcategoryRouter) */

categoryRouter.get("/",
    categoryController.getCategoryList)

categoryRouter.post("/create/t/:titleId",
    auth(endpoint.create),
    validation(validators.createCategory),
    categoryController.createCategory)

categoryRouter.post("/:categoryId/update",
    auth(endpoint.update),
    validation(validators.updateCategory),
    categoryController.updateCategory)

categoryRouter.delete("/:categoryId/delete",
    auth(endpoint.delete),
    validation(validators.deleteCategory),
    categoryController.deleteCategory);

export default categoryRouter