import React from 'react';

interface CheckoutButtonProps {
  canSubmit: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({ canSubmit, isSubmitting, onSubmit }) => {
  return (
    <button 
      onClick={onSubmit}
      disabled={!canSubmit || isSubmitting}
      style={{ 
        marginTop: '1rem', 
        width: '100%', 
        padding: '0.75rem', 
        backgroundColor: canSubmit ? '#28a745' : '#555', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: canSubmit ? 'pointer' : 'not-allowed' 
      }}
    >
      {isSubmitting ? 'Processing Payment...' : 'Proceed to Checkout'}
    </button>
  );
};