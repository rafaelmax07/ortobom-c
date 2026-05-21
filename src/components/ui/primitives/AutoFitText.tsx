'use client'

import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import type { ReactNode } from 'react'

interface AutoFitTextProps {
    children: ReactNode
    /** Tag HTML a renderizar (default: span) */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
    /** Tamanho máximo da fonte em px */
    maxFontSize?: number
    /** Tamanho mínimo da fonte em px (não diminui abaixo disso) */
    minFontSize?: number
    /** Step de redução da fonte em px */
    step?: number
    className?: string
}

/**
 * Renderiza texto em UMA linha que se ajusta automaticamente:
 * começa no `maxFontSize` e diminui em incrementos de `step` até caber
 * na largura do container, sem cair abaixo de `minFontSize`.
 *
 * Se ainda não couber no `minFontSize`, aplica `text-overflow: ellipsis`.
 */
export function AutoFitText({
    children,
    as: Tag = 'span',
    maxFontSize = 18,
    minFontSize = 11,
    step = 1,
    className = '',
}: AutoFitTextProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLElement>(null)
    const [fontSize, setFontSize] = useState(maxFontSize)

    // useLayoutEffect garante que medimos antes do paint pra evitar flicker
    const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect

    useIso(() => {
        const measure = () => {
            const container = containerRef.current
            const text = textRef.current
            if (!container || !text) return

            const containerWidth = container.clientWidth
            if (!containerWidth) return

            // Começa no max e vai diminuindo até caber
            let current = maxFontSize
            text.style.fontSize = `${current}px`

            // Loop com guard de iteração
            let iter = 0
            while (text.scrollWidth > containerWidth && current > minFontSize && iter < 100) {
                current -= step
                text.style.fontSize = `${current}px`
                iter++
            }

            setFontSize(current)
        }

        measure()
        if (typeof ResizeObserver === 'undefined') return
        const ro = new ResizeObserver(measure)
        if (containerRef.current) ro.observe(containerRef.current)
        return () => ro.disconnect()
    }, [children, maxFontSize, minFontSize, step])

    return (
        <div ref={containerRef} className="w-full overflow-hidden">
            <Tag
                ref={textRef as never}
                className={`whitespace-nowrap overflow-hidden text-ellipsis ${className}`}
                style={{ fontSize: `${fontSize}px` }}
            >
                {children}
            </Tag>
        </div>
    )
}
