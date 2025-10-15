import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function Dashboard() {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)

    useEffect(() => {
        // Redirect based on user role
        if (user?.role === 'seller' || user?.role === 'both') {
            navigate('/my-sales')
        } else {
            navigate('/my-purchases')
        }
    }, [user, navigate])

    return (
        <div className="py-8">
            <p className="text-center text-muted-foreground">Redirecting...</p>
        </div>
    )
}