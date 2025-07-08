import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import StripeCheckout from './StripeCheckout';
import { apiService } from '../../services/apiService';

interface CheckoutFormProps {
  total: number;
  onOrderComplete: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ total, onOrderComplete }) => {
  const { user } = useAuth();
  const { items } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState('');

  const createOrder = async (paymentId: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity,
        })),
        totalAmount: total,
        paymentMethod: 'stripe' as const,
        paymentId,
        userMessage: userMessage.trim() || undefined,
      };

      const response = await apiService.createOrder(orderData);
      
      if (response) {
        onOrderComplete(response.id);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error instanceof Error ? error.message : 'Failed to process order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripeSuccess = async (paymentId: string) => {
    await createOrder(paymentId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-800 font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Customer Information */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.displayName || 'Customer'}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Message */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Message (Optional)</h3>
        <div className="space-y-2">
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Add any special instructions or questions about your order..."
            className="w-full px-3 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            maxLength={500}
          />
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>You can ask questions or provide special instructions for your order</p>
            <span>{userMessage.length}/500</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
        
        <div className="border border-gray-200 rounded-lg p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="font-medium text-gray-900">Secure Payment</span>
              <p className="text-sm text-gray-600">
                Pay with card, Apple Pay, Google Pay, or other digital wallets
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Checkout */}
      <div className="border-t border-gray-200 pt-6">
        <StripeCheckout
          amount={total}
          onSuccess={handleStripeSuccess}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

export default CheckoutForm;
