'use client'

import { Truck, CreditCard, Percent, Bed } from 'lucide-react'
import Link from 'next/link'

interface Benefit {
    icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
    title: string
    subtitle: string
    note?: string
    link: string
}

const BENEFITS: Benefit[] = [
    {
        icon: Truck,
        title: 'Frete Grátis a partir de R$ 300',
        subtitle: 'Confira a Política de Entrega',
        link: '#',
    },
    {
        icon: Percent,
        title: 'Descontos + 6x sem juros',
        subtitle: 'Só nesta semana',
        note: '*Em itens selecionados',
        link: '/c/colchoes',
    },
    {
        icon: CreditCard,
        title: 'Parcelamento em até 21x',
        subtitle: 'Confira a Política de Pagamento',
        link: '#',
    },
    {
        icon: Bed,
        title: 'Colchões e bases sob medida',
        subtitle: 'Seu ortobom do seu jeito',
        link: '/c/colchoes',
    },
]

export function BenefitsBar() {
    return (
        <section className="bg-white border-b border-border py-6">
            <div className="max-w-[1280px] mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {BENEFITS.map((benefit, idx) => {
                        const Icon = benefit.icon
                        return (
                            <Link
                                key={idx}
                                href={benefit.link}
                                className="flex items-center gap-4 group"
                            >
                                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-bg-light flex items-center justify-center text-navy-medium group-hover:bg-bg-soft transition-colors">
                                    <Icon size={20} strokeWidth={1.8} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] text-text-soft leading-snug">{benefit.title}</p>
                                    <p className="text-[13px] text-navy-medium font-bold leading-snug">{benefit.subtitle}</p>
                                    {benefit.note && (
                                        <p className="text-[11px] text-text-muted italic leading-snug mt-0.5">{benefit.note}</p>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
