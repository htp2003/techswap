import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Upload, X, Plus, Image as ImageIcon, DollarSign, MapPin, FileText, Layers, Package2, CheckCircle, AlertCircle } from 'lucide-react'
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
        <div className="min-h-screen bg-muted/30 py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        <Package2 className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Create New Listing</h1>
                    <p className="text-muted-foreground text-lg">
                        List your product and reach thousands of potential buyers
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8 bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${images.length >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                                }`}>
                                {images.length >= 3 ? <CheckCircle className="w-5 h-5" /> : '1'}
                            </div>
                            <span className="text-xs font-medium text-center">Photos</span>
                        </div>
                        <div className="h-0.5 bg-border flex-1 mx-2"></div>
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold">
                                2
                            </div>
                            <span className="text-xs font-medium text-center">Details</span>
                        </div>
                        <div className="h-0.5 bg-border flex-1 mx-2"></div>
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold">
                                3
                            </div>
                            <span className="text-xs font-medium text-center">Review</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Images Section */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <ImageIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold mb-1">Product Photos</h2>
                                <p className="text-sm text-muted-foreground">
                                    Upload 3-8 clear photos. First image will be the cover photo.
                                </p>
                            </div>
                        </div>

                        {/* Image Upload Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group aspect-square">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg border-2 border-border"
                                    />
                                    {index === 0 && (
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-white text-xs font-medium rounded">
                                            Cover
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {/* Upload Button */}
                            {images.length < 8 && (
                                <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors group">
                                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                                    <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                        Add Photo
                                    </span>
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

                        {/* Image Counter */}
                        <div className="mt-4 flex items-center gap-2">
                            {images.length >= 3 ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-orange-500" />
                            )}
                            <span className={`text-sm font-medium ${images.length >= 3 ? 'text-green-600' : 'text-orange-500'
                                }`}>
                                {images.length}/8 photos uploaded
                                {images.length < 3 && ` (minimum 3 required)`}
                            </span>
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-start gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Layers className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold mb-1">Product Information</h2>
                                <p className="text-sm text-muted-foreground">
                                    Provide accurate details about your product
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Category <span className="text-destructive">*</span>
                                </label>
                                <select
                                    {...register('category', { required: 'Category is required' })}
                                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {errors.category.message}
                                    </p>
                                )}
                            </div>

                            {/* Brand & Model */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Brand <span className="text-destructive">*</span>
                                    </label>
                                    <Input
                                        placeholder="e.g. Apple, Samsung, Dell"
                                        error={errors.brand?.message}
                                        {...register('brand', { required: 'Brand is required' })}
                                        className="h-11"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Model Name <span className="text-destructive">*</span>
                                    </label>
                                    <Input
                                        placeholder="e.g. MacBook Pro 14 M3"
                                        error={errors.modelName?.message}
                                        {...register('modelName', { required: 'Model name is required' })}
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            {/* Condition */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Condition <span className="text-destructive">*</span>
                                </label>
                                <select
                                    {...register('condition', { required: 'Condition is required' })}
                                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                >
                                    <option value="">Select condition</option>
                                    {conditions.map((cond) => (
                                        <option key={cond.value} value={cond.value}>
                                            {cond.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.condition && (
                                    <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {errors.condition.message}
                                    </p>
                                )}
                            </div>

                            {/* Price & Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Price (VND) <span className="text-destructive">*</span>
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            placeholder="10,000,000"
                                            error={errors.price?.message}
                                            {...register('price', {
                                                required: 'Price is required',
                                                min: { value: 10, message: 'Minimum price is 10 VND' },
                                                max: { value: 50000000, message: 'Maximum price is 50,000,000 VND' },
                                            })}
                                            className="h-11 pl-10"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Location <span className="text-destructive">*</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            placeholder="Ho Chi Minh City"
                                            error={errors.location?.message}
                                            {...register('location', { required: 'Location is required' })}
                                            className="h-11 pl-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold mb-1">Description</h2>
                                <p className="text-sm text-muted-foreground">
                                    Write a detailed description to attract buyers
                                </p>
                            </div>
                        </div>

                        <textarea
                            rows={8}
                            placeholder="Describe your product in detail. Include information about:
• Overall condition and any wear/damage
• What's included (accessories, box, etc.)
• Why you're selling
• Any other relevant details

Minimum 50 characters required."
                            className="w-full px-4 py-3 border border-border rounded-lg bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            {...register('description', {
                                required: 'Description is required',
                                minLength: { value: 50, message: 'Description must be at least 50 characters' },
                                maxLength: { value: 2000, message: 'Description cannot exceed 2000 characters' },
                            })}
                        />
                        {errors.description && (
                            <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Specifications Section */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Layers className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold mb-1">
                                    Technical Specifications
                                    <span className="text-sm font-normal text-muted-foreground ml-2">(Optional)</span>
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Add key specs like RAM, storage, processor, etc.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {specs.map((spec, index) => (
                                <div key={index} className="flex gap-3 items-start">
                                    <Input
                                        placeholder="Spec name (e.g. RAM)"
                                        value={spec.key}
                                        onChange={(e) => updateSpec(index, 'key', e.target.value)}
                                        className="flex-1 h-10"
                                    />
                                    <Input
                                        placeholder="Value (e.g. 16GB)"
                                        value={spec.value}
                                        onChange={(e) => updateSpec(index, 'value', e.target.value)}
                                        className="flex-1 h-10"
                                    />
                                    {specs.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSpec(index)}
                                            className="h-10 w-10 p-0"
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
                            className="mt-4"
                            size="sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Specification
                        </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/products')}
                            className="flex-1 h-12"
                            size="lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || images.length < 3}
                            className="flex-1 h-12"
                            size="lg"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Creating Listing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Create Listing
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Help Text */}
                    <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            By creating a listing, you agree to our terms of service.
                            Your product will be reviewed before going live.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}