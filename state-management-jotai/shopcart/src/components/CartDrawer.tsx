import React from 'react';
import { useAtomValue } from 'jotai';
import { cartItemsAtom, totalPriceAtom } from '../atoms/cartAtoms';
import { CartItemsList } from './CartItemsList';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const items = useAtomValue(cartItemsAtom);
  const totalPrice = useAtomValue(totalPriceAtom);

  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      right: 0, 
      top: 0, 
      width: '320px', 
      height: '100%', 
      background: '#1e1e1e', 
      color: '#fff', 
      boxShadow: '-2px 0 10px rgba(0,0,0,0.5)', 
      padding: '1.5rem', 
      zIndex: 1000 
    }}>
      <button 
        onClick={onClose} 
        style={{ float: 'right', background: 'none', border: 'none', fontSize: '1.2rem', color: '#fff', cursor: 'pointer' }}
      >
        ✕
      </button>
      <h2>Shopping Cart (Jotai)</h2>
      
      <CartItemsList />
      
      <hr style={{ margin: '1rem 0', borderColor: '#333' }} />
      <div style={{ fontSize: '1.1rem', color: '#fff' }}>
        <strong>Total:</strong> ${totalPrice}
      </div>

      <button 
        disabled={items.length === 0}
        style={{ 
          marginTop: '1.5rem', 
          width: '100%', 
          padding: '0.75rem', 
          backgroundColor: items.length === 0 ? '#555' : '#28a745', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: items.length === 0 ? 'not-allowed' : 'pointer' 
        }}
      >
        Checkout
      </button>
    </div>
  );
};