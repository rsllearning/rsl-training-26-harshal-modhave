import React from 'react';
import { CartBadge } from './CartBadge';

interface HeaderProps {
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem', 
      background: '#1e1e1e', 
      borderBottom: '1px solid #333' 
    }}>
      <h2 style={{ margin: 0, color: '#fff' }}>ShopCart</h2>
      <div className="toolbar">
        <CartBadge onOpenCart={onOpenCart} />
      </div>
    </header>
  );
};