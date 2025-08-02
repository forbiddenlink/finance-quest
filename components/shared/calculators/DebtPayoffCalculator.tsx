'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  CreditCard,
  GraduationCap,
  Car,
  LucideIcon,
  DollarSign,
  Lightbulb,
  Search,
  MessageCircle
} from 'lucide-react';

interface Debt {
  id: string;
  name: string;
  balance: number;
  minimumPayment: number;
  interestRate: number;
  type: 'credit_card' | 'student_loan' | 'auto_loan' | 'personal_loan' | 'mortgage';
  icon: LucideIcon;
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
    { id: '1', name: 'Credit Card 1', balance: 5000, minimumPayment: 125, interestRate: 18.99, type: 'credit_card', icon: CreditCard },
    { id: '2', name: 'Student Loan', balance: 25000, minimumPayment: 300, interestRate: 5.5, type: 'student_loan', icon: GraduationCap },
    { id: '3', name: 'Car Loan', balance: 15000, minimumPayment: 350, interestRate: 6.5, type: 'auto_loan', icon: Car },
  ]);

  const [extraPayment, setExtraPayment] = useState(200);
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [projectionData, setProjectionData] = useState<PayoffProjection[]>([]);

  // Track calculator usage for analytics
  const recordCalculatorUsage = useProgressStore((state) => state.recordCalculatorUsage);

  useEffect(() => {
    // Track calculator usage
    recordCalculatorUsage('debt-payoff-calculator');
  }, [recordCalculatorUsage]);

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: 'New Debt',
      balance: 1000,
      minimumPayment: 50,
      interestRate: 15,
      type: 'credit_card',
      icon: CreditCard
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

  const calculatePayoffStrategy = useCallback(() => {
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
      const monthlyExtraPayment = extraPayment;

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
      remainingDebts = remainingDebts.filter(debt => debt.balance > 0.01);

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
  }, [debts, extraPayment, strategy]);

  useEffect(() => {
    const projections = calculatePayoffStrategy();
    setProjectionData(projections);
  }, [calculatePayoffStrategy]);

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
      'credit_card': '${theme.status.error.bg} ${theme.status.error.border}',
      'student_loan': '${theme.status.info.bg} ${theme.status.info.border}',
      'auto_loan': '${theme.status.success.bg} ${theme.status.success.border}',
      'personal_loan': '${theme.status.warning.bg} ${theme.status.warning.border}',
      'mortgage': `${theme.backgrounds.glass} ${theme.borderColors.accent}`
    };
    return colors[type as keyof typeof colors] || '${theme.backgrounds.glass} border ${theme.borderColors.primary} ${theme.borderColors.primary}';
  };

  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const payoffTime = projectionData.length > 0 ? projectionData[projectionData.length - 1]?.month || 0 : 0;
  const totalInterestPaid = projectionData.length > 0 ? projectionData[projectionData.length - 1]?.totalInterest || 0 : 0;

  return (
    <div className="max-w-7xl mx-auto ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="${theme.typography.heading2} ${theme.textColors.primary} mb-2">
          Debt Payoff Calculator
        </h2>
        <p className="${theme.textColors.secondary}">
          Compare debt avalanche vs snowball strategies and see how extra payments accelerate your freedom
        </p>
      </div>

      {/* Strategy Selection and Extra Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4">
          <h3 className="font-semibold ${theme.status.info.text} mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Payoff Strategy
          </h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                value="avalanche"
                checked={strategy === 'avalanche'}
                onChange={(e) => setStrategy(e.target.value as 'avalanche' | 'snowball')}
                className="text-blue-400"
              />
              <div>
                <span className="font-medium ${theme.status.info.text}">Debt Avalanche</span>
                <p className="text-sm ${theme.textColors.secondary}">Pay minimums on all debts, extra goes to highest interest rate</p>
              </div>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                value="snowball"
                checked={strategy === 'snowball'}
                onChange={(e) => setStrategy(e.target.value as 'avalanche' | 'snowball')}
                className="text-blue-400"
              />
              <div>
                <span className="font-medium ${theme.status.info.text}">Debt Snowball</span>
                <p className="text-sm ${theme.textColors.secondary}">Pay minimums on all debts, extra goes to smallest balance</p>
              </div>
            </label>
          </div>
        </div>

        <div className="${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-4">
          <h3 className="font-semibold ${theme.status.success.text} mb-3 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Extra Monthly Payment
          </h3>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}">$</span>
            <input
              type="number"
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${theme.typography.heading4}"
              min="0"
              step="25"
            />
          </div>
          <p className="text-sm ${theme.textColors.secondary} mt-2">
            Any amount helps! Even $50 extra can save thousands in interest.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="${theme.status.error.bg} border ${theme.status.error.border} rounded-lg p-4 text-center">
          <p className={`text-sm font-medium ${theme.status.error.text}`}>Total Debt</p>
          <p className="text-xl font-bold ${theme.textColors.primary}">{formatCurrency(totalBalance)}</p>
        </div>
        <div className="${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center">
          <p className={`text-sm font-medium ${theme.status.info.text}`}>Payoff Time</p>
          <p className="text-xl font-bold ${theme.textColors.secondary}">{payoffTime} months</p>
        </div>
        <div className="${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-4 text-center">
          <p className={`text-sm font-medium ${theme.status.warning.text}`}>Interest Paid</p>
          <p className="text-xl font-bold ${theme.status.warning.text}">{formatCurrency(totalInterestPaid)}</p>
        </div>
        <div className="${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-4 text-center">
          <p className="text-sm font-medium text-green-400">Monthly Payment</p>
          <p className="text-xl font-bold ${theme.textColors.primary}">{formatCurrency(totalMinimumPayments + extraPayment)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Debt List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="${theme.typography.heading4} ${theme.textColors.primary}">Your Debts</h3>
            <button
              onClick={addDebt}
              className={`${theme.status.info.bg.replace('/20', '')} text-white px-4 py-2 rounded-lg hover:${theme.status.info.bg.replace('/20', '/80')} transition-colors text-sm`}
            >
              + Add Debt
            </button>
          </div>

          {debts.map((debt, index) => (
            <div key={debt.id} className={`${getDebtTypeColor(debt.type)} border rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <debt.icon className="w-5 h-5 ${theme.textColors.secondary}" />
                  <input
                    type="text"
                    value={debt.name}
                    onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                    className="font-medium ${theme.textColors.primary} bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-2 py-1"
                  />
                </div>
                {strategy === 'avalanche' && (
                  <span className="text-xs bg-red-100 ${theme.textColors.primary} px-2 py-1 rounded">
                    #{index + 1} Priority
                  </span>
                )}
                {strategy === 'snowball' && (
                  <span className="text-xs bg-blue-100 ${theme.textColors.secondary} px-2 py-1 rounded">
                    #{index + 1} Priority
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs ${theme.textColors.secondary}">Balance</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs">$</span>
                    <input
                      type="number"
                      value={debt.balance}
                      onChange={(e) => updateDebt(debt.id, 'balance', Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-1 border ${theme.borderColors.primary} rounded text-sm"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs ${theme.textColors.secondary}">Min Payment</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs">$</span>
                    <input
                      type="number"
                      value={debt.minimumPayment}
                      onChange={(e) => updateDebt(debt.id, 'minimumPayment', Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-1 border ${theme.borderColors.primary} rounded text-sm"
                      min="0"
                      step="5"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs ${theme.textColors.secondary}">Interest Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={debt.interestRate}
                      onChange={(e) => updateDebt(debt.id, 'interestRate', Number(e.target.value))}
                      className="w-full pl-2 pr-6 py-1 border ${theme.borderColors.primary} rounded text-sm"
                      min="0"
                      max="50"
                      step="0.1"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs">%</span>
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => removeDebt(debt.id)}
                    className="w-full bg-red-100 text-red-400 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Strategy Comparison */}
          <div className={`${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-lg p-4`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
              <Search className="w-4 h-4" />
              Strategy Comparison
            </h4>
            <div className={`text-sm ${theme.textColors.secondary} space-y-2`}>
              <div>
                <strong>Debt Avalanche:</strong> Mathematically optimal - saves the most money in interest
              </div>
              <div>
                <strong>Debt Snowball:</strong> Psychologically motivating - builds momentum with quick wins
              </div>
              <div className="mt-2 p-2 ${theme.backgrounds.glass} border ${theme.borderColors.primary} bg-opacity-50 rounded">
                <strong>Pro Tip:</strong> Choose avalanche to save money, snowball for motivation. Both beat minimum payments!
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Projections */}
        <div className="space-y-6">
          <h3 className="${theme.typography.heading4} ${theme.textColors.primary}">Payoff Projection</h3>

          {/* Debt Balance Over Time */}
          <div className="${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4">
            <h4 className="font-semibold ${theme.textColors.primary} mb-4">Debt Balance Over Time</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData.slice(0, Math.min(projectionData.length, 120))}> {/* Show max 10 years */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis
                    dataKey="month"
                    label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <YAxis
                    tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                    label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    labelFormatter={(month) => `Month ${month}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalBalance"
                    stroke="#ef4444"
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
          <div className="bg-gradient-to-r from-blue-50 to-blue-50 border ${theme.status.info.border} rounded-lg p-4">
            <h4 className="font-semibold ${theme.status.success.text} mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Your Debt-Free Future
            </h4>
            <div className="space-y-2 text-sm ${theme.textColors.primary}">
              <div>
                <strong>Freedom Date:</strong> {payoffTime > 0 ? `${Math.floor(payoffTime / 12)} years, ${payoffTime % 12} months` : 'Add debts to calculate'}
              </div>
              <div>
                <strong>Monthly Freedom:</strong> {formatCurrency(totalMinimumPayments + extraPayment)} back in your pocket
              </div>
              <div>
                <strong>Annual Freedom:</strong> {formatCurrency((totalMinimumPayments + extraPayment) * 12)} per year
              </div>
              <div className="mt-3 p-3 ${theme.backgrounds.glass} border ${theme.borderColors.primary} bg-opacity-50 rounded">
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 mt-0.5 text-blue-400" />
                  <div>
                    <strong>Imagine:</strong> What could you do with an extra {formatCurrency((totalMinimumPayments + extraPayment) * 12)} per year?
                    Vacation? Investment? Dream purchase? Your debt-free life is closer than you think!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Debt Payoff Tips
            </h4>
            <ul className="text-sm ${theme.status.warning.text} space-y-1">
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
