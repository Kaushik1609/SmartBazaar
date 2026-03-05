import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get nearby vendors
// @route   GET /api/vendors/nearby?lng=xx&lat=yy&radius=5
// @access  Public
export const getNearbyVendors = async (req, res) => {
    try {
        const { lng, lat, radius = 5 } = req.query; // radius in km

        if (!lng || !lat) {
            return res.status(400).json({ message: 'Please provide longitude and latitude' });
        }

        // Convert radius to radians (Earth radius = 6378.1 km)
        const radiusInRadians = radius / 6378.1;

        const vendors = await User.find({
            role: 'vendor',
            location: {
                $geoWithin: {
                    $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusInRadians]
                }
            }
        }).select('-password');

        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get vendor profile by ID
// @route   GET /api/vendors/:id
// @access  Public
export const getVendorProfile = async (req, res) => {
    try {
        const vendor = await User.findById(req.params.id).select('-password');

        if (!vendor || vendor.role !== 'vendor') {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Count total products
        const productCount = await Product.countDocuments({ vendor: vendor._id });

        res.json({
            ...vendor.toObject(),
            productCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all products for a specific vendor
// @route   GET /api/vendors/:id/products
// @access  Public
export const getVendorProducts = async (req, res) => {
    try {
        const vendor = await User.findById(req.params.id);

        if (!vendor || vendor.role !== 'vendor') {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const products = await Product.find({ vendor: req.params.id });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
