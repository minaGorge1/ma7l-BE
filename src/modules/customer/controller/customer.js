import customerModel from "../../../../DB/model/Customer.model.js";
import ApiFeatures from "../../../utils/apiFeatures.js";
import { asyncHandler } from "../../../utils/errorHandling.js";



export const test = (req, res, next) => {
    return res.json({ message: "hi" })
}

//get customer
export const customerProfiles = asyncHandler(async (req, res, next) => {

    const apiFeature = new ApiFeatures(customerModel.find({ isDeleted: false }), req.query).paginate().filter().sort().search().select()
    const customer = await apiFeature.mongooseQuery

    return res.status(200).json({ message: "Done", customer })
})




//create customer
export const createCustomer = asyncHandler(async (req, res, next) => {
    const { name, phone, address, description, status } = req.body
    if (await customerModel.findOne({ name })) {
        return next(new Error("Duplicated Name", { cause: 404 }))
    }

    if (req.body.mony && (!req.body.status || req.body.status === 'صافي')) {
        return next(new Error(`Error: Error can't be صافي when fined mony`, { status: 409 }));
    }

    if (req.body.mony == 0 && (!req.body.status || req.body.status === "عليه فلوس" || req.body.status === 'ليه فلوس')) {
        return next(new Error(`Error: Error can't be عليه فلوس or ليه فلوس when not fined mony`, { status: 409 }));
    }

    const customer = await customerModel.create(req.body)
    return res.json({ message: "Done", customer });
})

//update customer
export const updateCustomer = asyncHandler(async (req, res, next) => {
    const { name, phone, address, description, status } = req.body
    const { customerId } = req.params
    const customer = await customerModel.findByIdAndUpdate(customerId, req.body, { new: true })
    return res.json({ message: "Done", customer });
})

//delete customer
export const deleteCustomer = asyncHandler(async (req, res, next) => {
    const { customerId } = req.params
    const customer = await customerModel.findByIdAndUpdate(customerId, { isDeleted: true }, { new: true })
    return res.json({ message: "Done", customer });
})


