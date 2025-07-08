import React, { useState, useEffect } from 'react';
import { Package, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { Order } from '../types';
import { orderService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const UserOrders: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [userMessage, setUserMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await orderService.getByUser(user.id);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      showToast('error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedOrder || !userMessage.trim()) return;

    try {
      setSendingMessage(true);
      await orderService.addMessage(selectedOrder.id, userMessage);
      showToast('success', 'Message sent successfully');
      setUserMessage('');
      await loadOrders();
      
      // Update selected order
      const updatedOrder = orders.find(o => o.id === selectedOrder.id);
      if (updatedOrder) {
        setSelectedOrder({ ...updatedOrder, userMessage });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      showToast('error', 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'processing':
        return <Package className="w-4 h-4 text-purple-500" />;
      case 'fulfilled':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'refunded':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">When you make a purchase, your orders will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track your purchases and communicate with support</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedOrder?.id === order.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </div>
                </div>

                <div className="mb-2">
                  <div className="font-medium text-gray-900">
                    Order #{order.id.slice(-8)}
                  </div>
                  <div className="text-sm text-gray-600">
                    €{order.totalAmount.toFixed(2)} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {order.items[0]?.productName}
                    {order.items.length > 1 && ` +${order.items.length - 1} more`}
                  </div>
                  <div className="flex items-center space-x-2">
                    {order.userMessage && (
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                    )}
                    {order.adminResponse && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="Admin responded" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-4">
          {selectedOrder ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order #{selectedOrder.id.slice(-8)}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                {/* Order Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Order Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <div className="font-medium">€{selectedOrder.totalAmount.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment:</span>
                      <div className="font-medium capitalize">{selectedOrder.paymentMethod}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Ordered:</span>
                      <div className="font-medium">{formatDate(selectedOrder.createdAt)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Status Updated:</span>
                      <div className="font-medium">{formatDate(selectedOrder.updatedAt)}</div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">€{item.totalPrice.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivered Accounts */}
                {selectedOrder.deliveredAccounts && selectedOrder.deliveredAccounts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Your Account Details</h3>
                    <div className="space-y-3">
                      {selectedOrder.deliveredAccounts.map((account, index) => (
                        <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="text-sm space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-green-800">Account Credentials</span>
                              <span className="text-xs text-green-600">
                                Delivered: {formatDate(account.deliveredAt)}
                              </span>
                            </div>
                            <div><strong>Email:</strong> {account.credentials.email}</div>
                            <div><strong>Password:</strong> {account.credentials.password}</div>
                            {account.credentials.additionalInfo && (
                              <div><strong>Instructions:</strong> {account.credentials.additionalInfo}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Communication</h3>
                  
                  {/* Existing Messages */}
                  {(selectedOrder.userMessage || selectedOrder.adminResponse) && (
                    <div className="space-y-3 mb-4">
                      {selectedOrder.userMessage && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="text-sm font-medium text-blue-900 mb-1">Your Message:</div>
                          <div className="text-sm text-blue-800">{selectedOrder.userMessage}</div>
                        </div>
                      )}
                      {selectedOrder.adminResponse && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="text-sm font-medium text-green-900 mb-1">Support Response:</div>
                          <div className="text-sm text-green-800">{selectedOrder.adminResponse}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Send Message */}
                  <div className="space-y-3">
                    <textarea
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      placeholder="Send a message to support about this order..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!userMessage.trim() || sendingMessage}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{sendingMessage ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Order</h3>
                <p className="text-gray-600">Click on an order from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
