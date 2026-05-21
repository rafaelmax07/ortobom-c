/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Ortobom Scraper — V2
 *
 * Estratégia: cada tamanho é uma URL/produto separado no site oficial. A PLP
 * de cada categoria/tamanho lista cards com data-attributes ricos:
 *   data-produto-nome      (ex: "Colchão Pró Saúde Nanolastic")
 *   data-produto-variant   (ex: "Casal (25 x 188 x 138)")
 *   data-produto-preco     (ex: "1499.00")
 *   data-produto-id, data-produto-url
 *
 * Algoritmo:
 *   1. Visita PLPs filtradas por tamanho (`/cat/colchao/solteiro/`, etc.)
 *   2. Extrai todos os cards e seus data-attributes
 *   3. Agrupa por `data-produto-nome` → cada nome único vira UM produto no DB
 *      e cada `data-produto-variant` distinto vira uma `variant`
 *   4. Para cada produto, visita uma PDP só pra puxar imagens e descrição
 */

const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const slugify = require('slugify')

const BASE_URL = 'https://www.ortobom.com.br'
const OUTPUT_FILE = path.join(__dirname, 'seed-products.json')
const DELAY_MS = 1000

// Lista de PLPs a visitar por categoria. Cada categoria pode ter múltiplas
// "rotas de tamanho" no site oficial. Para Acessórios/Móveis/Travesseiros não
// existe segmentação de tamanho, então usamos só a raiz.
const CATEGORIES = [
    {
        slug: 'colchoes',
        urlPaths: [
            '/cat/colchao/solteiro/',
            '/cat/colchao/solteiro-extra/',
            '/cat/colchao/casal/',
            '/cat/colchao/queen/',
            '/cat/colchao/king/',
            '/cat/colchao/infantil/',
        ],
    },
    {
        slug: 'camas',
        urlPaths: [
            '/cat/base/solteiro/',
            '/cat/base/solteiro-extra/',
            '/cat/base/casal/',
            '/cat/base/queen/',
            '/cat/base/king/',
        ],
    },
    {
        slug: 'cabeceiras',
        urlPaths: [
            '/cat/cabeceira/solteiro/',
            '/cat/cabeceira/solteiro-extra/',
            '/cat/cabeceira/casal/',
            '/cat/cabeceira/queen/',
            '/cat/cabeceira/king/',
        ],
    },
    { slug: 'travesseiros', urlPaths: ['/travesseiros'] },
    { slug: 'acessorios', urlPaths: ['/acessorios'] },
    { slug: 'moveis', urlPaths: ['/moveis'] },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function makeSlug(name) {
    return slugify(name, { lower: true, strict: true, locale: 'pt' })
}

function cleanImageUrl(url) {
    if (!url) return ''
    return url.split('?')[0]
}

// ────────────────────────────────────────────────────────────────────
// PLP: extrai todos os cards (com tamanho) de uma URL
// ────────────────────────────────────────────────────────────────────
async function scrapePLP(page, plpUrl, categorySlug) {
    const url = `${BASE_URL}${plpUrl}`
    console.log(`\n📂 PLP: ${url}`)

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
        await sleep(1500)

        // Auto-scroll para forçar lazy-load de cards
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let total = 0
                const distance = 600
                const timer = setInterval(() => {
                    window.scrollBy(0, distance)
                    total += distance
                    if (total >= document.body.scrollHeight - window.innerHeight) {
                        clearInterval(timer)
                        window.scrollTo(0, 0)
                        resolve()
                    }
                }, 200)
            })
        })
        await sleep(800)

        const cards = await page.evaluate(() => {
            const out = []
            document.querySelectorAll('.card.product-card[data-produto-nome]').forEach((card) => {
                const link = card.closest('a') || card.querySelector('a')
                const url = card.getAttribute('data-produto-url') || link?.getAttribute('href') || ''
                const featuredImg = card.querySelector('img.card-img-top')
                const featuredSrc = featuredImg
                    ? (featuredImg.getAttribute('src') || featuredImg.getAttribute('data-src') || '').split('?')[0]
                    : ''

                out.push({
                    productId: card.getAttribute('data-produto-id') || '',
                    name: card.getAttribute('data-produto-nome') || '',
                    variant: card.getAttribute('data-produto-variant') || '',
                    price: parseFloat(card.getAttribute('data-produto-preco') || '0'),
                    pdpPath: url,
                    featuredImage: featuredSrc,
                })
            })
            return out
        })

        console.log(`   Cards encontrados: ${cards.length}`)
        return cards.map((c) => ({ ...c, categorySlug }))
    } catch (e) {
        console.warn(`   ⚠️  Falha em ${url}: ${e.message}`)
        return []
    }
}

// ────────────────────────────────────────────────────────────────────
// PDP: visita 1 vez por PRODUTO para puxar imagens + descrição
// ────────────────────────────────────────────────────────────────────
async function scrapePDP(page, pdpPath) {
    const url = pdpPath.startsWith('http') ? pdpPath : `${BASE_URL}${pdpPath}`
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
        await sleep(800)

        const data = await page.evaluate(() => {
            // Imagens: pega tudo que está em galerias/thumbnails do CDN
            const imageUrls = new Set()

            const imgSelectors = [
                '.splide__slide img',
                '.splide__list img',
                '[class*="thumb"] img',
                '[class*="thumbnail"] img',
                '[class*="gallery"] img',
                '[class*="produto-fotos"] img',
            ]
            imgSelectors.forEach((sel) => {
                document.querySelectorAll(sel).forEach((img) => {
                    const src = (img.dataset.src || img.src || '').split('?')[0]
                    if (src && src.includes('cdn.ortobom.com.br')) imageUrls.add(src)
                })
            })

            // Fallback: qualquer imagem CDN na página
            if (imageUrls.size === 0) {
                document.querySelectorAll('img').forEach((img) => {
                    const src = (img.dataset.src || img.src || '').split('?')[0]
                    if (src && src.includes('cdn.ortobom.com.br')) imageUrls.add(src)
                })
            }

            // Descrição
            const descEl =
                document.querySelector('.product-description') ||
                document.querySelector('[itemprop="description"]') ||
                document.querySelector('[class*="description"]')
            const description = descEl ? descEl.innerText.trim() : ''
            const descriptionHtml = descEl ? descEl.innerHTML.trim() : ''

            // "Preço de" (compare_at_price)
            const compareEl =
                document.querySelector('#precoSugeridoProduto') ||
                document.querySelector('.oldPrice') ||
                document.querySelector('[class*="price-old"]')
            const compareRaw = compareEl?.innerText?.replace(/[^\d,]/g, '').replace(',', '.') || ''
            const compareAtPrice = parseFloat(compareRaw) || 0

            return {
                images: [...imageUrls],
                description,
                descriptionHtml,
                compareAtPrice,
            }
        })

        return data
    } catch (e) {
        console.warn(`   ⚠️  PDP falhou ${url}: ${e.message}`)
        return { images: [], description: '', descriptionHtml: '', compareAtPrice: 0 }
    }
}

// ────────────────────────────────────────────────────────────────────
// Banners da home
// ────────────────────────────────────────────────────────────────────
async function scrapeBanners(page) {
    console.log('\n🖼️  Scraping banners da home...')
    try {
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 })
        await sleep(2000)

        const banners = await page.evaluate(() => {
            const found = []
            document.querySelectorAll('.splide__slide, .carousel-item').forEach((slide, i) => {
                const img = slide.querySelector('img')
                const link = slide.querySelector('a')
                if (!img) return

                const src = (img.dataset.src || img.src || '').split('?')[0]
                if (!src || src.includes('loading') || !src.includes('cdn.')) return

                let mobileSrc = ''
                slide.querySelectorAll('picture source').forEach((s) => {
                    if (s.media && s.media.includes('max-width')) {
                        mobileSrc = (s.srcset || '').split('?')[0]
                    }
                })

                found.push({
                    title: img.alt || `Banner ${i + 1}`,
                    image_desktop_url: src,
                    image_mobile_url: mobileSrc || src,
                    link: link?.href || '#',
                    position: i,
                })
            })
            return found
        })
        console.log(`   Banners: ${banners.length}`)
        return banners
    } catch (e) {
        console.warn(`   ⚠️  Banners falhou: ${e.message}`)
        return []
    }
}

// ────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────
async function scrape() {
    console.log('🚀 Ortobom Scraper V2\n')
    console.log(`   Categorias: ${CATEGORIES.map((c) => c.slug).join(', ')}\n`)

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        defaultViewport: { width: 1440, height: 900 },
    })

    const page = await browser.newPage()
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    const banners = await scrapeBanners(page)

    // Fase 1: agregação de cards de todas as PLPs
    // Estrutura: Map<nome do produto, { name, categorySlug, variants[], pdpPath, featuredImage }>
    const productMap = new Map()

    for (const cat of CATEGORIES) {
        console.log(`\n═══ ${cat.slug.toUpperCase()} ═══`)
        for (const plpPath of cat.urlPaths) {
            const cards = await scrapePLP(page, plpPath, cat.slug)
            for (const card of cards) {
                if (!card.name) continue

                let entry = productMap.get(card.name.trim())
                if (!entry) {
                    entry = {
                        name: card.name.trim(),
                        categorySlug: cat.slug,
                        variants: [],
                        pdpPath: card.pdpPath,
                        featuredImage: card.featuredImage,
                    }
                    productMap.set(card.name.trim(), entry)
                }

                // Adiciona variante (deduplicada por size+price)
                const variantKey = `${card.variant}__${card.price}`
                const exists = entry.variants.some((v) => `${v.rawVariant}__${v.price}` === variantKey)
                if (!exists && card.variant && card.price > 0) {
                    // Parse "Casal (25 x 188 x 138)" → size: "Casal", dimensions: "25 x 188 x 138"
                    const m = card.variant.match(/^(.*?)\s*\((.*?)\)\s*$/)
                    const size = m ? m[1].trim() : card.variant.trim()
                    const dimensions = m ? m[2].trim() : ''
                    entry.variants.push({
                        rawVariant: card.variant,
                        size,
                        dimensions,
                        price: card.price,
                        productId: card.productId,
                        pdpPath: card.pdpPath,
                    })
                }

                // Mantém o primeiro pdpPath/featuredImage encontrado
                if (!entry.pdpPath && card.pdpPath) entry.pdpPath = card.pdpPath
                if (!entry.featuredImage && card.featuredImage) entry.featuredImage = card.featuredImage
            }
            await sleep(DELAY_MS)
        }
    }

    console.log(`\n📦 Produtos únicos coletados: ${productMap.size}\n`)

    // Fase 2: para cada produto, visita uma PDP pra puxar imagens + descrição
    const products = []
    let i = 0
    for (const [, entry] of productMap) {
        i++
        console.log(`[${i}/${productMap.size}] ${entry.name} (${entry.variants.length} variants)`)

        // Pula produtos sem variantes válidas
        if (entry.variants.length === 0) continue

        const pdp = await scrapePDP(page, entry.pdpPath)

        // featured_image: usa imagem da PLP se a PDP não retornar
        const featuredImage = pdp.images[0] || cleanImageUrl(entry.featuredImage)
        const allImages = pdp.images.length > 0 ? pdp.images : [featuredImage].filter(Boolean)

        // Aplicar compare_at_price em cada variant (heurística: mesmo % de desconto na PDP base)
        const variantsWithCompare = entry.variants.map((v) => {
            // Se a PDP retornou compareAtPrice E é maior que o preço da variante atual, aplica
            const compare = pdp.compareAtPrice > v.price ? pdp.compareAtPrice : null
            return {
                size: v.size,
                price: v.price,
                compare_at_price: compare,
                dimensions: v.dimensions,
                sku: `${makeSlug(entry.name)}-${makeSlug(v.size)}`.slice(0, 60),
            }
        })

        products.push({
            name: entry.name,
            slug: makeSlug(entry.name),
            description: pdp.description,
            description_html: pdp.descriptionHtml,
            featured_image: featuredImage,
            images: allImages,
            variants: variantsWithCompare,
            compare_at_price_base: pdp.compareAtPrice,
            category_slug: entry.categorySlug,
            original_url: `${BASE_URL}${entry.pdpPath}`,
        })

        await sleep(DELAY_MS)
    }

    await browser.close()

    const output = { products, banners }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2))

    console.log(`\n✅ Concluído.`)
    console.log(`   Produtos: ${products.length}`)
    console.log(`   Variantes totais: ${products.reduce((acc, p) => acc + p.variants.length, 0)}`)
    console.log(`   Banners:  ${banners.length}`)
    console.log(`   Output:   ${OUTPUT_FILE}`)
}

scrape().catch((e) => {
    console.error('Fatal:', e)
    process.exit(1)
})
