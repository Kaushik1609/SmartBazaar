import express from 'express';
import { getLowStockAlerts, getDemandPrediction } from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/low-stock', protect, authorize('vendor'), getLowStockAlerts);
router.get('/demand-prediction', protect, authorize('vendor'), getDemandPrediction);

export default router;
