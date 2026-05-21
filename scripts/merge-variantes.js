/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Faz o merge das variantes extraídas pelo agente (docs/variantes-extraidas.json)
 * com o seed atual (scripts/seed-products.json), substituindo a lista de variantes
 * de cada produto.
 *
 * Saídas:
 *  - scripts/seed-products.json (atualizado)
 *  - logs no console mostrando produtos modificados
 */

const fs = require('fs')
const path = require('path')
const slugify = require('slugify')

const SEED_PATH = path.join(__dirname, 'seed-products.json')
const VARIANTES_PATH = path.join(__dirname, '..', 'docs', 'variantes-extraidas.json')

const seed = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'))
const variantes = JSON.parse(fs.readFileSync(VARIANTES_PATH, 'utf8'))

// Index variantes por slug pra lookup rápido
const variantesBySlug = new Map()
for (const p of variantes.products || []) {
    if (p.error) {
        console.warn(`⚠️  Slug "${p.slug}" reportou erro: ${p.error}`)
        continue
    }
    variantesBySlug.set(p.slug, p)
}

let updated = 0
let untouched = 0
let notFound = 0

const updatedProducts = seed.products.map((product) => {
    const fromAgent = variantesBySlug.get(product.slug)
    if (!fromAgent) {
        console.warn(`⚠️  Produto "${product.slug}" não está nas variantes extraídas, mantendo`)
        notFound++
        return product
    }

    if (!fromAgent.variants || fromAgent.variants.length === 0) {
        console.warn(`⚠️  Produto "${product.slug}" sem variantes no JSON do agente, mantendo`)
        untouched++
        return product
    }

    // Substitui variants
    const newVariants = fromAgent.variants.map((v) => ({
        size: v.size,
        price: v.price,
        compare_at_price: fromAgent.compare_at_price && fromAgent.compare_at_price > v.price
            ? fromAgent.compare_at_price
            : null,
        dimensions: v.dimensions || '',
        sku: `${slugify(product.name, { lower: true, strict: true, locale: 'pt' })}-${slugify(v.size, { lower: true, strict: true, locale: 'pt' })}`.slice(0, 60),
    }))

    updated++
    return {
        ...product,
        variants: newVariants,
        compare_at_price_base: fromAgent.compare_at_price ?? product.compare_at_price_base ?? 0,
    }
})

const out = { ...seed, products: updatedProducts }
fs.writeFileSync(SEED_PATH, JSON.stringify(out, null, 2))

console.log(`\n✅ Merge concluído.`)
console.log(`   Produtos atualizados: ${updated}`)
console.log(`   Produtos não tocados: ${untouched}`)
console.log(`   Produtos não encontrados no agente: ${notFound}`)
console.log(`   Total variantes agora: ${updatedProducts.reduce((a, p) => a + p.variants.length, 0)}`)
console.log(`   Output: ${SEED_PATH}`)
