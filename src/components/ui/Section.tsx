import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export type SectionBackground = 'white' | 'light' | 'soft' | 'navy-dark'
export type SectionDivider = 'none' | 'top' | 'bottom' | 'both'

const BG_CLASSES: Record<SectionBackground, string> = {
    white: 'bg-white',
    light: 'bg-bg-light',
    soft: 'bg-bg-soft',
    'navy-dark': 'bg-navy-dark text-white',
}

interface SectionProps {
    title?: string
    /** Emoji ou ícone exibido antes do título */
    titleIcon?: ReactNode
    subtitle?: string
    /** Link "Ver todas" no canto direito do header */
    seeMoreHref?: string
    seeMoreLabel?: string
    background?: SectionBackground
    divider?: SectionDivider
    /** Padding vertical (default: padrão) */
    paddingY?: 'sm' | 'md' | 'lg'
    /** Container interno: contained (1280) ou full (sem max-w) */
    container?: 'contained' | 'full'
    children: ReactNode
    className?: string
}

const PADDING_Y: Record<NonNullable<SectionProps['paddingY']>, string> = {
    sm: 'py-6',
    md: 'py-8 md:py-10',
    lg: 'py-12 md:py-16',
}

/**
 * Template de seção da home/PLPs com header (título + emoji + link "Ver todas").
 * Centraliza o padrão usado em todas as listas de produto da home.
 */
export function Section({
    title,
    titleIcon,
    subtitle,
    seeMoreHref,
    seeMoreLabel = 'Ver todas',
    background = 'white',
    divider = 'none',
    paddingY = 'md',
    container = 'contained',
    children,
    className = '',
}: SectionProps) {
    const dividerTop = divider === 'top' || divider === 'both' ? 'border-t border-border' : ''
    const dividerBottom = divider === 'bottom' || divider === 'both' ? 'border-b border-border' : ''

    return (
        <section className={`${BG_CLASSES[background]} ${PADDING_Y[paddingY]} ${dividerTop} ${dividerBottom} ${className}`.trim()}>
            <div className={container === 'contained' ? 'max-w-[1280px] mx-auto px-6' : 'px-6'}>
                {(title || seeMoreHref) && (
                    <header className="flex items-center justify-between mb-5 gap-4">
                        {title && (
                            <div className="flex flex-col">
                                <h2 className="t-subsection-heading flex items-center gap-2">
                                    {titleIcon}
                                    {title}
                                </h2>
                                {subtitle && <p className="t-meta mt-1">{subtitle}</p>}
                            </div>
                        )}
                        {seeMoreHref && (
                            <Link
                                href={seeMoreHref}
                                className="t-link inline-flex items-center gap-1 whitespace-nowrap"
                            >
                                {seeMoreLabel}
                                <ChevronRight size={16} />
                            </Link>
                        )}
                    </header>
                )}

                {children}
            </div>
        </section>
    )
}
