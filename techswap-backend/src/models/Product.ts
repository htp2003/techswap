import mongoose, { Document, Schema } from 'mongoose';

export type ProductCategory = 'laptop' | 'phone' | 'tablet' | 'camera' | 'audio' | 'gaming';
export type ProductCondition = 'like-new' | 'excellent' | 'good' | 'fair';
export type ProductStatus = 'available' | 'sold' | 'pending';

export interface IProduct extends Document {
    sellerId: mongoose.Types.ObjectId;
    category: ProductCategory;
    brand: string;
    modelName: string;
    condition: ProductCondition;
    price: number;
    description: string;
    specs: Record<string, string | number>;
    images: string[];
    status: ProductStatus;
    views: number;
    location: string;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Seller ID is required']
        },
        category: {
            type: String,
            enum: ['laptop', 'phone', 'tablet', 'camera', 'audio', 'gaming'],
            required: [true, 'Category is required']
        },
        brand: {
            type: String,
            required: [true, 'Brand is required'],
            trim: true
        },
        modelName: {
            type: String,
            required: [true, 'Model is required'],
            trim: true
        },
        condition: {
            type: String,
            enum: ['like-new', 'excellent', 'good', 'fair'],
            required: [true, 'Condition is required']
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [10, 'Price must be at least $10'],
            max: [500000000, 'Price cannot exceed $500,000,000']
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            minlength: [50, 'Description must be at least 50 characters'],
            maxlength: [2000, 'Description cannot exceed 2000 characters']
        },
        specs: {
            type: Map,
            of: Schema.Types.Mixed,
            default: {}
        },
        images: {
            type: [String],
            validate: {
                validator: function (arr: string[]) {
                    return arr.length >= 3 && arr.length <= 8;
                },
                message: 'Product must have between 3 and 8 images'
            }
        },
        status: {
            type: String,
            enum: ['available', 'sold', 'pending'],
            default: 'available'
        },
        views: {
            type: Number,
            default: 0
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Indexes for performance
productSchema.index({ sellerId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ category: 1, status: 1, price: 1 }); // Compound index

export default mongoose.model<IProduct>('Product', productSchema);