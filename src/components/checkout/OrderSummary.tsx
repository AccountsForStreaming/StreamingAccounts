import React from 'react';
import type { CartItem } from '../../types';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, total }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                src={item.product.imageUrl || '/placeholder-product.jpg'}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {item.product.name}
              </h3>
              <p className="text-sm text-gray-500">{item.product.category}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                <span className="text-sm font-medium text-gray-900">
                  €{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({items.length} items)</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>$0.00</span>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Digital Delivery</p>
            <p>Your streaming account credentials will be delivered via email within 24 hours after payment confirmation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
