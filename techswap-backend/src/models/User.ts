import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    phone?: string;
    avatar?: string;
    role: 'buyer' | 'seller' | 'both';
    verified: boolean;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false // Don't return password by default
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        phone: {
            type: String,
            trim: true,
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
        },
        avatar: {
            type: String,
            default: ''
        },
        role: {
            type: String,
            enum: ['buyer', 'seller', 'both'],
            default: 'buyer'
        },
        verified: {
            type: Boolean,
            default: false
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        }
    },
    {
        timestamps: true
    }
);

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);