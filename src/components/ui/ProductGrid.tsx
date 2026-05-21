import { ProductCard, type ProductCardProduct, type ProductCardVariant } from './ProductCard'

interface ProductGridProps {
    products: ProductCardProduct[]
    /** Variant a ser passada para cada ProductCard */
    cardVariant?: ProductCardVariant
    /** Quantidade de colunas em desktop (default: 4) */
    columns?: 2 | 3 | 4
    /** Limite de produtos exibidos */
    limit?: number
}

const COLUMNS_CLASS: Record<NonNullable<ProductGridProps['columns']>, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
}

export function ProductGrid({
    products,
    cardVariant = 'grid',
    columns = 4,
    limit,
}: ProductGridProps) {
    const items = limit ? products.slice(0, limit) : products
    if (items.length === 0) return null

    return (
        <div className={`grid ${COLUMNS_CLASS[columns]} gap-4 sm:gap-6`}>
            {items.map(product => (
                <ProductCard key={product.id} product={product} variant={cardVariant} />
            ))}
        </div>
    )
}
