import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Upload, X, Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { productService } from '@/services/product.service'
import type { ProductCategory, ProductCondition } from '../types/product.types'

interface ProductForm {
    category: ProductCategory
    brand: string
    modelName: string
    condition: ProductCondition
    price: number
    description: string
    location: string
    // Dynamic specs
    specs: Record<string, string>
}

const categories: { value: ProductCategory; label: string }[] = [
    { value: 'laptop', label: 'Laptop' },
    { value: 'phone', label: 'Phone' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'camera', label: 'Camera' },
    { value: 'audio', label: 'Audio' },
    { value: 'gaming', label: 'Gaming' },
]

const conditions: { value: ProductCondition; label: string }[] = [
    { value: 'like-new', label: 'Like New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
]

export default function CreateListing() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
        { key: '', value: '' },
    ])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductForm>()

    // Handle image upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        if (images.length + files.length > 8) {
            toast.error('Maximum 8 images allowed')
            return
        }

        if (images.length + files.length < 3) {
            toast.error('Minimum 3 images required')
        }

        // Add new images
        setImages([...images, ...files])

        // Generate previews
        files.forEach((file) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    // Remove image
    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
        setImagePreviews(imagePreviews.filter((_, i) => i !== index))
    }

    // Add spec row
    const addSpec = () => {
        setSpecs([...specs, { key: '', value: '' }])
    }

    // Remove spec row
    const removeSpec = (index: number) => {
        setSpecs(specs.filter((_, i) => i !== index))
    }

    // Update spec
    const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...specs]
        newSpecs[index][field] = value
        setSpecs(newSpecs)
    }

    const onSubmit = async (data: ProductForm) => {
        // Validate images
        if (images.length < 3) {
            toast.error('Please upload at least 3 images')
            return
        }

        if (images.length > 8) {
            toast.error('Maximum 8 images allowed')
            return
        }

        try {
            setIsLoading(true)

            // Build FormData
            const formData = new FormData()
            formData.append('category', data.category)
            formData.append('brand', data.brand)
            formData.append('modelName', data.modelName)
            formData.append('condition', data.condition)
            formData.append('price', data.price.toString())
            formData.append('description', data.description)
            formData.append('location', data.location)

            // Add specs - FIXED: Send as individual fields
            specs.forEach((spec) => {
                if (spec.key && spec.value) {
                    formData.append(`specs[${spec.key}]`, spec.value)
                }
            })

            // Add images
            images.forEach((image) => {
                formData.append('images', image)
            })

            console.log('FormData contents:')
            for (let [key, value] of formData.entries()) {
                console.log(key, value)
            }

            const response = await productService.createProduct(formData)

            toast.success('Product listed successfully!')
            navigate(`/products/${response.data.product._id}`)
        } catch (error: any) {
            console.error('Create product error:', error)
            toast.error(error.response?.data?.message || 'Failed to create listing')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Create Listing</h1>
                <p className="text-muted-foreground">
                    Sell your electronics to thousands of buyers
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
                {/* Images Upload */}
                <div>
                    <label className="block text-lg font-semibold mb-2">
                        Product Images *
                    </label>
                    <p className="text-sm text-muted-foreground mb-4">
                        Upload 3-8 clear photos of your product
                    </p>

                    {/* Image Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative aspect-square">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg border"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {/* Upload Button */}
                        {images.length < 8 && (
                            <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">Upload</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {images.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                            {images.length} image(s) uploaded (3-8 required)
                        </p>
                    )}
                </div>

                {/* Category */}
                <div>
                    <label className="block text-lg font-semibold mb-2">Category *</label>
                    <select
                        {...register('category', { required: 'Category is required' })}
                        className="w-full px-4 py-2 border rounded-lg bg-background"
                    >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <p className="mt-1 text-sm text-destructive">{errors.category.message}</p>
                    )}
                </div>

                {/* Brand & Model */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-lg font-semibold mb-2">Brand *</label>
                        <Input
                            placeholder="e.g. Apple, Samsung"
                            error={errors.brand?.message}
                            {...register('brand', { required: 'Brand is required' })}
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold mb-2">Model *</label>
                        <Input
                            placeholder="e.g. MacBook Pro 14 M3"
                            error={errors.modelName?.message}
                            {...register('modelName', { required: 'Model is required' })}
                        />
                    </div>
                </div>

                {/* Condition */}
                <div>
                    <label className="block text-lg font-semibold mb-2">Condition *</label>
                    <select
                        {...register('condition', { required: 'Condition is required' })}
                        className="w-full px-4 py-2 border rounded-lg bg-background"
                    >
                        <option value="">Select condition</option>
                        {conditions.map((cond) => (
                            <option key={cond.value} value={cond.value}>
                                {cond.label}
                            </option>
                        ))}
                    </select>
                    {errors.condition && (
                        <p className="mt-1 text-sm text-destructive">{errors.condition.message}</p>
                    )}
                </div>

                {/* Price */}
                <div>
                    <label className="block text-lg font-semibold mb-2">Price (VND) *</label>
                    <Input
                        type="number"
                        placeholder="10000000"
                        error={errors.price?.message}
                        {...register('price', {
                            required: 'Price is required',
                            min: { value: 10, message: 'Price must be at least 10 VND' },
                            max: { value: 50000000, message: 'Price cannot exceed 50,000,000 VND' },
                        })}
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-lg font-semibold mb-2">Location *</label>
                    <Input
                        placeholder="e.g. Ho Chi Minh City, District 1"
                        error={errors.location?.message}
                        {...register('location', { required: 'Location is required' })}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-lg font-semibold mb-2">Description *</label>
                    <textarea
                        rows={6}
                        placeholder="Describe your product in detail (min 50 characters)..."
                        className="w-full px-4 py-2 border rounded-lg bg-background resize-none"
                        {...register('description', {
                            required: 'Description is required',
                            minLength: { value: 50, message: 'Description must be at least 50 characters' },
                            maxLength: { value: 2000, message: 'Description cannot exceed 2000 characters' },
                        })}
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
                    )}
                </div>

                {/* Specifications */}
                <div>
                    <label className="block text-lg font-semibold mb-2">
                        Specifications (Optional)
                    </label>
                    <p className="text-sm text-muted-foreground mb-4">
                        Add technical details like RAM, Storage, etc.
                    </p>

                    <div className="space-y-3">
                        {specs.map((spec, index) => (
                            <div key={index} className="flex gap-3">
                                <Input
                                    placeholder="e.g. RAM"
                                    value={spec.key}
                                    onChange={(e) => updateSpec(index, 'key', e.target.value)}
                                    className="flex-1"
                                />
                                <Input
                                    placeholder="e.g. 16GB"
                                    value={spec.value}
                                    onChange={(e) => updateSpec(index, 'value', e.target.value)}
                                    className="flex-1"
                                />
                                {specs.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => removeSpec(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={addSpec}
                        className="mt-3"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Specification
                    </Button>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/products')}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1">
                        {isLoading ? 'Creating...' : 'Create Listing'}
                    </Button>
                </div>
            </form>
        </div>
    )
}