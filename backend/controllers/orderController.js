import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// --- Dynamic Fee Calculation Engine ---

const PEAK_HOURS = [
    { start: 12, end: 14 },  // 12 PM – 2 PM lunch rush
    { start: 18, end: 21 }   // 6 PM – 9 PM dinner rush
];

function isPeakHour() {
    const hour = new Date().getHours();
    return PEAK_HOURS.some(p => hour >= p.start && hour < p.end);
}

/**
 * Calculate delivery fee with tiered pricing
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} deliveryType - 'fast' or 'standard'
 * @param {number} itemCount - Number of items in the order
 * @param {number} itemTotal - Total items price (for free delivery threshold)
 * @returns {object} Fee breakdown
 */
export const calculateDeliveryFee = (distanceKm = 2, deliveryType = 'standard', itemCount = 1, itemTotal = 0) => {
    const baseFee = 15; // ₹15 base
    const perKmRate = 8; // ₹8 per km

    // Distance charge (tiered: first 2km at base rate, beyond 2km at higher rate)
    let distanceCharge;
    if (distanceKm <= 2) {
        distanceCharge = Math.ceil(distanceKm) * perKmRate;
    } else {
        distanceCharge = (2 * perKmRate) + (Math.ceil(distanceKm - 2) * 12); // ₹12/km beyond 2km
    }

    // Priority surcharge for fast delivery
    let prioritySurcharge = 0;
    if (deliveryType === 'fast') {
        prioritySurcharge = 40 + (Math.ceil(distanceKm) * 5); // ₹40 flat + ₹5/km
    }

    // Bulk item surcharge (more than 5 items)
    let bulkSurcharge = 0;
    if (itemCount > 5) {
        bulkSurcharge = (itemCount - 5) * 5; // ₹5 per extra item beyond 5
    }

    // Surge multiplier during peak hours
    const surgeMultiplier = isPeakHour() ? 1.2 : 1.0;

    // Subtotal before discount
    let subtotal = Math.round((baseFee + distanceCharge + prioritySurcharge + bulkSurcharge) * surgeMultiplier);

    // Free standard delivery for orders above ₹500
    let discount = 0;
    if (deliveryType === 'standard' && itemTotal >= 500) {
        discount = subtotal;
    }

    const finalFee = Math.max(subtotal - discount, 0);

    return {
        baseFee,
        distanceCharge,
        prioritySurcharge,
        bulkSurcharge,
        surgeMultiplier,
        discount,
        finalFee
    };
};

/**
 * Calculate estimated delivery time in minutes
 */
function estimateDeliveryTime(distanceKm, deliveryType) {
    if (deliveryType === 'fast') {
        // Fast: 15 min prep + 5 min/km, capped at 30-60
        return Math.min(60, Math.max(30, 15 + Math.ceil(distanceKm) * 5));
    } else {
        // Standard: collected in batches, 180-240 min
        return Math.min(240, Math.max(180, 180 + Math.ceil(distanceKm) * 10));
    }
}

// --- Valid Status Transitions ---
const VALID_TRANSITIONS = {
    'pending': ['accepted', 'rejected', 'cancelled'],
    'accepted': ['packing', 'cancelled'],
    'packing': ['out_for_delivery', 'cancelled'],
    'out_for_delivery': ['delivered'],
    'rejected': [],
    'delivered': [],
    'cancelled': []
};

// ============================================
// ENDPOINTS
// ============================================

// @desc    Preview delivery fee (no order created)
// @route   POST /api/orders/estimate-fee
// @access  Public
export const estimateFee = (req, res) => {
    try {
        const { distanceKm, deliveryType, itemCount, itemTotal } = req.body;

        if (!deliveryType || !['fast', 'standard'].includes(deliveryType)) {
            return res.status(400).json({ message: 'deliveryType must be "fast" or "standard"' });
        }

        const breakdown = calculateDeliveryFee(distanceKm, deliveryType, itemCount, itemTotal);
        const estimatedMinutes = estimateDeliveryTime(distanceKm, deliveryType);

        res.json({
            deliveryType,
            distanceKm: distanceKm || 2,
            itemCount: itemCount || 1,
            estimatedMinutes,
            deliveryWindow: deliveryType === 'fast' ? '30–60 minutes' : '3–4 hours',
            isPeakHour: isPeakHour(),
            feeBreakdown: breakdown,
            deliveryFee: breakdown.finalFee
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Customer
export const createOrder = async (req, res) => {
    try {
        const { vendorId, items, deliveryType, distanceKm, deliveryAddress, customerLocation } = req.body;

        // Validate basic inputs
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }
        if (!vendorId) {
            return res.status(400).json({ message: 'vendorId is required' });
        }
        if (!deliveryType || !['fast', 'standard'].includes(deliveryType)) {
            return res.status(400).json({ message: 'deliveryType must be "fast" or "standard"' });
        }

        // Validate and fetch products, check stock
        const productIds = items.map(i => i.product);
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== productIds.length) {
            return res.status(400).json({ message: 'One or more products not found' });
        }

        // Check stock availability
        const outOfStock = [];
        for (const item of items) {
            const product = products.find(p => p._id.toString() === item.product.toString());
            if (!product || product.stock < item.quantity) {
                outOfStock.push({
                    product: product?.name || item.product,
                    requested: item.quantity,
                    available: product?.stock || 0
                });
            }
        }
        if (outOfStock.length > 0) {
            return res.status(400).json({
                message: 'Insufficient stock for some items',
                outOfStock
            });
        }

        // Calculate totals server-side (prevent client tampering)
        const orderItems = items.map(item => {
            const product = products.find(p => p._id.toString() === item.product.toString());
            return {
                product: item.product,
                quantity: item.quantity,
                price: product.price // Use server-side price
            };
        });

        const itemTotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const feeBreakdown = calculateDeliveryFee(distanceKm, deliveryType, items.length, itemTotal);
        const deliveryFee = feeBreakdown.finalFee;
        const totalAmount = itemTotal + deliveryFee;
        const estimatedMinutes = estimateDeliveryTime(distanceKm, deliveryType);

        // Create the order
        const order = new Order({
            customer: req.user._id,
            vendor: vendorId,
            items: orderItems,
            totalAmount,
            deliveryFee,
            deliveryType,
            distanceKm: distanceKm || 0,
            deliveryAddress: deliveryAddress || '',
            customerLocation: customerLocation || undefined,
            estimatedDeliveryMinutes: estimatedMinutes,
            feeBreakdown,
            statusHistory: [{ status: 'pending', timestamp: new Date(), note: 'Order placed' }]
        });

        const createdOrder = await order.save();

        // Deduct stock from products
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        // Populate and return
        const populatedOrder = await Order.findById(createdOrder._id)
            .populate('customer', 'name phoneNumber')
            .populate('vendor', 'name shopName')
            .populate('items.product', 'name price');

        res.status(201).json({
            order: populatedOrder,
            deliveryWindow: deliveryType === 'fast' ? '30–60 minutes' : '3–4 hours',
            estimatedDeliveryMinutes: estimatedMinutes,
            feeBreakdown
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders (Customer, Vendor, or Delivery)
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'customer') {
            query.customer = req.user._id;
        } else if (req.user.role === 'vendor') {
            query.vendor = req.user._id;
        } else if (req.user.role === 'delivery') {
            query.deliveryPartner = req.user._id;
        }

        const orders = await Order.find(query)
            .populate('customer', 'name phoneNumber')
            .populate('vendor', 'name shopName')
            .populate('deliveryPartner', 'name phoneNumber')
            .populate('items.product', 'name price imageUrl')
            .sort({ createdAt: -1 });

        res.json({
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name phoneNumber address')
            .populate('vendor', 'name shopName location address')
            .populate('deliveryPartner', 'name phoneNumber')
            .populate('items.product', 'name price imageUrl category');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify the user is involved in this order
        const userId = req.user._id.toString();
        const isInvolved =
            order.customer?._id?.toString() === userId ||
            order.vendor?._id?.toString() === userId ||
            order.deliveryPartner?._id?.toString() === userId;

        if (!isInvolved) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (with transition validation)
// @route   PATCH /api/orders/:id/status
// @access  Private (Vendor)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify vendor owns this order
        if (order.vendor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        // Validate status transition
        const allowedNext = VALID_TRANSITIONS[order.status] || [];
        if (!allowedNext.includes(status)) {
            return res.status(400).json({
                message: `Cannot transition from "${order.status}" to "${status}"`,
                allowedTransitions: allowedNext
            });
        }

        order.status = status;
        order.statusHistory.push({
            status,
            timestamp: new Date(),
            note: note || `Status changed to ${status}`
        });

        // If rejected or cancelled, restore stock
        if (status === 'rejected' || status === 'cancelled') {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity }
                });
            }
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign order to delivery partner
// @route   PATCH /api/orders/:id/assign
// @access  Private (Vendor)
export const assignDelivery = async (req, res) => {
    try {
        const { deliveryPartnerId } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify vendor owns this order
        if (order.vendor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to assign delivery for this order' });
        }

        // Only assign from accepted or packing state
        if (!['accepted', 'packing'].includes(order.status)) {
            return res.status(400).json({
                message: `Cannot assign delivery in "${order.status}" state. Order must be "accepted" or "packing".`
            });
        }

        // Verify delivery partner exists and has correct role
        const partner = await User.findById(deliveryPartnerId);
        if (!partner) {
            return res.status(404).json({ message: 'Delivery partner not found' });
        }
        if (partner.role !== 'delivery') {
            return res.status(400).json({ message: 'User is not a delivery partner' });
        }

        order.deliveryPartner = deliveryPartnerId;
        order.status = 'out_for_delivery';
        order.statusHistory.push({
            status: 'out_for_delivery',
            timestamp: new Date(),
            note: `Assigned to ${partner.name}`
        });

        const updatedOrder = await order.save();

        const populated = await Order.findById(updatedOrder._id)
            .populate('deliveryPartner', 'name phoneNumber');

        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delivery partner marks order as delivered
// @route   PATCH /api/orders/:id/delivery-status
// @access  Private (Delivery Partner)
export const updateDeliveryStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify delivery partner is assigned to this order
        if (!order.deliveryPartner || order.deliveryPartner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized — you are not the assigned delivery partner' });
        }

        // Only allow delivered transition from out_for_delivery
        if (order.status !== 'out_for_delivery' || status !== 'delivered') {
            return res.status(400).json({
                message: 'Delivery partner can only mark orders as "delivered" when status is "out_for_delivery"'
            });
        }

        order.status = 'delivered';
        order.statusHistory.push({
            status: 'delivered',
            timestamp: new Date(),
            note: note || 'Order delivered successfully'
        });

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get available orders for delivery partners (unassigned, in packing state)
// @route   GET /api/orders/available-deliveries
// @access  Private (Delivery Partner)
export const getAvailableDeliveries = async (req, res) => {
    try {
        const orders = await Order.find({
            status: 'packing',
            deliveryPartner: { $exists: false }
        })
            .populate('customer', 'name phoneNumber address')
            .populate('vendor', 'name shopName location address')
            .populate('items.product', 'name')
            .sort({ createdAt: 1 }); // oldest first

        res.json({
            count: orders.length,
            orders: orders.map(o => ({
                _id: o._id,
                vendor: o.vendor,
                customer: { name: o.customer?.name, address: o.deliveryAddress },
                itemCount: o.items.length,
                totalAmount: o.totalAmount,
                deliveryFee: o.deliveryFee,
                deliveryType: o.deliveryType,
                distanceKm: o.distanceKm,
                estimatedDeliveryMinutes: o.estimatedDeliveryMinutes,
                createdAt: o.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Customer cancels own order (only if still pending)
// @route   PATCH /api/orders/:id/cancel
// @access  Private (Customer)
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        if (!['pending', 'accepted'].includes(order.status)) {
            return res.status(400).json({
                message: `Cannot cancel order in "${order.status}" state. Only "pending" or "accepted" orders can be cancelled.`
            });
        }

        order.status = 'cancelled';
        order.statusHistory.push({
            status: 'cancelled',
            timestamp: new Date(),
            note: req.body.reason || 'Cancelled by customer'
        });

        // Restore stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
