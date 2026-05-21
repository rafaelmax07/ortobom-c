import type { ReactNode } from 'react'

export type BadgeVariant = 'discount' | 'count' | 'info'

export interface BadgeProps {
    variant: BadgeVariant
    children: ReactNode
    className?: string
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
    discount:
        'bg-accent text-white font-bold text-[11px] px-2 py-0.5 rounded-[var(--radius-button)]',
    count:
        'bg-bg-light text-text-muted text-xs px-2 py-0.5 rounded-full',
    info:
        'bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full',
}

export function Badge({ variant, children, className }: BadgeProps) {
    const classes = [VARIANT_CLASSES[variant], className]
        .filter(Boolean)
        .join(' ')

    return <span className={classes}>{children}</span>
}
