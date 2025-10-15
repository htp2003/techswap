import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    orderId: mongoose.Types.ObjectId;
    from: mongoose.Types.ObjectId;
    to: mongoose.Types.ObjectId;
    message: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        from: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            maxlength: [1000, 'Message cannot exceed 1000 characters'],
            trim: true
        },
        read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Indexes
messageSchema.index({ orderId: 1, createdAt: 1 });
messageSchema.index({ from: 1, to: 1 });

export default mongoose.model<IMessage>('Message', messageSchema);