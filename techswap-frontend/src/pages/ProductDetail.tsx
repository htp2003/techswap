import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
    MapPin,
    Eye,
    Star,
    ArrowLeft,
    ShoppingCart,
    User,
    Calendar,
    Package
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { formatPrice, formatDate } from '@/lib/utils'
import { productService } from '@/services/product.service'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import type { User as UserType } from '../types/user.types'

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuthStore()
    const [selectedImage, setSelectedImage] = useState(0)

    // Fetch product
    const { data, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProduct(id!),
        enabled: !!id,
    })

    const product = data?.data?.product
    const seller = typeof product?.sellerId === 'object' ? product.sellerId as UserType : null

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            toast.error('Please login to purchase')
            navigate('/login')
            return
        }

        if (product && typeof product.sellerId === 'object') {
            const sellerId = (product.sellerId as UserType)._id
            if (sellerId === user?._id) {
                toast.error('You cannot buy your own product')
                return
            }
        }

        // Navigate to checkout (will implement later)
        navigate(`/checkout/${id}`)
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-muted-foreground">Loading product...</p>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-destructive">Product not found</p>
                <div className="text-center mt-4">
                    <Button onClick={() => navigate('/products')}>
                        Back to Products
                    </Button>
                </div>
            </div>
        )
    }

    const isOwner = seller?._id === user?._id

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => navigate('/products')}
                className="mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                    {/* Main Image */}
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                        <img
                            src={product.images[selectedImage]}
                            alt={product.modelName}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-2">
                        {product.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primary' : 'border-transparent'
                                    }`}
                            >
                                <img
                                    src={image}
                                    alt={`${product.modelName} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    {/* Category Badge */}
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
                        {product.category}
                    </span>

                    {/* Title */}
                    <h1 className="mt-4 text-3xl font-bold">
                        {product.brand} {product.modelName}
                    </h1>

                    {/* Condition */}
                    <p className="mt-2 text-lg text-muted-foreground capitalize">
                        Condition: {product.condition.replace('-', ' ')}
                    </p>

                    {/* Price */}
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="text-4xl font-bold text-primary">
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>{product.views} views</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Posted {formatDate(product.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{product.location}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex gap-4">
                        {product.status === 'available' ? (
                            <>
                                {isOwner ? (
                                    <Button className="flex-1" disabled>
                                        Your Product
                                    </Button>
                                ) : (
                                    <Button className="flex-1" onClick={handleBuyNow}>
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Buy Now
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Button className="flex-1" disabled>
                                <Package className="w-4 h-4 mr-2" />
                                {product.status === 'sold' ? 'Sold' : 'Pending Sale'}
                            </Button>
                        )}
                    </div>

                    {/* Seller Info */}
                    {seller && (
                        <div className="mt-8 p-4 border rounded-lg">
                            <h3 className="font-semibold mb-3">Seller Information</h3>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                                    {seller.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{seller.name}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span>{seller.rating.toFixed(1)}</span>
                                        {seller.verified && (
                                            <span className="text-primary">• Verified</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Description & Specs */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Description */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Description</h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                        {product.description}
                    </p>
                </div>

                {/* Specifications */}
                {Object.keys(product.specs).length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Specifications</h2>
                        <div className="space-y-3">
                            {Object.entries(product.specs).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-2 border-b">
                                    <span className="font-medium capitalize">{key}:</span>
                                    <span className="text-muted-foreground">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}