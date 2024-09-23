import incomeModel from "../../../../DB/model/Income.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import ApiFeatures from "../../../utils/apiFeatures.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const getIncomeList = asyncHandler(async (req, res, next) => {
    const apiFeature = new ApiFeatures(incomeModel.find(/* { isDeleted: false } */), req.query).paginate().filter().sort().search().select()
    const income = await apiFeature.mongooseQuery

    return res.status(200).json({ message: "Done", income })

})

/* date: { type: String, required: true },
    description: { type: String, default: "empty" },
    mony: { type: Number, required: true },
    profDay: { type: Number, required: true },
    expenses: [{
        nameE: { type: String, required: true },
        monyE: { type: Number, required: true },
        descriptionE: { type: String, default: "empty" },
    }],
    monyCheck: { type: Number, required: true },
    updatedBy: { type: Types.ObjectId, ref: "User" }, */

export const createIncome = asyncHandler(async (req, res, next) => {
    const { date, description, mony, profDay } = req.body;
    if (await incomeModel.findOne({ date })) {
        return next(new Error(`Duplicated income name ${name}`, { cause: 409 }))
    }
    const orders = orderModel.find(date)

    orders.map(order =>
        mony += order.paid
    profDay += order.profitMargin
    );

    const income = await incomeModel.create({
        name
    })
    if (!income) {
        return next(new Error("fail to create  your income", { cause: 400 }))
    }
    return res.status(201).json({ message: "Done", income })
})


export const updateIncome = asyncHandler(async (req, res, next) => {
    const { incomeId } = req.params
    const income = await incomeModel.findById(incomeId)

    if (!income) {
        return next(new Error("In-valid income id", { cause: 404 }))
    }
    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (req.body.name == income.name) {
            return next(new Error("Cannot update income with the same old name", { cause: 404 }))
        }
        if (await incomeModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicated income name ${req.body.name}`, { cause: 404 }))
        }
        income.name = req.body.name
    }
    income.updatedBy = req.user._id
    income.isDeleted = req.body.isDeleted
    await income.save()
    return res.status(200).json({ message: "Done", income })
})

/* export const deleteIncome = asyncHandler(async (req, res, next) => {

    const income = await incomeModel.findById(req.params.incomeId)
    if (!income || income.isDeleted == true) {
        return next(new Error(`In-valid ID`, { case: 404 }))
    }
    income.isDeleted = true
    await income.save()
    return res.status(201).json({ message: "Done", income })
}) */