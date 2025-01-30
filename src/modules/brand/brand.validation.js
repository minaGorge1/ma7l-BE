import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createBrand = joi.object({
    name: joi.string().min(2).max(50).required(),
    description: joi.string()
}).required()

export const updateBrand = joi.object({
    brandId: generalFields.id,
    name: joi.string().min(2).max(50),
    isDeleted: joi.boolean(),
    description: joi.string()
}).required()

export const deleteBrand = joi.object({
    brandId: generalFields.id,
}).required()