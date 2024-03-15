import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

export const createOrder = joi.object({
    note: joi.string().min(2).max(5000),
    customerId: generalFields.id,
    paid: joi.number().positive(),
    status: joi.string().valid('انتظار', 'تم الدفع', 'رفض'),
    products: joi.array().items(joi.object({
        productId: generalFields.id,
        quantity: joi.number().positive().integer().min(1).required(),
        discount: joi.number().positive(),
        inchPrice: joi.number().positive()
    }).required()
    )
}).required()


export const cancelOrder = joi.object({
    orderId: generalFields.id.required(),
})

export const updateOrder = joi.object({
    orderId: generalFields.id.required(),
    note: joi.string().min(2).max(5000),
    customerId: generalFields.id,
    paid: joi.number().positive(),
    status: joi.string().valid('انتظار', 'تم الدفع', 'رفض'),
    products: joi.array().items(joi.object({
        productId: generalFields.id,
        quantity: joi.number().positive().integer().min(1),
        discount: joi.number().positive(),
        inchPrice: joi.number().positive()
    })
    )
})

