import { Link } from 'react-router-dom'
import { MapPin, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Product } from '../../types/product.types'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link
            to={`/products/${product._id}`}
            className="group bg-background border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
            {/* Image */}
            <div className="aspect-square overflow-hidden bg-muted">
                <img
                    src={product.images[0]}
                    alt={product.modelName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Category Badge */}
                <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                    {product.category}
                </span>

                {/* Title */}
                <h3 className="mt-2 font-semibold text-lg line-clamp-1">
                    {product.brand} {product.modelName}
                </h3>

                {/* Condition */}
                <p className="text-sm text-muted-foreground capitalize">
                    {product.condition.replace('-', ' ')}
                </p>

                {/* Price */}
                <p className="mt-3 text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                </p>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{product.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{product.views}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}