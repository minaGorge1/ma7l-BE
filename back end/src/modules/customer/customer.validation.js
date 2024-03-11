import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const createCustomer = joi.object({
    name: joi.string().max(20).required(),
    phone: joi.string().required(),
    address: joi.string(),
    description: joi.string(),
    status: joi.string(),
})


export const updateCustomer = joi.object({
    customerId: generalFields.id.required(),
    name: joi.string().max(20),
    phone: joi.string(),
    address: joi.string(),
    description: joi.string(),
    status: joi.string(),
})


export const deleteCustomer = joi.object({
    customerId: generalFields.id.required()
})


