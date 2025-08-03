'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useProgress } from '@/lib/context/ProgressContext';
import { Lightbulb, DollarSign, Rocket, Brain, Sparkles } from 'lucide-react';
;
import { theme } from '@/lib/theme';

interface CompoundData {
  year: number;
  balance: number;
  principal: number;
  interest: number;
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [interestRate, setInterestRate] = useState(7);
  const [years, setYears] = useState(30);
  const [compoundFrequency, setCompoundFrequency] = useState(12); // Monthly

  const [chartData, setChartData] = useState<CompoundData[]>([]);
  const [finalBalance, setFinalBalance] = useState(0);
  const [totalPrincipal, setTotalPrincipal] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const { dispatch } = useProgress();

  // Calculate compound interest with monthly contributions
  const calculateCompoundInterest = useCallback(() => {
    const data: CompoundData[] = [];
    const periodicRate = interestRate / 100 / compoundFrequency;
    let balance = principal;
    let cumulativePrincipal = principal;

    // Track calculator usage
    dispatch({
      type: 'USE_CALCULATOR',
      payload: 'CompoundInterestCalculator'
    });

    for (let year = 0; year <= years; year++) {
      if (year > 0) {
        // Calculate periodic compounding for this year
        for (let period = 0; period < compoundFrequency; period++) {
          balance = balance * (1 + periodicRate);
          // Add monthly contribution (assuming monthly regardless of compound frequency)
          if (period % Math.max(1, Math.round(compoundFrequency / 12)) === 0) {
            balance += monthlyContribution;
            cumulativePrincipal += monthlyContribution;
          }
        }
      }

      const interest = balance - cumulativePrincipal;

      data.push({
        year,
        balance: Math.round(balance),
        principal: Math.round(cumulativePrincipal),
        interest: Math.round(interest)
      });
    }

    setChartData(data);
    setFinalBalance(Math.round(balance));
    setTotalPrincipal(Math.round(cumulativePrincipal));
    setTotalInterest(Math.round(balance - cumulativePrincipal));
  }, [principal, monthlyContribution, interestRate, years, compoundFrequency, dispatch]);

  useEffect(() => {
    calculateCompoundInterest();
  }, [calculateCompoundInterest]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMotivationalMessage = () => {
    const monthsToMillionaire = Math.log(1000000 / principal) / Math.log(1 + (interestRate / 100 / 12));
    const yearsToMillionaire = Math.ceil(monthsToMillionaire / 12);

    if (finalBalance >= 1000000) {
      return `Congratulations! You'll be a millionaire in ${years} years!`;
    } else if (yearsToMillionaire <= 50) {
      return `Keep going! At this rate, you'll reach $1M in about ${yearsToMillionaire} years.`;
    } else {
      return `Every dollar counts! Consider increasing your monthly contribution to reach your goals faster.`;
    }
  };

  return (
    <div className={`max-w-6xl mx-auto ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg shadow-lg p-6`}>
      <div className="mb-6">
        <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2`}>
          Compound Interest Calculator
        </h2>
        <p className={`${theme.textColors.secondary}`}>
          See how your money grows over time with the power of compound interest!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4`}>
            <h3 className={`font-semibold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
              <Lightbulb className="w-5 h-5" />
              The Magic of Compound Interest
            </h3>
            <p className={`${theme.textColors.secondary} text-sm`}>
              Einstein called it the &quot;eighth wonder of the world.&quot; Those who understand it, earn it.
              Those who don&apos;t, pay it. Watch your money grow exponentially!
            </p>
          </div>

          {/* Initial Investment */}
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Initial Investment
            </label>
            <div className="relative">
              <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className={`w-full pl-8 pr-4 py-2 border ${theme.borderColors.primary} rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                min="0"
                step="100"
              />
            </div>
            <p className={`text-xs ${theme.textColors.muted} mt-1`}>
              The amount you&apos;re starting with today
            </p>
          </div>

          {/* Monthly Contribution */}
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Monthly Contribution
            </label>
            <div className="relative">
              <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className={`w-full pl-8 pr-4 py-2 border ${theme.borderColors.primary} rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                min="0"
                step="25"
              />
            </div>
            <p className={`text-xs ${theme.textColors.muted} mt-1`}>
              How much you&apos;ll add each month
            </p>
          </div>

          {/* Interest Rate */}
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Annual Interest Rate
            </label>
            <div className="relative">
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className={`w-full pl-4 pr-8 py-2 border ${theme.borderColors.primary} rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                min="0"
                max="20"
                step="0.1"
              />
              <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>%</span>
            </div>
            <p className={`text-xs ${theme.textColors.muted} mt-1`}>
              Average stock market return is ~7-10% annually
            </p>
          </div>

          {/* Time Period */}
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Time Period (Years)
            </label>
            <input
              type="range"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className={`w-full h-2 ${theme.backgrounds.cardDisabled} rounded-lg appearance-none cursor-pointer`}
              min="1"
              max="50"
            />
            <div className={`flex justify-between text-xs ${theme.textColors.muted} mt-1`}>
              <span>1 year</span>
              <span className={`font-medium ${theme.textColors.primary}`}>{years} years</span>
              <span>50 years</span>
            </div>
          </div>

          {/* Compound Frequency */}
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Compounding Frequency
            </label>
            <select
              value={compoundFrequency}
              onChange={(e) => setCompoundFrequency(Number(e.target.value))}
              className={`w-full px-4 py-2 border ${theme.borderColors.primary} rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
            >
              <option value={1}>Annually</option>
              <option value={4}>Quarterly</option>
              <option value={12}>Monthly</option>
              <option value={365}>Daily</option>
            </select>
            <p className={`text-xs ${theme.textColors.muted} mt-1`}>
              How often interest is calculated and added
            </p>
          </div>

          {/* Quick Presets */}
          <div>
            <p className={`text-sm font-medium ${theme.textColors.primary} mb-2`}>Quick Scenarios:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setPrincipal(1000);
                  setMonthlyContribution(200);
                  setInterestRate(7);
                  setYears(30);
                }}
                className={`p-2 text-xs ${theme.status.success.bg} hover:${theme.status.success.bg} rounded transition-colors flex items-center gap-1`}
              >
                <DollarSign className="w-3 h-3" />
                Conservative Saver
              </button>
              <button
                onClick={() => {
                  setPrincipal(5000);
                  setMonthlyContribution(500);
                  setInterestRate(8);
                  setYears(25);
                }}
                className={`p-2 text-xs ${theme.backgrounds.cardHover} hover:${theme.backgrounds.cardHover} rounded transition-colors flex items-center gap-1`}
              >
                <Rocket className="w-3 h-3" />
                Aggressive Investor
              </button>
            </div>
          </div>
        </div>

        {/* Results and Chart */}
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-4 text-center`}>
              <p className={`text-sm ${theme.status.success.text} font-medium`}>Final Balance</p>
              <p className={`${theme.typography.heading2} ${theme.textColors.primary}`}>{formatCurrency(finalBalance)}</p>
            </div>
            <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center`}>
              <p className={`text-sm ${theme.textColors.primary} font-medium`}>Total Invested</p>
              <p className={`${theme.typography.heading2} ${theme.textColors.secondary}`}>{formatCurrency(totalPrincipal)}</p>
            </div>
            <div className={`${theme.backgrounds.card}/20 border ${theme.borderColors.primary}/30 rounded-lg p-4 text-center`}>
              <p className={`text-sm ${theme.textColors.primary} font-medium`}>Interest Earned</p>
              <p className={`${theme.typography.heading2} ${theme.textColors.primary}`}>{formatCurrency(totalInterest)}</p>
            </div>
          </div>

          {/* Motivational Message */}
          <div className={`bg-gradient-to-r from-yellow-50 to-orange-50 border ${theme.status.warning.border} rounded-lg p-4`}>
            <p className={`text-sm font-medium ${theme.status.warning.text} flex items-center gap-2`}>
              <Sparkles className="w-4 h-4" />
              {getMotivationalMessage()}
            </p>
          </div>

          {/* Chart */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} border ${theme.borderColors.primary} rounded-lg p-4`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-4`}>Growth Over Time</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis
                    dataKey="year"
                    label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <YAxis
                    tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                    label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    labelFormatter={(year) => `Year ${year}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Total Balance"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="principal"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    name="Total Invested"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="interest"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    name="Interest Earned"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Insights */}
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
              <Brain className="w-4 h-4" />
              Key Insights:
            </h4>
            <ul className={`text-sm ${theme.textColors.primary} space-y-1`}>
              <li>• <strong>Time is your best friend:</strong> Starting early beats starting with more money</li>
              <li>• <strong>Consistency matters:</strong> Regular contributions create steady growth</li>
              <li>• <strong>Rate impact:</strong> Even 1% difference compounds dramatically over time</li>
              <li>• <strong>The magic number:</strong> Notice how interest overtakes principal over time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
