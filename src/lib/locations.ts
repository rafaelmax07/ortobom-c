/**
 * Estados e principais cidades do Brasil. Não é uma lista completa de
 * municípios — apenas as capitais e algumas cidades relevantes onde a
 * Ortobom tem operação destacada.
 */
export const STATES: { uf: string; name: string }[] = [
    { uf: 'AC', name: 'Acre' },
    { uf: 'AL', name: 'Alagoas' },
    { uf: 'AM', name: 'Amazonas' },
    { uf: 'AP', name: 'Amapá' },
    { uf: 'BA', name: 'Bahia' },
    { uf: 'CE', name: 'Ceará' },
    { uf: 'DF', name: 'Distrito Federal' },
    { uf: 'ES', name: 'Espírito Santo' },
    { uf: 'GO', name: 'Goiás' },
    { uf: 'MA', name: 'Maranhão' },
    { uf: 'MG', name: 'Minas Gerais' },
    { uf: 'MS', name: 'Mato Grosso do Sul' },
    { uf: 'MT', name: 'Mato Grosso' },
    { uf: 'PA', name: 'Pará' },
    { uf: 'PB', name: 'Paraíba' },
    { uf: 'PE', name: 'Pernambuco' },
    { uf: 'PI', name: 'Piauí' },
    { uf: 'PR', name: 'Paraná' },
    { uf: 'RJ', name: 'Rio de Janeiro' },
    { uf: 'RN', name: 'Rio Grande do Norte' },
    { uf: 'RO', name: 'Rondônia' },
    { uf: 'RR', name: 'Roraima' },
    { uf: 'RS', name: 'Rio Grande do Sul' },
    { uf: 'SC', name: 'Santa Catarina' },
    { uf: 'SE', name: 'Sergipe' },
    { uf: 'SP', name: 'São Paulo' },
    { uf: 'TO', name: 'Tocantins' },
]

export const CITIES_BY_STATE: Record<string, string[]> = {
    AC: ['Rio Branco', 'Cruzeiro do Sul'],
    AL: ['Maceió', 'Arapiraca'],
    AM: ['Manaus', 'Parintins'],
    AP: ['Macapá'],
    BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Simões Filho'],
    CE: ['Fortaleza', 'Caucaia', 'Maracanaú', 'Juazeiro do Norte'],
    DF: ['Brasília'],
    ES: ['Vitória', 'Vila Velha', 'Serra', 'Cariacica'],
    GO: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis'],
    MA: ['São Luís', 'Imperatriz'],
    MG: ['Belo Horizonte', 'Contagem', 'Uberlândia', 'Juiz de Fora', 'Betim', 'Montes Claros'],
    MS: ['Campo Grande', 'Dourados'],
    MT: ['Cuiabá', 'Várzea Grande'],
    PA: ['Belém', 'Ananindeua', 'Marituba'],
    PB: ['João Pessoa', 'Campina Grande'],
    PE: ['Recife', 'Olinda', 'Jaboatão dos Guararapes', 'Caruaru'],
    PI: ['Teresina'],
    PR: ['Curitiba', 'Londrina', 'Maringá', 'Arapongas'],
    RJ: ['Rio de Janeiro', 'Niterói', 'Nova Iguaçu', 'Duque de Caxias', 'São Gonçalo', 'Petrópolis'],
    RN: ['Natal', 'Mossoró'],
    RO: ['Porto Velho'],
    RR: ['Boa Vista'],
    RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Campo Bom'],
    SC: ['Florianópolis', 'Joinville', 'Blumenau'],
    SE: ['Aracaju'],
    SP: ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Osasco', 'Santos'],
    TO: ['Palmas'],
}

export const DEFAULT_LOCATION = { uf: 'PB', city: 'João Pessoa' }

const STORAGE_KEY = 'ortobom:location'

export interface SavedLocation {
    uf: string
    city: string
}

export function readSavedLocation(): SavedLocation {
    if (typeof window === 'undefined') return DEFAULT_LOCATION
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) return DEFAULT_LOCATION
        const parsed = JSON.parse(raw) as SavedLocation
        if (parsed?.uf && parsed?.city) return parsed
    } catch {
        // ignore
    }
    return DEFAULT_LOCATION
}

export function writeSavedLocation(loc: SavedLocation): void {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loc))
        window.dispatchEvent(new CustomEvent('ortobom:location-changed'))
    } catch {
        // ignore
    }
}
