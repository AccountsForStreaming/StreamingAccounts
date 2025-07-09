import React, { useState } from 'react';
import { X, ShoppingCart, Star, Package, Clock, Shield } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { formatDescription } from '../../utils/textUtils';

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose(); // Close modal after adding to cart
  };

  const features = [
    { icon: Shield, text: 'Secure Account Access' },
    { icon: Clock, text: 'Instant Delivery' },
    { icon: Package, text: product.validity || 'Valid for 1 Month' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={product.imageUrl || '/api/placeholder/600/400'}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
              
              {/* Category Badge */}
              <div className="flex">
                <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(4.5) • 127 reviews</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-primary-600">
                      €{product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Stock Available</div>
                    <div className={`font-semibold ${
                      product.stockCount > 5 ? 'text-green-600' : 
                      product.stockCount > 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.stockCount > 0 ? `${product.stockCount} units` : 'Out of Stock'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <div className="text-gray-600 leading-relaxed space-y-2">
                  {formatDescription(product.description).map((line, index) => (
                    <p key={index} className={line ? '' : 'h-2'}>
                      {line || ''}
                    </p>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">What's Included</h3>
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <feature.icon className="w-4 h-4 text-green-500 mr-3" />
                      <span className="text-sm text-gray-600">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      disabled={quantity >= product.stockCount}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stockCount === 0}
                    className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart - €{(product.price * quantity).toFixed(2)}
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Delivery:</span>
                    <span className="text-gray-600 ml-1">{product.delivery || 'Within 24 Hours'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Validity:</span>
                    <span className="text-gray-600 ml-1">{product.validity || '1 Month'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Support:</span>
                    <span className="text-gray-600 ml-1">{product.support || '24/7'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
