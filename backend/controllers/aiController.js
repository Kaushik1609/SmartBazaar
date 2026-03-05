import { GoogleGenerativeAI } from '@google/generative-ai';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Initialize Gemini AI
let model = null;
try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    console.log('Gemini AI model initialized');
} catch (err) {
    console.warn('Gemini AI init warning:', err.message);
}

// Helper: safely call Gemini
async function askGemini(prompt) {
    if (!model) return null;
    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        // Try to extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        return { rawResponse: text };
    } catch (error) {
        console.warn('Gemini API error:', error.message);
        return null;
    }
}

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

// @desc    AI-powered demand prediction
// @route   GET /api/ai/demand-prediction
// @access  Private/Vendor
export const getDemandPrediction = async (req, res) => {
    try {
        const vendorId = req.user._id;

        const topProducts = await Order.aggregate([
            { $match: { vendor: vendorId } },
            { $unwind: "$items" },
            { $group: { _id: "$items.product", totalSold: { $sum: "$items.quantity" } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        const populated = await Product.populate(topProducts, { path: '_id', select: 'name category stock' });

        // Try Gemini for smart predictions
        const productList = populated.map(p =>
            `${p._id?.name || 'Unknown'} (Category: ${p._id?.category || 'N/A'}, Sold: ${p.totalSold}, Stock: ${p._id?.stock || 0})`
        ).join('\n');

        const aiResult = await askGemini(
            `You are a demand prediction AI for a hyperlocal delivery app. Products:\n${productList}\n\nPredict demand levels. Return JSON: { predictions: [{ productName, demandLevel, suggestion }] }`
        );

        res.json({
            message: "Demand prediction based on sales data",
            salesData: populated.map(p => ({ product: p._id, totalSold: p.totalSold })),
            aiPredictions: aiResult || {
                predictions: populated.map(p => ({
                    productName: p._id?.name || 'Unknown',
                    demandLevel: p.totalSold > 10 ? 'High' : 'Medium',
                    suggestion: p.totalSold > 10 ? 'Restock immediately' : 'Monitor closely'
                }))
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    AI product suggestions
// @route   POST /api/ai/suggest-products
// @access  Public
export const suggestProducts = async (req, res) => {
    try {
        const { category, timeOfDay, userPreferences } = req.body;

        const aiResult = await askGemini(
            `You are a shopping AI for an Indian grocery delivery app. Suggest 5 products for category: ${category || 'general'}, time: ${timeOfDay || 'afternoon'}. ${userPreferences ? 'Preferences: ' + userPreferences : ''}\nReturn JSON: { suggestions: [{ product, reason }] }`
        );

        res.json(aiResult || {
            suggestions: [
                { product: "Amul Taaza Milk 500ml", reason: "Daily essential, popular in mornings" },
                { product: "Britannia Bread", reason: "Pairs well with milk, breakfast staple" },
                { product: "Aashirvaad Atta 5kg", reason: "Weekly grocery essential" },
                { product: "Tata Salt 1kg", reason: "Kitchen basic, always needed" },
                { product: "Fortune Sunflower Oil 1L", reason: "Cooking essential, high demand" }
            ]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    AI promo banner generation
// @route   POST /api/ai/generate-promo
// @access  Private/Vendor
export const generatePromo = async (req, res) => {
    try {
        const { shopName, category, season } = req.body;

        const aiResult = await askGemini(
            `Generate a promotional banner for: Shop: ${shopName || 'Local Store'}, Category: ${category || 'General'}, Season: ${season || 'Regular'}.\nReturn JSON: { headline, tagline, offerText, colors: { primary, accent } }`
        );

        res.json(aiResult || {
            headline: "Fresh Deals Today!",
            tagline: `Best ${category || 'grocery'} at ${shopName || 'your local store'}`,
            offerText: "Up to 20% OFF",
            colors: { primary: "#FF7A00", accent: "#FF512F" }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    AI delivery time estimate
// @route   POST /api/ai/delivery-estimate
// @access  Public
export const deliveryEstimate = async (req, res) => {
    try {
        const { distanceKm, itemCount, timeOfDay, weather } = req.body;

        const aiResult = await askGemini(
            `Estimate delivery time for: Distance: ${distanceKm || 2}km, Items: ${itemCount || 3}, Time: ${timeOfDay || 'afternoon'}, Weather: ${weather || 'clear'}.\nReturn JSON: { estimatedMinutes, confidence, tip }`
        );

        // Smart fallback calculation
        const baseMins = Math.round((distanceKm || 2) * 8 + (itemCount || 3) * 2);

        res.json(aiResult || {
            estimatedMinutes: baseMins,
            confidence: "high",
            tip: "Order before peak hours (12-2 PM) for faster delivery"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
