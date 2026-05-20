'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, Phone, X, ShoppingCart, Tag } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

// All navigation categories matching the real Ortobom site
const NAV_CATEGORIES = [
    { label: 'Colchões',     slug: 'colchoes' },
    { label: 'Bases',        slug: 'camas' },
    { label: 'Cabeceiras',   slug: 'cabeceiras' },
    { label: 'Travesseiros', slug: 'travesseiros' },
    { label: 'Acessórios',   slug: 'acessorios' },
    { label: 'Móveis',       slug: 'moveis' },
]

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { totalItems, openCart } = useCart()

    return (
        <header className="w-full font-sans">
            {/* ── Promotional Top Bar ─────────────────────────────────────── */}
            <div className="bg-[#1B2B4E] text-white py-2 text-xs">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Promo message */}
                    <div className="flex items-center gap-2 min-w-0">
                        <Tag size={13} className="flex-shrink-0 text-orange-400" />
                        <span className="truncate">
                            Frete Grátis a partir de R$&nbsp;300 &bull; Parcele em até 21x
                        </span>
                    </div>
                    {/* Utility links — desktop only */}
                    <div className="hidden md:flex items-center gap-5 flex-shrink-0 ml-4">
                        <a href="tel:30035011" className="flex items-center gap-1 hover:text-orange-400 transition-colors whitespace-nowrap">
                            <Phone size={12} />
                            Televendas: 3003-5011
                        </a>
                        <span className="text-white/30">|</span>
                        <span className="hover:text-orange-400 cursor-pointer transition-colors whitespace-nowrap">Lojas Próximas</span>
                        <span className="text-white/30">|</span>
                        <span className="hover:text-orange-400 cursor-pointer transition-colors whitespace-nowrap">SAC</span>
                    </div>
                </div>
            </div>

            {/* ── Main Header ─────────────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-3 flex items-center gap-4">

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden text-[#1B2B4E] p-1"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                    >
                        {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 mr-2" aria-label="Ortobom — página inicial">
                        <Image
                            src="https://www.ortobom.com.br/Content/V3/img/Ortobom_azul.png"
                            alt="Ortobom"
                            width={140}
                            height={40}
                            className="h-9 w-auto object-contain"
                            priority
                            unoptimized
                        />
                    </Link>

                    {/* Desktop Search */}
                    <form
                        action="/search"
                        method="GET"
                        className="hidden md:flex flex-1 max-w-2xl relative"
                    >
                        <input
                            type="text"
                            name="q"
                            placeholder="O que deseja buscar?"
                            className="w-full border border-gray-300 rounded-full py-2.5 px-5 pr-12 text-sm focus:outline-none focus:border-[#1B2B4E] transition-colors placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            aria-label="Buscar"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#1B2B4E] text-white p-2 rounded-full hover:bg-[#243a65] transition-colors"
                        >
                            <Search size={16} />
                        </button>
                    </form>

                    {/* Cart button */}
                    <button
                        id="cart-icon-button"
                        onClick={openCart}
                        aria-label={`Carrinho — ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
                        className="relative flex flex-col items-center text-[#1B2B4E] hover:text-[#F97316] transition-colors p-1 ml-auto md:ml-0"
                    >
                        <ShoppingCart size={26} />
                        {totalItems > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                                {totalItems > 99 ? '99+' : totalItems}
                            </span>
                        )}
                        <span className="hidden md:block text-[10px] font-medium mt-0.5">Carrinho</span>
                    </button>
                </div>

                {/* Mobile search — below logo row */}
                <form action="/search" method="GET" className="md:hidden px-4 pb-3">
                    <div className="relative">
                        <input
                            type="text"
                            name="q"
                            placeholder="Buscar produtos..."
                            className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 text-sm focus:outline-none focus:border-[#1B2B4E]"
                        />
                        <button type="submit" aria-label="Buscar" className="absolute right-3 top-2.5 text-gray-400">
                            <Search size={16} />
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Navigation ──────────────────────────────────────────────── */}
            <nav
                className={`bg-white border-b border-gray-200 ${isMenuOpen ? 'block' : 'hidden md:block'}`}
                aria-label="Categorias"
            >
                <div className="container mx-auto px-4">
                    <ul className="flex flex-col md:flex-row md:items-center md:gap-6 text-sm font-medium text-gray-700 py-1">
                        {NAV_CATEGORIES.map((cat) => (
                            <li key={cat.slug}>
                                <Link
                                    href={`/c/${cat.slug}`}
                                    className="block py-2.5 md:py-3 border-b-2 border-transparent hover:border-[#F97316] hover:text-[#1B2B4E] transition-all duration-200 whitespace-nowrap"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {cat.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    )
}
