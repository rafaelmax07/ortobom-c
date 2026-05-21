'use client'

import { MessageCircle } from 'lucide-react'
import { buildWhatsAppDeeplink, resolveWhatsAppPhone } from '@/lib/whatsapp'

interface WhatsAppButtonProps {
    productName: string
    selectedVariant: { size: string; price: number; sku: string } | null
}

export function WhatsAppButton({ productName, selectedVariant }: WhatsAppButtonProps) {

    const handleBuyClick = () => {
        if (!selectedVariant) {
            alert('Por favor, selecione um tamanho antes de comprar!')
            return
        }

        const url = buildWhatsAppDeeplink({
            phone: resolveWhatsAppPhone(),
            productName,
            variant: selectedVariant,
        })

        window.open(url, '_blank')
    }

    return (
        <button
            onClick={handleBuyClick}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold text-lg transition-all 
        ${selectedVariant
                    ? 'bg-whatsapp hover:bg-whatsapp-hover text-white shadow-lg hover:shadow-xl'
                    : 'bg-bg-light cursor-not-allowed text-text-muted'
                }`}
        >
            <MessageCircle className="w-6 h-6" />
            {selectedVariant ? 'Comprar pelo WhatsApp' : 'Selecione um Tamanho'}
        </button>
    )
}
