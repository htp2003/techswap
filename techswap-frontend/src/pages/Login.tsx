import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Package } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'

interface LoginForm {
    email: string
    password: string
}

export default function Login() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>()

    const onSubmit = async (data: LoginForm) => {
        try {
            setIsLoading(true)
            const response = await authService.login(data)

            // Save to store
            setAuth(response.data.user, response.data.token)

            toast.success('Login successful!')
            navigate('/')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link to="/" className="flex items-center space-x-2">
                        <Package className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold">TechSwap</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-background rounded-lg shadow-lg border p-8">
                    <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
                    <p className="text-center text-muted-foreground mb-6">
                        Login to your account
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <Input
                                type="email"
                                placeholder="your@email.com"
                                error={errors.email?.message}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                error={errors.password?.message}
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>

                    {/* Register Link */}
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:underline font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}