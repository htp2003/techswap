import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ShoppingBag, Package } from 'lucide-react'
import OrderCard from '@/components/orders/OrderCard'
import Button from '@/components/ui/Button'
import { orderService } from '@/services/order.service'

export default function MyPurchases() {
    const [page, setPage] = useState(1)

    const { data, isLoading } = useQuery({
        queryKey: ['my-purchases', page],
        queryFn: () => orderService.getMyPurchases(page),
    })

    const orders = data?.data?.orders || []
    const pagination = data?.data?.pagination

    return (
        <div className="py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <ShoppingBag className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">My Purchases</h1>
                </div>
                <p className="text-muted-foreground">
                    Track and manage your orders
                </p>
            </div>

            {/* Orders List */}
            {isLoading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
                    <p className="text-muted-foreground mb-6">
                        Start shopping to see your orders here
                    </p>
                    <Button onClick={() => window.location.href = '/products'}>
                        Browse Products
                    </Button>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <OrderCard key={order._id} order={order} viewType="buyer" />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </Button>
                            <span className="px-4 py-2">
                                Page {page} of {pagination.pages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={page === pagination.pages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}