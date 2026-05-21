'use client'

import { useState } from 'react'
import Image from 'next/image'

export function NewsletterSection() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (email) {
            setSubmitted(true)
            setEmail('')
        }
    }

    return (
        <section className="bg-navy-medium py-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo + text */}
                    <div className="flex items-center gap-4">
                        <Image
                            src="https://www.ortobom.com.br/Content/V3/img/Ortobom_branco.png"
                            alt="Ortobom"
                            width={100}
                            height={30}
                            className="h-7 w-auto object-contain"
                            unoptimized
                        />
                        <div className="text-white">
                            <p className="font-medium text-sm">Receba com exclusividade</p>
                            <p className="text-xs text-white/70">as melhores ofertas!</p>
                        </div>
                    </div>

                    {/* Form */}
                    {submitted ? (
                        <p className="text-white font-medium text-sm">✓ Cadastro realizado!</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
                            <input
                                type="email"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 py-2.5 px-4 rounded text-sm bg-white text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-white/30"
                            />
                            <button
                                type="submit"
                                className="bg-accent hover:bg-accent-hover text-white font-bold py-2.5 px-6 rounded text-sm transition-colors"
                            >
                                Enviar
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}
