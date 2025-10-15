import type { User } from './user.types'

export interface Message {
    _id: string
    orderId: string
    from: string | User
    to: string
    message: string
    read: boolean
    createdAt: string
}

export interface SendMessageData {
    orderId: string
    message: string
    to: string
}