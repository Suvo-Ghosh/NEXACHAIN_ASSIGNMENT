import mongoose from "mongoose";

const roiHistorySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  }, // [cite: 42]
  investment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Investment', 
    required: true 
  }, // [cite: 43]
  amount: { 
    type: Number, 
    required: true 
  }, // [cite: 44]
  date: { 
    type: Date, 
    default: Date.now 
  }, // [cite: 45]
  status: { 
    type: String, 
    enum: ['Pending', 'Credited', 'Failed'], 
    default: 'Credited' 
  } // [cite: 46]
}, { timestamps: true });

// Compound index to prevent duplicate ROI entries for the same investment on the same day (Useful for Task 5's idempotency requirement)
roiHistorySchema.index({ investment: 1, date: 1 }, { unique: true });

export default mongoose.model('RoiHistory', roiHistorySchema);