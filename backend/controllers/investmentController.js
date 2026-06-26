import Investment from '../models/Investment.js';
import User from '../models/User.js';
import { distributeReferralIncome } from '../services/businessLogicService.js';

// @desc    Create a new investment
// @route   POST /api/investments
// @access  Private
export const createInvestment = async (req, res) => {
    try {
        const { investmentAmount, planDetails, durationInDays, dailyRoiPercentage } = req.body;

        // Validate required fields
        if (!investmentAmount || !planDetails || !durationInDays || !dailyRoiPercentage) {
            return res.status(400).json({
                success: false,
                message: 'Please provide investment amount, plan details, duration in days, and daily ROI percentage'
            });
        }

        if (investmentAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Investment amount must be greater than zero'
            });
        }

        // Calculate Start and End Dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + parseInt(durationInDays));

        // Create the investment record linked to the authenticated user
        const investment = await Investment.create({
            user: req.user._id,
            investmentAmount,
            planDetails,
            startDate,
            endDate,
            dailyRoiPercentage,
            status: 'Active' // Default status as per schema
        });

        // Trigger Referral Business Logic
        // Distribute referral income up the hierarchy based on this new investment
        await distributeReferralIncome(req.user._id, investmentAmount);

        /* Note: Depending on your specific business flow, we might also want to 
          deduct the 'investmentAmount' from the user's 'walletBalance' here 
          if they are investing directly from their platform wallet.
        */

        res.status(201).json({
            success: true,
            message: 'Investment created successfully, and referral commissions distributed',
            data: investment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get all investments for the logged-in user
// @route   GET /api/investments
// @access  Private
export const getUserInvestments = async (req, res) => {
    try {
        // Fetch investments where the user matches the logged-in user's ID
        // Sorting by createdAt descending so the newest investments appear first
        const investments = await Investment.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: investments.length,
            data: investments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};