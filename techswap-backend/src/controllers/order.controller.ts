import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Transaction from '../models/Transaction';
import { AppError } from '../middleware/errorHandler';

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('productId')
            .populate('buyerId', 'name email phone avatar')
            .populate('sellerId', 'name email phone avatar');

        if (!order) {
            return next(new AppError('Order not found', 404));
        }

        // Check authorization
        if (
            order.buyerId._id.toString() !== req.user!._id.toString() &&
            order.sellerId._id.toString() !== req.user!._id.toString()
        ) {
            return next(new AppError('Not authorized to view this order', 403));
        }

        res.status(200).json({
            success: true,
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my purchases (as buyer)
// @route   GET /api/orders/my-purchases
// @access  Private
export const getMyPurchases = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { status, page = '1', limit = '20' } = req.query;

        const query: any = { buyerId: req.user!._id };
        if (status) query.status = status;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const orders = await Order.find(query)
            .populate('productId')
            .populate('sellerId', 'name avatar rating')
            .sort('-createdAt')
            .skip(skip)
            .limit(limitNum);

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                orders,
                pagination: {
                    total,
                    page: pageNum,
                    pages: Math.ceil(total / limitNum)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my sales (as seller)
// @route   GET /api/orders/my-sales
// @access  Private
export const getMySales = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { status, page = '1', limit = '20' } = req.query;

        const query: any = { sellerId: req.user!._id };
        if (status) query.status = status;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const orders = await Order.find(query)
            .populate('productId')
            .populate('buyerId', 'name avatar rating')
            .sort('-createdAt')
            .skip(skip)
            .limit(limitNum);

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                orders,
                pagination: {
                    total,
                    page: pageNum,
                    pages: Math.ceil(total / limitNum)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark order as shipped (Seller only)
// @route   PUT /api/orders/:id/ship
// @access  Private
export const shipOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { trackingNumber } = req.body;

        if (!trackingNumber) {
            return next(new AppError('Tracking number is required', 400));
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new AppError('Order not found', 404));
        }

        // Check if user is the seller
        if (order.sellerId.toString() !== req.user!._id.toString()) {
            return next(new AppError('Only seller can ship the order', 403));
        }

        // Check order status
        if (order.status !== 'paid') {
            return next(new AppError('Order must be paid before shipping', 400));
        }

        // Update order
        order.status = 'shipped';
        order.trackingNumber = trackingNumber;
        order.shippedAt = new Date();
        await order.save();

        res.status(200).json({
            success: true,
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Confirm order received (Buyer only)
// @route   PUT /api/orders/:id/confirm
// @access  Private
export const confirmOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new AppError('Order not found', 404));
        }

        // Check if user is the buyer
        if (order.buyerId.toString() !== req.user!._id.toString()) {
            return next(new AppError('Only buyer can confirm the order', 403));
        }

        // Check order status
        if (order.status !== 'shipped') {
            return next(new AppError('Order must be shipped before confirmation', 400));
        }

        // Update order
        order.status = 'completed';
        order.deliveredAt = new Date();
        order.completedAt = new Date();
        order.escrowStatus = 'released';
        await order.save();

        // Update product status to sold
        await Product.findByIdAndUpdate(order.productId, { status: 'sold' });

        // Create release transaction
        await Transaction.create({
            orderId: order._id,
            type: 'release',
            amount: order.sellerAmount,
            status: 'completed',
            paymentMethod: 'escrow_release'
        });

        console.log(`💰 Escrow released: ${order.sellerAmount} VND to seller`);

        res.status(200).json({
            success: true,
            data: { order },
            message: 'Order confirmed and payment released to seller'
        });
    } catch (error) {
        next(error);
    }
};