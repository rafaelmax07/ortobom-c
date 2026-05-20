'use client'

import Link from 'next/link'
import { Search, Menu, Phone, HelpCircle } from 'lucide-react'
import { useState } from 'react'

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="w-full font-sans">
            {/* Top Bar - Dark Blue */}
            <div className="bg-[#1B2B4E] text-white py-2 text-xs md:text-sm">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="hidden md:inline">Bem-vindo à Ortobom!</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1">
                            <Phone size={14} /> <span className="hidden md:inline">Televendas: 3003-5011</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <HelpCircle size={14} /> <span className="hidden md:inline">Atendimento</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Header - White with Logo & Search */}
            <div className="bg-white py-4 border-b border-gray-100 sticky top-0 z-50">
                <div className="container mx-auto px-4 flex items-center justify-between gap-4">

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-[#1B2B4E]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu size={28} />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <div className="text-[#1B2B4E] font-bold text-3xl tracking-tighter">
                            Ortobom
                        </div>
                    </Link>

                    {/* Desktop Search Bar */}
                    <form action="/search" method="GET" className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
                        <input
                            type="text"
                            name="q"
                            placeholder="O que deseja buscar?"
                            className="w-full border border-gray-300 rounded-full py-2.5 px-6 pr-12 text-sm focus:outline-none focus:border-[#1B2B4E] transition-colors placeholder-gray-500"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1B2B4E] text-white p-1.5 rounded-full hover:bg-blue-900 transition">
                            <Search size={18} />
                        </button>
                    </form>
                </div>

                {/* Mobile Search - Visible only on mobile */}
                <form action="/search" method="GET" className="md:hidden container mx-auto px-4 mt-3">
                    <div className="relative">
                        <input
                            type="text"
                            name="q"
                            placeholder="Buscar..."
                            className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 text-sm"
                        />
                        <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                            <Search size={18} />
                        </button>
                    </div>
                </form>
            </div>

            {/* Navigation Menu */}
            <nav className={`bg-gray-100 md:bg-white border-b border-gray-200 ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
                <div className="container mx-auto px-4">
                    <ul className="flex flex-col md:flex-row md:items-center md:gap-8 text-sm font-medium text-gray-700 py-2">
                        <li><Link href="/c/colchoes" className="block py-2 hover:text-[#1B2B4E]">Colchões</Link></li>
                        <li><Link href="/c/camas" className="block py-2 hover:text-[#1B2B4E]">Camas e Bases</Link></li>
                        <li><Link href="/c/travesseiros" className="block py-2 hover:text-[#1B2B4E]">Travesseiros</Link></li>
                        <li><Link href="/c/roupa-de-cama" className="block py-2 hover:text-[#1B2B4E]">Roupa de Cama</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}
