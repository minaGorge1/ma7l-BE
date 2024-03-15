import mongoose, { Schema, model, Types } from "mongoose";

const orderSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    date: { type: String },
    customerId: { type: Types.ObjectId, ref: "Customer" },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    note: { type: String },
    products: [{
        name: { type: String, required: true },
        productId: { type: Types.ObjectId, ref: "Product", required: true},
        quantity: { type: Number, default: 1, required: true },
        discount: { type: Number, default: 0 },
        inchPrice: { type: Number, default: 0 },
        unitPrice: { type: Number, default: 1, required: true },
        finalPrice: { type: Number, default: 1, required: true }
    }],
    finalPrice: { type: Number, default: 1, required: true },
    paid: { type: Number, default: 1, required: true },
    status: {
        type: String,
        default: 'تم الدفع',
        enum: ['انتظار', 'تم الدفع', 'رفض']
    },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
})

const orderModel = mongoose.models.Order || model("Order", orderSchema)
export default orderModel

