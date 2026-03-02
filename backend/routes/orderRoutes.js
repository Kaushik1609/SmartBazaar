import express from 'express';
import { createOrder, getMyOrders, updateOrderStatus, assignDelivery } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .post(protect, authorize('customer'), createOrder)
    .get(protect, getMyOrders);

router.route('/:id/status')
    .patch(protect, authorize('vendor'), updateOrderStatus);

router.route('/:id/assign')
    .patch(protect, authorize('vendor'), assignDelivery);

export default router;
