import React from 'react';
import { CartItemsList } from './CartItemsList';
import { useCartState } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items } = useCartState();
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, width: '300px', height: '100%', background: '#fff', boxShadow: '-2px 0 5px rgba(0,0,0,0.2)', padding: '1rem', zIndex: 1000 }}>
      <button onClick={onClose} style={{ float: 'right', cursor: 'pointer' }}>Close ✕</button>
      <h2>Your Cart</h2>
      <CartItemsList />
      <hr />
      <div><strong>Total:</strong> ${total}</div>
      <button style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', cursor: 'pointer' }} disabled={items.length === 0}>
        Checkout (Baseline UI)
      </button>
    </div>
  );
};