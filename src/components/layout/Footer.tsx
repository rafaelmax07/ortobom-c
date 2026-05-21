import Link from 'next/link'
import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react'

const ORTOBOM_BASE = 'https://www.ortobom.com.br'

const INSTITUCIONAL = [
    { label: 'Sobre a Ortobom', href: `${ORTOBOM_BASE}/i/sobre-a-ortobom` },
    { label: 'Mapa de Lojas', href: `${ORTOBOM_BASE}/listalojas` },
    { label: 'Ortobom na Mídia', href: `${ORTOBOM_BASE}/midia` },
    { label: 'Manual do Sono', href: 'https://cdn.ortobom.com.br/file/b094f962-936c-4f52-8607-ddbcfb7d3ff5/MANUAL%20DO%20SONO%20FRANQUIA%202.2024-otimizado.pdf' },
    { label: 'Mapa de Conforto', href: `${ORTOBOM_BASE}/i/mapa-do-conforto` },
    { label: 'Teste de Qualidade', href: `${ORTOBOM_BASE}/i/teste-de-qualidade` },
    { label: 'Responsabilidade Social', href: `${ORTOBOM_BASE}/i/responsabilidade-social` },
    { label: 'Meio Ambiente', href: `${ORTOBOM_BASE}/i/meio-ambiente` },
    { label: 'Prêmios', href: `${ORTOBOM_BASE}/premios` },
    { label: 'Política de Promoções', href: `${ORTOBOM_BASE}/i/politicadepromocao` },
    { label: 'Cupom de Desconto', href: `${ORTOBOM_BASE}/cupomdedesconto` },
    { label: 'Cartilha da Diversidade', href: `${ORTOBOM_BASE}/i/cartilha-da-diversidade` },
    { label: 'Extranet', href: 'http://extranet.ortobom.com.br/' },
    { label: 'Sisloja', href: 'https://sisloja.ortobom.com.br/' },
]

const CENTRAL_CLIENTE = [
    { label: 'Meus Pedidos', href: `${ORTOBOM_BASE}/AccountDetalhes` },
    { label: 'Solicitação de Cancelamento', href: `${ORTOBOM_BASE}/i/termos-de-uso#Cancelamento` },
    { label: 'Perguntas Frequentes', href: `${ORTOBOM_BASE}/perguntasfrequentes` },
    { label: 'Termos de Uso', href: `${ORTOBOM_BASE}/i/termos-de-uso` },
    { label: 'Política de Privacidade', href: `${ORTOBOM_BASE}/i/politica-de-privacidade` },
    { label: 'Prazos de Garantia', href: `${ORTOBOM_BASE}/Content/Garantia` },
    { label: 'PROCON', href: 'https://rbravo.github.io/procon-brasil/' },
]

const FALE_CONOSCO = [
    { label: 'SAC', href: 'https://ortobom.custhelp.com/' },
    { label: 'Televendas', href: `${ORTOBOM_BASE}/Televendas` },
    { label: 'Código de Ética', href: 'https://cdn.ortobom.com.br/file/a65138ff-c291-4743-bf3f-08d5d794e19b/V2_novo_codigodeetica_novoformato_versao_fevereiro_2026_horizontal.pdf' },
    { label: 'Seja um Franqueado', href: `${ORTOBOM_BASE}/SejaUmFranqueado` },
    { label: 'Lei Geral de Proteção a Dados (LGPD)', href: `${ORTOBOM_BASE}/LGPD` },
    { label: 'Assessoria de Imprensa', href: 'https://www.canalacomunicacao.com.br/' },
    { label: 'Seja um Fornecedor Ortobom', href: `${ORTOBOM_BASE}/Fornecedor` },
    { label: 'Quero uma loja Ortobom no meu imóvel', href: `${ORTOBOM_BASE}/queroumalojaortobomnomeuimovel` },
    { label: 'Trabalhe Conosco', href: 'https://ortobom.pandape.infojobs.com.br/' },
]

const PAGINAS_ESPECIAIS = [
    { label: 'Fábrica dos Sonhos', href: `${ORTOBOM_BASE}/FabricaDosSonhos` },
    { label: 'Colchão Ideal', href: `${ORTOBOM_BASE}/colchaoideal` },
    { label: 'Colchão na Caixa Only', href: `${ORTOBOM_BASE}/cemdias` },
    { label: 'Relatório de Transparência Salarial', href: `${ORTOBOM_BASE}/institucional/relatorio-de-transparencia-salarial` },
]

interface FooterColumnProps {
    title: string
    items: { label: string; href: string }[]
}

function FooterColumn({ title, items }: FooterColumnProps) {
    return (
        <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">{title}</h4>
            <ul className="space-y-2 text-xs">
                {items.map(item => (
                    <li key={item.label}>
                        <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export function Footer() {
    return (
        <footer className="bg-navy-dark text-white/70 font-sans text-sm">
            <div className="max-w-[1280px] mx-auto px-6 pt-10 pb-6">
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
                        <a
                            href="https://drive.google.com/file/d/1sGNmqQuYNc0kG7q6g4YjpTKm265_o9EO/view"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white font-bold text-xs mt-1 inline-block hover:underline"
                        >
                            Acesse e confira →
                        </a>
                    </div>
                </div>

                {/* Main Columns */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
                    <FooterColumn title="Institucional" items={INSTITUCIONAL} />
                    <FooterColumn title="Central do Cliente" items={CENTRAL_CLIENTE} />
                    <FooterColumn title="Fale Conosco" items={FALE_CONOSCO} />
                    <FooterColumn title="Páginas Especiais" items={PAGINAS_ESPECIAIS} />

                    {/* Social */}
                    <div>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Nossas Redes</h4>
                        <div className="flex gap-3 mb-6">
                            <a href="https://www.facebook.com/ortobom" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Facebook size={15} />
                            </a>
                            <a href="https://www.instagram.com/ortobom" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Instagram size={15} />
                            </a>
                            <a href="https://www.youtube.com/ortobom" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Youtube size={15} />
                            </a>
                            <a href="https://www.linkedin.com/company/ortobom/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Linkedin size={15} />
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
                <div className="max-w-[1280px] mx-auto px-6 text-center text-xs text-white/50">
                    <p>© Copyright ORTOBOM – Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
