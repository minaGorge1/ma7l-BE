import * as productController from "./controller/product.js"
import * as validators from "./product.validation.js";
import { validation } from "../../middleware/validation.js";
import { endpoint } from "./product.endPoint.js";
import { auth } from "../../middleware/auth.js";
import { Router } from "express";

const productRouter = Router()

productRouter.get("/", productController.getProducts)

productRouter.post("/create",
    auth(endpoint.create),
    validation(validators.createProduct),
    productController.createProduct)

productRouter.post("/:productId/update",
    auth(endpoint.update),
    validation(validators.updateProduct),
    productController.updateProduct)

productRouter.delete("/:productId/delete",
    auth(endpoint.delete),
    validation(validators.deleteProduct),
    productController.deleteProduct);

export default productRouter