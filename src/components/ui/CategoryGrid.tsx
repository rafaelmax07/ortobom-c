'use client'

import Link from 'next/link'
import Image from 'next/image'

const CATEGORIES = [
    {
        slug: 'colchoes',
        name: 'Colchões',
        description: 'Molas Ensacadas, Espuma e Ortopédicos',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop',
    },
    {
        slug: 'camas',
        name: 'Bases Box e Camas',
        description: 'Bases Simples, Baús e Articuladas',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop',
    },
    {
        slug: 'cabeceiras',
        name: 'Cabeceiras',
        description: 'Estofadas, Painéis e Clássicas',
        image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop',
    },
    {
        slug: 'travesseiros',
        name: 'Travesseiros',
        description: 'Nasa, Látex, Pena e Cervicais',
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=600&auto=format&fit=crop',
    },
    {
        slug: 'acessorios',
        name: 'Acessórios',
        description: 'Protetores, Saias e Enxovais',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&auto=format&fit=crop',
    },
    {
        slug: 'moveis',
        name: 'Móveis',
        description: 'Mesas de Cabeceira e Complementos',
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop',
    },
]

export function CategoryGrid() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
                        Encontre o que Procura
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base">
                        Explore nossa linha completa de produtos projetados para proporcionar o descanso perfeito.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/c/${cat.slug}`}
                            className="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-500 bg-gray-950"
                        >
                            {/* Background Image */}
                            <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700 ease-out"
                                priority
                                unoptimized
                            />

                            {/* Color Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent group-hover:via-gray-950/30 transition-all duration-500" />

                            {/* Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                <h3 className="text-xl md:text-2xl font-bold tracking-wide mb-1 transition-transform duration-500 group-hover:-translate-y-1">
                                    {cat.name}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-300 font-medium leading-snug tracking-wide line-clamp-2 transition-transform duration-500 group-hover:-translate-y-1 opacity-90 group-hover:opacity-100">
                                    {cat.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
