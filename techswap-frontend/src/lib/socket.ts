import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initializeSocket = (token: string): Socket => {
    if (socket?.connected) {
        return socket
    }

    socket = io(`${import.meta.env.VITE_SOCKET_URL}/chat`, {
        auth: {
            token,
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    })

    socket.on('connect', () => {
        console.log('✅ Socket connected')
    })

    socket.on('disconnect', () => {
        console.log('❌ Socket disconnected')
    })

    socket.on('error', (error) => {
        console.error('Socket error:', error)
    })

    return socket
}

export const getSocket = (): Socket | null => {
    return socket
}

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}