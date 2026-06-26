import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    investmentAmount: {
        type: Number,
        required: true
    },
    planDetails: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    dailyRoiPercentage: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled'],
        default: 'Active',
        index: true
    }
}, { timestamps: true });

export default mongoose.model('Investment', investmentSchema);