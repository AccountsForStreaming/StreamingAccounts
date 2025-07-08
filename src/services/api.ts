import axios from 'axios';
import { auth } from '../lib/firebase';
import type { ApiResponse, Product, Order, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login');
    }
    return Promise.reject(error);
  }
);

// Products API
export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    if (!response.data.data) {
      throw new Error('Product not found');
    }
    return response.data.data;
  },

  create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/products', product);
    if (!response.data.data) {
      throw new Error('Failed to create product');
    }
    return response.data.data;
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, product);
    if (!response.data.data) {
      throw new Error('Failed to update product');
    }
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

// Orders API
export const orderService = {
  create: async (orderData: {
    items: Array<{ productId: string; quantity: number }>;
    paymentMethod: 'stripe';
    paymentId?: string;
  }): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/orders', orderData);
    if (!response.data.data) {
      throw new Error('Failed to create order');
    }
    return response.data.data;
  },

  getByUser: async (userId: string): Promise<Order[]> => {
    const response = await api.get<ApiResponse<Order[]>>(`/orders/user/${userId}`);
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    if (!response.data.data) {
      throw new Error('Order not found');
    }
    return response.data.data;
  },

  getAll: async (): Promise<Order[]> => {
    const response = await api.get<ApiResponse<Order[]>>('/orders');
    return response.data.data || [];
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });
    if (!response.data.data) {
      throw new Error('Failed to update order status');
    }
    return response.data.data;
  },

  fulfillOrder: async (id: string, accounts: Array<{
    productId: string;
    credentials: { email: string; password: string; additionalInfo?: string };
  }>): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>(`/orders/${id}/fulfill`, { accounts });
    if (!response.data.data) {
      throw new Error('Failed to fulfill order');
    }
    return response.data.data;
  },

  // Admin functions
  admin: {
    getAll: async (): Promise<Order[]> => {
      const response = await api.get<ApiResponse<Order[]>>('/orders/admin/all');
      return response.data.data || [];
    },

    updateStatus: async (id: string, status: Order['status']): Promise<void> => {
      await api.patch<ApiResponse<void>>(`/orders/admin/${id}/status`, { status });
    },

    addResponse: async (id: string, adminResponse: string): Promise<void> => {
      await api.patch<ApiResponse<void>>(`/orders/admin/${id}/response`, { adminResponse });
    },
  },

  // User messaging
  addMessage: async (id: string, userMessage: string): Promise<void> => {
    await api.patch<ApiResponse<void>>(`/orders/${id}/message`, { userMessage });
  },
};

// Users API
export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/users/profile');
    if (!response.data.data) {
      throw new Error('Failed to get user profile');
    }
    return response.data.data;
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/users/profile', userData);
    if (!response.data.data) {
      throw new Error('Failed to update profile');
    }
    return response.data.data;
  },

  getAll: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data.data || [];
  },

  makeAdmin: async (userId: string): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${userId}/admin`, { isAdmin: true });
    if (!response.data.data) {
      throw new Error('Failed to make user admin');
    }
    return response.data.data;
  },
};

// Payment API
export const paymentService = {
  createStripePaymentIntent: async (amount: number): Promise<{ clientSecret: string }> => {
    const response = await api.post<ApiResponse<{ clientSecret: string }>>('/payments/stripe/create-intent', {
      amount: Math.round(amount * 100), // Convert to cents
    });
    if (!response.data.data) {
      throw new Error('Failed to create payment intent');
    }
    return response.data.data;
  },

  createPayPalOrder: async (amount: number): Promise<{ orderID: string }> => {
    const response = await api.post<ApiResponse<{ orderID: string }>>('/payments/paypal/create-order', {
      amount,
    });
    if (!response.data.data) {
      throw new Error('Failed to create PayPal order');
    }
    return response.data.data;
  },

  capturePayPalOrder: async (orderID: string): Promise<{ paymentID: string }> => {
    const response = await api.post<ApiResponse<{ paymentID: string }>>('/payments/paypal/capture-order', {
      orderID,
    });
    if (!response.data.data) {
      throw new Error('Failed to capture PayPal order');
    }
    return response.data.data;
  },
};

export default api;
