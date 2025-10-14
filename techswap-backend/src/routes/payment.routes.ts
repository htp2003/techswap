import express from 'express';
import {
    createPayment,
    handleCallback,
    getPaymentStatus,
    mockPaymentSuccess // ← NEW
} from '../controllers/payment.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public route (VNPay callback)
router.get('/callback', handleCallback);

// Protected routes
router.use(protect);

router.post('/create', createPayment);
router.post('/mock-success', mockPaymentSuccess); // ← NEW (for testing)
router.get('/:orderId/status', getPaymentStatus);

export default router;