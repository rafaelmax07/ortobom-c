'use client'

import { useState, useEffect } from 'react'

type Size = 'md' | 'lg'

interface OffersCountdownProps {
    size?: Size
}

export function OffersCountdown({ size = 'md' }: OffersCountdownProps) {
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
        <div
            className="flex items-start justify-center text-white tabular-nums"
            aria-live="polite"
            aria-label="Tempo restante da promoção"
        >
            <TimeBlock value={pad(time.days)} label="DIAS" size={size} />
            <Separator size={size} />
            <TimeBlock value={pad(time.hours)} label="HORAS" size={size} />
            <Separator size={size} />
            <TimeBlock value={pad(time.minutes)} label="MIN" size={size} />
            <Separator size={size} />
            <TimeBlock value={pad(time.seconds)} label="SEG" size={size} />
        </div>
    )
}

function TimeBlock({ value, label, size }: { value: string; label: string; size: Size }) {
    const isLarge = size === 'lg'
    return (
        <div className={`flex flex-col items-center ${isLarge ? 'w-[42px]' : 'w-[38px]'}`}>
            <span className={`font-bold leading-none ${isLarge ? 'text-[22px]' : 'text-[20px]'}`}>
                {value}
            </span>
            <span
                className={`font-medium uppercase ${isLarge ? 'text-[10px] mt-2' : 'text-[9px] mt-1.5'}`}
                style={{ letterSpacing: '0.5px', color: '#E2E8F0' }}
            >
                {label}
            </span>
        </div>
    )
}

function Separator({ size }: { size: Size }) {
    const isLarge = size === 'lg'
    return (
        <span
            className={`font-bold relative ${isLarge ? 'text-[18px] mx-0.5' : 'text-[16px] mx-0.5'}`}
            style={{ top: -2 }}
        >
            :
        </span>
    )
}
