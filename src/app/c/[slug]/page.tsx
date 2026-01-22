import { createClient } from '@supabase/supabase-js'
import { ProductCard } from '@/components/ui/ProductCard'
import { FilterSidebar } from '@/components/ui/FilterSidebar'
import { notFound } from 'next/navigation'

// Initialize Supabase Client (Server Component Safe)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Generate static params if we wanted specific build paths, but dynamic is fine for now
// export async function generateStaticParams() { ... }

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

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

    // 2. Fetch Products for Category
    const { data: rawProducts, error: prodError } = await supabase
        .from('products')
        .select(`
            *,
            variants (
                price,
                compare_at_price,
                size
            )
        `)
        .eq('category_id', category.id)
        .order('created_at', { ascending: false })

    if (prodError) {
        console.error('Error fetching products:', prodError)
    }

    // Transform data to flat structure expected by ProductCard
    const products = rawProducts?.map(p => {
        // Get lowest price variant or default
        // Typescript might complain about variants being array, need casting or check
        const variants = p.variants as any[] || []
        const mainVariant = variants[0] || { price: 0 } // simpler logic for now

        return {
            ...p,
            price: mainVariant.price
        }
    }) || []

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb (Simplified) */}
            <div className="text-sm text-gray-500 mb-8">
                Home / {category.name}
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <FilterSidebar activeCategorySlug={slug} />

                {/* Main Content */}
                <div className="flex-1">
                    <header className="mb-6 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-[#1B2B4E]">{category.name}</h1>
                        <span className="text-sm text-gray-500">{products.length} produtos encontrados</span>
                    </header>

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
