'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
    images: string[]
    productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    // Fallback if no images are passed
    const safeImages = images && images.length > 0
        ? images
        : ['https://placehold.co/800x600/png?text=Sem+Imagem']

    const [mainImage, setMainImage] = useState(safeImages[0])

    // Update main image if the images prop changes (e.g. when changing product pages)
    useEffect(() => {
        if (safeImages[0]) {
            setMainImage(safeImages[0])
        }
    }, [images])

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Main Featured Image Container */}
            <div className="relative aspect-square sm:aspect-[4/3] w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                <Image
                    src={mainImage}
                    alt={productName}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
                    priority
                    unoptimized
                />
            </div>

            {/* Thumbnail Navigation Strip */}
            {safeImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    {safeImages.map((img, idx) => {
                        const isActive = mainImage === img
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setMainImage(img)}
                                className={`
                                    relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 bg-white cursor-pointer transition-all duration-300 hover:scale-105
                                    ${isActive 
                                        ? 'border-[#1B2B4E] ring-2 ring-[#1B2B4E]/20 shadow-sm' 
                                        : 'border-gray-200 hover:border-gray-300'
                                    }
                                `}
                            >
                                <Image 
                                    src={img} 
                                    alt={`${productName} thumbnail ${idx + 1}`} 
                                    fill 
                                    sizes="80px"
                                    className="object-cover p-1"
                                    unoptimized
                                />
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
