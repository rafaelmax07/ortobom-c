'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'

interface ProductCardProps {
    product: {
        id: string
        name: string
        slug: string
        price: number
        compare_at_price?: number
        featured_image: string
        category_slug?: string
    }
}

export function ProductCard({ product }: ProductCardProps) {
    // Format BRL prices
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(product.price)

    const formattedInstallment = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(product.price / 12)

    // Calculate discount percent
    const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
    const discountPercent = hasDiscount 
        ? Math.round((1 - product.price / (product.compare_at_price || 1)) * 100) 
        : 0

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
            
            {/* Discount Badge */}
            {hasDiscount && (
                <div className="absolute top-4 left-4 z-10 bg-green-500 text-white font-extrabold text-[11px] uppercase px-3 py-1 rounded-full shadow-md animate-pulse">
                    {discountPercent}% OFF
                </div>
            )}

            {/* Image Area */}
            <Link href={`/p/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-50/50 block">
                <Image
                    src={product.featured_image || 'https://placehold.co/400x400/png?text=Ortobom'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    priority={false}
                    unoptimized
                />
                {/* Light hover overlay */}
                <div className="absolute inset-0 bg-gray-950/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            {/* Content & Action Area */}
            <div className="p-5 flex flex-col flex-grow">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">
                    {product.category_slug || 'Produto'}
                </span>
                
                <Link href={`/p/${product.slug}`} className="block mb-3">
                    <h3 className="text-gray-800 font-bold text-sm md:text-base leading-snug line-clamp-2 min-h-[40px] hover:text-[#1B2B4E] transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price Section */}
                <div className="mt-auto pt-2 border-t border-gray-50">
                    {hasDiscount && (
                        <div className="text-xs text-gray-400 line-through mb-0.5">
                            {product.compare_at_price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                    )}
                    
                    <div className="text-xl md:text-2xl font-black text-[#1B2B4E] leading-none mb-1">
                        {formattedPrice}
                    </div>
                    
                    <div className="text-[11px] text-gray-500 font-medium mb-5">
                        ou <span className="text-[#1B2B4E] font-bold">12x</span> de <span className="text-[#1B2B4E] font-bold">{formattedInstallment}</span> sem juros
                    </div>

                    {/* CTA Button */}
                    <Link
                        href={`/p/${product.slug}`}
                        className="w-full flex items-center justify-center gap-2 bg-[#1B2B4E] hover:bg-[#F97316] text-white py-3 px-4 rounded-xl font-bold text-xs md:text-sm shadow-sm transition-all duration-300 transform group-hover:scale-[1.02]"
                    >
                        <ShoppingBag size={16} className="stroke-[2.5px]" />
                        Comprar
                    </Link>
                </div>
            </div>
        </div>
    )
}
