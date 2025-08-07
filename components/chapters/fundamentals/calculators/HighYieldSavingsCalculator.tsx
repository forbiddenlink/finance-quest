'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Clock, Calculator, AlertCircle, CheckCircle } from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';

export default function HighYieldSavingsCalculator() {
  const [initialAmount, setInitialAmount] = useState(5000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(200);
  const [timeFrame, setTimeFrame] = useState(5);
  const [traditionalRate, setTraditionalRate] = useState(0.01);
  const [highYieldRate, setHighYieldRate] = useState(4.5);
  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('high-yield-savings-calculator');
  }, [recordCalculatorUsage]);

  // Calculate compound interest
  const calculateSavings = (rate: number) => {
    const monthlyRate = rate / 100 / 12;
    const totalMonths = timeFrame * 12;
    
    // Future value of initial amount
    const futureValueInitial = initialAmount * Math.pow(1 + monthlyRate, totalMonths);
    
    // Future value of monthly deposits (annuity)
    const futureValueDeposits = monthlyDeposit * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    const totalFutureValue = futureValueInitial + futureValueDeposits;
    const totalDeposits = initialAmount + (monthlyDeposit * totalMonths);
    const totalInterest = totalFutureValue - totalDeposits;
    
    return {
      futureValue: totalFutureValue,
      totalDeposits,
      totalInterest,
      effectiveYield: (totalInterest / totalDeposits) * 100
    };
  };

  const traditionalResults = calculateSavings(traditionalRate);
  const highYieldResults = calculateSavings(highYieldRate);
  const difference = highYieldResults.futureValue - traditionalResults.futureValue;
  const percentageGain = ((difference / traditionalResults.futureValue) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <TrendingUp className="w-8 h-8 text-green-400" />
          <h2 className={`text-3xl font-bold ${theme.textColors.primary}`}>
            High-Yield Savings Calculator
          </h2>
        </div>
        <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          See the dramatic difference between traditional bank savings (0.01%) and high-yield online savings (4.5%+). 
          Small rate differences create massive wealth gaps over time.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6 space-y-6`}
        >
          <h3 className={`text-xl font-semibold ${theme.textColors.primary} flex items-center gap-2`}>
            <Calculator className="w-5 h-5" />
            Your Savings Plan
          </h3>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Initial Savings Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(parseInt(e.target.value) || 0)}
                  className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                  placeholder="5000"
                  aria-label="Initial savings amount"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Monthly Deposit
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                <input
                  type="number"
                  min="0"
                  step="25"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(parseInt(e.target.value) || 0)}
                  className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                  placeholder="200"
                  aria-label="Monthly deposit amount"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Time Frame (Years)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={timeFrame}
                  onChange={(e) => setTimeFrame(parseInt(e.target.value) || 1)}
                  className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                  placeholder="5"
                  aria-label="Time frame in years"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Traditional Bank Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  step="0.01"
                  value={traditionalRate}
                  onChange={(e) => setTraditionalRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                  placeholder="0.01"
                  aria-label="Traditional bank interest rate"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  High-Yield Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={highYieldRate}
                  onChange={(e) => setHighYieldRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                  placeholder="4.5"
                  aria-label="High-yield savings interest rate"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Comparison */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Traditional Bank Results */}
          <div className={`${theme.backgrounds.glass} border border-red-500/30 rounded-xl p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-red-400">Traditional Bank (Big Bank)</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>Total Deposits:</span>
                <span className={theme.textColors.primary}>
                  ${traditionalResults.totalDeposits.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>Interest Earned:</span>
                <span className="text-red-400">
                  ${traditionalResults.totalInterest.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className={theme.textColors.primary}>Final Balance:</span>
                <span className="text-red-400">
                  ${traditionalResults.futureValue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* High-Yield Results */}
          <div className={`${theme.backgrounds.glass} border border-green-500/30 rounded-xl p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-green-400">High-Yield Online Bank</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>Total Deposits:</span>
                <span className={theme.textColors.primary}>
                  ${highYieldResults.totalDeposits.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>Interest Earned:</span>
                <span className="text-green-400">
                  ${highYieldResults.totalInterest.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className={theme.textColors.primary}>Final Balance:</span>
                <span className="text-green-400">
                  ${highYieldResults.futureValue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Difference Highlight */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`${theme.backgrounds.primary} rounded-xl p-6 text-center`}
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              You&apos;d Make ${difference.toLocaleString()} More!
            </h3>
            <p className="text-green-200 text-lg">
              That&apos;s {percentageGain.toFixed(1)}% more money with the same effort
            </p>
            <p className="text-green-100 text-sm mt-2">
              High-yield savings accounts are FDIC insured - same safety, dramatically better returns
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Educational Context */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}
      >
        <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
          Why This Difference Matters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>The Power of Compound Interest</h4>
            <ul className={`space-y-1 ${theme.textColors.secondary} text-sm`}>
              <li>• Small rate differences compound exponentially over time</li>
              <li>• High-yield accounts offer 50x-500x better returns than traditional banks</li>
              <li>• Your money works harder without any additional effort from you</li>
              <li>• FDIC insurance provides the same safety as traditional banks</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Action Steps</h4>
            <ul className={`space-y-1 ${theme.textColors.secondary} text-sm`}>
              <li>• Open a high-yield savings account this week (takes 10 minutes online)</li>
              <li>• Transfer your emergency fund to earn 4-5% instead of 0.01%</li>
              <li>• Set up automatic monthly transfers to build savings consistently</li>
              <li>• Keep 1-2 months expenses in checking, rest in high-yield savings</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
