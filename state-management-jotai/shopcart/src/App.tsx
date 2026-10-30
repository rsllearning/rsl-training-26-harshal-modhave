import React, { useState } from 'react';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { CartDrawer } from './components/CartDrawer';

export const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#121212', color: '#ffffff' }}>
      <Header onOpenCart={() => setIsCartOpen(true)} />
      <main>
        <Catalog />
      </main>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default App;