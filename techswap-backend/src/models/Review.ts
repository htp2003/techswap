import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    orderId: mongoose.Types.ObjectId;
    reviewerId: mongoose.Types.ObjectId;
    revieweeId: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
            unique: true // One review per order
        },
        reviewerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        revieweeId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating must be at most 5']
        },
        comment: {
            type: String,
            maxlength: [500, 'Comment cannot exceed 500 characters']
        }
    },
    {
        timestamps: true
    }
);

// Indexes
reviewSchema.index({ orderId: 1 }, { unique: true });
reviewSchema.index({ revieweeId: 1 });
reviewSchema.index({ createdAt: -1 });

export default mongoose.model<IReview>('Review', reviewSchema);