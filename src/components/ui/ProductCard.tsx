'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import { Badge } from './primitives/Badge'
import { LinkButton } from './primitives/Button'
import { IconButton } from './primitives/IconButton'
import { PriceDisplay } from './primitives/PriceDisplay'
import { AutoFitText } from './primitives/AutoFitText'

export type ProductCardVariant = 'grid' | 'offer' | 'mini'

export interface ProductCardProduct {
    id: string
    name: string
    slug: string
    price: number
    compare_at_price?: number | null
    featured_image: string
    images?: string[]
    category_slug?: string
    variants?: { size: string }[]
    /** Texto curto descrevendo a variação default (ex: "Casal (31x188x138)") */
    variant_label?: string
}

interface ProductCardProps {
    product: ProductCardProduct
    /**
     * Define apenas o CTA e badges adicionais. O **visual base** (galeria,
     * borda azul no hover, imagem com cantos arredondados) é o mesmo em todas
     * as variantes.
     *
     * - "grid" (default): "Ver Detalhes", "A partir de" sem desconto
     * - "offer": "Comprar" com ícone, sempre mostra badge cupom
     * - "mini": sem CTA, layout mais compacto
     */
    variant?: ProductCardVariant
    /** Sobrescrever galeria (default: true em todas as variantes) */
    showGallery?: boolean
    /** Sobrescrever badge de cupom (default: true) */
    showCouponBadge?: boolean
    /** Texto do cupom (default: "+10% OFF · Use SUPER10") */
    couponText?: string
    /** Mostrar parcelamento (default: depende da variant) */
    showInstallments?: boolean
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/400x400/png?text=Ortobom'

export function ProductCard({
    product,
    variant = 'grid',
    showGallery: showGalleryProp,
    showCouponBadge: showCouponBadgeProp,
    couponText = '+10% extra · Use SUPER10',
    showInstallments,
}: ProductCardProps) {
    const hasDiscount =
        product.compare_at_price != null && product.compare_at_price > product.price
    const discountPercent = hasDiscount
        ? Math.round((1 - product.price / (product.compare_at_price as number)) * 100)
        : 0

    const variantCount = product.variants?.length ?? 0
    const showVariantCount = variant !== 'mini' && variantCount > 1

    // Defaults uniformes: galeria + cupom em todas as variantes
    // Galeria só ativa se houver MÚLTIPLAS imagens; com 0 ou 1 imagem, render estático.
    const galleryImages = product.images?.filter(Boolean) ?? []
    const hasMultipleImages = galleryImages.length > 1
    const showGallery = (showGalleryProp ?? true) && hasMultipleImages
    // Cupom só faz sentido quando produto tem desconto (visualmente reforça a promo)
    const showCouponBadge = (showCouponBadgeProp ?? true) && hasDiscount

    return (
        <article className="group bg-white rounded-[var(--radius-card)] overflow-hidden flex flex-col border border-border hover:border-primary transition-colors h-full">
            <ProductImage
                product={product}
                hasDiscount={hasDiscount}
                discountPercent={discountPercent}
                showGallery={showGallery}
                showCouponBadge={showCouponBadge}
                couponText={couponText}
            />

            <div className={
                variant === 'mini'
                    ? 'px-4 pb-4 pt-2 flex flex-col flex-grow gap-3'
                    : 'px-5 pb-5 pt-2 flex flex-col flex-grow gap-5'
            }>
                <div className="flex flex-col gap-0.5">
                    <Link href={`/p/${product.slug}`}>
                        <AutoFitText
                            as="h3"
                            maxFontSize={15}
                            minFontSize={12}
                            className="t-product-title"
                        >
                            {product.name}
                        </AutoFitText>
                    </Link>

                    {product.variant_label && product.variant_label.toLowerCase() !== 'padrão' ? (
                        <p className="t-product-meta">{product.variant_label}</p>
                    ) : showVariantCount ? (
                        <Badge variant="count" className="self-start mt-1">{variantCount} Tamanhos Disponíveis</Badge>
                    ) : null}
                </div>

                <PriceDisplay
                    price={product.price}
                    compareAtPrice={product.compare_at_price}
                    priceLabel={variant === 'grid' && !hasDiscount ? 'A partir de' : undefined}
                    variant={variant === 'mini' ? 'mini' : 'card'}
                    showSavings={hasDiscount && variant !== 'mini'}
                    showInstallments={showInstallments}
                    className="mt-auto"
                />

                {variant !== 'mini' && (
                    <LinkButton
                        href={`/p/${product.slug}`}
                        variant="primary"
                        size="md"
                        fullWidth
                        leadingIcon={variant === 'offer' ? <ShoppingCart size={15} /> : undefined}
                    >
                        {variant === 'offer' ? 'Comprar' : 'Ver Detalhes'}
                    </LinkButton>
                )}
            </div>
        </article>
    )
}

/* ──────────────────────────────────────────────────────
 * ProductImage — área de imagem com badges + galeria opcional
 * ────────────────────────────────────────────────────── */
interface ProductImageProps {
    product: ProductCardProduct
    hasDiscount: boolean
    discountPercent: number
    showGallery: boolean
    showCouponBadge: boolean
    couponText: string
}

function ProductImage({
    product,
    hasDiscount,
    discountPercent,
    showGallery,
    showCouponBadge,
    couponText,
}: ProductImageProps) {
    if (!showGallery) {
        const imageSrc =
            product.featured_image && product.featured_image.length > 0
                ? product.featured_image
                : PLACEHOLDER_IMAGE

        return (
            <Link href={`/p/${product.slug}`} className="block">
                <div className="relative aspect-square overflow-hidden m-5">
                    <BadgeStack hasDiscount={hasDiscount} discountPercent={discountPercent} showCouponBadge={showCouponBadge} couponText={couponText} />
                    <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 280px"
                        className="object-cover rounded-lg"
                        unoptimized
                    />
                </div>
            </Link>
        )
    }

    return (
        <ProductImageGallery
            product={product}
            hasDiscount={hasDiscount}
            discountPercent={discountPercent}
            showCouponBadge={showCouponBadge}
            couponText={couponText}
        />
    )
}

interface BadgeStackProps {
    hasDiscount: boolean
    discountPercent: number
    showCouponBadge: boolean
    couponText: string
}

function BadgeStack({ hasDiscount, discountPercent, showCouponBadge, couponText }: BadgeStackProps) {
    if (!hasDiscount && !showCouponBadge) return null
    return (
        <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1.5 pointer-events-none">
            {hasDiscount && (
                <Badge
                    variant="discount"
                    size="md"
                    shape="pill"
                    leadingIcon={
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                    }
                    className="shadow-sm"
                >
                    {discountPercent}% OFF
                </Badge>
            )}
            {showCouponBadge && (
                <Badge variant="coupon" size="sm" shape="square">
                    {couponText}
                </Badge>
            )}
        </div>
    )
}

interface ProductImageGalleryProps {
    product: ProductCardProduct
    hasDiscount: boolean
    discountPercent: number
    showCouponBadge: boolean
    couponText: string
}

function ProductImageGallery({
    product,
    hasDiscount,
    discountPercent,
    showCouponBadge,
    couponText,
}: ProductImageGalleryProps) {
    const gallery = (() => {
        const out: string[] = []
        if (product.featured_image) out.push(product.featured_image)
        for (const img of product.images || []) {
            if (img && !out.includes(img)) out.push(img)
        }
        if (out.length === 0) out.push(PLACEHOLDER_IMAGE)
        return out
    })()

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, watchDrag: false })
    const [selectedIndex, setSelectedIndex] = useState(0)

    const stop = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const scrollPrev = useCallback(
        (e: React.MouseEvent) => {
            stop(e)
            emblaApi?.scrollPrev()
        },
        [emblaApi, stop]
    )

    const scrollNext = useCallback(
        (e: React.MouseEvent) => {
            stop(e)
            emblaApi?.scrollNext()
        },
        [emblaApi, stop]
    )

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
        onSelect()
        emblaApi.on('select', onSelect)
        return () => {
            emblaApi.off('select', onSelect)
        }
    }, [emblaApi])

    const showNav = gallery.length > 1

    return (
        <Link href={`/p/${product.slug}`} className="block">
            <div className="relative aspect-square overflow-hidden m-5">
                <BadgeStack
                    hasDiscount={hasDiscount}
                    discountPercent={discountPercent}
                    showCouponBadge={showCouponBadge}
                    couponText={couponText}
                />

                <div className="overflow-hidden w-full h-full" ref={emblaRef}>
                    <div className="flex h-full">
                        {gallery.map((src, idx) => (
                            <div key={idx} className="relative flex-[0_0_100%] min-w-0 h-full">
                                <Image
                                    src={src}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 280px"
                                    className="object-cover rounded-lg"
                                    unoptimized
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {showNav && (
                    <>
                        <IconButton
                            onClick={scrollPrev}
                            aria-label="Imagem anterior"
                            variant="overlay"
                            size="sm"
                            rounded="full"
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft size={16} />
                        </IconButton>
                        <IconButton
                            onClick={scrollNext}
                            aria-label="Próxima imagem"
                            variant="overlay"
                            size="sm"
                            rounded="full"
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight size={16} />
                        </IconButton>

                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {gallery.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`w-1 h-1 rounded-full transition-colors shadow-[0_0_2px_rgba(0,0,0,0.5)] ${
                                        idx === selectedIndex ? 'bg-white' : 'bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Link>
    )
}
