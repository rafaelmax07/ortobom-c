'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

/* ──────────────────────────────────────────────────────
 * Tipos
 * ────────────────────────────────────────────────────── */

/** Formato geométrico da moldura da foto de cada card. */
type FrameShape = 'capsule' | 'diagonal' | 'arch' | 'circle' | 'portal'

/** Hierarquia do botão: preenchido (ação principal) ou contorno. */
type CtaEmphasis = 'primary' | 'secondary'

interface CategoryCard {
    title: ReactNode
    subtitle: string
    cta: string
    href: string
    image: string
    imageAlt: string
    frame: FrameShape
    emphasis: CtaEmphasis
    /** Ponto focal da foto dentro da moldura (object-position). */
    focus?: string
}

/* ──────────────────────────────────────────────────────
 * Dados — textos, rotas e fotos são os mesmos de antes
 * ────────────────────────────────────────────────────── */

const VERTICAL_CARDS: CategoryCard[] = [
    {
        title: '3 Passos para o colchão dos seus sonhos',
        subtitle: 'Saiba qual colchão combina mais com você e seu estilo',
        cta: 'Faça seu teste e descubra',
        href: '/c/colchoes',
        image: '/banners/round-banner-1.webp',
        imageAlt: 'Mulher relaxando em quarto',
        frame: 'capsule',
        emphasis: 'primary',
        focus: '42% 50%',
    },
    {
        title: 'Colchões',
        subtitle: 'Do conforto das molas à sofisticação das espumas, o seu sono perfeito começa aqui.',
        cta: 'Escolha o seu',
        href: '/c/colchoes',
        image: '/banners/round-banner-2.webp',
        imageAlt: 'Mulher descansando sobre colchão',
        frame: 'diagonal',
        emphasis: 'primary',
    },
    {
        title: 'Kits',
        subtitle: 'Renove o seu quarto e economize muito mais',
        cta: 'Quero dormir melhor',
        href: '/c/colchoes',
        image: '/banners/round-banner-3.webp',
        imageAlt: 'Quarto com cama montada',
        frame: 'arch',
        emphasis: 'secondary',
        focus: '88% 50%',
    },
]

const HORIZONTAL_CARDS: CategoryCard[] = [
    {
        title: 'Bases',
        subtitle: 'Estilo e funcionalidade se unem em nossa linha de Bases para cama',
        cta: 'Confira as opções',
        href: '/c/camas',
        // Versão 900×900 da mesma foto (a anterior tinha só 216×279)
        image: '/banners/round-banner-4-square.webp',
        imageAlt: 'Base sommier',
        frame: 'circle',
        emphasis: 'secondary',
    },
    {
        title: 'Cabeceiras',
        subtitle: 'Encontre cabeceiras que combinam perfeitamente com seu estilo e conforto do seu quarto.',
        cta: 'Clique e descubra',
        href: '/c/cabeceiras',
        image: '/banners/round-banner-5-square.webp',
        imageAlt: 'Cabeceira em quarto',
        frame: 'portal',
        emphasis: 'secondary',
        focus: '50% 40%',
    },
]

/* ──────────────────────────────────────────────────────
 * Peças compartilhadas
 * ────────────────────────────────────────────────────── */

const CARD_BASE =
    'cs-card group relative flex h-full overflow-hidden rounded-3xl border border-mist-border bg-mist ' +
    'transition-[transform,box-shadow,border-color] duration-300 ease-out ' +
    'hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_44px_-18px_rgba(11,37,69,0.35)] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'

/** Zoom suave da foto no hover (a moldura recorta, a foto cresce por dentro). */
const PHOTO_ZOOM = 'transition-transform duration-500 ease-out group-hover:scale-[1.05]'

function CardButton({ label, emphasis }: { label: string; emphasis: CtaEmphasis }) {
    const styles =
        emphasis === 'primary'
            ? 'bg-accent text-white group-hover:bg-accent-hover'
            : 'border border-accent/40 bg-white/70 text-accent group-hover:border-accent group-hover:bg-accent group-hover:text-white'
    return (
        <span
            className={`inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[14px] font-bold transition-colors duration-200 ${styles}`}
        >
            {label}
        </span>
    )
}

function CardText({ card, align }: { card: CategoryCard; align: 'center' | 'start' }) {
    const alignment = align === 'center' ? 'items-center text-center' : 'items-center text-center sm:items-start sm:text-left'
    return (
        <div className={`relative z-10 flex flex-col gap-3 ${alignment}`}>
            <h2 className="text-[22px] lg:text-[24px] font-extrabold leading-tight tracking-tight text-navy-ink text-balance">
                {card.title}
            </h2>
            <p className="max-w-[300px] text-[15px] leading-relaxed text-slate-700">{card.subtitle}</p>
            <div className="mt-2">
                <CardButton label={card.cta} emphasis={card.emphasis} />
            </div>
        </div>
    )
}

/* ──────────────────────────────────────────────────────
 * Molduras geométricas
 * Cada uma tem aspect-ratio fixo → sem layout shift.
 * As fotos 1–3 já trazem uma cúpula branca embutida nos
 * cantos superiores; os enquadramentos abaixo a mantêm
 * fora da área visível.
 * ────────────────────────────────────────────────────── */

function Photo({ card, sizes }: { card: CategoryCard; sizes: string }) {
    return (
        <Image
            src={card.image}
            alt={card.imageAlt}
            fill
            sizes={sizes}
            className={`object-cover ${PHOTO_ZOOM}`}
            style={card.focus ? { objectPosition: card.focus } : undefined}
        />
    )
}

/** Card 1 — cápsula vertical com grade de pontos e círculos suaves ao fundo. */
function CapsuleFrame({ card }: { card: CategoryCard }) {
    return (
        <div className="relative flex h-full items-end justify-center">
            <div aria-hidden="true" className="cs-dots absolute inset-x-0 -top-4 bottom-0" />
            <div aria-hidden="true" className="absolute left-[8%] top-[18%] h-16 w-16 rounded-full bg-accent-bright/20" />
            <div aria-hidden="true" className="absolute right-[10%] bottom-[14%] h-10 w-10 rounded-full bg-white/80" />
            <div className="relative h-full aspect-[3/4] overflow-hidden rounded-full ring-4 ring-white/80 shadow-[0_12px_30px_-14px_rgba(11,37,69,0.45)]">
                <Photo card={card} sizes="220px" />
            </div>
        </div>
    )
}

/** Card 2 — corte diagonal no topo, com um "eco" do ângulo ao fundo. */
function DiagonalFrame({ card }: { card: CategoryCard }) {
    return (
        <div className="relative h-full">
            <div aria-hidden="true" className="cs-diagonal-echo absolute inset-x-0 -top-3 h-full rounded-2xl bg-accent-bright/25" />
            <div className="cs-diagonal relative h-full overflow-hidden rounded-2xl">
                {/* Zoom de base ancorado embaixo: tira a cúpula embutida da foto do quadro */}
                <div className="absolute inset-0 origin-bottom scale-[1.3]">
                    <Photo card={card} sizes="(min-width: 992px) 520px, 100vw" />
                </div>
            </div>
        </div>
    )
}

/** Card 3 — arco/portal com ramo botânico em traço fino ao fundo. */
function ArchFrame({ card }: { card: CategoryCard }) {
    return (
        <div className="relative flex h-full items-end justify-center">
            <svg
                aria-hidden="true"
                viewBox="0 0 120 200"
                className="absolute left-[2%] bottom-0 h-[78%] text-mist-border"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            >
                <path d="M60 196 C58 150 62 100 78 20" />
                <path d="M61 160 C40 150 28 132 26 112 C46 116 58 132 61 160Z" />
                <path d="M63 120 C84 114 96 96 98 76 C78 80 66 96 63 120Z" />
                <path d="M68 82 C50 72 42 56 42 38 C58 44 67 60 68 82Z" />
            </svg>
            <div
                aria-hidden="true"
                className="absolute bottom-0 h-[104%] aspect-[4/5] translate-x-3 rounded-t-full rounded-b-2xl border-2 border-mist-border"
            />
            <div className="relative h-full aspect-[4/5] overflow-hidden rounded-t-full rounded-b-2xl shadow-[0_12px_30px_-14px_rgba(11,37,69,0.45)]">
                {/* Mesmo zoom da diagonal: o ombro do arco não cobre sozinho a cúpula da foto */}
                <div className="absolute inset-0 origin-bottom scale-[1.3]">
                    <Photo card={card} sizes="320px" />
                </div>
            </div>
        </div>
    )
}

/** Card 4 — círculo à direita, com anel deslocado ao fundo. */
function CircleFrame({ card }: { card: CategoryCard }) {
    return (
        <div className="relative w-[176px] lg:w-[200px] aspect-square flex-shrink-0">
            <div aria-hidden="true" className="absolute inset-0 -translate-x-3 translate-y-2 rounded-full border-2 border-mist-border" />
            <div aria-hidden="true" className="absolute -right-1 top-2 h-5 w-5 rounded-full bg-accent-bright/40" />
            <div className="relative h-full w-full overflow-hidden rounded-full ring-4 ring-white/80 shadow-[0_12px_30px_-14px_rgba(11,37,69,0.45)]">
                <Photo card={card} sizes="200px" />
            </div>
        </div>
    )
}

/** Card 5 — portal assimétrico (canto superior esquerdo bem arredondado). */
function PortalFrame({ card }: { card: CategoryCard }) {
    return (
        <div className="relative w-[168px] lg:w-[188px] aspect-[4/5] flex-shrink-0">
            <div aria-hidden="true" className="absolute inset-0 translate-x-3 -translate-y-3 rounded-[72px_16px_16px_16px] lg:rounded-[96px_18px_18px_18px] border-2 border-mist-border" />
            <div className="relative h-full w-full overflow-hidden rounded-[72px_16px_16px_16px] lg:rounded-[96px_18px_18px_18px] shadow-[0_12px_30px_-14px_rgba(11,37,69,0.45)]">
                <Photo card={card} sizes="188px" />
            </div>
        </div>
    )
}

function ImageFrame({ card }: { card: CategoryCard }) {
    switch (card.frame) {
        case 'capsule':
            return <CapsuleFrame card={card} />
        case 'diagonal':
            return <DiagonalFrame card={card} />
        case 'arch':
            return <ArchFrame card={card} />
        case 'circle':
            return <CircleFrame card={card} />
        case 'portal':
            return <PortalFrame card={card} />
    }
}

/* ──────────────────────────────────────────────────────
 * Cards
 * ────────────────────────────────────────────────────── */

function VerticalCard({ card }: { card: CategoryCard }) {
    return (
        <Link href={card.href} className={`${CARD_BASE} flex-col px-6 pt-8 pb-6 lg:px-7`}>
            <CardText card={card} align="center" />
            {/* Altura fixa → as três fotos alinham na base, sem CLS */}
            <div className="mt-auto pt-7 h-[292px] lg:h-[312px]">
                <ImageFrame card={card} />
            </div>
        </Link>
    )
}

function HorizontalCard({ card }: { card: CategoryCard }) {
    return (
        <Link
            href={card.href}
            className={`${CARD_BASE} flex-col items-center gap-7 p-7 sm:flex-row sm:justify-between sm:gap-6 lg:p-9`}
        >
            <div className="flex-1 min-w-0">
                <CardText card={card} align="start" />
            </div>
            <ImageFrame card={card} />
        </Link>
    )
}

/* ──────────────────────────────────────────────────────
 * Seção
 * ────────────────────────────────────────────────────── */

function VerticalCardsCarouselMobile() {
    const [emblaRef] = useEmblaCarousel({
        loop: true,
        align: 'start',
        dragFree: false,
    })

    return (
        <div className="overflow-hidden -mx-3" ref={emblaRef}>
            <div className="flex py-2">
                {VERTICAL_CARDS.map((card) => (
                    <div
                        key={card.image}
                        className="flex-[0_0_85%] sm:flex-[0_0_60%] min-w-0 px-2 first:pl-3 last:pr-3"
                    >
                        <VerticalCard card={card} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function ComfortSection() {
    return (
        <section className="py-10 lg:py-14 bg-white">
            <div className="max-w-[1280px] mx-auto px-3 lg:px-6 flex flex-col gap-6">
                {/* Linha 1: 3 cards verticais — carrossel em mobile/tablet, grid em desktop */}
                <div className="lg:hidden">
                    <VerticalCardsCarouselMobile />
                </div>
                <div className="hidden lg:grid lg:grid-cols-3 gap-6">
                    {VERTICAL_CARDS.map((card) => (
                        <VerticalCard key={card.image} card={card} />
                    ))}
                </div>

                {/* Linha 2: 2 cards horizontais (empilham texto + foto no mobile) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {HORIZONTAL_CARDS.map((card) => (
                        <HorizontalCard key={card.image} card={card} />
                    ))}
                </div>
            </div>
        </section>
    )
}
