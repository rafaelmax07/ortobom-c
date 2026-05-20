import { createClient } from '@supabase/supabase-js'
import { ProductCard } from '@/components/ui/ProductCard'
import { FilterSidebar } from '@/components/ui/FilterSidebar'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Initialize Supabase Client (Server Component Safe)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const { data: category } = await supabase.from('categories').select('name').eq('slug', slug).single()
    if (!category) return { title: 'Categoria não encontrada' }
    return {
        title: category.name,
        description: `Confira os melhores produtos de ${category.name} na Ortobom. Compre pelo WhatsApp.`,
    }
}

export default async function CategoryPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ minPrice?: string; maxPrice?: string; sizes?: string }>
}) {
    const { slug } = await params
    const { minPrice, maxPrice, sizes } = await searchParams

    // 1. Fetch Category ID
    const { data: category, error: catError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('slug', slug)
        .single()

    if (catError || !category) {
        console.error('Category not found:', slug)
        notFound()
    }

    // 2. Build query — fetch products with their variants
    let query = supabase
        .from('products')
        .select(`
            *,
            variants (
                id,
                price,
                compare_at_price,
                size
            )
        `)
        .eq('category_id', category.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    const { data: rawProducts, error: prodError } = await query

    if (prodError) {
        console.error('Error fetching products:', prodError)
    }

    // 3. Parse filter params
    const minPriceNum = minPrice ? parseFloat(minPrice) : null
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : null
    const sizeFilters = sizes ? sizes.split(',').map(s => s.trim()) : []

    // 4. Transform and filter products
    const products = (rawProducts || [])
        .map(p => {
            const variants = (p.variants as any[]) || []
            // Apply size filter at variant level
            const filteredVariants = sizeFilters.length > 0
                ? variants.filter(v => sizeFilters.includes(v.size))
                : variants

            if (filteredVariants.length === 0 && sizeFilters.length > 0) return null

            // Find lowest price variant from filtered set
            const cheapest = filteredVariants.reduce(
                (min, v) => (v.price < min.price ? v : min),
                filteredVariants[0] || { price: 0, compare_at_price: null }
            )

            return {
                ...p,
                price: cheapest.price,
                compare_at_price: cheapest.compare_at_price || null,
            }
        })
        .filter((p): p is NonNullable<typeof p> => {
            if (p === null) return false
            // Apply price range filter
            if (minPriceNum !== null && p.price < minPriceNum) return false
            if (maxPriceNum !== null && p.price > maxPriceNum) return false
            return true
        })

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-8">
                <a href="/" className="hover:text-blue-600">Home</a> / {category.name}
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <FilterSidebar
                    activeCategorySlug={slug}
                    currentMinPrice={minPrice || ''}
                    currentMaxPrice={maxPrice || ''}
                    currentSizes={sizeFilters}
                />

                {/* Main Content */}
                <div className="flex-1">
                    <header className="mb-6 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-[#1B2B4E]">{category.name}</h1>
                        <span className="text-sm text-gray-500">{products.length} produtos encontrados</span>
                    </header>

                    {/* Active Filters */}
                    {(minPriceNum || maxPriceNum || sizeFilters.length > 0) && (
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <span className="text-xs text-gray-500">Filtros ativos:</span>
                            {minPriceNum && (
                                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                                    Min: R$ {minPriceNum}
                                </span>
                            )}
                            {maxPriceNum && (
                                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                                    Max: R$ {maxPriceNum}
                                </span>
                            )}
                            {sizeFilters.map(s => (
                                <span key={s} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                                    {s}
                                </span>
                            ))}
                            <a
                                href={`/c/${slug}`}
                                className="text-xs text-red-600 hover:text-red-800 underline ml-2"
                            >
                                Limpar filtros
                            </a>
                        </div>
                    )}

                    {/* Product Grid */}
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-lg text-gray-600 mb-2">Nenhum produto encontrado nesta categoria.</p>
                            <p className="text-sm text-gray-400">Tente ajustar os filtros ou volte mais tarde.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
