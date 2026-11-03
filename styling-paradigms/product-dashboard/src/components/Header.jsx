import React from 'react';

export const Header = ({ onToggleSidebar }) => {
  return (
    <header className="bg-brand-card border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-md"
        >
          ☰
        </button>
        <h1 className="text-2xl font-bold text-brand-text">Product Overview</h1>
      </div>
      <button 
        className="px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-md hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors"
      >
        + Add Product
      </button>
    </header>
  );
};