import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js';
import { useCart } from '../../contexts/CartContext';
import { apiService } from '../../services/apiService';

const CheckoutReturn: React.FC = () => {
  const stripe = useStripe();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, total, clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = searchParams.get('payment_intent_client_secret');

    if (!clientSecret) {
      setStatus('error');
      setError('No payment information found');
      return;
    }

    const createOrderAndRedirect = async (paymentIntent: any) => {
      try {
        // Create order with the payment intent
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
          paymentId: paymentIntent.id,
        };

        const order = await apiService.createOrder(orderData);
        
        if (order) {
          // Clear cart and redirect to order confirmation
          clearCart();
          setTimeout(() => {
            navigate(`/order-confirmation/${order.id}`);
          }, 2000);
        } else {
          throw new Error('Failed to create order');
        }
      } catch (orderError) {
        console.error('Error creating order:', orderError);
        setStatus('error');
        setError('Payment successful but failed to create order. Please contact support at tikmohsh@gmail.com.');
      }
    };

    // Retrieve the PaymentIntent
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        setStatus('error');
        setError('Payment information not found');
        return;
      }

      switch (paymentIntent.status) {
        case 'succeeded':
          setStatus('success');
          // Create order and redirect
          createOrderAndRedirect(paymentIntent);
          break;
        case 'processing':
          setStatus('loading');
          // You might want to poll for status updates here
          break;
        case 'requires_payment_method':
          setStatus('error');
          setError('Payment failed. Please try again.');
          setTimeout(() => {
            navigate('/checkout');
          }, 3000);
          break;
        default:
          setStatus('error');
          setError('Something went wrong.');
          break;
      }
    }).catch(() => {
      setStatus('error');
      setError('Failed to verify payment status');
    });
  }, [stripe, searchParams, navigate, items, total, clearCart]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to order confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/checkout')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default CheckoutReturn;
