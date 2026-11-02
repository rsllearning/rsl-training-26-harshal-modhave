import React from 'react';

interface CartErrorBannerProps {
  errorMessage: string | null;
}

export const CartErrorBanner: React.FC<CartErrorBannerProps> = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return (
    <div style={{ backgroundColor: '#4a1515', color: '#ff6b6b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #ff6b6b' }}>
      <strong>Error:</strong> {errorMessage}
    </div>
  );
};