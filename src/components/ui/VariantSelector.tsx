'use client'

import { formatBRL } from '@/lib/whatsapp'

interface Variant {
    id: string
    size: string
    price: number
    sku: string
    stock: number
    compare_at_price?: number
    dimensions?: string | null
}

interface VariantSelectorProps {
    variants: Variant[]
    selectedVariant: Variant | null
    onSelect: (variant: Variant) => void
}

export function VariantSelector({ variants, selectedVariant, onSelect }: VariantSelectorProps) {
    // Sort variants by standard sizes
    const sizeOrder = ['Solteiro', 'Solteiro Extra', 'Casal', 'Queen', 'King', 'Super King', 'Sob medida', 'Padrão']
    const sortedVariants = [...variants].sort((a, b) => {
        const indexA = sizeOrder.indexOf(a.size)
        const indexB = sizeOrder.indexOf(b.size)
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB)
    })

    return (
        <div className="flex flex-col gap-3">
            <header className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-navy-dark">
                    Selecionar tamanho
                </span>
                <button
                    type="button"
                    className="text-xs text-primary hover:underline font-medium"
                >
                    Entenda
                </button>
            </header>

            <div role="radiogroup" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sortedVariants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id

                    return (
                        <button
                            key={variant.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => onSelect(variant)}
                            className={
                                isSelected
                                    ? 'border-2 border-primary bg-primary/5 rounded-[var(--radius-card)] p-3 flex flex-col items-center text-center'
                                    : 'border-2 border-transparent bg-bg-light hover:border-primary/40 rounded-[var(--radius-card)] p-3 flex flex-col items-center text-center'
                            }
                        >
                            <span className="text-sm font-bold text-navy-dark">
                                {variant.size}
                            </span>
                            {variant.dimensions && (
                                <span className="text-xs text-text-muted">
                                    {variant.dimensions}
                                </span>
                            )}
                            <span className="mt-1 text-sm font-extrabold text-primary tabular-nums">
                                {variant.size === 'Sob medida' ? 'Consultar' : formatBRL(variant.price)}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
