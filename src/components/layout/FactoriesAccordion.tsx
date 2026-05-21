'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

interface Factory {
    area: string
    razaoSocial: string
    cnpj: string
    cidade: string
    uf: string
    endereco: string
    telefone: string
    email: string
}

const FACTORIES: Factory[] = [
    {
        area: 'SP – Capital, Litoral',
        razaoSocial: "D'Juan Colchões Indústria e Comércio LTDA",
        cnpj: '54.213.764/0102-38',
        cidade: 'São Bernardo do Campo',
        uf: 'SP',
        endereco: 'Estrada Samuel Aizemberg, 705 1º andar – Alves Dias – São Bernardo do Campo – SP – CEP:09851-550',
        telefone: '08002855011',
        email: 'sac@ortobom.com.br',
    },
    {
        area: 'SP (Interior), PR',
        razaoSocial: 'Fabricadora de Espumas e Colchões Norte Paranaense',
        cnpj: '02.292.653/0001-17',
        cidade: 'Arapongas',
        uf: 'PR',
        endereco: 'Rua Guaratinga, 1045 – Parque Oeste Industrial – Arapongas – PR – CEP:86703-010',
        telefone: '08002855011',
        email: 'sac@ortobom.com.br',
    },
    {
        area: 'RJ',
        razaoSocial: 'Fabricadora de Poliuretano Rio Sul',
        cnpj: '02.895.152/0001-25',
        cidade: 'Nova Iguaçu',
        uf: 'RJ',
        endereco: 'Estrada da Guarita, 313 – Três Corações – Nova Iguaçu – RJ – CEP:26022-300',
        telefone: '08002855011',
        email: 'sac@ortobom.com.br',
    },
    {
        area: 'MG, ES',
        razaoSocial: 'Contagem Ind. Com. de Colchões e Espumas',
        cnpj: '02.748.305/0001-01',
        cidade: 'Contagem',
        uf: 'MG',
        endereco: 'Rua Felipe dos Santos, 387 – Nacional – Contagem – MG – CEP:32185-160',
        telefone: '08002855011',
        email: 'sac@ortobom.com.br',
    },
    {
        area: 'GO, DF, TO, TM (Triângulo Mineiro)',
        razaoSocial: 'Fabricadora de Espumas e Colchões Centro Oeste',
        cnpj: '17.288.387/0001-26',
        cidade: 'Goiânia',
        uf: 'GO',
        endereco: 'Rua do Ferro, 158 – Parque Oeste Industrial – Goiânia – GO – CEP:74375-120',
        telefone: '08002855011',
        email: 'sac@ortobom.com.br',
    },
    {
        area: 'MT, MS, AC, RO',
        razaoSocial: 'Ind. Com. de Espumas e Colchões Cuiabá',
        cnpj: '02.292.655/0001-06',
        cidade: 'Várzea Grande',
        uf: 'MT',
        endereco: 'Avenida 31 de Março, 3000 – Unipark – Várzea Grande – MT – CEP:78120-000',
        telefone: '08002855011',
        email: 'sac@ortobom.com.br',
    },
    {
        area: 'BA, SE',
        razaoSocial: 'Ind. Bahia de Colchões e Espumas LTDA',
        cnpj: '02.748.342/0001-10',
        cidade: 'Simões Filho',
        uf: 'BA',
        endereco: 'Via Urbana, 1141 – Cia Sul – Simões Filho – BA – CEP:43700-000',
        telefone: '08002855011',
        email: 'sac@ortobom.com.br',
    },
    {
        area: 'PE, AL, PB',
        razaoSocial: 'Olinda Ind. Comércio de Colchões LTDA',
        cnpj: '02.748.323/0001-93',
        cidade: 'Olinda',
        uf: 'PE',
        endereco: 'Rua Napoleão Cordeiro de Lima, S/N – Peixinhos – Olinda – PE – CEP:53300-250',
        telefone: '08002855011',
        email: 'sac@ortobom.com.br',
    },
    {
        area: 'CE, RN, PI',
        razaoSocial: 'Ind. Cearense de Colchões e Espumas LTDA',
        cnpj: '02.748.357/0001-88',
        cidade: 'Maracanaú',
        uf: 'CE',
        endereco: 'Av. Maria Hosana Matos Lima, 100 – Distrito Industrial 1 – Maracanaú – CE – CEP:61939-130',
        telefone: '08002855011',
        email: 'sac@ortobom.com.br',
    },
    {
        area: 'PA, AP, MA',
        razaoSocial: 'Ind. Comércios de Espumas e Colchões Belém LTDA',
        cnpj: '02.292.657/0001-03',
        cidade: 'Marituba',
        uf: 'PA',
        endereco: 'Rodovia BR 316 KM 10, S/N – Anexo Térreo – São João – Marituba – PA – CEP:67200-000',
        telefone: '08002855011',
        email: 'sac@ortobom.com.br',
    },
    {
        area: 'RS, SC',
        razaoSocial: 'Centro de Produção Rio Grandense de Espumas',
        cnpj: '03.636.724/0001-14',
        cidade: 'Campo Bom',
        uf: 'RS',
        endereco: 'Avenida Carlos Strassburger Filho, 5230 – Zona Industrial – Campo Bom – RS – CEP:93700-000',
        telefone: '08002855011',
        email: 'sac@ortobom.com.br',
    },
    {
        area: 'AM, RR',
        razaoSocial: 'Amazonas Indústria e Comércio de Colchões e Espumas LTDA',
        cnpj: '19.870.987/0001-23',
        cidade: 'Manaus',
        uf: 'AM',
        endereco: 'Avenida Cupiúba, 101 – Distrito Industrial – Manaus – Amazonas – CEP:69075-060',
        telefone: '08002855011',
        email: 'sac@ortobom.com.br',
    },
]

const HEADERS = [
    { key: 'area', label: 'Área de entrega' },
    { key: 'razaoSocial', label: 'Razão Social' },
    { key: 'cnpj', label: 'CNPJ' },
    { key: 'cidade', label: 'Cidade' },
    { key: 'uf', label: 'UF' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'telefone', label: 'Telefone SAC' },
    { key: 'email', label: 'E-mail do SAC' },
] as const

export function FactoriesAccordion() {
    const [open, setOpen] = useState(false)

    return (
        <div className="max-w-[1200px] mx-auto px-6 mt-8 mb-2">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                className="w-full flex items-center justify-center gap-2 text-white text-[14px] font-semibold py-3 hover:opacity-90 transition-opacity"
            >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-white/70 text-white">
                    {open ? <Minus size={12} /> : <Plus size={12} />}
                </span>
                Ver fábricas e regiões atendidas
            </button>

            {open && (
                <div className="overflow-x-auto pt-3 pb-4">
                    <table className="w-full text-[12px] text-white/80">
                        <thead>
                            <tr className="text-white text-[12px] font-semibold">
                                {HEADERS.map(h => (
                                    <th
                                        key={h.key}
                                        scope="col"
                                        className="text-left align-bottom px-3 py-2 font-semibold whitespace-nowrap"
                                    >
                                        {h.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {FACTORIES.map((f, idx) => (
                                <tr key={idx} className="align-top">
                                    <td className="px-3 py-2 whitespace-nowrap">{f.area}</td>
                                    <td className="px-3 py-2">{f.razaoSocial}</td>
                                    <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                                        {f.cnpj}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">{f.cidade}</td>
                                    <td className="px-3 py-2">{f.uf}</td>
                                    <td className="px-3 py-2 min-w-[280px]">{f.endereco}</td>
                                    <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                                        <a
                                            href={`tel:${f.telefone}`}
                                            className="hover:text-white"
                                        >
                                            {f.telefone}
                                        </a>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <a
                                            href={`mailto:${f.email}`}
                                            className="hover:text-white"
                                        >
                                            {f.email}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
