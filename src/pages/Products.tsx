import React from 'react';
import ProductList from '../components/products/ProductList';

const Products: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Streaming Accounts
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Browse our collection of premium streaming accounts. All accounts are verified, 
          secure, and come with instant delivery after purchase.
        </p>
      </div>

      {/* Product List */}
      <ProductList />
    </div>
  );
};

export default Products;
