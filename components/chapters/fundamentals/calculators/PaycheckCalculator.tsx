'use client';

import React, { useState, useEffect } from 'react';
import { useProgressActions } from '@/lib/context/ProgressContext';
import { Lightbulb } from 'lucide-react';

interface PaycheckBreakdown {
  grossPay: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  netPay: number;
}

export default function PaycheckCalculator() {
  const { useCalculator } = useProgressActions();
  const [grossPay, setGrossPay] = useState<string>('');
  const [breakdown, setBreakdown] = useState<PaycheckBreakdown | null>(null);
  const [hasUsedCalculator, setHasUsedCalculator] = useState(false);

  // Track calculator usage when first calculation is made
  useEffect(() => {
    if (breakdown && !hasUsedCalculator) {
      useCalculator('paycheck-calculator');
      setHasUsedCalculator(true);
    }
  }, [breakdown, hasUsedCalculator, useCalculator]);

  const calculatePaycheck = () => {
    const gross = parseFloat(grossPay);
    if (isNaN(gross) || gross <= 0) return;

    // Simplified tax calculations (rough estimates)
    const federalTax = gross * 0.12; // 12% federal tax bracket
    const stateTax = gross * 0.05; // 5% state tax (varies by state)
    const socialSecurity = gross * 0.062; // 6.2% Social Security
    const medicare = gross * 0.0145; // 1.45% Medicare

    const totalDeductions = federalTax + stateTax + socialSecurity + medicare;
    const netPay = gross - totalDeductions;

    setBreakdown({
      grossPay: gross,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      netPay
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Paycheck Calculator</h2>
      <p className="text-gray-600 mb-6">
        Enter your gross pay to see how taxes and deductions affect your take-home pay
      </p>

      {/* Input Section */}
      <div className="mb-6">
        <label htmlFor="grossPay" className="block text-sm font-medium text-gray-700 mb-2">
          Gross Pay (before taxes)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            id="grossPay"
            value={grossPay}
            onChange={(e) => setGrossPay(e.target.value)}
            placeholder="5000"
            className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={calculatePaycheck}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Calculate Take-Home Pay
        </button>
      </div>

      {/* Results Section */}
      {breakdown && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Paycheck Breakdown</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-medium text-gray-900">Gross Pay</span>
              <span className="text-lg font-semibold text-green-600">
                ${breakdown.grossPay.toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Deductions:</h4>
              <div className="flex justify-between items-center pl-4">
                <span className="text-gray-600">Federal Tax (12%)</span>
                <span className="text-red-600">-${breakdown.federalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pl-4">
                <span className="text-gray-600">State Tax (5%)</span>
                <span className="text-red-600">-${breakdown.stateTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pl-4">
                <span className="text-gray-600">Social Security (6.2%)</span>
                <span className="text-red-600">-${breakdown.socialSecurity.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pl-4">
                <span className="text-gray-600">Medicare (1.45%)</span>
                <span className="text-red-600">-${breakdown.medicare.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
              <span className="text-lg font-bold text-gray-900">Net Pay (Take-Home)</span>
              <span className="text-xl font-bold text-green-600">
                ${breakdown.netPay.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Educational Insights */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Key Insights
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your take-home pay is about {((breakdown.netPay / breakdown.grossPay) * 100).toFixed(0)}% of your gross pay</li>
              <li>• Social Security helps fund your future retirement benefits</li>
              <li>• Medicare provides healthcare coverage when you&apos;re older</li>
              <li>• Tax rates vary by income level and state</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
