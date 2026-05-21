import { describe, it, expect } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import fc from 'fast-check'
import { ProductCard } from '@/components/ui/ProductCard'

describe('ProductCard discount badge', () => {
    it('Property 1: Discount badge appears iff product is discounted — Validates: Requirements 2.1', () => {
        fc.assert(
            fc.property(
                fc.record({
                    id: fc.string({ minLength: 1, maxLength: 10 }),
                    name: fc.string({ minLength: 1, maxLength: 50 }),
                    slug: fc.string({ minLength: 1, maxLength: 30 }),
                    price: fc.float({
                        min: Math.fround(1),
                        max: Math.fround(99999),
                        noNaN: true,
                        noDefaultInfinity: true,
                    }),
                    compareAtPrice: fc.option(
                        fc.float({
                            min: Math.fround(1),
                            max: Math.fround(99999),
                            noNaN: true,
                            noDefaultInfinity: true,
                        }),
                    ),
                }),
                ({ id, name, slug, price, compareAtPrice }) => {
                    const product = {
                        id,
                        name,
                        slug,
                        price,
                        compare_at_price:
                            compareAtPrice === null ? undefined : compareAtPrice,
                        featured_image:
                            'https://placehold.co/400x300/png?text=test',
                    }

                    try {
                        render(<ProductCard product={product} />)

                        const expectedHasDiscount =
                            compareAtPrice !== null && compareAtPrice > price

                        const badge = screen.queryByText(/%\s*OFF/)
                        expect(badge !== null).toBe(expectedHasDiscount)
                    } finally {
                        cleanup()
                    }
                },
            ),
            { numRuns: 100 },
        )
    })
})
