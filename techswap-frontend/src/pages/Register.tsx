import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Package } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'

interface RegisterForm {
    name: string
    email: string
    password: string
    confirmPassword: string
    phone?: string
}

export default function Register() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterForm>()

    const password = watch('password')

    const onSubmit = async (data: RegisterForm) => {
        try {
            setIsLoading(true)
            const { confirmPassword, ...registerData } = data

            const response = await authService.register(registerData)

            // Save to store
            setAuth(response.data.user, response.data.token)

            toast.success('Account created successfully!')
            navigate('/')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
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
                    <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
                    <p className="text-center text-muted-foreground mb-6">
                        Join TechSwap today
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <Input
                                type="text"
                                placeholder="John Doe"
                                error={errors.name?.message}
                                {...register('name', {
                                    required: 'Name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least 2 characters',
                                    },
                                })}
                            />
                        </div>

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

                        {/* Phone (Optional) */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Phone <span className="text-muted-foreground">(Optional)</span>
                            </label>
                            <Input
                                type="tel"
                                placeholder="0123456789"
                                error={errors.phone?.message}
                                {...register('phone', {
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Phone must be 10 digits',
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Confirm Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                error={errors.confirmPassword?.message}
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (value) =>
                                        value === password || 'Passwords do not match',
                                })}
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}