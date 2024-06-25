import mongoose, { Schema, model, Types } from "mongoose";

const categorySchema = new Schema({

    name: { type: String, required: true, trim: true, lower: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    description: { type: String, default: "empty" },
    isDeleted: { type: Boolean, default: false },
    titleId: { type: Types.ObjectId, ref: "Title", required: true },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
})

categorySchema.virtual("subcategory", {
    localField: "_id",
    foreignField: "categoryId",
    ref: "Subcategory"
})

const categoryModel = mongoose.models.Category || model("Category", categorySchema)
export default categoryModel

