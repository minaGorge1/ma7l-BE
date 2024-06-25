import mongoose, { Schema, model, Types } from "mongoose";

const titleSchema = new Schema({

    name: { type: String, required: true, unique: true, trim: true, lower: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    description: { type: String, default: "empty" },
    isDeleted: { type: Boolean, default: false }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
})

titleSchema.virtual("category", {
    localField: "_id",
    foreignField: "titleId",
    ref: "Category"
})

const titleModel = mongoose.models.Title || model("Title", titleSchema)
export default titleModel

