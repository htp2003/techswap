import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, Package, Filter, X, Laptop, Smartphone, Tablet, Camera, Headphones, Gamepad2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import ProductCard from '@/components/products/ProductCard'
import { productService } from '@/services/product.service'
import type { ProductFilters } from '../types/product.types'

export default function Products() {
    const [filters, setFilters] = useState<ProductFilters>({
        page: 1,
        limit: 12,
        status: 'available',
    })
    const [searchInput, setSearchInput] = useState('')

    // Fetch products
    const { data, isLoading, error } = useQuery({
        queryKey: ['products', filters],
        queryFn: () => productService.getProducts(filters),
    })

    // FIX: Access nested data correctly
    const products = data?.data?.products || []
    const pagination = data?.data?.pagination

    const categories = [
        { value: 'laptop', label: 'Laptops', icon: Laptop, color: 'from-purple-500 to-pink-500' },
        { value: 'phone', label: 'Phones', icon: Smartphone, color: 'from-blue-500 to-cyan-500' },
        { value: 'tablet', label: 'Tablets', icon: Tablet, color: 'from-orange-500 to-red-500' },
        { value: 'camera', label: 'Cameras', icon: Camera, color: 'from-yellow-500 to-orange-500' },
        { value: 'audio', label: 'Audio', icon: Headphones, color: 'from-green-500 to-teal-500' },
        { value: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'from-indigo-500 to-purple-500' },
    ]

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setFilters({ ...filters, search: searchInput, page: 1 })
    }

    const handleFilterChange = (key: keyof ProductFilters, value: any) => {
        // Only reset page to 1 if we're not changing the page itself
        if (key === 'page') {
            setFilters({ ...filters, [key]: value })
        } else {
            setFilters({ ...filters, [key]: value, page: 1 })
        }
    }

    const activeFiltersCount = [filters.category, filters.condition, filters.search].filter(Boolean).length

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
            {/* Hero Header */}
            <section className="relative bg-gradient-to-br from-primary/10 via-purple-50 to-blue-50 dark:from-primary/20 dark:via-purple-950 dark:to-blue-950 py-16 mb-8">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-400/20 rounded-full blur-3xl"></div>
                </div>

                <div className="relative container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            Discover Amazing
                            <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent"> Tech Deals</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8">
                            Browse {pagination?.total || '1000+'} verified electronics from trusted sellers
                        </p>

                        {/* Search Bar */}
                        <form
                            onSubmit={handleSearch}
                            className="relative max-w-2xl mx-auto"
                        >
                            <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-border/50">
                                <Search className="w-5 h-5 text-muted-foreground ml-6" />
                                <input
                                    type="text"
                                    placeholder="Search for laptops, phones, cameras..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="flex-1 px-4 py-5 text-base outline-none bg-transparent"
                                />
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="m-2 shadow-lg"
                                >
                                    Search
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 pb-12">
                {/* Category Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Package className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold">Shop by Category</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleFilterChange('category', undefined)}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${!filters.category
                                ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg scale-105'
                                : 'bg-white dark:bg-gray-800 border border-border hover:border-primary hover:shadow-md'
                                }`}
                        >
                            All Products
                        </button>
                        {categories.map((cat) => {
                            const Icon = cat.icon
                            return (
                                <button
                                    key={cat.value}
                                    onClick={() => handleFilterChange('category', cat.value)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${filters.category === cat.value
                                        ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                                        : 'bg-white dark:bg-gray-800 border border-border hover:border-primary hover:shadow-md'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {cat.label}
                                </button>
                            )
                        })}
                    </div>
                </motion.div>

                {/* Filters Bar */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Filter className="w-4 h-4" />
                        <span>
                            Showing <span className="font-semibold text-foreground">{products.length}</span> of{' '}
                            <span className="font-semibold text-foreground">{pagination?.total || 0}</span> products
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {/* Condition Filter */}
                        <select
                            className="px-4 py-2.5 border border-border rounded-xl bg-white dark:bg-gray-800 hover:border-primary transition-colors font-medium cursor-pointer"
                            value={filters.condition || ''}
                            onChange={(e) => handleFilterChange('condition', e.target.value || undefined)}
                        >
                            <option value="">All Conditions</option>
                            <option value="like-new">Like New</option>
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                        </select>

                        {/* Sort */}
                        <select
                            className="px-4 py-2.5 border border-border rounded-xl bg-white dark:bg-gray-800 hover:border-primary transition-colors font-medium cursor-pointer"
                            value={filters.sort || '-createdAt'}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                        >
                            <option value="-createdAt">Newest First</option>
                            <option value="createdAt">Oldest First</option>
                            <option value="price">Price: Low to High</option>
                            <option value="-price">Price: High to Low</option>
                        </select>

                        {/* Clear Filters */}
                        {/* Clear Filters */}
                        {activeFiltersCount > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setFilters({ page: 1, limit: 12, status: 'available' })
                                    setSearchInput('')
                                }}
                                className="flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Clear ({activeFiltersCount})
                            </Button>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-muted-foreground">Loading amazing products...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-destructive" />
                        </div>
                        <p className="text-destructive font-semibold mb-2">Failed to load products</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                ) : products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No Products Found</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            We couldn't find any products matching your criteria. Try adjusting your filters.
                        </p>
                        <Button
                            onClick={() => {
                                setFilters({ page: 1, limit: 12, status: 'available' })
                                setSearchInput('')
                            }}
                        >
                            Clear All Filters
                        </Button>
                    </motion.div>
                ) : (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {products.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        {pagination && pagination.pages > 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
                            >
                                <Button
                                    variant="outline"
                                    size="lg"
                                    disabled={filters.page === 1}
                                    onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
                                    className="w-full sm:w-auto"
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-2">
                                    <span className="px-6 py-3 bg-white dark:bg-gray-800 border border-border rounded-xl font-medium">
                                        Page <span className="text-primary font-bold">{filters.page}</span> of{' '}
                                        <span className="font-bold">{pagination.pages}</span>
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    disabled={filters.page === pagination.pages}
                                    onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                                    className="w-full sm:w-auto"
                                >
                                    Next
                                </Button>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}