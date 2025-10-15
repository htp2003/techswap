import { Link } from 'react-router-dom'
import { Package, Calendar, DollarSign } from 'lucide-react'
import OrderStatusBadge from './OrderStatusBadge'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Order } from '../../types/order.types'
import type { Product as ProductType } from '../../types/product.types'

interface OrderCardProps {
    order: Order
    viewType: 'buyer' | 'seller'
}

export default function OrderCard({ order, viewType }: OrderCardProps) {
    const product = typeof order.productId === 'object' ? order.productId as ProductType : null

    return (
        <Link
            to={`/orders/${order._id}`}
            className="block bg-background border rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        Order #{order._id.slice(-8)}
                    </span>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            {/* Product Info */}
            {product && (
                <div className="flex gap-4 mb-4">
                    <img
                        src={product.images?.[0]}
                        alt={product.modelName}
                        className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                        <h3 className="font-semibold line-clamp-1">
                            {product.brand} {product.modelName}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                            {product.condition?.replace('-', ' ')}
                        </p>
                        <p className="text-lg font-bold text-primary mt-1">
                            {formatPrice(order.amount)}
                        </p>
                    </div>
                </div>
            )}

            {/* Order Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(order.createdAt)}</span>
                </div>

                {viewType === 'seller' && (
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>You receive: {formatPrice(order.sellerAmount)}</span>
                    </div>
                )}
            </div>

            {/* Escrow Info */}
            {order.escrowStatus === 'held' && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    🔒 Funds held in escrow
                </div>
            )}
            {order.escrowStatus === 'released' && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                    ✅ Payment {viewType === 'buyer' ? 'released' : 'received'}
                </div>
            )}
        </Link>
    )
}