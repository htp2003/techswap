import express from 'express';
import { getMessages, markAsRead } from '../controllers/message.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/:orderId', getMessages);
router.put('/:id/read', markAsRead);

export default router;