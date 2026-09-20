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
        <section id="ofertas" className="bg-bg-light py-12 lg:py-16 scroll-mt-28 lg:scroll-mt-40">
            <div className="max-w-[1280px] mx-auto px-3 lg:px-6">
                {/* Header da seção */}
                <div className="flex items-end justify-between gap-4 mb-6 lg:mb-8 px-1">
                    <div className="flex-1 min-w-0">
                        <span className="lp-eyebrow">
                            <span aria-hidden="true">🔥</span> Ofertas do dia
                        </span>
                        <h2 className="lp-title mt-1.5">
                            <span className="lg:hidden">
                                Você ganhou +10% OFF em todo site para dormir melhor! Use SUPER10 💙
                            </span>
                            <span className="hidden lg:inline">
                                Todo site com 10% OFF EXTRA com o cupom SUPER10
                            </span>
                        </h2>
                    </div>
                    <Link
                        href="/c/colchoes"
                        className="hidden sm:inline-flex items-center gap-1 flex-shrink-0 whitespace-nowrap rounded-full border border-primary/30 bg-white px-4 py-2 text-[14px] font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                        Ver todas <ChevronRight size={14} />
                    </Link>
                </div>

                {/* Wrapper que controla a área do carousel */}
                <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-5 lg:gap-6">
                    {/* Card Countdown */}
                    <div
                        className="relative rounded-[20px] flex flex-col text-center text-white min-h-[220px] lg:min-h-[400px] overflow-hidden pt-6 lg:pt-8 pb-6 lg:mb-[14px] lg:mt-[6px] shadow-lg"
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
                        <header className="relative z-10 px-3 lg:px-4 text-center">
                            <h3 className="text-[20px] font-bold leading-[1.25] text-white mb-1 lg:mb-2 drop-shadow-sm whitespace-nowrap lg:whitespace-normal">
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
                        <section className="hidden lg:block relative z-10 mx-auto mt-5 w-[200px] h-[200px]">
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

                        {/* Cupom + CTA */}
                        <footer className="relative z-10 mt-6 lg:mt-auto lg:pt-5 px-5 flex flex-col items-center gap-3">
                            <span className="lp-coupon text-accent-bright text-[15px]">
                                <span className="text-white/80 font-medium tracking-normal text-[13px]">Cupom</span>
                                SUPER10
                            </span>
                            <Link href="/c/colchoes" className="lp-btn lp-btn-cta w-full !min-h-[46px] !text-[15px]">
                                Ver todas as ofertas
                                <ChevronRight size={16} aria-hidden="true" />
                            </Link>
                        </footer>
                    </div>

                    {/* Carousel de produtos */}
                    <div className="relative min-w-0">
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex lp-carousel-track">
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
