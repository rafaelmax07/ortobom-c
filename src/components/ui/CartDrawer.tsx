'use client';

import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from './primitives/Button';
import { Badge } from './primitives/Badge';
import { IconButton } from './primitives/IconButton';

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
        clearCart,
        buildCartWhatsAppUrl,
    } = useCart();

    const handleCheckout = () => {
        const url = buildCartWhatsAppUrl();
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={closeCart}
                    aria-hidden="true"
                />
            )}

            {/* Drawer */}
            <div
                role="dialog"
                aria-label="Carrinho de compras"
                className={`
                    fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl
                    flex flex-col transform transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-navy-medium">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="text-white" size={18} />
                        <h2 className="t-product-title text-white">
                            Meu Carrinho
                            {totalItems > 0 && (
                                <Badge variant="discount" size="sm" className="ml-2">{totalItems}</Badge>
                            )}
                        </h2>
                    </div>
                    <button
                        onClick={closeCart}
                        aria-label="Fechar carrinho"
                        className="text-white/80 hover:text-white transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-text-muted">
                            <ShoppingBag size={48} strokeWidth={1} className="text-border" />
                            <p className="t-body-small">Seu carrinho está vazio</p>
                            <Button onClick={closeCart} variant="primary" size="sm" className="mt-2">
                                Continuar comprando
                            </Button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.variantId}
                                className="flex gap-3 p-3 bg-bg-light rounded-lg border border-border"
                            >
                                <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-white border border-border">
                                    <Image
                                        src={item.image || '/placeholder.jpg'}
                                        alt={item.productName}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                        unoptimized
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="t-product-title text-xs truncate">{item.productName}</p>
                                    <p className="t-meta">{item.variantSize}{item.dimensions ? ` — ${item.dimensions}` : ''}</p>
                                    <p className="t-price-medium text-sm mt-1 text-navy-medium">
                                        {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>

                                    <div className="flex items-center gap-2 mt-1.5">
                                        <IconButton onClick={() => decrement(item.variantId)} aria-label="Diminuir" size="sm" className="w-6 h-6">
                                            <Minus size={11} />
                                        </IconButton>
                                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                        <IconButton onClick={() => increment(item.variantId)} aria-label="Aumentar" size="sm" className="w-6 h-6">
                                            <Plus size={11} />
                                        </IconButton>
                                        <button onClick={() => removeItem(item.variantId)} aria-label="Remover" className="ml-auto text-text-muted hover:text-danger transition-colors">
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-border px-4 py-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="t-meta">Subtotal</span>
                            <span className="t-price-medium text-navy-medium">
                                {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            variant="whatsapp"
                            size="lg"
                            fullWidth
                            leadingIcon={<MessageCircle size={18} />}
                        >
                            Fechar pedido via WhatsApp
                        </Button>

                        <button onClick={clearCart} className="w-full text-text-muted hover:text-danger text-xs transition-colors text-center">
                            Limpar carrinho
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
