import { formatBRL } from '@/lib/whatsapp'

interface PriceDisplayProps {
    priceLabel?: string
    price: number
    compareAtPrice?: number | null
    showInstallments?: boolean
    installmentCount?: number
}

export function PriceDisplay({
    priceLabel,
    price,
    compareAtPrice,
    showInstallments = true,
    installmentCount = 6,
}: PriceDisplayProps) {
    const hasCompare = compareAtPrice != null && compareAtPrice > price

    return (
        <div className="flex flex-col">
            {priceLabel && (
                <span className="text-xs text-text-muted">{priceLabel}</span>
            )}

            {hasCompare && (
                <span className="text-xs text-text-muted line-through">
                    {formatBRL(compareAtPrice as number)}
                </span>
            )}

            <p className="text-xl md:text-2xl font-extrabold text-primary tabular-nums">
                {formatBRL(price)}
                <span className="text-xs font-normal text-text-muted ml-1">
                    à vista
                </span>
            </p>

            {showInstallments && (
                <p className="text-[11px] text-text-muted">
                    ou até <strong>{installmentCount}x</strong> de{' '}
                    <strong>{formatBRL(price / installmentCount)}</strong> sem juros
                </p>
            )}
        </div>
    )
}
