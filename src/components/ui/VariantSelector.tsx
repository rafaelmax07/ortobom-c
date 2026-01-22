'use client'

interface Variant {
    id: string
    size: string
    price: number
    sku: string
    stock: number
}

interface VariantSelectorProps {
    variants: Variant[]
    selectedVariant: Variant | null
    onSelect: (variant: Variant) => void
}

export function VariantSelector({ variants, selectedVariant, onSelect }: VariantSelectorProps) {
    // Sort variants (Solteiro -> Casal -> Queen -> King)
    const sizeOrder = ['Solteiro', 'Casal', 'Queen', 'King']
    const sortedVariants = [...variants].sort((a, b) => {
        return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size)
    })

    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900">
                Escolha o Tamanho:
                <span className="ml-2 text-blue-800 font-bold">{selectedVariant?.size}</span>
            </label>

            <div className="flex flex-wrap gap-3">
                {sortedVariants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id
                    return (
                        <button
                            key={variant.id}
                            onClick={() => onSelect(variant)}
                            className={`px-4 py-2 border rounded-md text-sm font-medium transition-all
                            ${isSelected
                                    ? 'border-[#1B2B4E] bg-[#1B2B4E] text-white shadow-md transform scale-105'
                                    : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                                }
                        `}
                        >
                            {variant.size}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
