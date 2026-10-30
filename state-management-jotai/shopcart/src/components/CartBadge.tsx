import React from 'react';
import { useAtomValue } from 'jotai';
import { totalItemCountAtom } from '../atoms/cartAtoms';

interface CartBadgeProps {
  onOpenCart: () => void;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ onOpenCart }) => {
  const totalCount = useAtomValue(totalItemCountAtom);

  return (
    <button 
      onClick={onOpenCart} 
      style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
    >
      Cart 🛒 <span>({totalCount})</span>
    </button>
  );
};