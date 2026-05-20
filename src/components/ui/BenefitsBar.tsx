'use client'

import React from 'react'
import { Truck, Percent, CreditCard, ShieldCheck } from 'lucide-react'

const BENEFITS = [
    {
        icon: Truck,
        title: 'Frete Grátis',
        description: 'A partir de R$ 300 em compras',
    },
    {
        icon: Percent,
        title: 'Até 10% OFF',
        description: 'Desconto extra no Pix ou Boleto',
    },
    {
        icon: CreditCard,
        title: 'Até 21x Sem Juros',
        description: 'No cartão de crédito',
    },
    {
        icon: ShieldCheck,
        title: 'Garantia Ortobom',
        description: 'Qualidade direto de fábrica',
    },
]

export function BenefitsBar() {
    return (
        <section className="bg-white border-b border-gray-100 py-6 md:py-8 shadow-xs">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
                    {BENEFITS.map((benefit, idx) => {
                        const Icon = benefit.icon
                        return (
                            <div 
                                key={idx} 
                                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 p-2 rounded-xl hover:bg-gray-50/50 transition-all duration-300 group"
                            >
                                <div className="p-3 bg-blue-50 text-[#1B2B4E] rounded-full group-hover:scale-105 transition-transform duration-300">
                                    <Icon size={20} className="stroke-[2px]" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base mb-0.5 leading-snug">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-500 text-xs leading-relaxed truncate-2-lines">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
