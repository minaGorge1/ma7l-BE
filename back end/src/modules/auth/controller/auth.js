import { customAlphabet } from "nanoid"
import userModel from "../../../../DB/model/User.model.js"
import sendEmail from "../../../utils/email.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import { createToken, verifyToken } from "../../../utils/generateAndVerifyToken.js"
import { compare, hash } from "../../../utils/hashAndCompare.js"



export const test = (req, res, next) => {
    return res.json({ message: "hi" })
}


//signUp
export const signUp = asyncHandler(async (req, res, next) => {
    //hashPassword
    req.body.password = hash({ plaintext: req.body.password, saltRound: parseInt(process.env.SALTROUND) })
    //save
    const user = await userModel.create(req.body)
    return res.status(201).json({ message: "Done", user })
})


//signIn
export const signIn = asyncHandler(async (req, res, next) => {

    const { userName, password } = req.body
    const user = await userModel.findOne({ userName })
    if (!user) {
        return next(new Error(" account not exist ", { cause: 404 }))
    }
    const match = compare({ plaintext: password, hashValue: user.password })
    if (!match) {
        return next(new Error("In-Valid password", { cause: 400 }))
    }
    const access_token = createToken({ payload: { id: user._id, role: user.role, userName: user.userName, email: user.email }, expiresIn: 30 * 60 })
    const refresh_token = createToken({ payload: { id: user._id, role: user.role, userName: user.userName, email: user.email }, expiresIn: 60 * 60 * 24 * 360 })
    user.status = "online"
    await user.save()
    return res.status(200).json({ message: "Done", access_token, refresh_token })
})

//logOut
export const logOut = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, { status: "offline" })
})
