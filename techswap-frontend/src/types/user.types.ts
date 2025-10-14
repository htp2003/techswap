export interface User {
    _id: string
    email: string
    name: string
    phone?: string
    avatar?: string
    role: 'buyer' | 'seller' | 'both'
    verified: boolean
    rating: number
    createdAt: string
}

export interface AuthResponse {
    success: boolean
    data: {
        user: User
        token: string
    }
}

export interface LoginInput {
    email: string
    password: string
}

export interface RegisterInput {
    email: string
    password: string
    name: string
    phone?: string
}