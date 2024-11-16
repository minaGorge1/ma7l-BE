import mongoose, { Schema, model, Types } from "mongoose";


const customerSchema = new Schema({
    name: {
        type: String,
        required: [true, "userName is required"],
        min: [2, "minimum length 2 char"],
        lower: true,
        trim: true
    },
    phone: [{
        type: String,
        required: true
    }],
    address: {
        type: String,
        default: "empty"
    },
    money: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: "empty"
    },
    status: {
        type: String,
        default: "صافي",
        enum: ["صافي", "ليه فلوس", "عليه فلوس"]
    },
    transactions: [{
        amount: {
            type: Number,
            required: true,
            min: [0, "Amount cannot be negative"]
        },
        date: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            enum: ["تحويل", "كاش"],
            required: true
        },
        description: {
            type: String,
            default: "No description"
        },
        clarification: { //df3 wla 5d 7agat 3notaa
            type: String,
            enum: ["دفع", "دين"],
            required: true
        }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

const customerModel = mongoose.models.Customer || model("Customer", customerSchema)
export default customerModel