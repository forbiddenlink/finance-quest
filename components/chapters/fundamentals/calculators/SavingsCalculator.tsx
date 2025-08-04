'use client';

import React, { useState, useCallback } from 'react';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { CurrencyInput, NumberInput } from '@/components/shared/calculators/FormFields';
import { ResultCard } from '@/components/shared/calculators/ResultComponents';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PiggyBank, TrendingUp, DollarSign, Target } from 'lucide-react';
import { theme } from '@/lib/theme';

interface ChartDataPoint {
  year: number;
  deposited: number;
  total: number;
  interest: number;
}

const SavingsCalculator = () => {
  // Form inputs
  const [initialDeposit, setInitialDeposit] = useState('1000');
  const [monthlyDeposit, setMonthlyDeposit] = useState('100');
  const [interestRate, setInterestRate] = useState('4.5');
  const [timeYears, setTimeYears] = useState('5');

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [results, setResults] = useState({
    futureValue: 0,
    totalDeposited: 0,
    interestEarned: 0,
    effectiveRate: 0
  });

  const calculateSavings = useCallback(() => {
    const initial = parseFloat(initialDeposit) || 0;
    const monthly = parseFloat(monthlyDeposit) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseInt(timeYears) || 0;

    if (initial < 0 || monthly < 0 || rate < 0 || years < 0) return;

    const monthlyRate = rate / 100 / 12;
    const totalMonths = years * 12;

    // Calculate future value of initial deposit (lump sum)
    const initialDepositFV = initial * Math.pow(1 + monthlyRate, totalMonths);

    // Calculate future value of monthly deposits (annuity)
    let monthlyDepositsFV = 0;
    if (monthlyRate === 0) {
      monthlyDepositsFV = monthly * totalMonths;
    } else {
      monthlyDepositsFV = monthly * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    }

    const totalFutureValue = initialDepositFV + monthlyDepositsFV;
    const totalDeposited = initial + (monthly * totalMonths);
    const totalInterestEarned = totalFutureValue - totalDeposited;

    setResults({
      futureValue: totalFutureValue,
      totalDeposited: totalDeposited,
      interestEarned: totalInterestEarned,
      effectiveRate: years > 0 ? ((totalFutureValue / totalDeposited - 1) / years) * 100 : 0
    });

    // Generate chart data
    const data = [];
    for (let year = 0; year <= years; year++) {
      const yearMonths = year * 12;

      const yearInitialFV = year === 0 ? initial :
        initial * Math.pow(1 + monthlyRate, yearMonths);

      let yearMonthlyFV = 0;
      if (year > 0) {
        if (monthlyRate === 0) {
          yearMonthlyFV = monthly * yearMonths;
        } else {
          yearMonthlyFV = monthly * (Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate;
        }
      }

      const yearTotalDeposited = initial + (monthly * yearMonths);
      const yearTotalValue = yearInitialFV + yearMonthlyFV;

      data.push({
        year,
        deposited: yearTotalDeposited,
        total: yearTotalValue,
        interest: yearTotalValue - yearTotalDeposited
      });
    }
    setChartData(data);
  }, [initialDeposit, monthlyDeposit, interestRate, timeYears]);

  React.useEffect(() => {
    calculateSavings();
  }, [calculateSavings]);

  const handleReset = () => {
    setInitialDeposit('1000');
    setMonthlyDeposit('100');
    setInterestRate('4.5');
    setTimeYears('5');
  };

  const applyPreset = (preset: { initial: number; monthly: number; rate: number; years: number }) => {
    setInitialDeposit(preset.initial.toString());
    setMonthlyDeposit(preset.monthly.toString());
    setInterestRate(preset.rate.toString());
    setTimeYears(preset.years.toString());
  };

  // Generate insights based on calculations
  const generateInsights = () => {
    const insights = [];
    
    const rateNum = parseFloat(interestRate) || 0;
    const yearNum = parseInt(timeYears) || 0;
    const monthlyNum = parseFloat(monthlyDeposit) || 0;
    const initialNum = parseFloat(initialDeposit) || 0;

    // Low interest rate warning
    if (rateNum < 1) {
      insights.push({
        type: 'warning' as const,
        title: 'Very Low Interest Rate',
        message: `At ${rateNum}% interest, you're barely beating inflation. Consider high-yield savings accounts offering 4-5% APY.`
      });
    }

    // Great rate insight
    if (rateNum >= 4) {
      insights.push({
        type: 'success' as const,
        title: 'Excellent Savings Rate',
        message: `Your ${rateNum}% rate is competitive! You're earning ${formatCurrency(results.interestEarned)} in interest over ${yearNum} years.`
      });
    }

    // Emergency fund goal insight
    if (monthlyNum >= 300 && yearNum <= 3) {
      const emergencyFund = monthlyNum * 6; // 6 months of expenses
      insights.push({
        type: 'info' as const,
        title: 'Emergency Fund Progress',
        message: `At ${formatCurrency(monthlyNum)}/month, you could build a ${formatCurrency(emergencyFund)} emergency fund in ${Math.ceil(emergencyFund / monthlyNum)} months.`
      });
    }

    // Big vs online bank comparison
    if (rateNum > 0.5) {
      const bigBankInterest = results.totalDeposited * 0.0001 * yearNum;
      const savings = results.interestEarned - bigBankInterest;
      if (savings > 100) {
        insights.push({
          type: 'success' as const,
          title: 'Smart Banking Choice',
          message: `Compared to big banks (0.01% APY), you'll earn ${formatCurrency(savings)} more with your current rate!`
        });
      }
    }

    return insights;
  };

  // Calculator metadata
  const metadata = {
    id: 'savings-calculator',
    title: 'Savings Growth Calculator',
    description: 'See how your money grows with compound interest and regular savings',
    category: 'basic' as const,
    icon: PiggyBank,
    tags: ['savings', 'compound interest', 'banking', 'emergency fund'],
    educationalNotes: [
      {
        title: 'Maximize Your Savings Rate',
        content: 'The difference between a traditional bank (0.01% APY) and a high-yield online bank (4-5% APY) can mean thousands of dollars over time.',
        tips: [
          'Research online banks and credit unions for better rates',
          'Consider money market accounts for higher balances',
          'Look for accounts with no monthly fees or minimum balance requirements',
          'Set up automatic transfers to make saving effortless'
        ]
      },
      {
        title: 'Emergency Fund Strategy',
        content: 'Financial experts recommend saving 3-6 months of expenses in an easily accessible account. This calculator helps you plan how long it will take to reach your goal.',
        tips: [
          'Start with a goal of $1,000 for small emergencies',
          'Gradually build to 3-6 months of living expenses',
          'Keep emergency funds in high-yield, liquid accounts',
          'Separate emergency savings from other financial goals'
        ]
      }
    ]
  };

  // Results formatting for the wrapper
  const calculatorResults = {
    primary: {
      label: 'Future Value',
      value: results.futureValue,
      format: 'currency' as const,
      variant: 'success' as const,
      description: `Your money after ${timeYears} years of growth`
    },
    secondary: [
      {
        label: 'Total Deposited',
        value: results.totalDeposited,
        format: 'currency' as const,
        description: 'All your contributions over time'
      },
      {
        label: 'Interest Earned',
        value: results.interestEarned,
        format: 'currency' as const,
        variant: 'success' as const,
        description: 'Free money from compound interest'
      },
      {
        label: 'Effective Annual Return',
        value: results.effectiveRate,
        format: 'percentage' as const,
        description: 'Your average yearly growth rate'
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
        {/* Input Section */}
        <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Your Savings Plan</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrencyInput
              id="initialDeposit"
              label="Initial Deposit"
              value={initialDeposit}
              onChange={setInitialDeposit}
              min={0}
              step={100}
              placeholder="Enter initial deposit"
            />

            <CurrencyInput
              id="monthlyDeposit"
              label="Monthly Deposit"
              value={monthlyDeposit}
              onChange={setMonthlyDeposit}
              min={0}
              step={25}
              placeholder="Enter monthly amount"
            />

            <NumberInput
              id="interestRate"
              label="Annual Interest Rate (%)"
              value={interestRate}
              onChange={setInterestRate}
              min={0}
              max={20}
              step={0.1}
              placeholder="Enter annual rate"
            />
            <p className={`text-xs ${theme.textColors.muted} mt-1`}>
              High-yield savings: 4-5%, Traditional savings: 0.01-0.5%
            </p>

            <NumberInput
              id="timeYears"
              label="Time Period (years)"
              value={timeYears}
              onChange={setTimeYears}
              min={1}
              max={50}
              step={1}
              placeholder="Enter number of years"
            />
          </div>

          {/* Quick Presets */}
          <div className={`mt-6 ${theme.backgrounds.glass} border ${theme.borderColors.primary} p-4 rounded-lg`}>
            <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Quick Scenarios</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Big Bank (0.01%)', initial: 1000, monthly: 200, rate: 0.01, years: 5 },
                { label: 'Credit Union (2.5%)', initial: 1000, monthly: 200, rate: 2.5, years: 5 },
                { label: 'Online Bank (4.5%)', initial: 1000, monthly: 200, rate: 4.5, years: 5 },
                { label: 'Emergency Fund Goal', initial: 0, monthly: 400, rate: 4.5, years: 2 }
              ].map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className={`text-xs p-2 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded hover:${theme.status.info.bg} transition-colors`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard
            icon={Target}
            label="Future Value"
            value={results.futureValue}
            format="currency"
            variant="success"
          />
          
          <ResultCard
            icon={DollarSign}
            label="Interest Earned"
            value={results.interestEarned}
            format="currency"
            variant="info"
          />
          
          <ResultCard
            icon={TrendingUp}
            label="Growth Multiplier"
            value={results.totalDeposited > 0 ? (results.futureValue / results.totalDeposited) : 1}
            format="number"
            variant="warning"
          />
        </div>

        {/* Chart Section */}
        {chartData.length > 0 && (
          <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Growth Over Time</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[700]} opacity={0.3} />
                  <XAxis
                    dataKey="year"
                    label={{ value: 'Years', position: 'insideBottom', offset: -10 }}
                    tick={{ fill: theme.colors.slate[400] }}
                  />
                  <YAxis
                    tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                    label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
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
                      name === 'deposited' ? 'Total Deposited' : 
                      name === 'interest' ? 'Interest Earned' : 'Total Value'
                    ]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="deposited"
                    stroke={theme.colors.blue[400]}
                    strokeWidth={2}
                    name="deposited"
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={theme.colors.emerald[400]}
                    strokeWidth={3}
                    name="total"
                  />
                  <Line
                    type="monotone"
                    dataKey="interest"
                    stroke={theme.colors.amber[400]}
                    strokeWidth={2}
                    name="interest"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Legend */}
            <div className="flex justify-center space-x-6 mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-1 bg-blue-400 mr-2"></div>
                <span>Total Deposited</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-1 bg-emerald-400 mr-2"></div>
                <span>Total Value</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-1 bg-amber-400 mr-2"></div>
                <span>Interest Earned</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorWrapper>
  );
};

export default SavingsCalculator;
