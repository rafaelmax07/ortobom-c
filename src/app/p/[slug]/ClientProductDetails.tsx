'use client'

import { useState } from 'react'
import { VariantSelector } from '@/components/ui/VariantSelector'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { ShieldCheck, Truck } from 'lucide-react'

interface Variant {
    id: string
    size: string
    price: number
    sku: string
    stock: number
    compare_at_price?: number
}

interface Product {
    id: string
    name: string
    description: string
    slug: string
    variants: Variant[]
}

export function ClientProductDetails({ product }: { product: Product }) {
    // Select first variant by default if available? OR force user to pick?
    // Let's select first one to show a price immediately.
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(product.variants?.[0] || null)

    const price = selectedVariant ? selectedVariant.price : 0
    const oldPrice = selectedVariant?.compare_at_price || null

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold text-[#1B2B4E] mb-2">{product.name}</h1>
                <p className="text-sm text-gray-500">Código: {selectedVariant?.sku || '...'}</p>
            </div>

            {/* Price Box */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                {oldPrice && oldPrice > price && (
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-gray-400 line-through text-lg">
                        {oldPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-bold">
                        {Math.round((1 - price / oldPrice) * 100)}% OFF
                    </span>
                </div>
                )}
                <div className="text-4xl font-extrabold text-[#1B2B4E] mb-2">
                    {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <p className="text-gray-500 text-sm">
                    ou 12x de {(price / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros
                </p>
            </div>

            {/* Variant Selector */}
            <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
            />

            {/* Actions */}
            <div className="mt-4">
                <WhatsAppButton
                    productName={product.name}
                    selectedVariant={selectedVariant}
                />
                <p className="text-center text-xs text-gray-500 mt-3">
                    Compra segura via WhatsApp com nossos vendedores.
                </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-4 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-3 rounded-full text-blue-800">
                        <Truck size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-[#1B2B4E]">Frete Grátis*</h4>
                        <p className="text-xs text-gray-500">Consulte sua região</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-3 rounded-full text-blue-800">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-[#1B2B4E]">Garantia Ortobom</h4>
                        <p className="text-xs text-gray-500">Qualidade certificada</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
