import type { User } from './user.types'

export type ProductCategory = 'laptop' | 'phone' | 'tablet' | 'camera' | 'audio' | 'gaming'
export type ProductCondition = 'like-new' | 'excellent' | 'good' | 'fair'
export type ProductStatus = 'available' | 'sold' | 'pending'

export interface Product {
    _id: string
    sellerId: string | User
    category: ProductCategory
    brand: string
    modelName: string
    condition: ProductCondition
    price: number
    description: string
    specs: Record<string, string | number>
    images: string[]
    status: ProductStatus
    views: number
    location: string
    createdAt: string
    updatedAt: string
}

export interface CreateProductInput {
    category: ProductCategory
    brand: string
    modelName: string
    condition: ProductCondition
    price: number
    description: string
    specs?: Record<string, string | number>
    location: string
}

export interface ProductFilters {
    category?: ProductCategory
    condition?: ProductCondition
    minPrice?: number
    maxPrice?: number
    search?: string
    status?: ProductStatus
    page?: number
    limit?: number
    sort?: string
}