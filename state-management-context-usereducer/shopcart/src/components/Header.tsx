import React from 'react';
import { useCartState } from '../context/CartContext';

interface HeaderProps {
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const { items } = useCartState();
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f5f5f5' }}>
      <h2>ShopCart</h2>
      <div className="toolbar">
        <button onClick={onOpenCart} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          CartBadge 🛒 <span>({totalCount})</span>
        </button>
      </div>
    </header>
  );
};