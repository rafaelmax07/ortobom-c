import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'

export type ButtonVariant = 'primary' | 'secondary' | 'whatsapp' | 'ghost' | 'outline-light'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary:
        'bg-primary text-white hover:bg-primary-hover disabled:bg-bg-light disabled:text-text-muted disabled:cursor-not-allowed',
    secondary:
        'bg-bg-light text-text-soft hover:bg-bg-soft border border-border',
    whatsapp:
        'bg-whatsapp text-white hover:bg-whatsapp-hover',
    ghost:
        'bg-transparent text-text-soft hover:bg-bg-light',
    'outline-light':
        'bg-transparent text-white border border-white hover:bg-white hover:text-navy-medium',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 t-button-small rounded-[var(--radius-button)]',
    md: 'px-4 py-2.5 t-button rounded-[var(--radius-button)]',
    lg: 'px-6 py-3.5 t-button rounded-[var(--radius-button)]',
}

function buildClasses(variant: ButtonVariant, size: ButtonSize, fullWidth: boolean, extra: string) {
    return [
        'inline-flex items-center justify-center gap-2 transition-colors duration-150',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? 'w-full' : '',
        extra,
    ]
        .filter(Boolean)
        .join(' ')
}

interface BaseProps {
    variant?: ButtonVariant
    size?: ButtonSize
    fullWidth?: boolean
    leadingIcon?: ReactNode
    trailingIcon?: ReactNode
    children: ReactNode
}

type ButtonElementProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>

interface LinkButtonProps extends BaseProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
    href: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonElementProps>(function Button(
    {
        variant = 'primary',
        size = 'md',
        fullWidth = false,
        leadingIcon,
        trailingIcon,
        className = '',
        children,
        ...rest
    },
    ref
) {
    const classes = buildClasses(variant, size, fullWidth, className)
    return (
        <button ref={ref} className={classes} {...rest}>
            {leadingIcon}
            {children}
            {trailingIcon}
        </button>
    )
})

/**
 * LinkButton tem a mesma aparência do Button mas é semanticamente um <a>.
 * Use para CTAs que navegam (ex: "Ver Detalhes" em product cards).
 */
export function LinkButton({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    leadingIcon,
    trailingIcon,
    className = '',
    href,
    children,
    ...rest
}: LinkButtonProps) {
    const classes = buildClasses(variant, size, fullWidth, className)
    const isExternal = href.startsWith('http://') || href.startsWith('https://')
    if (isExternal) {
        return (
            <a href={href} className={classes} {...rest}>
                {leadingIcon}
                {children}
                {trailingIcon}
            </a>
        )
    }
    return (
        <Link href={href} className={classes} {...rest}>
            {leadingIcon}
            {children}
            {trailingIcon}
        </Link>
    )
}
