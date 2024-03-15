import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const headers = joi.object({
    authorization :joi.string().required(),
}).required()


export const createTitle = joi.object({
    name:joi.string().min(2).max(50).required(),
    }).required()

export const updateTitle = joi.object({
    titleId: generalFields.id,
    name:joi.string().min(2).max(50),
}).required()

export const deleteTitle = joi.object({
    titleId: generalFields.id,
    /* createdBy: generalFields.id, */
}).required()