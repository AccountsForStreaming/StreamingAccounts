import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { calculateFeeForMethod, type FeeCalculation } from '../utils/feeCalculator';

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [feeCalculation, setFeeCalculation] = useState<FeeCalculation>(() => 
    calculateFeeForMethod(total, 'card')
  );

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Redirect to cart if cart is empty
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const handlePaymentMethodChange = (_methodId: string, calculation: FeeCalculation) => {
    setFeeCalculation(calculation);
  };

  const handleOrderComplete = async (orderId: string) => {
    try {
      setIsProcessing(true);
      // Clear the cart after successful order
      clearCart();
      // Navigate to order confirmation page
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Error completing order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="lg:order-1">
          <CheckoutForm 
            total={feeCalculation.finalAmount}
            onOrderComplete={handleOrderComplete}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:order-2">
          <OrderSummary 
            items={items} 
            total={total} 
            onPaymentMethodChange={handlePaymentMethodChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
