import api from '@/lib/api'
import type { Product, ProductFilters } from '../types/product.types'
import type { ApiResponse, PaginatedResponse } from '../types/api.types'

export const productService = {
    // Get all products with filters
    async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
        const params = new URLSearchParams()

        if (filters?.category) params.append('category', filters.category)
        if (filters?.condition) params.append('condition', filters.condition)
        if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString())
        if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
        if (filters?.search) params.append('search', filters.search)
        if (filters?.status) params.append('status', filters.status)
        if (filters?.page) params.append('page', filters.page.toString())
        if (filters?.limit) params.append('limit', filters.limit.toString())
        if (filters?.sort) params.append('sort', filters.sort)

        const response = await api.get<PaginatedResponse<Product>>(`/products?${params}`)
        return response.data
    },

    // Get single product
    async getProduct(id: string): Promise<ApiResponse<{ product: Product }>> {
        const response = await api.get<ApiResponse<{ product: Product }>>(`/products/${id}`)
        return response.data
    },

    // Create product
    async createProduct(formData: FormData): Promise<ApiResponse<{ product: Product }>> {
        const response = await api.post<ApiResponse<{ product: Product }>>('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },

    // Update product
    async updateProduct(id: string, data: Partial<Product>): Promise<ApiResponse<{ product: Product }>> {
        const response = await api.put<ApiResponse<{ product: Product }>>(`/products/${id}`, data)
        return response.data
    },

    // Delete product
    async deleteProduct(id: string): Promise<ApiResponse<null>> {
        const response = await api.delete<ApiResponse<null>>(`/products/${id}`)
        return response.data
    },

    // Get my listings
    async getMyListings(page = 1): Promise<PaginatedResponse<Product>> {
        const response = await api.get<PaginatedResponse<Product>>(`/products/my/listings?page=${page}`)
        return response.data
    },
}