import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Package, Shield, Zap, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import ProductCard from '@/components/products/ProductCard'
import { productService } from '@/services/product.service'

export default function Home() {
    const navigate = useNavigate()

    // Fetch featured products (latest)
    const { data } = useQuery({
        queryKey: ['featured-products'],
        queryFn: () => productService.getProducts({ limit: 8, status: 'available' }),
    })

    const featuredProducts = data?.data?.products || []

    return (
        <div>
            {/* Hero Section - Full Width */}
            <section className="w-full bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                        Buy & Sell Quality
                        <br />
                        <span className="text-primary">Secondhand Electronics</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Your trusted marketplace for laptops, phones, tablets, and more.
                        Safe transactions with escrow protection.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={() => navigate('/products')}
                        >
                            Browse Products
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => navigate('/create-listing')}
                        >
                            Sell Your Item
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 lg:py-24 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Why Choose TechSwap?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="text-center p-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Secure Escrow</h3>
                        <p className="text-muted-foreground">
                            Your payment is held safely until you confirm delivery.
                            Full buyer protection.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="text-center p-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <Zap className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Fast & Easy</h3>
                        <p className="text-muted-foreground">
                            List your items in minutes. Chat with buyers/sellers in real-time.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="text-center p-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <Package className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Quality Items</h3>
                        <p className="text-muted-foreground">
                            Verified sellers. Detailed product descriptions.
                            Safe transactions guaranteed.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="w-full py-16 lg:py-24 bg-muted/30">
                    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold">Featured Products</h2>
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/products')}
                            >
                                View All
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.slice(0, 8).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-16 lg:py-24 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                        Ready to Start Trading?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Join thousands of users buying and selling quality electronics
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={() => navigate('/register')}
                        >
                            Sign Up Now
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => navigate('/products')}
                        >
                            Explore Marketplace
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="w-full py-16 bg-primary text-primary-foreground">
                <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <p className="text-4xl font-bold mb-2">1000+</p>
                            <p className="opacity-90">Products Listed</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold mb-2">500+</p>
                            <p className="opacity-90">Happy Users</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold mb-2">$50K+</p>
                            <p className="opacity-90">Transactions</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}