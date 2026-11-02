import React from 'react';

interface PaymentPanelProps {
  state: any;
  send: (event: any) => void;
}

export const PaymentPanel: React.FC<PaymentPanelProps> = ({ state, send }) => {
  const isSubmitting = state.matches('submitting');
  const isSuccess = state.matches('success');
  const orderResult = state.context.orderResult;
  const errorMessage = state.context.errorMessage;

  return (
    <div style={{ margin: '2rem', padding: '1.5rem', background: '#1e1e1e', borderRadius: '8px', border: '1px solid #333', color: '#fff' }}>
      <h3>Payment Gateway Panel (XState v5 Shared Actor)</h3>

      {isSubmitting && (
        <div style={{ color: '#4dabf7' }}>
          <p>⏳ Payment Submission in Flight (1.5s delay)...</p>
          <button 
            onClick={() => send({ type: 'CANCEL' })}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel Payment (Abort Request)
          </button>
        </div>
      )}

      {isSuccess && orderResult && (
        <div style={{ color: '#51cf66' }}>
          <h4>🎉 Order Completed Successfully!</h4>
          <p><strong>Order ID:</strong> {orderResult.id}</p>
          <p><strong>Total Paid:</strong> ${orderResult.total}</p>
          <button 
            onClick={() => send({ type: 'RESET' })}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Start New Order
          </button>
        </div>
      )}

      {!isSubmitting && !isSuccess && (
        <div>
          <p>Status: Ready to receive payment trigger from Cart Drawer or direct action.</p>
          {errorMessage && <p style={{ color: '#ff6b6b' }}>Previous Error: {errorMessage}</p>}
        </div>
      )}
    </div>
  );
};