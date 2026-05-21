import { formatBRL } from '@/lib/whatsapp'

export type PriceDisplayVariant = 'card' | 'pdp' | 'cart-line' | 'mini'

interface PriceDisplayProps {
    price: number
    compareAtPrice?: number | null
    /** "A partir de", "" ou outro prefixo opcional */
    priceLabel?: string
    /** Variante de uso, controla tamanhos */
    variant?: PriceDisplayVariant
    /** Mostrar parcelamento "ou até Nx de R$ X" */
    showInstallments?: boolean
    installmentCount?: number
    /** Mostrar badge "Economize R$ X" antes do preço (default: false) */
    showSavings?: boolean
    className?: string
}

/**
 * Componente único para exibir preços em todos os lugares do site.
 * Variantes:
 *  - "card" (default): preço médio com sufixo "à vista"
 *  - "pdp": preço grande (extra-bold) na página do produto
 *  - "cart-line": valor compacto, sem parcelamento
 *  - "mini": só o preço atual, sem strike, sem parcelamento
 */
export function PriceDisplay({
    price,
    compareAtPrice,
    priceLabel,
    variant = 'card',
    showInstallments,
    installmentCount = 6,
    showSavings = false,
    className = '',
}: PriceDisplayProps) {
    const hasCompare = compareAtPrice != null && compareAtPrice > price
    const savings = hasCompare ? compareAtPrice - price : 0
    const installmentValue = price / installmentCount

    // defaults por variante
    const installmentsDefault = variant === 'card' || variant === 'pdp'
    const showInst = showInstallments ?? installmentsDefault

    const priceClass =
        variant === 'pdp'
            ? 't-price-large'
            : variant === 'mini'
                ? 't-price-medium'
                : 't-price-medium'

    const showSuffix = variant !== 'mini' && variant !== 'cart-line'

    return (
        <div className={`flex flex-col ${className}`}>
            {priceLabel && variant !== 'mini' && (
                <span className="t-meta">{priceLabel}</span>
            )}

            {showSavings && hasCompare && (
                <span className="inline-block t-badge-savings bg-success-bg text-success px-2.5 py-1 rounded mb-2 self-start">
                    Economize {formatBRL(savings)}
                </span>
            )}

            {hasCompare && variant !== 'mini' && (
                <span className="t-price-strike mb-1.5">{formatBRL(compareAtPrice)}</span>
            )}

            <p className={priceClass}>
                {formatBRL(price)}
                {showSuffix && (
                    <span className="t-price-suffix ml-1">à vista</span>
                )}
            </p>

            {showInst && (
                <p className="t-product-installments mt-1">
                    ou até <strong>{installmentCount}x</strong> de{' '}
                    <strong>{formatBRL(installmentValue)}</strong> sem juros
                </p>
            )}
        </div>
    )
}
