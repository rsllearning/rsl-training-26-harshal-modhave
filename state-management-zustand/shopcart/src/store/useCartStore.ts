import { create } from 'zustand';
import type { Product, CartItem, CheckoutResult } from '../types';

export type CheckoutStatus = 'idle' | 'submitting' | 'success' | 'error';

interface CartState {
  items: CartItem[];
  checkoutStatus: CheckoutStatus;
  checkoutError: string | null;

  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  checkout: () => Promise<CheckoutResult | void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  checkoutStatus: 'idle',
  checkoutError: null,

  addItem: (product) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        };
        return { items: updatedItems };
      }

      return { items: [...state.items, { product, quantity: 1 }] };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  clearCart: () => set({ items: [], checkoutStatus: 'idle', checkoutError: null }),

  checkout: async () => {
    const { items } = get();
    if (items.length === 0) return;

    set({ checkoutStatus: 'submitting', checkoutError: null });

    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total }),
      });

      if (!response.ok) {
        throw new Error('Order submission failed');
      }

      const result: CheckoutResult = await response.json();
      set({ checkoutStatus: 'success', items: [] });
      return result;
    } catch (err: any) {
      set({
        checkoutStatus: 'error',
        checkoutError: err.message || 'Something went wrong',
      });
    }
  },
}));

// Derived Selectors (Calculated dynamically, not stored in state)
export const selectTotalCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectTotalPrice = (state: CartState) =>
  state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );