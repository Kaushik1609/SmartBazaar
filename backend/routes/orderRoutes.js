import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    assignDelivery,
    updateDeliveryStatus,
    getAvailableDeliveries,
    cancelOrder,
    estimateFee
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public — fee preview (no auth needed)
router.post('/estimate-fee', estimateFee);

// Delivery partner — available pickups (must be before /:id routes)
router.get('/available-deliveries', protect, authorize('delivery'), getAvailableDeliveries);

// Customer — create order & get own orders
router.route('/')
    .post(protect, authorize('customer'), createOrder)
    .get(protect, getMyOrders);

// Any involved party — get single order
router.get('/:id', protect, getOrderById);

// Vendor — update order status (accept, reject, packing, etc.)
router.patch('/:id/status', protect, authorize('vendor'), updateOrderStatus);

// Vendor — assign delivery partner to order
router.patch('/:id/assign', protect, authorize('vendor'), assignDelivery);

// Delivery partner — mark order as delivered
router.patch('/:id/delivery-status', protect, authorize('delivery'), updateDeliveryStatus);

// Customer — cancel own order
router.patch('/:id/cancel', protect, authorize('customer'), cancelOrder);

export default router;
