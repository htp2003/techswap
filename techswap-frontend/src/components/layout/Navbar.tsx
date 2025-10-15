import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Package, ShoppingBag, LogOut, Plus, Menu, X, Search } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { isAuthenticated, user, logout } = useAuthStore()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Handle scroll effect for glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [location.pathname])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    // Navigation links based on auth status
    const navLinks = [
        { name: 'Browse Products', path: '/products', icon: Search },
        ...(isAuthenticated ? [
            { name: 'Sell Item', path: '/create-listing', icon: Plus },
            { name: 'My Purchases', path: '/my-purchases', icon: ShoppingBag },
            { name: 'My Sales', path: '/my-sales', icon: Package }
        ] : [])
    ]

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200'
                : 'bg-white border-b border-gray-100'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo with gradient and hover effect */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2 group"
                    >
                        <div className="relative">
                            <Package className="h-7 w-7 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                            <div className="absolute inset-0 bg-blue-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-200" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            TechSwap
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon
                            const isActive = location.pathname === link.path

                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{link.name}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right Side - Desktop */}
                    <div className="flex items-center space-x-3">
                        {isAuthenticated ? (
                            <>
                                {/* User Profile */}
                                <div className="hidden md:flex items-center space-x-3 pl-3 border-l border-gray-200">
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
                                    </div>
                                    <div className="relative group cursor-pointer">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white group-hover:ring-blue-200 transition-all duration-200">
                                            {user?.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="absolute inset-0 rounded-full bg-blue-400 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-200" />
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="hover:text-red-600"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center space-x-3">
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
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu with smooth animation */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-100 shadow-lg">
                    {/* User Info Card - Mobile */}
                    {isAuthenticated && (
                        <div className="flex items-center space-x-3 p-3 mb-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links - Mobile */}
                    {navLinks.map((link) => {
                        const Icon = link.icon
                        const isActive = location.pathname === link.path

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{link.name}</span>
                            </Link>
                        )
                    })}

                    {/* Auth Buttons - Mobile */}
                    <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100 transition-all duration-200"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-center"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </Button>
                                <Button
                                    className="w-full justify-center"
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