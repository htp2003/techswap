import multer from 'multer';
import { Request } from 'express';
import { AppError } from './errorHandler';

// Use memory storage (store in buffer, not disk)
const storage = multer.memoryStorage();

// File filter - only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new AppError('Only image files are allowed', 400));
    }
};

// Multer config
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    }
});

export default upload;