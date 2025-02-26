import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createIncome = joi.object({
    date: joi.string().min(2).max(50).required()
}).required()

export const updateIncome = joi.object({
    incomeId: generalFields.id,
    expenses: joi.array().items(joi.object({
        _id: generalFields.id,
        nameE: joi.string().min(2).max(50),
        monyE: joi.number().positive().integer().min(1),
        descriptionE: joi.string().max(500),
        isDeleted: joi.boolean()
    })),
    isDeleted: joi.boolean(),
    monyCheck: joi.number().positive().integer(),
    description: joi.string().max(500),
    isDeleted: joi.boolean()
}).required()

/* export const deleteIncome = joi.object({
    incomeId: generalFields.id,
}).required() */