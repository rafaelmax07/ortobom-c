'use client'

import Link from 'next/link'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'

interface Category {
    slug: string
    name: string
    image: string
}

const CATEGORIES: Category[] = [
    {
        slug: 'colchoes',
        name: 'Colchões',
        image: 'https://cdn.ortobom.com.br/file/4c4ee978-1fa1-4cba-850f-703968eadcff/605064.9781-1.jpg',
    },
    {
        slug: 'camas',
        name: 'Bases',
        image: 'https://cdn.ortobom.com.br/file/cd1b168a-bc07-4258-a713-a8ef98a5b056/BASE-SOMM--ORTHOPUR-2.4-CASAL--7-.jpg',
    },
    {
        slug: 'cabeceiras',
        name: 'Cabeceiras',
        image: 'https://cdn.ortobom.com.br/file/128d95e8-7142-4b66-b2bd-a1c737881555/4070957310_P.jpg',
    },
    {
        slug: 'travesseiros',
        name: 'Travesseiros',
        // Travesseiro Royal Pillow
        image: 'https://cdn.ortobom.com.br/file/03ecb3a0-81dc-43ef-b725-a963ef03f229/Travesseiro_Royal_Pillow_Master.jpg',
    },
    {
        slug: 'acessorios',
        name: 'Acessórios',
        // Almofada Rolete Nobuck
        image: 'https://cdn.ortobom.com.br/file/6a14e720-e613-48b2-a6f7-237c374f804c/Almofada-Rolete-Camurca_Brown_1.jpg',
    },
    {
        slug: 'moveis',
        name: 'Móveis',
        // Sofá Cama 3L Linho Bege
        image: 'https://cdn.ortobom.com.br/file/11e98b9d-376d-4b0f-a993-adb361f9bc2e/SOFA-CAMA-MALU-BEGE--3-.jpg',
    },
]

function CategoryItem({ cat }: { cat: Category }) {
    return (
        <Link
            href={`/c/${cat.slug}`}
            className="group flex flex-col items-center gap-3 text-center"
        >
            <div
                className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] lg:w-[200px] lg:h-[200px] rounded-full overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.03]"
                style={{ backgroundColor: '#EAEEF7' }}
            >
                <Image
                    src={cat.image}
                    alt={cat.name}
                    width={180}
                    height={180}
                    className="object-contain w-[92%] h-[92%]"
                    style={{ mixBlendMode: 'multiply' }}
                    unoptimized
                />
            </div>
            <span className="text-[13px] sm:text-[14px] lg:text-[15px] font-medium text-text-main group-hover:text-primary transition-colors">
                {cat.name}
            </span>
        </Link>
    )
}

function CategoryCarouselMobile() {
    const [emblaRef] = useEmblaCarousel({
        loop: false,
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
    })

    return (
        <div className="overflow-hidden -mx-3" ref={emblaRef}>
            <div className="flex">
                {CATEGORIES.map((cat) => (
                    <div
                        key={cat.slug}
                        className="flex-[0_0_30%] min-w-0 first:pl-3 last:pr-3"
                    >
                        <CategoryItem cat={cat} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function CategoryGrid() {
    return (
        <section className="py-8 lg:py-10 bg-white">
            <div className="max-w-[1280px] mx-auto px-3 lg:px-6">
                <h2 className="text-[20px] lg:text-[30px] font-extrabold leading-tight text-text-main mb-5 lg:mb-8 px-3 lg:px-0">
                    Encontre o que procura
                </h2>

                {/* Mobile/Tablet: carrossel arrastável */}
                <div className="lg:hidden">
                    <CategoryCarouselMobile />
                </div>

                {/* Desktop: grid inline */}
                <div className="hidden lg:flex lg:flex-wrap lg:justify-between lg:gap-y-6">
                    {CATEGORIES.map((cat) => (
                        <CategoryItem key={cat.slug} cat={cat} />
                    ))}
                </div>
            </div>
        </section>
    )
}
