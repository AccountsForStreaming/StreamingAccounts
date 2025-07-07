import React, { useState, useEffect } from 'react';
import { Search, Filter, SortDesc } from 'lucide-react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import { productService } from '../../services/apiService';
import type { Product } from '../../types';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      const data = await productService.getAll();
      
      // If no products from API (demo mode), use sample data
      if (data.length === 0) {
        const sampleProducts: Product[] = [
          {
            id: 'netflix-1',
            name: 'Netflix Premium Account',
            description: 'Netflix Premium subscription with 4K streaming and up to 4 devices. Valid for 1 month.',
            price: 15.99,
            stockCount: 10,
            category: 'Streaming',
            imageUrl: '/placeholder-product.svg',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'spotify-1',
            name: 'Spotify Premium Account',
            description: 'Spotify Premium with ad-free music streaming and offline downloads. Valid for 1 month.',
            price: 9.99,
            stockCount: 15,
            category: 'Music',
            imageUrl: '/placeholder-product.svg',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'disney-1',
            name: 'Disney+ Premium Account',
            description: 'Disney+ Premium with access to Disney, Marvel, Star Wars, and National Geographic content. Valid for 1 month.',
            price: 12.99,
            stockCount: 8,
            category: 'Streaming',
            imageUrl: '/placeholder-product.svg',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'youtube-1',
            name: 'YouTube Premium Account',
            description: 'YouTube Premium with ad-free videos, YouTube Music, and offline downloads. Valid for 1 month.',
            price: 11.99,
            stockCount: 12,
            category: 'Streaming',
            imageUrl: '/placeholder-product.svg',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'prime-1',
            name: 'Amazon Prime Video Account',
            description: 'Amazon Prime Video with access to thousands of movies and TV shows. Valid for 1 month.',
            price: 8.99,
            stockCount: 6,
            category: 'Streaming',
            imageUrl: '/placeholder-product.svg',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'apple-1',
            name: 'Apple Music Account',
            description: 'Apple Music with access to over 100 million songs and exclusive content. Valid for 1 month.',
            price: 10.99,
            stockCount: 9,
            category: 'Music',
            imageUrl: '/placeholder-product.svg',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
        setProducts(sampleProducts);
      } else {
        setProducts(data.filter(p => p.isActive));
      }
      
      setError('');
    } catch (err) {
      // If API fails, fallback to sample data
      console.warn('API not available, using sample data:', err);
      const sampleProducts: Product[] = [
        {
          id: 'netflix-1',
          name: 'Netflix Premium Account',
          description: 'Netflix Premium subscription with 4K streaming and up to 4 devices. Valid for 1 month.',
          price: 15.99,
          stockCount: 10,
          category: 'Streaming',
          imageUrl: '/placeholder-product.svg',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'spotify-1',
          name: 'Spotify Premium Account',
          description: 'Spotify Premium with ad-free music streaming and offline downloads. Valid for 1 month.',
          price: 9.99,
          stockCount: 15,
          category: 'Music',
          imageUrl: '/placeholder-product.svg',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'disney-1',
          name: 'Disney+ Premium Account',
          description: 'Disney+ Premium with access to Disney, Marvel, Star Wars, and National Geographic content. Valid for 1 month.',
          price: 12.99,
          stockCount: 8,
          category: 'Streaming',
          imageUrl: '/placeholder-product.svg',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setProducts(sampleProducts);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'stock':
          return b.stockCount - a.stockCount;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg inline-block">
          {error}
        </div>
        <button
          onClick={loadProducts}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              className="input-field pl-10 pr-8"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <SortDesc className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              className="input-field pl-10 pr-8"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock">Stock Count</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No products found</div>
          <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
