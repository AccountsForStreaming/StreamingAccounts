import React from 'react';
import { TrendingDown, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { paymentMethods, getBestPaymentMethod } from '../../utils/feeCalculator';

interface FeeComparisonProps {
  amount: number;
  className?: string;
}

const FeeComparison: React.FC<FeeComparisonProps> = ({ amount, className = '' }) => {
  const bestMethod = getBestPaymentMethod(amount);
  const allCalculations = paymentMethods.map(method => ({
    method,
    calculation: method.calculate(amount)
  })).sort((a, b) => a.calculation.stripeFee - b.calculation.stripeFee);

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'apple_pay':
      case 'google_pay':
        return <Smartphone className="w-4 h-4" />;
      case 'sepa_debit':
        return <Building2 className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <TrendingDown className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Payment Method Comparison</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Choose the best payment method to minimize fees:
      </p>

      <div className="space-y-2">
        {allCalculations.slice(0, 4).map(({ method, calculation }) => {
          const isBest = method.id === bestMethod.method.id;
          const savings = calculation.stripeFee - bestMethod.calculation.stripeFee;
          
          return (
            <div
              key={method.id}
              className={`flex items-center justify-between p-2 rounded-lg ${
                isBest ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                {getMethodIcon(method.id)}
                <div>
                  <p className={`text-sm font-medium ${isBest ? 'text-green-900' : 'text-gray-900'}`}>
                    {method.name}
                    {isBest && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Best</span>}
                  </p>
                  <p className="text-xs text-gray-500">{calculation.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${isBest ? 'text-green-900' : 'text-gray-900'}`}>
                  €{calculation.finalAmount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {savings > 0 ? `+€${savings.toFixed(2)}` : isBest ? 'Lowest' : ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>💡 Tip:</strong> Save up to €{(allCalculations[allCalculations.length - 1].calculation.stripeFee - bestMethod.calculation.stripeFee).toFixed(2)} by choosing {bestMethod.method.name} instead of the most expensive option.
        </p>
      </div>
    </div>
  );
};

export default FeeComparison;
