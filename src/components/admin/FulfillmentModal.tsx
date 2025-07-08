import React, { useState } from 'react';
import type { Order } from '../../types';
import { orderService } from '../../services/apiService';
import { useToast } from '../../contexts/ToastContext';

interface FulfillmentModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onFulfilled: (order: Order) => void;
}

export const FulfillmentModal: React.FC<FulfillmentModalProps> = ({
  order,
  isOpen,
  onClose,
  onFulfilled,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    additionalInfo: '',
    notes: '',
    accountTested: false,
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !screenshot || !formData.accountTested) {
      showToast('error', 'Please fill in all required fields and upload a screenshot');
      return;
    }

    setIsLoading(true);
    
    try {
      const fulfillmentFormData = new FormData();
      fulfillmentFormData.append('email', formData.email);
      fulfillmentFormData.append('password', formData.password);
      fulfillmentFormData.append('additionalInfo', formData.additionalInfo);
      fulfillmentFormData.append('notes', formData.notes);
      fulfillmentFormData.append('accountTested', 'true');
      fulfillmentFormData.append('screenshot', screenshot);

      const fulfilledOrder = await orderService.fulfill(order.id, fulfillmentFormData);
      
      showToast('success', 'Order fulfilled successfully! Email sent to customer.');
      onFulfilled(fulfilledOrder);
      onClose();
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        additionalInfo: '',
        notes: '',
        accountTested: false,
      });
      setScreenshot(null);
    } catch (error) {
      console.error('Error fulfilling order:', error);
      showToast('error', 'Error fulfilling order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      accountTested: e.target.checked,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setScreenshot(file);
      } else {
        showToast('error', 'Please upload an image file');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Fulfill Order #{order.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Order Details:</h3>
          {order.items.map((item, index) => (
            <div key={index} className="text-sm">
              {item.productName} x {item.quantity}
            </div>
          ))}
          <div className="font-semibold mt-2">
            Total: €{order.totalAmount.toFixed(2)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter account email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Password *
            </label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter account password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Information
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional account details or instructions"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Screenshot Proof *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload a screenshot showing the account working
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Internal notes about this fulfillment"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="accountTested"
              checked={formData.accountTested}
              onChange={handleCheckboxChange}
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="accountTested" className="text-sm font-medium text-gray-700">
              I confirm that I have tested the account and it is working *
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Fulfilling...' : 'Fulfill Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
