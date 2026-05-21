'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface NavCategoryItemProps {
    label: string
    href: string
    isOpen?: boolean
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    showChevron?: boolean
    accent?: boolean
}

export function NavCategoryItem({
    label,
    href,
    isOpen = false,
    onMouseEnter,
    onMouseLeave,
    showChevron = true,
    accent = false,
}: NavCategoryItemProps) {
    const [hovered, setHovered] = useState(false)

    const active = hovered || isOpen

    const handleEnter = () => {
        setHovered(true)
        onMouseEnter?.()
    }

    const handleLeave = () => {
        setHovered(false)
        onMouseLeave?.()
    }

    return (
        <li
            className={`relative flex items-center -my-1.5 py-1.5 border-b-2 transition-colors duration-200 min-w-[140px] xl:min-w-[160px] ${
                active ? 'bg-white border-accent' : 'bg-transparent border-transparent'
            }`}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            <Link
                href={href}
                className={`flex-1 text-center py-1.5 text-[13px] transition-colors ${
                    accent
                        ? `font-bold uppercase tracking-wide ${active ? 'text-navy-medium' : 'text-accent'}`
                        : `${active ? 'text-navy-medium' : 'text-white'}`
                }`}
                style={accent ? undefined : { fontWeight: 600 }}
            >
                {label}
            </Link>
            {showChevron && (
                <ChevronDown
                    size={14}
                    strokeWidth={2.25}
                    className={`flex-shrink-0 mr-3 transition-all duration-200 ${
                        active ? 'text-navy-medium -rotate-180' : 'text-white/70 rotate-0'
                    }`}
                    aria-hidden="true"
                />
            )}
        </li>
    )
}
