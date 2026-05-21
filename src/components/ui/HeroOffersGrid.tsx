'use client'

import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { OffersCountdown } from './OffersCountdown'
import { ProductCard, type ProductCardProduct } from './ProductCard'
import { IconButton } from './primitives/IconButton'

interface HeroOffersGridProps {
    products: ProductCardProduct[]
}

export function HeroOffersGrid({ products }: HeroOffersGridProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
    })

    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => {
            setCanScrollPrev(emblaApi.canScrollPrev())
            setCanScrollNext(emblaApi.canScrollNext())
        }
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
        return () => {
            emblaApi.off('select', onSelect)
            emblaApi.off('reInit', onSelect)
        }
    }, [emblaApi])

    if (products.length === 0) return null

    return (
        <section className="bg-bg-light py-10">
            <div className="max-w-[1280px] mx-auto px-6">
                {/* Header da seção */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="t-subsection-heading flex items-center gap-2">
                        <span aria-hidden="true">🔥</span>
                        Todo site com 10% OFF EXTRA com o cupom SUPER10
                    </h2>
                    <Link
                        href="/c/colchoes"
                        className="t-link whitespace-nowrap"
                    >
                        Ver todas &gt;
                    </Link>
                </div>

                {/* Wrapper que controla a área do carousel */}
                <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-5">
                    {/* Card Countdown */}
                    <div
                        className="relative rounded-[var(--radius-card)] flex flex-col text-center text-white min-h-[400px] overflow-hidden pt-[50px]"
                        style={{
                            background:
                                'linear-gradient(135deg, #243E69 0%, #152238 50%, #0E1624 100%)',
                        }}
                    >
                        {/* Efeito de luz (luar) no canto superior esquerdo */}
                        <div
                            aria-hidden="true"
                            className="absolute pointer-events-none"
                            style={{
                                top: -90,
                                left: -90,
                                width: 220,
                                height: 220,
                                background:
                                    'radial-gradient(circle at center, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.12) 28%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 72%)',
                                filter: 'blur(16px)',
                            }}
                        />

                        {/* 4 ondas concêntricas centralizadas no topo, com distância vertical fixa */}
                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
                            style={{
                                width: 140,
                                height: 140,
                                top: -100,
                                border: '2px solid rgba(180,190,210,0.025)',
                            }}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
                            style={{
                                width: 230,
                                height: 230,
                                top: -120,
                                border: '2px solid rgba(180,190,210,0.02)',
                            }}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
                            style={{
                                width: 320,
                                height: 320,
                                top: -140,
                                border: '2px solid rgba(180,190,210,0.015)',
                            }}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
                            style={{
                                width: 410,
                                height: 410,
                                top: -160,
                                border: '2px solid rgba(180,190,210,0.012)',
                            }}
                        />

                        {/* Header */}
                        <header className="relative z-10 px-6 text-center">
                            <h3 className="text-[22px] font-bold leading-[1.3] text-white mb-2 drop-shadow-sm">
                                Sua melhor noite de
                                <br />
                                sono começa agora <span aria-hidden="true">🌙</span>
                            </h3>
                            <p className="text-[14px] font-medium text-white/90">
                                Ofertas imbatíveis por pouco tempo!
                            </p>
                        </header>

                        {/* Anel SVG + timer dentro */}
                        <section className="relative z-10 mx-auto mt-8 w-[240px] h-[240px]">
                            <svg
                                viewBox="0 0 260 260"
                                className="w-full h-full"
                                style={{ transform: 'rotate(-90deg)' }}
                                aria-hidden="true"
                            >
                                {/* Track */}
                                <circle
                                    cx="130"
                                    cy="130"
                                    r="125"
                                    fill="transparent"
                                    stroke="#1E304D"
                                    strokeWidth="6"
                                />
                                {/* Progress */}
                                <circle
                                    cx="130"
                                    cy="130"
                                    r="125"
                                    fill="transparent"
                                    stroke="#2F64BA"
                                    strokeWidth="6"
                                    strokeDasharray="785"
                                    strokeDashoffset="200"
                                    strokeLinecap="round"
                                />
                            </svg>

                            {/* Timer text content sobre o anel */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <OffersCountdown />
                            </div>
                        </section>
                    </div>

                    {/* Carousel de produtos */}
                    <div className="relative min-w-0">
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex-[0_0_33.333%] min-w-0 px-2 [&>article_.aspect-square]:aspect-[5/4]"
                                    >
                                        <ProductCard product={product} variant="offer" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Setas de navegação */}
                        {canScrollPrev && (
                            <IconButton
                                type="button"
                                aria-label="Produtos anteriores"
                                onClick={scrollPrev}
                                variant="default"
                                size="lg"
                                rounded="full"
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 shadow-md hidden lg:flex"
                            >
                                <ChevronLeft size={20} />
                            </IconButton>
                        )}
                        {canScrollNext && (
                            <IconButton
                                type="button"
                                aria-label="Próximos produtos"
                                onClick={scrollNext}
                                variant="default"
                                size="lg"
                                rounded="full"
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 shadow-md hidden lg:flex"
                            >
                                <ChevronRight size={20} />
                            </IconButton>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
