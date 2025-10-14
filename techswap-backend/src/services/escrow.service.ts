import Order from '../models/Order';
import Product from '../models/Product';
import Transaction from '../models/Transaction';

export class EscrowService {
    /**
     * Auto-release escrow for orders past inspection deadline
     */
    async autoReleaseExpiredOrders(): Promise<void> {
        try {
            const now = new Date();

            // Find orders that are shipped and past deadline
            const expiredOrders = await Order.find({
                status: 'shipped',
                inspectionDeadline: { $lte: now },
                escrowStatus: 'held'
            });

            console.log(`🔄 Found ${expiredOrders.length} orders for auto-release`);

            for (const order of expiredOrders) {
                await this.releaseEscrow(order._id.toString());
            }

            console.log('✅ Auto-release completed');
        } catch (error) {
            console.error('❌ Auto-release error:', error);
        }
    }

    /**
     * Release escrow to seller
     */
    async releaseEscrow(orderId: string): Promise<void> {
        try {
            const order = await Order.findById(orderId);

            if (!order) {
                throw new Error('Order not found');
            }

            if (order.escrowStatus !== 'held') {
                console.log(`⚠️  Order ${orderId} escrow already ${order.escrowStatus}`);
                return;
            }

            console.log(`💰 Releasing escrow for order ${orderId}`);
            console.log(`   Amount: ${order.amount} VND`);
            console.log(`   Platform Fee (5%): ${order.platformFee} VND`);
            console.log(`   Seller receives: ${order.sellerAmount} VND`);

            // Update order
            order.status = 'completed';
            order.completedAt = new Date();
            order.escrowStatus = 'released';
            await order.save();

            // Update product to sold
            await Product.findByIdAndUpdate(order.productId, {
                status: 'sold'
            });

            // Create release transaction
            await Transaction.create({
                orderId: order._id,
                type: 'release',
                amount: order.sellerAmount,
                status: 'completed',
                paymentMethod: 'escrow_release',
                metadata: {
                    platformFee: order.platformFee,
                    releaseReason: 'auto_release'
                }
            });

            console.log(`✅ Escrow released for order ${orderId}`);
        } catch (error) {
            console.error(`❌ Failed to release escrow for order ${orderId}:`, error);
            throw error;
        }
    }

    /**
     * Refund escrow to buyer (in case of dispute)
     */
    async refundEscrow(orderId: string, reason: string): Promise<void> {
        try {
            const order = await Order.findById(orderId);

            if (!order) {
                throw new Error('Order not found');
            }

            if (order.escrowStatus !== 'held') {
                throw new Error(`Cannot refund: escrow status is ${order.escrowStatus}`);
            }

            console.log(`💸 Refunding escrow for order ${orderId}`);
            console.log(`   Amount: ${order.amount} VND`);
            console.log(`   Reason: ${reason}`);

            // Update order
            order.status = 'cancelled';
            order.escrowStatus = 'refunded';
            await order.save();

            // Restore product to available
            await Product.findByIdAndUpdate(order.productId, {
                status: 'available'
            });

            // Create refund transaction
            await Transaction.create({
                orderId: order._id,
                type: 'refund',
                amount: order.amount,
                status: 'completed',
                paymentMethod: 'escrow_refund',
                metadata: {
                    reason
                }
            });

            console.log(`✅ Escrow refunded for order ${orderId}`);
        } catch (error) {
            console.error(`❌ Failed to refund escrow for order ${orderId}:`, error);
            throw error;
        }
    }

    /**
     * Get escrow statistics
     */
    async getEscrowStats(): Promise<any> {
        const held = await Order.aggregate([
            { $match: { escrowStatus: 'held' } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        const released = await Order.aggregate([
            { $match: { escrowStatus: 'released' } },
            { $group: { _id: null, total: { $sum: '$sellerAmount' }, count: { $sum: 1 } } }
        ]);

        const refunded = await Order.aggregate([
            { $match: { escrowStatus: 'refunded' } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        return {
            held: held[0] || { total: 0, count: 0 },
            released: released[0] || { total: 0, count: 0 },
            refunded: refunded[0] || { total: 0, count: 0 }
        };
    }
}

export default new EscrowService();