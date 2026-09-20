import { Quote, Factory, Users, Star, Award } from 'lucide-react'
import { SOCIAL_PROOF, TESTIMONIALS } from '@/lib/landing'
import { StarRating } from './StarRating'

const STATS = [
    { icon: Factory, value: '55+ anos', label: 'fabricando colchões no Brasil' },
    { icon: Award, value: 'Nº 1', label: 'maior fabricante de colchões da América Latina' },
    {
        icon: Star,
        value: `${SOCIAL_PROOF.rating.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}/5`,
        label: `nota média em ${SOCIAL_PROOF.reviewCount.toLocaleString('pt-BR')} avaliações`,
    },
    { icon: Users, value: SOCIAL_PROOF.customersServed, label: 'clientes atendidos na região' },
]

export function SocialProofSection() {
    return (
        <section className="bg-bg-light py-12 lg:py-20" aria-labelledby="lp-social-title">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
                <div className="text-center max-w-[640px] mx-auto mb-8 lg:mb-12">
                    <span className="lp-eyebrow">Quem compra, recomenda</span>
                    <h2 id="lp-social-title" className="lp-title mt-2">
                        Milhares de famílias já dormem melhor com a Ortobom
                    </h2>
                </div>

                <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-10 lg:mb-14">
                    {STATS.map(({ icon: Icon, value, label }) => (
                        <li key={label} className="lp-surface p-4 lg:p-6 flex flex-col items-center text-center gap-2">
                            <span className="w-11 h-11 rounded-full bg-accent-light text-accent flex items-center justify-center">
                                <Icon size={20} aria-hidden="true" />
                            </span>
                            <strong className="text-[22px] lg:text-[28px] font-extrabold text-primary leading-none tracking-tight">
                                {value}
                            </strong>
                            <span className="text-[12px] lg:text-[14px] text-text-muted leading-snug">{label}</span>
                        </li>
                    ))}
                </ul>

                {TESTIMONIALS.length > 0 && (
                    <div className="lp-snap-row -mx-4 px-4 lg:mx-0 lg:px-0">
                        {TESTIMONIALS.map((t) => (
                            <figure key={t.name} className="lp-surface p-6 lg:p-7 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <StarRating />
                                    <Quote size={28} className="text-accent-bright/50" aria-hidden="true" />
                                </div>
                                <blockquote className="t-body text-[15px] text-text-soft flex-grow">
                                    “{t.text}”
                                </blockquote>
                                <figcaption className="flex items-center gap-3 pt-4 border-t border-border">
                                    <span
                                        className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center flex-shrink-0"
                                        aria-hidden="true"
                                    >
                                        {t.name.charAt(0)}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-[14px] font-bold text-text-main">{t.name}</span>
                                        <span className="block t-meta">
                                            {t.city} · comprou {t.product}
                                        </span>
                                    </span>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
