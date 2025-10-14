import express from 'express';
import {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getMyProducts
} from '../controllers/product.controller';
import { protect } from '../middleware/auth';
import { parseProductBody } from '../middleware/parseBody';
import upload from '../middleware/upload';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.use(protect); // All routes below require authentication

router.post('/', upload.array('images', 8), createProduct);
router.get('/my/listings', getMyProducts);
router.put('/:id', parseProductBody, updateProduct);
router.delete('/:id', deleteProduct);

export default router;