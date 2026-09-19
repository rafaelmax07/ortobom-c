'use client'

import Link from 'next/link'
import { Clock, MapPin, MessageCircle, ArrowRight } from 'lucide-react'
import { STORE, buildContactWhatsAppUrl } from '@/lib/landing'
import { useSavedLocation } from './useSavedLocation'

export function FinalCTASection() {
    const location = useSavedLocation()

    return (
        <section className="bg-white py-12 lg:py-20" aria-labelledby="lp-final-cta-title">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
                <div className="lp-hero rounded-[28px] px-6 py-10 sm:px-10 lg:px-16 lg:py-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-8 lg:gap-12 items-center">
                    <div>
                        <span className="lp-eyebrow !text-accent-bright">Atendimento local</span>
                        <h2 id="lp-final-cta-title" className="text-[26px] lg:text-[40px] font-extrabold leading-[1.1] tracking-tight mt-2 text-balance">
                            Ainda em dúvida sobre qual colchão escolher?
                        </h2>
                        <p className="mt-4 text-[15px] lg:text-[17px] text-white/80 max-w-[560px] leading-relaxed">
                            Nossos consultores em {location.city} ajudam você a encontrar o
                            conforto ideal para o seu corpo e o seu bolso — sem compromisso.
                        </p>

                        <ul className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-6 text-[14px] text-white/80">
                            <li className="flex items-center gap-2">
                                <MapPin size={16} className="text-accent-bright flex-shrink-0" aria-hidden="true" />
                                {STORE.address} · {location.city}/{location.uf}
                            </li>
                            <li className="flex items-center gap-2">
                                <Clock size={16} className="text-accent-bright flex-shrink-0" aria-hidden="true" />
                                {STORE.hours}
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3 w-full lg:w-[300px]">
                        <a
                            href={buildContactWhatsAppUrl('Olá! Gostaria de ajuda para escolher meu colchão.')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lp-btn lp-btn-whatsapp w-full"
                        >
                            <MessageCircle size={20} aria-hidden="true" />
                            Chamar no WhatsApp
                        </a>
                        <Link href="/c/colchoes" className="lp-btn lp-btn-ghost-light w-full">
                            Ver todos os colchões
                            <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                        <p className="text-center text-[12px] text-white/60">Resposta rápida em horário comercial</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
