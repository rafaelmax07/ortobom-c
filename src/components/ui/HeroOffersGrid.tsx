'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, ChevronRight } from 'lucide-react'
import { OffersCountdown } from './OffersCountdown'

interface Product {
    id: string
    name: string
    slug: string
    price: number
    compare_at_price?: number | null
    featured_image: string
}

interface HeroOffersGridProps {
    products: Product[]
}

export function HeroOffersGrid({ products }: HeroOffersGridProps) {
    if (products.length === 0) return null

    return (
        <section className="py-6 md:py-8">
            <div className="max-w-[1320px] mx-auto px-4">
                {/* "Ver todas" link */}
                <div className="flex justify-end mb-3">
                    <Link href="/c/colchoes" className="text-sm text-primary font-medium hover:underline">
                        Ver todas &gt;
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
                    {/* Left: Countdown card (navy background) */}
                    <div className="bg-primary rounded-[var(--radius-card)] p-6 flex flex-col items-center justify-center text-center text-white min-h-[280px]">
                        <h2 className="text-lg font-semibold leading-tight mb-1">
                            Sua melhor noite de sono começa agora
                            <span className="ml-1">🌙</span>
                        </h2>
                        <p className="text-xs text-white/70 mb-6">
                            Aproveite as ofertas especiais só até hoje!
                        </p>
                        <OffersCountdown />
                    </div>

                    {/* Right: Product cards (horizontal scroll on mobile, grid on desktop) */}
                    <div className="relative">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {products.slice(0, 3).map((product) => {
                                const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
                                const discountPct = hasDiscount
                                    ? Math.round((1 - product.price / (product.compare_at_price || 1)) * 100)
                                    : 0
                                const savings = hasDiscount ? (product.compare_at_price! - product.price) : 0
                                const installment6x = product.price / 6

                                return (
                                    <Link
                                        key={product.id}
                                        href={`/p/${product.slug}`}
                                        className="group bg-white border border-border rounded-[var(--radius-card)] overflow-hidden flex flex-col hover:shadow-[var(--shadow-lg)] transition-shadow"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] bg-white overflow-hidden">
                                            {hasDiscount && (
                                                <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 bg-danger text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                                    {discountPct}% OFF
                                                </span>
                                            )}
                                            <Image
                                                src={product.featured_image || 'https://placehold.co/400x300/png?text=Ortobom'}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                className="object-contain p-3 group-hover:scale-[1.03] transition-transform duration-200"
                                                unoptimized
                                            />
                                        </div>

                                        {/* Body */}
                                        <div className="p-3 flex flex-col flex-grow">
                                            <h3 className="text-sm font-semibold text-text-main leading-tight line-clamp-2 mb-2">
                                                {product.name}
                                            </h3>

                                            <div className="mt-auto">
                                                {hasDiscount && (
                                                    <p className="text-[11px] text-accent font-semibold mb-0.5">
                                                        Economize {savings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </p>
                                                )}
                                                {hasDiscount && (
                                                    <p className="text-xs text-text-muted line-through">
                                                        {product.compare_at_price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </p>
                                                )}
                                                <p className="text-lg font-bold text-text-main tabular-nums">
                                                    {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    <span className="text-xs font-normal text-text-muted ml-1">à vista</span>
                                                </p>
                                                <p className="text-[11px] text-text-muted mb-3">
                                                    ou até <strong>6x</strong> de <strong>{installment6x.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong> sem juros
                                                </p>

                                                <span className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white py-2 px-3 rounded-[var(--radius-button)] font-bold text-xs transition-colors duration-200">
                                                    <ShoppingCart size={13} />
                                                    Comprar
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Nav arrow (right) */}
                        <button className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-3 w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow hidden lg:flex">
                            <ChevronRight size={16} className="text-text-muted" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
