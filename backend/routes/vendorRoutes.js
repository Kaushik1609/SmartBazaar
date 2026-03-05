import express from 'express';
import { getNearbyVendors, getVendorProfile, getVendorProducts } from '../controllers/vendorController.js';

const router = express.Router();

router.get('/nearby', getNearbyVendors);
router.get('/:id', getVendorProfile);
router.get('/:id/products', getVendorProducts);

export default router;
