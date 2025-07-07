import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CartItem, Product, CartState } from '../types';
import { useToast } from './ToastContext';

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean };

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);

      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { productId: product.id, quantity, product }];
      }

      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        total,
      };
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.productId !== action.payload);
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        total,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      const newItems = quantity <= 0
        ? state.items.filter(item => item.productId !== productId)
        : state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          );

      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        total,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    loading: false,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        cartData.items.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_TO_CART', payload: { product: item.product, quantity: item.quantity } });
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({ items: state.items, total: state.total }));
  }, [state.items, state.total]);

  const addToCart = (product: Product, quantity = 1) => {
    // Check if product has sufficient stock
    const existingItem = state.items.find(item => item.productId === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    
    if (currentQuantity + quantity > product.stockCount) {
      showToast('error', `Sorry, only ${product.stockCount} items available in stock.`);
      return;
    }

    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    
    // Show success notification
    if (existingItem) {
      showToast('success', `Updated ${product.name} quantity in cart!`);
    } else {
      showToast('success', `${product.name} added to cart!`);
    }
  };

  const removeFromCart = (productId: string) => {
    const item = state.items.find(item => item.productId === productId);
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    
    if (item) {
      showToast('success', `${item.product.name} removed from cart!`);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = state.items.find(item => item.productId === productId);
    if (item && quantity > item.product.stockCount) {
      showToast('error', `Sorry, only ${item.product.stockCount} items available in stock.`);
      return;
    }

    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
