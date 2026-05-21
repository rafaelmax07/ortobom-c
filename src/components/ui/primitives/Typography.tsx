import type { ElementType, ReactNode, HTMLAttributes } from 'react'

export type TypographyVariant =
    | 'page-heading'
    | 'section-heading'
    | 'subsection-heading'
    | 'product-title'
    | 'product-meta'
    | 'product-installments'
    | 'price-large'
    | 'price-medium'
    | 'price-strike'
    | 'price-suffix'
    | 'body'
    | 'body-small'
    | 'meta'
    | 'eyebrow'
    | 'badge'
    | 'nav-link'
    | 'button'
    | 'button-small'
    | 'link'
    | 'footer-heading'
    | 'footer-link'

const VARIANT_CLASS: Record<TypographyVariant, string> = {
    'page-heading': 't-page-heading',
    'section-heading': 't-section-heading',
    'subsection-heading': 't-subsection-heading',
    'product-title': 't-product-title',
    'product-meta': 't-product-meta',
    'product-installments': 't-product-installments',
    'price-large': 't-price-large',
    'price-medium': 't-price-medium',
    'price-strike': 't-price-strike',
    'price-suffix': 't-price-suffix',
    body: 't-body',
    'body-small': 't-body-small',
    meta: 't-meta',
    eyebrow: 't-eyebrow',
    badge: 't-badge',
    'nav-link': 't-nav-link',
    button: 't-button',
    'button-small': 't-button-small',
    link: 't-link',
    'footer-heading': 't-footer-heading',
    'footer-link': 't-footer-link',
}

const DEFAULT_TAG: Partial<Record<TypographyVariant, ElementType>> = {
    'page-heading': 'h1',
    'section-heading': 'h2',
    'subsection-heading': 'h3',
    'product-title': 'h3',
    'eyebrow': 'span',
    'meta': 'span',
    'badge': 'span',
    'price-large': 'p',
    'price-medium': 'p',
    'price-strike': 'span',
    'price-suffix': 'span',
    'product-meta': 'p',
    'product-installments': 'p',
    'body': 'p',
    'body-small': 'p',
    'nav-link': 'span',
    'button': 'span',
    'button-small': 'span',
    'link': 'span',
    'footer-heading': 'h4',
    'footer-link': 'span',
}

interface TypographyProps extends HTMLAttributes<HTMLElement> {
    variant: TypographyVariant
    /** Sobrescreve a tag HTML (default depende do variant) */
    as?: ElementType
    children: ReactNode
}

/**
 * Wrapper opcional para texto com variant tipográfica.
 * Equivalente a aplicar a classe `t-{variant}` num elemento.
 * Útil quando você quer semântica HTML correta (h1, h2, etc.) sem se preocupar
 * com qual tag usar.
 *
 * Você também pode usar diretamente as classes utilitárias:
 *   <h2 className="t-section-heading">Título</h2>
 */
export function Typography({
    variant,
    as,
    className = '',
    children,
    ...rest
}: TypographyProps) {
    const Tag = as || DEFAULT_TAG[variant] || 'span'
    const classes = [VARIANT_CLASS[variant], className].filter(Boolean).join(' ')

    return (
        <Tag className={classes} {...rest}>
            {children}
        </Tag>
    )
}
