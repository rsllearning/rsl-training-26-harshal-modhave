import React from 'react';
import { useCartState, useCartDispatch } from '../context/CartContext';

export const CartItemsList: React.FC = () => {
  const { items } = useCartState();
  const dispatch = useCartDispatch();

  if (items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {items.map((item) => (
        <li key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
          <div>
            <strong>{item.product.name}</strong> x {item.quantity}
            <div>${item.product.price * item.quantity}</div>
          </div>
          <button 
            onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.product.id })}
            style={{ color: 'red', cursor: 'pointer' }}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};