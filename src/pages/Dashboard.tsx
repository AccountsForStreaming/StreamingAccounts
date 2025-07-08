import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ImageModal } from '../components/common/ImageModal';
import type { Order } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState<{ [orderId: string]: string }>({});
  const [sendingMessage, setSendingMessage] = useState<string | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string; title: string } | null>(null);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const userOrders = await orderService.getByUser(user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders');
      setOrders([]); // Show empty state instead of sample data
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (orderId: string) => {
    const message = messageInput[orderId]?.trim();
    if (!message) {
      showToast('error', 'Please enter a message');
      return;
    }

    try {
      setSendingMessage(orderId);
      await orderService.addMessage(orderId, message);
      showToast('success', 'Message sent successfully');
      
      // Clear the message input
      setMessageInput(prev => ({ ...prev, [orderId]: '' }));
      
      // Reload orders to show the updated message
      await loadOrders();
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('error', 'Failed to send message');
    } finally {
      setSendingMessage(null);
    }
  };

  const handleImageClick = (imageUrl: string, alt: string, title: string) => {
    setSelectedImage({ url: imageUrl, alt, title });
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'paid':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-purple-600 bg-purple-100';
      case 'fulfilled':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'refunded':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">Please log in to view your dashboard.</p>
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.displayName || user.email}!</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fulfilled Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'fulfilled').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          </div>

          {error && (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-yellow-800">
                {error} - Showing sample data for demonstration
              </p>
            </div>
          )}

          {orders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.productName} x{item.quantity}
                        </span>
                        <span className="text-gray-900">${item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {order.deliveredAccounts && order.deliveredAccounts.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-green-900 mb-2">✓ Account Credentials</h4>
                      {order.deliveredAccounts.map((account, index) => (
                        <div key={index} className="text-sm space-y-1">
                          <p><strong>Email:</strong> {account.credentials.email}</p>
                          <p><strong>Password:</strong> {account.credentials.password}</p>
                          {account.credentials.additionalInfo && (
                            <p><strong>Note:</strong> {account.credentials.additionalInfo}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fulfillment Details */}
                  {order.fulfillment && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-green-900 mb-3">✓ Your Account Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p><strong>Email:</strong> {order.fulfillment.accountDetails.email}</p>
                          </div>
                          <div>
                            <p><strong>Password:</strong> {order.fulfillment.accountDetails.password}</p>
                          </div>
                        </div>
                        {order.fulfillment.accountDetails.additionalInfo && (
                          <div>
                            <p><strong>Additional Info:</strong> {order.fulfillment.accountDetails.additionalInfo}</p>
                          </div>
                        )}
                        <div className="border-t pt-2 mt-3">
                          <p className="text-green-700 text-xs">
                            <strong>Delivered:</strong> {new Date(order.fulfillment.fulfilledAt).toLocaleDateString()} at {new Date(order.fulfillment.fulfilledAt).toLocaleTimeString()}
                          </p>
                          <p className="text-green-700 text-xs">
                            <strong>Status:</strong> Account tested and verified ✓
                          </p>
                        </div>
                        {order.fulfillment.screenshotUrl && (
                          <div className="mt-3">
                            <p className="text-xs text-green-700 mb-2"><strong>Verification Screenshot:</strong></p>
                            <img
                              src={order.fulfillment.screenshotUrl.startsWith('http')                                ? order.fulfillment.screenshotUrl
                                : `https://streamingaccounts-backend.onrender.com${order.fulfillment.screenshotUrl}`}
                              alt="Account verification"
                              className="max-w-full h-auto rounded-lg border border-green-300 cursor-pointer hover:border-green-400 transition-colors"
                              style={{ maxHeight: '150px' }}
                              onClick={() => handleImageClick(
                                order.fulfillment?.screenshotUrl?.startsWith('http') 
                                  ? order.fulfillment.screenshotUrl 
                                  : `https://streamingaccounts-backend.onrender.com${order.fulfillment?.screenshotUrl}`,
                                'Account verification',
                                `Order #${order.id} - Verification Screenshot`
                              )}
                              title="Click to view full size"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* User Message Section */}
                  {order.userMessage && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-blue-900 mb-2">Your Message:</h4>
                      <p className="text-sm text-blue-800">{order.userMessage}</p>
                    </div>
                  )}

                  {/* Admin Response Section */}
                  {order.adminResponse && (
                    <div className="bg-purple-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-purple-900 mb-2">Admin Response:</h4>
                      <p className="text-sm text-purple-800">{order.adminResponse}</p>
                    </div>
                  )}

                  {/* Add Message Section - only show if order is not cancelled */}
                  {order.status !== 'cancelled' && order.status !== 'refunded' && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Send a Message:</h4>
                      <div className="space-y-3">
                        <textarea
                          value={messageInput[order.id] || ''}
                          onChange={(e) => setMessageInput(prev => ({ ...prev, [order.id]: e.target.value }))}
                          placeholder="Ask a question or provide additional information about your order..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                          maxLength={500}
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {messageInput[order.id]?.length || 0}/500
                          </span>
                          <button
                            onClick={() => handleSendMessage(order.id)}
                            disabled={sendingMessage === order.id || !messageInput[order.id]?.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            {sendingMessage === order.id ? 'Sending...' : 'Send Message'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Payment via {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                    </div>
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
              <Link
                to="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>

        {/* Image Modal */}
        {imageModalOpen && selectedImage && (
          <ImageModal
            isOpen={imageModalOpen}
            onClose={closeImageModal}
            imageUrl={selectedImage.url}
            alt={selectedImage.alt}
            title={selectedImage.title}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
