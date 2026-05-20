import { supabase } from '@/lib/supabase'
import { HeroSlider } from "@/components/ui/HeroSlider"
import { BenefitsBar } from "@/components/ui/BenefitsBar"
import { CategoryGrid } from "@/components/ui/CategoryGrid"
import { ProductCard } from "@/components/ui/ProductCard"

export const revalidate = 60 // Revalidate home page every 60 seconds

export default async function Home() {
    // 1. Fetch banners from database
    const { data: banners } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true })

    // 2. Fetch active products with variants
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

    // Format products to get their lowest price and compare_at_price
    const formattedProducts = (rawProducts || []).map(p => {
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

    // Filter products for "Ofertas do Dia" (discounted products)
    const offers = formattedProducts.filter(p => p.compare_at_price && p.compare_at_price > p.price).slice(0, 6)

    // Filter products for "Destaques" (all other products, up to 6)
    const featured = formattedProducts.slice(0, 6)

    return (
        <main className="min-h-screen bg-gray-50/50 pb-16">
            {/* Hero Slider Banner */}
            <HeroSlider banners={banners || []} />

            {/* Trust Benefits Bar */}
            <BenefitsBar />

            {/* Category Grid */}
            <CategoryGrid />

            {/* ── Seção: Ofertas do Dia (with discount badges) ───────────────── */}
            {offers.length > 0 && (
                <section className="py-12 bg-white border-t border-b border-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center mb-10">
                            <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                                Tempo Limitado
                            </span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight text-center">
                                Ofertas do Dia
                            </h2>
                            <div className="w-12 h-1 bg-[#F97316] rounded-full mt-3" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {offers.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Seção: Mais Procurados / Destaques ─────────────────────────── */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center mb-10">
                        <span className="bg-blue-50 text-[#1B2B4E] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                            Os Favoritos
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight text-center">
                            Destaques Ortobom
                        </h2>
                        <div className="w-12 h-1 bg-[#1B2B4E] rounded-full mt-3" />
                    </div>

                    {featured.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {featured.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-12">Nenhum produto disponível no momento.</p>
                    )}
                </div>
            </section>
        </main>
    )
}
