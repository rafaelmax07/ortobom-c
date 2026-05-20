import { createClient } from '@supabase/supabase-js'
import { HeroSlider } from "@/components/ui/HeroSlider";
import { CategoryGrid } from "@/components/ui/CategoryGrid";
import { ProductCard } from "@/components/ui/ProductCard";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function Home() {
    // Fetch featured products (newest first, limit 6)
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
        .order('created_at', { ascending: false })
        .limit(6)

    const products = (rawProducts || []).map(p => {
        const variants = (p.variants as any[]) || []
        // Get lowest price variant
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

    return (
        <main className="min-h-screen bg-gray-50">
            <HeroSlider />

            <CategoryGrid />

            {/* Featured Products */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                        Produtos em Destaque
                    </h2>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Nenhum produto disponível no momento.</p>
                    )}
                </div>
            </section>
        </main>
    );
}
