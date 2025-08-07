'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import { 
  Target, 
  TrendingDown, 
  Calculator,
  DollarSign,
  Clock,
  Award,
  Zap,
  Brain,
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DebtStrategySimulatorProps {
  onComplete?: () => void;
}

interface Debt {
  id: string;
  name: string;
  balance: number;
  minimumPayment: number;
  interestRate: number;
}

interface PayoffResult {
  strategy: 'snowball' | 'avalanche';
  totalInterest: number;
  monthsToPayoff: number;
  monthlyPayment: number;
  payoffOrder: string[];
  monthlySavings: number;
}

export default function DebtStrategySimulator({ onComplete }: DebtStrategySimulatorProps) {
  const { recordCalculatorUsage } = useProgressStore();
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card 1', balance: 8000, minimumPayment: 160, interestRate: 24.99 },
    { id: '2', name: 'Credit Card 2', balance: 3500, minimumPayment: 70, interestRate: 18.99 },
    { id: '3', name: 'Personal Loan', balance: 12000, minimumPayment: 280, interestRate: 12.5 }
  ]);
  const [extraPayment, setExtraPayment] = useState(200);
  const [results, setResults] = useState<{snowball: PayoffResult; avalanche: PayoffResult} | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    recordCalculatorUsage('debt-strategy-simulator');
  }, [recordCalculatorUsage]);

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: `Debt ${debts.length + 1}`,
      balance: 5000,
      minimumPayment: 100,
      interestRate: 15
    };
    setDebts([...debts, newDebt]);
  };

  const removeDebt = (id: string) => {
    if (debts.length > 1) {
      setDebts(debts.filter(debt => debt.id !== id));
    }
  };

  const updateDebt = (id: string, field: keyof Debt, value: number | string) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ));
  };

  const calculatePayoffPlan = (strategy: 'snowball' | 'avalanche'): PayoffResult => {
    const debtsCopy = debts.map(debt => ({ 
      ...debt, 
      currentBalance: debt.balance,
      monthlyRate: debt.interestRate / 100 / 12
    }));

    // Sort debts by strategy
    const sortedDebts = strategy === 'snowball' 
      ? debtsCopy.sort((a, b) => a.balance - b.balance)
      : debtsCopy.sort((a, b) => b.interestRate - a.interestRate);

    const totalMinimum = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const totalAvailable = totalMinimum + extraPayment;
    
    let month = 0;
    let totalInterestPaid = 0;
    const payoffOrder: string[] = [];
    let remainingDebts = [...sortedDebts];

    while (remainingDebts.length > 0 && month < 600) { // 50 year max
      month++;
      let availablePayment = totalAvailable;

      // Pay minimums first
      remainingDebts.forEach(debt => {
        const interestPayment = debt.currentBalance * debt.monthlyRate;
        const principalPayment = Math.min(debt.minimumPayment - interestPayment, debt.currentBalance);
        
        debt.currentBalance -= principalPayment;
        totalInterestPaid += interestPayment;
        availablePayment -= debt.minimumPayment;
      });

      // Apply extra payment to target debt
      if (remainingDebts.length > 0 && availablePayment > 0) {
        const targetDebt = remainingDebts[0];
        const extraPrincipal = Math.min(availablePayment, targetDebt.currentBalance);
        targetDebt.currentBalance -= extraPrincipal;
      }

      // Remove paid off debts
      remainingDebts = remainingDebts.filter(debt => {
        if (debt.currentBalance <= 0.01) {
          payoffOrder.push(debt.name);
          return false;
        }
        return true;
      });
    }

    const monthlyPayment = totalAvailable;
    const monthlySavings = totalMinimum;

    return {
      strategy,
      totalInterest: totalInterestPaid,
      monthsToPayoff: month,
      monthlyPayment,
      payoffOrder,
      monthlySavings
    };
  };

  const runSimulation = () => {
    if (debts.length === 0) {
      toast.error('Add at least one debt to simulate');
      return;
    }

    const snowballResult = calculatePayoffPlan('snowball');
    const avalancheResult = calculatePayoffPlan('avalanche');

    setResults({ snowball: snowballResult, avalanche: avalancheResult });
    setShowComparison(true);
    
    toast.success('Debt payoff strategies calculated! 📊', { duration: 3000 });
  };

  const resetSimulation = () => {
    setShowComparison(false);
    setResults(null);
    setDebts([
      { id: '1', name: 'Credit Card 1', balance: 8000, minimumPayment: 160, interestRate: 24.99 },
      { id: '2', name: 'Credit Card 2', balance: 3500, minimumPayment: 70, interestRate: 18.99 },
      { id: '3', name: 'Personal Loan', balance: 12000, minimumPayment: 280, interestRate: 12.5 }
    ]);
    setExtraPayment(200);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0) {
      return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`;
    }
    return `${months} months`;
  };

  if (showComparison && results) {
    const snowball = results.snowball;
    const avalanche = results.avalanche;
    const interestSavings = snowball.totalInterest - avalanche.totalInterest;
    const timeSavings = snowball.monthsToPayoff - avalanche.monthsToPayoff;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <GradientCard variant="glass" gradient="blue" className="p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.status.success.bg} rounded-full mb-4`}>
              <Target className={`w-8 h-8 ${theme.status.success.text}`} />
            </div>
            <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
              Debt Payoff Strategy Comparison
            </h2>
            <p className={`${theme.textColors.secondary}`}>
              Your personalized debt elimination battle plan
            </p>
          </div>

          {/* Strategy Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Debt Snowball */}
            <GradientCard variant="glass" gradient="green" className="p-6">
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${theme.status.info.bg} rounded-full mb-3`}>
                  <Brain className={`w-6 h-6 ${theme.status.info.text}`} />
                </div>
                <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
                  Debt Snowball
                </h3>
                <p className={`text-sm ${theme.textColors.secondary} mb-4`}>
                  Pay smallest balances first for psychological wins
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className={`${theme.textColors.secondary}`}>Total Interest:</span>
                  <span className={`font-bold ${theme.textColors.primary} text-lg`}>
                    {formatCurrency(snowball.totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${theme.textColors.secondary}`}>Time to Freedom:</span>
                  <span className={`font-bold ${theme.textColors.primary} text-lg`}>
                    {formatTime(snowball.monthsToPayoff)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${theme.textColors.secondary}`}>Monthly Payment:</span>
                  <span className={`font-bold ${theme.textColors.primary} text-lg`}>
                    {formatCurrency(snowball.monthlyPayment)}
                  </span>
                </div>
              </div>

              <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg mb-4`}>
                <h4 className={`font-semibold ${theme.status.info.text} mb-2 flex items-center`}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Payoff Order
                </h4>
                <ol className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  {snowball.payoffOrder.map((debt, index) => (
                    <li key={index} className="flex items-center">
                      <span className={`w-6 h-6 ${theme.status.info.bg} rounded-full flex items-center justify-center text-xs font-bold mr-2`}>
                        {index + 1}
                      </span>
                      {debt}
                    </li>
                  ))}
                </ol>
              </div>

              <div className={`p-3 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
                <h5 className={`font-semibold ${theme.status.success.text} text-sm mb-1`}>✅ Best For:</h5>
                <p className={`text-xs ${theme.textColors.secondary}`}>
                  Need motivation, multiple small debts, struggle with consistency
                </p>
              </div>
            </GradientCard>

            {/* Debt Avalanche */}
            <GradientCard variant="glass" gradient="purple" className="p-6">
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${theme.status.warning.bg} rounded-full mb-3`}>
                  <Calculator className={`w-6 h-6 ${theme.status.warning.text}`} />
                </div>
                <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
                  Debt Avalanche
                </h3>
                <p className={`text-sm ${theme.textColors.secondary} mb-4`}>
                  Pay highest interest rates first to save maximum money
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className={`${theme.textColors.secondary}`}>Total Interest:</span>
                  <span className={`font-bold text-green-400 text-lg`}>
                    {formatCurrency(avalanche.totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${theme.textColors.secondary}`}>Time to Freedom:</span>
                  <span className={`font-bold text-green-400 text-lg`}>
                    {formatTime(avalanche.monthsToPayoff)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${theme.textColors.secondary}`}>Monthly Payment:</span>
                  <span className={`font-bold ${theme.textColors.primary} text-lg`}>
                    {formatCurrency(avalanche.monthlyPayment)}
                  </span>
                </div>
              </div>

              <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg mb-4`}>
                <h4 className={`font-semibold ${theme.status.warning.text} mb-2 flex items-center`}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Payoff Order
                </h4>
                <ol className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  {avalanche.payoffOrder.map((debt, index) => (
                    <li key={index} className="flex items-center">
                      <span className={`w-6 h-6 ${theme.status.warning.bg} rounded-full flex items-center justify-center text-xs font-bold mr-2`}>
                        {index + 1}
                      </span>
                      {debt}
                    </li>
                  ))}
                </ol>
              </div>

              <div className={`p-3 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
                <h5 className={`font-semibold ${theme.status.success.text} text-sm mb-1`}>🎯 Best For:</h5>
                <p className={`text-xs ${theme.textColors.secondary}`}>
                  Disciplined savers, want maximum savings, mathematically optimal
                </p>
              </div>
            </GradientCard>
          </div>

          {/* Savings Comparison */}
          <GradientCard variant="glass" gradient="yellow" className="p-6 mb-8">
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center text-center`}>
              <Award className={`w-6 h-6 mr-3`} />
              The Avalanche Advantage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold text-green-400 mb-2`}>
                  {formatCurrency(Math.abs(interestSavings))}
                </div>
                <p className={`${theme.textColors.secondary} text-sm`}>
                  {interestSavings > 0 ? 'Interest Savings' : 'Extra Interest Cost'}
                </p>
                <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                  vs Debt Snowball method
                </p>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold text-blue-400 mb-2`}>
                  {Math.abs(timeSavings)} months
                </div>
                <p className={`${theme.textColors.secondary} text-sm`}>
                  {timeSavings > 0 ? 'Faster Payoff' : 'Longer Payoff'}
                </p>
                <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                  vs Debt Snowball method
                </p>
              </div>
            </div>
            
            {interestSavings > 1000 && (
              <div className={`mt-4 p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg text-center`}>
                <p className={`font-bold ${theme.status.success.text}`}>
                  💰 Recommended: Use the Debt Avalanche to save {formatCurrency(interestSavings)}!
                </p>
              </div>
            )}
            
            {interestSavings < 500 && (
              <div className={`mt-4 p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg text-center`}>
                <p className={`font-bold ${theme.status.info.text}`}>
                  🧠 Both strategies are similar - choose based on your personality!
                </p>
              </div>
            )}
          </GradientCard>

          {/* Action Plan */}
          <GradientCard variant="glass" gradient="red" className="p-6 mb-8">
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center`}>
              <Zap className={`w-6 h-6 mr-3`} />
              Your Debt Freedom Action Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>This Week:</h4>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-2`}>
                  <li className="flex items-start">
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2 mt-0.5 flex-shrink-0`} />
                    Set up automatic payments for all minimum payments
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2 mt-0.5 flex-shrink-0`} />
                    Stop using credit cards for new purchases
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2 mt-0.5 flex-shrink-0`} />
                    Create a debt tracking spreadsheet or app
                  </li>
                </ul>
              </div>
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>This Month:</h4>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-2`}>
                  <li className="flex items-start">
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2 mt-0.5 flex-shrink-0`} />
                    Find an extra ${extraPayment}/month in your budget
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2 mt-0.5 flex-shrink-0`} />
                    Consider debt consolidation options
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2 mt-0.5 flex-shrink-0`} />
                    Look for side income opportunities
                  </li>
                </ul>
              </div>
            </div>
          </GradientCard>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetSimulation}
              className={`px-8 py-3 border-2 ${theme.borderColors.primary} ${theme.textColors.secondary} rounded-xl hover:${theme.borderColors.accent} hover:${theme.textColors.primary} transition-all`}
            >
              Try Different Scenario
            </button>
            <button
              onClick={() => {
                onComplete?.();
                toast.success('Debt strategy analysis completed! 🎯');
              }}
              className={`px-8 py-3 ${theme.buttons.primary} rounded-xl hover-lift transition-all`}
            >
              Continue Learning
            </button>
          </div>
        </GradientCard>
      </motion.div>
    );
  }

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinimum = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <GradientCard variant="glass" gradient="blue" className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.status.info.bg} rounded-full mb-4`}>
            <TrendingDown className={`w-8 h-8 ${theme.status.info.text}`} />
          </div>
          <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
            Debt Elimination Strategy Simulator
          </h2>
          <p className={`${theme.textColors.secondary}`}>
            Compare Snowball vs Avalanche methods to find your optimal debt payoff strategy
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
            <DollarSign className={`w-6 h-6 ${theme.status.error.text} mx-auto mb-2`} />
            <h4 className={`font-semibold ${theme.textColors.primary} mb-1`}>Total Debt</h4>
            <p className={`text-lg font-bold ${theme.textColors.primary}`}>
              {formatCurrency(totalDebt)}
            </p>
          </div>
          
          <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
            <Clock className={`w-6 h-6 ${theme.status.warning.text} mx-auto mb-2`} />
            <h4 className={`font-semibold ${theme.textColors.primary} mb-1`}>Minimum Payments</h4>
            <p className={`text-lg font-bold ${theme.textColors.primary}`}>
              {formatCurrency(totalMinimum)}/month
            </p>
          </div>

          <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
            <Target className={`w-6 h-6 ${theme.status.success.text} mx-auto mb-2`} />
            <h4 className={`font-semibold ${theme.textColors.primary} mb-1`}>Extra Payment</h4>
            <p className={`text-lg font-bold ${theme.textColors.primary}`}>
              {formatCurrency(extraPayment)}/month
            </p>
          </div>
        </div>

        {/* Debt Input */}
        <GradientCard variant="glass" gradient="purple" className="p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Your Debts</h3>
            <button
              onClick={addDebt}
              className={`flex items-center px-4 py-2 ${theme.buttons.secondary} rounded-lg hover:${theme.status.info.bg} transition-all`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Debt
            </button>
          </div>

          <div className="space-y-4">
            {debts.map((debt, index) => (
              <motion.div
                key={debt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-1`}>
                      Debt Name
                    </label>
                    <input
                      type="text"
                      value={debt.name}
                      onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                      className={`w-full px-3 py-2 ${theme.backgrounds.card} border ${theme.borderColors.muted} rounded-lg focus:${theme.borderColors.accent} focus:outline-none`}
                      placeholder="Credit Card 1"
                      aria-label="Debt name"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-1`}>
                      Balance
                    </label>
                    <input
                      type="number"
                      value={debt.balance}
                      onChange={(e) => updateDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 ${theme.backgrounds.card} border ${theme.borderColors.muted} rounded-lg focus:${theme.borderColors.accent} focus:outline-none`}
                      min="0"
                      step="100"
                      aria-label="Debt balance"
                      title="Debt balance amount"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-1`}>
                      Minimum Payment
                    </label>
                    <input
                      type="number"
                      value={debt.minimumPayment}
                      onChange={(e) => updateDebt(debt.id, 'minimumPayment', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 ${theme.backgrounds.card} border ${theme.borderColors.muted} rounded-lg focus:${theme.borderColors.accent} focus:outline-none`}
                      min="0"
                      step="10"
                      aria-label="Minimum payment"
                      title="Monthly minimum payment"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-1`}>
                      Interest Rate %
                    </label>
                    <input
                      type="number"
                      value={debt.interestRate}
                      onChange={(e) => updateDebt(debt.id, 'interestRate', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 ${theme.backgrounds.card} border ${theme.borderColors.muted} rounded-lg focus:${theme.borderColors.accent} focus:outline-none`}
                      min="0"
                      max="50"
                      step="0.1"
                      aria-label="Interest rate"
                      title="Annual interest rate percentage"
                    />
                  </div>

                  <div className="flex justify-center">
                    {debts.length > 1 && (
                      <button
                        onClick={() => removeDebt(debt.id)}
                        className={`p-2 text-red-400 hover:${theme.status.error.bg} rounded-lg transition-all`}
                        title="Remove debt"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GradientCard>

        {/* Extra Payment */}
        <GradientCard variant="glass" gradient="green" className="p-6 mb-8">
          <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
            Extra Monthly Payment
          </h3>
          <div className="flex items-center space-x-4">
            <span className={`text-2xl font-bold ${theme.textColors.primary}`}>
              ${extraPayment}
            </span>
            <input
              type="range"
              min="0"
              max="1000"
              step="25"
              value={extraPayment}
              onChange={(e) => setExtraPayment(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              aria-label="Extra payment amount"
              title="Extra monthly payment amount"
            />
          </div>
          <div className={`flex justify-between text-sm ${theme.textColors.muted} mt-2`}>
            <span>$0</span>
            <span>$1,000</span>
          </div>
          
          <div className={`mt-4 p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
            <p className={`text-sm ${theme.status.info.text}`}>
              💡 <strong>Total monthly payment:</strong> {formatCurrency(totalMinimum + extraPayment)} 
              ({formatCurrency(totalMinimum)} minimum + {formatCurrency(extraPayment)} extra)
            </p>
          </div>
        </GradientCard>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={runSimulation}
            disabled={debts.length === 0}
            className={`px-8 py-3 ${theme.buttons.primary} rounded-xl hover-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculate Strategies
          </button>
        </div>

        {/* Info */}
        <div className={`mt-8 p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
          <div className="flex items-start">
            <AlertTriangle className={`w-5 h-5 ${theme.status.warning.text} mr-3 mt-0.5 flex-shrink-0`} />
            <div>
              <h4 className={`font-semibold ${theme.status.warning.text} mb-1`}>
                Strategy Guide
              </h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                <strong>Debt Snowball:</strong> Pay minimums + target smallest balance first. Great for motivation and quick wins.<br />
                <strong>Debt Avalanche:</strong> Pay minimums + target highest interest rate first. Saves the most money mathematically.
              </p>
            </div>
          </div>
        </div>
      </GradientCard>
    </motion.div>
  );
}
