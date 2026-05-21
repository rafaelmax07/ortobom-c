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
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="relative">
                    {/* Banner viewport */}
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {displayBanners.map((banner) => (
                                <div
                                    key={banner.id}
                                    className="flex-[0_0_100%] min-w-0 relative aspect-[16/5] md:aspect-[64/16]"
                                >
                                    <Link href={banner.link || '#'} className="block w-full h-full relative">
                                        {/* Desktop Image */}
                                        <div className="hidden md:block w-full h-full relative">
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
                                        <div className="block md:hidden w-full h-full relative">
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

            {/* Barra de navegação inferior — setas + nomes dos banners (sobreposta ao banner) */}
                    <div className="absolute left-0 right-0 bottom-0 z-10 bg-black/35 backdrop-blur-md">
                        <div className="flex items-center px-6 lg:px-10 xl:px-12 py-1.5 gap-4">
                            {/* Setas */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    type="button"
                                    aria-label="Banner anterior"
                                    onClick={scrollPrev}
                                    className="w-9 h-9 flex items-center justify-center rounded-md bg-white/15 hover:bg-white/30 text-white transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Próximo banner"
                                    onClick={scrollNext}
                                    className="w-9 h-9 flex items-center justify-center rounded-md bg-white/15 hover:bg-white/30 text-white transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            {/* Lista de nomes dos banners */}
                            <ul className="flex items-center gap-7 overflow-x-auto scrollbar-hide flex-1 min-w-0">
                                {displayBanners.map((banner, idx) => {
                                    const isActive = idx === selectedIndex
                                    return (
                                        <li key={banner.id} className="flex-shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => scrollTo(idx)}
                                                className={`text-[14px] whitespace-nowrap transition-colors ${
                                                    isActive
                                                        ? 'text-white'
                                                        : 'text-white/75 hover:text-white'
                                                }`}
                                                style={{ fontWeight: isActive ? 700 : 500 }}
                                            >
                                                {shortenTitle(banner.title)}
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
