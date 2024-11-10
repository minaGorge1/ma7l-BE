import brandModel from "../../../../DB/model/Brand.model.js"
import subcategoryModel from "../../../../DB/model/Subcategory.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import { nanoid } from "nanoid"
import productModel from "../../../../DB/model/Product.model.js"
import userModel from "../../../../DB/model/User.model.js"
import { paginate } from "../../../utils/paginate.js"
import ApiFeatures from "../../../utils/apiFeatures.js"

export const getProducts = asyncHandler(async (req, res, next) => {

    const apiFeature = new ApiFeatures(productModel.find(/* { isDeleted: false } */)/* .populate([
        {
            path: "subcategoryId"
        }
    ]) */, req.query).paginate().filter().sort().search().select()
    const product = await apiFeature.mongooseQuery



    return res.status(200).json({ message: "Done", product })

    /*  const apiFeature = new ApiFeatures(productModel.find(), req.query).paginate().filter().sort().search().select()
     const productList = await apiFeature.mongooseQuery
 
     return res.json({ message: "Done", productList }) */
})

/* export const getProducts = asyncHandler(async (req, res, next) => {

    const apiFeature = await productModel.find({ name: "22 x13" })
    const inch = apiFeature[0].name.split(" ")
    console.log(inch[0]);

    return res.json({ message: "Done" })
}) */

export const createProduct = asyncHandler(async (req, res, next) => {
    const {
        name,
        details,
        stock,
        realPrice,
        price,
        description,
        titleId,
        categoryId,
        subcategoryId,
        brandId,
        place
    } = req.body;

    if (await productModel.findOne({ name: name })) {
        return next(new Error("duplicated name", { cause: 400 }))
    }

    // check ids
    if (!await subcategoryModel.findOne({ _id: subcategoryId, categoryId, titleId })) {
        return next(new Error("In-valid category or subcategory or title ids", { cause: 400 }))
    }
    if (!await brandModel.findById(brandId)) {
        return next(new Error("In-valid brand Id", { cause: 400 }))
    }
    req.body.customId = nanoid()

    req.body.createdBy = req.user._id
    const product = await productModel.create(req.body)
    return res.status(201).json({ message: "Done", product })
})

export const updateProduct = asyncHandler(async (req, res, next) => {

    const { productId } = req.params;
    const product = await productModel.findById(productId)
    if (!product) {
        return next(new Error("In-valid product id ", { cause: 404 }))
    }
    const { name, price, titleId, categoryId, subcategoryId, brandId } = req.body;

    // check ids
    /* if (categoryId && subcategoryId && titleId) {
        if (!await subcategoryModel.findOne({ _id: subcategoryId, categoryId , titleId})) {
            return next(new Error("In-valid category or subcategory or title ids", { cause: 400 }))
        }
    } */
    if (brandId) {
        if (!await brandModel.findById(brandId)) {
            return next(new Error("In-valid brand Id", { cause: 400 }))
        }
    }

    req.body.updatedBy = req.user._id
    await productModel.updateOne({ _id: productId }, req.body)
    return res.status(201).json({ message: "Done" })
})

export const deleteProduct = asyncHandler(async (req, res, next) => {

    const product = await productModel.findById(req.params.productId)
    if (!product || product.isDeleted == true) {
        return next(new Error(`In-valid ID`, { case: 404 }))
    }
    product.isDeleted = true
    await product.save()
    return res.status(201).json({ message: "Done", product })
})