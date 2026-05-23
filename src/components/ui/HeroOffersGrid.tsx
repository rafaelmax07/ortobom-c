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
        loop: true,
        align: 'start',
        slidesToScroll: 1,
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
            <div className="max-w-[1280px] mx-auto px-3 lg:px-6">
                {/* Header da seção */}
                <div className="flex items-center justify-between gap-4 mb-5">
                    <h2 className="t-subsection-heading flex-1 min-w-0 text-[18px] lg:text-[22px] leading-snug">
                        <span className="lg:hidden">
                            Você ganhou +10% OFF em todo site para dormir melhor! Use SUPER10 💙
                        </span>
                        <span className="hidden lg:inline-flex lg:items-center lg:gap-2">
                            <span aria-hidden="true">🔥</span>
                            Todo site com 10% OFF EXTRA com o cupom SUPER10
                        </span>
                    </h2>
                    <Link
                        href="/c/colchoes"
                        className="t-link whitespace-nowrap inline-flex items-center gap-1 flex-shrink-0"
                    >
                        Ver todas <ChevronRight size={14} />
                    </Link>
                </div>

                {/* Wrapper que controla a área do carousel */}
                <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-5">
                    {/* Card Countdown */}
                    <div
                        className="relative rounded-[var(--radius-card)] flex flex-col text-center text-white min-h-[220px] lg:min-h-[400px] overflow-hidden pt-5 lg:pt-[50px] pb-5 lg:pb-0"
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

                        {/* 4 ondas concêntricas (visíveis em mobile e desktop) */}
                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none rounded-full top-[-50px] lg:top-[-100px]"
                            style={{
                                width: 140,
                                height: 140,
                                border: '2px solid rgba(180,190,210,0.05)',
                            }}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none rounded-full top-[-70px] lg:top-[-120px]"
                            style={{
                                width: 230,
                                height: 230,
                                border: '2px solid rgba(180,190,210,0.04)',
                            }}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none rounded-full top-[-90px] lg:top-[-140px]"
                            style={{
                                width: 320,
                                height: 320,
                                border: '2px solid rgba(180,190,210,0.03)',
                            }}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none rounded-full top-[-110px] lg:top-[-160px]"
                            style={{
                                width: 410,
                                height: 410,
                                border: '2px solid rgba(180,190,210,0.025)',
                            }}
                        />

                        {/* Header */}
                        <header className="relative z-10 px-3 lg:px-6 text-center">
                            <h3 className="text-[20px] lg:text-[22px] font-bold leading-[1.25] text-white mb-1 lg:mb-2 drop-shadow-sm whitespace-nowrap lg:whitespace-normal">
                                Sua melhor noite de sono
                                <br />
                                começa agora <span aria-hidden="true">🌙</span>
                            </h3>
                            <p className="text-[13px] lg:text-[14px] font-medium text-white/90">
                                Ofertas imbatíveis por pouco tempo!
                            </p>
                        </header>

                        {/* Timer mobile/tablet (sem anel) */}
                        <div className="lg:hidden relative z-10 mt-9 flex justify-center">
                            <OffersCountdown size="lg" />
                        </div>

                        {/* Anel SVG + timer dentro (só desktop) */}
                        <section className="hidden lg:block relative z-10 mx-auto mt-8 w-[240px] h-[240px]">
                            <svg
                                viewBox="0 0 260 260"
                                className="w-full h-full"
                                style={{ transform: 'rotate(-90deg)' }}
                                aria-hidden="true"
                            >
                                <circle
                                    cx="130"
                                    cy="130"
                                    r="125"
                                    fill="transparent"
                                    stroke="#1E304D"
                                    strokeWidth="6"
                                />
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
                                        className="flex-[0_0_70%] sm:flex-[0_0_55%] lg:flex-[0_0_33.333%] min-w-0 px-2 [&>article_.aspect-square]:aspect-square sm:[&>article_.aspect-square]:aspect-[5/4]"
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
