'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { useProgress } from '@/lib/context/ProgressContext';

interface Debt {
  id: string;
  name: string;
  balance: number;
  minimumPayment: number;
  interestRate: number;
  type: 'credit_card' | 'student_loan' | 'auto_loan' | 'personal_loan' | 'mortgage';
  icon: string;
}

interface PayoffProjection {
  month: number;
  totalBalance: number;
  totalPaid: number;
  totalInterest: number;
  debtsFree: number;
}

export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card 1', balance: 5000, minimumPayment: 125, interestRate: 18.99, type: 'credit_card', icon: '💳' },
    { id: '2', name: 'Student Loan', balance: 25000, minimumPayment: 300, interestRate: 5.5, type: 'student_loan', icon: '🎓' },
    { id: '3', name: 'Car Loan', balance: 15000, minimumPayment: 350, interestRate: 6.5, type: 'auto_loan', icon: '🚗' },
  ]);

  const [extraPayment, setExtraPayment] = useState(200);
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [projectionData, setProjectionData] = useState<PayoffProjection[]>([]);

  const { dispatch } = useProgress();

  useEffect(() => {
    // Track calculator usage
    dispatch({
      type: 'USE_CALCULATOR',
      payload: 'DebtPayoffCalculator'
    });
  }, [dispatch]);

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: 'New Debt',
      balance: 1000,
      minimumPayment: 50,
      interestRate: 15,
      type: 'credit_card',
      icon: '💳'
    };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(prev => prev.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ));
  };

  const removeDebt = (id: string) => {
    setDebts(prev => prev.filter(debt => debt.id !== id));
  };

  const calculatePayoffStrategy = () => {
    if (debts.length === 0) return [];

    // Clone debts for calculation
    let remainingDebts = debts.map(debt => ({ ...debt }));
    const projections: PayoffProjection[] = [];
    let month = 0;
    let totalPaid = 0;
    let totalInterest = 0;

    // Sort debts based on strategy
    if (strategy === 'avalanche') {
      // Highest interest rate first
      remainingDebts.sort((a, b) => b.interestRate - a.interestRate);
    } else {
      // Smallest balance first (snowball)
      remainingDebts.sort((a, b) => a.balance - b.balance);
    }

    while (remainingDebts.length > 0 && month < 360) { // Cap at 30 years
      month++;
      let monthlyExtraPayment = extraPayment;

      // Apply minimum payments and interest to all debts
      remainingDebts.forEach(debt => {
        const monthlyInterest = (debt.balance * (debt.interestRate / 100)) / 12;
        totalInterest += monthlyInterest;
        debt.balance += monthlyInterest;
        
        const payment = Math.min(debt.minimumPayment, debt.balance);
        debt.balance -= payment;
        totalPaid += payment;
      });

      // Apply extra payment to target debt (first in sorted array)
      if (remainingDebts.length > 0 && monthlyExtraPayment > 0) {
        const targetDebt = remainingDebts[0];
        const extraPaymentApplied = Math.min(monthlyExtraPayment, targetDebt.balance);
        targetDebt.balance -= extraPaymentApplied;
        totalPaid += extraPaymentApplied;
      }

      // Remove paid-off debts
      const debtsBefore = remainingDebts.length;
      remainingDebts = remainingDebts.filter(debt => debt.balance > 0.01);
      const debtsFreed = debtsBefore - remainingDebts.length;

      const totalBalance = remainingDebts.reduce((sum, debt) => sum + debt.balance, 0);

      projections.push({
        month,
        totalBalance: Math.round(totalBalance),
        totalPaid: Math.round(totalPaid),
        totalInterest: Math.round(totalInterest),
        debtsFree: debts.length - remainingDebts.length
      });

      if (totalBalance < 0.01) break;
    }

    return projections;
  };

  useEffect(() => {
    const projections = calculatePayoffStrategy();
    setProjectionData(projections);
  }, [debts, extraPayment, strategy]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDebtTypeColor = (type: string) => {
    const colors = {
      'credit_card': 'bg-red-50 border-red-200',
      'student_loan': 'bg-blue-50 border-blue-200',
      'auto_loan': 'bg-green-50 border-green-200',
      'personal_loan': 'bg-yellow-50 border-yellow-200',
      'mortgage': 'bg-purple-50 border-purple-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 border-gray-200';
  };

  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const payoffTime = projectionData.length > 0 ? projectionData[projectionData.length - 1]?.month || 0 : 0;
  const totalInterestPaid = projectionData.length > 0 ? projectionData[projectionData.length - 1]?.totalInterest || 0 : 0;

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Debt Payoff Calculator
        </h2>
        <p className="text-gray-600">
          Compare debt avalanche vs snowball strategies and see how extra payments accelerate your freedom
        </p>
      </div>

      {/* Strategy Selection and Extra Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Payoff Strategy</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                value="avalanche"
                checked={strategy === 'avalanche'}
                onChange={(e) => setStrategy(e.target.value as 'avalanche' | 'snowball')}
                className="text-blue-600"
              />
              <div>
                <span className="font-medium text-blue-900">Debt Avalanche</span>
                <p className="text-sm text-blue-700">Pay minimums on all debts, extra goes to highest interest rate</p>
              </div>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                value="snowball"
                checked={strategy === 'snowball'}
                onChange={(e) => setStrategy(e.target.value as 'avalanche' | 'snowball')}
                className="text-blue-600"
              />
              <div>
                <span className="font-medium text-blue-900">Debt Snowball</span>
                <p className="text-sm text-blue-700">Pay minimums on all debts, extra goes to smallest balance</p>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-3">💰 Extra Monthly Payment</h3>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
              min="0"
              step="25"
            />
          </div>
          <p className="text-sm text-green-700 mt-2">
            Any amount helps! Even $50 extra can save thousands in interest.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-sm font-medium text-red-600">Total Debt</p>
          <p className="text-xl font-bold text-red-800">{formatCurrency(totalBalance)}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm font-medium text-blue-600">Payoff Time</p>
          <p className="text-xl font-bold text-blue-800">{payoffTime} months</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-sm font-medium text-yellow-600">Interest Paid</p>
          <p className="text-xl font-bold text-yellow-800">{formatCurrency(totalInterestPaid)}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-sm font-medium text-green-600">Monthly Payment</p>
          <p className="text-xl font-bold text-green-800">{formatCurrency(totalMinimumPayments + extraPayment)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Debt List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Your Debts</h3>
            <button
              onClick={addDebt}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              + Add Debt
            </button>
          </div>

          {debts.map((debt, index) => (
            <div key={debt.id} className={`${getDebtTypeColor(debt.type)} border rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{debt.icon}</span>
                  <input
                    type="text"
                    value={debt.name}
                    onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                    className="font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1"
                  />
                </div>
                {strategy === 'avalanche' && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    #{index + 1} Priority
                  </span>
                )}
                {strategy === 'snowball' && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    #{index + 1} Priority
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-gray-600">Balance</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                    <input
                      type="number"
                      value={debt.balance}
                      onChange={(e) => updateDebt(debt.id, 'balance', Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Min Payment</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                    <input
                      type="number"
                      value={debt.minimumPayment}
                      onChange={(e) => updateDebt(debt.id, 'minimumPayment', Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                      step="5"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Interest Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={debt.interestRate}
                      onChange={(e) => updateDebt(debt.id, 'interestRate', Number(e.target.value))}
                      className="w-full pl-2 pr-6 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                      max="50"
                      step="0.1"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">%</span>
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => removeDebt(debt.id)}
                    className="w-full bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Strategy Comparison */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-900 mb-3">🔍 Strategy Comparison</h4>
            <div className="text-sm text-indigo-800 space-y-2">
              <div>
                <strong>Debt Avalanche:</strong> Mathematically optimal - saves the most money in interest
              </div>
              <div>
                <strong>Debt Snowball:</strong> Psychologically motivating - builds momentum with quick wins
              </div>
              <div className="mt-2 p-2 bg-white bg-opacity-50 rounded">
                <strong>💡 Pro Tip:</strong> Choose avalanche to save money, snowball for motivation. Both beat minimum payments!
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Projections */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Payoff Projection</h3>

          {/* Debt Balance Over Time */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Debt Balance Over Time</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData.slice(0, Math.min(projectionData.length, 120))}> {/* Show max 10 years */}
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    labelFormatter={(month) => `Month ${month}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="totalBalance" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    name="Remaining Debt"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalInterest" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Total Interest Paid"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Motivation Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-3">🎉 Your Debt-Free Future</h4>
            <div className="space-y-2 text-sm text-green-800">
              <div>
                <strong>Freedom Date:</strong> {payoffTime > 0 ? `${Math.floor(payoffTime / 12)} years, ${payoffTime % 12} months` : 'Add debts to calculate'}
              </div>
              <div>
                <strong>Monthly Freedom:</strong> {formatCurrency(totalMinimumPayments + extraPayment)} back in your pocket
              </div>
              <div>
                <strong>Annual Freedom:</strong> {formatCurrency((totalMinimumPayments + extraPayment) * 12)} per year
              </div>
              <div className="mt-3 p-3 bg-white bg-opacity-50 rounded">
                <strong>💭 Imagine:</strong> What could you do with an extra {formatCurrency((totalMinimumPayments + extraPayment) * 12)} per year? 
                Vacation? Investment? Dream purchase? Your debt-free life is closer than you think!
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-3">💡 Debt Payoff Tips</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• <strong>Stop creating new debt:</strong> Cut up credit cards if needed</li>
              <li>• <strong>Find extra money:</strong> Sell unused items, pick up side work</li>
              <li>• <strong>Use windfalls wisely:</strong> Tax refunds and bonuses go to debt</li>
              <li>• <strong>Celebrate milestones:</strong> Each paid-off debt is a victory!</li>
              <li>• <strong>Stay motivated:</strong> Track progress visually with charts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
