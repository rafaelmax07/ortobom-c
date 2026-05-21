import Image from 'next/image'
import { Phone, BookOpen, ChevronRight, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react'
import { FactoriesAccordion } from './FactoriesAccordion'

const ORTOBOM_BASE = 'https://www.ortobom.com.br'

const INSTITUCIONAL = [
    { label: 'Sobre a ortobom', href: `${ORTOBOM_BASE}/i/sobre-a-ortobom` },
    { label: 'Mapa de Lojas', href: `${ORTOBOM_BASE}/listalojas` },
    { label: 'Ortobom na Mídia', href: `${ORTOBOM_BASE}/midia` },
    { label: 'Manual do Sono', href: 'https://cdn.ortobom.com.br/file/b094f962-936c-4f52-8607-ddbcfb7d3ff5/MANUAL%20DO%20SONO%20FRANQUIA%202.2024-otimizado.pdf' },
    { label: 'Mapa de conforto', href: `${ORTOBOM_BASE}/i/mapa-do-conforto` },
    { label: 'Teste de Qualidade', href: `${ORTOBOM_BASE}/i/teste-de-qualidade` },
    { label: 'Responsabilidade Social', href: `${ORTOBOM_BASE}/i/responsabilidade-social` },
    { label: 'Meio Ambiente', href: `${ORTOBOM_BASE}/i/meio-ambiente` },
    { label: 'Prêmios', href: `${ORTOBOM_BASE}/premios` },
    { label: 'Política de Promoções', href: `${ORTOBOM_BASE}/i/politicadepromocao` },
    { label: 'Cupom de Desconto', href: `${ORTOBOM_BASE}/cupomdedesconto` },
    { label: 'Cartilha da Diversidade', href: `${ORTOBOM_BASE}/i/cartilha-da-diversidade` },
]

const INSTITUCIONAL_EXTRA = [
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
    { label: 'Fábrica dos sonhos', href: `${ORTOBOM_BASE}/FabricaDosSonhos` },
    { label: 'Colchão Ideal', href: `${ORTOBOM_BASE}/colchaoideal` },
    { label: 'Colchão na Caixa Only', href: `${ORTOBOM_BASE}/cemdias` },
    { label: 'Relatório de transparência salarial', href: `${ORTOBOM_BASE}/institucional/relatorio-de-transparencia-salarial` },
]

const PAYMENT_METHODS = [
    { name: 'Mastercard', src: '/payment-icons/icone-mastercard.png' },
    { name: 'Visa', src: '/payment-icons/icone-visa.png' },
    { name: 'Elo', src: '/payment-icons/icone-elo.png' },
    { name: 'American Express', src: '/payment-icons/icone-amex.png' },
    { name: 'Diners Club', src: '/payment-icons/icone-diners.png' },
    { name: 'Sorocred', src: '/payment-icons/icone-sorocred.png' },
    { name: 'Banestes', src: '/payment-icons/icone-banestes.png' },
    { name: 'Cabal', src: '/payment-icons/icone-cabal.png' },
    { name: 'Pix', src: '/payment-icons/icone-pix.png' },
    { name: 'Boleto', src: '/payment-icons/icone-boleto.png' },
]

interface FooterColumnProps {
    title: string
    items: { label: string; href: string }[]
    extraItems?: { label: string; href: string }[]
}

function FooterColumn({ title, items, extraItems }: FooterColumnProps) {
    return (
        <div>
            <h4 className="font-bold text-white text-[15px] mb-4">{title}</h4>
            <ul className="space-y-2 text-[13px]">
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

            {extraItems && extraItems.length > 0 && (
                <ul className="space-y-2 text-[13px] mt-5 pt-5">
                    {extraItems.map(item => (
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
            )}
        </div>
    )
}

function SocialIcon({
    href,
    label,
    children,
}: {
    href: string
    label: string
    children: React.ReactNode
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-10 h-10 rounded-md flex items-center justify-center text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
        >
            {children}
        </a>
    )
}

export function Footer() {
    return (
        <footer className="bg-navy-dark text-white/70">
            <div className="max-w-[1280px] mx-auto px-6 pt-10 pb-6">
                {/* Top: cards Televendas + Manual do Sono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 max-w-[1200px] mx-auto">
                    <div className="border border-white rounded-xl px-5 py-6 flex items-center justify-center gap-4 min-h-[88px]">
                        <Phone size={22} className="text-white shrink-0" aria-hidden="true" />
                        <div className="min-w-0 max-w-[290px] flex flex-col justify-center">
                            <h4 className="font-medium text-white text-[15px] leading-tight">Televendas</h4>
                            <p className="text-white/65 text-[11px] leading-snug">
                                Nossa equipe de consultores está preparada para te auxiliar.
                            </p>
                        </div>
                        <a
                            href={`${ORTOBOM_BASE}/Televendas`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white text-[13px] font-bold inline-flex items-center gap-1 hover:underline whitespace-nowrap"
                        >
                            Fale com consultores <ChevronRight size={14} />
                        </a>
                    </div>

                    <div className="border border-white rounded-xl px-5 py-6 flex items-center justify-center gap-3 min-h-[88px]">
                        <BookOpen size={28} className="text-white shrink-0" aria-hidden="true" />
                        <div className="min-w-0 max-w-[330px] flex flex-col justify-center">
                            <h4 className="font-medium text-white text-[15px] leading-tight">
                                Manual do Sono Ortobom
                            </h4>
                            <p className="text-white/65 text-[12px] leading-snug">
                                Confira como ter sono melhores com o nosso manual.
                            </p>
                        </div>
                        <a
                            href="https://cdn.ortobom.com.br/file/b094f962-936c-4f52-8607-ddbcfb7d3ff5/MANUAL%20DO%20SONO%20FRANQUIA%202.2024-otimizado.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white text-[13px] font-bold inline-flex items-center gap-1 hover:underline whitespace-nowrap"
                        >
                            Acesse e confira <ChevronRight size={14} />
                        </a>
                    </div>
                </div>

                {/* Colunas */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10 max-w-[1200px] mx-auto">
                    <FooterColumn
                        title="Institucional"
                        items={INSTITUCIONAL}
                        extraItems={INSTITUCIONAL_EXTRA}
                    />
                    <FooterColumn title="Central do Cliente" items={CENTRAL_CLIENTE} />
                    <FooterColumn title="Fale Conosco" items={FALE_CONOSCO} />
                    <FooterColumn title="Páginas Especiais" items={PAGINAS_ESPECIAIS} />

                    <div>
                        <h4 className="font-bold text-white text-[15px] mb-4">Nossas Redes</h4>
                        <div className="grid grid-cols-3 gap-2 max-w-[140px]">
                            <SocialIcon href="https://www.facebook.com/ortobom" label="Facebook">
                                <Facebook size={18} />
                            </SocialIcon>
                            <SocialIcon href="https://www.instagram.com/ortobom" label="Instagram">
                                <Instagram size={18} />
                            </SocialIcon>
                            <SocialIcon href="https://www.youtube.com/ortobom" label="YouTube">
                                <Youtube size={18} />
                            </SocialIcon>
                            <SocialIcon
                                href="https://www.linkedin.com/company/ortobom/"
                                label="LinkedIn"
                            >
                                <Linkedin size={18} />
                            </SocialIcon>
                        </div>
                    </div>
                </div>

                {/* Pagamentos + Segurança */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 pt-6 items-start max-w-[1200px] mx-auto">
                    <div>
                        <h5 className="font-bold text-white text-[13px] mb-3">
                            Formas e bandeiras de pagamento aceitas
                        </h5>
                        <div className="flex flex-wrap gap-2">
                            {PAYMENT_METHODS.map(p => (
                                <Image
                                    key={p.name}
                                    src={p.src}
                                    alt={p.name}
                                    width={40}
                                    height={26}
                                    className="h-[26px] w-auto rounded-sm bg-white/95 px-1"
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h5 className="font-bold text-white text-[13px] mb-3">Selos de segurança</h5>
                        <Image
                            src="/payment-icons/icone-seguranca.png"
                            alt="Selo de Segurança"
                            width={44}
                            height={44}
                            className="h-[44px] w-auto rounded-sm bg-white/95 p-1 inline-block"
                        />
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="py-8">
                <div className="max-w-[1200px] mx-auto px-6 text-[12px] text-white border-t border-b border-white/30 py-8">
                    <p>© Copyright ORTOBOM – Todos os direitos reservados.</p>
                </div>
            </div>

            <FactoriesAccordion />
        </footer>
    )
}
