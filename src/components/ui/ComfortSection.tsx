'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

interface FeatureCardProps {
    title: ReactNode
    subtitle: string
    cta: string
    href: string
    image: string
    /** Versão pré-recortada (quadrada) usada em mobile/tablet dentro do círculo. */
    imageMobile?: string
    imageAlt: string
}

const CARD_BG = '#1a273b'

function GhostButton({ label }: { label: string }) {
    return (
        <span
            className="inline-block border border-white rounded px-6 py-2 text-[15px] lg:text-[13px] font-medium transition-colors group-hover:bg-white"
            style={{ ['--hover-text' as string]: CARD_BG }}
        >
            <span className="group-hover:text-[color:var(--hover-text)]">{label}</span>
        </span>
    )
}

function FeatureCardVertical({
    title,
    subtitle,
    cta,
    href,
    image,
    imageAlt,
}: FeatureCardProps) {
    return (
        <Link
            href={href}
            className="group rounded-xl overflow-hidden flex flex-col items-center text-center pt-8 shadow-lg text-white h-full"
            style={{ backgroundColor: CARD_BG }}
        >
            {/* Texto + botão */}
            <div className="px-6 pb-6 flex-grow flex flex-col items-center">
                <h2 className="text-[20px] font-bold mb-4 uppercase leading-tight">
                    {title}
                </h2>
                <p className="text-[14px] mb-6 max-w-[260px] text-white/90">
                    {subtitle}
                </p>
                <GhostButton label={cta} />
            </div>

            {/* Foto com clip-path elíptica (cúpula) */}
            <div className="relative w-full h-[250px] mt-auto overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{ clipPath: 'ellipse(80% 100% at 50% 100%)' }}
                >
                    <Image
                        src={image}
                        alt={imageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        style={{ objectPosition: '50% 30%' }}
                        sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                </div>
            </div>
        </Link>
    )
}

/**
 * Card "horizontal" (em desktop). Em mobile/tablet vira vertical:
 * texto + botão em cima e foto na cúpula embaixo.
 */
function FeatureCardHorizontal({
    title,
    subtitle,
    cta,
    href,
    image,
    imageMobile,
    imageAlt,
}: FeatureCardProps) {
    const mobileImg = imageMobile ?? image
    return (
        <Link
            href={href}
            className="group rounded-xl overflow-hidden shadow-lg text-white relative flex flex-col lg:flex-row lg:h-64 h-[420px] lg:h-64"
            style={{ backgroundColor: CARD_BG }}
        >
            {/* Texto + botão (topo em mobile/tablet, esquerda em desktop) */}
            <div className="px-6 pt-10 pb-6 lg:p-8 flex flex-col items-center lg:items-start text-center lg:text-left justify-start lg:justify-center lg:max-w-[60%] lg:flex-grow z-10 relative">
                <h2 className="text-[22px] lg:text-[24px] font-extrabold mb-3 uppercase tracking-wider leading-tight drop-shadow-sm">
                    {title}
                </h2>
                <p className="text-[16px] lg:text-[14px] mb-5 lg:mb-6 lg:line-clamp-3 text-white/90 max-w-[320px] lg:max-w-none leading-snug">
                    {subtitle}
                </p>
                <div className="mt-3 lg:mt-0">
                    <GhostButton label={cta} />
                </div>
            </div>

            {/* Foto: desktop continua arco vertical à direita */}
            <div className="hidden lg:block relative lg:w-[40%] lg:h-full lg:ml-auto overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 [clip-path:ellipse(100%_80%_at_100%_50%)]">
                    <Image
                        src={image}
                        alt={imageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        style={{ objectPosition: '50% 50%' }}
                        sizes="25vw"
                    />
                </div>
            </div>

            {/* Foto mobile/tablet — círculo ancorado no canto inferior direito */}
            <div
                className="lg:hidden absolute overflow-hidden rounded-full"
                style={{
                    width: '95%',
                    aspectRatio: '1 / 1',
                    right: '-15%',
                    bottom: '-50%',
                }}
                aria-label={imageAlt}
                role="img"
            >
                <div
                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]"
                    style={{
                        backgroundImage: `url(${mobileImg})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% auto',
                        backgroundPosition: 'center bottom',
                    }}
                />
            </div>
        </Link>
    )
}

const VERTICAL_CARDS: FeatureCardProps[] = [
    {
        title: (
            <>
                3 Passos para o colchão
                <br />
                dos seus sonhos
            </>
        ),
        subtitle: 'Saiba qual colchão combina mais com você e seu estilo',
        cta: 'Faça seu teste e descubra',
        href: '/c/colchoes',
        image: '/banners/round-banner-1.webp',
        imageAlt: 'Mulher relaxando em quarto',
    },
    {
        title: 'Colchões',
        subtitle: 'Do conforto das molas à sofisticação das espumas, o seu sono perfeito começa aqui.',
        cta: 'Escolha o seu',
        href: '/c/colchoes',
        image: '/banners/round-banner-2.webp',
        imageAlt: 'Mulher descansando sobre colchão',
    },
    {
        title: 'Kits',
        subtitle: 'Renove o seu quarto e economize muito mais',
        cta: 'Quero dormir melhor',
        href: '/c/colchoes',
        image: '/banners/round-banner-3.webp',
        imageAlt: 'Quarto com cama montada',
    },
]

function VerticalCardsCarouselMobile() {
    const [emblaRef] = useEmblaCarousel({
        loop: true,
        align: 'start',
        dragFree: false,
    })

    return (
        <div className="overflow-hidden -mx-3" ref={emblaRef}>
            <div className="flex">
                {VERTICAL_CARDS.map((card, idx) => (
                    <div
                        key={idx}
                        className="flex-[0_0_85%] sm:flex-[0_0_60%] min-w-0 px-2 first:pl-3 last:pr-3"
                    >
                        <FeatureCardVertical {...card} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function ComfortSection() {
    return (
        <section className="py-10 bg-white">
            <div className="max-w-[1280px] mx-auto px-3 lg:px-6 flex flex-col gap-6">
                {/* Linha 1: 3 cards verticais — carrossel em mobile/tablet, grid em desktop */}
                <div className="lg:hidden">
                    <VerticalCardsCarouselMobile />
                </div>
                <div className="hidden lg:grid lg:grid-cols-3 gap-6">
                    {VERTICAL_CARDS.map((card, idx) => (
                        <FeatureCardVertical key={idx} {...card} />
                    ))}
                </div>

                {/* Linha 2: 2 cards "horizontais" (viram verticais em mobile/tablet) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FeatureCardHorizontal
                        title="Bases"
                        subtitle="Estilo e funcionalidade se unem em nossa linha de Bases para cama"
                        cta="Confira as opções"
                        href="/c/camas"
                        image="/banners/round-banner-4.webp"
                        imageMobile="/banners/round-banner-4.webp"
                        imageAlt="Base sommier"
                    />
                    <FeatureCardHorizontal
                        title="Cabeceiras"
                        subtitle="Encontre cabeceiras que combinam perfeitamente com seu estilo e conforto do seu quarto."
                        cta="Clique e descubra"
                        href="/c/cabeceiras"
                        image="/banners/round-banner-5.webp"
                        imageMobile="/banners/round-banner-5.webp"
                        imageAlt="Cabeceira em quarto"
                    />
                </div>
            </div>
        </section>
    )
}
