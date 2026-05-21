import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ortobom.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ]

    // Category pages
    const { data: categories } = await supabase.from('categories').select('slug')
    const categoryPages: MetadataRoute.Sitemap = (categories || []).map(cat => ({
        url: `${BASE_URL}/c/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // Product pages
    const { data: products } = await supabase.from('products').select('slug, created_at').eq('is_active', true)
    const productPages: MetadataRoute.Sitemap = (products || []).map(product => ({
        url: `${BASE_URL}/p/${product.slug}`,
        lastModified: new Date(product.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    return [...staticPages, ...categoryPages, ...productPages]
}
