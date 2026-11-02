import React, { useState } from 'react';
import { useActor } from '@xstate/react';
import { checkoutMachine } from './machines/checkoutMachine';
import { CartSynchronizer } from './bridges/CartSynchronizer';
import { OrderCompletionBridge } from './bridges/OrderCompletionBridge';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { CartDrawer } from './components/CartDrawer';
import { PaymentPanel } from './components/PaymentPanel';

export const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [state, send] = useActor(checkoutMachine);

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#121212', color: '#ffffff' }}>
      {/* Headless Synchronization Components */}
      <CartSynchronizer send={send} />
      <OrderCompletionBridge isSuccess={state.matches('success')} />

      <Header onOpenCart={() => setIsCartOpen(true)} />
      
      <main>
        <Catalog />
        {/* PaymentPanel as a direct sibling component inside App */}
        <PaymentPanel state={state} send={send} />
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        state={state} 
        send={send} 
      />
    </div>
  );
};

export default App;