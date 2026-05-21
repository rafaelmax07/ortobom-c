import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type IconButtonVariant =
    | 'default'      // borda + bg branco, ícone navy
    | 'overlay'      // bg branco semi-transparente, ícone navy (sobre imagem)
    | 'dark-overlay' // bg preto semi-transparente, ícone branco (sobre banner claro)
    | 'navy'         // bg navy, ícone branco
    | 'ghost'        // sem fundo, hover bg leve

export type IconButtonSize = 'sm' | 'md' | 'lg'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: IconButtonVariant
    size?: IconButtonSize
    rounded?: 'full' | 'md'
    children: ReactNode
}

const SIZE_CLASSES: Record<IconButtonSize, string> = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-10 h-10',
}

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
    default: 'bg-white border border-border text-text-soft hover:bg-bg-light',
    overlay: 'bg-white/90 hover:bg-white text-text-soft shadow-md',
    'dark-overlay': 'bg-black/35 hover:bg-black/50 text-white backdrop-blur-sm',
    navy: 'bg-navy-medium text-white hover:bg-primary-hover',
    ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/10',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
    {
        variant = 'default',
        size = 'md',
        rounded = 'md',
        className = '',
        children,
        ...rest
    },
    ref
) {
    const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded-md'
    const classes = [
        'inline-flex items-center justify-center transition-colors duration-150',
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        roundedClass,
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <button ref={ref} className={classes} {...rest}>
            {children}
        </button>
    )
})
