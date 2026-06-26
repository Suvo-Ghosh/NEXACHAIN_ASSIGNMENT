import User from '../models/User.js';

// @desc    Fetch Direct Referrals (Level 1)
// @route   GET /api/referrals/direct
// @access  Private
export const getDirectReferrals = async (req, res) => {
  try {
    // Find users who have the current logged-in user as their 'referredBy' parent
    const referrals = await User.find({ referredBy: req.user._id })
      .select('fullName email referralCode accountStatus createdAt') // Exclude sensitive info like password
      .lean(); // .lean() strips mongoose overhead for faster performance

    res.status(200).json({
      success: true,
      count: referrals.length,
      data: referrals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Helper function to recursively build the tree
const buildReferralTree = async (userId, currentLevel = 1, maxLevel = 10) => {
  // Optional: Set a maxLevel to prevent infinite loops in massive databases
  if (currentLevel > maxLevel) return [];

  const directReferrals = await User.find({ referredBy: userId })
    .select('fullName email referralCode accountStatus createdAt')
    .lean();

  let tree = [];
  
  for (let referral of directReferrals) {
    // Recursively find downlines for each referral
    const downline = await buildReferralTree(referral._id, currentLevel + 1, maxLevel);
    
    tree.push({
      userInfo: referral,
      level: currentLevel,
      downline: downline 
    });
  }

  return tree;
};

// @desc    Fetch Complete Referral Tree
// @route   GET /api/referrals/tree
// @access  Private
export const getReferralTree = async (req, res) => {
  try {
    const tree = await buildReferralTree(req.user._id);

    res.status(200).json({
      success: true,
      data: tree
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};