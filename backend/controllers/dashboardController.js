import User from '../models/User.js';
import Investment from '../models/Investment.js';

// @desc    Get User Dashboard Metrics
// @route   GET /api/dashboard
// @access  Private
export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch the user's wallet and earnings data
        const user = await User.findById(userId).select('walletBalance totalRoiEarned totalLevelIncomeEarned');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Optimize query: Use aggregation to sum investment amounts directly in the database
        const investmentStats = await Investment.aggregate([
            { $match: { user: userId, status: 'Active' } },
            { $group: { _id: null, totalAmount: { $sum: '$investmentAmount' } } }
        ]);

        const totalInvestments = investmentStats.length > 0 ? investmentStats[0].totalAmount : 0;

        // Return the required dashboard metrics
        res.status(200).json({
            success: true,
            data: {
                totalInvestments,
                totalRoiEarned: user.totalRoiEarned,
                totalLevelIncomeEarned: user.totalLevelIncomeEarned,
                walletBalance: user.walletBalance
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};