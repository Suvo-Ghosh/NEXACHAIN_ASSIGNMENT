import mongoose from 'mongoose';
import User from '../models/User.js';
import Investment from '../models/Investment.js';
import RoiHistory from '../models/RoiHistory.js';
import ReferralIncome from '../models/ReferralIncome.js';

/**
 * @desc    Calculates and distributes Daily ROI for all active investments
 * @returns {Object} Summary of the execution process
 */
export const processDailyROI = async () => {
    // Start a MongoDB session to maintain ACID transaction consistency
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight to check for duplicates

        // 1. Fetch all active investments that haven't reached their end date
        const activeInvestments = await Investment.find({
            status: 'Active',
            endDate: { $gte: today }
        }).session(session);

        let processedCount = 0;
        let skippedCount = 0;

        for (const investment of activeInvestments) {
            // 2. Prevent Duplicate Calculations: 
            // Check if ROI was already processed for this investment today
            const existingRoi = await RoiHistory.findOne({
                investment: investment._id,
                date: { $gte: today }
            }).session(session);

            if (existingRoi) {
                skippedCount++;
                continue; // Skip to the next investment
            }

            // 3. Calculate Daily ROI
            const dailyRoiAmount = (investment.investmentAmount * investment.dailyRoiPercentage) / 100;

            // 4. Store ROI History
            await RoiHistory.create([{
                user: investment.user,
                investment: investment._id,
                amount: dailyRoiAmount,
                date: new Date(),
                status: 'Credited'
            }], { session });

            // 5. Update User's Wallet Balance and Total ROI
            await User.findByIdAndUpdate(investment.user, {
                $inc: {
                    walletBalance: dailyRoiAmount,
                    totalRoiEarned: dailyRoiAmount
                }
            }, { session });

            processedCount++;
        }

        // Commit the transaction if everything succeeds
        await session.commitTransaction();
        session.endSession();

        return { success: true, processedCount, skippedCount };

    } catch (error) {
        // Abort transaction and rollback all changes if any error occurs
        await session.abortTransaction();
        session.endSession();
        console.error('Error processing Daily ROI:', error);
        throw new Error('Failed to process daily ROI');
    }
};

/**
 * @desc    Traverses referral hierarchy and distributes level income.
 * Typically triggered when a user makes a new investment.
 * @param   {ObjectId} generatorUserId - The user who made the investment
 * @param   {Number} investmentAmount - The base amount used to calculate commissions
 */
export const distributeReferralIncome = async (generatorUserId, investmentAmount) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Define the income structure (e.g., Level 1 = 5%, Level 2 = 3%, Level 3 = 1%)
        // This is separated into a configurable object for scalable code structure 
        const LEVEL_PERCENTAGES = {
            1: 5.0,
            2: 3.0,
            3: 1.0
        };
        const MAX_LEVEL = Object.keys(LEVEL_PERCENTAGES).length;

        let currentUser = await User.findById(generatorUserId).session(session);
        let currentLevel = 1;

        // 1. Traverse referral hierarchy
        while (currentUser && currentUser.referredBy && currentLevel <= MAX_LEVEL) {
            const parentUserId = currentUser.referredBy;

            // 2. Calculate income for the current level
            const commissionPercentage = LEVEL_PERCENTAGES[currentLevel];
            const incomeAmount = (investmentAmount * commissionPercentage) / 100;

            // 3. Store transaction history
            await ReferralIncome.create([{
                receiver: parentUserId,
                generator: generatorUserId,
                level: currentLevel,
                amount: incomeAmount,
                date: new Date()
            }], { session });

            // 4. Credit earnings to eligible parent user
            await User.findByIdAndUpdate(parentUserId, {
                $inc: {
                    walletBalance: incomeAmount,
                    totalLevelIncomeEarned: incomeAmount
                }
            }, { session });

            // Move up the tree for the next iteration
            currentUser = await User.findById(parentUserId).session(session);
            currentLevel++;
        }

        await session.commitTransaction();
        session.endSession();

        return { success: true, levelsProcessed: currentLevel - 1 };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error distributing Referral Income:', error);
        throw new Error('Failed to distribute referral income');
    }
};