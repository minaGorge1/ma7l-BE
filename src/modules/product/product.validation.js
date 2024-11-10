import joi from "joi"
import { generalFields } from "../../middleware/validation.js"


export const createProduct = joi.object({
    name: joi.string().min(2).max(50).required(),
    description: joi.string(),
    place: joi.string(),
    stock: joi.number().positive().integer().min(1).required(),
    finalPrice: joi.number().positive().min(1).required(),
    realPrice: joi.number().positive().min(1).required(),
    details: joi.object(),
    titleId: generalFields.id,
    categoryId: generalFields.id,
    brandId: generalFields.id,
    subcategoryId: generalFields.id,
}).required()


export const updateProduct = joi.object({
    place: joi.string(),
    isDeleted: joi.boolean(),
    name: joi.string().min(2).max(50),
    description: joi.string(),
    stock: joi.number().positive().integer().min(1),
    finalPrice: joi.number().positive().min(1),
    realPrice: joi.number().positive().min(1),
    details: joi.object(),
    titleId: generalFields.id,
    brandId: generalFields.id,
    categoryId: generalFields.id,
    subcategoryId: generalFields.id,
    productId: generalFields.id,
}).required()


export const deleteProduct = joi.object({
    productId: generalFields.id,
}).required()
