'use client'

import Link from 'next/link'
import { Search, ShoppingCart, User, Menu, Phone, HelpCircle } from 'lucide-react'
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
                        <Link href="#" className="flex items-center gap-1 hover:text-gray-300">
                            <Phone size={14} /> <span className="hidden md:inline">Televendas: 3003-5011</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-1 hover:text-gray-300">
                            <HelpCircle size={14} /> <span className="hidden md:inline">Atendimento</span>
                        </Link>
                        <Link href="#" className="hover:text-gray-300">Nossas Lojas</Link>
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
                        {/* Simulated Logo Text if image fails, or use placeholder that looks like text */}
                        <div className="text-[#1B2B4E] font-bold text-3xl tracking-tighter">
                            Ortobom
                        </div>
                    </Link>

                    {/* Search Bar - Hidden on small mobile */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
                        <input
                            type="text"
                            placeholder="O que você está procurando?"
                            className="w-full border border-gray-300 rounded-full py-2.5 px-6 pr-12 text-sm focus:outline-none focus:border-[#1B2B4E] transition-colors"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1B2B4E] text-white p-1.5 rounded-full hover:bg-blue-900 transition">
                            <Search size={18} />
                        </button>
                    </div>

                    {/* Icons Actions */}
                    <div className="flex items-center gap-6 text-[#1B2B4E]">
                        <Link href="/account" className="hidden md:flex flex-col items-center text-xs gap-1 hover:text-blue-700">
                            <User size={24} />
                            <span>Entre ou Cadastre-se</span>
                        </Link>

                        <Link href="/cart" className="flex flex-col items-center text-xs gap-1 hover:text-blue-700 relative">
                            <ShoppingCart size={24} />
                            <span className="hidden md:inline">Carrinho</span>
                            {/* Badge */}
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile Search - Visible only on mobile */}
                <div className="md:hidden container mx-auto px-4 mt-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 text-sm"
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                    </div>
                </div>
            </div>

            {/* Navigation Menu (Mega Menu Style Simplified) */}
            <nav className={`bg-gray-100 md:bg-white border-b border-gray-200 ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
                <div className="container mx-auto px-4">
                    <ul className="flex flex-col md:flex-row md:items-center md:gap-8 text-sm font-medium text-gray-700 py-2">
                        <li><Link href="/c/colchoes" className="block py-2 hover:text-[#1B2B4E]">Colchões</Link></li>
                        <li><Link href="/c/camas" className="block py-2 hover:text-[#1B2B4E]">Camas e Bases</Link></li>
                        <li><Link href="/c/travesseiros" className="block py-2 hover:text-[#1B2B4E]">Travesseiros</Link></li>
                        <li><Link href="/c/acessorios" className="block py-2 hover:text-[#1B2B4E]">Acessórios</Link></li>
                        <li><Link href="/ofertas" className="block py-2 text-red-600 font-bold hover:text-red-700">Ofertas</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}
