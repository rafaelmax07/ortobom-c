import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Contato',
    description: 'Entre em contato conosco pelo WhatsApp, telefone ou visite nossa loja. Atendimento personalizado Ortobom.',
}

export default function ContactPage() {
    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '558399283994'}?text=${encodeURIComponent('Olá! Gostaria de informações.')}`

    return (
        <main className="min-h-screen bg-bg-light">
            {/* Hero */}
            <section className="bg-navy-medium py-16 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Fale Conosco</h1>
                    <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
                        Estamos aqui para ajudar. Entre em contato pelo canal que preferir.
                    </p>
                </div>
            </section>

            <section className="py-14">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Cards */}
                        <div className="space-y-5">
                            {[
                                { icon: MessageCircle, title: 'WhatsApp', desc: '3003-5011', sub: 'Resposta em até 30 minutos' },
                                { icon: Phone, title: 'Televendas', desc: '3003-5011', sub: 'Seg a Sex, 9h às 18h' },
                                { icon: Mail, title: 'E-mail', desc: 'sac@ortobom.com.br', sub: 'Resposta em até 24h' },
                                { icon: MapPin, title: 'Endereço', desc: 'Av. Epitácio Pessoa, 1200', sub: 'João Pessoa - PB' },
                                { icon: Clock, title: 'Horário', desc: 'Seg a Sex: 9h às 18h', sub: 'Sáb: 9h às 13h' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white rounded-xl p-5 border border-border flex items-start gap-4 hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <item.icon size={20} className="text-navy-medium" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-main text-sm">{item.title}</h3>
                                        <p className="text-sm text-text-soft">{item.desc}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{item.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6 md:p-8">
                            <h2 className="text-xl font-bold text-text-main mb-6">Envie uma Mensagem</h2>
                            <form className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-text-soft mb-1.5">Nome</label>
                                        <input type="text" placeholder="Seu nome completo" className="w-full border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-navy-medium focus:ring-2 focus:ring-navy-medium/10 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-soft mb-1.5">Telefone</label>
                                        <input type="tel" placeholder="(83) 9 0000-0000" className="w-full border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-navy-medium focus:ring-2 focus:ring-navy-medium/10 transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-soft mb-1.5">E-mail</label>
                                    <input type="email" placeholder="seu@email.com" className="w-full border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-navy-medium focus:ring-2 focus:ring-navy-medium/10 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-soft mb-1.5">Assunto</label>
                                    <select className="w-full border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-navy-medium focus:ring-2 focus:ring-navy-medium/10 transition-all text-text-muted">
                                        <option>Informações sobre produto</option>
                                        <option>Prazo de entrega</option>
                                        <option>Troca ou devolução</option>
                                        <option>Reclamação</option>
                                        <option>Outro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-soft mb-1.5">Mensagem</label>
                                    <textarea rows={5} placeholder="Como podemos ajudar?" className="w-full border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-navy-medium focus:ring-2 focus:ring-navy-medium/10 transition-all resize-none" />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button type="submit" className="bg-navy-medium hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-xl text-sm transition-all duration-200">
                                        Enviar Mensagem
                                    </button>
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-white font-bold py-3 px-8 rounded-xl text-sm transition-all duration-200"
                                    >
                                        <MessageCircle size={16} />
                                        Ou fale pelo WhatsApp
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
