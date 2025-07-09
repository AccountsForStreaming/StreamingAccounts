import React, { useState } from 'react';
import { Info, CreditCard, Smartphone } from 'lucide-react';
import type { CartItem } from '../../types';
import { paymentMethods, calculateFeeForMethod, getBestPaymentMethod, type FeeCalculation } from '../../utils/feeCalculator';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  onPaymentMethodChange?: (methodId: string, calculation: FeeCalculation) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, total, onPaymentMethodChange }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const currentCalculation = calculateFeeForMethod(total, selectedPaymentMethod);
  const bestMethod = getBestPaymentMethod(total);

  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    const calculation = calculateFeeForMethod(total, methodId);
    onPaymentMethodChange?.(methodId, calculation);
  };

  const getPaymentIcon = (methodId: string) => {
    switch (methodId) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'apple_pay':
      case 'google_pay':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

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

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
        <div className="space-y-2">
          {paymentMethods.slice(0, 4).map((method) => {
            const calculation = method.calculate(total);
            const isSelected = selectedPaymentMethod === method.id;
            const isBest = method.id === bestMethod.method.id;
            
            return (
              <div
                key={method.id}
                onClick={() => handlePaymentMethodChange(method.id)}
                className={`relative p-3 border rounded-lg cursor-pointer transition-colors ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {isBest && (
                  <div className="absolute -top-2 -right-2">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Lowest Fee
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                    </div>
                    {getPaymentIcon(method.id)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{method.name}</p>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      €{calculation.finalAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      +€{calculation.stripeFee.toFixed(2)} fee
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({items.length} items)</span>
          <span>€{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Processing Fee ({currentCalculation.description})</span>
          <span>€{currentCalculation.stripeFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>€{currentCalculation.finalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Fee Explanation */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">Payment Processing Fees</p>
            <p>
              Processing fees vary by payment method and are charged by our payment processor. 
              We show the exact total you'll pay upfront - no hidden charges.
            </p>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">Digital Delivery</p>
            <p>Your streaming account credentials will be delivered via email within 24 hours after payment confirmation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
