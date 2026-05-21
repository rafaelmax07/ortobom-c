'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from './primitives/IconButton'

const CERTIFICATIONS = [
    { src: '/certifications/cert-1.webp', alt: 'Inmetro' },
    { src: '/certifications/cert-2.webp', alt: 'Experience Certified' },
    { src: '/certifications/cert-3.webp', alt: 'Top of Mind' },
    { src: '/certifications/cert-4.webp', alt: 'Top Mobile 2024' },
    { src: '/certifications/cert-5.webp', alt: 'Abicol - Boas Práticas' },
    { src: '/certifications/cert-6.webp', alt: 'Maior Fabricante de Colchões da América Latina' },
    { src: '/certifications/cert-7.webp', alt: 'Top of Mind' },
    { src: '/certifications/cert-8.webp', alt: 'Alto Renome' },
]

// Duplicamos a lista para o loop do Embla ter slides "fora" da viewport,
// já que mostramos 8 ao mesmo tempo
const CAROUSEL_SLIDES = [...CERTIFICATIONS, ...CERTIFICATIONS]

export function AwardsCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 1,
        dragFree: true,
    })

    const [canScrollPrev, setCanScrollPrev] = useState(true)
    const [canScrollNext, setCanScrollNext] = useState(true)

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => {
            // Loop = true → as setas sempre ativas
            setCanScrollPrev(emblaApi.canScrollPrev() || true)
            setCanScrollNext(emblaApi.canScrollNext() || true)
        }
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
        return () => {
            emblaApi.off('select', onSelect)
            emblaApi.off('reInit', onSelect)
        }
    }, [emblaApi])

    return (
        <section className="bg-white pt-2 pb-10">
            <div className="max-w-[1280px] mx-auto px-6">
                <h2 className="text-[26px] md:text-[30px] font-extrabold leading-tight text-text-main mb-5">
                    Prêmios e certificações recebidas pelo Ortobom
                </h2>

                <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {CAROUSEL_SLIDES.map((cert, i) => (
                                <div
                                    key={i}
                                    className="flex-[0_0_50%] sm:flex-[0_0_25%] lg:flex-[0_0_12.5%] min-w-0 px-2"
                                >
                                    <div className="border border-border rounded-[var(--radius-card)] h-[100px] flex items-center justify-center px-3 bg-white">
                                        <Image
                                            src={cert.src}
                                            alt={cert.alt}
                                            width={150}
                                            height={80}
                                            className="object-contain max-h-[80px] w-auto"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Setas */}
                    {canScrollPrev && (
                        <IconButton
                            type="button"
                            aria-label="Selos anteriores"
                            onClick={scrollPrev}
                            variant="default"
                            size="md"
                            rounded="full"
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 shadow-md"
                        >
                            <ChevronLeft size={18} />
                        </IconButton>
                    )}
                    {canScrollNext && (
                        <IconButton
                            type="button"
                            aria-label="Próximos selos"
                            onClick={scrollNext}
                            variant="default"
                            size="md"
                            rounded="full"
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 shadow-md"
                        >
                            <ChevronRight size={18} />
                        </IconButton>
                    )}
                </div>
            </div>
        </section>
    )
}
