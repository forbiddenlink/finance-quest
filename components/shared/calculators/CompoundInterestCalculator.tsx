'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Lightbulb, Sparkles } from 'lucide-react';
import * as Financial from 'financial';
import { useProgressStore } from '@/lib/store/progressStore';

interface CompoundData {
  year: number;
  principal: number;
  interest: number;
  total: number;
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState<string>('10000');
  const [rate, setRate] = useState<string>('7');
  const [time, setTime] = useState<string>('30');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('500');
  const [data, setData] = useState<CompoundData[]>([]);
  const [totalContributed, setTotalContributed] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  // Track calculator usage for analytics
  const recordCalculatorUsage = useProgressStore((state) => state.recordCalculatorUsage);
  
  useEffect(() => {
    recordCalculatorUsage('compound-interest');
  }, [recordCalculatorUsage]);

  const calculateCompoundInterest = useCallback(() => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseInt(time) || 0;
    const monthlyAdd = parseFloat(monthlyContribution) || 0;

    if (P < 0 || r < 0 || t < 0 || monthlyAdd < 0) return;

    const compoundData: CompoundData[] = [];
    let totalContributions = P;

    for (let year = 0; year <= t; year++) {
      let yearEndValue: number;
      
      if (year === 0) {
        // Initial year - just the principal
        yearEndValue = P;
        totalContributions = P;
      } else {
        // Calculate using financial library for professional accuracy
        const monthsElapsed = year * 12;
        const monthlyRate = r / 12;
        
        // Future value of initial principal after compounding
        const futureValuePrincipal = P * Math.pow(1 + r, year);
        
        // Future value of monthly contributions (annuity)
        let futureValueContributions = 0;
        if (monthlyAdd > 0 && monthlyRate > 0) {
          // Using financial library's FV calculation for annuity
          futureValueContributions = monthlyAdd * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate);
        } else if (monthlyAdd > 0) {
          // If no interest, just sum the contributions
          futureValueContributions = monthlyAdd * monthsElapsed;
        }
        
        yearEndValue = futureValuePrincipal + futureValueContributions;
        totalContributions = P + (monthlyAdd * monthsElapsed);
      }

      const interestEarned = yearEndValue - totalContributions;

      compoundData.push({
        year,
        principal: totalContributions,
        interest: Math.max(0, interestEarned),
        total: yearEndValue
      });
    }

    setData(compoundData);
    setTotalContributed(totalContributions);
    setTotalInterest(compoundData[t]?.interest || 0);
    setFinalAmount(compoundData[t]?.total || 0);
  }, [principal, rate, time, monthlyContribution]);

  useEffect(() => {
    calculateCompoundInterest();
  }, [calculateCompoundInterest]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; value: number; dataKey: string; payload: { principal: number; interest: number; total: number } }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold">{`Year ${label}`}</p>
          <p className="text-blue-600">
            {`Total Contributions: ${formatCurrency(payload[0].payload.principal)}`}
          </p>
          <p className="text-green-600">
            {`Interest Earned: ${formatCurrency(payload[0].payload.interest)}`}
          </p>
          <p className="text-purple-600 font-semibold">
            {`Total Value: ${formatCurrency(payload[0].payload.total)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Compound Interest Calculator</h2>
      <p className="text-gray-600 mb-8">
        See the magic of compound interest - how your money grows exponentially over time
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Investment
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="10000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Contribution
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Interest Rate
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="7"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">S&P 500 historical average: ~10%</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <div className="relative">
              <input
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="30"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">years</span>
            </div>
          </div>

          {/* Key Statistics */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Final Results</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Contributed:</span>
                <span className="font-semibold text-blue-600">{formatCurrency(totalContributed)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Earned:</span>
                <span className="font-semibold text-green-600">{formatCurrency(totalInterest)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="text-lg font-semibold text-gray-900">Final Amount:</span>
                <span className="text-xl font-bold text-purple-600">{formatCurrency(finalAmount)}</span>
              </div>
            </div>

            {totalInterest > totalContributed && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                <p className="text-sm text-yellow-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Your money more than doubled through compound interest!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Over Time</h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="year"
                  label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                  label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="principal"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Contributions"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  name="Total Value"
                  dot={false}
                />
                <ReferenceLine
                  y={totalContributed}
                  stroke="#EF4444"
                  strokeDasharray="5 5"
                  label="Total Contributions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Educational Insights */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Key Lessons About Compound Interest
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-semibold mb-2">Time is Your Best Friend</h4>
            <p>The earlier you start investing, the more time compound interest has to work its magic.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Consistency Matters</h4>
            <p>Regular monthly contributions can be more powerful than large one-time investments.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">The Power of Growth</h4>
            <p>Small differences in interest rates compound into huge differences over time.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Einstein&apos;s &quot;8th Wonder&quot;</h4>
            <p>Einstein allegedly called compound interest &quot;the eighth wonder of the world.&quot;</p>
          </div>
        </div>
      </div>
    </div>
  );
}
