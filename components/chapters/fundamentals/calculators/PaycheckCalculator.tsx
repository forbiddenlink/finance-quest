'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Lightbulb, DollarSign, TrendingDown, Calculator, AlertCircle } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';

interface PaycheckBreakdown {
  grossPay: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  stateDisability?: number;
  healthInsurance?: number;
  retirement401k?: number;
  netPay: number;
}

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export default function PaycheckCalculator() {
  const [grossPay, setGrossPay] = useState<string>('5000');
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [state, setState] = useState<string>('CA');
  const [healthInsurance, setHealthInsurance] = useState<string>('200');
  const [retirement401k, setRetirement401k] = useState<string>('5'); // percentage
  const [breakdown, setBreakdown] = useState<PaycheckBreakdown | null>(null);
  const recordCalculatorUsage = useProgressStore(state => state.recordCalculatorUsage);

  // Track calculator usage for analytics
  useEffect(() => {
    recordCalculatorUsage('paycheck-calculator');
  }, [recordCalculatorUsage]);

  // Federal tax brackets for 2024 (simplified)
  const federalBrackets: Record<string, TaxBracket[]> = useMemo(() => ({
    single: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11000, max: 44725, rate: 0.12 },
      { min: 44725, max: 95375, rate: 0.22 },
      { min: 95375, max: 182050, rate: 0.24 },
      { min: 182050, max: 231250, rate: 0.32 },
      { min: 231250, max: 578125, rate: 0.35 },
      { min: 578125, max: Infinity, rate: 0.37 }
    ],
    married: [
      { min: 0, max: 22000, rate: 0.10 },
      { min: 22000, max: 89450, rate: 0.12 },
      { min: 89450, max: 190750, rate: 0.22 },
      { min: 190750, max: 364200, rate: 0.24 },
      { min: 364200, max: 462500, rate: 0.32 },
      { min: 462500, max: 693750, rate: 0.35 },
      { min: 693750, max: Infinity, rate: 0.37 }
    ]
  }), []);

  // State tax rates (simplified - using flat rates for demo)
  const stateTaxRates: Record<string, number> = useMemo(() => ({
    'CA': 0.08,  // California
    'NY': 0.07,  // New York
    'TX': 0.00,  // Texas (no state income tax)
    'FL': 0.00,  // Florida (no state income tax)
    'WA': 0.00,  // Washington (no state income tax)
    'OR': 0.09,  // Oregon
    'NV': 0.00,  // Nevada (no state income tax)
    'IL': 0.05,  // Illinois
    'PA': 0.03,  // Pennsylvania
    'OH': 0.04   // Ohio
  }), []);

  const calculateFederalTax = useCallback((annualIncome: number, status: 'single' | 'married'): number => {
    const brackets = federalBrackets[status];
    let tax = 0;
    let remainingIncome = annualIncome;

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;

      const taxableInThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      tax += taxableInThisBracket * bracket.rate;
      remainingIncome -= taxableInThisBracket;
    }

    return tax / 12; // Monthly tax
  }, [federalBrackets]);

  const calculatePaycheck = useCallback(() => {
    const gross = parseFloat(grossPay);
    const healthIns = parseFloat(healthInsurance) || 0;
    const retirement401kPercent = parseFloat(retirement401k) || 0;

    if (isNaN(gross) || gross <= 0) return;

    // Pre-tax deductions
    const retirement401kAmount = gross * (retirement401kPercent / 100);
    const taxableIncome = gross - retirement401kAmount - healthIns;

    // Federal tax calculation using brackets
    const federalTax = calculateFederalTax(taxableIncome * 12, filingStatus);

    // State tax
    const stateTax = taxableIncome * (stateTaxRates[state] || 0);

    // Payroll taxes (on gross pay)
    const socialSecurity = Math.min(gross * 0.062, 160200 * 0.062 / 12); // 2024 SS wage base
    const medicare = gross * 0.0145;
    const stateDisability = gross * 0.001; // Approximate SDI rate

    const totalDeductions = federalTax + stateTax + socialSecurity + medicare +
      stateDisability + healthIns + retirement401kAmount;
    const netPay = gross - totalDeductions;

    const calculationResults = {
      grossPay: gross,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      stateDisability,
      healthInsurance: healthIns,
      retirement401k: retirement401kAmount,
      netPay
    };

    setBreakdown(calculationResults);
  }, [grossPay, filingStatus, state, healthInsurance, retirement401k, calculateFederalTax, stateTaxRates]);

  // Auto-calculate when inputs change
  useEffect(() => {
    if (grossPay) {
      calculatePaycheck();
    }
  }, [calculatePaycheck, grossPay]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Prepare data for charts
  const pieData = breakdown ? [
    { name: 'Take-Home Pay', value: breakdown.netPay, color: '#10B981' },
    { name: 'Federal Tax', value: breakdown.federalTax, color: '#EF4444' },
    { name: 'State Tax', value: breakdown.stateTax, color: '#F59E0B' },
    { name: 'Social Security', value: breakdown.socialSecurity, color: '#8B5CF6' },
    { name: 'Medicare', value: breakdown.medicare, color: '#EC4899' },
    { name: 'Health Insurance', value: breakdown.healthInsurance || 0, color: '#06B6D4' },
    { name: '401k Contribution', value: breakdown.retirement401k || 0, color: '#84CC16' }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Calculator className="w-8 h-8 text-blue-600" />
          Enhanced Paycheck Calculator
        </h2>
        <p className="text-gray-600">
          Get a detailed breakdown of your paycheck with federal tax brackets, state taxes, and deductions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Income & Tax Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Gross Pay
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={grossPay}
                    onChange={(e) => setGrossPay(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filing Status
                </label>
                <select
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value as 'single' | 'married')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas (No State Tax)</option>
                  <option value="FL">Florida (No State Tax)</option>
                  <option value="WA">Washington (No State Tax)</option>
                  <option value="OR">Oregon</option>
                  <option value="NV">Nevada (No State Tax)</option>
                  <option value="IL">Illinois</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="OH">Ohio</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Pre-Tax Deductions
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Insurance (Monthly)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={healthInsurance}
                    onChange={(e) => setHealthInsurance(e.target.value)}
                    className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  401(k) Contribution (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={retirement401k}
                    onChange={(e) => setRetirement401k(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="5"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Recommended: 10-15% for retirement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {breakdown && (
            <>
              {/* Summary Card */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paycheck Summary</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Gross Pay</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(breakdown.grossPay)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Take-Home Pay</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(breakdown.netPay)}</p>
                  </div>
                </div>

                <div className="bg-white bg-opacity-60 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Take-home percentage:</span>
                    <span className="font-semibold text-green-700">
                      {((breakdown.netPay / breakdown.grossPay) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total deductions:</span>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(breakdown.grossPay - breakdown.netPay)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Paycheck Breakdown</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData.filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h4>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Gross Pay</span>
                    <span className="text-lg font-semibold text-green-600">
                      {formatCurrency(breakdown.grossPay)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-700">Pre-Tax Deductions:</h5>
                    {breakdown.healthInsurance && breakdown.healthInsurance > 0 && (
                      <div className="flex justify-between items-center pl-4">
                        <span className="text-gray-600">Health Insurance</span>
                        <span className="text-blue-600">-{formatCurrency(breakdown.healthInsurance)}</span>
                      </div>
                    )}
                    {breakdown.retirement401k && breakdown.retirement401k > 0 && (
                      <div className="flex justify-between items-center pl-4">
                        <span className="text-gray-600">401(k) Contribution ({retirement401k}%)</span>
                        <span className="text-green-600">-{formatCurrency(breakdown.retirement401k)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-700">Taxes:</h5>
                    <div className="flex justify-between items-center pl-4">
                      <span className="text-gray-600">Federal Tax</span>
                      <span className="text-red-600">-{formatCurrency(breakdown.federalTax)}</span>
                    </div>
                    {breakdown.stateTax > 0 && (
                      <div className="flex justify-between items-center pl-4">
                        <span className="text-gray-600">State Tax ({state})</span>
                        <span className="text-red-600">-{formatCurrency(breakdown.stateTax)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pl-4">
                      <span className="text-gray-600">Social Security (6.2%)</span>
                      <span className="text-red-600">-{formatCurrency(breakdown.socialSecurity)}</span>
                    </div>
                    <div className="flex justify-between items-center pl-4">
                      <span className="text-gray-600">Medicare (1.45%)</span>
                      <span className="text-red-600">-{formatCurrency(breakdown.medicare)}</span>
                    </div>
                    {breakdown.stateDisability && breakdown.stateDisability > 0 && (
                      <div className="flex justify-between items-center pl-4">
                        <span className="text-gray-600">State Disability</span>
                        <span className="text-red-600">-{formatCurrency(breakdown.stateDisability)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
                    <span className="text-lg font-bold text-gray-900">Net Pay (Take-Home)</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(breakdown.netPay)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Educational Insights */}
      {breakdown && (
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Smart Financial Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Tax Efficiency
              </h4>
              <p>Your effective tax rate is {(((breakdown.federalTax + breakdown.stateTax) / breakdown.grossPay) * 100).toFixed(1)}%.
                Consider maximizing pre-tax deductions to reduce your taxable income.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Social Security & Medicare</h4>
              <p>These payroll taxes fund your future benefits. Social Security provides retirement income,
                while Medicare covers healthcare after age 65.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">401(k) Benefits</h4>
              <p>{breakdown.retirement401k && breakdown.retirement401k > 0
                ? `Great job! You're saving ${formatCurrency(breakdown.retirement401k * 12)} annually for retirement.`
                : 'Consider contributing to your 401(k) to reduce taxes and build retirement savings.'}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Take-Home Optimization</h4>
              <p>Your take-home rate of {((breakdown.netPay / breakdown.grossPay) * 100).toFixed(1)}% is {
                (breakdown.netPay / breakdown.grossPay) > 0.75 ? 'excellent' :
                  (breakdown.netPay / breakdown.grossPay) > 0.70 ? 'good' : 'typical'
              } for your income level.</p>
            </div>
          </div>

          {stateTaxRates[state] === 0 && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-sm text-green-800 flex items-center gap-1">
                <Lightbulb className="w-4 h-4" />
                <strong>Tax Advantage:</strong> {state} has no state income tax, giving you more take-home pay!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
