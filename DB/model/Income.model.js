import mongoose, { Schema, model, Types } from "mongoose";

const incomeSchema = new Schema({
    //date aldorgabl  profDay  array(massssarifff :  al floos ) aldorgb3d

    date: { type: String, required: true },
    description: { type: String, default: "empty" },
    mony: { type: Number, required: true },
    profDay: { type: Number, required: true },
    expenses: [{
        nameE: { type: String, required: true },
        monyE: { type: Number, required: true },
        descriptionE: { type: String, default: "empty" },
        isDeleted: { type: Boolean, default: false }
    }],
    monyCheck: { type: Number, default: 0 },
    updatedBy: { type: Types.ObjectId, ref: "User" },
}, {
    timestamps: true
})

const incomeModel = mongoose.models.Income || model("Income", incomeSchema)
export default incomeModel

