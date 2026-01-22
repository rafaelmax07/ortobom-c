import Link from 'next/link'
import { BedDouble, Armchair, FileBadge } from 'lucide-react'

const CATEGORIES = [
    {
        id: 'colchoes',
        name: 'Colchões',
        href: '/c/colchoes',
        icon: BedDouble,
        color: 'bg-blue-100 text-blue-600',
        description: 'Espuma, Molas e Ortopédicos',
        image: 'https://placehold.co/400x300/e0f2fe/1e40af?text=Colchões'
    },
    {
        id: 'camas',
        name: 'Camas e Bases',
        href: '/c/camas',
        icon: Armchair, // Close enough to a base/sofa
        color: 'bg-amber-100 text-amber-600',
        description: 'Bases Box, Baús e Cabeceiras',
        image: 'https://placehold.co/400x300/fef3c7/b45309?text=Camas'
    },
    {
        id: 'travesseiros',
        name: 'Travesseiros',
        href: '/c/travesseiros',
        icon: FileBadge, // Placeholder
        color: 'bg-green-100 text-green-600',
        description: 'Viscoelástico, Látex e Pena',
        image: 'https://placehold.co/400x300/dcfce7/166534?text=Travesseiros'
    }
]

export function CategoryGrid() {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                    Nossas Categorias
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.id}
                            href={cat.href}
                            className="group relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            <div className={`aspect-[4/3] p-6 flex flex-col items-center justify-center ${cat.color} bg-opacity-30 group-hover:bg-opacity-50 transition`}>
                                <cat.icon className="w-12 h-12 mb-4 opacity-80" />
                                <h3 className="text-xl font-bold mb-1">{cat.name}</h3>
                                <p className="text-sm text-gray-600 font-medium">{cat.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
