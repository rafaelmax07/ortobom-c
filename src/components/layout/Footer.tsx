import Link from 'next/link'
import { Facebook, Instagram, Youtube } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-navy-dark text-white/70 font-sans text-sm">
            <div className="max-w-[1320px] mx-auto px-4 pt-10 pb-6">
                {/* Top utility row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 pb-8 border-b border-white/10">
                    <div>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">Televendas</h4>
                        <p className="text-white/60 text-xs">Nossa equipe de consultores está preparada para te auxiliar.</p>
                        <a href="tel:30035011" className="text-white font-bold text-base mt-1 block">3003-5011</a>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">Manual do Sono Ortobom</h4>
                        <p className="text-white/60 text-xs">Confira como ter sono melhores com o nosso manual.</p>
                    </div>
                </div>

                {/* Main Columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                    {/* Institucional */}
                    <div>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Institucional</h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link href="/sobre" className="hover:text-white transition-colors">Sobre a Ortobom</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Mapa de Lojas</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Prêmios</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Política de Promoções</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Responsabilidade Social</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Meio Ambiente</Link></li>
                        </ul>
                    </div>

                    {/* Central do Cliente */}
                    <div>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Central do Cliente</h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link href="#" className="hover:text-white transition-colors">Meus Pedidos</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Perguntas Frequentes</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Prazos de Garantia</Link></li>
                        </ul>
                    </div>

                    {/* Fale Conosco */}
                    <div>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Fale Conosco</h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link href="/contato" className="hover:text-white transition-colors">SAC</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Televendas</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Seja um Franqueado</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Trabalhe Conosco</Link></li>
                        </ul>
                    </div>

                    {/* Social + Payments */}
                    <div>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Nossas Redes</h4>
                        <div className="flex gap-3 mb-6">
                            <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Facebook size={14} />
                            </a>
                            <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Instagram size={14} />
                            </a>
                            <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Youtube size={14} />
                            </a>
                        </div>

                        <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Formas de pagamento</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Mastercard', 'Visa', 'Elo', 'Amex', 'Pix', 'Boleto'].map(method => (
                                <span key={method} className="bg-white/10 text-white/80 text-[10px] font-medium px-2 py-1 rounded">
                                    {method}
                                </span>
                            ))}
                        </div>

                        <h4 className="font-bold text-white text-xs uppercase tracking-wider mt-5 mb-2">Segurança</h4>
                        <span className="bg-white/10 text-white/80 text-[10px] font-medium px-2 py-1 rounded inline-block">
                            🔒 Site Seguro
                        </span>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/10 py-4">
                <div className="max-w-[1320px] mx-auto px-4 text-center text-xs text-white/50">
                    <p>© Copyright ORTOBOM – Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
