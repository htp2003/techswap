import { useRoutes, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Layouts
import Layout from '@/components/layout/Layout'

// Pages
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Products from '@/pages/Products'
import ProductDetail from '@/pages/ProductDetail'
import CreateListing from '@/pages/CreateListing'
import Dashboard from '@/pages/Dashboard'
import MyPurchases from '@/pages/MyPurchases'
import MySales from '@/pages/MySales'
import OrderDetail from '@/pages/OrderDetail'
import NotFound from '@/pages/NotFound'
import Checkout from '@/pages/Checkout'
import Policy from '@/pages/Policy'
import AboutUs from '@/pages/AboutUs'

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

// Auth Route (redirect if already logged in)
function AuthRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

export default function useRouteElements() {
    const routeElements = useRoutes([
        {
            path: '/',
            element: <Layout containerless><Home /></Layout>
        },
        {
            path: '/login',
            element: (
                <AuthRoute>
                    <Login />
                </AuthRoute>
            )
        },
        {
            path: '/register',
            element: (
                <AuthRoute>
                    <Register />
                </AuthRoute>
            )
        },
        {
            path: '/products',
            element: <Layout><Products /></Layout>
        },
        {
            path: '/products/:id',
            element: <Layout><ProductDetail /></Layout>
        },
        {
            path: '/create-listing',
            element: (
                <ProtectedRoute>
                    <Layout><CreateListing /></Layout>
                </ProtectedRoute>
            )
        },
        {
            path: '/dashboard',
            element: (
                <ProtectedRoute>
                    <Layout><Dashboard /></Layout>
                </ProtectedRoute>
            )
        },
        {
            path: '/my-purchases',
            element: (
                <ProtectedRoute>
                    <Layout><MyPurchases /></Layout>
                </ProtectedRoute>
            )
        },
        {
            path: '/my-sales',
            element: (
                <ProtectedRoute>
                    <Layout><MySales /></Layout>
                </ProtectedRoute>
            )
        },
        {
            path: '/orders/:id',
            element: (
                <ProtectedRoute>
                    <Layout><OrderDetail /></Layout>
                </ProtectedRoute>
            )
        },
        {
            path: '/checkout/:id',
            element: (
                <ProtectedRoute>
                    <Layout><Checkout /></Layout>
                </ProtectedRoute>
            )
        },
        {
            path: '/policy',
            element: <Layout><Policy /></Layout>
        },
        {
            path: '/about',
            element: <Layout><AboutUs /></Layout>
        },
        {
            path: '*',
            element: <Layout><NotFound /></Layout>
        }
    ])

    return routeElements
}