import Link from 'next/link'
import Image from 'next/image'

interface Category {
    slug: string
    name: string
    image: string
}

const CATEGORIES: Category[] = [
    {
        slug: 'colchoes',
        name: 'Colchões',
        // Colchão Ortopédico Premium (foto frontal só do colchão)
        image: 'https://cdn.ortobom.com.br/file/4c4ee978-1fa1-4cba-850f-703968eadcff/605064.9781-1.jpg',
    },
    {
        slug: 'camas',
        name: 'Bases',
        // Base Sommier
        image: 'https://cdn.ortobom.com.br/file/cd1b168a-bc07-4258-a713-a8ef98a5b056/BASE-SOMM--ORTHOPUR-2.4-CASAL--7-.jpg',
    },
    {
        slug: 'cabeceiras',
        name: 'Cabeceiras',
        // Cabeceira Lovely Facto (foto frontal limpa)
        image: 'https://cdn.ortobom.com.br/file/128d95e8-7142-4b66-b2bd-a1c737881555/4070957310_P.jpg',
    },
    {
        slug: 'travesseiros',
        name: 'Travesseiros',
        image: 'https://cdn.ortobom.com.br/file/151a45af-3ec0-453b-887c-59a2aa4e26ac/6050649952_P.png',
    },
    {
        slug: 'acessorios',
        name: 'Acessórios',
        image: 'https://cdn.ortobom.com.br/file/4c4ee978-1fa1-4cba-850f-703968eadcff/605064.9781-1.jpg',
    },
    {
        slug: 'moveis',
        name: 'Móveis',
        image: 'https://cdn.ortobom.com.br/file/79aa3d0f-ca23-4bf4-8efb-b61da47ad189/BASE-SOMMIER-BAU-FASHION-NOBUCK-CREAM-CASAL--5-.jpg',
    },
]

export function CategoryGrid() {
    return (
        <section className="py-10 bg-white">
            <div className="max-w-[1280px] mx-auto px-6">
                <h2 className="text-[26px] md:text-[30px] font-extrabold leading-tight text-text-main mb-8">
                    Encontre o que procura
                </h2>

                <div className="flex flex-wrap justify-between gap-y-6">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/c/${cat.slug}`}
                            className="group flex flex-col items-center gap-3 text-center"
                        >
                            <div
                                className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] rounded-full overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.03]"
                                style={{ backgroundColor: '#EAEEF7' }}
                            >
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    width={180}
                                    height={180}
                                    className="object-contain w-[92%] h-[92%]"
                                    style={{ mixBlendMode: 'multiply' }}
                                    unoptimized
                                />
                            </div>
                            <span className="text-[14px] sm:text-[15px] font-medium text-text-main group-hover:text-primary transition-colors">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
