import type { OrderStatus } from '../../types/order.types'

interface OrderStatusBadgeProps {
    status: OrderStatus
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
    pending: { label: 'Pending Payment', className: 'bg-yellow-100 text-yellow-800' },
    paid: { label: 'Paid', className: 'bg-blue-100 text-blue-800' },
    shipped: { label: 'Shipped', className: 'bg-purple-100 text-purple-800' },
    inspecting: { label: 'Inspecting', className: 'bg-orange-100 text-orange-800' },
    completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
    disputed: { label: 'Disputed', className: 'bg-red-100 text-red-800' },
    cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800' },
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const config = statusConfig[status]

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
            {config.label}
        </span>
    )
}