'use client'

import Link from 'next/link'
import Image from 'next/image'

const CATEGORIES = [
    { slug: 'colchoes', name: 'Colchões', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=200&auto=format&fit=crop' },
    { slug: 'camas', name: 'Bases', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=200&auto=format&fit=crop' },
    { slug: 'cabeceiras', name: 'Cabeceiras', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=200&auto=format&fit=crop' },
    { slug: 'travesseiros', name: 'Travesseiros', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=200&auto=format&fit=crop' },
    { slug: 'moveis', name: 'Móveis', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=200&auto=format&fit=crop' },
    { slug: 'acessorios', name: 'Acessórios', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=200&auto=format&fit=crop' },
]

export function CategoryGrid() {
    return (
        <section className="py-10 bg-white">
            <div className="container mx-auto px-4 max-w-[1320px]">
                <h2 className="text-2xl font-semibold text-navy-dark text-center mb-8">
                    Encontre o que procura
                </h2>

                <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/c/${cat.slug}`}
                            className="group flex flex-col items-center gap-2 text-center w-20 sm:w-24"
                        >
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors duration-200">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-navy-dark group-hover:text-primary transition-colors">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
