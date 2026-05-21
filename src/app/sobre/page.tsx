import type { Metadata } from 'next'
import { ShieldCheck, Award, Heart, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Sobre Nós',
    description: 'Conheça a história da Ortobom e nosso compromisso com qualidade, conforto e tecnologia em colchões, camas e acessórios.',
}

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative bg-navy-medium py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-medium to-navy-dark" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                        Sobre Nós
                    </h1>
                    <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
                        Há mais de 50 anos proporcionando o melhor descanso para milhões de famílias brasileiras.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="bg-accent-light text-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                                Nossa História
                            </span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-text-main mb-5">
                                Tradição e Inovação em Cada Produto
                            </h2>
                            <div className="space-y-4 text-text-soft text-sm leading-relaxed">
                                <p>
                                    A Ortobom é uma das maiores e mais respeitadas marcas de colchões do Brasil. Com décadas de experiência, combinamos tecnologia de ponta com o conforto que sua família merece.
                                </p>
                                <p>
                                    Como revendedor autorizado, temos orgulho de levar até você toda a linha de produtos Ortobom com atendimento personalizado, preços competitivos e a conveniência de comprar pelo WhatsApp com entrega na sua região.
                                </p>
                                <p>
                                    Nosso compromisso é oferecer uma experiência de compra simples, transparente e sem complicações — do primeiro contato até a entrega na sua casa.
                                </p>
                            </div>
                        </div>
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop"
                                alt="Loja Ortobom"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-bg-light">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-text-main mb-2">Nossos Valores</h2>
                        <p className="text-text-muted text-sm">O que nos move todos os dias</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: ShieldCheck, title: 'Qualidade', desc: 'Produtos certificados com garantia de fábrica Ortobom' },
                            { icon: Award, title: 'Excelência', desc: 'Atendimento personalizado e consultoria de sono' },
                            { icon: Heart, title: 'Cuidado', desc: 'Cada cliente é único e merece atenção especial' },
                            { icon: Truck, title: 'Agilidade', desc: 'Entrega rápida e montagem na sua casa' },
                        ].map((value, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-6 text-center border border-border">
                                <div className="inline-flex w-14 h-14 rounded-full bg-primary/10 text-navy-medium items-center justify-center mb-4">
                                    <value.icon size={26} />
                                </div>
                                <h3 className="font-bold text-text-main mb-2">{value.title}</h3>
                                <p className="text-sm text-text-muted">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-text-main mb-4">Pronto para uma Noite de Sono Perfeita?</h2>
                    <p className="text-text-muted text-sm mb-6">Explore nossa linha completa de produtos</p>
                    <Link
                        href="/c/colchoes"
                        className="inline-flex items-center gap-2 bg-navy-medium hover:bg-accent text-white font-bold py-3.5 px-8 rounded-full text-sm transition-all duration-300"
                    >
                        Ver Produtos
                    </Link>
                </div>
            </section>
        </main>
    )
}
