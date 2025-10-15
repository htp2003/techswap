import api from '@/lib/api'
import type { Review, CreateReviewInput, ReviewStats } from '../types/review.types'
import type { ApiResponse } from '../types/api.types'

export const reviewService = {
    // Create review
    async createReview(data: CreateReviewInput): Promise<ApiResponse<{ review: Review }>> {
        const response = await api.post<ApiResponse<{ review: Review }>>('/reviews', data)
        return response.data
    },

    // Get user reviews
    async getUserReviews(userId: string): Promise<ApiResponse<{ reviews: Review[]; stats: ReviewStats }>> {
        const response = await api.get<ApiResponse<{ reviews: Review[]; stats: ReviewStats }>>(`/reviews/${userId}`)
        return response.data
    },

    // Check if can review order
    async checkReviewEligibility(orderId: string): Promise<ApiResponse<{ canReview: boolean; reason: string | null }>> {
        const response = await api.get<ApiResponse<{ canReview: boolean; reason: string | null }>>(`/reviews/check/${orderId}`)
        return response.data
    },
}