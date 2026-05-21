import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

// Mock embla-carousel-react so jsdom-based snapshots are deterministic.
// The real hook depends on DOM measurements which jsdom does not provide.
vi.mock('embla-carousel-react', () => ({
    default: () => [vi.fn(), null],
}))

import { VariantSelector } from '@/components/ui/VariantSelector'
import { ProductGallery } from '@/components/ui/ProductGallery'

describe('VariantSelector', () => {
    it('renders three variants with one selected and a Sob medida entry', () => {
        const variants = [
            {
                id: '1',
                size: 'Casal',
                price: 1500,
                sku: 'CSL-1',
                stock: 5,
                dimensions: '138x188x25cm',
            },
            {
                id: '2',
                size: 'Queen',
                price: 1900,
                sku: 'QN-1',
                stock: 3,
                dimensions: '158x198x25cm',
            },
            {
                id: '3',
                size: 'Sob medida',
                price: 0,
                sku: 'SM-1',
                stock: 0,
            },
        ]

        const { container } = render(
            <VariantSelector
                variants={variants}
                selectedVariant={variants[1]}
                onSelect={() => {}}
            />,
        )

        expect(container).toMatchSnapshot()
    })
})

describe('ProductGallery', () => {
    it('renders with two images and a discount badge', () => {
        const images = [
            'https://placehold.co/600/png?text=A',
            'https://placehold.co/600/png?text=B',
        ]

        const { container } = render(
            <ProductGallery
                images={images}
                productName="Test"
                discountPercent={15}
            />,
        )

        expect(container).toMatchSnapshot()
    })

    it('renders with four images and no discount badge', () => {
        const images = [
            'https://placehold.co/600/png?text=A',
            'https://placehold.co/600/png?text=B',
            'https://placehold.co/600/png?text=C',
            'https://placehold.co/600/png?text=D',
        ]

        const { container } = render(
            <ProductGallery images={images} productName="Test" />,
        )

        expect(container).toMatchSnapshot()
    })
})
