import api from "@/lib/api"
import type { AuthResponse } from '../types/user.types'

interface LoginData {
    email: string
    password: string
}

interface RegisterData {
    email: string
    password: string
    name: string
    phone?: string
}

export const authService = {
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data)
        return response.data
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data)
        return response.data
    },

    async getMe(): Promise<AuthResponse> {
        const response = await api.get<AuthResponse>('/auth/me')
        return response.data
    },
}