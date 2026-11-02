import React from 'react';
import { CartBadge } from './CartBadge';

interface HeaderProps {
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
      <h2 style={{ margin: 0 }}>ShopCart</h2>
      <div className="toolbar">
        <CartBadge onOpenCart={onOpenCart} />
      </div>
    </header>
  );
};