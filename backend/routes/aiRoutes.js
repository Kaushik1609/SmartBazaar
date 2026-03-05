import express from 'express';
import { getLowStockAlerts, getDemandPrediction, suggestProducts, generatePromo, deliveryEstimate } from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Vendor-only AI endpoints
router.get('/low-stock', protect, authorize('vendor'), getLowStockAlerts);
router.get('/demand-prediction', protect, authorize('vendor'), getDemandPrediction);
router.post('/generate-promo', protect, authorize('vendor'), generatePromo);

// Public AI endpoints
router.post('/suggest-products', suggestProducts);
router.post('/delivery-estimate', deliveryEstimate);

export default router;
