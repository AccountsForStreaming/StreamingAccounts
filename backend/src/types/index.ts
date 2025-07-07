export interface User {
  id: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockCount: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  deliveredAccounts?: DeliveredAccount[];
  userMessage?: string;
  adminResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DeliveredAccount {
  productId: string;
  credentials: {
    email: string;
    password: string;
    additionalInfo?: string;
  };
  deliveredAt: Date;
}

export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'processing' 
  | 'fulfilled' 
  | 'cancelled' 
  | 'refunded';

export type PaymentMethod = 'stripe' | 'paypal';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
