import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';

const mockProducts = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 99.99, status: 'In Stock', isOutofStock: false, image: 'https://picsum.photos/400/250?random=1' },
  { id: 2, name: 'Ergonomic Office Chair', category: 'Furniture', price: 199.50, status: 'Low Stock', isOutofStock: false, image: 'https://picsum.photos/400/250?random=2' },
  { id: 3, name: 'Mechanical Keyboard', category: 'Electronics', price: 129.00, status: 'Out of Stock', isOutofStock: true, image: 'https://picsum.photos/400/250?random=3' },
  { id: 4, name: 'Ultra-wide Monitor', category: 'Electronics', price: 449.99, status: 'In Stock', isOutofStock: false, image: 'https://picsum.photos/400/250?random=4' },
  { id: 5, name: 'Smart Fitness Watch', category: 'Wearables', price: 149.95, status: 'In Stock', isOutofStock: false, image: 'https://picsum.photos/400/250?random=5' },
  { id: 6, name: 'Desk LED Light', category: 'Accessories', price: 39.99, status: 'Out of Stock', isOutofStock: true, image: 'https://picsum.photos/400/250?random=6' },
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAction = (product) => {
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex text-brand-text">
      {/* Navigation / Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="p-6">
          {/* Responsive Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAction={handleAction} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}