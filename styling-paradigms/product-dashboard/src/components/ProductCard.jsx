import React from 'react';

export const ProductCard = ({ product, onAction }) => {
  const { name, category, price, status, image, isOutofStock } = product;

  return (
    <div className="bg-brand-card border border-slate-200 rounded-custom p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Product Image */}
        <div className="overflow-hidden rounded-md mb-4 bg-slate-100 aspect-video">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Category & Status Badge */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
            {category}
          </span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              status === 'In Stock'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {status}
          </span>
        </div>

        {/* Product Title & Price */}
        <h3 className="text-lg font-bold text-brand-text truncate">{name}</h3>
        <p className="text-xl font-extrabold text-brand-primary mt-1 mb-4">
          ${price.toFixed(2)}
        </p>
      </div>

      {/* Action Button with Hover, Focus, and Disabled States */}
      <button
        onClick={() => onAction(product)}
        disabled={isOutofStock}
        className="w-full py-2 px-4 bg-brand-primary text-white font-medium rounded-md 
                   hover:bg-brand-hover active:bg-indigo-800 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-primary
                   transition-colors duration-150"
      >
        {isOutofStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};