'use client'

import { MessageCircle } from 'lucide-react'
import {
    buildWhatsAppDeeplink,
    formatBRL,
    resolveWhatsAppPhone,
} from '@/lib/whatsapp'
import { Button } from './primitives/Button'

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
                <span className="t-meta truncate">{selectedVariant.size}</span>
                <span className="t-price-medium text-primary truncate">
                    {formatBRL(selectedVariant.price)}
                </span>
            </div>

            <Button
                onClick={handleClick}
                disabled={!phoneAvailable}
                aria-disabled={!phoneAvailable}
                variant={phoneAvailable ? 'whatsapp' : 'secondary'}
                size="md"
                leadingIcon={<MessageCircle className="w-4 h-4" />}
            >
                Comprar via WhatsApp
            </Button>
        </aside>
    )
}
