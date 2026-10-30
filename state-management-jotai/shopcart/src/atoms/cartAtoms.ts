import { atom } from 'jotai';
import type { Product, CartItem } from '../types';

// Primitive Atom
export const cartItemsAtom = atom<CartItem[]>([]);

// Derived Read-Only Atoms (Recompute automatically without memory duplication or useMemo)
export const totalItemCountAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.quantity, 0)
);

export const totalPriceAtom = atom((get) =>
  get(cartItemsAtom).reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
);

// Action (Write-Only) Atoms
export const addItemAtom = atom(null, (get, set, product: Product) => {
  const currentItems = get(cartItemsAtom);
  const existingIndex = currentItems.findIndex(
    (item) => item.product.id === product.id
  );

  if (existingIndex > -1) {
    const updatedItems = [...currentItems];
    updatedItems[existingIndex] = {
      ...updatedItems[existingIndex],
      quantity: updatedItems[existingIndex].quantity + 1,
    };
    set(cartItemsAtom, updatedItems);
  } else {
    set(cartItemsAtom, [...currentItems, { product, quantity: 1 }]);
  }
});

export const removeItemAtom = atom(null, (get, set, productId: string) => {
  const currentItems = get(cartItemsAtom);
  set(
    cartItemsAtom,
    currentItems.filter((item) => item.product.id !== productId)
  );
});

export const clearCartAtom = atom(null, (_get, set) => {
  set(cartItemsAtom, []);
});