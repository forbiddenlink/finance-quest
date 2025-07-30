'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  useEffect(() => {
    calculateSavings();
  }, [initialDeposit, monthlyDeposit, interestRate, timeYears]);

  // Financial calculation functions
  const futureValue = (rate: number, periods: number, payment: number, presentValue: number = 0) => {
    if (rate === 0) {
      return presentValue + (payment * periods);
    }

    const fvPresentValue = presentValue * Math.pow(1 + rate, periods);
    const fvAnnuity = payment * (Math.pow(1 + rate, periods) - 1) / rate;

    return fvPresentValue + fvAnnuity;
  };

  const calculateSavings = () => {
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
  };

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
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3 mb-4">
          <PiggyBank className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Savings Growth Calculator</h2>
        </div>
        <p className="text-lg opacity-90">
          See how your money grows with compound interest and regular savings
        </p>
      </motion.div>

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Savings Plan</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Deposit
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Deposit
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={monthlyDeposit}
                    onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    step="25"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Interest Rate (%)
                </label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    max="20"
                    step="0.1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  High-yield savings: 4-5%, Traditional savings: 0.01-0.5%
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Period (Years)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={timeYears}
                    onChange={(e) => setTimeYears(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="1"
                    max="50"
                    step="1"
                  />
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">Quick Scenarios</h4>
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
                    className="text-xs p-2 bg-white border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
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
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Results</h3>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">FUTURE VALUE</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {formatCurrency(results.futureValue)}
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium">TOTAL DEPOSITED</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {formatCurrency(results.totalDeposited)}
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <span className="text-xs text-purple-600 font-medium">INTEREST EARNED</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">
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
                    <div className="text-2xl font-bold text-orange-700">
                      {results.effectiveRate.toFixed(1)}%
                    </div>
                  </motion.div>
                </div>

                {/* Insights */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Key Insights</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
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
            className="mt-8 bg-gray-50 p-6 rounded-lg"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Growth Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    label={{ value: 'Years', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
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
                <div className="w-4 h-1 bg-blue-500 mr-2"></div>
                <span>Total Deposited</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-1 bg-green-500 mr-2"></div>
                <span>Total Value</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-1 bg-yellow-500 mr-2"></div>
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
