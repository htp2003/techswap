import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token: string | undefined;

        // Check Authorization header
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('Not authorized to access this route', 401));
        }

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) {
            return next(new AppError('Invalid or expired token', 401));
        }

        // Get user from token
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        req.user = user;
        next();
    } catch (error) {
        next(new AppError('Not authorized to access this route', 401));
    }
};