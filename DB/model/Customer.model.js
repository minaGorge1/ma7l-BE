import mongoose, { Schema, model, Types } from "mongoose";


const customerSchema = new Schema({
    name: {
        type: String,
        required: [true, "userName is required"],
        min: [2, "minimum length 2 char"],
        lower: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    address: String,
    description: String,
    status: {
        type: String,
        default: "صافي",
        enum: ["صافي","ليه فلوس", "عليه فلوس"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

const customerModel = mongoose.models.Customer || model("Customer", customerSchema)
export default customerModel