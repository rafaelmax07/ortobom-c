import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Badge } from '@/components/ui/Badge'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

describe('Badge', () => {
    it('renders the discount variant', () => {
        const { container } = render(<Badge variant="discount">25% OFF</Badge>)
        expect(container.firstChild).toMatchSnapshot()
    })

    it('renders the count variant', () => {
        const { container } = render(<Badge variant="count">3 Tamanhos</Badge>)
        expect(container.firstChild).toMatchSnapshot()
    })

    it('renders the info variant', () => {
        const { container } = render(<Badge variant="info">Info</Badge>)
        expect(container.firstChild).toMatchSnapshot()
    })
})

describe('PriceDisplay', () => {
    it('renders with a compare-at price above the current price', () => {
        const { container } = render(
            <PriceDisplay
                priceLabel="A partir de"
                price={1500}
                compareAtPrice={1999}
            />,
        )
        expect(container).toMatchSnapshot()
    })

    it('renders without a compare-at price', () => {
        const { container } = render(
            <PriceDisplay priceLabel="A partir de" price={1500} />,
        )
        expect(container).toMatchSnapshot()
    })
})

describe('Breadcrumb', () => {
    it('renders with a single item', () => {
        const { container } = render(
            <Breadcrumb items={[{ label: 'Home' }]} />,
        )
        expect(container).toMatchSnapshot()
    })

    it('renders with three items', () => {
        const { container } = render(
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Categoria', href: '/c/colchoes' },
                    { label: 'Produto' },
                ]}
            />,
        )
        expect(container).toMatchSnapshot()
    })
})
