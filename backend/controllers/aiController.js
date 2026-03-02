import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get low stock alerts for a vendor
// @route   GET /api/ai/low-stock
// @access  Private/Vendor
export const getLowStockAlerts = async (req, res) => {
    try {
        const vendorId = req.user._id;
        const STOCK_THRESHOLD = 5;

        const lowStockProducts = await Product.find({
            vendor: vendorId,
            stock: { $lt: STOCK_THRESHOLD }
        }).select('name stock category');

        res.json({
            alertCount: lowStockProducts.length,
            alerts: lowStockProducts.map(p => ({
                message: `Low stock alert: ${p.name} only has ${p.stock} units left!`,
                product: p
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Predict high demand products (Mock AI)
// @route   GET /api/ai/demand-prediction
// @access  Private/Vendor
export const getDemandPrediction = async (req, res) => {
    try {
        const vendorId = req.user._id;

        // Basic "AI" logic: Find most ordered products in the last 24/48 hours
        // For this prototype, we'll aggregate all-time top selling items for the vendor

        const topProducts = await Order.aggregate([
            { $match: { vendor: vendorId } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    totalSold: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 3 }
        ]);

        // Populate product details
        const populatedPredictions = await Product.populate(topProducts, { path: '_id', select: 'name category' });

        res.json({
            message: "Based on recent order volume, these items are predicted to have high demand today.",
            predictions: populatedPredictions.map(p => ({
                product: p._id,
                predictedDemandLevel: p.totalSold > 10 ? 'High' : 'Medium'
            }))
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
