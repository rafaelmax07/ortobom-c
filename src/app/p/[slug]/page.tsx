import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductGallery } from '@/components/ui/ProductGallery'
import { ClientProductDetails } from './ClientProductDetails'
import { ProductCard } from '@/components/ui/ProductCard'
import { Container } from '@/components/layout/Container'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const { data: product } = await supabase.from('products').select('name, featured_image, description').eq('slug', slug).single()
    if (!product) return { title: 'Produto não encontrado' }
    return {
        title: product.name,
        description: product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `Compre ${product.name} com as melhores condições.`,
        openGraph: {
            title: product.name,
            description: `Compre ${product.name} com entrega rápida e parcele em até 6x sem juros.`,
            images: product.featured_image ? [product.featured_image] : [],
        },
    }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            variants (*),
            categories:category_id (name, slug),
            product_images (url, alt, position)
        `)
        .eq('slug', slug)
        .single()

    if (error || !product) {
        notFound()
    }

    const category = product.categories as any

    // Fetch related products: "Produtos que combinam"
    let relatedProducts: any[] = []
    if (product.category_id) {
        const { data: relatedRaw } = await supabase
            .from('products')
            .select('*, variants (price, compare_at_price)')
            .eq('category_id', product.category_id)
            .eq('is_active', true)
            .neq('id', product.id)
            .limit(4)

        relatedProducts = (relatedRaw || []).map(p => {
            const variants = (p.variants as any[]) || []
            const cheapest = variants.reduce(
                (min, v) => (v.price < min.price ? v : min),
                variants[0] || { price: 0, compare_at_price: null }
            )
            return { ...p, price: cheapest.price, compare_at_price: cheapest.compare_at_price }
        })
    }

    // Fetch bases (cross-sell)
    const { data: basesRaw } = await supabase
        .from('products')
        .select('*, variants (price, compare_at_price), categories:category_id (slug)')
        .eq('is_active', true)
        .limit(4)
        .order('created_at', { ascending: false })

    const bases = (basesRaw || [])
        .filter((p: any) => (p.categories as any)?.slug === 'camas')
        .slice(0, 4)
        .map(p => {
            const variants = (p.variants as any[]) || []
            const cheapest = variants.reduce(
                (min, v) => (v.price < min.price ? v : min),
                variants[0] || { price: 0, compare_at_price: null }
            )
            return { ...p, price: cheapest.price, compare_at_price: cheapest.compare_at_price }
        })

    // Calculate discount
    const variants = (product.variants as any[]) || []
    const cheapest = variants[0] || { price: 0, compare_at_price: null }
    const discountPct = cheapest.compare_at_price && cheapest.compare_at_price > cheapest.price
        ? Math.round((1 - cheapest.price / cheapest.compare_at_price) * 100)
        : 0

    // Build images array from product_images table or fallback to featured_image
    const productImages = (product.product_images as any[]) || []
    const sortedImages = productImages
        .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
        .map((img: any) => img.url)

    const galleryImages = sortedImages.length > 0
        ? sortedImages
        : product.featured_image ? [product.featured_image] : []

    // Breadcrumb items: Home › Category › Product (when category is available)
    const breadcrumbItems = category?.name && category?.slug
        ? [
            { label: 'Home', href: '/' },
            { label: category.name, href: `/c/${category.slug}` },
            { label: product.name },
        ]
        : [
            { label: 'Home', href: '/' },
            { label: product.name },
        ]

    return (
        <main className="min-h-screen bg-bg-page pb-24 md:pb-0">
            {/* Product Section */}
            <section className="py-6 md:py-10">
                <Container>
                    <div className="mb-6">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left: Gallery */}
                        <div className="relative">
                            <ProductGallery
                                images={galleryImages}
                                productName={product.name}
                                discountPercent={discountPct}
                            />
                        </div>

                        {/* Right: Details */}
                        <div>
                            <ClientProductDetails product={product} />
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── "Conheça" Description Section (like official) ────────────── */}
            <section className="py-12 border-t border-bg-light">
                <Container>
                    <h2 className="text-xl md:text-2xl font-bold text-primary text-center italic mb-8">
                        Conheça {product.name}
                    </h2>

                    <div
                        className="prose prose-sm sm:prose max-w-4xl mx-auto text-text-muted leading-relaxed
                            [&_img]:rounded-lg [&_img]:mx-auto [&_img]:my-6 [&_img]:max-w-full
                            [&_p]:mb-4 [&_h3]:text-primary [&_h3]:font-bold [&_section]:my-6"
                        dangerouslySetInnerHTML={{
                            __html:
                                product.description_html ||
                                product.description ||
                                '<p>Descrição em breve.</p>',
                        }}
                    />
                </Container>
            </section>

            {/* ── Specs / Garantia / Tecnologias Accordions ──────────────── */}
            <section className="border-t border-bg-light">
                <Container>
                    <div className="py-8 space-y-4 max-w-4xl mx-auto" id="garantia">
                        {/* Especificação completa */}
                        <details className="group border border-bg-light rounded-[var(--radius-card)] overflow-hidden">
                            <summary className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-bg-light transition-colors">
                                <h3 className="font-bold text-primary text-base">Especificação completa</h3>
                                <span className="text-text-muted text-xl font-light group-open:hidden">+</span>
                                <span className="text-text-muted text-xl font-light hidden group-open:inline">×</span>
                            </summary>
                            <div className="px-5 pb-5 border-t border-bg-light">
                                <table className="w-full text-sm mt-4">
                                    <tbody className="divide-y divide-bg-light">
                                        {[
                                            { label: 'Tamanho', value: variants[0]?.size || '—' },
                                            { label: 'Medidas', value: variants[0]?.dimensions || '—' },
                                            { label: 'SKU', value: variants[0]?.sku || '—' },
                                        ].map((spec, i) => (
                                            <tr key={i}>
                                                <td className="py-2.5 font-semibold text-text-main w-40">{spec.label}</td>
                                                <td className="py-2.5 text-text-muted">{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </details>

                        {/* Garantia */}
                        <details className="group border border-bg-light rounded-[var(--radius-card)] overflow-hidden">
                            <summary className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-bg-light transition-colors">
                                <h3 className="font-bold text-primary text-base">Garantia</h3>
                                <span className="text-text-muted text-xl font-light group-open:hidden">+</span>
                                <span className="text-text-muted text-xl font-light hidden group-open:inline">×</span>
                            </summary>
                            <div className="px-5 pb-5 border-t border-bg-light">
                                <table className="w-full text-sm mt-4">
                                    <tbody className="divide-y divide-bg-light">
                                        <tr>
                                            <td className="py-2.5 font-semibold text-text-main w-44">Garantia Ortobom:</td>
                                            <td className="py-2.5 text-text-muted">90 dias</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2.5 font-semibold text-text-main">Garantia de Molas:</td>
                                            <td className="py-2.5 text-text-muted">5 anos</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2.5 font-semibold text-text-main">Garantia da Espuma:</td>
                                            <td className="py-2.5 text-text-muted">3 anos</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p className="text-xs text-text-muted mt-3">
                                    * Confira as garantias dos produtos <a href="#" className="text-primary underline">aqui</a>.
                                </p>
                            </div>
                        </details>

                        {/* Tecnologias */}
                        <details className="group border border-bg-light rounded-[var(--radius-card)] overflow-hidden">
                            <summary className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-bg-light transition-colors">
                                <h3 className="font-bold text-primary text-base">Tecnologias</h3>
                                <span className="text-text-muted text-xl font-light group-open:hidden">+</span>
                                <span className="text-text-muted text-xl font-light hidden group-open:inline">×</span>
                            </summary>
                            <div className="px-5 pb-5 border-t border-bg-light text-sm text-text-muted mt-4">
                                <p className="font-bold text-primary mb-1">No Turn</p>
                                <p>A tecnologia No Turn permite que o colchão não precise ser virado, necessitando apenas a inversão da posição dos pés com a cabeça. Ideal para quem gosta de conforto e comodidade.</p>
                            </div>
                        </details>
                    </div>
                </Container>
            </section>

            {/* ── Related Products: "Produtos que combinam com..." ────────── */}
            {relatedProducts.length > 0 && (
                <section className="py-10 border-t border-bg-light">
                    <Container>
                        <h2 className="text-lg md:text-xl font-bold text-primary mb-6">
                            Produtos que combinam com {product.name}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {/* ── Bases Section ────────────────────────────────────────── */}
            {bases.length > 0 && (
                <section className="py-10 border-t border-bg-light">
                    <Container>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-primary">
                                Já conhece nossas bases?
                            </h2>
                            <Link href="/c/camas" className="text-sm text-primary hover:underline font-medium">
                                Ver todas as bases →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                            {bases.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </Container>
                </section>
            )}
        </main>
    )
}
