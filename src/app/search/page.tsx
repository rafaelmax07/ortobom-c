import { createClient } from '@supabase/supabase-js'
import { ProductCard } from '@/components/ui/ProductCard'
import { Search } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
    const { q } = await searchParams
    return {
        title: q ? `Busca: ${q}` : 'Buscar Produtos',
        description: q ? `Resultados da busca por "${q}" na Ortobom` : 'Busque colchões, camas e acessórios Ortobom',
    }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams
    const query = q?.trim() || ''

    let products: any[] = []

    if (query) {
        const { data: rawProducts } = await supabase
            .from('products')
            .select(`
                *,
                variants (
                    price,
                    compare_at_price,
                    size
                )
            `)
            .eq('is_active', true)
            .ilike('name', `%${query}%`)
            .order('created_at', { ascending: false })
            .limit(24)

        products = (rawProducts || []).map(p => {
            const variants = (p.variants as any[]) || []
            const cheapest = variants.reduce(
                (min, v) => (v.price < min.price ? v : min),
                variants[0] || { price: 0, compare_at_price: null }
            )
            return {
                ...p,
                price: cheapest.price,
                compare_at_price: cheapest.compare_at_price || null,
            }
        })
    }

    return (
        <main className="min-h-screen bg-bg-light/30 py-8">
            <div className="container mx-auto px-4">
                {/* Search Header */}
                <div className="mb-8">
                    <div className="text-sm text-text-muted mb-4">
                        <Link href="/" className="hover:text-navy-medium transition-colors">Home</Link>
                        {' / '}
                        <span>Busca</span>
                    </div>

                    {query ? (
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-text-main mb-2">
                                Resultados para &ldquo;{query}&rdquo;
                            </h1>
                            <p className="text-sm text-text-muted">
                                {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Search size={48} className="mx-auto text-border mb-4" />
                            <h1 className="text-2xl font-bold text-text-main mb-2">Buscar Produtos</h1>
                            <p className="text-sm text-text-muted">Use a barra de busca acima para encontrar produtos</p>
                        </div>
                    )}
                </div>

                {/* Results */}
                {query && products.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* No results */}
                {query && products.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-border">
                        <Search size={48} className="mx-auto text-border mb-4" />
                        <h2 className="text-xl font-bold text-text-main mb-2">
                            Nenhum produto encontrado
                        </h2>
                        <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
                            Não encontramos resultados para &ldquo;{query}&rdquo;. Tente buscar com outros termos ou explore nossas categorias.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['Colchões', 'Camas', 'Travesseiros', 'Cabeceiras'].map(cat => (
                                <Link
                                    key={cat}
                                    href={`/c/${cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[õ]/g, 'o')}`}
                                    className="bg-bg-light hover:bg-navy-medium hover:text-white text-text-soft text-sm font-medium px-4 py-2 rounded-full transition-all duration-200"
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
