import Link from 'next/link'
import Image from 'next/image'
import { Badge } from './Badge'
import { PriceDisplay } from './PriceDisplay'

interface ProductCardProps {
    product: {
        id: string
        name: string
        slug: string
        price: number
        compare_at_price?: number
        featured_image: string
        category_slug?: string
        variants?: { size: string }[]
    }
}

export function ProductCard({ product }: ProductCardProps) {
    const hasDiscount =
        product.compare_at_price !== undefined &&
        product.compare_at_price > product.price

    const discountPercent = hasDiscount
        ? Math.round((1 - product.price / (product.compare_at_price as number)) * 100)
        : 0

    const variantCount = product.variants?.length ?? 0
    const showVariantCount = variantCount > 1

    const imageSrc =
        product.featured_image && product.featured_image.length > 0
            ? product.featured_image
            : 'https://placehold.co/400x300/png?text=Ortobom'

    return (
        <article className="group bg-white rounded-[var(--radius-card)] shadow-md overflow-hidden flex flex-col h-full relative">
            {hasDiscount && (
                <Badge
                    variant="discount"
                    className="absolute top-2 left-2 z-10"
                >
                    {discountPercent}% OFF
                </Badge>
            )}

            <Link
                href={`/p/${product.slug}`}
                className="relative aspect-[4/3] overflow-hidden block"
            >
                <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain p-3 transition-transform duration-200 group-hover:scale-[1.05]"
                    unoptimized
                />
            </Link>

            <div className="p-4 flex flex-col flex-grow gap-2">
                <Link href={`/p/${product.slug}`}>
                    <h3 className="text-navy-dark font-semibold text-sm line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                {showVariantCount && (
                    <Badge variant="count">
                        {variantCount} Tamanhos Disponíveis
                    </Badge>
                )}

                <PriceDisplay
                    priceLabel="A partir de"
                    price={product.price}
                    compareAtPrice={product.compare_at_price}
                />

                <Link
                    href={`/p/${product.slug}`}
                    className="w-full inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-bold text-xs py-2.5 px-3 rounded-[var(--radius-button)] transition-colors"
                >
                    Ver Detalhes
                </Link>
            </div>
        </article>
    )
}
