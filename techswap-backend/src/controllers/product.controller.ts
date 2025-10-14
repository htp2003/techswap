import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { AppError } from '../middleware/errorHandler';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/upload.service';

// @desc    Create product
// @route   POST /api/products
// @access  Private
export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log('📥 req.body:', req.body);
        console.log('📁 req.files:', req.files);

        // Transform price to number
        if (req.body.price !== undefined) {
            req.body.price = Number(req.body.price);
        }

        // Transform specs values
        if (req.body.specs && typeof req.body.specs === 'object') {
            Object.keys(req.body.specs).forEach(key => {
                const value = req.body.specs[key];
                if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
                    req.body.specs[key] = Number(value);
                }
            });
        }

        // Validate input
        const validatedData = createProductSchema.parse(req.body);

        // Check files
        const files = req.files as Express.Multer.File[];
        if (!files || files.length < 3 || files.length > 8) {
            return next(new AppError('Please upload between 3 and 8 images', 400));
        }

        console.log('☁️  Uploading to Cloudinary...');

        // Upload images to Cloudinary
        const imageUploadPromises = files.map(file =>
            uploadToCloudinary(file.buffer, 'techswap/products')
        );
        const imageUrls = await Promise.all(imageUploadPromises);

        console.log('✅ Uploaded images:', imageUrls);

        // Create product
        const product = await Product.create({
            ...validatedData,
            sellerId: req.user!._id,
            images: imageUrls
        });

        await product.populate('sellerId', 'name email avatar rating verified');

        res.status(201).json({
            success: true,
            data: { product }
        });
    } catch (error: any) {
        console.error('❌ Error:', error);
        if (error.name === 'ZodError') {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};
// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            category,
            condition,
            minPrice,
            maxPrice,
            search,
            status = 'available',
            page = '1',
            limit = '20',
            sort = '-createdAt'
        } = req.query;

        // Build query
        const query: any = {};

        if (status) query.status = status;
        if (category) query.category = category;
        if (condition) query.condition = condition;

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (search) {
            query.$or = [
                { brand: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const products = await Product
            .find(query)
            .populate('sellerId', 'name avatar rating verified')
            .sort(sort as string)
            .skip(skip)
            .limit(limitNum);

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                products,
                pagination: {
                    total,
                    page: pageNum,
                    pages: Math.ceil(total / limitNum)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const product = await Product
            .findById(req.params.id)
            .populate('sellerId', 'name email phone avatar rating verified createdAt');

        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        // Increment views
        product.views += 1;
        await product.save();

        res.status(200).json({
            success: true,
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Owner only)
export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        // Check ownership
        if (product.sellerId.toString() !== req.user!._id.toString()) {
            return next(new AppError('Not authorized to update this product', 403));
        }

        // Cannot update if sold
        if (product.status === 'sold') {
            return next(new AppError('Cannot update sold product', 400));
        }

        // Validate input
        const validatedData = updateProductSchema.parse(req.body);

        // Update
        Object.assign(product, validatedData);
        await product.save();

        res.status(200).json({
            success: true,
            data: { product }
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Owner only)
export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        // Check ownership
        if (product.sellerId.toString() !== req.user!._id.toString()) {
            return next(new AppError('Not authorized to delete this product', 403));
        }

        // Can only delete if available
        if (product.status !== 'available') {
            return next(new AppError('Cannot delete product that is not available', 400));
        }

        // Delete images from Cloudinary
        const deletePromises = product.images.map(url => deleteFromCloudinary(url));
        await Promise.all(deletePromises);

        // Delete product
        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my products
// @route   GET /api/products/my-listings
// @access  Private
export const getMyProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { status, page = '1', limit = '20' } = req.query;

        const query: any = { sellerId: req.user!._id };
        if (status) query.status = status;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const products = await Product
            .find(query)
            .sort('-createdAt')
            .skip(skip)
            .limit(limitNum);

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                products,
                pagination: {
                    total,
                    page: pageNum,
                    pages: Math.ceil(total / limitNum)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};