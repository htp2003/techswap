import { z } from 'zod';

export const createProductSchema = z.object({
    category: z.enum(['laptop', 'phone', 'tablet', 'camera', 'audio', 'gaming']),
    brand: z.string().min(1, 'Brand is required').trim(),
    modelName: z.string().min(1, 'Model is required').trim(),
    condition: z.enum(['like-new', 'excellent', 'good', 'fair']),
    price: z.number().min(10, 'Price must be at least $10').max(500000000, 'Price cannot exceed $500,000,000'),
    description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description cannot exceed 2000 characters'),
    specs: z.record(z.union([z.string(), z.coerce.number()])).optional(),
    location: z.string().min(1, 'Location is required').trim()
});

export const updateProductSchema = z.object({
    price: z.coerce.number().min(10).max(500000000).optional(),
    description: z.string().min(50).max(2000).optional(),
    status: z.enum(['available', 'sold', 'pending']).optional(),
    location: z.string().min(1).trim().optional()
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;