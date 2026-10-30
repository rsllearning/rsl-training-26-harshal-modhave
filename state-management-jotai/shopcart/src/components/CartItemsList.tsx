import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { cartItemsAtom, removeItemAtom } from '../atoms/cartAtoms';

export const CartItemsList: React.FC = () => {
  const items = useAtomValue(cartItemsAtom);
  const removeItem = useSetAtom(removeItemAtom);

  if (items.length === 0) {
    return <p style={{ color: '#aaa' }}>Your cart is empty.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {items.map((item) => (
        <li key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
          <div>
            <strong style={{ color: '#fff' }}>{item.product.name}</strong>
            <div style={{ color: '#aaa' }}>Qty: {item.quantity} × ${item.product.price}</div>
          </div>
          <button 
            onClick={() => removeItem(item.product.id)}
            style={{ color: '#ff6b6b', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};