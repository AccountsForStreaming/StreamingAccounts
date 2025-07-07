import axios from 'axios';
import { auth } from '../lib/firebase';
import type { Product, Order, ApiResponse, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

// Auth API
export const authApi = {
  verifyToken: async (token: string): Promise<ApiResponse<User>> => {
    return api.post('/auth/verify', { token });
  },
};

// Products API
export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response: ApiResponse<Product[]> = await api.get('/products');
    return response.data || [];
  },

  getById: async (id: string): Promise<Product | null> => {
    const response: ApiResponse<Product> = await api.get(`/products/${id}`);
    return response.data || null;
  },

  create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const response: ApiResponse<Product> = await api.post('/products', product);
    return response.data!;
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response: ApiResponse<Product> = await api.put(`/products/${id}`, product);
    return response.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

// Orders API
export const orderService = {
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const response: ApiResponse<Order[]> = await api.get(`/orders/user/${userId}`);
    return response.data || [];
  },

  create: async (orderData: {
    items: Array<{ productId: string; quantity: number; unitPrice: number; productName: string; totalPrice: number }>;
    totalAmount: number;
    paymentMethod: 'stripe' | 'paypal';
    paymentId: string;
    userMessage?: string;
  }): Promise<Order> => {
    const response: ApiResponse<Order> = await api.post('/orders', orderData);
    return response.data!;
  },

  getById: async (id: string): Promise<Order | null> => {
    const response: ApiResponse<Order> = await api.get(`/orders/${id}`);
    return response.data || null;
  },
};

// Payments API
export const paymentService = {
  createStripeIntent: async (amount: number): Promise<{ clientSecret: string }> => {
    const response: ApiResponse<{ clientSecret: string }> = await api.post('/payments/stripe/create-intent', {
      amount: Math.round(amount * 100), // Convert to cents
    });
    return response.data!;
  },

  createPayPalOrder: async (amount: number): Promise<{ orderID: string }> => {
    const response: ApiResponse<{ orderID: string }> = await api.post('/payments/paypal/create-order', {
      amount,
    });
    return response.data!;
  },
};

// Users API
export const userService = {
  getProfile: async (): Promise<User | null> => {
    const response: ApiResponse<User> = await api.get('/users/profile');
    return response.data || null;
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response: ApiResponse<User> = await api.put('/users/profile', userData);
    return response.data!;
  },
};

// Combined API service
export const apiService = {
  ...authApi,
  products: productService,
  orders: orderService,
  payments: paymentService,
  users: userService,
  
  // Convenience methods
  createOrder: orderService.create,
};

export default api;
