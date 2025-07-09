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
  // Quick view information
  validity?: string;
  delivery?: string;
  support?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
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
  fulfillment?: OrderFulfillment;
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

export interface OrderFulfillment {
  accountDetails: {
    email: string;
    password: string;
    additionalInfo?: string;
  };
  screenshotUrl: string;
  accountTested: boolean;
  fulfilledBy: string; // Admin user ID
  fulfilledAt: Date;
  notes?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'processing' 
  | 'fulfilled' 
  | 'cancelled' 
  | 'refunded';

export type PaymentMethod = 'stripe';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
