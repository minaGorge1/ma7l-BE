import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createSubcategory = joi.object({
    categoryId: generalFields.id,
    titleId: generalFields.id,
    name:joi.string().min(2).max(50).required(),
    details: joi.object()
}).required()

export const updateSubcategory = joi.object({
    categoryId: generalFields.id,
    subcategoryId: generalFields.id,
    name:joi.string().min(2).max(50),
    details: joi.object()
}).required()

export const deleteSubcategory = joi.object({
    subcategoryId: generalFields.id,
    /* createdBy: generalFields.id, */
}).required()