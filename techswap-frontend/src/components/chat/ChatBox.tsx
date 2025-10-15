import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Send, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { formatDate } from '@/lib/utils'
import { messageService } from '@/services/message.service'
import { initializeSocket, getSocket } from '@/lib/socket'
import { useAuthStore } from '@/store/authStore'
import type { Message } from '../../types/message.types'
import type { User } from '../../types/user.types'

interface ChatBoxProps {
    orderId: string
    otherUserId: string
    otherUserName: string
}

export default function ChatBox({ orderId, otherUserId, otherUserName }: ChatBoxProps) {
    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Fetch message history
    const { data, isLoading } = useQuery({
        queryKey: ['messages', orderId],
        queryFn: () => messageService.getMessages(orderId),
    })

    useEffect(() => {
        if (data?.data?.messages) {
            setMessages(data.data.messages)
        }
    }, [data])

    // Initialize socket
    useEffect(() => {
        if (!token) return

        const socket = initializeSocket(token)

        // Join room
        socket.emit('join-room', orderId)

        socket.on('joined-room', () => {
            console.log('✅ Joined chat room:', orderId)
        })

        // Listen for new messages
        socket.on('new-message', (message: Message) => {
            console.log('📨 New message received:', message)
            setMessages((prev) => [...prev, message])
        })

        // Listen for typing
        socket.on('user-typing', ({ userId }) => {
            if (userId !== user?._id) {
                setIsTyping(true)
            }
        })

        socket.on('user-stop-typing', ({ userId }) => {
            if (userId !== user?._id) {
                setIsTyping(false)
            }
        })

        return () => {
            socket.off('joined-room')
            socket.off('new-message')
            socket.off('user-typing')
            socket.off('user-stop-typing')
        }
    }, [orderId, token, user?._id])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    }, [messages])

    // Handle typing
    const handleTyping = () => {
        const socket = getSocket()
        if (!socket) return

        socket.emit('typing', { orderId })

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        // Stop typing after 2 seconds
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop-typing', { orderId })
        }, 2000)
    }

    // Send message
    const handleSendMessage = () => {
        if (!newMessage.trim() || isSending) return

        const socket = getSocket()
        if (!socket) {
            console.error('Socket not connected')
            return
        }

        setIsSending(true)

        try {
            // Emit message
            socket.emit('send-message', {
                orderId,
                message: newMessage.trim(),
                to: otherUserId,
            })

            // Clear input
            setNewMessage('')

            // Stop typing indicator
            socket.emit('stop-typing', { orderId })
        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            setIsSending(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[500px] bg-background border rounded-lg overflow-hidden">
            {/* Header - SAME */}
            <div className="p-4 border-b flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {otherUserName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium">{otherUserName}</p>
                        {isTyping && (
                            <p className="text-sm text-muted-foreground">typing...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages - SAME */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwnMessage = typeof message.from === 'object'
                            ? (message.from as User)._id === user?._id
                            : message.from === user?._id

                        return (
                            <div
                                key={message._id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg px-4 py-2 ${isOwnMessage
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                        }`}
                                >
                                    <p className="text-sm break-words">{message.message}</p>
                                    <p
                                        className={`text-xs mt-1 ${isOwnMessage
                                            ? 'text-primary-foreground/70'
                                            : 'text-muted-foreground'
                                            }`}
                                    >
                                        {new Date(message.createdAt).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input - CHANGED: div instead of form */}
            <div className="p-4 border-t flex-shrink-0">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value)
                            handleTyping()
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                e.stopPropagation()
                                handleSendMessage()
                            }
                        }}
                        className="flex-1"
                        maxLength={1000}
                    />
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleSendMessage()
                        }}
                        disabled={!newMessage.trim() || isSending}
                    >
                        {isSending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}