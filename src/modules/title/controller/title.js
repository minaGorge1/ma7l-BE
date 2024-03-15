import titleModel from "../../../../DB/model/Title.model.js";
import ApiFeatures from "../../../utils/apiFeatures.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const getTitleList = asyncHandler(async (req, res, next) => {
    const apiFeature =  new ApiFeatures(titleModel.find({ isDeleted: false }).populate([
        {
            path: "category",
        }
    ]), req.query).paginate().filter().sort().search().select()
    const title = await apiFeature.mongooseQuery

    return res.status(200).json({ message: "Done", title })
})

export const createTitle = asyncHandler(async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    if (await titleModel.findOne({ name })) {
        // return res.status(409).json({ message: `Duplicated title name ${name}` })
        return next(new Error(`Duplicated title name ${name}`, { cause: 409 }))
    }

    const title = await titleModel.create({
        name,
        createdBy: req.user._id
    })
    if (!title) {
        return next(new Error("fail to create  your title", { cause: 400 }))
    }
    return res.status(201).json({ message: "Done", title })
})

export const updateTitle = asyncHandler(async (req, res, next) => {
    const { titleId } = req.params
    const title = await titleModel.findById(titleId)
    if (!title) {
        return next(new Error("In-valid title id", { cause: 404 }))
    }
    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (req.body.name == title.name) {
            return next(new Error("Cannot update title with the same old name", { cause: 404 }))
        }
        if (await titleModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicated title name ${req.body.name}`, { cause: 404 }))
        }
        //req.body.slug = slugify(req.body.name, '_')
        title.name = req.body.name
    }
    if (req.body.titleId) {
        if (req.body.titleId == title.titleId) {
            return next(new Error("Cannot update title with the same old titleId", { cause: 404 }))
        }
        title.titleId = req.body.titleId
    }
    //await updateOne({ _id: titleId }, req.body)
    title.updatedBy = req.user._id
    await title.save()
    return res.status(200).json({ message: "Done", title })
})

export const deleteTitle = asyncHandler(async (req, res, next) => {

    const title = await titleModel.findById(req.params.titleId)
    if (!title || title.isDeleted == true) {
        return next(new Error(`In-valid ID`, { case: 404 }))
    }
    title.isDeleted = true
    await title.save()
    return res.status(201).json({ message: "Done", title })
})