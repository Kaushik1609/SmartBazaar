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
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend Connected Successfully 🚀' });
});

// Basic Route
app.get('/', (req, res) => {
  res.send('VendorVerse Backend API is running!');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
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