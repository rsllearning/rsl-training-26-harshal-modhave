import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { CartDrawer } from './components/CartDrawer';

export const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  return (
    <CartProvider>
      <div>
        <Header onOpenCart={() => setIsCartOpen(true)} />
        <main>
          <Catalog />
        </main>
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </CartProvider>
  );
};

export default App;