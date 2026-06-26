import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    referralCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    walletBalance: {
        type: Number,
        default: 0
    },
    totalRoiEarned: {
        type: Number,
        default: 0
    },
    totalLevelIncomeEarned: {
        type: Number,
        default: 0
    },
    accountStatus: {
        type: String,
        enum: ['Active', 'Suspended', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);