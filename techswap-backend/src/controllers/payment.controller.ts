import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Transaction from '../models/Transaction';
import { AppError } from '../middleware/errorHandler';
import vnpayService from '../services/vnpay.service';

// @desc    Create payment URL
// @route   POST /api/payments/create
// @access  Private
export const createPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log('=== ENV DEBUG ===');
        console.log('VNPAY_TMN_CODE:', process.env.VNPAY_TMN_CODE);
        console.log('VNPAY_HASH_SECRET:', process.env.VNPAY_HASH_SECRET ? '***' : 'MISSING');
        console.log('=================');
        const { productId, shippingAddress } = req.body;

        if (!productId || !shippingAddress) {
            return next(new AppError('Product ID and shipping address are required', 400));
        }

        // Get product
        const product = await Product.findById(productId);
        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        // Check product availability
        if (product.status !== 'available') {
            return next(new AppError('Product is not available', 400));
        }

        // Check if buyer is not the seller
        if (product.sellerId.toString() === req.user!._id.toString()) {
            return next(new AppError('You cannot buy your own product', 400));
        }

        // Generate unique order reference
        const orderRef = `ORD${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;

        // Calculate amounts
        const amount = product.price;
        const platformFee = Math.round(amount * 0.05); // 5% platform fee
        const sellerAmount = amount - platformFee;

        // Create order (status: pending)
        const order = await Order.create({
            buyerId: req.user!._id,
            sellerId: product.sellerId,
            productId: product._id,
            amount,
            platformFee,
            sellerAmount,
            status: 'pending',
            escrowStatus: 'held',
            shippingAddress,
            paymentIntentId: orderRef
        });

        // Create pending transaction
        await Transaction.create({
            orderId: order._id,
            type: 'payment',
            amount,
            status: 'pending',
            paymentMethod: 'vnpay',
            vnp_TxnRef: orderRef
        });

        // Get client IP
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            '127.0.0.1';

        // Create VNPay payment URL
        const paymentUrl = vnpayService.createPaymentUrl({
            amount,
            orderInfo: `Thanh toan don hang ${orderRef}`,
            orderId: orderRef,
            returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:5173/payment/callback',
            ipAddr: Array.isArray(ipAddr) ? ipAddr[0] : ipAddr
        });

        console.log('💳 Payment URL created:', paymentUrl);

        res.status(200).json({
            success: true,
            data: {
                orderId: order._id,
                paymentUrl,
                amount
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Handle VNPay return callback
// @route   GET /api/payments/callback
// @access  Public
export const handleCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log('📥 VNPay callback received:', req.query);

        const vnp_Params = req.query;

        // Verify signature
        const verification = vnpayService.verifyReturnUrl(vnp_Params);

        if (!verification.isValid) {
            console.error('❌ Invalid VNPay signature');
            // Redirect to frontend failure page
            return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?reason=invalid_signature`);
        }

        // Get order
        const paymentIntentId = vnp_Params.vnp_TxnRef as string;
        const order = await Order.findOne({ paymentIntentId });

        if (!order) {
            console.error('❌ Order not found:', paymentIntentId);
            return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?reason=order_not_found`);
        }

        // Check if payment successful
        if (vnp_Params.vnp_ResponseCode === '00') {
            // Payment success
            console.log('✅ Payment successful for order:', order._id);

            // Update order
            order.status = 'paid';
            order.paidAt = new Date();
            order.vnp_TransactionNo = vnp_Params.vnp_TransactionNo as string;
            order.vnp_BankCode = vnp_Params.vnp_BankCode as string;
            await order.save();

            // Update product status
            await Product.findByIdAndUpdate(order.productId, {
                status: 'pending'
            });

            // Update transaction
            await Transaction.findOneAndUpdate(
                {
                    orderId: order._id,
                    type: 'payment'
                },
                {
                    status: 'completed',
                    vnp_TransactionNo: vnp_Params.vnp_TransactionNo,
                    vnp_BankCode: vnp_Params.vnp_BankCode,
                    vnp_CardType: vnp_Params.vnp_CardType
                }
            );

            // Redirect to success page
            return res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${order._id}`);
        } else {
            // Payment failed
            console.log('❌ Payment failed:', vnp_Params.vnp_ResponseCode);

            // Update order
            order.status = 'cancelled';
            await order.save();

            // Update transaction
            await Transaction.findOneAndUpdate(
                { orderId: order._id, type: 'payment' },
                { status: 'failed' }
            );

            // Restore product status
            await Product.findByIdAndUpdate(order.productId, {
                status: 'available'
            });

            return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?reason=payment_failed`);
        }
    } catch (error) {
        console.error('❌ Callback error:', error);
        next(error);
    }
};

// @desc    Get payment status
// @route   GET /api/payments/:orderId/status
// @access  Private
export const getPaymentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('productId', 'modelName brand images price')
            .populate('sellerId', 'name email')
            .populate('buyerId', 'name email');

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

// @desc    Mock payment success (for testing without VNPay)
// @route   POST /api/payments/mock-success
// @access  Private
export const mockPaymentSuccess = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return next(new AppError('Order ID is required', 400));
        }

        // Get order
        const order = await Order.findById(orderId);

        if (!order) {
            return next(new AppError('Order not found', 404));
        }

        // Check authorization
        if (order.buyerId.toString() !== req.user!._id.toString()) {
            return next(new AppError('Not authorized', 403));
        }

        // Check if already paid
        if (order.status !== 'pending') {
            return next(new AppError('Order is not pending', 400));
        }

        console.log('💳 MOCK PAYMENT: Simulating successful payment for order:', order._id);

        // Update order - simulate successful payment
        order.status = 'paid';
        order.paidAt = new Date();
        order.vnp_TransactionNo = `MOCK${Date.now()}`;
        order.vnp_BankCode = 'NCB';
        await order.save();

        // Update product status
        await Product.findByIdAndUpdate(order.productId, {
            status: 'pending'
        });

        // Update transaction
        await Transaction.findOneAndUpdate(
            { orderId: order._id, type: 'payment' },
            {
                status: 'completed',
                vnp_TransactionNo: order.vnp_TransactionNo,
                vnp_BankCode: 'NCB',
                vnp_CardType: 'ATM'
            }
        );

        console.log('✅ MOCK PAYMENT: Order paid successfully');

        res.status(200).json({
            success: true,
            data: { order },
            message: 'Payment mocked successfully (for testing)'
        });
    } catch (error) {
        next(error);
    }
};