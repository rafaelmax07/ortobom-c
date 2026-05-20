'use client'

import React, { useCallback } from 'react'
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

const FALLBACK_BANNERS = [
    {
        id: '1',
        title: 'Saldão dos Sonhos Ortobom - Até 50% OFF',
        image_desktop_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1920&auto=format&fit=crop',
        image_mobile_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop',
        link: '/c/colchoes'
    },
    {
        id: '2',
        title: 'Colchões de Alta Tecnologia com Frete Grátis',
        image_desktop_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1920&auto=format&fit=crop',
        image_mobile_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop',
        link: '/c/colchoes'
    },
    {
        id: '3',
        title: 'Bases Sommier e Camas Baú - Conforto Exclusivo',
        image_desktop_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1920&auto=format&fit=crop',
        image_mobile_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop',
        link: '/c/camas'
    }
]

export function HeroSlider({ banners = [] }: HeroSliderProps) {
    const displayBanners = banners.length > 0 ? banners : FALLBACK_BANNERS

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 6000, stopOnInteraction: false })
    ])

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    return (
        <div className="relative group overflow-hidden bg-gray-900 border-b border-gray-100">
            {/* Viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {displayBanners.map((banner) => (
                        <div className="flex-[0_0_100%] min-w-0 relative aspect-[16/7] md:aspect-[21/9] lg:aspect-[21/8]" key={banner.id}>
                            <Link href={banner.link || '#'} className="block w-full h-full relative">
                                {/* Desktop Image */}
                                <div className="hidden md:block w-full h-full relative">
                                    <Image
                                        src={banner.image_desktop_url}
                                        alt={banner.title}
                                        fill
                                        sizes="100vw"
                                        className="object-cover transition-scale duration-[8000ms] group-hover:scale-105"
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

                                {/* Premium Gradient Overlay for styling */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/25 flex flex-col justify-center px-6 sm:px-12 md:px-20 text-white">
                                    <div className="max-w-xl md:max-w-2xl transition-all duration-700 transform translate-y-2 group-hover:translate-y-0">
                                        <span className="inline-block bg-[#F97316] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 shadow-md animate-pulse">
                                            Destaque Ortobom
                                        </span>
                                        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white drop-shadow-md mb-4 whitespace-pre-line">
                                            {banner.title.split(' - ')[0]}
                                        </h2>
                                        {banner.title.split(' - ')[1] && (
                                            <p className="text-sm sm:text-lg md:text-xl font-medium text-gray-100 drop-shadow-sm mb-6 max-w-lg">
                                                {banner.title.split(' - ')[1]}
                                            </p>
                                        )}
                                        <span className="inline-block bg-white text-[#1B2B4E] hover:bg-[#F97316] hover:text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105">
                                            Aproveitar Oferta
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                aria-label="Slide anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#1B2B4E] hover:text-[#F97316] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
                onClick={scrollPrev}
            >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
                aria-label="Próximo slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#1B2B4E] hover:text-[#F97316] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
                onClick={scrollNext}
            >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
        </div>
    )
}
