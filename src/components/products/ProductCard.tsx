import React, { useState } from 'react';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import ProductQuickView from './ProductQuickView';
import { truncateText, shouldTruncate } from '../../utils/textUtils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    addToCart(product);
  };

  const handleCardClick = () => {
    setShowQuickView(true);
  };

  const handleShowMore = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    setShowQuickView(true);
  };

  const shouldShowMoreButton = shouldTruncate(product.description, 100);

  return (
    <>
      <div 
        className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer relative group"
        onClick={handleCardClick}
      >
        {/* Quick View Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Product Image */}
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <img
            src={product.imageUrl || '/api/placeholder/400/225'}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <div className="text-sm text-gray-600 mt-1">
              <p className="leading-relaxed">
                {truncateText(product.description, 100)}
              </p>
              {shouldShowMoreButton && (
                <button
                  onClick={handleShowMore}
                  className="text-primary-600 hover:text-primary-700 font-medium mt-1 transition-colors text-sm"
                >
                  Show more
                </button>
              )}
            </div>
          </div>

        {/* Category and Stock */}
        <div className="flex items-center justify-between text-sm">
          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <span className={`px-2 py-1 rounded-full ${
            product.stockCount > 10
              ? 'bg-green-100 text-green-800'
              : product.stockCount > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stockCount > 0 ? `${product.stockCount} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Rating (placeholder) */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">(4.5)</span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-2xl font-bold text-primary-600">
            €{product.price.toFixed(2)}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stockCount === 0}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed z-10 relative"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>

      {/* Quick View Modal */}
      <ProductQuickView
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
};

export default ProductCard;
