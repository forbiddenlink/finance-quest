'use client';

import React, { useState, useCallback } from 'react';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { CurrencyInput, RadioGroup } from '@/components/shared/calculators/FormFields';
import { ResultCard } from '@/components/shared/calculators/ResultComponents';
import { formatCurrency } from '@/lib/utils/financial';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { theme } from '@/lib/theme';
import {
  CreditCard,
  GraduationCap,
  Car,
  LucideIcon,
  DollarSign,
  Lightbulb,
  TrendingDown,
  Calendar,
  Target
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

  const [extraPayment, setExtraPayment] = useState('200');
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [projectionData, setProjectionData] = useState<PayoffProjection[]>([]);
  const [results, setResults] = useState({
    totalBalance: 0,
    payoffMonths: 0,
    totalInterest: 0,
    totalPayment: 0
  });

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

    const extraPaymentNum = parseFloat(extraPayment) || 0;
    let remainingDebts = debts.map(debt => ({ ...debt }));
    const projections: PayoffProjection[] = [];
    let month = 0;
    let totalPaid = 0;
    let totalInterest = 0;

    // Sort debts based on strategy
    if (strategy === 'avalanche') {
      remainingDebts.sort((a, b) => b.interestRate - a.interestRate);
    } else {
      remainingDebts.sort((a, b) => a.balance - b.balance);
    }

    while (remainingDebts.length > 0 && month < 360) { // Cap at 30 years
      month++;

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
      if (remainingDebts.length > 0 && extraPaymentNum > 0) {
        const targetDebt = remainingDebts[0];
        const extraPaymentApplied = Math.min(extraPaymentNum, targetDebt.balance);
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

  React.useEffect(() => {
    const projections = calculatePayoffStrategy();
    setProjectionData(projections);
    
    const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const payoffTime = projections.length > 0 ? projections[projections.length - 1]?.month || 0 : 0;
    const totalInterestPaid = projections.length > 0 ? projections[projections.length - 1]?.totalInterest || 0 : 0;
    
    setResults({
      totalBalance,
      payoffMonths: payoffTime,
      totalInterest: totalInterestPaid,
      totalPayment: totalMinimumPayments + parseFloat(extraPayment || '0')
    });
  }, [calculatePayoffStrategy, debts, extraPayment]);

  const handleReset = () => {
    setDebts([
      { id: '1', name: 'Credit Card 1', balance: 5000, minimumPayment: 125, interestRate: 18.99, type: 'credit_card', icon: CreditCard },
      { id: '2', name: 'Student Loan', balance: 25000, minimumPayment: 300, interestRate: 5.5, type: 'student_loan', icon: GraduationCap },
      { id: '3', name: 'Car Loan', balance: 15000, minimumPayment: 350, interestRate: 6.5, type: 'auto_loan', icon: Car },
    ]);
    setExtraPayment('200');
    setStrategy('avalanche');
  };

  // Generate insights based on calculations
  const generateInsights = () => {
    const insights = [];
    
    const extraPaymentNum = parseFloat(extraPayment) || 0;

    // High interest debt warning
    const highInterestDebts = debts.filter(debt => debt.interestRate > 15);
    if (highInterestDebts.length > 0) {
      insights.push({
        type: 'warning' as const,
        title: 'High-Interest Debt Alert',
        message: `You have ${highInterestDebts.length} debt(s) above 15% interest. These should be your top priority for extra payments.`
      });
    }

    // Strategy effectiveness insight
    if (extraPaymentNum > 100) {
      const monthsSaved = Math.max(0, 360 - results.payoffMonths); // Rough estimate
      insights.push({
        type: 'success' as const,
        title: 'Excellent Payment Strategy',
        message: `Your ${formatCurrency(extraPaymentNum)} extra payment will save you approximately ${monthsSaved} months and thousands in interest!`
      });
    }

    // Freedom motivation
    if (results.payoffMonths > 0 && results.payoffMonths <= 60) {
      insights.push({
        type: 'info' as const,
        title: 'Debt Freedom is Within Reach',
        message: `You're just ${Math.floor(results.payoffMonths / 12)} years and ${results.payoffMonths % 12} months away from financial freedom!`
      });
    }

    // Strategy comparison insight
    if (strategy === 'avalanche') {
      insights.push({
        type: 'success' as const,
        title: 'Smart Mathematical Choice',
        message: 'Debt avalanche minimizes total interest paid. Stay disciplined - the math is on your side!'
      });
    } else {
      insights.push({
        type: 'info' as const,
        title: 'Psychological Victory Approach',
        message: 'Debt snowball builds momentum with quick wins. Celebrate each debt you eliminate!'
      });
    }

    return insights;
  };

  const getDebtTypeColor = (type: string) => {
    const colors = {
      'credit_card': 'bg-red-50 border-red-200',
      'student_loan': 'bg-blue-50 border-blue-200',
      'auto_loan': 'bg-green-50 border-green-200',
      'personal_loan': 'bg-amber-50 border-amber-200',
      'mortgage': 'bg-slate-50 border-slate-200'
    };
    return colors[type as keyof typeof colors] || 'bg-slate-50 border-slate-200';
  };

  // Calculator metadata
  const metadata = {
    id: 'debt-payoff-calculator',
    title: 'Debt Payoff Calculator',
    description: 'Compare debt avalanche vs snowball strategies and see how extra payments accelerate your freedom',
    category: 'advanced' as const,
    icon: CreditCard,
    tags: ['debt payoff', 'debt avalanche', 'debt snowball', 'financial freedom'],
    educationalNotes: [
      {
        title: 'Debt Avalanche vs Snowball',
        content: 'The avalanche method saves more money mathematically by targeting high-interest debt first. The snowball method provides psychological motivation by eliminating smaller debts quickly.',
        tips: [
          'Avalanche method: Pay minimums on all debts, extra goes to highest interest rate',
          'Snowball method: Pay minimums on all debts, extra goes to smallest balance',
          'Both methods beat making only minimum payments',
          'Choose the method you can stick with long-term'
        ]
      },
      {
        title: 'Accelerating Your Debt Freedom',
        content: 'Small extra payments make a huge difference due to compound interest working against you. Every dollar counts.',
        tips: [
          'Find extra money through side hustles or selling unused items',
          'Use tax refunds and bonuses for debt payments',
          'Consider balance transfers to lower interest rates',
          'Stop creating new debt while paying off existing debt'
        ]
      }
    ]
  };

  // Results formatting for the wrapper
  const calculatorResults = {
    primary: {
      label: 'Debt-Free Date',
      value: results.payoffMonths,
      format: 'months' as const,
      variant: 'success' as const,
      description: 'Time until complete debt freedom'
    },
    secondary: [
      {
        label: 'Total Debt',
        value: results.totalBalance,
        format: 'currency' as const,
        variant: 'error' as const,
        description: 'Current total debt balance'
      },
      {
        label: 'Interest Paid',
        value: results.totalInterest,
        format: 'currency' as const,
        variant: 'warning' as const,
        description: 'Total interest over payoff period'
      },
      {
        label: 'Monthly Payment',
        value: results.totalPayment,
        format: 'currency' as const,
        description: 'Total monthly payment (minimum + extra)'
      }
    ]
  };

  return (
    <CalculatorWrapper
      metadata={metadata}
      results={calculatorResults}
      insights={generateInsights()}
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* Strategy and Payment Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <Lightbulb className="w-5 h-5" />
              Payoff Strategy
            </h4>
            <RadioGroup
              name="strategy"
              label=""
              options={[
                {
                  value: 'avalanche',
                  label: 'Debt Avalanche',
                  description: 'Pay minimums on all debts, extra goes to highest interest rate'
                },
                {
                  value: 'snowball',
                  label: 'Debt Snowball',
                  description: 'Pay minimums on all debts, extra goes to smallest balance'
                }
              ]}
              value={strategy}
              onChange={(value) => setStrategy(value as 'avalanche' | 'snowball')}
            />
          </div>

          <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <DollarSign className="w-5 h-5" />
              Extra Monthly Payment
            </h4>
            <CurrencyInput
              id="extraPayment"
              label=""
              value={extraPayment}
              onChange={setExtraPayment}
              min={0}
              step={25}
              placeholder="Enter extra payment amount"
            />
            <p className={`text-sm ${theme.textColors.muted} mt-2`}>
              Any amount helps! Even $50 extra can save thousands in interest.
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ResultCard
            icon={TrendingDown}
            label="Total Debt"
            value={results.totalBalance}
            format="currency"
            variant="error"
          />
          
          <ResultCard
            icon={Calendar}
            label="Payoff Time"
            value={results.payoffMonths}
            format="months"
            variant="info"
          />
          
          <ResultCard
            icon={DollarSign}
            label="Interest Paid"
            value={results.totalInterest}
            format="currency"
            variant="warning"
          />
          
          <ResultCard
            icon={Target}
            label="Monthly Payment"
            value={results.totalPayment}
            format="currency"
            variant="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Debt Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className={`${theme.typography.heading5} ${theme.textColors.primary}`}>Your Debts</h4>
              <button
                onClick={addDebt}
                className={`${theme.status.info.bg} ${theme.textColors.primary} px-4 py-2 rounded-lg hover:opacity-80 transition-colors text-sm`}
              >
                + Add Debt
              </button>
            </div>

            {debts.map((debt, index) => (
              <div key={debt.id} className={`${getDebtTypeColor(debt.type)} border rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <debt.icon className={`w-5 h-5 ${theme.textColors.secondary}`} />
                    <input
                      type="text"
                      value={debt.name}
                      onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                      className={`font-medium ${theme.textColors.primary} bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-yellow-500 rounded px-2 py-1`}
                    />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${strategy === 'avalanche' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    #{index + 1} Priority
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className={`text-xs ${theme.textColors.secondary}`}>Balance</label>
                    <div className="relative">
                      <span className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs`}>$</span>
                      <input
                        type="number"
                        value={debt.balance}
                        onChange={(e) => updateDebt(debt.id, 'balance', Number(e.target.value))}
                        className={`w-full pl-6 pr-2 py-1 border ${theme.borderColors.primary} rounded text-sm`}
                        min="0"
                        step="100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`text-xs ${theme.textColors.secondary}`}>Min Payment</label>
                    <div className="relative">
                      <span className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs`}>$</span>
                      <input
                        type="number"
                        value={debt.minimumPayment}
                        onChange={(e) => updateDebt(debt.id, 'minimumPayment', Number(e.target.value))}
                        className={`w-full pl-6 pr-2 py-1 border ${theme.borderColors.primary} rounded text-sm`}
                        min="0"
                        step="5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`text-xs ${theme.textColors.secondary}`}>Interest Rate</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={debt.interestRate}
                        onChange={(e) => updateDebt(debt.id, 'interestRate', Number(e.target.value))}
                        className={`w-full pl-2 pr-6 py-1 border ${theme.borderColors.primary} rounded text-sm`}
                        min="0"
                        max="50"
                        step="0.1"
                      />
                      <span className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs`}>%</span>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => removeDebt(debt.id)}
                      className={`w-full ${theme.status.error.bg} ${theme.status.error.text} px-2 py-1 rounded text-xs hover:opacity-80 transition-colors`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts and Projections */}
          <div className="space-y-6">
            <h4 className={`${theme.typography.heading5} ${theme.textColors.primary}`}>Payoff Projection</h4>

            {/* Debt Balance Chart */}
            {projectionData.length > 0 && (
              <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4`}>
                <h5 className={`font-semibold ${theme.textColors.primary} mb-4`}>Debt Balance Over Time</h5>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectionData.slice(0, Math.min(projectionData.length, 120))}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[700]} opacity={0.3} />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: theme.colors.slate[400] }}
                      />
                      <YAxis
                        tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                        tick={{ fill: theme.colors.slate[400] }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.colors.slate[800],
                          border: `1px solid ${theme.colors.slate[700]}`,
                          borderRadius: '8px',
                          color: theme.colors.slate[100]
                        }}
                        formatter={(value: number, name: string) => [
                          formatCurrency(value), 
                          name === 'totalBalance' ? 'Remaining Debt' : 'Total Interest Paid'
                        ]}
                        labelFormatter={(month) => `Month ${month}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="totalBalance"
                        stroke="#ef4444"
                        strokeWidth={3}
                        name="totalBalance"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="totalInterest"
                        stroke={theme.colors.amber[400]}
                        strokeWidth={2}
                        name="totalInterest"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Motivation Section */}
            <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4`}>
              <h5 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                <Lightbulb className="w-4 h-4" />
                Your Debt-Free Future
              </h5>
              <div className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                <div>
                  <strong>Freedom Date:</strong> {results.payoffMonths > 0 ? `${Math.floor(results.payoffMonths / 12)} years, ${results.payoffMonths % 12} months` : 'Add debts to calculate'}
                </div>
                <div>
                  <strong>Monthly Freedom:</strong> {formatCurrency(results.totalPayment)} back in your pocket
                </div>
                <div>
                  <strong>Annual Freedom:</strong> {formatCurrency(results.totalPayment * 12)} per year
                </div>
                <div className={`mt-3 p-3 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded`}>
                  <strong>Imagine:</strong> What could you do with an extra {formatCurrency(results.totalPayment * 12)} per year?
                  Vacation? Investment? Dream purchase? Your debt-free life is closer than you think!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
