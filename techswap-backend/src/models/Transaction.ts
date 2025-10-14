import mongoose, { Document, Schema } from 'mongoose';

export type TransactionType = 'payment' | 'release' | 'refund';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface ITransaction extends Document {
    orderId: mongoose.Types.ObjectId;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;
    paymentMethod: string;

    vnp_TxnRef?: string;
    vnp_TransactionNo?: string;
    vnp_BankCode?: string;
    vnp_CardType?: string;

    metadata?: Record<string, any>;

    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        type: {
            type: String,
            enum: ['payment', 'release', 'refund'],
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        },
        paymentMethod: {
            type: String,
            required: true
        },
        vnp_TxnRef: {
            type: String
        },
        vnp_TransactionNo: {
            type: String
        },
        vnp_BankCode: {
            type: String
        },
        vnp_CardType: {
            type: String
        },
        metadata: {
            type: Schema.Types.Mixed
        }
    },
    {
        timestamps: true
    }
);

// Indexes
transactionSchema.index({ orderId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

export default mongoose.model<ITransaction>('Transaction', transactionSchema);