import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import Order from '../models/Order';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { createReviewSchema } from '../schemas/review.schema';

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate input
        const validatedData = createReviewSchema.parse(req.body);

        // Get order
        const order = await Order.findById(validatedData.orderId);
        if (!order) {
            return next(new AppError('Order not found', 404));
        }

        // Check if order is completed
        if (order.status !== 'completed') {
            return next(new AppError('Can only review completed orders', 400));
        }

        // Check if user is buyer or seller
        const isBuyer = order.buyerId.toString() === req.user!._id.toString();
        const isSeller = order.sellerId.toString() === req.user!._id.toString();

        if (!isBuyer && !isSeller) {
            return next(new AppError('Not authorized to review this order', 403));
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({ orderId: order._id });
        if (existingReview) {
            return next(new AppError('Order already reviewed', 400));
        }

        // Determine reviewee (who is being reviewed)
        const revieweeId = isBuyer ? order.sellerId : order.buyerId;

        // Create review
        const review = await Review.create({
            orderId: order._id,
            reviewerId: req.user!._id,
            revieweeId,
            rating: validatedData.rating,
            comment: validatedData.comment
        });

        // Update reviewee's average rating
        await updateUserRating(revieweeId.toString());

        // Populate reviewer info
        await review.populate('reviewerId', 'name avatar');

        console.log(`⭐ Review created: ${validatedData.rating} stars`);

        res.status(201).json({
            success: true,
            data: { review }
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/:userId
// @access  Public
export const getUserReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.params;

        // Get all reviews for this user
        const reviews = await Review.find({ revieweeId: userId })
            .populate('reviewerId', 'name avatar')
            .sort('-createdAt')
            .limit(20);

        // Calculate average rating
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;

        res.status(200).json({
            success: true,
            data: {
                reviews,
                stats: {
                    totalReviews,
                    averageRating: parseFloat(averageRating.toFixed(1))
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Check if order can be reviewed
// @route   GET /api/reviews/check/:orderId
// @access  Private
export const checkReviewEligibility = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { orderId } = req.params;

        // Get order
        const order = await Order.findById(orderId);
        if (!order) {
            return next(new AppError('Order not found', 404));
        }

        // Check if user is part of this order
        const isBuyer = order.buyerId.toString() === req.user!._id.toString();
        const isSeller = order.sellerId.toString() === req.user!._id.toString();

        if (!isBuyer && !isSeller) {
            return next(new AppError('Not authorized', 403));
        }

        // Check if completed
        const isCompleted = order.status === 'completed';

        // Check if already reviewed
        const existingReview = await Review.findOne({ orderId });

        res.status(200).json({
            success: true,
            data: {
                canReview: isCompleted && !existingReview,
                reason: !isCompleted
                    ? 'Order must be completed'
                    : existingReview
                        ? 'Already reviewed'
                        : null
            }
        });
    } catch (error) {
        next(error);
    }
};

// Helper: Update user's average rating
async function updateUserRating(userId: string) {
    const reviews = await Review.find({ revieweeId: userId });

    if (reviews.length === 0) {
        await User.findByIdAndUpdate(userId, { rating: 0 });
        return;
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await User.findByIdAndUpdate(userId, {
        rating: parseFloat(averageRating.toFixed(1))
    });

    console.log(`📊 User ${userId} rating updated: ${averageRating.toFixed(1)}`);
}