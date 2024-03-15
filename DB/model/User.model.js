import mongoose, { Schema, model, Types } from "mongoose";

/* (userName,phone,email,password,cpassword,status) */

const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, "userName is required"],
        min: [2, "minimum length 2 char"],
        max: [20, "max length 20 char"],
        lower: true,
        trim: true // masafat
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    status: {
        type: String,
        default: "offline",
        enum: ["offline", "online", "blocked"]
    },
    role: {
        type: String,
        default: "User",
        enum: ["User", "Admin"]
    },
    delete: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

const userModel = mongoose.models.User || model("User", userSchema)
export default userModel