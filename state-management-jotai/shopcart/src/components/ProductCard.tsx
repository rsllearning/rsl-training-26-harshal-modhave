import React from 'react';
import { useSetAtom } from 'jotai';
import { type Product } from '../types';
import { addItemAtom } from '../atoms/cartAtoms';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useSetAtom(addItemAtom);

  return (
    <div style={{ 
      border: '1px solid #333', 
      borderRadius: '8px', 
      padding: '1rem', 
      textAlign: 'center', 
      background: '#1e1e1e',
      color: '#fff'
    }}>
      <h3 style={{ color: '#fff' }}>{product.name}</h3>
      <p style={{ fontWeight: 'bold', color: '#4dabf7' }}>${product.price}</p>
      <button 
        onClick={() => addItem(product)}
        style={{ 
          padding: '0.5rem 1rem', 
          cursor: 'pointer', 
          backgroundColor: '#007bff', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '4px' 
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};