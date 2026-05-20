import { createClient } from '@supabase/supabase-js'
import { ProductCard } from '@/components/ui/ProductCard'
import Link from 'next/link'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const metadata: Metadata = {
    title: 'Buscar Produtos',
    description: 'Busque colchões, camas e travesseiros na Ortobom.',
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams
    const query = q?.trim() || ''

    let products: any[] = []

    if (query.length > 0) {
        const { data: rawProducts, error } = await supabase
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

        if (error) {
            console.error('Search error:', error)
        }

        products = rawProducts?.map(p => {
            const variants = p.variants as any[] || []
            const cheapest = variants.reduce(
                (min, v) => (v.price < min.price ? v : min),
                variants[0] || { price: 0, compare_at_price: null }
            )
            return {
                ...p,
                price: cheapest.price,
                compare_at_price: cheapest.compare_at_price || null,
            }
        }) || []
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-8">
                <Link href="/" className="hover:text-blue-600">Home</Link> / Buscar
            </div>

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#1B2B4E] mb-2">
                    {query ? `Resultados para "${query}"` : 'Buscar Produtos'}
                </h1>
                {query && (
                    <p className="text-sm text-gray-500">
                        {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                    </p>
                )}
            </header>

            {/* Results */}
            {query.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 mb-2">Digite algo para buscar</p>
                    <p className="text-sm text-gray-400">Ex: &quot;Colchão Freedom&quot;, &quot;Travesseiro&quot;, &quot;Base Sommier&quot;</p>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-lg text-gray-600 mb-2">Nenhum produto encontrado para &quot;{query}&quot;</p>
                    <p className="text-sm text-gray-400 mb-6">Tente buscar com outros termos.</p>
                    <Link
                        href="/"
                        className="inline-block bg-[#1B2B4E] text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-blue-900 transition-colors"
                    >
                        Voltar à Home
                    </Link>
                </div>
            )}
        </div>
    )
}
