import express from 'express';
import {
    createReview,
    getUserReviews,
    checkReviewEligibility
} from '../controllers/review.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/:userId', getUserReviews);

// Protected routes
router.use(protect);

router.post('/', createReview);
router.get('/check/:orderId', checkReviewEligibility);

export default router;