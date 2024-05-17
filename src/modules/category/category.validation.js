import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const headers = joi.object({
    authorization: joi.string().required(),
}).required()


export const createCategory = joi.object({
    name: joi.string().min(2).max(50).required(),
    titleId: generalFields.id,
}).required()

export const updateCategory = joi.object({
    titleId: generalFields.id,
    categoryId: generalFields.id,
    name: joi.string().min(2).max(50),
    isDeleted: joi.boolean()
}).required()

export const deleteCategory = joi.object({
    categoryId: generalFields.id,
}).required()