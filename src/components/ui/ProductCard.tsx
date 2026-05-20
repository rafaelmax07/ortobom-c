import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

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
    // Format price to BRL
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(product.price)

    const formattedInstallment = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(product.price / 12)

    return (
        <div className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            {/* Image Area */}
            <Link href={`/p/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-50 block">
                <img
                    src={product.featured_image || 'https://placehold.co/400x400/png?text=Ortobom'}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                {/* Quick action overlay (optional) */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <Link href={`/p/${product.slug}`} className="block">
                    <h3 className="text-gray-900 font-medium text-sm md:text-base mb-2 line-clamp-2 min-h-[44px] hover:text-blue-900 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price Section */}
                <div className="mt-auto">
                    {product.compare_at_price && product.compare_at_price > product.price && (
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs text-gray-400 line-through">
                            {product.compare_at_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">
                            {Math.round((1 - product.price / product.compare_at_price) * 100)}% OFF
                        </span>
                    </div>
                    )}
                    <div className="text-xl md:text-2xl font-bold text-[#1B2B4E]">
                        {formattedPrice}
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                        ou 12x de {formattedInstallment} sem juros
                    </div>

                    {/* CTA Button */}
                    <Link
                        href={`/p/${product.slug}`}
                        className="w-full flex items-center justify-center gap-2 bg-[#1B2B4E] text-white py-2.5 rounded-md font-medium text-sm hover:bg-blue-900 transition-colors"
                    >
                        <ShoppingCart size={16} />
                        Ver Detalhes
                    </Link>
                </div>
            </div>
        </div>
    )
}
