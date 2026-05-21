import { supabase } from '@/lib/supabase'
import { Container } from '@/components/layout/Container'
import { HeroSlider } from "@/components/ui/HeroSlider"
import { BenefitsBar } from "@/components/ui/BenefitsBar"
import { CategoryGrid } from "@/components/ui/CategoryGrid"
import { ProductCard } from "@/components/ui/ProductCard"
import { HeroOffersGrid } from "@/components/ui/HeroOffersGrid"
import { ComfortSection } from "@/components/ui/ComfortSection"
import { NewsletterSection } from "@/components/ui/NewsletterSection"
import Link from 'next/link'

export const revalidate = 60

export default async function Home() {
    // Fetch banners
    const { data: banners } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true })

    // Fetch all active products with variants
    const { data: rawProducts } = await supabase
        .from('products')
        .select(`
            *,
            variants (
                price,
                compare_at_price,
                size
            ),
            categories:category_id (slug, name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    const formattedProducts = (rawProducts || []).map(p => {
        const variants = (p.variants as any[]) || []
        const cheapest = variants.reduce(
            (min, v) => (v.price < min.price ? v : min),
            variants[0] || { price: 0, compare_at_price: null }
        )
        const cat = p.categories as any
        return {
            ...p,
            price: cheapest.price,
            compare_at_price: cheapest.compare_at_price || null,
            category_slug: cat?.slug || '',
        }
    })

    // Ofertas (with discount)
    const offers = formattedProducts.filter(p => p.compare_at_price && p.compare_at_price > p.price).slice(0, 6)

    // By category
    const colchoes = formattedProducts.filter(p => p.category_slug === 'colchoes').slice(0, 4)
    const bases = formattedProducts.filter(p => p.category_slug === 'camas').slice(0, 4)
    const travesseiros = formattedProducts.filter(p => p.category_slug === 'travesseiros').slice(0, 4)
    const acessorios = formattedProducts.filter(p => p.category_slug === 'acessorios').slice(0, 4)

    return (
        <main className="min-h-screen bg-bg-page">
            {/* Hero Banner Slider (full width) */}
            <HeroSlider banners={banners || []} />

            {/* Benefits Bar (4 items) */}
            <BenefitsBar />

            {/* Hero Offers Grid: countdown left + product cards right */}
            <HeroOffersGrid products={offers} />

            {/* Category Circles */}
            <CategoryGrid />

            {/* ── "Seu conforto ideal começa aqui" ────────────── */}
            {colchoes.length > 0 && (
                <section className="py-8 md:py-12 border-t border-border">
                    <Container>
                        <h2 className="text-xl md:text-2xl font-semibold text-text-main mb-6">
                            Seu conforto ideal começa aqui
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {colchoes.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {/* Comfort banners */}
            <ComfortSection />

            {/* ── Bases ────────────────────────────────────────── */}
            {bases.length > 0 && (
                <section className="py-8 md:py-12 border-t border-border">
                    <Container>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg md:text-xl font-semibold text-text-main">Já conhece nossas bases?</h2>
                            <Link href="/c/camas" className="text-sm text-primary font-medium hover:underline">Ver todas as bases →</Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {bases.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {/* ── Travesseiros ─────────────────────────────────── */}
            {travesseiros.length > 0 && (
                <section className="py-8 md:py-12 border-t border-border">
                    <Container>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg md:text-xl font-semibold text-text-main">Travesseiros em destaque</h2>
                            <Link href="/c/travesseiros" className="text-sm text-primary font-medium hover:underline">Ver todos os travesseiros →</Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {travesseiros.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {/* ── Acessórios ───────────────────────────────────── */}
            {acessorios.length > 0 && (
                <section className="py-8 md:py-12 border-t border-border">
                    <Container>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg md:text-xl font-semibold text-text-main">Acessórios</h2>
                            <Link href="/c/acessorios" className="text-sm text-primary font-medium hover:underline">Ver todos os acessórios →</Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {acessorios.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {/* Newsletter */}
            <NewsletterSection />
        </main>
    )
}
