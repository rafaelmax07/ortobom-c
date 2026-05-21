import { supabase } from '@/lib/supabase'
import { HeroSlider } from '@/components/ui/HeroSlider'
import { BenefitsBar } from '@/components/ui/BenefitsBar'
import { CategoryGrid } from '@/components/ui/CategoryGrid'
import { HeroOffersGrid } from '@/components/ui/HeroOffersGrid'
import { ComfortSection } from '@/components/ui/ComfortSection'
import { NewsletterSection } from '@/components/ui/NewsletterSection'
import { Section } from '@/components/ui/Section'
import { ProductGrid } from '@/components/ui/ProductGrid'

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
                size,
                dimensions
            ),
            product_images (
                url,
                position
            ),
            categories:category_id (slug, name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    const formattedProducts = (rawProducts || []).map(p => {
        const variants = (p.variants as { price: number; compare_at_price: number | null; size: string; dimensions: string | null }[]) || []
        const cheapest = variants.reduce(
            (min, v) => (v.price < min.price ? v : min),
            variants[0] || { price: 0, compare_at_price: null, size: '', dimensions: '' }
        )
        const cat = p.categories as { slug: string; name: string } | null
        const productImages = ((p.product_images as { url: string; position: number }[]) || [])
            .sort((a, b) => a.position - b.position)
            .map(i => i.url)
        const variantLabel = cheapest.dimensions
            ? `${cheapest.size} (${cheapest.dimensions})`
            : cheapest.size
        return {
            ...p,
            price: cheapest.price,
            compare_at_price: cheapest.compare_at_price || null,
            category_slug: cat?.slug || '',
            images: productImages,
            variant_label: variantLabel,
        }
    })

    // Ofertas (with discount) — colchões e bases primeiro, acessórios e travesseiros no final
    const offerPriority: Record<string, number> = {
        colchoes: 0,
        camas: 1,
        travesseiros: 2,
        acessorios: 3,
    }
    const offers = formattedProducts
        .filter(p => p.compare_at_price && p.compare_at_price > p.price)
        .sort((a, b) => {
            const pa = offerPriority[a.category_slug] ?? 99
            const pb = offerPriority[b.category_slug] ?? 99
            return pa - pb
        })
        .slice(0, 12)

    // By category
    const colchoes = formattedProducts.filter(p => p.category_slug === 'colchoes').slice(0, 4)
    const bases = formattedProducts.filter(p => p.category_slug === 'camas').slice(0, 4)
    const travesseiros = formattedProducts.filter(p => p.category_slug === 'travesseiros').slice(0, 4)
    const acessorios = formattedProducts.filter(p => p.category_slug === 'acessorios').slice(0, 4)

    return (
        <main className="min-h-screen bg-bg-page">
            <HeroSlider banners={banners || []} />
            <BenefitsBar />
            <HeroOffersGrid products={offers} />
            <CategoryGrid />

            {colchoes.length > 0 && (
                <Section
                    title="Seu conforto ideal começa aqui"
                    seeMoreHref="/c/colchoes"
                    divider="top"
                >
                    <ProductGrid products={colchoes} />
                </Section>
            )}

            <ComfortSection />

            {bases.length > 0 && (
                <Section
                    title="Já conhece nossas bases?"
                    seeMoreHref="/c/camas"
                    seeMoreLabel="Ver todas as bases"
                    divider="top"
                >
                    <ProductGrid products={bases} />
                </Section>
            )}

            {travesseiros.length > 0 && (
                <Section
                    title="Travesseiros em destaque"
                    seeMoreHref="/c/travesseiros"
                    seeMoreLabel="Ver todos os travesseiros"
                    divider="top"
                >
                    <ProductGrid products={travesseiros} />
                </Section>
            )}

            {acessorios.length > 0 && (
                <Section
                    title="Acessórios"
                    seeMoreHref="/c/acessorios"
                    seeMoreLabel="Ver todos os acessórios"
                    divider="top"
                >
                    <ProductGrid products={acessorios} />
                </Section>
            )}

            <NewsletterSection />
        </main>
    )
}
