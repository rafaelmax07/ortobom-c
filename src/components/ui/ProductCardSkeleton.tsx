export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-[var(--radius-card)] border border-border overflow-hidden flex flex-col h-full animate-pulse">
            {/* Image skeleton */}
            <div className="aspect-square bg-bg-light" />

            {/* Content skeleton */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="h-3 w-16 bg-bg-light rounded-[var(--radius-button)] mb-2" />
                <div className="h-4 w-full bg-bg-light rounded-[var(--radius-button)] mb-1" />
                <div className="h-4 w-3/4 bg-bg-light rounded-[var(--radius-button)] mb-4" />

                <div className="mt-auto pt-2 border-t border-border">
                    <div className="h-7 w-28 bg-bg-light rounded-[var(--radius-button)] mb-2" />
                    <div className="h-3 w-40 bg-bg-light rounded-[var(--radius-button)] mb-4" />
                    <div className="h-11 w-full bg-bg-light rounded-[var(--radius-card)]" />
                </div>
            </div>
        </div>
    )
}
