import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';
import Order from '../models/Order';
import { AppError } from '../middleware/errorHandler';

// @desc    Get messages for an order
// @route   GET /api/messages/:orderId
// @access  Private
export const getMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { orderId } = req.params;

        // Get order to verify permission
        const order = await Order.findById(orderId);
        if (!order) {
            return next(new AppError('Order not found', 404));
        }

        // Check if user is buyer or seller
        const isBuyer = order.buyerId.toString() === req.user!._id.toString();
        const isSeller = order.sellerId.toString() === req.user!._id.toString();

        if (!isBuyer && !isSeller) {
            return next(new AppError('Not authorized to view messages', 403));
        }

        // Get messages
        const messages = await Message.find({ orderId })
            .populate('from', 'name avatar')
            .sort('createdAt')
            .limit(100);

        res.status(200).json({
            success: true,
            data: { messages }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
export const markAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return next(new AppError('Message not found', 404));
        }

        // Check if user is the recipient
        if (message.to.toString() !== req.user!._id.toString()) {
            return next(new AppError('Not authorized', 403));
        }

        message.read = true;
        await message.save();

        res.status(200).json({
            success: true,
            data: { message }
        });
    } catch (error) {
        next(error);
    }
};