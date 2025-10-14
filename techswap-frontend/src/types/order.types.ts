import type { User } from './user.types'
import type { Product } from './product.types'

export type OrderStatus =
    | 'pending'
    | 'paid'
    | 'shipped'
    | 'inspecting'
    | 'completed'
    | 'disputed'
    | 'cancelled'

export type EscrowStatus = 'held' | 'released' | 'refunded'

export interface Order {
    _id: string
    buyerId: string | User
    sellerId: string | User
    productId: string | Product
    amount: number
    platformFee: number
    sellerAmount: number
    status: OrderStatus
    escrowStatus: EscrowStatus
    shippingAddress: string
    trackingNumber?: string
    paymentIntentId: string
    vnp_TransactionNo?: string
    inspectionDeadline?: string
    paidAt?: string
    shippedAt?: string
    deliveredAt?: string
    completedAt?: string
    createdAt: string
    updatedAt: string
}

export interface CreatePaymentInput {
    productId: string
    shippingAddress: string
}

export interface ShipOrderInput {
    trackingNumber: string
}

export interface DisputeOrderInput {
    reason: string
    evidence?: string
}