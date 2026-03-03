import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('BazaarExpress Backend API is running!');
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bazaarexpress')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('⚠️ Could not connect to MongoDB. Starting server without database connection.');
        console.error('MongoDB Error:', error.message);
    });

// Start the server regardless of DB connection status
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
