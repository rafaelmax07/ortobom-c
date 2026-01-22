'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
    images: string[]
    productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    // Fallback if no images
    const safeImages = images && images.length > 0
        ? images
        : ['https://placehold.co/800x600/png?text=Sem+Imagem']

    const [mainImage, setMainImage] = useState(safeImages[0])

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square md:aspect-[4/3] bg-white rounded-lg overflow-hidden border border-gray-100">
                <img
                    src={mainImage}
                    alt={productName}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Thumbnails (Only show if more than 1 image) */}
            {safeImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {safeImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setMainImage(img)}
                            className={`relative w-20 h-20 flex-shrink-0 border-2 rounded-md overflow-hidden ${mainImage === img ? 'border-blue-900' : 'border-transparent hover:border-gray-300'}`}
                        >
                            <img src={img} alt={`${productName} view ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
