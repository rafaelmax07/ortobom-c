import type { ReactNode } from 'react'

export type BadgeVariant =
    | 'discount'      // laranja sólido (% OFF)
    | 'coupon'        // cinza claro com texto soft (cupom adicional)
    | 'success'       // verde claro com texto verde escuro (Economize R$ X)
    | 'count'         // pílula neutra (X tamanhos disponíveis)
    | 'info'          // azul claro com texto azul (info geral)
    | 'danger'        // vermelho sólido
    | 'neutral'       // cinza neutro

export type BadgeSize = 'sm' | 'md'
export type BadgeShape = 'pill' | 'square'

interface BadgeProps {
    variant?: BadgeVariant
    size?: BadgeSize
    shape?: BadgeShape
    leadingIcon?: ReactNode
    children: ReactNode
    className?: string
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
    discount: 'bg-accent text-white',
    coupon: 'bg-bg-light text-text-soft',
    success: 'bg-success-bg text-success',
    count: 'bg-bg-light text-text-muted',
    info: 'bg-primary/10 text-primary',
    danger: 'bg-danger text-white',
    neutral: 'bg-bg-soft text-text-soft',
}

const SIZE_CLASSES: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 t-badge',
}

const SHAPE_CLASSES: Record<BadgeShape, string> = {
    pill: 'rounded-full',
    square: 'rounded-[var(--radius-button)]',
}

export function Badge({
    variant = 'neutral',
    size = 'md',
    shape = 'pill',
    leadingIcon,
    children,
    className = '',
}: BadgeProps) {
    const classes = [
        'inline-flex items-center gap-1',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        SHAPE_CLASSES[shape],
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <span className={classes}>
            {leadingIcon}
            {children}
        </span>
    )
}
