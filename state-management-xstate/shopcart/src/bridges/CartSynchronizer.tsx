import React, { useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';

interface CartSynchronizerProps {
  send: (event: any) => void;
}

export const CartSynchronizer: React.FC<CartSynchronizerProps> = ({ send }) => {
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    send({ type: 'SYNC_CART', items });
  }, [items, send]);

  return null;
};