'use client';

import React, { useState, useCallback } from 'react';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { CurrencyInput, SelectField } from '@/components/shared/calculators/FormFields';
import { InputGroup } from '@/components/shared/calculators/FormFields';
import { formatCurrency } from '@/lib/utils/financial';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { theme } from '@/lib/theme';
import {
  CreditCard,
  GraduationCap,
  Car,
  Home,
  User,
  LucideIcon,
  DollarSign,
  Lightbulb,
  TrendingDown,
  Calendar,
  Target,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ValidationError {
  field: string;
  message: string;
}

interface InputValidation {
  isValid: boolean;
  errors: ValidationError[];
}

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

const DEBT_TYPES = {
  credit_card: { icon: CreditCard, label: 'Credit Card', color: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' },
  student_loan: { icon: GraduationCap, label: 'Student Loan', color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' },
  auto_loan: { icon: Car, label: 'Auto Loan', color: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' },
  personal_loan: { icon: User, label: 'Personal Loan', color: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' },
  mortgage: { icon: Home, label: 'Mortgage', color: 'bg-slate-50 border-slate-200 dark:bg-slate-900/20 dark:border-slate-800' }
};

export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card 1', balance: 5000, minimumPayment: 125, interestRate: 18.99, type: 'credit_card', icon: CreditCard },
    { id: '2', name: 'Student Loan', balance: 25000, minimumPayment: 300, interestRate: 5.5, type: 'student_loan', icon: GraduationCap },
    { id: '3', name: 'Car Loan', balance: 15000, minimumPayment: 350, interestRate: 6.5, type: 'auto_loan', icon: Car },
  ]);

  const [extraPayment, setExtraPayment] = useState('200');
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [projectionData, setProjectionData] = useState<PayoffProjection[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [results, setResults] = useState({
    totalBalance: 0,
    payoffMonths: 0,
    totalInterest: 0,
    totalPayment: 0,
    minimumPaymentTotal: 0
  });

  // Validation function
  const safeParseFloat = (value: string | number, min: number = 0, max: number = 1000000): number => {
    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(parsed)) return 0;
    return Math.max(min, Math.min(max, parsed));
  };

  const validateInputs = (): InputValidation => {
    const errors: ValidationError[] = [];
    
    // Validate debts
    debts.forEach((debt, index) => {
      if (debt.balance <= 0) {
        errors.push({ field: `debt-${debt.id}-balance`, message: `Debt ${index + 1}: Balance must be greater than $0` });
      }
      if (debt.minimumPayment <= 0) {
        errors.push({ field: `debt-${debt.id}-minimum`, message: `Debt ${index + 1}: Minimum payment must be greater than $0` });
      }
      if (debt.minimumPayment > debt.balance) {
        errors.push({ field: `debt-${debt.id}-minimum`, message: `Debt ${index + 1}: Minimum payment cannot exceed balance` });
      }
      if (debt.interestRate < 0 || debt.interestRate > 100) {
        errors.push({ field: `debt-${debt.id}-rate`, message: `Debt ${index + 1}: Interest rate must be between 0-100%` });
      }
      if (!debt.name.trim()) {
        errors.push({ field: `debt-${debt.id}-name`, message: `Debt ${index + 1}: Name is required` });
      }
    });

    // Validate extra payment
    const extraPaymentNum = parseFloat(extraPayment);
    if (isNaN(extraPaymentNum) || extraPaymentNum < 0) {
      errors.push({ field: 'extra-payment', message: 'Extra payment must be $0 or greater' });
    }

    setValidationErrors(errors);
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Handle input changes with validation
  const handleExtraPaymentChange = (value: string) => {
    setExtraPayment(value);
    validateInputs();
  };

  // Calculate payoff strategy
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

  // Update projections when inputs change
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
      totalPayment: totalMinimumPayments + parseFloat(extraPayment || '0'),
      minimumPaymentTotal: totalMinimumPayments
    });
  }, [calculatePayoffStrategy, debts, extraPayment]);

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
      const monthsSaved = Math.max(0, 120 - results.payoffMonths); // Rough estimate
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

  // Get priority order for display
  const getOrderedDebts = () => {
    const ordered = [...debts];
    if (strategy === 'avalanche') {
      ordered.sort((a, b) => b.interestRate - a.interestRate);
    } else {
      ordered.sort((a, b) => a.balance - b.balance);
    }
    return ordered;
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
        <InputGroup
          title="Debt Elimination Strategy"
          description="Choose your approach and set your extra payment amount"
        >
          <div className={theme.utils.calculatorFieldGrid(2)}>
            <SelectField
              id="strategy"
              label="Payoff Strategy"
              value={strategy}
              onChange={(value) => setStrategy(value as 'avalanche' | 'snowball')}
              options={[
                { value: 'avalanche', label: 'Debt Avalanche (Save Most Money)' },
                { value: 'snowball', label: 'Debt Snowball (Build Momentum)' }
              ]}
              helpText={strategy === 'avalanche' ?
                'Targets highest interest rates first - saves more money' :
                'Targets smallest balances first - builds motivation'
              }
            />

            <CurrencyInput
              id="extra-payment"
              label="Extra Monthly Payment"
              value={extraPayment}
              onChange={setExtraPayment}
              placeholder="200"
              helpText="Any amount helps! Even $50 can save thousands in interest"
            />
          </div>
        </InputGroup>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={theme.utils.calculatorMetric()}>
            <TrendingDown className={`w-6 h-6 mx-auto mb-2 ${theme.textColors.accent}`} />
            <div className={`text-lg font-bold ${theme.status.error.text}`}>
              {formatCurrency(results.totalBalance)}
            </div>
            <div className={`text-xs ${theme.textColors.muted}`}>Total Debt</div>
          </div>

          <div className={theme.utils.calculatorMetric()}>
            <Calendar className={`w-6 h-6 mx-auto mb-2 ${theme.textColors.accent}`} />
            <div className={`text-lg font-bold ${theme.textColors.primary}`}>
              {results.payoffMonths > 0 ?
                `${Math.floor(results.payoffMonths / 12)}y ${results.payoffMonths % 12}m` :
                'N/A'
              }
            </div>
            <div className={`text-xs ${theme.textColors.muted}`}>Payoff Time</div>
          </div>

          <div className={theme.utils.calculatorMetric()}>
            <AlertTriangle className={`w-6 h-6 mx-auto mb-2 ${theme.textColors.accent}`} />
            <div className={`text-lg font-bold ${theme.status.warning.text}`}>
              {formatCurrency(results.totalInterest)}
            </div>
            <div className={`text-xs ${theme.textColors.muted}`}>Interest Paid</div>
          </div>

          <div className={theme.utils.calculatorMetric()}>
            <DollarSign className={`w-6 h-6 mx-auto mb-2 ${theme.textColors.accent}`} />
            <div className={`text-lg font-bold ${theme.textColors.primary}`}>
              {formatCurrency(results.totalPayment)}
            </div>
            <div className={`text-xs ${theme.textColors.muted}`}>Monthly Payment</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Debt Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className={`${theme.typography.heading5} ${theme.textColors.primary}`}>Your Debts</h4>
              <button
                onClick={addDebt}
                className={`${theme.buttons.primary} px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2`}
              >
                <Plus className="w-4 h-4" />
                Add Debt
              </button>
            </div>

            {/* Debt Order Information */}
            <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-3`}>
              <div className={`text-sm ${theme.status.info.text} flex items-center gap-2`}>
                <Lightbulb className="w-4 h-4" />
                <span className="font-medium">
                  {strategy === 'avalanche' ? 'Highest Interest First' : 'Smallest Balance First'}
                </span>
              </div>
              <p className={`text-xs ${theme.status.info.text} mt-1`}>
                Debts are ordered by your chosen strategy. Extra payments go to debt #1 first.
              </p>
            </div>

            {getOrderedDebts().map((debt, index) => {
              const debtType = DEBT_TYPES[debt.type];
              return (
                <div key={debt.id} className={`${debtType.color} border rounded-lg p-4 relative`}>
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
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${index === 0 ?
                        'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
                        }`}>
                        #{index + 1} Priority
                      </span>
                      {index === 0 && (
                        <div title="Target for extra payments">
                          <Target className="w-4 h-4 text-red-500" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className={`text-xs ${theme.textColors.secondary} font-medium`}>Balance</label>
                      <CurrencyInput
                        id={`balance-${debt.id}`}
                        label=""
                        value={debt.balance.toString()}
                        onChange={(value) => updateDebt(debt.id, 'balance', Number(value))}
                        placeholder="5,000"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className={`text-xs ${theme.textColors.secondary} font-medium`}>Min Payment</label>
                      <CurrencyInput
                        id={`payment-${debt.id}`}
                        label=""
                        value={debt.minimumPayment.toString()}
                        onChange={(value) => updateDebt(debt.id, 'minimumPayment', Number(value))}
                        placeholder="125"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className={`text-xs ${theme.textColors.secondary} font-medium`}>Interest Rate</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={debt.interestRate}
                          onChange={(e) => updateDebt(debt.id, 'interestRate', Number(e.target.value))}
                          className={`w-full pl-2 pr-6 py-1 border ${theme.borderColors.primary} rounded text-sm ${theme.backgrounds.card} ${theme.textColors.primary}`}
                          min="0"
                          max="50"
                          step="0.1"
                          placeholder="18.99"
                        />
                        <span className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs`}>%</span>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => removeDebt(debt.id)}
                        className={`w-full ${theme.status.error.bg} ${theme.status.error.text} px-2 py-1 rounded text-xs hover:opacity-80 transition-colors flex items-center justify-center gap-1`}
                        title="Remove debt"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Debt type selector */}
                  <div className="mt-3">
                    <label className={`text-xs ${theme.textColors.secondary} font-medium`}>Debt Type</label>
                    <select
                      value={debt.type}
                      onChange={(e) => updateDebt(debt.id, 'type', e.target.value)}
                      className={`w-full px-2 py-1 border ${theme.borderColors.primary} rounded text-sm ${theme.backgrounds.card} ${theme.textColors.primary}`}
                    >
                      {Object.entries(DEBT_TYPES).map(([key, type]) => (
                        <option key={key} value={key}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts and Projections */}
          <div className="space-y-6">
            {/* Payoff Timeline */}
            {projectionData.length > 0 && (
              <div className={theme.utils.calculatorChart()}>
                <h5 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Debt Payoff Timeline</h5>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectionData.slice(0, Math.min(projectionData.length, 120))}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        className={theme.textColors.muted}
                      />
                      <YAxis
                        tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                        axisLine={false}
                        tickLine={false}
                        className={theme.textColors.muted}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white'
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
                        stroke="#f59e0b"
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
            <div className={theme.utils.calculatorSection()}>
              <h5 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Your Debt-Free Future
              </h5>
              <div className={`space-y-3 text-sm ${theme.textColors.secondary}`}>
                <div className="flex justify-between">
                  <span>Freedom Date:</span>
                  <span className="font-medium">
                    {results.payoffMonths > 0 ?
                      `${Math.floor(results.payoffMonths / 12)} years, ${results.payoffMonths % 12} months` :
                      'Add debts to calculate'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Freedom:</span>
                  <span className="font-medium">{formatCurrency(results.totalPayment)} back in your pocket</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Freedom:</span>
                  <span className="font-medium">{formatCurrency(results.totalPayment * 12)} per year</span>
                </div>

                <div className={`mt-4 p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-blue-400">Imagine Your Freedom</span>
                  </div>
                  <p className={theme.textColors.secondary}>
                    What could you do with an extra {formatCurrency(results.totalPayment * 12)} per year?
                    Vacation? Investment? Dream purchase? Your debt-free life is closer than you think!
                  </p>
                </div>
              </div>
            </div>

            {/* Strategy Comparison */}
            <div className={theme.utils.calculatorSection()}>
              <h5 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-3`}>Strategy Benefits</h5>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${strategy === 'avalanche' ? theme.status.success.bg + ' ' + theme.status.success.border : theme.backgrounds.cardHover + ' ' + theme.borderColors.primary} border`}>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4" />
                    <span className="font-medium">Debt Avalanche</span>
                    {strategy === 'avalanche' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Mathematically optimal - saves the most money by targeting high interest rates first
                  </p>
                </div>

                <div className={`p-3 rounded-lg ${strategy === 'snowball' ? theme.status.success.bg + ' ' + theme.status.success.border : theme.backgrounds.cardHover + ' ' + theme.borderColors.primary} border`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4" />
                    <span className="font-medium">Debt Snowball</span>
                    {strategy === 'snowball' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Psychological boost - builds momentum with quick wins by eliminating small debts first
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
