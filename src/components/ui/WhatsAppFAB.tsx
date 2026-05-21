'use client'

import { MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { resolveWhatsAppPhone } from '@/lib/whatsapp'

export function WhatsAppFAB() {
    const [show, setShow] = useState(false)

    const phone = resolveWhatsAppPhone()
    const message = 'Olá! Gostaria de informações sobre produtos Ortobom.'
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 2000)
        return () => clearTimeout(timer)
    }, [])

    if (!show) return null

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-whatsapp hover:bg-whatsapp-hover rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            aria-label="Falar no WhatsApp"
        >
            <MessageCircle size={26} className="text-white" />
        </a>
    )
}
