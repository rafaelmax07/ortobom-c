'use client'

import { useState } from 'react'
import Link from 'next/link'
import { VariantSelector } from '@/components/ui/VariantSelector'
import { MobileStickyCTA } from '@/components/ui/MobileStickyCTA'
import { Truck, CreditCard, ShoppingCart } from 'lucide-react'
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
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const { addItem } = useCart()

    const price = selectedVariant ? selectedVariant.price : 0
    const oldPrice = selectedVariant?.compare_at_price || null
    const savings = oldPrice && oldPrice > price ? oldPrice - price : 0
    const discountPct = oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0

    // Installment calculation (6x sem juros like official)
    const installmentValue = price / 6

    const handleAddToCart = () => {
        if (!selectedVariant) return
        addItem({
            variantId: selectedVariant.id,
            productSlug: product.slug,
            productName: product.name,
            variantSize: selectedVariant.size,
            variantSku: selectedVariant.sku,
            price: selectedVariant.price,
            compare_at_price: selectedVariant.compare_at_price ?? null,
            image: product.featured_image || '',
            quantity: quantity,
            dimensions: selectedVariant.dimensions,
        })
    }

    // Short description (first 200 chars)
    const shortDescription = product.description
        ? product.description.replace(/<[^>]*>/g, '').substring(0, 200)
        : ''

    return (
        <>
        <div className="flex flex-col gap-5">
            {/* Discount badge */}
            {discountPct > 0 && (
                <span className="inline-flex items-center gap-1 bg-success text-white font-bold text-xs px-3 py-1 rounded-full w-fit">
                    {discountPct}% OFF
                </span>
            )}

            {/* Breadcrumb category */}
            <div className="text-xs text-text-muted">
                <Link href="/" className="hover:text-navy-medium">Home</Link>
                {' / '}
                <Link href="/c/colchoes" className="hover:text-navy-medium">Colchão</Link>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-navy-medium">{product.name}</h1>

            {/* Short description + "Ler mais" */}
            {shortDescription && (
                <div className="text-sm text-text-soft leading-relaxed">
                    <p>{showFullDescription ? product.description?.replace(/<[^>]*>/g, '') : shortDescription + '...'}</p>
                    <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-navy-medium font-semibold text-sm mt-1 hover:underline"
                    >
                        {showFullDescription ? 'Ler menos' : 'Ler mais'}
                    </button>
                </div>
            )}

            {/* Variant Selector */}
            <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
            />

            {/* Price Box */}
            <div className="space-y-1 pt-2">
                {oldPrice && oldPrice > price && (
                    <div className="flex items-center gap-3">
                        <span className="text-text-muted line-through text-base">
                            {oldPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <span className="text-sm text-success font-semibold">
                            Economize {savings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </div>
                )}

                <div className="text-3xl font-extrabold text-navy-medium">
                    {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    <span className="text-sm font-normal text-text-muted ml-1">à vista</span>
                </div>

                <p className="text-sm text-text-muted">
                    ou até <strong className="text-text-soft">6x</strong> de{' '}
                    <strong className="text-text-soft">
                        {installmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong>{' '}
                    sem juros no cartão
                </p>
                <button className="text-xs text-navy-medium font-medium hover:underline">
                    Ver opções de parcelamento
                </button>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 pt-2">
                {/* Quantity selector */}
                <div className="flex items-center border border-border rounded-md">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2.5 text-text-soft hover:text-navy-medium text-lg font-medium"
                        aria-label="Diminuir quantidade"
                    >
                        −
                    </button>
                    <span className="px-3 py-2.5 text-sm font-bold min-w-[32px] text-center">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2.5 text-text-soft hover:text-navy-medium text-lg font-medium"
                        aria-label="Aumentar quantidade"
                    >
                        +
                    </button>
                </div>

                {/* Add to cart button */}
                <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant}
                    className={`
                        flex-1 flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-[var(--radius-button)] text-sm transition-all duration-150
                        ${selectedVariant
                            ? 'bg-primary hover:bg-primary-hover text-white active:scale-[0.98]'
                            : 'bg-bg-light text-text-muted cursor-not-allowed'
                        }
                    `}
                >
                    <ShoppingCart size={18} />
                    Adicionar ao carrinho
                </button>
            </div>

            {!selectedVariant && (
                <p className="text-xs text-accent font-medium">
                    Selecione um tamanho para continuar
                </p>
            )}

            {/* Trust badges (inline, like official) */}
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-sm text-text-soft">
                    <Truck size={18} className="text-navy-medium flex-shrink-0" />
                    <span><strong className="text-text-main">Frete Grátis</strong> a partir de R$ 300</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-soft">
                    <CreditCard size={18} className="text-navy-medium flex-shrink-0" />
                    <span><strong className="text-text-main">Pagamento</strong> em até 6x sem juros</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-soft">
                    <Truck size={18} className="text-success flex-shrink-0" />
                    <span><strong className="text-text-main">Entrega em até 7 dias úteis</strong></span>
                    <span className="text-success font-bold text-xs bg-success-bg px-2 py-0.5 rounded">Grátis</span>
                </div>
            </div>
        </div>
        <MobileStickyCTA productName={product.name} selectedVariant={selectedVariant} />
        </>
    )
}
