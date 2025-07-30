'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Home, Calculator, DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import * as FinanceJS from 'financejs';

interface PaymentBreakdown {
  month: number;
  principal: number;
  interest: number;
  totalInterest: number;
  remainingBalance: number;
  payment: number;
}

interface AffordabilityData {
  category: string;
  amount: number;
  color: string;
}

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState<string>('400000');
  const [downPayment, setDownPayment] = useState<string>('80000');
  const [interestRate, setInterestRate] = useState<string>('6.5');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [propertyTax, setPropertyTax] = useState<string>('8000');
  const [homeInsurance, setHomeInsurance] = useState<string>('1200');
  const [pmi, setPmi] = useState<string>('200');
  const [hoaFees, setHoaFees] = useState<string>('0');
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState<string>('8000');

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentBreakdown[]>([]);
  const [affordabilityData, setAffordabilityData] = useState<AffordabilityData[]>([]);
  const [debtToIncomeRatio, setDebtToIncomeRatio] = useState(0);
  const [isAffordable, setIsAffordable] = useState(true);

  const finance = useMemo(() => new (FinanceJS as any)(), []); // eslint-disable-line @typescript-eslint/no-explicit-any

  const calculateMortgage = useCallback(() => {
    const price = parseFloat(homePrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const annualRate = (parseFloat(interestRate) || 0) / 100; // Annual interest rate
    const years = parseInt(loanTerm) || 30;
    const months = years * 12;
    const loanAmount = price - down;
    const monthlyIncome = parseFloat(grossMonthlyIncome) || 0;

    if (loanAmount <= 0 || annualRate <= 0 || months <= 0) return;

    // Calculate monthly mortgage payment using Finance.js PMT function
    // PMT(rate, nper, pv, fv, type) - rate as decimal per period, nper = periods, pv = present value
    const monthlyRate = annualRate / 12;
    const payment = Math.abs(finance.PMT(monthlyRate, months, loanAmount, 0, 0));

    // Additional monthly costs
    const monthlyPropertyTax = (parseFloat(propertyTax) || 0) / 12;
    const monthlyInsurance = (parseFloat(homeInsurance) || 0) / 12;
    const monthlyPMI = parseFloat(pmi) || 0;
    const monthlyHOA = parseFloat(hoaFees) || 0;

    const totalMonthlyPayment = payment + monthlyPropertyTax + monthlyInsurance + monthlyPMI + monthlyHOA;

    // Calculate total interest using Finance.js
    const totalPaidAmount = payment * months;
    const totalInterestPaid = totalPaidAmount - loanAmount;

    // Payment breakdown for first 12 months
    const schedule: PaymentBreakdown[] = [];
    let remainingBalance = loanAmount;
    let cumulativeInterest = 0;

    for (let month = 1; month <= Math.min(months, 60); month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = payment - interestPayment;
      remainingBalance -= principalPayment;
      cumulativeInterest += interestPayment;

      schedule.push({
        month,
        principal: principalPayment,
        interest: interestPayment,
        totalInterest: cumulativeInterest,
        remainingBalance: Math.max(0, remainingBalance),
        payment
      });
    }

    // Affordability analysis
    const dtiRatio = (totalMonthlyPayment / monthlyIncome) * 100;
    const remainingIncome = monthlyIncome - totalMonthlyPayment;
    
    const affordability: AffordabilityData[] = [
      { category: 'Housing Payment', amount: totalMonthlyPayment, color: '#EF4444' },
      { category: 'Remaining Income', amount: Math.max(0, remainingIncome), color: '#10B981' }
    ];

    setMonthlyPayment(payment);
    setTotalInterest(totalInterestPaid);
    setTotalPaid(totalPaidAmount);
    setPaymentSchedule(schedule);
    setAffordabilityData(affordability);
    setDebtToIncomeRatio(dtiRatio);
    setIsAffordable(dtiRatio <= 28); // 28% DTI rule

  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, homeInsurance, pmi, hoaFees, grossMonthlyIncome, finance]);

  useEffect(() => {
    calculateMortgage();
  }, [calculateMortgage]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const downPaymentPercent = ((parseFloat(downPayment) || 0) / (parseFloat(homePrice) || 1)) * 100;
  const loanAmount = (parseFloat(homePrice) || 0) - (parseFloat(downPayment) || 0);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any; label?: string }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold">{`Month ${label}`}</p>
          <p className="text-blue-600">
            {`Principal: ${formatCurrency(payload[0]?.value || 0)}`}
          </p>
          <p className="text-red-600">
            {`Interest: ${formatCurrency(payload[1]?.value || 0)}`}
          </p>
          <p className="text-gray-600">
            {`Remaining: ${formatCurrency(payload[0]?.payload?.remainingBalance || 0)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Home className="w-8 h-8 text-blue-600" />
          Professional Mortgage Calculator
        </h2>
        <p className="text-gray-600">
          Powered by Finance.js - Make informed home buying decisions with detailed payment analysis
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Controls */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Loan Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="400000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Down Payment ({downPaymentPercent.toFixed(1)}%)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="80000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Loan Amount: {formatCurrency(loanAmount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="6.5"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term
                </label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="25">25 years</option>
                  <option value="30">30 years</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Additional Costs</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Tax (Annual)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={propertyTax}
                    onChange={(e) => setPropertyTax(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="8000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home Insurance (Annual)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={homeInsurance}
                    onChange={(e) => setHomeInsurance(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="1200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PMI (Monthly)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={pmi}
                    onChange={(e) => setPmi(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="200"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Required if down payment &lt; 20%
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HOA Fees (Monthly)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={hoaFees}
                    onChange={(e) => setHoaFees(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Affordability Check</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gross Monthly Income
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={grossMonthlyIncome}
                  onChange={(e) => setGrossMonthlyIncome(e.target.value)}
                  className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="8000"
                />
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg border-2" style={{
              borderColor: isAffordable ? '#10B981' : '#EF4444',
              backgroundColor: isAffordable ? '#D1FAE5' : '#FEE2E2'
            }}>
              <div className="flex items-center gap-2 mb-2">
                {isAffordable ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-semibold ${isAffordable ? 'text-green-800' : 'text-red-800'}`}>
                  {isAffordable ? 'Affordable' : 'High Risk'}
                </span>
              </div>
              <p className={`text-sm ${isAffordable ? 'text-green-700' : 'text-red-700'}`}>
                Debt-to-Income Ratio: {debtToIncomeRatio.toFixed(1)}%
              </p>
              <p className={`text-xs ${isAffordable ? 'text-green-600' : 'text-red-600'}`}>
                Recommended: ≤28% for comfortable payments
              </p>
            </div>
          </div>
        </div>

        {/* Results and Charts */}
        <div className="xl:col-span-2 space-y-8">
          {/* Key Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center">
              <Calculator className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Monthly Payment</h3>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(monthlyPayment)}</p>
              <p className="text-sm text-blue-600">Principal & Interest</p>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Total Interest</h3>
              <p className="text-2xl font-bold text-red-700">{formatCurrency(totalInterest)}</p>
              <p className="text-sm text-red-600">Over {loanTerm} years</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-900">Total Paid</h3>
              <p className="text-2xl font-bold text-purple-700">{formatCurrency(totalPaid)}</p>
              <p className="text-sm text-purple-600">Loan + Interest</p>
            </div>
          </div>

          {/* Payment Schedule Chart */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown (First 5 Years)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentSchedule.slice(0, 60)}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="principal" stackId="a" fill="#3B82F6" name="Principal" />
                  <Bar dataKey="interest" stackId="a" fill="#EF4444" name="Interest" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Affordability Pie Chart */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Income Allocation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={affordabilityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {affordabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Tips */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">💡 Home Buying Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
          <div>
            <h4 className="font-semibold mb-2">Down Payment Strategy</h4>
            <p>20% down avoids PMI, but don&apos;t drain your emergency fund. Consider 10-15% if rates are low.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">The 28% Rule</h4>
            <p>Keep housing costs under 28% of gross income for comfortable payments and financial flexibility.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Rate Shopping</h4>
            <p>A 0.5% rate difference can save tens of thousands over the loan term. Shop with multiple lenders.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Hidden Costs</h4>
            <p>Budget for closing costs (2-5% of home price), moving expenses, and immediate repairs/improvements.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
