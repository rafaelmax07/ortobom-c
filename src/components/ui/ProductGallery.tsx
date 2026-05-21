'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Badge } from './primitives/Badge'
import { IconButton } from './primitives/IconButton'

interface ProductGalleryProps {
    images: string[];
    productName: string;
    discountPercent?: number;
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x600/png?text=Ortobom'

export function ProductGallery({ images, productName, discountPercent }: ProductGalleryProps) {
    const safeImages = images && images.length > 0 ? images : [PLACEHOLDER_IMAGE]
    const hasMultiple = safeImages.length > 1

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
    const [selectedIndex, setSelectedIndex] = useState(0)

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
    const scrollTo = useCallback(
        (index: number) => emblaApi?.scrollTo(index),
        [emblaApi]
    )

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
        <div className="flex flex-col gap-4 w-full">
            <div className="relative bg-white rounded-[var(--radius-card)] shadow-sm overflow-hidden">
                {discountPercent !== undefined && discountPercent > 0 && (
                    <Badge
                        variant="discount"
                        className="absolute top-3 left-3 z-10"
                    >
                        {discountPercent}% OFF
                    </Badge>
                )}

                <div ref={emblaRef} className="overflow-hidden">
                    <div className="flex">
                        {safeImages.map((img, idx) => (
                            <div
                                key={`${img}-${idx}`}
                                className="flex-[0_0_100%] min-w-0 relative aspect-square sm:aspect-[4/3]"
                            >
                                <Image
                                    src={img}
                                    alt={`${productName} - Imagem ${idx + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-contain p-4"
                                    priority={idx === 0}
                                    unoptimized
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {hasMultiple && (
                    <>
                        <IconButton
                            onClick={scrollPrev}
                            aria-label="Imagem anterior"
                            variant="navy"
                            size="lg"
                            rounded="full"
                            className="absolute left-3 top-1/2 -translate-y-1/2 shadow-md"
                        >
                            <ChevronLeft size={20} />
                        </IconButton>
                        <IconButton
                            onClick={scrollNext}
                            aria-label="Próxima imagem"
                            variant="navy"
                            size="lg"
                            rounded="full"
                            className="absolute right-3 top-1/2 -translate-y-1/2 shadow-md"
                        >
                            <ChevronRight size={20} />
                        </IconButton>
                    </>
                )}
            </div>

            {hasMultiple && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {safeImages.map((img, idx) => {
                        const isActive = selectedIndex === idx
                        return (
                            <button
                                key={`thumb-${img}-${idx}`}
                                type="button"
                                onClick={() => scrollTo(idx)}
                                aria-label={`Ver imagem ${idx + 1}`}
                                aria-current={isActive ? 'true' : undefined}
                                className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-white border-2 transition-colors ${
                                    isActive ? 'border-primary' : 'border-border hover:border-text-muted'
                                }`}
                            >
                                <Image
                                    src={img}
                                    alt={`${productName} miniatura ${idx + 1}`}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                    unoptimized
                                />
                            </button>
                        )
                    })}
                </div>
            )}

            <p className="text-xs text-text-muted">
                * Fotos meramente ilustrativas. Cores e detalhes podem variar.
            </p>
        </div>
    )
}
