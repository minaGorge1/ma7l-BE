import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

export const signUpSchema = joi.object({
    userName: joi.string().max(20).required().alphanum(),
    /* address: joi.string(),
    gender: joi.string().valid('male', 'female'),
    phone: joi.string().pattern(new RegExp(/^01[0125][0-9]{8}$/)).required(),
     */
    password: joi.string().required(),
    cPassword: generalFields.cPassword.valid(joi.ref('password'))
}).required()



export const logInSchema = joi.object({
    userName: joi.string().max(20).required().alphanum(),
    password: joi.string().required(),
}).required()

export const token = joi.object({
    token: joi.string().required()
}).required()


