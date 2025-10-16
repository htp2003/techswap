import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center space-x-2">
                            <Package className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">TechSwap</span>
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground max-w-md">
                            Your trusted marketplace for buying and selling secondhand electronics.
                            Safe, secure, and convenient.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link to="/products" className="hover:text-primary transition-colors">
                                    Browse Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/create-listing" className="hover:text-primary transition-colors">
                                    Sell Item
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-purchases" className="hover:text-primary transition-colors">
                                    My Purchases
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-sales" className="hover:text-primary transition-colors">
                                    My Sales
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link to="/about" className="hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/policy" className="hover:text-primary transition-colors">
                                    Privacy & Policy
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} TechSwap. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}