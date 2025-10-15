import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal } from 'lucide-react'
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setFilters({ ...filters, search: searchInput, page: 1 })
    }

    const handleFilterChange = (key: keyof ProductFilters, value: any) => {
        setFilters({ ...filters, [key]: value, page: 1 })
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-bold mb-2">Browse Products</h1>
                <p className="text-muted-foreground font-bold">
                    Find the best deals on secondhand electronics
                </p>
            </div>

            {/* Search & Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    className="flex items-center bg-white rounded-2xl h-14 overflow-hidden w-full max-w-5xl mx-auto"
                    style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.15)' }}
                >
                    <div className="flex items-center flex-1 px-4">
                        <Search className="w-5 h-5 text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Tìm sản phẩm..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-full px-6 transition-colors hover:"
                        style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)' }}
                    >
                        Tìm kiếm
                    </button>
                </form>

                {/* Filter Button (Mobile) */}
                <Button variant="outline" className="md:hidden shadow-md">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="mb-6 flex flex-wrap gap-3">
                {/* Category Filter */}
                <select
                    className="px-4 py-2 border rounded-lg bg-background"
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                >
                    <option value="">All Categories</option>
                    <option value="laptop">Laptop</option>
                    <option value="phone">Phone</option>
                    <option value="tablet">Tablet</option>
                    <option value="camera">Camera</option>
                    <option value="audio">Audio</option>
                    <option value="gaming">Gaming</option>
                </select>

                {/* Condition Filter */}
                <select
                    className="px-4 py-2 border rounded-lg bg-background"
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
                    className="px-4 py-2 border rounded-lg bg-background"
                    value={filters.sort || '-createdAt'}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                    <option value="-createdAt">Newest</option>
                    <option value="createdAt">Oldest</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                </select>

                {/* Clear Filters */}
                {(filters.category || filters.condition || filters.search) && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setFilters({ page: 1, limit: 12, status: 'available' })
                            setSearchInput('')
                        }}
                    >
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Products Grid */}
            {isLoading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading products...</p>
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-destructive">Failed to load products</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No products found</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            <Button
                                variant="outline"
                                disabled={filters.page === 1}
                                onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
                            >
                                Previous
                            </Button>
                            <span className="px-4 py-2">
                                Page {filters.page} of {pagination.pages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={filters.page === pagination.pages}
                                onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
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