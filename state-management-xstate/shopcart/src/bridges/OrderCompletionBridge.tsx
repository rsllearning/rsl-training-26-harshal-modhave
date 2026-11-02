import React, { useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';

interface OrderCompletionBridgeProps {
  isSuccess: boolean;
}

export const OrderCompletionBridge: React.FC<OrderCompletionBridgeProps> = ({ isSuccess }) => {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (isSuccess) {
      clearCart();
    }
  }, [isSuccess, clearCart]);

  return null;
};