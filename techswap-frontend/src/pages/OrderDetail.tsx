import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import {
    ArrowLeft,
    Truck,
    CheckCircle,
    AlertCircle,
    MapPin
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Star } from 'lucide-react'
import CreateReviewForm from '@/components/reviews/CreateReviewForm'
import { reviewService } from '@/services/review.service'
import OrderStatusBadge from '@/components/orders/OrderStatusBadge'
import { formatPrice, formatDate } from '@/lib/utils'
import { orderService } from '@/services/order.service'
import { useAuthStore } from '@/store/authStore'
import { MessageCircle } from 'lucide-react'
import ChatBox from '@/components/chat/ChatBox'
import type { User as UserType } from '../types/user.types'

export default function OrderDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const user = useAuthStore((state) => state.user)
    const [trackingNumber, setTrackingNumber] = useState('')
    const [disputeReason, setDisputeReason] = useState('')
    const [showDisputeForm, setShowDisputeForm] = useState(false)
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [showChat, setShowChat] = useState(false)

    // Fetch order
    const { data, isLoading } = useQuery({
        queryKey: ['order', id],
        queryFn: () => orderService.getOrder(id!),
        enabled: !!id,
    })

    const order = data?.data?.order
    const product = typeof order?.productId === 'object' ? order.productId as any : null
    const buyer = typeof order?.buyerId === 'object' ? order.buyerId as UserType : null
    const seller = typeof order?.sellerId === 'object' ? order.sellerId as UserType : null

    const isBuyer = order?.buyerId === user?._id || (buyer as any)?._id === user?._id
    const isSeller = order?.sellerId === user?._id || (seller as any)?._id === user?._id
    // Check review eligibility
    const { data: eligibilityData } = useQuery({
        queryKey: ['review-eligibility', id],
        queryFn: () => reviewService.checkReviewEligibility(id!),
        enabled: !!id && order?.status === 'completed',
    })

    const canReview = eligibilityData?.data?.canReview
    // Ship order mutation
    const shipMutation = useMutation({
        mutationFn: () => orderService.shipOrder(id!, trackingNumber),
        onSuccess: () => {
            toast.success('Order marked as shipped!')
            queryClient.invalidateQueries({ queryKey: ['order', id] })
            setTrackingNumber('')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to ship order')
        },
    })

    // Confirm order mutation
    const confirmMutation = useMutation({
        mutationFn: () => orderService.confirmOrder(id!),
        onSuccess: () => {
            toast.success('Order confirmed! Payment released to seller.')
            queryClient.invalidateQueries({ queryKey: ['order', id] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to confirm order')
        },
    })

    // Dispute order mutation
    const disputeMutation = useMutation({
        mutationFn: () => orderService.disputeOrder(id!, disputeReason),
        onSuccess: () => {
            toast.success('Dispute submitted. Support team will review.')
            queryClient.invalidateQueries({ queryKey: ['order', id] })
            setShowDisputeForm(false)
            setDisputeReason('')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to submit dispute')
        },
    })

    if (isLoading) {
        return (
            <div className="py-8">
                <p className="text-center text-muted-foreground">Loading order...</p>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="py-8">
                <p className="text-center text-destructive">Order not found</p>
            </div>
        )
    }

    return (
        <div className="py-8">
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => navigate(isBuyer ? '/my-purchases' : '/my-sales')}
                className="mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
            </Button>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Order Details</h1>
                        <p className="text-muted-foreground">Order ID: {order._id}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product */}
                    {product && (
                        <div className="bg-background border rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Product</h2>
                            <div className="flex gap-4">
                                <img
                                    src={product.images?.[0]}
                                    alt={product.modelName}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">
                                        {product.brand} {product.modelName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground capitalize mb-2">
                                        {product.condition?.replace('-', ' ')}
                                    </p>
                                    <p className="text-xl font-bold text-primary">
                                        {formatPrice(order.amount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shipping Info */}
                    <div className="bg-background border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium">Shipping Address</p>
                                    <p className="text-muted-foreground">{order.shippingAddress}</p>
                                </div>
                            </div>

                            {order.trackingNumber && (
                                <div className="flex items-start gap-3">
                                    <Truck className="w-5 h-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Tracking Number</p>
                                        <p className="text-muted-foreground font-mono">{order.trackingNumber}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="bg-background border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Timeline</h2>
                        <div className="space-y-4">
                            {order.paidAt && (
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Payment Received</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(order.paidAt)}</p>
                                    </div>
                                </div>
                            )}

                            {order.shippedAt && (
                                <div className="flex items-start gap-3">
                                    <Truck className="w-5 h-5 text-blue-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Order Shipped</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(order.shippedAt)}</p>
                                    </div>
                                </div>
                            )}

                            {order.completedAt && (
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Order Completed</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(order.completedAt)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-background border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Actions</h2>

                        {/* Seller: Ship Order */}
                        {isSeller && order.status === 'paid' && (
                            <div className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    Enter tracking number to mark order as shipped
                                </p>
                                <div className="flex gap-3">
                                    <Input
                                        placeholder="Tracking number"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={() => shipMutation.mutate()}
                                        disabled={!trackingNumber || shipMutation.isPending}
                                    >
                                        <Truck className="w-4 h-4 mr-2" />
                                        Ship Order
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Buyer: Confirm/Dispute */}
                        {isBuyer && order.status === 'shipped' && (
                            <div className="space-y-3">
                                <p className="text-sm text-muted-foreground mb-3">
                                    Have you received the product in good condition?
                                </p>

                                {!showDisputeForm ? (
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={() => confirmMutation.mutate()}
                                            disabled={confirmMutation.isPending}
                                            className="flex-1"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Confirm Delivery
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => setShowDisputeForm(true)}
                                            className="flex-1"
                                        >
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            Dispute
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <textarea
                                            rows={4}
                                            placeholder="Describe the issue with your order..."
                                            value={disputeReason}
                                            onChange={(e) => setDisputeReason(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg bg-background resize-none"
                                        />
                                        <div className="flex gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setShowDisputeForm(false)
                                                    setDisputeReason('')
                                                }}
                                                className="flex-1"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => disputeMutation.mutate()}
                                                disabled={!disputeReason || disputeMutation.isPending}
                                                className="flex-1"
                                            >
                                                Submit Dispute
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Completed */}
                        {order.status === 'completed' && (
                            <div className="text-center py-4">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <p className="font-semibold">Order Completed!</p>
                                <p className="text-sm text-muted-foreground">
                                    {isBuyer ? 'Payment released to seller' : 'Payment received'}
                                </p>
                            </div>
                        )}
                    </div>
                    {/* Review Section - Only show if order completed */}
                    {order.status === 'completed' && (
                        <div className="bg-background border rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Review</h2>

                            {canReview ? (
                                <div className="text-center py-4">
                                    <p className="text-muted-foreground mb-4">
                                        How was your experience?
                                    </p>
                                    <Button onClick={() => setShowReviewForm(true)}>
                                        <Star className="w-4 h-4 mr-2" />
                                        Leave a Review
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted-foreground">
                                        {eligibilityData?.data?.reason || 'Review already submitted'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Review Form Modal */}
                    {showReviewForm && (
                        <CreateReviewForm
                            orderId={id!}
                            onClose={() => setShowReviewForm(false)}
                        />
                    )}
                    {/* Chat Section */}
                    <div className="mt-6">
                        {/* Chat Toggle Button */}
                        <button
                            onClick={() => setShowChat(!showChat)}
                            className={`w-full group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${showChat
                                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg shadow-blue-200/50'
                                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:scale-[1.02]'
                                }`}
                        >
                            {/* Animated gradient background on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${showChat ? 'opacity-100' : ''}`} />

                            <div className="relative p-4 sm:p-5 flex items-center gap-4">
                                {/* Icon with animation */}
                                <div className={`flex-shrink-0 relative ${showChat ? 'animate-pulse' : ''}`}>
                                    <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                                    <div className={`relative h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${showChat
                                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg'
                                        : 'bg-gradient-to-br from-blue-400 to-purple-500 group-hover:scale-110 group-hover:shadow-lg'
                                        }`}>
                                        <MessageCircle className={`w-6 h-6 text-white transition-transform duration-300 ${showChat ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`font-bold text-lg transition-colors duration-300 ${showChat ? 'text-blue-600' : 'text-gray-800 group-hover:text-blue-600'
                                            }`}>
                                            Chat with {isBuyer ? 'Seller' : 'Buyer'}
                                        </h3>
                                        {/* New badge */}
                                        <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full animate-pulse">
                                            Live
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 group-hover:text-gray-700">
                                        {showChat
                                            ? 'Chat is open - Send a message below'
                                            : `Ask questions about the order or discuss shipping details`
                                        }
                                    </p>
                                </div>

                                {/* Arrow indicator */}
                                <div className={`flex-shrink-0 transition-transform duration-300 ${showChat ? 'rotate-180' : ''}`}>
                                    <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Bottom accent line */}
                            <div className={`h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ${showChat ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                                }`} />
                        </button>

                        {/* Chat Box - Smooth expand animation */}
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showChat ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                            }`}>
                            {showChat && seller && buyer && (
                                <div className="bg-white border-2 border-blue-100 rounded-xl shadow-lg overflow-hidden">
                                    <ChatBox
                                        orderId={order._id}
                                        otherUserId={isBuyer ? (seller as any)._id : (buyer as any)._id}
                                        otherUserName={isBuyer ? seller.name : buyer.name}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-background border rounded-lg p-6 sticky top-24 space-y-6">
                        {/* Payment Summary */}
                        <div>
                            <h3 className="font-semibold mb-4">Payment Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Product Price</span>
                                    <span>{formatPrice(order.amount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Platform Fee (5%)</span>
                                    <span>{formatPrice(order.platformFee)}</span>
                                </div>
                                {isSeller && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">You Receive</span>
                                        <span className="font-semibold">{formatPrice(order.sellerAmount)}</span>
                                    </div>
                                )}
                                <div className="pt-3 border-t flex justify-between font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">{formatPrice(order.amount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Escrow Status */}
                        <div className="pt-6 border-t">
                            <h3 className="font-semibold mb-3">Escrow Status</h3>
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm">
                                    {order.escrowStatus === 'held' && '🔒 Funds held in escrow'}
                                    {order.escrowStatus === 'released' && '✅ Funds released to seller'}
                                    {order.escrowStatus === 'refunded' && '↩️ Funds refunded to buyer'}
                                </p>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="pt-6 border-t">
                            <h3 className="font-semibold mb-3">
                                {isBuyer ? 'Seller' : 'Buyer'}
                            </h3>
                            {(isBuyer ? seller : buyer) && (
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                                        {(isBuyer ? seller : buyer)!.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium">{(isBuyer ? seller : buyer)!.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {(isBuyer ? seller : buyer)!.email}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}