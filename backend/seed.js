import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const vendors = [
    {
        name: "Sharma General Store",
        email: "sharma@test.com",
        password: "password123",
        mobile: "9876543210",
        role: "vendor",
        shopName: "Sharma General Store",
        address: "1.2 km away, Sector 14, HSR Layout",
        // 12.9716, 77.5946 + slight offset
        location: {
            type: "Point",
            coordinates: [77.5946 + 0.003, 12.9716 + 0.005] // [lng, lat]
        }
    },
    {
        name: "Green Leaf Veggies",
        email: "greenleaf@test.com",
        password: "password123",
        mobile: "9876543211",
        role: "vendor",
        shopName: "Green Leaf Veggies",
        address: "2.5 km away, Koramangala",
        location: {
            type: "Point",
            coordinates: [77.5946 - 0.006, 12.9716 - 0.008] // [lng, lat]
        }
    },
    {
        name: "Apollo Pharmacy",
        email: "apollo@test.com",
        password: "password123",
        mobile: "9876543212",
        role: "vendor",
        shopName: "Apollo Pharmacy",
        address: "0.8 km away, HSR Layout",
        location: {
            type: "Point",
            coordinates: [77.5946 + 0.002, 12.9716 - 0.004] // [lng, lat]
        }
    }
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendorverse');
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await User.deleteMany({ role: "vendor" });

        // Hash passwords 
        const salt = await bcrypt.genSalt(10);
        const vendorsWithHashedPasswords = vendors.map(vendor => ({
            ...vendor,
            password: bcrypt.hashSync(vendor.password, salt)
        }));

        await User.insertMany(vendorsWithHashedPasswords);
        console.log('Vendor Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB().then(importData);
