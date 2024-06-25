import mongoose, { Schema, model, Types } from "mongoose";

const productSchema = new Schema({
    customId: { type: String, required: true, },
    name: { type: String, required: true, trim: true, lower: true },
    description: { type: String, default: "empty" },
    details: { type: Object },
    stock: { type: Number, required: true, default: 1 },

    type: { type: String },

    realPrice: { type: Number, required: true, default: 1 },
    finalPrice: { type: Number, required: true, default: 1 },

    titleId: { type: Types.ObjectId, ref: "Title", required: true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    subcategoryId: { type: Types.ObjectId, ref: "Subcategory", required: true },
    brandId: { type: Types.ObjectId, ref: "Brand", required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})



const productModel = mongoose.models.Product || model("Product", productSchema)
export default productModel

