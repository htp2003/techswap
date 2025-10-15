import type { User } from './user.types'

export interface Review {
    _id: string
    orderId: string
    reviewerId: string | User
    revieweeId: string
    rating: number
    comment?: string
    createdAt: string
}

export interface CreateReviewInput {
    orderId: string
    rating: number
    comment?: string
}

export interface ReviewStats {
    totalReviews: number
    averageRating: number
}