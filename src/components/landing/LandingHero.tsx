'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BadgeCheck, CreditCard, MapPin, MessageCircle, Truck } from 'lucide-react'
import type { ProductCardProduct } from '@/components/ui/ProductCard'
import { formatBRL } from '@/lib/whatsapp'
import { SOCIAL_PROOF, buildContactWhatsAppUrl } from '@/lib/landing'
import { useSavedLocation } from './useSavedLocation'
import { StarRating } from './StarRating'

interface LandingHeroProps {
    /** Oferta de maior prioridade vinda da home (mesmos dados do grid de ofertas) */
    featured: ProductCardProduct | null
}

const TRUST_ITEMS = [
    { icon: Truck, label: 'Frete grátis a partir de R$ 300' },
    { icon: CreditCard, label: 'Parcelamento em até 21x' },
    { icon: BadgeCheck, label: 'Garantia de fábrica Ortobom' },
]

export function LandingHero({ featured }: LandingHeroProps) {
    const location = useSavedLocation()

    return (
        <section className="lp-hero" aria-labelledby="lp-hero-title">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-6 pt-8 pb-10 sm:pt-12 lg:pt-16 lg:pb-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 lg:gap-14 items-center">
                {/* Copy + CTAs */}
                <div className="lp-rise flex flex-col items-start">
                    <span className="lp-chip lp-chip-light mb-5">
                        <MapPin size={15} className="text-accent-bright" aria-hidden="true" />
                        Loja oficial em {location.city} – {location.uf}
                    </span>

                    <h1 id="lp-hero-title" className="lp-hero-title">
                        Durma melhor a partir de hoje, com{' '}
                        <span className="lp-hero-highlight">preço de fábrica</span>
                    </h1>

                    <p className="mt-5 text-[16px] lg:text-[18px] leading-relaxed text-white/80 max-w-[540px]">
                        Colchões, bases e travesseiros Ortobom com atendimento de quem está
                        perto de você. Use o cupom{' '}
                        <strong className="text-white">SUPER10</strong> e ganhe +10% OFF em todo o site.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <a href="#ofertas" className="lp-btn lp-btn-cta w-full sm:w-auto">
                            Ver ofertas de hoje
                            <ArrowRight size={18} aria-hidden="true" />
                        </a>
                        <a
                            href={buildContactWhatsAppUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lp-btn lp-btn-ghost-light w-full sm:w-auto"
                        >
                            <MessageCircle size={18} aria-hidden="true" />
                            Falar com consultor
                        </a>
                    </div>

                    {/* Prova social resumida */}
                    <div className="mt-7 flex items-center gap-3">
                        <StarRating size={18} />
                        <p className="text-[14px] text-white/80 leading-snug">
                            <strong className="text-white">
                                {SOCIAL_PROOF.rating.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                            </strong>{' '}
                            de 5 · {SOCIAL_PROOF.reviewCount.toLocaleString('pt-BR')} avaliações no Google
                        </p>
                    </div>

                    <ul className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 w-full">
                        {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                            <li key={label} className="flex items-center gap-2.5 text-[13px] text-white/85 leading-snug">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <Icon size={16} className="text-accent-bright" aria-hidden="true" />
                                </span>
                                {label}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Destaque da oferta */}
                <div className="lp-rise lp-rise-delay">
                    {featured ? <FeaturedOffer product={featured} /> : <HeroImage />}
                </div>
            </div>
        </section>
    )
}

function FeaturedOffer({ product }: { product: ProductCardProduct }) {
    const hasDiscount = product.compare_at_price != null && product.compare_at_price > product.price
    const discountPercent = hasDiscount
        ? Math.round((1 - product.price / (product.compare_at_price as number)) * 100)
        : 0
    const image = product.featured_image || product.images?.[0]

    return (
        <Link
            href={`/p/${product.slug}`}
            className="group relative block bg-white text-text-main rounded-[24px] p-4 sm:p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] max-w-[480px] mx-auto lg:ml-auto"
        >
            <div className="absolute -top-3 left-6 z-10 bg-accent text-white text-[12px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
                Oferta em destaque
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-bg-light">
                {image && (
                    <Image
                        src={image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 992px) 90vw, 480px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                        unoptimized
                    />
                )}
                {hasDiscount && (
                    <span className="absolute top-3 right-3 bg-accent text-white font-extrabold text-[15px] px-3 py-1.5 rounded-full shadow-md">
                        -{discountPercent}%
                    </span>
                )}
            </div>

            <div className="pt-4 px-1 flex flex-col gap-3">
                <div>
                    <h2 className="text-[18px] lg:text-[20px] font-bold leading-snug line-clamp-2">{product.name}</h2>
                    {product.variant_label && product.variant_label.toLowerCase() !== 'padrão' && (
                        <p className="t-product-meta mt-0.5">{product.variant_label}</p>
                    )}
                </div>

                <div className="flex items-end justify-between gap-4 flex-wrap">
                    <div>
                        {hasDiscount && (
                            <span className="t-price-strike">{formatBRL(product.compare_at_price as number)}</span>
                        )}
                        <p className="text-[30px] font-extrabold text-primary leading-none tracking-tight tabular-nums mt-1">
                            {formatBRL(product.price)}
                        </p>
                        <p className="t-product-installments mt-1.5">
                            ou 6x de <strong>{formatBRL(product.price / 6)}</strong> sem juros
                        </p>
                    </div>
                    <span className="lp-btn lp-btn-cta !min-h-[48px] !px-5 !text-[15px] w-full sm:w-auto">
                        Aproveitar
                        <ArrowRight size={16} aria-hidden="true" />
                    </span>
                </div>
            </div>
        </Link>
    )
}

function HeroImage() {
    return (
        <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] max-w-[520px] mx-auto lg:ml-auto">
            <Image
                src="/banners/round-banner-2.webp"
                alt="Pessoa descansando sobre colchão Ortobom"
                fill
                sizes="(max-width: 992px) 90vw, 520px"
                className="object-cover"
                priority
            />
        </div>
    )
}
