import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const createCustomer = joi.object({
    name: joi.string().max(20).required(),
    phone: joi.array().items(joi.number().required()),
    address: joi.string(),
    mony: joi.number(),
    description: joi.string(),
    status: joi.string().valid('صافي', 'ليه فلوس', 'عليه فلوس').default('صافي'),
})


export const updateCustomer = joi.object({
    customerId: generalFields.id.required(),
    name: joi.string().max(20),
    phone: joi.string(),
    address: joi.string(),
    description: joi.string(),
    status: joi.string(),
    mony: joi.number(),
    isDeleted: joi.boolean()
})


export const deleteCustomer = joi.object({
    customerId: generalFields.id.required()
})


