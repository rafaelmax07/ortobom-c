import { supabase } from '@/lib/supabase'
import { HeroSlider } from '@/components/ui/HeroSlider'
import { BenefitsBar } from '@/components/ui/BenefitsBar'
import { CategoryGrid } from '@/components/ui/CategoryGrid'
import { HeroOffersGrid } from '@/components/ui/HeroOffersGrid'
import { ComfortSection } from '@/components/ui/ComfortSection'
import { NewsletterSection } from '@/components/ui/NewsletterSection'
import { CategoryTabsSection } from '@/components/ui/CategoryTabsSection'
import { AwardsCarousel } from '@/components/ui/AwardsCarousel'

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

    const formattedProducts = (rawProducts || [])
        .map(p => {
            const variants = (p.variants as { price: number; compare_at_price: number | null; size: string; dimensions: string | null }[]) || []
            const validVariants = variants.filter(v => typeof v.price === 'number' && v.price > 0)
            if (validVariants.length === 0) return null
            const cheapest = validVariants.reduce(
                (min, v) => (v.price < min.price ? v : min),
                validVariants[0]
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
        .filter((p): p is NonNullable<typeof p> => p !== null)

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

    // Produtos por categoria para a seção de tabs (carrossel à direita)
    const tabsCategorySlugs = ['colchoes', 'camas', 'cabeceiras', 'travesseiros', 'moveis']
    const tabsProducts = formattedProducts.filter(p =>
        tabsCategorySlugs.includes(p.category_slug)
    )

    return (
        <main className="min-h-screen bg-bg-page">
            <HeroSlider banners={banners || []} />
            <BenefitsBar />
            <HeroOffersGrid products={offers} />
            <CategoryGrid />

            <CategoryTabsSection products={tabsProducts} />

            <ComfortSection />

            <AwardsCarousel />

            <NewsletterSection />
        </main>
    )
}
