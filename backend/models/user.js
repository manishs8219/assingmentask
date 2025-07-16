import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, index: true, required: true },
    password: { type: String, required: true },
    loginTime:{
        type:Number,
        default:0
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
    timestamps: true
});

export default mongoose.model("user", userSchema);
