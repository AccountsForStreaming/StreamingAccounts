// Stripe fee calculator based on Irish pricing
// Source: https://stripe.com/ie/pricing

export interface FeeCalculation {
  originalAmount: number;
  stripeFee: number;
  finalAmount: number;
  description: string;
}

export interface PaymentMethodFee {
  id: string;
  name: string;
  description: string;
  calculate: (amount: number) => FeeCalculation;
  popular?: boolean;
}

// Fee calculators for different payment methods
const calculateCardFee = (amount: number): FeeCalculation => {
  // Cards: 1.4% + €0.25
  const stripeFee = Math.round((amount * 0.014 + 0.25) * 100) / 100;
  return {
    originalAmount: amount,
    stripeFee,
    finalAmount: amount + stripeFee,
    description: '1.4% + €0.25'
  };
};

const calculatePayPalFee = (amount: number): FeeCalculation => {
  // PayPal: 3.4% + €0.35
  const stripeFee = Math.round((amount * 0.034 + 0.35) * 100) / 100;
  return {
    originalAmount: amount,
    stripeFee,
    finalAmount: amount + stripeFee,
    description: '3.4% + €0.35'
  };
};

const calculateSEPADebitFee = (amount: number): FeeCalculation => {
  // SEPA Direct Debit: 0.8% + €0.25 (capped at €5)
  const fee = Math.min(amount * 0.008 + 0.25, 5.0);
  const stripeFee = Math.round(fee * 100) / 100;
  return {
    originalAmount: amount,
    stripeFee,
    finalAmount: amount + stripeFee,
    description: '0.8% + €0.25 (max €5)'
  };
};

const calculateSofortFee = (amount: number): FeeCalculation => {
  // Sofort: 1.4% + €0.25
  const stripeFee = Math.round((amount * 0.014 + 0.25) * 100) / 100;
  return {
    originalAmount: amount,
    stripeFee,
    finalAmount: amount + stripeFee,
    description: '1.4% + €0.25'
  };
};

const calculateApplePayFee = (amount: number): FeeCalculation => {
  // Apple Pay / Google Pay: 1.4% + €0.25
  const stripeFee = Math.round((amount * 0.014 + 0.25) * 100) / 100;
  return {
    originalAmount: amount,
    stripeFee,
    finalAmount: amount + stripeFee,
    description: '1.4% + €0.25'
  };
};

const calculateBancontactFee = (amount: number): FeeCalculation => {
  // Bancontact: 1.4% + €0.25
  const stripeFee = Math.round((amount * 0.014 + 0.25) * 100) / 100;
  return {
    originalAmount: amount,
    stripeFee,
    finalAmount: amount + stripeFee,
    description: '1.4% + €0.25'
  };
};

export const paymentMethods: PaymentMethodFee[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, American Express',
    calculate: calculateCardFee,
    popular: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account',
    calculate: calculatePayPalFee
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    description: 'Quick payment with Touch ID or Face ID',
    calculate: calculateApplePayFee
  },
  {
    id: 'google_pay',
    name: 'Google Pay',
    description: 'Fast and secure Google payment',
    calculate: calculateApplePayFee // Same fees as Apple Pay
  },
  {
    id: 'sepa_debit',
    name: 'SEPA Direct Debit',
    description: 'Direct bank transfer (EU only)',
    calculate: calculateSEPADebitFee
  },
  {
    id: 'sofort',
    name: 'Sofort',
    description: 'Instant bank transfer',
    calculate: calculateSofortFee
  },
  {
    id: 'bancontact',
    name: 'Bancontact',
    description: 'Belgian payment method',
    calculate: calculateBancontactFee
  }
];

export const getPaymentMethodById = (id: string): PaymentMethodFee | undefined => {
  return paymentMethods.find(method => method.id === id);
};

export const calculateFeeForMethod = (amount: number, methodId: string): FeeCalculation => {
  const method = getPaymentMethodById(methodId);
  if (!method) {
    // Default to card fees if method not found
    return calculateCardFee(amount);
  }
  return method.calculate(amount);
};

// Helper to get the best (lowest fee) payment method for an amount
export const getBestPaymentMethod = (amount: number): { method: PaymentMethodFee; calculation: FeeCalculation } => {
  let bestMethod = paymentMethods[0];
  let bestCalculation = bestMethod.calculate(amount);
  
  for (const method of paymentMethods) {
    const calculation = method.calculate(amount);
    if (calculation.stripeFee < bestCalculation.stripeFee) {
      bestMethod = method;
      bestCalculation = calculation;
    }
  }
  
  return { method: bestMethod, calculation: bestCalculation };
};
