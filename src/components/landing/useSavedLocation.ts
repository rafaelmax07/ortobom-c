'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_LOCATION, readSavedLocation, type SavedLocation } from '@/lib/locations'

/** Mesma sincronização usada no Header: lê a cidade salva e ouve o modal de localização. */
export function useSavedLocation(): SavedLocation {
    const [location, setLocation] = useState<SavedLocation>(DEFAULT_LOCATION)

    useEffect(() => {
        const sync = () => setLocation(readSavedLocation())
        sync()
        window.addEventListener('ortobom:location-changed', sync)
        return () => window.removeEventListener('ortobom:location-changed', sync)
    }, [])

    return location
}
