import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createIncome = joi.object({
    name:joi.string().min(2).max(50).required()
}).required()

export const updateIncome = joi.object({
    incomeId: generalFields.id,
    name:joi.string().min(2).max(50),
    isDeleted: joi.boolean()
}).required()

/* export const deleteIncome = joi.object({
    incomeId: generalFields.id,
}).required() */