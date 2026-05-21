import fc from 'fast-check'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, afterEach } from 'vitest'
import { MobileStickyCTA } from '@/components/ui/MobileStickyCTA'
import { WHATSAPP_MESSAGE_TEMPLATE, formatBRL } from '@/lib/whatsapp'

const productNameArb = fc.string({ minLength: 1, maxLength: 30 })
const phoneDigitsArb = fc.stringMatching(/^[0-9]{10,15}$/)
const sizeArb = fc
    .string({ minLength: 1, maxLength: 30 })
    .filter((s) => s.trim().length > 0)
const priceArb = fc.float({
    min: Math.fround(1),
    max: Math.fround(99999),
    noNaN: true,
    noDefaultInfinity: true,
})
const skuArb = fc.string({ minLength: 1, maxLength: 30 })
const dimensionsArb = fc.option(fc.string({ maxLength: 30 }), { nil: null })
const whitespacePhoneArb = fc.constantFrom('', '   ', '\t\n', ' ')

describe('MobileStickyCTA deeplink', () => {
    afterEach(() => {
        cleanup()
    })

    it('Property 8a: Enabled phone path invokes window.open with templated deeplink — Validates: Requirements 4.5, 4.6, 4.7', () => {
        fc.assert(
            fc.property(
                productNameArb,
                phoneDigitsArb,
                sizeArb,
                priceArb,
                skuArb,
                dimensionsArb,
                (productName, phoneDigits, size, price, sku, dimensions) => {
                    const openSpy = vi
                        .spyOn(window, 'open')
                        .mockImplementation(() => null)
                    const previousPhone =
                        process.env.NEXT_PUBLIC_WHATSAPP_PHONE
                    process.env.NEXT_PUBLIC_WHATSAPP_PHONE = phoneDigits

                    try {
                        const variant = {
                            id: 'v1',
                            size,
                            price,
                            sku,
                            stock: 5,
                            dimensions,
                        }

                        const { unmount } = render(
                            <MobileStickyCTA
                                productName={productName}
                                selectedVariant={variant}
                            />,
                        )

                        const button = screen.getByRole('button', {
                            name: 'Comprar via WhatsApp',
                        })
                        expect(button).not.toBeDisabled()

                        fireEvent.click(button)

                        expect(openSpy).toHaveBeenCalledOnce()
                        const [url, target] = openSpy.mock.calls[0]
                        expect(target).toBe('_blank')
                        expect(typeof url).toBe('string')

                        const expectedPrefix = `https://wa.me/${phoneDigits}?text=`
                        expect(
                            (url as string).startsWith(expectedPrefix),
                        ).toBe(true)

                        const encodedText = (url as string).slice(
                            expectedPrefix.length,
                        )
                        const decoded = decodeURIComponent(encodedText)

                        const expected = WHATSAPP_MESSAGE_TEMPLATE.replace(
                            '{productName}',
                            productName,
                        )
                            .replace('{size}', size)
                            .replace('{dimensions}', dimensions ?? '')
                            .replace('{formattedPrice}', formatBRL(price))
                            .replace('{sku}', sku)

                        expect(decoded).toBe(expected)

                        unmount()
                    } finally {
                        openSpy.mockRestore()
                        process.env.NEXT_PUBLIC_WHATSAPP_PHONE = previousPhone
                        cleanup()
                    }
                },
            ),
            { numRuns: 30 },
        )
    })

    it('Property 8b: Empty/whitespace phone disables the button and click is a no-op — Validates: Requirements 4.9', () => {
        fc.assert(
            fc.property(
                productNameArb,
                whitespacePhoneArb,
                sizeArb,
                priceArb,
                skuArb,
                dimensionsArb,
                (productName, whitespacePhone, size, price, sku, dimensions) => {
                    const openSpy = vi
                        .spyOn(window, 'open')
                        .mockImplementation(() => null)
                    const previousPhone =
                        process.env.NEXT_PUBLIC_WHATSAPP_PHONE
                    process.env.NEXT_PUBLIC_WHATSAPP_PHONE = whitespacePhone

                    try {
                        const variant = {
                            id: 'v1',
                            size,
                            price,
                            sku,
                            stock: 5,
                            dimensions,
                        }

                        const { unmount } = render(
                            <MobileStickyCTA
                                productName={productName}
                                selectedVariant={variant}
                            />,
                        )

                        const button = screen.getByRole('button', {
                            name: 'Comprar via WhatsApp',
                        })
                        expect(button).toBeDisabled()

                        fireEvent.click(button)

                        expect(openSpy).not.toHaveBeenCalled()

                        unmount()
                    } finally {
                        openSpy.mockRestore()
                        process.env.NEXT_PUBLIC_WHATSAPP_PHONE = previousPhone
                        cleanup()
                    }
                },
            ),
            { numRuns: 30 },
        )
    })
})
