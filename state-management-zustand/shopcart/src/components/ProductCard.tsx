import React from 'react';
import { type Product } from '../types';
import { useCartStore } from '../store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Subscribe ONLY to the addItem action
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button 
        onClick={() => addItem(product)}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Add to Cart
      </button>
    </div>
  );
};