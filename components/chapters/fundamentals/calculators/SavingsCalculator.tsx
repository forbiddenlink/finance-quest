'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { theme } from '@/lib/theme';

interface SavingsResults {
  futureValue: number;
  totalDeposited: number;
  interestEarned: number;
  effectiveRate: number;
}

interface ChartDataPoint {
  year: number;
  deposited: number;
  total: number;
  interest: number;
}

const SavingsCalculator = () => {
  const [initialDeposit, setInitialDeposit] = useState<number>(1000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(100);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [timeYears, setTimeYears] = useState<number>(5);
  const [results, setResults] = useState<SavingsResults | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const calculateSavings = useCallback(() => {
    try {
      const monthlyRate = (interestRate / 100) / 12;
      const totalMonths = timeYears * 12;

      // Calculate future value of initial deposit (lump sum)
      const initialDepositFV = initialDeposit * Math.pow(1 + monthlyRate, totalMonths);

      // Calculate future value of monthly deposits (annuity)
      let monthlyDepositsFV = 0;
      if (monthlyRate === 0) {
        monthlyDepositsFV = monthlyDeposit * totalMonths;
      } else {
        monthlyDepositsFV = monthlyDeposit * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
      }

      const totalFutureValue = initialDepositFV + monthlyDepositsFV;
      const totalDeposited = initialDeposit + (monthlyDeposit * totalMonths);
      const totalInterestEarned = totalFutureValue - totalDeposited;

      setResults({
        futureValue: totalFutureValue,
        totalDeposited: totalDeposited,
        interestEarned: totalInterestEarned,
        effectiveRate: ((totalFutureValue / totalDeposited - 1) / timeYears) * 100
      });

      // Generate chart data
      const data = [];
      for (let year = 0; year <= timeYears; year++) {
        const yearMonths = year * 12;

        // Calculate values for this year
        const yearInitialFV = year === 0 ? initialDeposit :
          initialDeposit * Math.pow(1 + monthlyRate, yearMonths);

        let yearMonthlyFV = 0;
        if (year > 0) {
          if (monthlyRate === 0) {
            yearMonthlyFV = monthlyDeposit * yearMonths;
          } else {
            yearMonthlyFV = monthlyDeposit * (Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate;
          }
        }

        const yearTotalDeposited = initialDeposit + (monthlyDeposit * yearMonths);
        const yearTotalValue = yearInitialFV + yearMonthlyFV;

        data.push({
          year,
          deposited: yearTotalDeposited,
          total: yearTotalValue,
          interest: yearTotalValue - yearTotalDeposited
        });
      }
      setChartData(data);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  }, [initialDeposit, monthlyDeposit, interestRate, timeYears]);

  useEffect(() => {
    calculateSavings();
  }, [calculateSavings]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg shadow-lg overflow-hidden`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3 mb-4">
          <PiggyBank className="w-8 h-8" />
          <h2 className={`${theme.typography.heading2}`}>Savings Growth Calculator</h2>
        </div>
        <p className="text-lg opacity-90">
          See how your money grows with compound interest and regular savings
        </p>
      </motion.div>

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>Your Savings Plan</h3>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Initial Deposit
                </label>
                <div className="relative">
                  <DollarSign className={`absolute left-3 top-3 w-5 h-5 ${theme.textColors.muted}`} />
                  <input
                    type="number"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Monthly Deposit
                </label>
                <div className="relative">
                  <DollarSign className={`absolute left-3 top-3 w-5 h-5 ${theme.textColors.muted}`} />
                  <input
                    type="number"
                    value={monthlyDeposit}
                    onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    min="0"
                    step="25"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Annual Interest Rate (%)
                </label>
                <div className="relative">
                  <TrendingUp className={`absolute left-3 top-3 w-5 h-5 ${theme.textColors.muted}`} />
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    min="0"
                    max="20"
                    step="0.1"
                  />
                </div>
                <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                  High-yield savings: 4-5%, Traditional savings: 0.01-0.5%
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Time Period (Years)
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-3 w-5 h-5 ${theme.textColors.muted}`} />
                  <input
                    type="number"
                    value={timeYears}
                    onChange={(e) => setTimeYears(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    min="1"
                    max="50"
                    step="1"
                  />
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} p-4 rounded-lg`}>
              <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Quick Scenarios</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Emergency Fund', initial: 0, monthly: 200, rate: 4.5, years: 2 },
                  { label: 'Vacation Fund', initial: 500, monthly: 150, rate: 4.0, years: 1 },
                  { label: 'House Down Payment', initial: 5000, monthly: 500, rate: 4.5, years: 5 },
                  { label: 'Car Purchase', initial: 1000, monthly: 300, rate: 4.0, years: 3 }
                ].map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInitialDeposit(preset.initial);
                      setMonthlyDeposit(preset.monthly);
                      setInterestRate(preset.rate);
                      setTimeYears(preset.years);
                    }}
                    className="text-xs p-2 ${theme.backgrounds.glass} border ${theme.borderColors.primary} border ${theme.borderColors.primary} rounded hover:${theme.status.info.bg} hover:border-blue-300 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            {results && (
              <>
                <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>Your Results</h3>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border ${theme.status.info.border}"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Target className="w-5 h-5 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">FUTURE VALUE</span>
                    </div>
                    <div className={`${theme.typography.heading2} ${theme.textColors.secondary}`}>
                      {formatCurrency(results.futureValue)}
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border ${theme.status.info.border}"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-5 h-5 text-blue-400" />
                      <span className="text-xs text-blue-400 font-medium">TOTAL DEPOSITED</span>
                    </div>
                    <div className={`${theme.typography.heading2} ${theme.textColors.secondary}`}>
                      {formatCurrency(results.totalDeposited)}
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border ${theme.status.info.border}"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <span className="text-xs text-purple-400 font-medium">INTEREST EARNED</span>
                    </div>
                    <div className={`${theme.typography.heading2} text-purple-700`}>
                      {formatCurrency(results.interestEarned)}
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      <span className="text-xs text-orange-600 font-medium">EFFECTIVE RATE</span>
                    </div>
                    <div className={`${theme.typography.heading2} text-orange-700`}>
                      {results.effectiveRate.toFixed(1)}%
                    </div>
                  </motion.div>
                </div>

                {/* Insights */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border ${theme.status.info.border}">
                  <h4 className="font-semibold ${theme.textColors.secondary} mb-2">💡 Key Insights</h4>
                  <ul className="text-sm ${theme.textColors.secondary} space-y-1">
                    <li>• Your money will grow by {((results.futureValue / results.totalDeposited - 1) * 100).toFixed(1)}% over {timeYears} years</li>
                    <li>• Interest will earn you {formatCurrency(results.interestEarned)} - that&apos;s {(results.interestEarned / results.totalDeposited * 100).toFixed(1)}% of your deposits!</li>
                    <li>• Monthly deposits of {formatCurrency(monthlyDeposit)} grow to {formatCurrency(results.futureValue / (timeYears * 12))} per month</li>
                  </ul>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Chart Section */}
        {chartData.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-8 ${theme.backgrounds.glass} border ${theme.borderColors.primary} p-6 rounded-lg"
          >
            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>Growth Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis
                    dataKey="year"
                    label={{ value: 'Years', position: 'insideBottom', offset: -10 }}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <YAxis
                    tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                    label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="deposited"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Total Deposited"
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#82ca9d"
                    strokeWidth={3}
                    name="Total Value"
                  />
                  <Line
                    type="monotone"
                    dataKey="interest"
                    stroke="#ffc658"
                    strokeWidth={2}
                    name="Interest Earned"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center space-x-6 mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-1 ${theme.status.info.bg}0 mr-2"></div>
                <span>Total Deposited</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-1 ${theme.status.success.bg}0 mr-2"></div>
                <span>Total Value</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-1 ${theme.status.warning.bg}0 mr-2"></div>
                <span>Interest Earned</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SavingsCalculator;
