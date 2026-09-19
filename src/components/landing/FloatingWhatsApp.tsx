import { MessageCircle } from 'lucide-react'
import { buildContactWhatsAppUrl } from '@/lib/landing'

export function FloatingWhatsApp() {
    return (
        <a
            href={buildContactWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar com um consultor pelo WhatsApp"
            className="lp-float-whatsapp fixed z-40 right-4 bottom-4 lg:right-6 lg:bottom-6 w-14 h-14 rounded-full bg-whatsapp hover:bg-whatsapp-hover text-white flex items-center justify-center shadow-lg transition-colors"
        >
            <MessageCircle size={28} strokeWidth={2.2} aria-hidden="true" />
        </a>
    )
}
