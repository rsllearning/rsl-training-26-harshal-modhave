import React from 'react';
import { useCartStore, selectTotalPrice } from '../store/useCartStore';
import { CartItemsList } from './CartItemsList';
import { CartErrorBanner } from './CartErrorBanner';
import { CheckoutButton } from './CheckoutButton';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  state: any;
  send: (event: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, state, send }) => {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore(selectTotalPrice);

  if (!isOpen) return null;

  const isSubmitting = state.matches('submitting');
  const canSubmit = state.can({ type: 'SUBMIT_PAYMENT' });

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, width: '320px', height: '100%', background: '#1e1e1e', color: '#fff', boxShadow: '-2px 0 10px rgba(0,0,0,0.5)', padding: '1.5rem', zIndex: 1000 }}>
      <button onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', fontSize: '1.2rem', color: '#fff', cursor: 'pointer' }}>✕</button>
      <h2>Shopping Cart</h2>
      
      <CartErrorBanner errorMessage={state.context.errorMessage} />
      <CartItemsList />
      
      <hr style={{ margin: '1rem 0', borderColor: '#333' }} />
      <div style={{ fontSize: '1.1rem' }}><strong>Total:</strong> ${totalPrice}</div>

      <CheckoutButton 
        canSubmit={canSubmit} 
        isSubmitting={isSubmitting} 
        onSubmit={() => send({ type: 'SUBMIT_PAYMENT' })} 
      />
    </div>
  );
};