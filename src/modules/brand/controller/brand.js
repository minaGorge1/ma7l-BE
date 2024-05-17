import brandModel from "../../../../DB/model/Brand.model.js";
import ApiFeatures from "../../../utils/apiFeatures.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const getBrandList = asyncHandler(async (req, res, next) => {
    const apiFeature = new ApiFeatures(brandModel.find(/* { isDeleted: false } */), req.query).paginate().filter().sort().search().select()
    const brand = await apiFeature.mongooseQuery

    return res.status(200).json({ message: "Done", brand })

})

export const createBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    if (await brandModel.findOne({ name: name })) {
        return next(new Error(`Duplicated brand name ${name}`, { cause: 409 }))
    }
    const brand = await brandModel.create({
        name,
        createdBy: req.user._id
    })
    if (!brand) {
        return next(new Error("fail to create  your brand", { cause: 400 }))
    }
    return res.status(201).json({ message: "Done", brand })
})

export const updateBrand = asyncHandler(async (req, res, next) => {
    const { brandId } = req.params
    const brand = await brandModel.findById(brandId)

    if (!brand) {
        return next(new Error("In-valid brand id", { cause: 404 }))
    }
    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (req.body.name == brand.name) {
            return next(new Error("Cannot update brand with the same old name", { cause: 404 }))
        }
        if (await brandModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicated brand name ${req.body.name}`, { cause: 404 }))
        }
        brand.name = req.body.name
    }
    brand.updatedBy = req.user._id
    brand.isDeleted = req.body.isDeleted
    await brand.save()
    return res.status(200).json({ message: "Done", brand })
})

export const deleteBrand = asyncHandler(async (req, res, next) => {

    const brand = await brandModel.findById(req.params.brandId)
    if (!brand || brand.isDeleted == true) {
        return next(new Error(`In-valid ID`, { case: 404 }))
    }
    brand.isDeleted = true
    await brand.save()
    return res.status(201).json({ message: "Done", brand })
})