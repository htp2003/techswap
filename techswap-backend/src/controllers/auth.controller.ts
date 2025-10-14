import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { generateToken } from '../utils/jwt';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate input
        const validatedData = registerSchema.parse(req.body);

        // Check if user exists
        const existingUser = await User.findOne({ email: validatedData.email });
        if (existingUser) {
            return next(new AppError('Email already registered', 400));
        }

        // Create user
        const user = await User.create(validatedData);

        // Generate token
        const token = generateToken(user._id.toString());

        // Return response (không trả password)
        res.status(201).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    avatar: user.avatar,
                    role: user.role,
                    verified: user.verified,
                    rating: user.rating,
                    createdAt: user.createdAt
                },
                token
            }
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate input
        const validatedData = loginSchema.parse(req.body);

        // Check if user exists (include password)
        const user = await User.findOne({ email: validatedData.email }).select('+password');
        if (!user) {
            return next(new AppError('Invalid credentials', 401));
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(validatedData.password);
        if (!isPasswordMatch) {
            return next(new AppError('Invalid credentials', 401));
        }

        // Generate token
        const token = generateToken(user._id.toString());

        // Return response
        res.status(200).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    avatar: user.avatar,
                    role: user.role,
                    verified: user.verified,
                    rating: user.rating,
                    createdAt: user.createdAt
                },
                token
            }
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;

        res.status(200).json({
            success: true,
            data: {
                user: {
                    _id: user?._id,
                    email: user?.email,
                    name: user?.name,
                    phone: user?.phone,
                    avatar: user?.avatar,
                    role: user?.role,
                    verified: user?.verified,
                    rating: user?.rating,
                    createdAt: user?.createdAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
};