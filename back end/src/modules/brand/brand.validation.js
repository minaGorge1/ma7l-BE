import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createBrand = joi.object({
    name:joi.string().min(2).max(50).required(),
}).required()

export const updateBrand = joi.object({
    brandId: generalFields.id,
    name:joi.string().min(2).max(50),
}).required()

export const deleteBrand = joi.object({
    brandId: generalFields.id,
}).required()