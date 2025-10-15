import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import Button from '@/components/ui/Button'
import StarRating from '@/components/ui/StarRating'
import { reviewService } from '@/services/review.service'

interface CreateReviewFormProps {
    orderId: string
    onClose: () => void
    onSuccess?: () => void
}

export default function CreateReviewForm({ orderId, onClose, onSuccess }: CreateReviewFormProps) {
    const queryClient = useQueryClient()
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const createReviewMutation = useMutation({
        mutationFn: () => reviewService.createReview({ orderId, rating, comment }),
        onSuccess: () => {
            toast.success('Review submitted successfully!')
            queryClient.invalidateQueries({ queryKey: ['order', orderId] })
            onSuccess?.()
            onClose()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to submit review')
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            toast.error('Please select a rating')
            return
        }

        createReviewMutation.mutate()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-md w-full p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <h2 className="text-2xl font-bold mb-6">Leave a Review</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating */}
                    <div>
                        <label className="block font-medium mb-3">Your Rating *</label>
                        <div className="flex justify-center">
                            <StarRating
                                rating={rating}
                                size="lg"
                                interactive
                                onRatingChange={setRating}
                            />
                        </div>
                        {rating > 0 && (
                            <p className="text-center mt-2 text-sm text-muted-foreground">
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent'}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block font-medium mb-2">
                            Comment <span className="text-muted-foreground">(Optional)</span>
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={500}
                            className="w-full px-4 py-2 border rounded-lg bg-background resize-none"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            {comment.length}/500 characters
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={rating === 0 || createReviewMutation.isPending}
                            className="flex-1"
                        >
                            {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}