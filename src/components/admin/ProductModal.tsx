import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { auth } from '../../lib/firebase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockCount: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
  mode: 'create' | 'edit';
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  product,
  mode
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockCount: '',
    category: 'Streaming',
    imageUrl: '',
    isActive: true
  });

  const categories = [
    'Streaming',
    'Music',
    'Gaming',
    'Software',
    'Education',
    'Entertainment'
  ];

  // Initialize form data when modal opens or product changes
  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stockCount: product.stockCount.toString(),
        category: product.category,
        imageUrl: product.imageUrl || '',
        isActive: product.isActive
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        price: '',
        stockCount: '',
        category: 'Streaming',
        imageUrl: '',
        isActive: true
      });
    }
    setError(null);
  }, [product, mode, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    if (!formData.stockCount || parseInt(formData.stockCount) < 0) {
      setError('Stock count must be 0 or greater');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);

    try {
      // Get token from Firebase auth directly
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError('User not authenticated');
        return;
      }
      
      const token = await currentUser.getIdToken();
      const url = mode === 'create' 
        ? `${import.meta.env.VITE_API_URL}/products`
        : `${import.meta.env.VITE_API_URL}/products/${product?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          stockCount: parseInt(formData.stockCount),
          category: formData.category,
          imageUrl: formData.imageUrl.trim() || null,
          isActive: formData.isActive
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || `Failed to ${mode} product`);
      }
    } catch (err: any) {
      setError(err.message || `Error ${mode === 'create' ? 'creating' : 'updating'} product`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Create New Product' : 'Edit Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Netflix Premium Account"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe the product features and validity period..."
              required
            />
          </div>

          {/* Price and Stock - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (EUR) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="15.99"
                required
              />
            </div>

            <div>
              <label htmlFor="stockCount" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Count *
              </label>
              <input
                type="number"
                id="stockCount"
                name="stockCount"
                value={formData.stockCount}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="10"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Optional: Enter a URL for the product image
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
              Product is active and available for purchase
            </label>
          </div>

          {/* Image Preview */}
          {formData.imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Preview
              </label>
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                mode === 'create' ? 'Create Product' : 'Update Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
