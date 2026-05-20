'use client'

interface Variant {
    id: string
    size: string
    price: number
    sku: string
    stock: number
    dimensions?: string | null
}

interface VariantSelectorProps {
    variants: Variant[]
    selectedVariant: Variant | null
    onSelect: (variant: Variant) => void
}

export function VariantSelector({ variants, selectedVariant, onSelect }: VariantSelectorProps) {
    // Sort variants (Solteiro -> Casal -> Queen -> King -> Super King -> Padrão)
    const sizeOrder = ['Solteiro', 'Casal', 'Queen', 'King', 'Super King', 'Padrão']
    const sortedVariants = [...variants].sort((a, b) => {
        const indexA = sizeOrder.indexOf(a.size)
        const indexB = sizeOrder.indexOf(b.size)
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB)
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">
                    Selecione o tamanho ideal:
                </span>
                {selectedVariant && (
                    <span className="text-xs text-[#F97316] font-extrabold uppercase bg-orange-50 px-2.5 py-0.5 rounded-full">
                        {selectedVariant.size}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sortedVariants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id
                    
                    const formattedPrice = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        maximumFractionDigits: 0
                    }).format(variant.price)

                    return (
                        <button
                            key={variant.id}
                            type="button"
                            onClick={() => onSelect(variant)}
                            className={`
                                flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer
                                ${isSelected
                                    ? 'border-[#1B2B4E] bg-blue-50/50 ring-2 ring-[#1B2B4E]/80 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                }
                            `}
                        >
                            {/* Size title */}
                            <span className={`text-xs md:text-sm font-bold block mb-0.5 ${isSelected ? 'text-[#1B2B4E]' : 'text-gray-800'}`}>
                                {variant.size}
                            </span>
                            
                            {/* Dimensions */}
                            {variant.dimensions ? (
                                <span className="text-[10px] text-gray-400 font-medium block mb-1.5 truncate max-w-full">
                                    {variant.dimensions}
                                </span>
                            ) : (
                                <span className="text-[10px] text-gray-300 font-medium block mb-1.5">—</span>
                            )}
                            
                            {/* Price */}
                            <span className={`text-xs md:text-sm font-black block ${isSelected ? 'text-[#F97316]' : 'text-[#1B2B4E]'}`}>
                                {formattedPrice}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
