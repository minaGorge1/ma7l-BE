import categoryModel from "../../../../DB/model/Category.model.js";
import titleModel from "../../../../DB/model/Title.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import ApiFeatures from "../../../utils/apiFeatures.js"

export const getCategoryList = asyncHandler(async (req, res, next) => {
    const apiFeature = new ApiFeatures(categoryModel.find(/* { isDeleted: false } */).populate([
        {
            path: "subcategory"
        }
    ]) , req.query).paginate().filter().sort().search().select()
    const category = await apiFeature.mongooseQuery



    return res.status(200).json({ message: "Done", category })

})

export const createCategory = asyncHandler(async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    const { titleId } = req.params
    const title = await titleModel.findById(titleId)
    if (!title) {
        return next(new Error("In-valid titleId", { cause: 400 }))
    }
    if (await categoryModel.findOne({ name: name, titleId: titleId })) {
        return next(new Error(`Duplicated category name ${name}`, { cause: 409 }))
    }

    const category = await categoryModel.create({
        name,
        titleId,
        createdBy: req.user._id
    })
    if (!category) {
        return next(new Error("fail to create  your category", { cause: 400 }))
    }
    return res.status(201).json({ message: "Done", category })
})

export const updateCategory = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params
    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return next(new Error("In-valid category id", { cause: 404 }))
    }
    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (req.body.name == category.name) {
            return next(new Error("Cannot update category with the same old name", { cause: 404 }))
        }
        if (await categoryModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicated category name ${req.body.name}`, { cause: 404 }))
        }
        //req.body.slug = slugify(req.body.name, '_')
        category.name = req.body.name
    }
    if (req.body.titleId) {
        if (req.body.titleId == category.titleId) {
            return next(new Error("Cannot update category with the same old titleId", { cause: 404 }))
        }
        category.titleId = req.body.titleId
    }
    category.updatedBy = req.user._id
    category.isDeleted = req.body.isDeleted
    await category.save()
    return res.status(200).json({ message: "Done", category })
})

export const deleteCategory = asyncHandler(async (req, res, next) => {

    const category = await categoryModel.findById(req.params.categoryId)
    if (!category || category.isDeleted == true) {
        return next(new Error(`In-valid ID`, { case: 404 }))
    }
    category.isDeleted = true
    await category.save()
    return res.status(201).json({ message: "Done", category })
})