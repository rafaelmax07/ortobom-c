import { Star } from 'lucide-react'

interface StarRatingProps {
    size?: number
    className?: string
}

export function StarRating({ size = 16, className = '' }: StarRatingProps) {
    return (
        <span className={`inline-flex items-center gap-0.5 text-[#ffb400] ${className}`} aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
            ))}
        </span>
    )
}
