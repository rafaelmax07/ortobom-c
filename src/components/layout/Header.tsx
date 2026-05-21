'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, X, ShoppingCart, Heart, User, MapPin, ChevronRight, ChevronLeft, Shield, Store, Factory, Hotel, Phone } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useCart } from '@/context/CartContext'
import { NavCategoryItem } from './NavCategoryItem'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

const NAV_CATEGORIES = [
    {
        label: 'Colchões',
        slug: 'colchoes',
        sizes: ['Solteiro', 'Solteiro Extra', 'Casal', 'Queen', 'King', 'Infantil', 'Sob medida'],
        filters: [
            { group: 'Nível de Conforto', items: ['Macio', 'Firme', 'Híbrido'] },
            { group: 'Estilo', items: ['Tradicional/Clássico', 'Moderno/Tecnológico', 'Natural/Sustentável'] },
            { group: 'Tipos de Colchão', items: ['Mola', 'Espuma', 'Ortopédico'] },
        ],
        image: 'https://cdn.ortobom.com.br/file/34dfaf5b-db37-472b-a3ae-4d4e36c220e7/liberty%20site.jpg',
    },
    {
        label: 'Bases',
        slug: 'camas',
        sizes: ['Solteiro', 'Solteiro Extra', 'Casal', 'Queen', 'King', 'Sob medida'],
        filters: [
            { group: 'Estilos', items: ['Baú', 'Elétrica', 'Plana'] },
            { group: 'Revestimentos', items: ['Nobuck', 'Cori', 'Linho', 'Malha', 'Suede', 'TNT'] },
        ],
        image: 'https://cdn.ortobom.com.br/file/02adf6bb-7cf9-40bc-b755-a84b9c268bab/BASE-SOMMIER-LIBERTY-CASAL--7-.jpg',
    },
    {
        label: 'Cabeceiras',
        slug: 'cabeceiras',
        sizes: ['Solteiro', 'Solteiro Extra', 'Casal', 'Queen', 'King'],
        filters: [
            { group: 'Estilos', items: ['Tradicional/Clássico', 'Moderno/Tecnológico', 'Natural/Sustentável'] },
            { group: 'Revestimentos', items: ['Linho', 'Veludo', 'Cori', 'Facto'] },
        ],
        image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=400&auto=format&fit=crop',
    },
    {
        label: 'Travesseiros',
        slug: 'travesseiros',
        sizes: ['Conforto', 'Estilo', 'Material'],
        filters: [
            { group: 'Níveis de Conforto', items: ['Macio', 'Firme', 'Híbrido'] },
            { group: 'Variações de Estilo', items: ['Clássico/Tradicional', 'Moderno/Tecnológico', 'Natural/Sustentável'] },
            { group: 'Variações de Material', items: ['Fibra', 'Látex', 'Pluma', 'Viscoelástica'] },
        ],
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=400&auto=format&fit=crop',
    },
    {
        label: 'Acessórios',
        slug: 'acessorios',
        sizes: ['Colchonete', 'Tapete', 'Massageador Alveolado', 'Suavencosto', 'Encosto Dino', 'Aromatizador', 'Cama Pet'],
        filters: [],
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=400&auto=format&fit=crop',
    },
    {
        label: 'Móveis',
        slug: 'moveis',
        sizes: ['Sofá Cama', 'Poltrona'],
        filters: [
            { group: 'Material', items: ['Cori', 'Linho', 'Nobuck'] },
        ],
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=400&auto=format&fit=crop',
    },
]

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const { totalItems, openCart } = useCart()
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const PROMO_MESSAGES = [
        { text: 'Seleção especial em até 6x sem juros', cta: 'Transforme suas noites!', href: '/c/colchoes' },
        { text: 'Todo site com +10% OFF por tempo limitado!', cta: 'Use SUPER10 💙', href: '/c/colchoes' },
        { text: 'Seu Colchão na Caixa em até 12x sem juros', cta: 'Quero praticidade e conforto', href: '/c/colchoes' },
    ]

    const [promoEmblaRef, promoEmblaApi] = useEmblaCarousel(
        { loop: true, align: 'center' },
        [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
    )

    const promoPrev = useCallback(() => promoEmblaApi?.scrollPrev(), [promoEmblaApi])
    const promoNext = useCallback(() => promoEmblaApi?.scrollNext(), [promoEmblaApi])

    useEffect(() => {
        // Histerese para evitar flicker quando o header encolhe e altera o scrollY
        // Entra em "scrolled" só quando passar de 100px; sai quando voltar pra antes de 30px
        const handleScroll = () => {
            const y = window.scrollY
            setIsScrolled(prev => {
                if (!prev && y > 100) return true
                if (prev && y < 30) return false
                return prev
            })
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleMegaMenuEnter = (slug: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setMegaMenuOpen(slug)
    }
    const handleMegaMenuLeave = () => {
        timeoutRef.current = setTimeout(() => setMegaMenuOpen(null), 150)
    }

    return (
        <header className="w-full font-sans sticky top-0 z-50">
            <div className="bg-navy-dark">

                {/* ═══ ROW 1: Top promo bar (some quando scrolla) ═══ */}
                <div className={`hidden lg:block border-b border-white/[0.08] text-[14px] font-medium text-white overflow-hidden transition-all duration-300 ${isScrolled ? 'max-h-0 py-0 opacity-0 border-b-0' : 'max-h-20 py-2.5 opacity-100'}`}>
                    <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between gap-10">
                        {/* Bloco esquerda: seta + carrossel de promos + seta — ocupa o espaço entre logo e Franqueado */}
                        <div className="flex items-center gap-5 flex-1 min-w-0">
                            <button
                                type="button"
                                onClick={promoPrev}
                                aria-label="Mensagem anterior"
                                className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div className="overflow-hidden flex-1 min-w-0" ref={promoEmblaRef}>
                                <div className="flex">
                                    {PROMO_MESSAGES.map((promo, idx) => (
                                        <div
                                            key={idx}
                                            className="flex-[0_0_100%] min-w-0 flex items-center justify-center gap-4 px-2"
                                        >
                                            <span className="truncate">{promo.text}</span>
                                            <Link
                                                href={promo.href}
                                                className="border border-white text-white text-[13px] font-semibold rounded px-5 py-1.5 hover:bg-white hover:text-navy-medium transition-colors whitespace-nowrap flex-shrink-0"
                                            >
                                                {promo.cta}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={promoNext}
                                aria-label="Próxima mensagem"
                                className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className="flex items-center text-white text-[14px] font-medium divide-x divide-white/20 flex-shrink-0">
                            <Link href="https://www.ortobom.com.br/SejaUmFranqueado" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 hover:text-orange-300 transition-colors">
                                <Shield size={16} strokeWidth={1.8} />
                                <span>Franqueado</span>
                            </Link>
                            <Link href="https://www.ortobom.com.br/listalojas" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 hover:text-orange-300 transition-colors">
                                <Store size={16} strokeWidth={1.8} />
                                <span>Lojas Próximas</span>
                            </Link>
                            <Link href="https://www.ortobom.com.br/industrias" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 hover:text-orange-300 transition-colors">
                                <Factory size={16} strokeWidth={1.8} />
                                <span>Para Indústrias</span>
                            </Link>
                            <Link href="https://www.ortobom.com.br/hotelaria" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 hover:text-orange-300 transition-colors">
                                <Hotel size={16} strokeWidth={1.8} />
                                <span>Para Hotéis</span>
                            </Link>
                            <Link href="https://ortobom.custhelp.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 pl-2.5 hover:text-orange-300 transition-colors">
                                <Phone size={16} strokeWidth={1.8} />
                                <span>SAC</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ═══ ROW 2: Logo + Search + Icons ═══ */}
                <div className={`transition-all duration-300 ${isScrolled ? 'py-2 lg:py-2.5' : 'py-3 lg:py-4'}`}>
                    <div className="max-w-[1280px] mx-auto px-4 lg:px-6 flex items-center w-full">

                        {/* Mobile hamburger */}
                        <button className="lg:hidden text-white mr-3" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <Image
                                src="https://www.ortobom.com.br/Content/V3/img/Ortobom_branco.png"
                                alt="Ortobom"
                                width={200}
                                height={54}
                                className={`object-contain transition-all duration-300 ${isScrolled ? 'w-[155px]' : 'w-[195px]'}`}
                                style={{ height: 'auto' }}
                                priority
                                unoptimized
                            />
                        </Link>

                        {/* Search */}
                        <form action="/search" method="GET" className={`hidden md:flex relative flex-1 mr-10 transition-all duration-300 ${isScrolled ? 'ml-3 max-w-[1000px]' : 'ml-5 max-w-[760px]'}`}>
                            <input
                                type="text"
                                name="q"
                                placeholder="O que deseja buscar?"
                                className="w-full bg-white rounded-md pl-5 pr-12 h-[42px] text-[15px] font-normal placeholder-[#888] text-[#222] focus:outline-none transition-all duration-300"
                            />
                            <button
                                type="submit"
                                aria-label="Buscar"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-[32px] w-[32px] flex items-center justify-center text-[#666] hover:text-[#222] rounded-md transition-all duration-300"
                            >
                                <Search size={18} />
                            </button>
                        </form>

                        {/* Right icons */}
                        <div className={`flex items-center justify-evenly flex-shrink-0 text-white transition-all duration-300 ${isScrolled ? 'min-w-[440px]' : 'min-w-[460px]'}`}>
                            {/* Location — icon on top, text below */}
                            <div className="flex flex-col items-center justify-center cursor-pointer hover:text-orange-300 transition-colors">
                                <MapPin size={22} strokeWidth={2.25} />
                                <span className={`mt-1 transition-all duration-300 ${isScrolled ? 'text-[12px]' : 'text-[13px]'}`} style={{ fontWeight: 700 }}>João Pessoa – PB</span>
                            </div>
                            {/* Login */}
                            <Link href="#" className="flex flex-col items-center justify-center hover:text-orange-300 transition-colors">
                                <User size={24} strokeWidth={2.25} />
                                <span className={`mt-1 text-white transition-all duration-300 ${isScrolled ? 'text-[12px]' : 'text-[13px]'}`} style={{ fontWeight: 700 }}>Fazer login</span>
                            </Link>
                            {/* Favoritos */}
                            <Link href="#" className="flex flex-col items-center justify-center hover:text-orange-300 transition-colors">
                                <Heart size={24} strokeWidth={2.25} />
                                <span className={`mt-1 text-white transition-all duration-300 ${isScrolled ? 'text-[12px]' : 'text-[13px]'}`} style={{ fontWeight: 700 }}>Favoritos</span>
                            </Link>
                            {/* Carrinho */}
                            <button onClick={openCart} aria-label="Carrinho" className="relative flex flex-col items-center justify-center hover:text-orange-300 transition-colors">
                                <ShoppingCart size={24} strokeWidth={2.25} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1.5 -right-2.5 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {totalItems > 99 ? '99+' : totalItems}
                                    </span>
                                )}
                                <span className={`mt-1 text-white transition-all duration-300 ${isScrolled ? 'text-[12px]' : 'text-[13px]'}`} style={{ fontWeight: 700 }}>Carrinho</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ═══ ROW 3: Nav — azul medium da marca, com separador sutil no topo ═══ */}
                {/* ═══ ROW 3: Nav — fundo full-width, conteúdo indentado para hierarquia visual ═══ */}
                <nav className="hidden lg:block bg-navy-nav shadow-[inset_0_8px_12px_-8px_rgba(0,0,0,0.5)]" aria-label="Categorias">
                    <div className="max-w-[1280px] mx-auto px-6">
                        <ul className="flex items-center justify-start gap-2 py-1.5">
                            <NavCategoryItem
                                label="OFERTAS"
                                href="/c/colchoes"
                                showChevron={false}
                                accent
                            />
                            {NAV_CATEGORIES.map((cat) => (
                                <NavCategoryItem
                                    key={cat.slug}
                                    label={cat.label}
                                    href={`/c/${cat.slug}`}
                                    isOpen={megaMenuOpen === cat.slug}
                                    onMouseEnter={() => handleMegaMenuEnter(cat.slug)}
                                    onMouseLeave={handleMegaMenuLeave}
                                />
                            ))}
                        </ul>
                    </div>

                    {/* Mega Menu */}
                    {megaMenuOpen && (() => {
                        const cat = NAV_CATEGORIES.find(c => c.slug === megaMenuOpen)
                        if (!cat) return null
                        return (
                            <div
                                className="absolute top-full left-0 right-0 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.15)] z-50"
                                onMouseEnter={() => handleMegaMenuEnter(cat.slug)}
                                onMouseLeave={handleMegaMenuLeave}
                            >
                                <div className="flex">
                                    {/* Coluna esquerda: sizes/sub-categorias com fundo cinza */}
                                    {cat.sizes.length > 0 ? (
                                        <aside className="w-[260px] xl:w-[300px] flex-shrink-0 bg-bg-light py-6 pl-20 xl:pl-24 pr-6 border-r border-border">
                                            <ul className="space-y-1">
                                                {cat.sizes.map(s => (
                                                    <li key={s}>
                                                        <Link
                                                            href={`/c/${cat.slug}?sizes=${encodeURIComponent(s)}`}
                                                            className="flex items-center justify-between py-2 text-[13px] text-text-soft hover:text-primary transition-colors"
                                                            onClick={() => setMegaMenuOpen(null)}
                                                        >
                                                            <span>{s}</span>
                                                            <ChevronRight size={13} className="text-text-muted" />
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </aside>
                                    ) : (
                                        <aside className="w-[260px] xl:w-[300px] flex-shrink-0 bg-bg-light border-r border-border" />
                                    )}

                                    {/* Centro: grupos de filtros */}
                                    <div className="flex-1 flex gap-16 py-6 pl-10 xl:pl-12 pr-12">
                                        {cat.filters.map((fg) => (
                                            <div key={fg.group} className="min-w-[170px]">
                                                <h4 className="text-[14px] font-bold text-navy-medium mb-4">{fg.group}</h4>
                                                <ul className="space-y-3">
                                                    {fg.items.map(i => (
                                                        <li key={i}>
                                                            <Link
                                                                href={`/c/${cat.slug}`}
                                                                className="text-[13px] text-text-soft hover:text-primary transition-colors"
                                                                onClick={() => setMegaMenuOpen(null)}
                                                            >
                                                                {i}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Imagem à direita */}
                                    {cat.image && (
                                        <div className="flex-shrink-0 py-6 pr-24 xl:pr-32 pl-12 flex items-center">
                                            <div className="relative w-[180px] h-[140px] rounded-2xl overflow-hidden">
                                                <Image
                                                    src={cat.image}
                                                    alt={cat.label}
                                                    fill
                                                    className="object-cover"
                                                    sizes="180px"
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })()}
                </nav>

                {/* Mobile search */}
                <form action="/search" method="GET" className="md:hidden px-4 pb-3">
                    <div className="relative">
                        <input type="text" name="q" placeholder="O que deseja buscar?" className="w-full bg-white rounded-md h-10 pl-4 pr-11 text-sm focus:outline-none placeholder-[#999]" />
                        <button type="submit" aria-label="Buscar" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-[#666]">
                            <Search size={17} />
                        </button>
                    </div>
                </form>
            </div>

            {/* ═══ MOBILE DRAWER ═══ */}
            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMenuOpen(false)} />
                    <div className="fixed top-0 left-0 h-full w-[300px] bg-white z-50 shadow-2xl flex flex-col lg:hidden overflow-y-auto">
                        <div className="flex items-center justify-between px-5 py-4 bg-navy-dark">
                            <span className="text-white font-bold">Menu</span>
                            <button onClick={() => setIsMenuOpen(false)} className="text-white/70 hover:text-white"><X size={20} /></button>
                        </div>
                        <Link href="#" className="px-5 py-3.5 text-sm text-primary font-semibold border-b border-border" onClick={() => setIsMenuOpen(false)}>Fazer login</Link>
                        <Link href="/c/colchoes" className="px-5 py-3.5 text-accent font-bold text-sm border-b border-border" onClick={() => setIsMenuOpen(false)}>OFERTAS</Link>
                        {NAV_CATEGORIES.map(cat => (
                            <Link key={cat.slug} href={`/c/${cat.slug}`} className="flex items-center justify-between px-5 py-3.5 text-sm text-text-main border-b border-border hover:bg-bg-light" onClick={() => setIsMenuOpen(false)}>
                                {cat.label}<ChevronRight size={16} className="text-text-muted" />
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </header>
    )
}
