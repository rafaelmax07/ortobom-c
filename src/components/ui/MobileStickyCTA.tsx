'use client'

import { MessageCircle } from 'lucide-react'
import {
    buildWhatsAppDeeplink,
    formatBRL,
    resolveWhatsAppPhone,
} from '@/lib/whatsapp'

interface Variant {
    id: string
    size: string
    price: number
    sku: string
    stock: number
    compare_at_price?: number
    dimensions?: string | null
}

interface MobileStickyCTAProps {
    productName: string
    selectedVariant: Variant | null
}

export function MobileStickyCTA({
    productName,
    selectedVariant,
}: MobileStickyCTAProps) {
    if (!selectedVariant) return null

    const phone = resolveWhatsAppPhone()
    const phoneAvailable = phone.length > 0

    const handleClick = () => {
        if (!phoneAvailable) return
        const url = buildWhatsAppDeeplink({
            phone,
            productName,
            variant: selectedVariant,
        })
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    return (
        <aside
            role="region"
            aria-label="Comprar via WhatsApp"
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white shadow-mega border-t border-bg-light px-4 py-3 flex items-center gap-3"
        >
            <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs text-text-muted truncate">
                    {selectedVariant.size}
                </span>
                <span className="text-base font-extrabold text-primary tabular-nums truncate">
                    {formatBRL(selectedVariant.price)}
                </span>
            </div>

            <button
                type="button"
                disabled={!phoneAvailable}
                aria-disabled={!phoneAvailable}
                onClick={handleClick}
                className={[
                    'inline-flex items-center justify-center gap-2 font-bold text-sm',
                    'px-4 py-3 rounded-[var(--radius-button)] whitespace-nowrap',
                    phoneAvailable
                        ? 'bg-whatsapp hover:bg-whatsapp-hover text-white'
                        : 'bg-bg-light text-text-muted cursor-not-allowed',
                ].join(' ')}
            >
                <MessageCircle className="w-4 h-4" />
                Comprar via WhatsApp
            </button>
        </aside>
    )
}
