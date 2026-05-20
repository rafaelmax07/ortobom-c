'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface FilterSidebarProps {
    activeCategorySlug: string
    currentMinPrice: string
    currentMaxPrice: string
    currentSizes: string[]
}

const CATEGORIES = [
    { name: 'Colchões', slug: 'colchoes' },
    { name: 'Bases', slug: 'camas' },
    { name: 'Cabeceiras', slug: 'cabeceiras' },
    { name: 'Travesseiros', slug: 'travesseiros' },
    { name: 'Acessórios', slug: 'acessorios' },
    { name: 'Móveis', slug: 'moveis' },
]

const SIZES = ['Solteiro', 'Casal', 'Queen', 'King', 'Super King', 'Padrão']

export function FilterSidebar({ activeCategorySlug, currentMinPrice, currentMaxPrice, currentSizes }: FilterSidebarProps) {
    const router = useRouter()
    const pathname = usePathname()

    const [minPrice, setMinPrice] = useState(currentMinPrice)
    const [maxPrice, setMaxPrice] = useState(currentMaxPrice)
    const [selectedSizes, setSelectedSizes] = useState<string[]>(currentSizes)

    const applyFilters = () => {
        const params = new URLSearchParams()
        if (minPrice) params.set('minPrice', minPrice)
        if (maxPrice) params.set('maxPrice', maxPrice)
        if (selectedSizes.length > 0) params.set('sizes', selectedSizes.join(','))

        const queryString = params.toString()
        router.push(queryString ? `${pathname}?${queryString}` : pathname)
    }

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        )
    }

    const clearFilters = () => {
        setMinPrice('')
        setMaxPrice('')
        setSelectedSizes([])
        router.push(pathname)
    }

    return (
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
            {/* Categories Filter */}
            <div>
                <h3 className="font-bold text-[#1B2B4E] mb-4 text-lg">Categorias</h3>
                <ul className="space-y-2">
                    {CATEGORIES.map(cat => (
                        <li key={cat.slug}>
                            <Link
                                href={`/c/${cat.slug}`}
                                className={`block text-sm py-1 transition-colors ${activeCategorySlug === cat.slug
                                    ? 'text-blue-600 font-bold'
                                    : 'text-gray-600 hover:text-blue-600'
                                    }`}
                            >
                                {cat.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Filter */}
            <div>
                <h3 className="font-bold text-[#1B2B4E] mb-4 text-lg">Preço</h3>
                <div className="flex items-center gap-2 mb-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">R$</span>
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 pl-8 pr-2 text-sm focus:border-blue-500 outline-none"
                        />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">R$</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 pl-8 pr-2 text-sm focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Size Filter */}
            <div>
                <h3 className="font-bold text-[#1B2B4E] mb-4 text-lg">Tamanho</h3>
                <div className="space-y-2">
                    {SIZES.map(size => (
                        <label key={size} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedSizes.includes(size)}
                                onChange={() => toggleSize(size)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">{size}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
                <button
                    className="w-full bg-[#1B2B4E] text-white font-medium py-2.5 rounded-md text-sm hover:bg-blue-900 transition-colors"
                    onClick={applyFilters}
                >
                    Filtrar
                </button>
                <button
                    className="w-full bg-gray-100 text-gray-700 font-medium py-2 rounded-md text-sm hover:bg-gray-200 transition-colors"
                    onClick={clearFilters}
                >
                    Limpar Filtros
                </button>
            </div>
        </aside>
    )
}
