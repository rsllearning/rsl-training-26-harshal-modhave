import React from 'react';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = ['Dashboard', 'Products', 'Orders', 'Analytics', 'Settings'];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 flex flex-col justify-between p-4`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-bold tracking-wide">StoreAdmin</h2>
            <button 
              className="md:hidden text-slate-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
          <nav className="space-y-1">
            {navItems.map((item, idx) => (
              <a
                key={item}
                href="#"
                className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  idx === 1 
                    ? 'bg-brand-primary text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};