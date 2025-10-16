import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion'; // Import motion
import { Package, Shield, Zap, ArrowRight, Smartphone, Laptop, Tablet, Headphones, Camera, Watch, Star, CheckCircle, TrendingUp, Users, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/products/ProductCard';
import { productService } from '@/services/product.service';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import electronicImage from '@/assets/img/electronicdv.jpg';




// Hiệu ứng cho container: mờ dần vào và các phần tử con xuất hiện lần lượt
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

// Hiệu ứng cho từng item: mờ dần và trượt lên
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
};

export default function Home() {
    const navigate = useNavigate();

    const { data } = useQuery({
        queryKey: ['featured-products'],
        queryFn: () => productService.getProducts({ limit: 8, status: 'available' }),
    });

    const featuredProducts = data?.data?.products || [];

    const categories = [
        { icon: Smartphone, name: 'Smartphones', count: '200+', gradient: 'from-blue-500 to-cyan-500' },
        { icon: Laptop, name: 'Laptops', count: '150+', gradient: 'from-purple-500 to-pink-500' },
        { icon: Tablet, name: 'Tablets', count: '80+', gradient: 'from-orange-500 to-red-500' },
        { icon: Headphones, name: 'Audio', count: '120+', gradient: 'from-green-500 to-teal-500' },
        { icon: Camera, name: 'Cameras', count: '60+', gradient: 'from-yellow-500 to-orange-500' },
        { icon: Watch, name: 'Wearables', count: '90+', gradient: 'from-indigo-500 to-purple-500' },
    ];

    const steps = [
        { icon: Package, title: 'List Your Item', desc: 'Upload photos and details in minutes' },
        { icon: MessageSquare, title: 'Connect & Chat', desc: 'Real-time messaging with buyers' },
        { icon: Shield, title: 'Secure Payment', desc: 'Escrow protection for both parties' },
        { icon: CheckCircle, title: 'Complete Trade', desc: 'Confirm delivery and release funds' },
    ];

    const testimonials = [
        { name: 'Sarah Johnson', role: 'Buyer', text: 'Found my dream laptop at 40% off retail. The escrow system made me feel totally safe!', rating: 5 },
        { name: 'Mike Chen', role: 'Seller', text: 'Sold my old iPhone in just 2 days. The platform is super easy to use.', rating: 5 },
        { name: 'Emily Davis', role: 'Buyer', text: 'Amazing experience! Great products and trustworthy sellers.', rating: 5 },
    ];

    return (
        <div className="overflow-hidden">
            {/* Hero Section - Gradient with Glassmorphism */}
            <section className="relative w-full bg-gradient-to-br from-primary/10 via-purple-50 to-blue-50 dark:from-primary/20 dark:via-purple-950 dark:to-blue-950">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
                </div>

                <div className="relative flex flex-col justify-center items-center min-h-[calc(100vh-80px)] text-center px-6 pt-20 pb-10 md:pt-24 md:pb-12">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-primary/20 shadow-lg">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium"> Trusted by 10,000+ users</span>
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                            Buy & Sell Tech
                            <br />
                            <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                With Confidence
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                            The premier marketplace for pre-owned electronics.
                            <span className="font-semibold text-foreground"> Escrow-protected</span> transactions,
                            <span className="font-semibold text-foreground"> verified sellers</span>, and
                            <span className="font-semibold text-foreground"> instant messaging</span>.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                            <Button
                                size="lg"
                                className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-shadow"
                                onClick={() => navigate('/products')}
                            >
                                Explore Products
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-lg px-8 py-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                                onClick={() => navigate('/sell')}
                            >
                                Start Selling
                            </Button>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold text-foreground">4.9/5</span>
                                <span>rating</span>
                            </div>
                            <div className="h-4 w-px bg-border"></div>
                            <div className="flex items-center gap-1">
                                <Users className="w-5 h-5 text-primary" />
                                <span className="font-semibold text-foreground">10K+</span>
                                <span>users</span>
                            </div>
                            <div className="h-4 w-px bg-border"></div>
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="font-semibold text-foreground">100%</span>
                                <span>secure</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Product Showcase Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="w-full max-w-6xl mx-auto mt-16 lg:mt-20"
                    >
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl blur-2xl"></div>
                            <img
                                src={electronicImage}
                                alt="Product Showcase"
                                className="relative rounded-2xl shadow-2xl border border-white/20"
                                style={{
                                    maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 lg:py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Shop by Category</h2>
                        <p className="text-muted-foreground text-lg">Find exactly what you're looking for</p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6"
                        variants={containerVariants}
                    >
                        {categories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="cursor-pointer"
                                    onClick={() => navigate('/products')}
                                >
                                    <div className="relative group">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                        <div className="relative bg-card border border-border rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300">
                                            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-xl mb-4 shadow-lg`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="font-semibold mb-1">{category.name}</h3>
                                            <p className="text-sm text-muted-foreground">{category.count}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </motion.div>
            </section>

            {/* How It Works */}
            <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/20">
                <motion.div
                    className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Simple, secure, and seamless. Start trading in 4 easy steps.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative"
                                >
                                    {/* Connecting line */}
                                    {/* {index < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
                                    )} */}

                                    <div className="relative bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white font-bold shadow-lg">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                                                    <h3 className="font-semibold">{step.title}</h3>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{step.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </section>

            {/* Features */}
            <section className="py-16 lg:py-24 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose TechSwap?</h2>
                        <p className="text-muted-foreground text-lg">The safest way to buy and sell electronics</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: 'Secure Escrow',
                                text: 'Your payment is held safely until you confirm delivery. Full buyer protection.',
                                color: 'from-green-500 to-emerald-500'
                            },
                            {
                                icon: Zap,
                                title: 'Fast & Easy',
                                text: 'List your items in minutes. Chat with buyers/sellers in real-time.',
                                color: 'from-yellow-500 to-orange-500'
                            },
                            {
                                icon: Package,
                                title: 'Quality Items',
                                text: 'Verified sellers. Detailed product descriptions. Safe transactions guaranteed.',
                                color: 'from-blue-500 to-purple-500'
                            },
                        ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    whileHover={{ y: -8 }}
                                    className="group"
                                >
                                    <div className="relative h-full bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
                                        {/* Gradient overlay on hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                                        <div className="relative text-center">
                                            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{feature.text}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </section>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="w-full py-16 lg:py-24 bg-gradient-to-b from-muted/30 to-background">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={containerVariants}
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                                <div>
                                    <h2 className="text-3xl lg:text-4xl font-bold mb-2">Featured Products</h2>
                                    <p className="text-muted-foreground">Handpicked deals from verified sellers</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => navigate('/products')}
                                    className="group"
                                >
                                    View All Products
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {featuredProducts.slice(0, 8).map((product, index) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Testimonials */}
            <section className="py-16 lg:py-24 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Users Say</h2>
                        <p className="text-muted-foreground text-lg">Join thousands of satisfied buyers and sellers</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 h-full">
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>

                                    {/* Author */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-24 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="relative overflow-hidden rounded-3xl"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={containerVariants}
                >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-blue-600"></div>

                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }}></div>
                    </div>

                    {/* Content */}
                    <div className="relative px-8 py-16 lg:py-20 text-center text-white">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl lg:text-5xl font-bold mb-6"
                        >
                            Ready to Start Trading?
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-lg lg:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
                        >
                            Join our community of tech enthusiasts. Buy verified electronics or turn your old devices into cash today.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Button
                                size="lg"
                                onClick={() => navigate('/register')}
                                className="bg-white text-primary hover:bg-gray-100 shadow-xl text-lg px-8 py-6"
                            >
                                Sign Up Now - It's Free
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/products')}
                                className="border-white bg-transparent text-white hover:bg-white/10 text-lg px-8 py-6"
                            >
                                Explore Marketplace
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="w-full py-16 lg:py-20 bg-gradient-to-br from-primary via-purple-600 to-blue-600 text-white">
                <motion.div
                    className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={containerVariants}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="mb-3">
                                <Package className="w-12 h-12 mx-auto mb-4 opacity-90" />
                                <p className="text-5xl lg:text-6xl font-bold mb-2">
                                    <AnimatedCounter to={1000} />+
                                </p>
                            </div>
                            <p className="text-lg text-white/90 font-medium">Products Listed</p>
                            <p className="text-sm text-white/70 mt-1">And growing every day</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div className="mb-3">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
                                <p className="text-5xl lg:text-6xl font-bold mb-2">
                                    <AnimatedCounter to={10000} />+
                                </p>
                            </div>
                            <p className="text-lg text-white/90 font-medium">Happy Users</p>
                            <p className="text-sm text-white/70 mt-1">Trusted community members</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="mb-3">
                                <Shield className="w-12 h-12 mx-auto mb-4 opacity-90" />
                                <p className="text-5xl lg:text-6xl font-bold mb-2">
                                    $<AnimatedCounter to={100} />K+
                                </p>
                            </div>
                            <p className="text-lg text-white/90 font-medium">Secure Transactions</p>
                            <p className="text-sm text-white/70 mt-1">Protected by escrow</p>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}