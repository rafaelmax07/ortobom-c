'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import { ProductCard, type ProductCardProduct } from './ProductCard'
import { IconButton } from './primitives/IconButton'
import {
    MattressIcon,
    BaseIcon,
    HeadboardIcon,
    PillowsIcon,
    SofaIcon,
} from './CategoryIcons'

interface CategoryTabsSectionProps {
    title?: string
    products: ProductCardProduct[]
}

interface TabDef {
    slug: string
    label: string
    Icon: ComponentType<SVGProps<SVGSVGElement>>
}

const TABS: TabDef[] = [
    { slug: 'colchoes', label: 'Colchões', Icon: MattressIcon },
    { slug: 'camas', label: 'Bases', Icon: BaseIcon },
    { slug: 'cabeceiras', label: 'Cabeceiras', Icon: HeadboardIcon },
    { slug: 'travesseiros', label: 'Travesseiros', Icon: PillowsIcon },
    { slug: 'moveis', label: 'Móveis', Icon: SofaIcon },
]

export function CategoryTabsSection({
    title = 'Seu conforto ideal começa aqui',
    products,
}: CategoryTabsSectionProps) {
    const [activeSlug, setActiveSlug] = useState<string>(TABS[0].slug)

    const filtered = useMemo(
        () => products.filter(p => p.category_slug === activeSlug),
        [products, activeSlug]
    )

    // Tabs disponíveis (que tem pelo menos 1 produto)
    const availableTabs = useMemo(
        () =>
            TABS.filter(tab =>
                products.some(p => p.category_slug === tab.slug)
            ),
        [products]
    )

    // Garante que activeSlug seja válido
    useEffect(() => {
        if (availableTabs.length > 0 && !availableTabs.some(t => t.slug === activeSlug)) {
            setActiveSlug(availableTabs[0].slug)
        }
    }, [availableTabs, activeSlug])

    if (availableTabs.length === 0) return null

    return (
        <section className="bg-white py-10">
            <div className="max-w-[1280px] mx-auto px-6">
                <h2 className="text-[26px] md:text-[30px] font-extrabold leading-tight text-text-main mb-5">
                    {title}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6">
                    {/* Tabs verticais */}
                    <nav
                        aria-label="Categorias"
                        className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible scrollbar-hide"
                    >
                        {availableTabs.map(tab => {
                            const isActive = tab.slug === activeSlug
                            const Icon = tab.Icon
                            return (
                                <button
                                    key={tab.slug}
                                    type="button"
                                    onClick={() => setActiveSlug(tab.slug)}
                                    aria-pressed={isActive}
                                    className={[
                                        'flex items-center gap-4 rounded-[var(--radius-card)] px-5 py-5 transition-colors duration-150 whitespace-nowrap',
                                        'border min-h-[80px]',
                                        isActive
                                            ? 'bg-primary border-primary text-white shadow-sm'
                                            : 'bg-white border-border text-text-main hover:border-primary/40 hover:bg-bg-light',
                                    ].join(' ')}
                                >
                                    <Icon className="w-10 h-10 shrink-0" aria-hidden="true" />
                                    <span className="text-[16px] font-semibold">{tab.label}</span>
                                </button>
                            )
                        })}
                    </nav>

                    {/* Carrossel de produtos da categoria ativa */}
                    <ProductsCarousel key={activeSlug} products={filtered} />
                </div>
            </div>
        </section>
    )
}

function ProductsCarousel({ products }: { products: ProductCardProduct[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
    })

    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => {
            setCanScrollPrev(emblaApi.canScrollPrev())
            setCanScrollNext(emblaApi.canScrollNext())
        }
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
        return () => {
            emblaApi.off('select', onSelect)
            emblaApi.off('reInit', onSelect)
        }
    }, [emblaApi])

    if (products.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[300px] rounded-[var(--radius-card)] border border-border bg-bg-light text-text-muted">
                Nenhum produto nessa categoria por enquanto.
            </div>
        )
    }

    return (
        <div className="relative min-w-0">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {products.map(product => (
                        <div
                            key={product.id}
                            className="flex-[0_0_33.333%] min-w-0 px-2 first:pl-0 last:pr-0"
                        >
                            <ProductCard product={product} variant="offer" />
                        </div>
                    ))}
                </div>
            </div>

            {canScrollPrev && (
                <IconButton
                    type="button"
                    aria-label="Produtos anteriores"
                    onClick={scrollPrev}
                    variant="default"
                    size="lg"
                    rounded="full"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 shadow-md hidden lg:flex"
                >
                    <ChevronLeft size={20} />
                </IconButton>
            )}
            {canScrollNext && (
                <IconButton
                    type="button"
                    aria-label="Próximos produtos"
                    onClick={scrollNext}
                    variant="default"
                    size="lg"
                    rounded="full"
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 shadow-md hidden lg:flex"
                >
                    <ChevronRight size={20} />
                </IconButton>
            )}
        </div>
    )
}
