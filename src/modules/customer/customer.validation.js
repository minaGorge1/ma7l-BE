import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const createCustomer = joi.object({
    name: joi.string().max(20).required(),
    phone: joi.array().items(joi.number().required()),
    address: joi.string(),
    money: joi.number(),
    description: joi.string(),
    status: joi.string().valid('صافي', 'ليه فلوس', 'عليه فلوس').default('صافي'),
})


// Define the Joi schema for updating a customer
export const updateCustomer = joi.object({
    customerId: generalFields.id.required(),
    name: joi.string().max(20).optional(),
    phone: joi.string().optional(),
    address: joi.string().optional(),
    description: joi.string().optional(),
    status: joi.string().optional(),
    money: joi.number().optional(),
    isDeleted: joi.boolean().optional()
});


export const deleteCustomer = joi.object({
    customerId: generalFields.id.required()
})

export const createCustomerTransactions = joi.object({
    customerId: generalFields.id.required(),
    amount: joi.number().positive().required(),
    type: joi.string().valid("تحويل", "كاش").required(), // "Transfer" or "Cash"
    description: joi.string().optional(),
    clarification: joi.string().valid('دفع', 'دين').required() // "Payment" or "Debt"
})

export const updateCustomerTransactions = joi.object({
    customerId: generalFields.id.required(),
    transactionId: generalFields.id.required(),
    amount: joi.number().positive().optional(), // Make it optional if you don't want to require it
    type: joi.string().valid("تحويل", "كاش").optional(), // "Transfer" or "Cash"
    description: joi.string().optional(),
    clarification: joi.string().valid('دفع', 'دين').optional() // "Payment" or "Debt"
})

export const deleteCustomerTransactions = joi.object({
    customerId: generalFields.id.required(),
    transactionId: generalFields.id.required()
})


