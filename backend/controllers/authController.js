import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Utility function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { fullName, email, mobileNumber, password, referredByCode } = req.body;

        // Validate required fields
        if (!fullName || !email || !mobileNumber || !password) {
            return res.status(400).json({ success: false, message: 'Please add all required fields' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Handle Referral Logic
        let parentUserId = null;
        if (referredByCode) {
            const parentUser = await User.findOne({ referralCode: referredByCode });
            if (parentUser) {
                parentUserId = parentUser._id;
            } else {
                return res.status(400).json({ success: false, message: 'Invalid referral code' });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate a unique referral code for the new user
        const generatedReferralCode = 'NEXA' + Math.random().toString(36).substring(2, 8).toUpperCase();

        // Create user
        const user = await User.create({
            fullName,
            email,
            mobileNumber,
            password: hashedPassword,
            referralCode: generatedReferralCode,
            referredBy: parentUserId
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    referralCode: user.referralCode,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate request
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Check for user email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if account is active
        if (user.accountStatus !== 'Active') {
            return res.status(403).json({ success: false, message: 'Account is suspended or inactive' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (user && isMatch) {
            res.status(200).json({
                success: true,
                data: {
                    _id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    referralCode: user.referralCode,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get current logged in user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        // req.user is populated by the 'protect' middleware (excluding the password)
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};