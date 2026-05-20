import Link from 'next/link'
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-[#f4f4f4] text-gray-600 font-sans pt-12 pb-6 border-t border-gray-200">
            <div className="container mx-auto px-4">

                {/* Top Section: Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h4 className="font-bold text-[#1B2B4E] mb-4">Institucional</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:underline">Sobre a Ortobom</Link></li>
                            <li><Link href="/" className="hover:underline">Trabalhe Conosco</Link></li>
                            <li><Link href="/" className="hover:underline">Sustentabilidade</Link></li>
                            <li><Link href="/" className="hover:underline">Política de Privacidade</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#1B2B4E] mb-4">Ajuda e Suporte</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:underline">Central de Atendimento</Link></li>
                            <li><Link href="/" className="hover:underline">Política de Troca</Link></li>
                            <li><Link href="/" className="hover:underline">Prazos de Entrega</Link></li>
                            <li><Link href="/" className="hover:underline">Perguntas Frequentes</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#1B2B4E] mb-4">Produtos</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/c/colchoes" className="hover:underline">Colchões</Link></li>
                            <li><Link href="/c/camas" className="hover:underline">Camas e Bases</Link></li>
                            <li><Link href="/c/travesseiros" className="hover:underline">Travesseiros</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#1B2B4E] mb-4">Siga-nos</h4>
                        <div className="flex gap-4">
                            <Link href="/" className="bg-white p-2 rounded-full shadow-sm hover:text-blue-600 transition">
                                <Facebook size={20} />
                            </Link>
                            <Link href="/" className="bg-white p-2 rounded-full shadow-sm hover:text-pink-600 transition">
                                <Instagram size={20} />
                            </Link>
                            <Link href="/" className="bg-white p-2 rounded-full shadow-sm hover:text-red-600 transition">
                                <Youtube size={20} />
                            </Link>
                        </div>

                        <h4 className="font-bold text-[#1B2B4E] mt-6 mb-2">Formas de Pagamento</h4>
                        <div className="flex gap-2 flex-wrap text-xs text-gray-400">
                            <span>Visa</span> | <span>Master</span> | <span>Elo</span> | <span>Pix</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Copyright */}
                <div className="border-t border-gray-300 pt-8 text-center text-xs md:text-sm">
                    <p className="mb-2">&copy; {new Date().getFullYear()} Ortobom. Todos os direitos reservados.</p>
                    <p className="text-gray-400">Desenvolvido como Clone para fins de estudo/freela.</p>
                </div>
            </div>
        </footer>
    )
}
