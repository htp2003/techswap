import { Link, useNavigate } from 'react-router-dom'
import { Package, ShoppingBag, LogOut, User, Plus } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'

export default function Navbar() {
    const navigate = useNavigate()
    const { isAuthenticated, user, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <Package className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">TechSwap</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/products"
                            className="text-sm font-medium transition-colors hover:text-primary"
                        >
                            Browse Products
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/create-listing"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    Sell Item
                                </Link>
                                <Link
                                    to="/my-purchases"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    My Purchases
                                </Link>
                                <Link
                                    to="/my-sales"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    My Sales
                                </Link>
                            </>
                        ) : null}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                {/* User Menu */}
                                <div className="flex items-center space-x-2">
                                    <div className="hidden sm:block text-right">
                                        <p className="text-sm font-medium">{user?.name}</p>
                                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                                        {user?.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="hidden sm:flex"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => navigate('/register')}
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}