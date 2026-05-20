'use client'

import { useState } from 'react'
import { VariantSelector } from '@/components/ui/VariantSelector'
import { ShieldCheck, Truck, ShoppingCart, MessageCircle } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface Variant {
    id: string
    size: string
    price: number
    sku: string
    stock: number
    compare_at_price?: number
    dimensions?: string | null
}

interface Product {
    id: string
    name: string
    description: string
    slug: string
    featured_image?: string
    variants: Variant[]
}

export function ClientProductDetails({ product }: { product: Product }) {
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(product.variants?.[0] || null)
    const { addItem, buildSingleItemWhatsAppUrl } = useCart()

    const price = selectedVariant ? selectedVariant.price : 0
    const oldPrice = selectedVariant?.compare_at_price || null
    const savings = oldPrice && oldPrice > price ? oldPrice - price : 0
    const discountPct = oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0

    // ── Adicionar ao carrinho ────────────────────────────────────────────────
    const handleAddToCart = () => {
        if (!selectedVariant) return
        addItem({
            variantId: selectedVariant.id,
            productSlug: product.slug,
            productName: product.name,
            variantSize: selectedVariant.size,
            variantSku: selectedVariant.sku,
            price: selectedVariant.price,
            image: product.featured_image || '',
            quantity: 1,
            dimensions: selectedVariant.dimensions,
        })
    }

    // ── Comprar agora (direto WhatsApp) ─────────────────────────────────────
    const handleBuyNow = () => {
        if (!selectedVariant) return
        const url = buildSingleItemWhatsAppUrl({
            variantId: selectedVariant.id,
            productSlug: product.slug,
            productName: product.name,
            variantSize: selectedVariant.size,
            variantSku: selectedVariant.sku,
            price: selectedVariant.price,
            image: product.featured_image || '',
            dimensions: selectedVariant.dimensions,
        })
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Product name & SKU */}
            <div>
                <h1 className="text-3xl font-bold text-[#1B2B4E] mb-2">{product.name}</h1>
                <p className="text-sm text-gray-500">Código: {selectedVariant?.sku || '—'}</p>
            </div>

            {/* Price Box */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                {oldPrice && oldPrice > price && (
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-gray-400 line-through text-lg">
                            {oldPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-sm font-bold">
                            {discountPct}% OFF
                        </span>
                    </div>
                )}

                <div className="text-4xl font-extrabold text-[#1B2B4E] mb-1">
                    {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    <span className="text-base font-normal text-gray-500 ml-1">à vista</span>
                </div>

                {savings > 0 && (
                    <p className="text-green-600 text-sm font-semibold mb-1">
                        Economize {savings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                )}

                <p className="text-gray-500 text-sm">
                    ou até 21x de{' '}
                    <strong className="text-gray-700">
                        {(price / 21).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong>{' '}
                    com juros no cartão
                </p>
            </div>

            {/* Variant Selector */}
            <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
            />

            {/* ── Action Buttons ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 mt-2">
                {/* Primary: Adicionar ao Carrinho */}
                <button
                    id="add-to-cart-button"
                    onClick={handleAddToCart}
                    disabled={!selectedVariant}
                    className={`
                        w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl
                        text-base transition-all duration-200 shadow-md
                        ${selectedVariant
                            ? 'bg-[#1B2B4E] hover:bg-[#243a65] active:scale-[0.98] text-white shadow-[#1B2B4E]/25'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    <ShoppingCart size={20} />
                    Adicionar ao Carrinho
                </button>

                {/* Secondary: Comprar agora (WhatsApp direto) */}
                <button
                    id="buy-now-button"
                    onClick={handleBuyNow}
                    disabled={!selectedVariant}
                    className={`
                        w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl
                        text-base transition-all duration-200
                        ${selectedVariant
                            ? 'bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white shadow-md shadow-green-500/30'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    <MessageCircle size={20} />
                    Comprar agora
                </button>

                {!selectedVariant && (
                    <p className="text-center text-xs text-orange-500 font-medium">
                        Selecione um tamanho para continuar
                    </p>
                )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-3 rounded-full text-[#1B2B4E]">
                        <Truck size={22} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-[#1B2B4E]">Frete Grátis*</h4>
                        <p className="text-xs text-gray-500">a partir de R$ 300</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-3 rounded-full text-[#1B2B4E]">
                        <ShieldCheck size={22} />
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
