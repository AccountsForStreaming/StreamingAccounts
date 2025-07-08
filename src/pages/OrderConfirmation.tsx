import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/apiService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import type { Order } from '../types';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !user) {
        setError('Invalid order or user not authenticated');
        setLoading(false);
        return;
      }

      try {
        const orderData = await orderService.getById(orderId);
        if (orderData && orderData.userId === user.id) {
          setOrder(orderData);
        } else {
          setError('Order not found or access denied');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'fulfilled':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. We've received your order and will process it shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order #{order.id}</h2>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.productName}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">€{item.totalPrice.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">€{item.unitPrice.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Information</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-xl font-bold text-gray-900">€{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Delivery Information</h3>
              {order.status === 'fulfilled' && order.deliveredAccounts?.length ? (
                <div className="space-y-3">
                  <p className="text-sm text-green-600 font-medium">✓ Your accounts have been delivered!</p>
                  {order.deliveredAccounts.map((account, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Account {index + 1}</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Email:</strong> {account.credentials.email}</p>
                        <p><strong>Password:</strong> {account.credentials.password}</p>
                        {account.credentials.additionalInfo && (
                          <p><strong>Additional Info:</strong> {account.credentials.additionalInfo}</p>
                        )}
                        <p className="text-gray-600">
                          Delivered: {new Date(account.deliveredAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Processing Your Order</p>
                      <p>Your streaming account credentials will be delivered via email within 24 hours. You'll receive a notification once your order is fulfilled.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <Link
                to="/products"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 text-center"
              >
                Continue Shopping
              </Link>
              <Link
                to="/dashboard"
                className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200 text-center"
              >
                View All Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
