import express from 'express';
import { getNearbyVendors } from '../controllers/vendorController.js';

const router = express.Router();

router.get('/nearby', getNearbyVendors);

export default router;
