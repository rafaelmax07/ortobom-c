import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import fc from 'fast-check'
import { render, screen, cleanup } from '@testing-library/react'
import { MobileStickyCTA } from '@/components/ui/MobileStickyCTA'
import { formatBRL } from '@/lib/whatsapp'

beforeAll(() => {
    // Ensure the WhatsApp button renders enabled so its accessible name is
    // exposed identically across all property runs.
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE = '558399283994'
})

const productNameArb = fc.string({ minLength: 1, maxLength: 30 })

const sizeArb = fc
    .string({ minLength: 1, maxLength: 30 })
    .filter((s) => {
        if (s.length === 0) return false
        // Avoid normalization edge cases: leading/trailing whitespace and
        // whitespace runs are collapsed by testing-library's matcher.
        if (s.trim() !== s) return false
        if (/\s\s/.test(s)) return false
        // Avoid colliding with the literal CTA label.
        if (s === 'Comprar via WhatsApp') return false
        // Avoid colliding with the formatted BRL price text rendered alongside.
        if (/R\$/.test(s)) return false
        return true
    })

const priceArb = fc.float({
    min: Math.fround(1),
    max: Math.fround(99999),
    noNaN: true,
    noDefaultInfinity: true,
})

const skuArb = fc.string({ minLength: 1, maxLength: 30 })

const dimensionsArb = fc.option(fc.string({ maxLength: 30 }), { nil: null })

describe('MobileStickyCTA content', () => {
    afterEach(() => {
        cleanup()
    })

    it('Property 7: MobileStickyCTA content reflects the selected variant — Validates: Requirements 4.3', () => {
        fc.assert(
            fc.property(
                productNameArb,
                sizeArb,
                priceArb,
                skuArb,
                dimensionsArb,
                (productName, size, price, sku, dimensions) => {
                    const variant = {
                        id: 'v1',
                        size,
                        price,
                        sku,
                        stock: 5,
                        dimensions,
                    }

                    try {
                        render(
                            <MobileStickyCTA
                                productName={productName}
                                selectedVariant={variant}
                            />,
                        )

                        // (a) The selected variant's size literal is rendered.
                        expect(screen.getByText(size)).toBeInTheDocument()

                        // (b) The formatted BRL price literal is rendered.
                        expect(
                            screen.getByText(formatBRL(price)),
                        ).toBeInTheDocument()

                        // (c) A button with accessible name "Comprar via WhatsApp"
                        // is exposed.
                        expect(
                            screen.getByRole('button', {
                                name: 'Comprar via WhatsApp',
                            }),
                        ).toBeInTheDocument()
                    } finally {
                        cleanup()
                    }
                },
            ),
            { numRuns: 50 },
        )
    })
})
