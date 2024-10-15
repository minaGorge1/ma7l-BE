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
    (description): { type: String, default: "empty" },
    mony: { type: Number, required: true },
    profDay: { type: Number, required: true },
    (expenses): [{
        nameE: { type: String, required: true },
        monyE: { type: Number, required: true },
        descriptionE: { type: String, default: "empty" },
        isDeleted: { type: Boolean, default: false }
    }],
    (monyCheck): { type: Number, required: true },
    updatedBy: { type: Types.ObjectId, ref: "User" }, */

export const createIncome = asyncHandler(async (req, res, next) => {
    const { date, mony, profDay } = req.body;


    // check orders
    const orders = await orderModel.find({ date: date, isDeleted: false })

    if (!orders || orders.length === 0) {
        return next(new Error(`orders not found date : ${date}`, { cause: 409 }))
    }

    let totalMony = 0;
    let totalProfDay = 0;

    orders.forEach(order => {
        totalMony += order.paid;
        totalProfDay += order.profitMargin;
    });

    let income;

    // same day
    const sameDay = await incomeModel.findOne({ date: date })

    if (sameDay) {
        income = await incomeModel.findByIdAndUpdate(sameDay._id, { ...req.body, mony: totalMony, profDay: totalProfDay }, { new: true });
    } else {
        // new day
        income = await incomeModel.create({ ...req.body, mony: totalMony, profDay: totalProfDay });
    }

    if (!income) {
        return next(new Error("fail to create your income", { cause: 400 }))
    }

    return res.status(201).json({ message: "Done", income })
})


export const updateIncome = asyncHandler(async (req, res, next) => {
    const { incomeId } = req.params
    const { expenses, monyCheck, description } = req.body
    const income = await incomeModel.findById(incomeId)
    if (!income) {
        return next(new Error("In-valid income id", { cause: 404 }))
    }


    if (expenses) {
        expenses.map((expense) => {
            if (expense._id) {
                const oldExpense = income.expenses.find((e) => e._id.toString() === expense._id.toString())
                if (oldExpense) {
                    oldExpense.nameE = expense?.nameE || oldExpense.nameE
                    oldExpense.monyE = expense?.monyE || oldExpense.monyE
                    oldExpense.descriptionE = expense?.descriptionE || oldExpense.descriptionE
                    oldExpense.isDeleted = expense?.isDeleted || oldExpense.isDeleted
                    
                } else {
                    return next(new Error("In-valid expense id", { cause: 404 }))
                }

            } else {
                const filteredExpenses = expenses.filter((expense) => !expense.isDeleted);
                income.expenses = [...income.expenses, ...filteredExpenses];
            }
        })

    }

    income.description = description
    income.monyCheck = monyCheck
    income.updatedBy = req.user._id
    /* income.isDeleted = isDeleted */
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