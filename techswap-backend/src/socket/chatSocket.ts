import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../models/Message';
import Order from '../models/Order';
import User from '../models/User';

interface AuthSocket extends Socket {
    userId?: string;
}

export const setupChatSocket = (io: Server) => {
    // Chat namespace
    const chatNamespace = io.of('/chat');

    // Authentication middleware
    chatNamespace.use(async (socket: AuthSocket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error'));
            }

            // Verify token
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            socket.userId = decoded.id;

            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    chatNamespace.on('connection', (socket: AuthSocket) => {
        console.log(`💬 User connected: ${socket.userId}`);

        // Join order chat room
        socket.on('join-room', async (orderId: string) => {
            try {
                // Verify user has access to this order
                const order = await Order.findById(orderId);

                if (!order) {
                    socket.emit('error', { message: 'Order not found' });
                    return;
                }

                const isBuyer = order.buyerId.toString() === socket.userId;
                const isSeller = order.sellerId.toString() === socket.userId;

                if (!isBuyer && !isSeller) {
                    socket.emit('error', { message: 'Not authorized' });
                    return;
                }

                // Join room
                socket.join(orderId);
                console.log(`👥 User ${socket.userId} joined room ${orderId}`);

                socket.emit('joined-room', { orderId });
            } catch (error) {
                console.error('Join room error:', error);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        // Send message
        socket.on('send-message', async (data: { orderId: string; message: string; to: string }) => {
            try {
                const { orderId, message: messageText, to } = data;

                // Validate
                if (!messageText || !messageText.trim()) {
                    socket.emit('error', { message: 'Message cannot be empty' });
                    return;
                }

                if (messageText.length > 1000) {
                    socket.emit('error', { message: 'Message too long' });
                    return;
                }

                // Save to database
                const message = await Message.create({
                    orderId,
                    from: socket.userId,
                    to,
                    message: messageText.trim(),
                    read: false
                });

                // Populate sender info
                await message.populate('from', 'name avatar');

                // Broadcast to room
                chatNamespace.to(orderId).emit('new-message', message);

                console.log(`📨 Message sent in room ${orderId}`);
            } catch (error) {
                console.error('Send message error:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Typing indicator
        socket.on('typing', (data: { orderId: string }) => {
            socket.to(data.orderId).emit('user-typing', {
                userId: socket.userId
            });
        });

        // Stop typing
        socket.on('stop-typing', (data: { orderId: string }) => {
            socket.to(data.orderId).emit('user-stop-typing', {
                userId: socket.userId
            });
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`💬 User disconnected: ${socket.userId}`);
        });
    });

    console.log('✅ Chat socket initialized');
};