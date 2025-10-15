import api from '@/lib/api'
import type { Message } from '../types/message.types'
import type { ApiResponse } from '../types/api.types'

export const messageService = {
    // Get message history
    async getMessages(orderId: string): Promise<ApiResponse<{ messages: Message[] }>> {
        const response = await api.get<ApiResponse<{ messages: Message[] }>>(`/messages/${orderId}`)
        return response.data
    },

    // Mark as read
    async markAsRead(messageId: string): Promise<ApiResponse<{ message: Message }>> {
        const response = await api.put<ApiResponse<{ message: Message }>>(`/messages/${messageId}/read`)
        return response.data
    },
}