'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CartItem {
  variantId: string;
  productSlug: string;
  productName: string;
  variantSize: string;
  variantSku: string;
  price: number;
  image: string;
  quantity: number;
  dimensions?: string | null;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; variantId: string }
  | { type: 'INCREMENT'; variantId: string }
  | { type: 'DECREMENT'; variantId: string }
  | { type: 'CLEAR' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

// ─────────────────────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.variantId === action.item.variantId);
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.variantId === action.item.variantId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { ...action.item, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.variantId !== action.variantId),
      };
    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map((i) =>
          i.variantId === action.variantId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case 'DECREMENT':
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.variantId === action.variantId ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  increment: (variantId: string) => void;
  decrement: (variantId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  /** Returns a WhatsApp deep-link URL with all cart items listed */
  buildCartWhatsAppUrl: () => string;
  /** Returns a WhatsApp deep-link URL for a single item (Buy Now) */
  buildSingleItemWhatsAppUrl: (item: Omit<CartItem, 'quantity'>) => string;
}

const CartContext = createContext<CartContextValue | null>(null);

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '558399283994';

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  const addItem = useCallback((item: CartItem) => dispatch({ type: 'ADD_ITEM', item }), []);
  const removeItem = useCallback((variantId: string) => dispatch({ type: 'REMOVE_ITEM', variantId }), []);
  const increment = useCallback((variantId: string) => dispatch({ type: 'INCREMENT', variantId }), []);
  const decrement = useCallback((variantId: string) => dispatch({ type: 'DECREMENT', variantId }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);

  const totalItems = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const totalPrice = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  );

  const buildCartWhatsAppUrl = useCallback(() => {
    if (state.items.length === 0) return `https://wa.me/${WHATSAPP_PHONE}`;

    const lines = state.items.map((item) => {
      const price = item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const sub = (item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const dims = item.dimensions ? ` (${item.dimensions})` : '';
      return `• ${item.productName} — ${item.variantSize}${dims}\n  Qtd: ${item.quantity} × ${price} = ${sub}`;
    });

    const total = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const message = [
      '🛒 *Pedido via Ortobom*',
      '',
      ...lines,
      '',
      `*Total: ${total}*`,
      '',
      'Gostaria de finalizar meu pedido!',
    ].join('\n');

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  }, [state.items, totalPrice]);

  const buildSingleItemWhatsAppUrl = useCallback(
    (item: Omit<CartItem, 'quantity'>) => {
      const price = item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const dims = item.dimensions ? ` — ${item.dimensions}` : '';
      const message = [
        `Olá! Tenho interesse em:`,
        ``,
        `🛏️ *${item.productName}*`,
        `Tamanho: ${item.variantSize}${dims}`,
        `Preço: ${price}`,
        `SKU: ${item.variantSku}`,
        ``,
        `Gostaria de mais informações e finalizar a compra!`,
      ].join('\n');
      return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    },
    []
  );

  const value: CartContextValue = {
    items: state.items,
    totalItems,
    totalPrice,
    isOpen: state.isOpen,
    addItem,
    removeItem,
    increment,
    decrement,
    clearCart,
    openCart,
    closeCart,
    buildCartWhatsAppUrl,
    buildSingleItemWhatsAppUrl,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
