'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Star, CheckCircle, DollarSign, Percent, Shield } from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';

interface AccountOption {
  id: string;
  name: string;
  type: 'traditional' | 'high-yield' | 'money-market' | 'cd';
  apy: number;
  monthlyFee: number;
  minimumBalance: number;
  features: string[];
  fdicInsured: boolean;
  accessibility: 'high' | 'medium' | 'low';
  recommended?: boolean;
}

interface SavingsGoal {
  type: 'emergency' | 'vacation' | 'home' | 'car' | 'custom';
  targetAmount: number;
  timeframe: number; // months
  name: string;
}

export default function SavingsAccountOptimizer() {
  const [currentBalance, setCurrentBalance] = useState(10000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(500);
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal>({
    type: 'emergency',
    targetAmount: 25000,
    timeframe: 36,
    name: 'Emergency Fund'
  });
  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('savings-account-optimizer');
  }, [recordCalculatorUsage]);

  const accountOptions: AccountOption[] = [
    {
      id: 'traditional',
      name: 'Traditional Big Bank Savings',
      type: 'traditional',
      apy: 0.01,
      monthlyFee: 5,
      minimumBalance: 300,
      features: ['Branch access', 'ATM network', 'Basic online banking'],
      fdicInsured: true,
      accessibility: 'high'
    },
    {
      id: 'high-yield',
      name: 'High-Yield Online Savings',
      type: 'high-yield',
      apy: 4.5,
      monthlyFee: 0,
      minimumBalance: 0,
      features: ['No fees', 'Mobile app', '24/7 online access', 'ATM fee reimbursement'],
      fdicInsured: true,
      accessibility: 'high',
      recommended: true
    },
    {
      id: 'money-market',
      name: 'Money Market Account',
      type: 'money-market',
      apy: 4.2,
      monthlyFee: 0,
      minimumBalance: 2500,
      features: ['Check writing', 'Debit card', 'Higher balance tiers', 'Limited transactions'],
      fdicInsured: true,
      accessibility: 'medium'
    },
    {
      id: 'cd-12m',
      name: '12-Month Certificate of Deposit',
      type: 'cd',
      apy: 5.0,
      monthlyFee: 0,
      minimumBalance: 1000,
      features: ['Guaranteed rate', 'FDIC insured', 'No market risk', 'Early withdrawal penalty'],
      fdicInsured: true,
      accessibility: 'low'
    }
  ];

  const calculateAccountPerformance = (account: AccountOption, timeframeMonths: number) => {
    const monthlyRate = account.apy / 100 / 12;
    const monthlyFees = account.monthlyFee;
    
    let balance = currentBalance;
    let totalFees = 0;
    let totalInterest = 0;

    for (let month = 0; month < timeframeMonths; month++) {
      // Add monthly deposit
      balance += monthlyDeposit;
      
      // Calculate interest
      const monthlyInterest = balance * monthlyRate;
      balance += monthlyInterest;
      totalInterest += monthlyInterest;
      
      // Subtract fees
      balance -= monthlyFees;
      totalFees += monthlyFees;
    }

    return {
      finalBalance: balance,
      totalInterest,
      totalFees,
      netGain: totalInterest - totalFees
    };
  };

  const updateGoal = (field: keyof SavingsGoal, value: string | number) => {
    setSavingsGoal(prev => ({ ...prev, [field]: value }));
  };

  const goalPresets = [
    { type: 'emergency' as const, name: 'Emergency Fund', amount: 25000, months: 36 },
    { type: 'vacation' as const, name: 'Dream Vacation', amount: 8000, months: 18 },
    { type: 'home' as const, name: 'House Down Payment', amount: 60000, months: 60 },
    { type: 'car' as const, name: 'New Car Fund', amount: 15000, months: 24 }
  ];

  const accountPerformances = accountOptions.map(account => ({
    ...account,
    performance: calculateAccountPerformance(account, savingsGoal.timeframe)
  })).sort((a, b) => b.performance.netGain - a.performance.netGain);

  const bestAccount = accountPerformances[0];
  const worstAccount = accountPerformances[accountPerformances.length - 1];
  const improvementAmount = bestAccount.performance.netGain - worstAccount.performance.netGain;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Target className="w-8 h-8 text-blue-400" />
          <h2 className={`text-3xl font-bold ${theme.textColors.primary}`}>
            Savings Account Optimizer
          </h2>
        </div>
        <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Find the optimal savings account for your goals. Compare rates, fees, and projected 
          growth to maximize your savings potential while maintaining appropriate liquidity.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6 space-y-6`}
        >
          <h3 className={`text-xl font-semibold ${theme.textColors.primary} flex items-center gap-2`}>
            <DollarSign className="w-5 h-5" />
            Your Savings Plan
          </h3>

          {/* Current Balance */}
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Current Balance
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
              <input
                type="number"
                min="0"
                step="100"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(parseInt(e.target.value) || 0)}
                className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                placeholder="10000"
                aria-label="Current savings balance"
              />
            </div>
          </div>

          {/* Monthly Deposit */}
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Monthly Deposit
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
              <input
                type="number"
                min="0"
                step="50"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(parseInt(e.target.value) || 0)}
                className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                placeholder="500"
                aria-label="Monthly deposit amount"
              />
            </div>
          </div>

          {/* Goal Presets */}
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Savings Goal
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {goalPresets.map((preset) => (
                <button
                  key={preset.type}
                  onClick={() => setSavingsGoal({
                    type: preset.type,
                    name: preset.name,
                    targetAmount: preset.amount,
                    timeframe: preset.months
                  })}
                  className={`p-2 text-sm rounded-md transition-all ${
                    savingsGoal.type === preset.type
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Goal Inputs */}
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Target Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={savingsGoal.targetAmount}
                  onChange={(e) => updateGoal('targetAmount', parseInt(e.target.value) || 0)}
                  className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                  placeholder="25000"
                  aria-label="Target savings amount"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Timeframe (months)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={savingsGoal.timeframe}
                onChange={(e) => updateGoal('timeframe', parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                placeholder="36"
                aria-label="Timeframe in months"
              />
            </div>
          </div>
        </motion.div>

        {/* Account Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-4"
        >
          <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4`}>
            Account Performance Comparison
          </h3>

          {accountPerformances.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`${theme.backgrounds.glass} border ${
                account.recommended ? 'border-green-500/50' : theme.borderColors.primary
              } rounded-xl p-6 relative`}
            >
              {account.recommended && (
                <div className="absolute -top-3 left-6">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Recommended
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Account Info */}
                <div>
                  <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                    {account.name}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-green-400" />
                      <span className={`${theme.textColors.secondary}`}>
                        {account.apy}% APY
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-red-400" />
                      <span className={`${theme.textColors.secondary}`}>
                        ${account.monthlyFee}/month fee
                      </span>
                    </div>
                    {account.fdicInsured && (
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className={`${theme.textColors.secondary}`}>
                          FDIC Insured
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>
                    {savingsGoal.timeframe}-Month Performance
                  </h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className={theme.textColors.secondary}>Final Balance:</span>
                      <span className="text-green-400 font-semibold">
                        ${account.performance.finalBalance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textColors.secondary}>Interest Earned:</span>
                      <span className="text-green-400">
                        ${account.performance.totalInterest.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textColors.secondary}>Total Fees:</span>
                      <span className="text-red-400">
                        ${account.performance.totalFees.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className={theme.textColors.primary}>Net Gain:</span>
                      <span className="text-green-400">
                        ${account.performance.netGain.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Features</h5>
                  <ul className="space-y-1">
                    {account.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className={`text-sm ${theme.textColors.secondary} flex items-start gap-2`}>
                        <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Optimization Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className={`${theme.backgrounds.primary} rounded-xl p-6 text-center`}
      >
        <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">
          Optimization Impact
        </h3>
        <p className="text-green-200 mb-4">
          By choosing the optimal account, you could earn 
          <span className="text-green-400 font-bold mx-1">
            ${improvementAmount.toLocaleString()} more
          </span>
          over {savingsGoal.timeframe} months
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-green-400 font-semibold">Best Choice</div>
            <div className="text-white">{bestAccount.name}</div>
            <div className="text-green-200">${bestAccount.performance.netGain.toLocaleString()} gain</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-yellow-400 font-semibold">Goal Progress</div>
            <div className="text-white">
              {((bestAccount.performance.finalBalance / savingsGoal.targetAmount) * 100).toFixed(1)}%
            </div>
            <div className="text-green-200">of ${savingsGoal.targetAmount.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-blue-400 font-semibold">Monthly Need</div>
            <div className="text-white">
              ${Math.max(0, (savingsGoal.targetAmount - currentBalance) / savingsGoal.timeframe).toFixed(0)}
            </div>
            <div className="text-green-200">to reach goal</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
