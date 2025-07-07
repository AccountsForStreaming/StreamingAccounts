import React, { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import StripeCheckout from './StripeCheckout';
import { apiService } from '../../services/apiService';

interface CheckoutFormProps {
  total: number;
  onOrderComplete: (orderId: string) => void;
}

type PaymentMethod = 'stripe' | 'paypal';

const CheckoutForm: React.FC<CheckoutFormProps> = ({ total, onOrderComplete }) => {
  const { user } = useAuth();
  const { items } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState('');

  const createOrder = async (paymentMethodType: PaymentMethod, paymentId: string) => {
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
        paymentMethod: paymentMethodType,
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
    await createOrder('stripe', paymentId);
  };

  const handlePayPalSuccess = async (details: any) => {
    await createOrder('paypal', details.id);
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
            className="w-full px-3 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            maxLength={500}
          />
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>You can ask questions or provide special instructions for your order</p>
            <span>{userMessage.length}/500</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="stripe"
              checked={paymentMethod === 'stripe'}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-4 h-4 text-blue-600"
            />
            <div className="flex items-center space-x-2">
              <svg className="w-8 h-5" viewBox="0 0 40 24" fill="none">
                <rect width="40" height="24" rx="4" fill="#6772E5"/>
                <path d="M8.5 13.5C8.5 12.1193 9.61929 11 11 11H15C16.3807 11 17.5 12.1193 17.5 13.5C17.5 14.8807 16.3807 16 15 16H11C9.61929 16 8.5 14.8807 8.5 13.5Z" fill="white"/>
                <path d="M22.5 11H31.5V16H22.5V11Z" fill="white"/>
              </svg>
              <span className="font-medium text-gray-900">Credit/Debit Card</span>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-4 h-4 text-blue-600"
            />
            <div className="flex items-center space-x-2">
              <svg className="w-8 h-5" viewBox="0 0 40 24" fill="none">
                <rect width="40" height="24" rx="4" fill="#0070BA"/>
                <path d="M12 8H16C18.2091 8 20 9.79086 20 12C20 14.2091 18.2091 16 16 16H14L13 18H11L12 8Z" fill="white"/>
                <path d="M20 8H24C26.2091 8 28 9.79086 28 12C28 14.2091 26.2091 16 24 16H22L21 18H19L20 8Z" fill="#00A0E3"/>
              </svg>
              <span className="font-medium text-gray-900">PayPal</span>
            </div>
          </label>
        </div>
      </div>

      {/* Payment Forms */}
      <div className="border-t border-gray-200 pt-6">
        {paymentMethod === 'stripe' && (
          <StripeCheckout
            amount={total}
            onSuccess={handleStripeSuccess}
            disabled={isProcessing}
          />
        )}

        {paymentMethod === 'paypal' && (
          <div className="space-y-4">
            <PayPalButtons
              style={{ layout: 'vertical' }}
              disabled={isProcessing}
              createOrder={(_data, actions) => {
                return actions.order.create({
                  intent: 'CAPTURE',
                  purchase_units: [
                    {
                      amount: {
                        value: total.toFixed(2),
                        currency_code: 'USD',
                      },
                      description: `Streaming accounts order (${items.length} items)`,
                    },
                  ],
                });
              }}
              onApprove={async (_data, actions) => {
                if (actions.order) {
                  try {
                    const details = await actions.order.capture();
                    await handlePayPalSuccess(details);
                  } catch (error) {
                    console.error('PayPal capture error:', error);
                    setError('Failed to process PayPal payment');
                  }
                }
              }}
              onError={(error) => {
                console.error('PayPal error:', error);
                setError('PayPal payment failed');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutForm;
