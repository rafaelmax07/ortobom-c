'use client'

import { MessageCircle } from 'lucide-react'
import { buildWhatsAppDeeplink, resolveWhatsAppPhone } from '@/lib/whatsapp'
import { Button } from './primitives/Button'

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
        <Button
            onClick={handleBuyClick}
            variant={selectedVariant ? 'whatsapp' : 'secondary'}
            size="lg"
            fullWidth
            disabled={!selectedVariant}
            leadingIcon={<MessageCircle className="w-5 h-5" />}
            className={selectedVariant ? 'rounded-full shadow-lg hover:shadow-xl' : 'rounded-full'}
        >
            {selectedVariant ? 'Comprar pelo WhatsApp' : 'Selecione um Tamanho'}
        </Button>
    )
}
