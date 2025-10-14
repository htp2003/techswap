// Generic API response wrapper
export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
}

// Paginated response
export interface PaginatedResponse<T> {
    success: boolean
    data: {
        products?: T[]  // ← For products
        orders?: T[]    // ← For orders (later)
        pagination: {
            total: number
            page: number
            pages: number
        }
    }
}

// Error response
export interface ApiError {
    success: false
    message: string
    stack?: string
}