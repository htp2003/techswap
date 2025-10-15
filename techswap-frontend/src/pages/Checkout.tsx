import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { formatPrice } from '@/lib/utils'
import { productService } from '@/services/product.service'
import { orderService } from '@/services/order.service'
import type { User as UserType } from '../types/user.types'

export default function Checkout() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [shippingAddress, setShippingAddress] = useState('')

    // Fetch product
    const { data, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProduct(id!),
        enabled: !!id,
    })

    const product = data?.data?.product
    const seller = typeof product?.sellerId === 'object' ? product.sellerId as UserType : null

    // Create payment mutation
    const createPaymentMutation = useMutation({
        mutationFn: (address: string) =>
            orderService.createPayment({
                productId: id!,
                shippingAddress: address
            }),
        onSuccess: async (response) => {
            toast.success('Order created! Processing payment...')

            // Mock payment success (since VNPay not fully setup)
            try {
                await orderService.mockPaymentSuccess(response.data.orderId)
                toast.success('Payment successful!')
                navigate(`/orders/${response.data.orderId}`)
            } catch (error) {
                toast.error('Payment failed')
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create order')
        },
    })

    const handleCheckout = () => {
        if (!shippingAddress.trim()) {
            toast.error('Please enter shipping address')
            return
        }

        if (shippingAddress.length < 10) {
            toast.error('Please enter a valid address (min 10 characters)')
            return
        }

        createPaymentMutation.mutate(shippingAddress)
    }

    if (isLoading) {
        return (
            <div className="py-8">
                <p className="text-center text-muted-foreground">Loading...</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="py-8">
                <p className="text-center text-destructive">Product not found</p>
            </div>
        )
    }

    return (
        <div className="py-8">
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => navigate(`/products/${id}`)}
                className="mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Product
            </Button>

            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Shipping Address */}
                    <div className="bg-background border rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-semibold">Shipping Address</h2>
                        </div>

                        <textarea
                            rows={4}
                            placeholder="Enter your full shipping address (street, district, city)..."
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-background resize-none"
                        />
                        <p className="mt-2 text-sm text-muted-foreground">
                            Please provide detailed address for delivery
                        </p>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-background border rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-semibold">Payment Method</h2>
                        </div>

                        <div className="p-4 border rounded-lg bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 bg-primary rounded flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium">VNPay (Mock)</p>
                                    <p className="text-sm text-muted-foreground">
                                        Secure escrow payment
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 text-sm text-muted-foreground">
                            💰 Your money is held securely in escrow until you confirm delivery
                        </p>
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-background border rounded-lg p-6 sticky top-24">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        {/* Product */}
                        <div className="flex gap-4 mb-6 pb-6 border-b">
                            <img
                                src={product.images[0]}
                                alt={product.modelName}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold line-clamp-2">
                                    {product.brand} {product.modelName}
                                </h3>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {product.condition.replace('-', ' ')}
                                </p>
                            </div>
                        </div>

                        {/* Seller */}
                        {seller && (
                            <div className="mb-6 pb-6 border-b">
                                <p className="text-sm text-muted-foreground mb-2">Seller</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                                        {seller.name.charAt(0).toUpperCase()}
                                    </div>
                                    <p className="font-medium">{seller.name}</p>
                                </div>
                            </div>
                        )}

                        {/* Price Breakdown */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Product Price</span>
                                <span className="font-medium">{formatPrice(product.price)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Platform Fee (5%)</span>
                                <span className="font-medium">{formatPrice(product.price * 0.05)}</span>
                            </div>
                            <div className="pt-3 border-t flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">{formatPrice(product.price)}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <Button
                            className="w-full"
                            onClick={handleCheckout}
                            disabled={createPaymentMutation.isPending}
                        >
                            {createPaymentMutation.isPending ? 'Processing...' : 'Place Order'}
                        </Button>

                        <p className="mt-4 text-xs text-center text-muted-foreground">
                            By placing order, you agree to our Terms & Conditions
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}