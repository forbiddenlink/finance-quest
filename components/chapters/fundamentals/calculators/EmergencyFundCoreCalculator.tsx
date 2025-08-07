'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import {
  Shield,
  DollarSign,
  Users,
  Calculator,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface ExpenseCategory {
  name: string;
  amount: number;
  isEssential: boolean;
  description: string;
}

interface PersonalFactors {
  jobStability: 'stable' | 'variable' | 'unstable';
  dependents: number;
  healthIssues: boolean;
  singleIncome: boolean;
}

export default function EmergencyFundCoreCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<ExpenseCategory[]>([
    { name: 'Housing (Rent/Mortgage)', amount: 1500, isEssential: true, description: 'Essential housing payments' },
    { name: 'Food & Groceries', amount: 600, isEssential: true, description: 'Basic food needs' },
    { name: 'Utilities', amount: 200, isEssential: true, description: 'Electricity, water, gas, internet' },
    { name: 'Transportation', amount: 400, isEssential: true, description: 'Car payment, gas, public transit' },
    { name: 'Insurance', amount: 300, isEssential: true, description: 'Health, auto, home insurance' },
    { name: 'Minimum Debt Payments', amount: 250, isEssential: true, description: 'Credit cards, loans minimum payments' },
    { name: 'Entertainment', amount: 200, isEssential: false, description: 'Movies, dining out, hobbies' },
    { name: 'Shopping', amount: 150, isEssential: false, description: 'Clothing, misc purchases' },
  ]);

  const [personalFactors, setPersonalFactors] = useState<PersonalFactors>({
    jobStability: 'stable',
    dependents: 0,
    healthIssues: false,
    singleIncome: true
  });

  const [currentSavings, setCurrentSavings] = useState(2000);

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('emergency-fund-core-calculator');
  }, [recordCalculatorUsage]);

  const updateExpense = (index: number, amount: number) => {
    const newExpenses = [...monthlyExpenses];
    newExpenses[index].amount = Math.max(0, amount);
    setMonthlyExpenses(newExpenses);
  };

  const essentialExpenses = monthlyExpenses
    .filter(expense => expense.isEssential)
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate recommended emergency fund based on personal factors
  const calculateRecommendedFund = () => {
    let baseMonths = 6; // Standard recommendation

    // Adjust based on job stability
    if (personalFactors.jobStability === 'variable') baseMonths += 2;
    if (personalFactors.jobStability === 'unstable') baseMonths += 4;

    // Adjust for dependents
    baseMonths += personalFactors.dependents * 0.5;

    // Adjust for health issues
    if (personalFactors.healthIssues) baseMonths += 1;

    // Adjust for single income
    if (personalFactors.singleIncome) baseMonths += 1;

    return Math.round(baseMonths * 10) / 10; // Round to 1 decimal
  };

  const recommendedMonths = calculateRecommendedFund();
  const recommendedAmount = Math.round(essentialExpenses * recommendedMonths);
  const shortfall = Math.max(0, recommendedAmount - currentSavings);
  const surplus = Math.max(0, currentSavings - recommendedAmount);

  const getStatusColor = () => {
    if (currentSavings >= recommendedAmount) return 'text-green-400';
    if (currentSavings >= recommendedAmount * 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusMessage = () => {
    if (currentSavings >= recommendedAmount) {
      return 'Excellent! Your emergency fund is fully funded.';
    }
    if (currentSavings >= recommendedAmount * 0.5) {
      return 'Good progress! You\'re halfway to your goal.';
    }
    if (currentSavings >= 1000) {
      return 'Good start! You have a starter emergency fund.';
    }
    return 'Focus on building a $1,000 starter emergency fund first.';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Monthly Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Monthly Expenses</h3>
            </div>
            
            <div className="space-y-4">
              {monthlyExpenses.map((expense, index) => (
                <div key={expense.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                      {expense.name}
                      {expense.isEssential && (
                        <span className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded">
                          Essential
                        </span>
                      )}
                    </label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="25"
                      value={expense.amount}
                      onChange={(e) => updateExpense(index, parseFloat(e.target.value) || 0)}
                      className="pl-8 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                      placeholder="0"
                      aria-label={`Monthly amount for ${expense.name}`}
                    />
                  </div>
                  <p className="text-xs text-slate-400">{expense.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Essential Monthly Expenses:</span>
                <span className="text-green-400 font-bold text-lg">
                  ${essentialExpenses.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                This is what your emergency fund should cover each month
              </p>
            </div>
          </motion.div>

          {/* Personal Factors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Personal Risk Factors</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Job Stability
                </label>
                <select
                  value={personalFactors.jobStability}
                  onChange={(e) => setPersonalFactors(prev => ({ 
                    ...prev, 
                    jobStability: e.target.value as 'stable' | 'variable' | 'unstable' 
                  }))}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                  aria-label="Job stability level"
                >
                  <option value="stable">Stable (Salaried, secure job)</option>
                  <option value="variable">Variable (Commission, freelance)</option>
                  <option value="unstable">Unstable (Contract, seasonal)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Number of Dependents
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={personalFactors.dependents}
                  onChange={(e) => setPersonalFactors(prev => ({ 
                    ...prev, 
                    dependents: parseInt(e.target.value) || 0 
                  }))}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                  placeholder="0"
                  aria-label="Number of dependents"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={personalFactors.healthIssues}
                    onChange={(e) => setPersonalFactors(prev => ({ 
                      ...prev, 
                      healthIssues: e.target.checked 
                    }))}
                    className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-white">Chronic health conditions</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={personalFactors.singleIncome}
                    onChange={(e) => setPersonalFactors(prev => ({ 
                      ...prev, 
                      singleIncome: e.target.checked 
                    }))}
                    className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-white">Single income household</span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Current Savings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Current Emergency Savings</h3>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                $
              </span>
              <input
                type="number"
                min="0"
                step="100"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)}
                className="pl-8 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg bg-white/5 border-white/10 text-white"
                placeholder="0"
              />
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Emergency Fund Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Your Emergency Fund Target</h3>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-green-400 mb-2">
                ${recommendedAmount.toLocaleString()}
              </div>
              <div className="text-white text-lg">
                {recommendedMonths} months of essential expenses
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300">Monthly Essential Expenses:</span>
                <span className="text-white font-semibold">${essentialExpenses.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300">Recommended Months:</span>
                <span className="text-white font-semibold">{recommendedMonths} months</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300">Current Savings:</span>
                <span className="text-white font-semibold">${currentSavings.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Status & Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              {currentSavings >= recommendedAmount ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              )}
              <h3 className="text-xl font-bold text-white">Fund Status</h3>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Progress</span>
                <span className={getStatusColor()}>
                  {Math.round((currentSavings / recommendedAmount) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className={`bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(100, (currentSavings / recommendedAmount) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border mb-4 ${
              currentSavings >= recommendedAmount 
                ? 'bg-green-500/10 border-green-500/20' 
                : 'bg-yellow-500/10 border-yellow-500/20'
            }`}>
              <p className={`font-medium ${getStatusColor()}`}>
                {getStatusMessage()}
              </p>
            </div>

            {shortfall > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-medium">Savings Goal</span>
                </div>
                <p className="text-white text-lg font-semibold">
                  Save ${shortfall.toLocaleString()} more
                </p>
                <p className="text-slate-300 text-sm">
                  At $500/month: {Math.ceil(shortfall / 500)} months to reach your goal
                </p>
              </div>
            )}

            {surplus > 0 && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">Surplus Funds</span>
                </div>
                <p className="text-white text-lg font-semibold">
                  ${surplus.toLocaleString()} above target
                </p>
                <p className="text-slate-300 text-sm">
                  Consider investing the surplus for long-term growth
                </p>
              </div>
            )}
          </motion.div>

          {/* Educational Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <h3 className="text-lg font-bold text-white mb-4">💡 Emergency Fund Tips</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Start with a $1,000 starter emergency fund before building the full amount
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Keep your emergency fund in a high-yield savings account for easy access
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Only use for true emergencies: job loss, medical bills, major repairs
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Review and adjust your target amount annually as expenses change
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
