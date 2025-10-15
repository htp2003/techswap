import { formatDate } from '@/lib/utils'
import StarRating from '@/components/ui/StarRating'
import type { Review } from '../../types/review.types'
import type { User } from '../../types/user.types'

interface ReviewCardProps {
    review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
    const reviewer = typeof review.reviewerId === 'object' ? review.reviewerId as User : null

    return (
        <div className="bg-background border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
                {/* Reviewer Info */}
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {reviewer?.name.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <p className="font-medium">{reviewer?.name || 'Anonymous'}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
                    </div>
                </div>

                {/* Rating */}
                <StarRating rating={review.rating} size="sm" />
            </div>

            {/* Comment */}
            {review.comment && (
                <p className="text-muted-foreground">{review.comment}</p>
            )}
        </div>
    )
}