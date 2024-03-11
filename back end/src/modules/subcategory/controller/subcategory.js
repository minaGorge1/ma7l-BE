import categoryModel from "../../../../DB/model/Category.model.js";
import subcategoryModel from "../../../../DB/model/Subcategory.model.js";
import ApiFeatures from "../../../utils/apiFeatures.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const getSubcategoryList = asyncHandler(async (req, res, next) => {

    const apiFeature = new ApiFeatures(subcategoryModel.find({ isDeleted: false }).populate([
        {
            path: "categoryId",
            select: "name"
        }
    ]), req.query).paginate().filter().sort().search().select()
    const subcategory = await apiFeature.mongooseQuery

    return res.status(200).json({ message: "Done", subcategory  })
})

export const createSubcategory = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const { details } = req.body;
    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return next(new Error("In-vaild categoryId", { cause: 400 }))
    }
    const name = req.body.name.toLowerCase();
    if (await subcategoryModel.findOne({ name: name, categoryId: categoryId })) {
        return next(new Error("Duplicated subcategory", { cause: 400 }))
    }
    const subcategory = await subcategoryModel.create({
        details,
        titleId: category.titleId,
        name,
        categoryId,
        createdBy: req.user._id
    })
    if (!category) {
        return next(new Error("fail to create this subcategory", { cause: 400 }))
    }
    return res.status(201).json({ message: "Done", subcategory })
})


export const updateSubcategory = asyncHandler(async (req, res, next) => {
    const { /* categoryId, */ subcategoryId } = req.params
    const subcategory = await subcategoryModel.findOne({ _id: subcategoryId, /* categoryId */ })
    if (!subcategory) {
        return next(new Error("In-valid category id", { cause: 404 }))
    }
    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (req.body.name == subcategory.name) {
            return next(new Error("Cannot update subcategory with the same old name", { cause: 404 }))
        }
        if (await subcategoryModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicated subcategory name ${req.body.name}`, { cause: 404 }))
        }
        subcategory.name = req.body.name
    }
    subcategory.updatedBy = req.user._id
    subcategory.details = req.body.details
    await subcategory.save()
    return res.status(200).json({ message: "Done", subcategory })
})

export const deleteSubcategory = asyncHandler(async (req, res, next) => {

    const subcategory = await subcategoryModel.findById(req.params.subcategoryId)
    if (!subcategory || subcategory.isDeleted == true) {
        return next(new Error(`In-valid ID`, { case: 404 }))
    }
    subcategory.isDeleted = true
    await subcategory.save()
    return res.status(201).json({ message: "Done", subcategory })
})