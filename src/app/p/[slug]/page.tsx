import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { ProductGallery } from '@/components/ui/ProductGallery'
import { ClientProductDetails } from './ClientProductDetails'

// Server Component Fetch Logic
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: product } = await supabase.from('products').select('name, featured_image, description').eq('slug', slug).single()
  if (!product) return { title: 'Produto não encontrado' }
  return {
    title: product.name,
    description: product.description?.substring(0, 160) || `Compre ${product.name} com as melhores condições na Ortobom.`,
    openGraph: {
      title: product.name,
      description: `Compre ${product.name} pelo WhatsApp com entrega rápida.`,
      images: product.featured_image ? [product.featured_image] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    // Fetch Product with Variants
    const { data: product, error } = await supabase
        .from('products')
        .select(`
        *,
        variants (*)
    `)
        .eq('slug', slug)
        .single()

    if (error || !product) {
        console.error('Produto não encontrado:', error?.message)
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb would go here */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Left: Gallery */}
                <div>
                    <ProductGallery
                        images={product.featured_image ? [product.featured_image] : []} // In V1 scraper only gets 1 image, future will have table
                        productName={product.name}
                    />
                </div>

                {/* Right: Details & Purchase */}
                <div>
                    {/* Client Component for Interactive Logic (Variant Selection) */}
                    <ClientProductDetails product={product} />
                </div>
            </div>

            {/* Tech Specs / Description */}
            <div className="mt-16 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold text-[#1B2B4E] mb-6">Descrição do Produto</h2>
                <div
                    className="prose prose-blue max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: product.description || '<p>Sem descrição disponível.</p>' }}
                />
            </div>
        </div>
    )
}
