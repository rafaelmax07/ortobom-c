import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'

// Ensure the WhatsApp phone is resolvable so MobileStickyCTA renders the
// action button enabled. The MobileStickyCTA component reads it through
// `resolveWhatsAppPhone()` which calls `process.env.NEXT_PUBLIC_WHATSAPP_PHONE`.
beforeAll(() => {
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE = '558399283994'
})

// Avoid needing a real CartProvider — the inline "Adicionar ao carrinho"
// button only depends on `addItem` being callable.
vi.mock('@/context/CartContext', () => ({
    useCart: () => ({ addItem: vi.fn() }),
}))

import { ClientProductDetails } from '@/app/p/[slug]/ClientProductDetails'

describe('MobileStickyCTA visibility gating', () => {
    it('Property 6: MobileStickyCTA visibility gated by viewport width and route — Validates: Requirements 4.1, 4.2, 4.8', () => {
        const fakeProduct = {
            id: 'p-1',
            name: 'Colchão Teste',
            description: 'Descrição de teste para o colchão.',
            slug: 'colchao-teste',
            featured_image: 'https://placehold.co/400x300/png?text=test',
            variants: [
                {
                    id: 'v-1',
                    size: 'Casal',
                    price: 1500,
                    sku: 'X1',
                    stock: 5,
                },
            ],
        }

        render(<ClientProductDetails product={fakeProduct} />)

        // The MobileStickyCTA <aside> must be present and gated only via the
        // `md:hidden` Tailwind class — no JS resize listener and no route
        // branching. jsdom's viewport width does not influence its presence
        // in the DOM.
        const sticky = screen.getByRole('region', {
            name: 'Comprar via WhatsApp',
        })
        expect(sticky.tagName).toBe('ASIDE')
        expect(sticky.className).toContain('md:hidden')

        // The inline cart button must keep rendering at every viewport
        // alongside the sticky bar (Requirement 4.8).
        const cartButton = screen.getByRole('button', {
            name: /Adicionar ao carrinho/i,
        })
        expect(cartButton).toBeInTheDocument()
    })
})
