import RoiHistory from '../models/RoiHistory.js';
import ReferralIncome from '../models/ReferralIncome.js';

// @desc    Get user's ROI history
// @route   GET /api/roi
// @access  Private
export const getRoiHistory = async (req, res) => {
    try {
        const history = await RoiHistory.find({ user: req.user._id })
            .populate('investment', 'planDetails') // Pull in the plan name for the frontend
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get user's Referral Income history
// @route   GET /api/referrals/history
// @access  Private
export const getReferralHistory = async (req, res) => {
    try {
        // Find where the current user is the "receiver" of the income
        const history = await ReferralIncome.find({ receiver: req.user._id })
            .populate('generator', 'fullName') // Pull in the name of the downline user who generated this income
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};