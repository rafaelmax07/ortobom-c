'use client'

import { useEffect, useMemo, useState } from 'react'
import { MapPin, X, ChevronDown } from 'lucide-react'
import {
    STATES,
    CITIES_BY_STATE,
    readSavedLocation,
    writeSavedLocation,
} from '@/lib/locations'

interface LocationModalProps {
    open: boolean
    onClose: () => void
}

export function LocationModal({ open, onClose }: LocationModalProps) {
    const [uf, setUf] = useState('')
    const [city, setCity] = useState('')

    useEffect(() => {
        if (!open) return
        const saved = readSavedLocation()
        setUf(saved.uf)
        setCity(saved.city)
    }, [open])

    const cities = useMemo(() => CITIES_BY_STATE[uf] ?? [], [uf])

    const handleStateChange = (newUf: string) => {
        setUf(newUf)
        const list = CITIES_BY_STATE[newUf] ?? []
        setCity(list[0] ?? '')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!uf || !city) return
        writeSavedLocation({ uf, city })
        onClose()
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-5 bg-black/50">
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Informe sua localização"
                className="w-full max-w-[480px] bg-white rounded-lg shadow-2xl p-6 md:p-7 relative"
            >
                {/* Botão fechar */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar"
                    className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-text-muted hover:bg-bg-light transition-colors"
                >
                    <X size={16} />
                </button>

                {/* Ícone */}
                <div className="text-text-main mb-3">
                    <MapPin size={26} strokeWidth={1.8} />
                </div>

                <h2 className="text-[22px] md:text-[24px] font-bold text-text-main mb-2">
                    Informe sua localização
                </h2>
                <p className="text-[14px] text-text-soft mb-5">
                    Ao preencher vamos trazer os melhores preços e condições de entrega
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="state-select"
                            className="block text-[14px] font-bold text-text-main mb-1.5"
                        >
                            Escolha seu estado{' '}
                            <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="state-select"
                                value={uf}
                                onChange={e => handleStateChange(e.target.value)}
                                required
                                className="w-full appearance-none bg-white border border-border rounded-md px-4 py-2.5 pr-10 text-[14px] text-text-main focus:outline-none focus:border-primary"
                            >
                                <option value="">Selecione</option>
                                {STATES.map(s => (
                                    <option key={s.uf} value={s.uf}>
                                        {s.uf}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="city-select"
                            className="block text-[14px] font-bold text-text-main mb-1.5"
                        >
                            Escolha sua cidade{' '}
                            <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="city-select"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                required
                                disabled={!uf}
                                className="w-full appearance-none bg-white border border-border rounded-md px-4 py-2.5 pr-10 text-[14px] text-text-main focus:outline-none focus:border-primary disabled:bg-bg-light disabled:text-text-muted"
                            >
                                <option value="">Selecione</option>
                                {cities.map(c => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-navy-dark text-white font-semibold text-[15px] py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        disabled={!uf || !city}
                    >
                        Confirmar
                    </button>
                </form>
            </div>
        </div>
    )
}
