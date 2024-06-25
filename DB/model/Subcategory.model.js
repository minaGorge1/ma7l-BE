import mongoose, { Schema, model, Types } from "mongoose";

const subcategorySchema = new Schema({

    name: { type: String, required: true, lower: true },
    details: { type: Object },
    titleId: { type: Types.ObjectId, ref: "Title", required: true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    description: { type: String, default: "empty" },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
})
//mongoose.model.commentModel ||
const subcategoryModel = mongoose.models.Subcategory || model("Subcategory", subcategorySchema)
export default subcategoryModel

