import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { phoneNumber, email, password, name, role, coordinates, address, shopName, shopDescription } = req.body;

        // Check if user already exists (by phone or email)
        if (phoneNumber) {
            const phoneExists = await User.findOne({ phoneNumber });
            if (phoneExists) {
                return res.status(400).json({ message: 'User with this phone number already exists' });
            }
        }
        if (email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }
        }

        if (!phoneNumber && !email) {
            return res.status(400).json({ message: 'Please provide either a phone number or email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Build user data
        const userData = {
            password: hashedPassword,
            name,
            role: role || 'customer',
            address
        };

        if (phoneNumber) userData.phoneNumber = phoneNumber;
        if (email) userData.email = email;
        if (shopName) userData.shopName = shopName;
        if (shopDescription) userData.shopDescription = shopDescription;

        // Format location geoJSON (only if coordinates provided)
        if (coordinates && coordinates.length === 2) {
            userData.location = {
                type: 'Point',
                coordinates: coordinates // expecting [longitude, latitude]
            };
        }

        // Create user
        const user = await User.create(userData);

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user (phone or email)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { phoneNumber, email, password } = req.body;

        let user;
        if (email) {
            user = await User.findOne({ email });
        } else if (phoneNumber) {
            user = await User.findOne({ phoneNumber });
        } else {
            return res.status(400).json({ message: 'Please provide a phone number or email' });
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
