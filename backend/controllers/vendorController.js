import User from '../models/User.js';

// @desc    Get nearby vendors
// @route   GET /api/vendors/nearby?lng=xx&lat=yy&radius=5
// @access  Public (or semi-public)
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
