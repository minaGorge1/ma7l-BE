import categoryRouter from "../category/category.router.js";
import * as titleController from "./controller/title.js";
import * as validators from "./title.validation.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./title.endPoint.js";
import { Router } from "express";


const titleRouter = Router()

/* titleRouter.use("/:titleId/category", categoryRouter) */

titleRouter.get("/",
    titleController.getTitleList)

titleRouter.post("/create",
    auth(endpoint.create),
    validation(validators.createTitle),
    titleController.createTitle)

titleRouter.post("/:titleId/update",
    auth(endpoint.update),
    validation(validators.updateTitle),
    titleController.updateTitle)

titleRouter.delete("/:titleId/delete",
    auth(endpoint.delete),
    validation(validators.deleteTitle),
    titleController.deleteTitle);

export default titleRouter