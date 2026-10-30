import React from 'react';
import { useCartStore, selectTotalPrice } from '../store/useCartStore';
import { CartItemsList } from './CartItemsList';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore(selectTotalPrice);
  const checkoutStatus = useCartStore((state) => state.checkoutStatus);
  const checkoutError = useCartStore((state) => state.checkoutError);
  const checkout = useCartStore((state) => state.checkout);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, width: '320px', height: '100%', background: '#fff', boxShadow: '-2px 0 5px rgba(0,0,0,0.2)', padding: '1rem', zIndex: 1000 }}>
      <button onClick={onClose} style={{ float: 'right', cursor: 'pointer' }}>Close ✕</button>
      <h2>Your Cart (Zustand)</h2>
      
      <CartItemsList />
      
      <hr />
      <div><strong>Total:</strong> ${totalPrice}</div>

      {checkoutError && <p style={{ color: 'red' }}>{checkoutError}</p>}

      <button 
        onClick={() => checkout()}
        disabled={items.length === 0 || checkoutStatus === 'submitting'}
        style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', cursor: 'pointer' }}
      >
        {checkoutStatus === 'submitting' ? 'Processing...' : 'Checkout'}
      </button>

      {checkoutStatus === 'success' && (
        <p style={{ color: 'green', marginTop: '0.5rem' }}>Order placed successfully!</p>
      )}
    </div>
  );
};