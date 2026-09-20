import { resolveWhatsAppPhone } from './whatsapp'

/**
 * Conteúdo editável da landing page da franquia.
 *
 * ATENÇÃO: os valores marcados com `EXEMPLO` são placeholders de layout.
 * Substitua por dados reais da sua loja antes de publicar — avaliações e
 * depoimentos inventados configuram propaganda enganosa (CDC art. 37).
 */

export const STORE = {
    /** EXEMPLO — nome exibido no hero e no CTA final */
    name: 'Ortobom',
    /** EXEMPLO — endereço da loja física */
    address: 'Av. Exemplo, 1000 – Centro',
    /** EXEMPLO — horário de funcionamento */
    hours: 'Seg a Sáb, 9h às 19h',
}

export const SOCIAL_PROOF = {
    /** EXEMPLO — nota média no Google Meu Negócio */
    rating: 4.9,
    /** EXEMPLO — quantidade de avaliações no Google */
    reviewCount: 1200,
    /** EXEMPLO — clientes atendidos pela franquia */
    customersServed: '+15 mil',
}

export interface Testimonial {
    name: string
    city: string
    text: string
    product: string
}

/** EXEMPLO — troque por depoimentos reais (com autorização dos clientes) */
export const TESTIMONIALS: Testimonial[] = [
    {
        name: 'Cliente 1',
        city: 'Sua cidade',
        product: 'Colchão de molas',
        text: 'Substitua este texto por um depoimento real de cliente. Ex.: atendimento, entrega e qualidade do sono depois da compra.',
    },
    {
        name: 'Cliente 2',
        city: 'Sua cidade',
        product: 'Cama box baú',
        text: 'Substitua este texto por um depoimento real de cliente. Depoimentos específicos e com nome convertem mais.',
    },
    {
        name: 'Cliente 3',
        city: 'Sua cidade',
        product: 'Travesseiro',
        text: 'Substitua este texto por um depoimento real de cliente. Prefira avaliações copiadas do Google Meu Negócio.',
    },
]

/** Mesmo número de fallback usado em /contato quando a env não está definida. */
const FALLBACK_PHONE = '558399283994'

export function buildContactWhatsAppUrl(message = 'Olá! Vim pelo site e gostaria de atendimento.'): string {
    const phone = resolveWhatsAppPhone() || FALLBACK_PHONE
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
