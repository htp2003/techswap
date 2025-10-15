import api from '@/lib/api'
import type { Order } from '../types/order.types'
import type { ApiResponse, PaginatedResponse } from '../types/api.types'

export const orderService = {
    // Create payment (checkout)
    async createPayment(data: { productId: string; shippingAddress: string }): Promise<ApiResponse<{ orderId: string; paymentUrl: string; amount: number }>> {
        const response = await api.post<ApiResponse<{ orderId: string; paymentUrl: string; amount: number }>>('/payments/create', data)
        return response.data
    },

    // Mock payment success (for testing)
    async mockPaymentSuccess(orderId: string): Promise<ApiResponse<{ order: Order }>> {
        const response = await api.post<ApiResponse<{ order: Order }>>('/payments/mock-success', { orderId })
        return response.data
    },

    // Get my purchases
    async getMyPurchases(page = 1): Promise<PaginatedResponse<Order>> {
        const response = await api.get<PaginatedResponse<Order>>(`/orders/my-purchases?page=${page}`)
        return response.data
    },

    // Get my sales
    async getMySales(page = 1): Promise<PaginatedResponse<Order>> {
        const response = await api.get<PaginatedResponse<Order>>(`/orders/my-sales?page=${page}`)
        return response.data
    },

    // Get single order
    async getOrder(id: string): Promise<ApiResponse<{ order: Order }>> {
        const response = await api.get<ApiResponse<{ order: Order }>>(`/orders/${id}`)
        return response.data
    },

    // Seller: Ship order
    async shipOrder(id: string, trackingNumber: string): Promise<ApiResponse<{ order: Order }>> {
        const response = await api.put<ApiResponse<{ order: Order }>>(`/orders/${id}/ship`, { trackingNumber })
        return response.data
    },

    // Buyer: Confirm order
    async confirmOrder(id: string): Promise<ApiResponse<{ order: Order }>> {
        const response = await api.put<ApiResponse<{ order: Order }>>(`/orders/${id}/confirm`)
        return response.data
    },

    // Buyer: Dispute order
    async disputeOrder(id: string, reason: string): Promise<ApiResponse<{ order: Order }>> {
        const response = await api.put<ApiResponse<{ order: Order }>>(`/orders/${id}/dispute`, { reason })
        return response.data
    },
}