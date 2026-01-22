'use client'

import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Mock banners with placeholders
const BANNERS = [
    {
        id: 1,
        desktop: 'https://placehold.co/1920x630/1e40af/ffffff?text=Saldão+dos+Sonhos',
        mobile: 'https://placehold.co/600x600/1e40af/ffffff?text=Saldão+OFF',
        alt: 'Saldão dos Sonhos - Até 50% OFF',
        link: '#'
    },
    {
        id: 2,
        desktop: 'https://placehold.co/1920x630/b45309/ffffff?text=Colchão+Liberty',
        mobile: 'https://placehold.co/600x600/b45309/ffffff?text=Liberty',
        alt: 'Colchão Liberty - Frete Grátis',
        link: '#'
    },
]

export function HeroSlider() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    return (
        <div className="relative group">
            {/* Viewport */}
            <div className="overflow-hidden bg-gray-100" ref={emblaRef}>
                <div className="flex">
                    {BANNERS.map((banner) => (
                        <div className="flex-[0_0_100%] min-w-0 relative" key={banner.id}>
                            {/* Desktop Image */}
                            <img
                                src={banner.desktop}
                                alt={banner.alt}
                                className="hidden md:block w-full h-auto object-cover max-h-[500px]"
                                loading="eager"
                            />
                            {/* Mobile Image */}
                            <img
                                src={banner.mobile || banner.desktop} // Fallback to desktop if mobile not provided
                                alt={banner.alt}
                                className="block md:hidden w-full h-auto object-cover aspect-square"
                                loading="eager"
                            />

                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                onClick={scrollPrev}
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                onClick={scrollNext}
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots/Indicators could go here */}
        </div>
    )
}
