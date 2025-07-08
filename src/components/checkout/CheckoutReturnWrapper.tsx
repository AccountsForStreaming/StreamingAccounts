import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutReturn from './CheckoutReturn';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutReturnWrapper: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutReturn />
    </Elements>
  );
};

export default CheckoutReturnWrapper;
