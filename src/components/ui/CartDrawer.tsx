'use client'

import { useCart } from '@/context/CartContext'
import { X, Trash2, Plus, Minus, Truck } from 'lucide-react'
import Image from 'next/image'
import { Button } from './primitives/Button'

const FREE_SHIPPING_THRESHOLD = 1500

function formatBRL(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function CartDrawer() {
    const {
        items,
        totalItems,
        totalPrice,
        isOpen,
        closeCart,
        removeItem,
        increment,
        decrement,
        buildCartWhatsAppUrl,
    } = useCart()

    const handleCheckout = () => {
        const url = buildCartWhatsAppUrl()
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    const hasFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD
    const progressPct = Math.min(
        100,
        Math.round((totalPrice / FREE_SHIPPING_THRESHOLD) * 100)
    )

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={closeCart}
                    aria-hidden="true"
                />
            )}

            <aside
                role="dialog"
                aria-label="Carrinho de compras"
                className={`
                    fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 shadow-2xl
                    flex flex-col transform transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* Header */}
                <header className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <h2 className="text-[18px] font-bold text-text-main">
                        Meu Carrinho
                        {totalItems > 0 && (
                            <span className="ml-1.5 text-text-muted font-medium">
                                ({totalItems})
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={closeCart}
                        aria-label="Fechar carrinho"
                        className="text-primary hover:opacity-80 transition-opacity p-1"
                    >
                        <X size={22} />
                    </button>
                </header>

                {items.length === 0 ? (
                    <EmptyCart onContinue={closeCart} />
                ) : (
                    <>
                        {/* Free shipping banner */}
                        <div className="px-5 pt-4">
                            <FreeShippingBanner
                                hasFreeShipping={hasFreeShipping}
                                progressPct={progressPct}
                            />
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4 space-y-4">
                            {items.map(item => (
                                <CartItemRow
                                    key={item.variantId}
                                    item={item}
                                    onRemove={() => removeItem(item.variantId)}
                                    onIncrement={() => increment(item.variantId)}
                                    onDecrement={() => decrement(item.variantId)}
                                />
                            ))}

                            <p className="text-[12px] text-text-muted leading-relaxed pt-2">
                                O prazo de entrega para sua localidade João Pessoa\PB é de
                                7 dias úteis após a confirmação do pagamento
                            </p>
                        </div>

                        {/* Footer / Totals */}
                        <footer className="border-t border-border bg-bg-light px-5 py-4 space-y-2">
                            <div className="flex items-center justify-between text-[14px] text-text-soft">
                                <span>Subtotal:</span>
                                <span className="text-primary font-semibold">
                                    {formatBRL(totalPrice)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-[14px] text-text-soft">
                                <span>Frete:</span>
                                {hasFreeShipping ? (
                                    <span className="bg-success-bg text-success font-bold text-[12px] px-3 py-1 rounded-md">
                                        GRÁTIS
                                    </span>
                                ) : (
                                    <span className="text-text-muted">Calcular</span>
                                )}
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                <span className="text-[16px] font-bold text-text-main">Total:</span>
                                <span className="text-[18px] font-bold text-primary">
                                    {formatBRL(totalPrice)}
                                </span>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                variant="primary"
                                size="lg"
                                fullWidth
                                className="mt-3"
                            >
                                Ir para o pagamento
                            </Button>
                        </footer>
                    </>
                )}
            </aside>
        </>
    )
}

function EmptyCart({ onContinue }: { onContinue: () => void }) {
    return (
        <div className="flex flex-col items-center text-center px-6 pt-10">
            <h3 className="text-[20px] font-bold text-text-main mb-2">
                Seu carrinho está vazio
            </h3>
            <p className="text-[13px] text-text-muted leading-relaxed max-w-[260px] mb-5">
                Você ainda não adicionou nenhum produto ao carrinho
            </p>
            <Button onClick={onContinue} variant="primary" size="md">
                Continuar comprando
            </Button>
        </div>
    )
}

function FreeShippingBanner({
    hasFreeShipping,
    progressPct,
}: {
    hasFreeShipping: boolean
    progressPct: number
}) {
    return (
        <div className="rounded-md p-3 bg-success-bg border border-success/20">
            <div className="flex items-start gap-2">
                <Truck className="text-success shrink-0 mt-0.5" size={18} />
                <div className="flex-1">
                    <p className="text-[13px] font-bold text-success leading-tight">
                        {hasFreeShipping
                            ? 'Você agora tem frete grátis!'
                            : 'Faltam poucos itens para frete grátis'}
                    </p>
                    <p className="text-[12px] text-success/80 leading-snug">
                        Aproveite a economia e adicione mais itens.
                    </p>
                </div>
            </div>
            <div className="mt-2 h-[3px] rounded-full bg-success/15 overflow-hidden">
                <div
                    className="h-full bg-success transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                />
            </div>
        </div>
    )
}

interface CartItemRowProps {
    item: import('@/context/CartContext').CartItem
    onRemove: () => void
    onIncrement: () => void
    onDecrement: () => void
}

function CartItemRow({ item, onRemove, onIncrement, onDecrement }: CartItemRowProps) {
    const hasDiscount =
        item.compare_at_price != null && item.compare_at_price > item.price
    const discountPct = hasDiscount
        ? Math.round((1 - item.price / (item.compare_at_price as number)) * 100)
        : 0

    return (
        <div className="flex gap-3">
            {/* Imagem com badge */}
            <div className="relative w-[90px] h-[90px] rounded-md overflow-hidden bg-bg-light shrink-0">
                {hasDiscount && (
                    <div className="absolute top-1 left-1 z-10 inline-flex items-center gap-1 bg-success text-white font-bold text-[11px] px-1.5 py-0.5 rounded">
                        <span>%</span>
                        {discountPct}% OFF
                    </div>
                )}
                <Image
                    src={item.image || '/placeholder.jpg'}
                    alt={item.productName}
                    fill
                    sizes="90px"
                    className="object-cover"
                    unoptimized
                />
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
                <h4 className="text-[14px] font-bold text-text-main leading-tight">
                    {item.productName}
                </h4>
                <p className="text-[12px] text-text-muted">{item.variantSize}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    {hasDiscount && (
                        <span className="text-[12px] text-text-muted line-through">
                            {formatBRL(item.compare_at_price as number)}
                        </span>
                    )}
                    <span className="text-[15px] font-bold text-primary">
                        {formatBRL(item.price)}
                    </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="inline-flex items-center border border-border rounded-md">
                        <button
                            onClick={onDecrement}
                            aria-label="Diminuir quantidade"
                            className="w-7 h-7 flex items-center justify-center text-text-soft hover:bg-bg-light disabled:opacity-30 disabled:hover:bg-transparent"
                            disabled={item.quantity <= 1}
                        >
                            <Minus size={13} />
                        </button>
                        <span className="text-[13px] font-medium w-7 text-center text-text-main">
                            {item.quantity}
                        </span>
                        <button
                            onClick={onIncrement}
                            aria-label="Aumentar quantidade"
                            className="w-7 h-7 flex items-center justify-center text-text-soft hover:bg-bg-light"
                        >
                            <Plus size={13} />
                        </button>
                    </div>

                    <button
                        onClick={onRemove}
                        aria-label="Remover item"
                        className="text-text-muted hover:text-danger transition-colors p-1"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}
