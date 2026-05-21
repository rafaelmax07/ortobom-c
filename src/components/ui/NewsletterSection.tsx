'use client'

import { useState } from 'react'
import Image from 'next/image'

const COLOR_BUTTON = '#2B4A75'
const COLOR_ICON = '#FF7C00'

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
        <section
            className="w-full bg-navy-medium flex items-center justify-center"
            style={{ minHeight: 128 }}
            aria-label="Newsletter"
        >
            <div className="max-w-[1280px] w-full px-6 md:px-8 py-5 md:py-0 flex flex-col md:flex-row items-center md:justify-between gap-5 md:gap-6">
                {/* Logo à esquerda */}
                <Image
                    src="https://www.ortobom.com.br/Content/V3/img/Ortobom_branco.png"
                    alt="Ortobom"
                    width={130}
                    height={36}
                    className="h-8 w-auto object-contain shrink-0"
                    unoptimized
                />

                {/* CTA centralizado entre logo e form */}
                <div className="flex flex-1 items-center justify-center gap-3">
                    <div
                        className="rounded-full w-6 h-6 flex items-center justify-center font-extrabold text-[13px] leading-none shrink-0 text-black"
                        style={{ backgroundColor: COLOR_ICON }}
                        aria-hidden="true"
                    >
                        %
                    </div>
                    <div className="flex flex-col text-white leading-tight items-center text-center">
                        <span className="text-[20px] md:text-[22px] font-bold">
                            Receba com exclusividade
                        </span>
                        <span className="text-[20px] md:text-[22px] font-bold text-white/70">
                            as melhores ofertas!
                        </span>
                    </div>
                </div>

                {/* Form à direita */}
                <div className="flex-shrink-0 w-full md:w-auto">
                    {submitted ? (
                        <p className="text-white font-medium text-sm md:text-base">
                            ✓ Cadastro realizado!
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="bg-white rounded-md p-1.5 flex items-center w-full md:w-[320px]">
                                <input
                                    aria-label="Endereço de e-mail"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Cadastre seu e-mail aqui"
                                    className="flex-grow min-w-0 border-none text-[13px] font-normal px-3 py-1 outline-none bg-transparent text-text-soft placeholder-[#888]"
                                />
                                <button
                                    type="submit"
                                    className="text-white font-medium text-sm py-2 px-5 rounded-md transition-colors hover:opacity-90 shrink-0"
                                    style={{ backgroundColor: COLOR_BUTTON }}
                                >
                                    Enviar
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}
