'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Slider } from "@/components/ui/slider" // Assuming we can use shadcn slider later, but for now standard inputs or simpler logic
// Actually I don't have shadcn installed yet properly for slider, let's use standard inputs

interface FilterSidebarProps {
    activeCategorySlug: string
}

const CATEGORIES = [
    { name: 'Colchões', slug: 'colchoes' },
    { name: 'Camas e Bases', slug: 'camas' },
    { name: 'Travesseiros', slug: 'travesseiros' },
    { name: 'Roupas de Cama', slug: 'roupa-de-cama' },
]

export function FilterSidebar({ activeCategorySlug }: FilterSidebarProps) {
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')

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

            {/* Price Filter - Simplified for V1 */}
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
                <button
                    className="w-full bg-gray-100 text-gray-700 font-medium py-2 rounded-md text-sm hover:bg-gray-200 transition-colors"
                    onClick={() => {
                        // Future: push params to router
                        alert('Filtro de preço será implementado na US-04!')
                    }}
                >
                    Filtrar
                </button>
            </div>

            {/* Other Mock Filters */}
            <div>
                <h3 className="font-bold text-[#1B2B4E] mb-4 text-lg">Tamanho</h3>
                <div className="space-y-2">
                    {['Solteiro', 'Casal', 'Queen', 'King'].map(size => (
                        <label key={size} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">{size}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    )
}
