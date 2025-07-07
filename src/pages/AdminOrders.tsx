import React, { useState, useEffect } from 'react';
import { Package, Eye, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { Order } from '../types';
import { orderService } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { FulfillmentModal } from '../components/admin/FulfillmentModal';
import { ImageModal } from '../components/common/ImageModal';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [addingResponse, setAddingResponse] = useState(false);
  const [fulfillmentModalOpen, setFulfillmentModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string; title: string } | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.admin.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      showToast('error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdatingStatus(orderId);
      await orderService.admin.updateStatus(orderId, newStatus);
      showToast('success', 'Order status updated successfully');
      await loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        const updatedOrder = orders.find(o => o.id === orderId);
        if (updatedOrder) {
          setSelectedOrder({ ...updatedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      showToast('error', 'Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleAddResponse = async () => {
    if (!selectedOrder || !adminResponse.trim()) return;

    try {
      setAddingResponse(true);
      await orderService.admin.addResponse(selectedOrder.id, adminResponse);
      showToast('success', 'Response added successfully');
      setAdminResponse('');
      await loadOrders();
      const updatedOrder = orders.find(o => o.id === selectedOrder.id);
      if (updatedOrder) {
        setSelectedOrder({ ...updatedOrder, adminResponse });
      }
    } catch (error) {
      console.error('Failed to add response:', error);
      showToast('error', 'Failed to add response');
    } finally {
      setAddingResponse(false);
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

  const handleOrderFulfilled = (fulfilledOrder: Order) => {
    setOrders(orders.map(order => 
      order.id === fulfilledOrder.id ? fulfilledOrder : order
    ));
    if (selectedOrder && selectedOrder.id === fulfilledOrder.id) {
      setSelectedOrder(fulfilledOrder);
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

  const handleImageClick = (imageUrl: string, alt: string, title: string) => {
    setSelectedImage({ url: imageUrl, alt, title });
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <div className="text-sm text-gray-600">
          {orders.length} total orders
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">All Orders</h2>
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
                    {order.userEmail} • ${order.totalAmount.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center space-x-2">
                    {order.userMessage && (
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                    )}
                    <Eye className="w-4 h-4 text-gray-400" />
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
                  Order Details
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                {/* Order Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Order Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Order ID:</span>
                      <div className="font-medium">#{selectedOrder.id.slice(-8)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Customer:</span>
                      <div className="font-medium">{selectedOrder.userEmail}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <div className="font-medium">${selectedOrder.totalAmount.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment:</span>
                      <div className="font-medium capitalize">{selectedOrder.paymentMethod}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <div className="font-medium">{formatDate(selectedOrder.createdAt)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Updated:</span>
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
                          <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">${item.unitPrice.toFixed(2)} each</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Update Status</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['paid', 'processing', 'fulfilled', 'cancelled', 'refunded'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status as Order['status'])}
                        disabled={updatingStatus === selectedOrder.id || selectedOrder.status === status}
                        className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                          selectedOrder.status === status
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {updatingStatus === selectedOrder.id ? '...' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                  
                  {/* Fulfillment Button */}
                  {selectedOrder.status === 'paid' && !selectedOrder.fulfillment && (
                    <div className="mt-4">
                      <button
                        onClick={() => setFulfillmentModalOpen(true)}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Package className="w-4 h-4" />
                        <span>Fulfill Order</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Messages */}
                {(selectedOrder.userMessage || selectedOrder.adminResponse) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Messages</h3>
                    <div className="space-y-3">
                      {selectedOrder.userMessage && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="text-sm font-medium text-blue-900 mb-1">Customer Message:</div>
                          <div className="text-sm text-blue-800">{selectedOrder.userMessage}</div>
                        </div>
                      )}
                      {selectedOrder.adminResponse && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="text-sm font-medium text-green-900 mb-1">Admin Response:</div>
                          <div className="text-sm text-green-800">{selectedOrder.adminResponse}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Add Response */}
                {selectedOrder.userMessage && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      {selectedOrder.adminResponse ? 'Update Response' : 'Add Response'}
                    </h3>
                    <div className="space-y-3">
                      <textarea
                        value={adminResponse}
                        onChange={(e) => setAdminResponse(e.target.value)}
                        placeholder="Type your response to the customer..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={3}
                      />
                      <button
                        onClick={handleAddResponse}
                        disabled={!adminResponse.trim() || addingResponse}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingResponse ? 'Adding...' : 'Send Response'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Fulfillment Details */}
                {selectedOrder.fulfillment && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Fulfillment Details</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Account Email:</span>
                          <div className="font-medium">{selectedOrder.fulfillment.accountDetails.email}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Account Password:</span>
                          <div className="font-medium">{selectedOrder.fulfillment.accountDetails.password}</div>
                        </div>
                        {selectedOrder.fulfillment.accountDetails.additionalInfo && (
                          <div className="col-span-2">
                            <span className="text-gray-500">Additional Info:</span>
                            <div className="font-medium">{selectedOrder.fulfillment.accountDetails.additionalInfo}</div>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">Fulfilled At:</span>
                          <div className="font-medium">{formatDate(selectedOrder.fulfillment.fulfilledAt)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Account Tested:</span>
                          <div className="font-medium">
                            {selectedOrder.fulfillment.accountTested ? (
                              <span className="text-green-600">✓ Yes</span>
                            ) : (
                              <span className="text-red-600">✗ No</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {selectedOrder.fulfillment.notes && (
                        <div>
                          <span className="text-gray-500 text-sm">Admin Notes:</span>
                          <div className="font-medium text-sm">{selectedOrder.fulfillment.notes}</div>
                        </div>
                      )}
                      
                      {selectedOrder.fulfillment.screenshotUrl && (
                        <div>
                          <span className="text-gray-500 text-sm">Screenshot:</span>
                          <div className="mt-2">
                            <img
                              src={selectedOrder.fulfillment.screenshotUrl.startsWith('http') 
                                ? selectedOrder.fulfillment.screenshotUrl 
                                : `http://localhost:3001${selectedOrder.fulfillment.screenshotUrl}`}
                              alt="Account screenshot"
                              className="max-w-full h-auto rounded-lg border border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                              style={{ maxHeight: '200px' }}
                              onClick={() => handleImageClick(
                                selectedOrder.fulfillment.screenshotUrl.startsWith('http') 
                                  ? selectedOrder.fulfillment.screenshotUrl 
                                  : `http://localhost:3001${selectedOrder.fulfillment.screenshotUrl}`,
                                'Account screenshot',
                                `Order #${selectedOrder.id} - Account Screenshot`
                              )}
                              title="Click to view full size"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Delivered Accounts */}
                {selectedOrder.deliveredAccounts && selectedOrder.deliveredAccounts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Delivered Accounts</h3>
                    <div className="space-y-3">
                      {selectedOrder.deliveredAccounts.map((account, index) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="text-sm">
                            <div><strong>Email:</strong> {account.credentials.email}</div>
                            <div><strong>Password:</strong> {account.credentials.password}</div>
                            {account.credentials.additionalInfo && (
                              <div><strong>Additional Info:</strong> {account.credentials.additionalInfo}</div>
                            )}
                            <div className="text-gray-500 mt-2">
                              Delivered: {formatDate(account.deliveredAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
      
      {/* Fulfillment Modal */}
      {selectedOrder && (
        <FulfillmentModal
          order={selectedOrder}
          isOpen={fulfillmentModalOpen}
          onClose={() => setFulfillmentModalOpen(false)}
          onFulfilled={handleOrderFulfilled}
        />
      )}

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          isOpen={imageModalOpen}
          onClose={closeImageModal}
          imageUrl={selectedImage.url}
          alt={selectedImage.alt}
          title={selectedImage.title}
        />
      )}
    </div>
  );
};

export default AdminOrders;
