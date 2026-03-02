import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, authorize('vendor'), createProduct);

router.route('/:id')
    .put(protect, authorize('vendor'), updateProduct)
    .delete(protect, authorize('vendor'), deleteProduct);

export default router;
