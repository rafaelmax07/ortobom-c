'use client'

import { useState, useEffect } from 'react'

export function OffersCountdown() {
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const getEndOfDay = () => {
            const now = new Date()
            const end = new Date(now)
            end.setHours(23, 59, 59, 999)
            return end.getTime() - now.getTime()
        }

        const tick = () => {
            const remaining = getEndOfDay()
            if (remaining <= 0) return
            setTime({
                days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
                hours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((remaining % (1000 * 60)) / 1000),
            })
        }

        tick()
        const interval = setInterval(tick, 1000)
        return () => clearInterval(interval)
    }, [])

    const pad = (n: number) => String(n).padStart(2, '0')

    return (
        <div className="flex items-center gap-1.5" aria-live="polite" aria-label="Tempo restante da promoção">
            <TimeBlock value={pad(time.days)} label="DIAS" />
            <Separator />
            <TimeBlock value={pad(time.hours)} label="HORAS" />
            <Separator />
            <TimeBlock value={pad(time.minutes)} label="MIN" />
            <Separator />
            <TimeBlock value={pad(time.seconds)} label="SEG" />
        </div>
    )
}

function TimeBlock({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <span className="bg-primary text-white font-bold text-base sm:text-lg px-2.5 py-1.5 rounded-[var(--radius-button)] min-w-[40px] sm:min-w-[48px] text-center tabular-nums leading-none">
                {value}
            </span>
            <span className="text-[9px] text-text-muted mt-1 font-medium">{label}</span>
        </div>
    )
}

function Separator() {
    return <span className="text-primary font-bold text-lg self-start mt-1.5">:</span>
}
