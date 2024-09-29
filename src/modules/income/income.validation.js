import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createIncome = joi.object({
    date: joi.string().min(2).max(50).required()
}).required()

export const updateIncome = joi.object({
    incomeId: generalFields.id,
    expenses: joi.array().items(joi.object({
        nameE: joi.string().min(2).max(50).required(),
        monyE: joi.number().positive().integer().min(1).required(),
        descriptionE: joi.string().min(2).max(500),
        isDeleted: joi.boolean()
    }).required()),
    isDeleted: joi.boolean(),
    monyCheck: joi.number().positive().integer().min(1).required(),
    description: joi.string().min(2).max(500),
    isDeleted: joi.boolean()
}).required()

/* export const deleteIncome = joi.object({
    incomeId: generalFields.id,
}).required() */