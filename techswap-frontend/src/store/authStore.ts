import { create } from 'zustand'
import type { User } from '../types/user.types'

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    setAuth: (user: User, token: string) => void
    logout: () => void
    updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => {
    // Load from localStorage on init
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    return {
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken,
        isAuthenticated: !!storedToken,

        setAuth: (user, token) => {
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            set({ user, token, isAuthenticated: true })
        },

        logout: () => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            set({ user: null, token: null, isAuthenticated: false })
        },

        updateUser: (user) => {
            localStorage.setItem('user', JSON.stringify(user))
            set({ user })
        },
    }
})