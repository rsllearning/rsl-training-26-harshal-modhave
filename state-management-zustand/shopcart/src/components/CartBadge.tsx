import React from 'react';
import { useCartStore, selectTotalCount } from '../store/useCartStore';

export const CartBadge: React.FC<{ onOpenCart: () => void }> = ({ onOpenCart }) => {
  const totalCount = useCartStore(selectTotalCount);

  return (
    <button onClick={onOpenCart} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
      CartBadge 🛒 <span>({totalCount})</span>
    </button>
  );
};