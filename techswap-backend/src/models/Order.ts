import mongoose, { Document, Schema } from 'mongoose';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'inspecting' | 'completed' | 'disputed' | 'cancelled';
export type EscrowStatus = 'held' | 'released' | 'refunded';

export interface IOrder extends Document {
    buyerId: mongoose.Types.ObjectId;
    sellerId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;

    amount: number;
    platformFee: number;
    sellerAmount: number;

    status: OrderStatus;
    escrowStatus: EscrowStatus;

    shippingAddress: string;
    trackingNumber?: string;

    paymentIntentId: string;
    vnp_TransactionNo?: string;
    vnp_BankCode?: string;

    inspectionDeadline?: Date;

    paidAt?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
    completedAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        buyerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        platformFee: {
            type: Number,
            default: 0,
            min: 0
        },
        sellerAmount: {
            type: Number,
            default: 0,
            min: 0
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'shipped', 'inspecting', 'completed', 'disputed', 'cancelled'],
            default: 'pending'
        },
        escrowStatus: {
            type: String,
            enum: ['held', 'released', 'refunded'],
            default: 'held'
        },
        shippingAddress: {
            type: String,
            required: true
        },
        trackingNumber: {
            type: String
        },
        paymentIntentId: {
            type: String,
            required: true,
            unique: true
        },
        vnp_TransactionNo: {
            type: String
        },
        vnp_BankCode: {
            type: String
        },
        inspectionDeadline: {
            type: Date
        },
        paidAt: {
            type: Date
        },
        shippedAt: {
            type: Date
        },
        deliveredAt: {
            type: Date
        },
        completedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Indexes
orderSchema.index({ buyerId: 1 });
orderSchema.index({ sellerId: 1 });
orderSchema.index({ productId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentIntentId: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model<IOrder>('Order', orderSchema);