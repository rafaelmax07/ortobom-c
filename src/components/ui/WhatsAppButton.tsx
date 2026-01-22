'use client'

import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
    productName: string
    selectedVariant: { size: string; price: number; sku: string } | null
}

const PHONE_NUMBER = '5583996723380' // Updated per user request

export function WhatsAppButton({ productName, selectedVariant }: WhatsAppButtonProps) {

    const handleBuyClick = () => {
        if (!selectedVariant) {
            alert('Por favor, selecione um tamanho antes de comprar!')
            return
        }

        const rawPrice = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(selectedVariant.price)

        // Remove Non-Breaking Spaces that cause issues in some WhatsApp clients
        const formattedPrice = rawPrice.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ')
        const sizeClean = selectedVariant.size.trim()

        const message = `Olá! Tenho interesse no *${productName}*

• Tamanho: *${sizeClean}*
• Preço: *${formattedPrice}*
• SKU: ${selectedVariant.sku}

Gostaria de saber mais sobre entrega e formas de pagamento.`;

        const encodedMessage = encodeURIComponent(message)
        const url = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`

        window.open(url, '_blank')
    }

    return (
        <button
            onClick={handleBuyClick}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold text-lg transition-all 
        ${selectedVariant
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
        >
            <MessageCircle className="w-6 h-6" />
            {selectedVariant ? 'Comprar pelo WhatsApp' : 'Selecione um Tamanho'}
        </button>
    )
}
