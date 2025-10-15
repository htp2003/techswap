import { Star } from 'lucide-react'

interface StarRatingProps {
    rating: number
    maxRating?: number
    size?: 'sm' | 'md' | 'lg'
    interactive?: boolean
    onRatingChange?: (rating: number) => void
}

export default function StarRating({
    rating,
    maxRating = 5,
    size = 'md',
    interactive = false,
    onRatingChange
}: StarRatingProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    }

    const handleClick = (index: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(index + 1)
        }
    }

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: maxRating }).map((_, index) => {
                const isFilled = index < rating

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleClick(index)}
                        disabled={!interactive}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                    >
                        <Star
                            className={`${sizeClasses[size]} ${isFilled
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                        />
                    </button>
                )
            })}
        </div>
    )
}