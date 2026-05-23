'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Banner {
    id: string
    title: string
    image_desktop_url: string
    image_mobile_url: string
    link: string
    position: number
}

interface HeroSliderProps {
    banners?: Banner[]
}

const FALLBACK_BANNERS: Banner[] = [
    {
        id: '1',
        title: 'Top20',
        image_desktop_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1920&auto=format&fit=crop',
        image_mobile_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop',
        link: '/c/colchoes',
        position: 0,
    },
    {
        id: '2',
        title: 'Liberty',
        image_desktop_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1920&auto=format&fit=crop',
        image_mobile_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop',
        link: '/c/colchoes',
        position: 1,
    },
    {
        id: '3',
        title: 'Orion',
        image_desktop_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1920&auto=format&fit=crop',
        image_mobile_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop',
        link: '/c/camas',
        position: 2,
    },
    {
        id: '4',
        title: 'Base Baú',
        image_desktop_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1920&auto=format&fit=crop',
        image_mobile_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop',
        link: '/c/camas',
        position: 3,
    },
    {
        id: '5',
        title: 'Pillow Top HR Gel',
        image_desktop_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1920&auto=format&fit=crop',
        image_mobile_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop',
        link: '/c/colchoes',
        position: 4,
    },
    {
        id: '6',
        title: 'Travesseiros',
        image_desktop_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1920&auto=format&fit=crop',
        image_mobile_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop',
        link: '/c/travesseiros',
        position: 5,
    },
]

export function HeroSlider({ banners = [] }: HeroSliderProps) {
    const displayBanners = banners.length > 0 ? banners : FALLBACK_BANNERS

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ])

    const [selectedIndex, setSelectedIndex] = useState(0)

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

    /** Encurta títulos longos vindos do banco (ex: "TOP20 - Os Mais Desejados" → "Top20") */
    const shortenTitle = (title: string): string => {
        if (!title) return ''
        // Pega só a parte antes de separadores comuns
        const beforeSep = title.split(/[-—|:]/)[0].trim()
        // Limita em ~20 chars pra caber na barra
        return beforeSep.length > 20 ? beforeSep.slice(0, 20).trim() + '…' : beforeSep
    }

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
        return () => {
            emblaApi.off('select', onSelect)
            emblaApi.off('reInit', onSelect)
        }
    }, [emblaApi])

    return (
        <section className="bg-white">
            <div className="max-w-[1600px] mx-auto lg:px-6">
                <div className="relative">
                    {/* Banner viewport */}
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {displayBanners.map((banner) => (
                                <div
                                    key={banner.id}
                                    className="flex-[0_0_100%] min-w-0 relative aspect-[9/8] sm:aspect-[16/9] lg:aspect-[64/15]"
                                >
                                    <Link href={banner.link || '#'} className="block w-full h-full relative">
                                        {/* Desktop Image */}
                                        <div className="hidden lg:block w-full h-full relative">
                                            <Image
                                                src={banner.image_desktop_url}
                                                alt={banner.title}
                                                fill
                                                sizes="(max-width: 1280px) 100vw, 1280px"
                                                className="object-cover"
                                                priority
                                                unoptimized
                                            />
                                        </div>
                                        {/* Mobile Image */}
                                        <div className="block lg:hidden w-full h-full relative">
                                            <Image
                                                src={banner.image_mobile_url || banner.image_desktop_url}
                                                alt={banner.title}
                                                fill
                                                sizes="100vw"
                                                className="object-cover"
                                                priority
                                                unoptimized
                                            />
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Barra de controles full-width na base do banner — translúcida cinza */}
                    <div className="absolute left-0 right-0 bottom-0 z-10 bg-black/35 border-t border-white/10">
                        <div className="flex items-center justify-center gap-3 py-2 lg:py-2.5">
                            <button
                                type="button"
                                aria-label="Banner anterior"
                                onClick={scrollPrev}
                                className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-md bg-white/25 hover:bg-white/40 text-white transition-colors"
                            >
                                <ChevronLeft size={15} />
                            </button>

                            <div className="flex items-center justify-center gap-2 px-1">
                                {displayBanners.map((banner, idx) => {
                                    const isActive = idx === selectedIndex
                                    return (
                                        <button
                                            key={banner.id}
                                            type="button"
                                            aria-label={`Ir para o banner ${idx + 1}`}
                                            aria-current={isActive ? 'true' : undefined}
                                            onClick={() => scrollTo(idx)}
                                            className={`h-[5px] rounded-full transition-all duration-300 ${
                                                isActive
                                                    ? 'w-6 bg-white'
                                                    : 'w-2.5 bg-white/55 hover:bg-white/80'
                                            }`}
                                        />
                                    )
                                })}
                            </div>

                            <button
                                type="button"
                                aria-label="Próximo banner"
                                onClick={scrollNext}
                                className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-md bg-white/25 hover:bg-white/40 text-white transition-colors"
                            >
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
