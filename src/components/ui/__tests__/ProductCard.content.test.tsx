import { describe, it, expect, afterEach } from 'vitest'
import fc from 'fast-check'
import { render, screen, cleanup } from '@testing-library/react'
import { ProductCard } from '@/components/ui/ProductCard'

const SLUG_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')

const slugArb = fc
    .array(fc.constantFrom(...SLUG_ALPHABET), { minLength: 1, maxLength: 20 })
    .map((chars) => chars.join(''))

const nameArb = fc.string({ minLength: 1, maxLength: 50 }).filter((raw) => {
    const norm = raw.replace(/\s+/g, ' ').trim()
    if (norm.length === 0) return false
    // Avoid collisions with the queries below.
    if (norm === 'Ver Detalhes') return false
    if (norm === 'A partir de') return false
    if (/Tamanhos Disponíveis/.test(norm)) return false
    return true
})

const priceArb = fc.float({
    min: Math.fround(1),
    max: Math.fround(99999),
    noNaN: true,
    noDefaultInfinity: true,
})

const variantCountArb = fc.integer({ min: 0, max: 8 })

describe('ProductCard content', () => {
    afterEach(() => {
        cleanup()
    })

    it('Property 2: ProductCard surfaces "A partir de", variant chip, and CTA — Validates: Requirements 2.2, 2.3, 2.4', () => {
        fc.assert(
            fc.property(
                slugArb,
                nameArb,
                priceArb,
                variantCountArb,
                (slug, name, price, variantCount) => {
                    const variants = Array.from(
                        { length: variantCount },
                        (_, i) => ({ size: `size-${i}` }),
                    )

                    const product = {
                        id: 'test-id',
                        name,
                        slug,
                        price,
                        featured_image: 'https://placehold.co/400x300.png',
                        variants,
                    }

                    try {
                        render(<ProductCard product={product} />)

                        // (a) The "A partir de" label is always rendered.
                        expect(screen.getByText('A partir de')).toBeInTheDocument()

                        // (b) The variant-count chip appears iff there is more than one variant.
                        if (variantCount > 1) {
                            expect(
                                screen.getByText(
                                    `${variantCount} Tamanhos Disponíveis`,
                                ),
                            ).toBeInTheDocument()
                        } else {
                            expect(
                                screen.queryByText(/Tamanhos Disponíveis/),
                            ).toBeNull()
                        }

                        // (c) The CTA link is exposed with accessible name "Ver Detalhes"
                        // and its href points at the product detail route.
                        const cta = screen.getByRole('link', {
                            name: 'Ver Detalhes',
                        })
                        expect(cta.getAttribute('href')).toBe(`/p/${slug}`)
                    } finally {
                        cleanup()
                    }
                },
            ),
            { numRuns: 100 },
        )
    })
})
