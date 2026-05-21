import type { SVGProps } from 'react'

/**
 * SVGs ilustrativos das categorias da home.
 * Estilo line-art com stroke = currentColor para herdar a cor do texto da tab.
 */

export function MattressIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 48 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* Topo do colchão (paralelogramo isométrico) */}
            <path d="M8 14 L18 8 L42 8 L32 14 Z" />
            {/* Lateral frontal */}
            <path d="M8 14 L8 22 L32 22 L32 14" />
            {/* Lateral direita */}
            <path d="M32 22 L42 16 L42 8" />
            {/* Botões matelassê no topo */}
            <circle cx="22" cy="11" r="0.6" fill="currentColor" />
            <circle cx="27" cy="11" r="0.6" fill="currentColor" />
            <circle cx="32" cy="11" r="0.6" fill="currentColor" />
            <circle cx="37" cy="11" r="0.6" fill="currentColor" />
            {/* Linha de costura no meio */}
            <path d="M8 18 L32 18" />
        </svg>
    )
}

export function BaseIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 48 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* Topo da base */}
            <path d="M6 16 L18 10 L42 10 L30 16 Z" />
            {/* Lateral frontal */}
            <path d="M6 16 L6 22 L30 22 L30 16" />
            {/* Lateral direita */}
            <path d="M30 22 L42 16 L42 10" />
            {/* Pés */}
            <path d="M9 22 L9 25" />
            <path d="M27 22 L27 25" />
            <path d="M40 16 L40 19" />
        </svg>
    )
}

export function HeadboardIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 48 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* Cabeceira matelassê */}
            <path d="M8 6 L40 6 L40 22 L8 22 Z" />
            {/* Botões */}
            <circle cx="14" cy="11" r="0.7" fill="currentColor" />
            <circle cx="20" cy="11" r="0.7" fill="currentColor" />
            <circle cx="28" cy="11" r="0.7" fill="currentColor" />
            <circle cx="34" cy="11" r="0.7" fill="currentColor" />
            <circle cx="17" cy="16" r="0.7" fill="currentColor" />
            <circle cx="24" cy="16" r="0.7" fill="currentColor" />
            <circle cx="31" cy="16" r="0.7" fill="currentColor" />
            {/* Base / chão */}
            <path d="M5 22 L43 22" />
        </svg>
    )
}

export function PillowsIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 48 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* Travesseiro de trás */}
            <path d="M14 6 C14 5 15 4 17 4 L33 4 C35 4 36 5 36 6 L36 16 C36 17 35 18 33 18 L17 18 C15 18 14 17 14 16 Z" />
            {/* Travesseiro da frente, deslocado */}
            <path d="M9 13 C9 12 10 11 12 11 L28 11 C30 11 31 12 31 13 L31 24 C31 25 30 26 28 26 L12 26 C10 26 9 25 9 24 Z" />
            {/* Detalhe interno (etiqueta) */}
            <path d="M13 15 L18 15" />
            <path d="M13 18 L16 18" />
        </svg>
    )
}

export function SofaIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 48 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* Encosto */}
            <path d="M8 14 L8 8 C8 7 9 6 10 6 L38 6 C39 6 40 7 40 8 L40 14" />
            {/* Almofadas do encosto */}
            <path d="M14 14 L14 9" />
            <path d="M24 14 L24 9" />
            <path d="M34 14 L34 9" />
            {/* Assento */}
            <path d="M6 14 C5 14 4 15 4 16 L4 22 C4 23 5 24 6 24 L42 24 C43 24 44 23 44 22 L44 16 C44 15 43 14 42 14 Z" />
            {/* Pés */}
            <path d="M8 24 L8 27" />
            <path d="M40 24 L40 27" />
        </svg>
    )
}
