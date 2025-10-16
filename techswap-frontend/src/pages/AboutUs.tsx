import { motion } from 'framer-motion'
import {
    Users,
    Target,
    Heart,
    Shield,
    Zap,
    TrendingUp,
    Award,
    Mail,
    MapPin,
    Phone
} from 'lucide-react'

export default function AboutUs() {
    const stats = [
        { label: 'Active Users', value: '10,000+', icon: Users },
        { label: 'Products Listed', value: '50,000+', icon: TrendingUp },
        { label: 'Successful Deals', value: '25,000+', icon: Award },
        { label: 'Customer Satisfaction', value: '98%', icon: Heart }
    ]

    const values = [
        {
            icon: Shield,
            title: 'Trust & Safety',
            description: 'We prioritize the security of every transaction with our escrow system and verified sellers.'
        },
        {
            icon: Heart,
            title: 'Community First',
            description: 'Building a vibrant community of tech enthusiasts who share the same passion.'
        },
        {
            icon: Zap,
            title: 'Fast & Easy',
            description: 'Streamlined buying and selling process that saves you time and effort.'
        },
        {
            icon: Target,
            title: 'Fair Pricing',
            description: 'Transparent pricing with no hidden fees. What you see is what you get.'
        }
    ]

    const team = [
        {
            name: 'Alex Johnson',
            role: 'CEO & Founder',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop'
        },
        {
            name: 'Sarah Chen',
            role: 'Head of Product',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop'
        },
        {
            name: 'Michael Brown',
            role: 'Head of Engineering',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop'
        },
        {
            name: 'Emily Davis',
            role: 'Customer Success',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop'
        }
    ]

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-purple-50 to-blue-50 dark:from-primary/20 dark:via-purple-950 dark:to-blue-950 py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            About <span className="text-primary">TechSwap</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                            We're on a mission to create the most trusted marketplace for buying and selling
                            pre-owned tech devices. Safe, simple, and secure.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container mx-auto px-4 -mt-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card border border-border rounded-lg p-6 text-center shadow-sm"
                        >
                            <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                            <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Our Story */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-8 md:p-12">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                TechSwap was born from a simple frustration: buying and selling used tech devices
                                was risky, complicated, and often unreliable. In 2023, our founder Alex Johnson
                                had a bad experience selling his laptop on a traditional marketplace, dealing with
                                scammers and payment disputes.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                That experience sparked an idea: what if there was a marketplace built specifically
                                for tech devices, with built-in escrow protection, verified sellers, and a community
                                that actually cared about fair deals?
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Today, TechSwap serves thousands of tech enthusiasts who trust us to facilitate safe
                                transactions. Every feature we build, every policy we create, and every decision we make
                                is guided by one principle: <strong className="text-foreground">protecting our community</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="bg-muted/50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <value.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                                <p className="text-sm text-muted-foreground">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        The passionate people making TechSwap possible
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {team.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center group"
                        >
                            <div className="relative mb-4 overflow-hidden rounded-lg">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-r from-primary/10 to-purple-100/50 dark:from-primary/20 dark:to-purple-950/30 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
                            <p className="text-muted-foreground">
                                Have questions or want to partner with us? We'd love to hear from you.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-card border border-border rounded-lg p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">Email Us</h3>
                                <p className="text-sm text-muted-foreground mb-3">Our support team is here to help</p>
                                <a href="mailto:support@techswap.com" className="text-primary hover:underline text-sm">
                                    support@techswap.com
                                </a>
                            </div>

                            <div className="bg-card border border-border rounded-lg p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">Call Us</h3>
                                <p className="text-sm text-muted-foreground mb-3">Mon-Fri, 9AM-6PM</p>
                                <a href="tel:+84123456789" className="text-primary hover:underline text-sm">
                                    +84 123 456 789
                                </a>
                            </div>

                            <div className="bg-card border border-border rounded-lg p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">Visit Us</h3>
                                <p className="text-sm text-muted-foreground mb-3">Come say hi at our office</p>
                                <p className="text-sm text-primary">
                                    Ho Chi Minh City, Vietnam
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                            >
                                Send Us a Message
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
