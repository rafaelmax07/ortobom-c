'use client';

import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';
import Image from 'next/image';

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
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
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
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-[#1B2B4E]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-white" size={20} />
            <h2 className="text-white font-semibold text-lg">
              Meu Carrinho
              {totalItems > 0 && (
                <span className="ml-2 text-sm bg-orange-500 text-white rounded-full px-2 py-0.5">
                  {totalItems}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Fechar carrinho"
            className="text-white/80 hover:text-white transition-colors p-1 rounded"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <ShoppingBag size={56} strokeWidth={1} />
              <p className="font-medium text-gray-500">Seu carrinho está vazio</p>
              <p className="text-sm text-center text-gray-400">
                Adicione produtos para continuar
              </p>
              <button
                onClick={closeCart}
                className="mt-2 px-6 py-2 bg-[#1B2B4E] text-white rounded-lg text-sm font-medium hover:bg-[#243a65] transition-colors"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.variantId}
                className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                {/* Product image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-gray-200">
                  <Image
                    src={item.image || '/placeholder.jpg'}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.variantSize}
                    {item.dimensions ? ` — ${item.dimensions}` : ''}
                  </p>
                  <p className="text-sm font-bold text-[#1B2B4E] mt-1">
                    {(item.price * item.quantity).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decrement(item.variantId)}
                      aria-label="Diminuir quantidade"
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => increment(item.variantId)}
                      aria-label="Aumentar quantidade"
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Plus size={12} />
                    </button>

                    <button
                      onClick={() => removeItem(item.variantId)}
                      aria-label="Remover item"
                      className="ml-auto text-red-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer — only shown when there are items */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-4 space-y-3 bg-white">
            {/* Summary */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
              <span className="text-gray-800 font-semibold">
                {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            {/* CTA — Checkout via WhatsApp */}
            <button
              id="cart-checkout-button"
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-green-500/30"
            >
              <MessageCircle size={20} />
              Fechar pedido via WhatsApp
            </button>

            {/* Clear */}
            <button
              onClick={clearCart}
              className="w-full text-gray-400 hover:text-red-500 text-xs transition-colors text-center"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </>
  );
}
