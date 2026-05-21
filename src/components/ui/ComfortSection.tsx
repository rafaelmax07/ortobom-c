import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'

interface FeatureCardProps {
    title: ReactNode
    subtitle: string
    cta: string
    href: string
    image: string
    imageAlt: string
}

const CARD_BG = '#1a273b'

function GhostButton({ label }: { label: string }) {
    return (
        <span
            className="inline-block border border-white rounded px-6 py-2 text-[13px] font-medium transition-colors group-hover:bg-white"
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
            className="group rounded-xl overflow-hidden flex flex-col items-center text-center pt-8 shadow-lg text-white"
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

function FeatureCardHorizontal({
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
            className="group rounded-xl overflow-hidden flex h-64 shadow-lg text-white"
            style={{ backgroundColor: CARD_BG }}
        >
            {/* Texto à esquerda */}
            <div className="p-8 flex-grow flex flex-col justify-center max-w-[60%]">
                <h2 className="text-[24px] font-bold mb-3 uppercase">{title}</h2>
                <p className="text-[14px] mb-6 line-clamp-3 text-white/90">{subtitle}</p>
                <div>
                    <GhostButton label={cta} />
                </div>
            </div>

            {/* Foto com clip-path elíptica (arco vertical à direita) */}
            <div className="relative w-[40%] h-full ml-auto overflow-hidden flex-shrink-0">
                <div
                    className="absolute inset-0"
                    style={{ clipPath: 'ellipse(100% 80% at 100% 50%)' }}
                >
                    <Image
                        src={image}
                        alt={imageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        style={{ objectPosition: '50% 50%' }}
                        sizes="(min-width: 1024px) 25vw, 50vw"
                    />
                </div>
            </div>
        </Link>
    )
}

export function ComfortSection() {
    return (
        <section className="py-10 bg-white">
            <div className="max-w-[1280px] mx-auto px-6 flex flex-col gap-6">
                {/* Linha 1: 3 cards verticais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCardVertical
                        title={
                            <>
                                3 Passos para o colchão
                                <br />
                                dos seus sonhos
                            </>
                        }
                        subtitle="Saiba qual colchão combina mais com você e seu estilo"
                        cta="Faça seu teste e descubra"
                        href="/c/colchoes"
                        image="/banners/round-banner-1.webp"
                        imageAlt="Mulher relaxando em quarto"
                    />
                    <FeatureCardVertical
                        title="Colchões"
                        subtitle="Do conforto das molas à sofisticação das espumas, o seu sono perfeito começa aqui."
                        cta="Escolha o seu"
                        href="/c/colchoes"
                        image="/banners/round-banner-2.webp"
                        imageAlt="Mulher descansando sobre colchão"
                    />
                    <FeatureCardVertical
                        title="Kits"
                        subtitle="Renove o seu quarto e economize muito mais"
                        cta="Quero dormir melhor"
                        href="/c/colchoes"
                        image="/banners/round-banner-3.webp"
                        imageAlt="Quarto com cama montada"
                    />
                </div>

                {/* Linha 2: 2 cards horizontais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FeatureCardHorizontal
                        title="Bases"
                        subtitle="Estilo e funcionalidade se unem em nossa linha de Bases para cama"
                        cta="Confira as opções"
                        href="/c/camas"
                        image="/banners/round-banner-4.webp"
                        imageAlt="Base sommier"
                    />
                    <FeatureCardHorizontal
                        title="Cabeceiras"
                        subtitle="Encontre cabeceiras que combinam perfeitamente com seu estilo e conforto do seu quarto."
                        cta="Clique e descubra"
                        href="/c/cabeceiras"
                        image="/banners/round-banner-5.webp"
                        imageAlt="Mulher lendo em cama com cabeceira"
                    />
                </div>
            </div>
        </section>
    )
}
