import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './styles.css';

const queryClient = new QueryClient();

// API fetcher
const fetchProducts = async (searchTerm) => {
  const url = searchTerm 
    ? `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}`
    : 'https://dummyjson.com/products';
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await res.json();
  return data.products;
};

function ProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [queryTerm, setQueryTerm] = useState('');

  const {
    data: products,
    isPending,
    isFetching,
    isError,
    isSuccess,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', { search: queryTerm }],
    queryFn: () => fetchProducts(queryTerm),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQueryTerm(searchTerm);
  };

  return (
    <div className="container">
      <h2>Exercise 1: Product Listing</h2>

      <form onSubmit={handleSearchSubmit} className="controls">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={() => refetch()}>
          Refresh Products
        </button>
      </form>

      {/* Background Fetching Indicator */}
      {isFetching && !isPending && (
        <div className="fetching-banner">Updating data in background...</div>
      )}

      {/* Initial Loading State */}
      {isPending && <div>Loading initial products...</div>}

      {/* Error State */}
      {isError && (
        <div className="error-box">
          <p>Error: {error.message}</p>
          <button onClick={() => refetch()}>Try Again</button>
        </div>
      )}

      {/* Success State */}
      {isSuccess && (
        <div className="product-grid">
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <h3>{product.title}</h3>
                <p>Price: ${product.price}</p>
                <p><small>{product.category}</small></p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductList />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);