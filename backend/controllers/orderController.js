import Order from '../models/Order.js';

// Calculate fee explicitly
const calculateDeliveryFee = (distanceKm, deliveryType) => {
    const baseFee = 20; // Base delivery fee
    const perKmRate = 10;

    let totalFee = baseFee + (Math.ceil(distanceKm) * perKmRate);

    // Priority surcharge
    if (deliveryType === 'fast') {
        totalFee += 40; // Flat extra charge for 30-min priority
    }

    return totalFee;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Customer
export const createOrder = async (req, res) => {
    try {
        const { vendorId, items, deliveryType, distanceKm } = req.body;

        if (items && items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Calculate delivery fee dynamically based on distance and priority
        const deliveryFee = calculateDeliveryFee(distanceKm, deliveryType);

        // Calculate total items price
        const itemTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totalAmount = itemTotal + deliveryFee;

        const order = new Order({
            customer: req.user._id,
            vendor: vendorId,
            items,
            totalAmount,
            deliveryFee,
            deliveryType
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders (Customer or Vendor)
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

        const orders = await Order.find(query).populate('customer', 'name').populate('vendor', 'name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            // Basic authorization check could go here
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign order to delivery partner
// @route   PATCH /api/orders/:id/assign
// @access  Private (Vendor or Admin)
export const assignDelivery = async (req, res) => {
    try {
        const { deliveryPartnerId } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.deliveryPartner = deliveryPartnerId;
            order.status = 'out_for_delivery';

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
