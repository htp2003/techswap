import { z } from 'zod';

export const createReviewSchema = z.object({
    orderId: z.string().min(1, 'Order ID is required'),
    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    comment: z.string().max(500, 'Comment cannot exceed 500 characters').optional()
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;