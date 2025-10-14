import express from 'express';
import {
    getOrder,
    getMyPurchases,
    getMySales,
    shipOrder,
    confirmOrder,
    disputeOrder,
    releaseEscrowManually
} from '../controllers/order.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/my-purchases', getMyPurchases);
router.get('/my-sales', getMySales);
router.get('/:id', getOrder);
router.put('/:id/ship', shipOrder);
router.put('/:id/confirm', confirmOrder);
router.put('/:id/dispute', disputeOrder);
router.put('/:id/release-escrow', releaseEscrowManually); // Admin only

export default router;