'use client';

import React, { useState, useCallback } from 'react';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { CurrencyInput, NumberInput, PercentageInput } from '@/components/shared/calculators/FormFields';
import { formatCurrency } from '@/lib/utils/financial';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { PiggyBank } from 'lucide-react';

interface RetirementScenario {
  age: number;
  balance: number;
  monthlyContribution: number;
  employerMatch: number;
  totalContributions: number;
  totalInterest: number;
}

export default function RetirementPlannerCalculator() {
  // Input states
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('67');
  const [currentBalance, setCurrentBalance] = useState('25000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [employerMatch, setEmployerMatch] = useState('3');
  const [currentIncome, setCurrentIncome] = useState('75000');
  const [expectedReturn, setExpectedReturn] = useState('7');
  const [inflationRate, setInflationRate] = useState('3');
  const [desiredReplacement, setDesiredReplacement] = useState('80');

  // Results state
  const [results, setResults] = useState({
    finalBalance: 0,
    totalContributions: 0,
    totalInterest: 0,
    monthlyRetirementIncome: 0,
    yearlyData: [] as RetirementScenario[],
    isOnTrack: false,
    shortfall: 0,
    recommendedContribution: 0
  });

  const calculateRetirement = useCallback(() => {
    const currentAgeNum = parseInt(currentAge);
    const retirementAgeNum = parseInt(retirementAge);
    const currentBalanceNum = parseFloat(currentBalance) || 0;
    const monthlyContributionNum = parseFloat(monthlyContribution) || 0;
    const employerMatchNum = parseFloat(employerMatch) || 0;
    const currentIncomeNum = parseFloat(currentIncome) || 0;
    const expectedReturnNum = parseFloat(expectedReturn) / 100 || 0.07;
    const inflationRateNum = parseFloat(inflationRate) / 100 || 0.03;
    const desiredReplacementNum = parseFloat(desiredReplacement) / 100 || 0.8;

    if (retirementAgeNum <= currentAgeNum) {
      return;
    }

    const yearsToRetirement = retirementAgeNum - currentAgeNum;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = expectedReturnNum / 12;

    // Calculate employer match
    const monthlyEmployerMatch = (monthlyContributionNum * employerMatchNum) / 100;
    const totalMonthlyContribution = monthlyContributionNum + monthlyEmployerMatch;

    // Calculate future value with compound interest
    let balance = currentBalanceNum;
    const yearlyData: RetirementScenario[] = [];
    let totalContributions = currentBalanceNum;

    for (let year = 0; year <= yearsToRetirement; year++) {
      const age = currentAgeNum + year;

      if (year > 0) {
        // Add monthly contributions for the year
        for (let month = 0; month < 12; month++) {
          balance = balance * (1 + monthlyReturn) + totalMonthlyContribution;
          totalContributions += totalMonthlyContribution;
        }
      }

      yearlyData.push({
        age,
        balance: Math.round(balance),
        monthlyContribution: monthlyContributionNum,
        employerMatch: monthlyEmployerMatch,
        totalContributions: Math.round(totalContributions),
        totalInterest: Math.round(balance - totalContributions)
      });
    }

    const finalBalance = balance;
    const totalInterest = finalBalance - totalContributions;

    // Calculate retirement income using 4% rule
    const monthlyRetirementIncome = (finalBalance * 0.04) / 12;

    // Calculate desired retirement income (adjusted for inflation)
    const futureIncome = currentIncomeNum * Math.pow(1 + inflationRateNum, yearsToRetirement);
    const desiredMonthlyIncome = (futureIncome * desiredReplacementNum) / 12;

    // Check if on track
    const isOnTrack = monthlyRetirementIncome >= desiredMonthlyIncome;
    const shortfall = Math.max(0, desiredMonthlyIncome - monthlyRetirementIncome);

    // Calculate recommended contribution if not on track
    let recommendedContribution = monthlyContributionNum;
    if (!isOnTrack) {
      const neededBalance = desiredMonthlyIncome * 12 / 0.04;
      const futureValueFactor = (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn;
      const currentBalanceFutureValue = currentBalanceNum * Math.pow(1 + monthlyReturn, monthsToRetirement);
      const neededFromContributions = neededBalance - currentBalanceFutureValue;

      recommendedContribution = neededFromContributions / futureValueFactor;
      recommendedContribution = Math.max(0, recommendedContribution - monthlyEmployerMatch);
    }

    setResults({
      finalBalance,
      totalContributions,
      totalInterest,
      monthlyRetirementIncome,
      yearlyData,
      isOnTrack,
      shortfall: shortfall * 12,
      recommendedContribution
    });
  }, [currentAge, retirementAge, currentBalance, monthlyContribution, employerMatch, currentIncome, expectedReturn, inflationRate, desiredReplacement]);

  React.useEffect(() => {
    calculateRetirement();
  }, [calculateRetirement]);

  const handleReset = () => {
    setCurrentAge('30');
    setRetirementAge('67');
    setCurrentBalance('25000');
    setMonthlyContribution('500');
    setEmployerMatch('3');
    setCurrentIncome('75000');
    setExpectedReturn('7');
    setInflationRate('3');
    setDesiredReplacement('80');
  };

  const generateInsights = () => {
    const insights = [];
    
    const currentAgeNum = parseInt(currentAge);
    const monthlyContributionNum = parseFloat(monthlyContribution) || 0;
    const employerMatchNum = parseFloat(employerMatch) || 0;

    if (currentAgeNum <= 35) {
      insights.push({
        type: 'success' as const,
        title: 'Time is Your Superpower',
        message: `Starting retirement savings in your ${currentAgeNum}s gives you tremendous compound growth potential!`
      });
    }

    if (employerMatchNum > 0) {
      const monthlyMatch = (monthlyContributionNum * employerMatchNum) / 100;
      const annualMatch = monthlyMatch * 12;
      insights.push({
        type: 'success' as const,
        title: 'Free Money Alert!',
        message: `Your employer match gives you ${formatCurrency(annualMatch)} per year in free money!`
      });
    }

    if (results.isOnTrack) {
      insights.push({
        type: 'success' as const,
        title: 'Retirement Ready!',
        message: `You're on track for retirement with ${formatCurrency(results.monthlyRetirementIncome)}/month income.`
      });
    } else if (results.shortfall > 0) {
      insights.push({
        type: 'warning' as const,
        title: 'Adjustment Needed',
        message: `Consider increasing contributions to ${formatCurrency(results.recommendedContribution)}/month to meet your goals.`
      });
    }

    return insights;
  };

  const metadata = {
    id: 'retirement-planner-calculator',
    title: 'Retirement Planner',
    description: 'Plan your retirement with confidence. Calculate savings needs and get personalized recommendations.',
    category: 'advanced' as const,
    icon: PiggyBank,
    tags: ['retirement planning', '401k', 'compound interest', 'financial planning'],
    educationalNotes: [
      {
        title: 'The Power of Starting Early',
        content: 'Time is the most powerful factor in retirement savings. Starting early allows compound interest to work its magic.',
        tips: [
          'Start saving for retirement in your 20s if possible',
          'Take advantage of employer 401(k) matching',
          'Increase contributions when you get raises',
          'Consider Roth vs Traditional retirement accounts'
        ]
      }
    ]
  };

  const calculatorResults = {
    primary: {
      label: 'Retirement Balance',
      value: results.finalBalance,
      format: 'currency' as const,
      variant: 'success' as const,
      description: `Your projected balance at age ${retirementAge}`
    },
    secondary: [
      {
        label: 'Monthly Income',
        value: results.monthlyRetirementIncome,
        format: 'currency' as const,
        variant: results.isOnTrack ? 'success' as const : 'warning' as const,
        description: 'Estimated monthly retirement income (4% rule)'
      },
      {
        label: 'Total Contributions',
        value: results.totalContributions,
        format: 'currency' as const,
        description: 'Your total contributions over time'
      },
      {
        label: 'Investment Growth',
        value: results.totalInterest,
        format: 'currency' as const,
        variant: 'info' as const,
        description: 'Earnings from compound interest'
      }
    ]
  };

  return (
    <CalculatorWrapper
      metadata={metadata}
      inputs={
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                label="Current Age"
                value={currentAge}
                onChange={setCurrentAge}
                placeholder="30"
                min={18}
                max={100}
                helpText="Your current age in years"
              />
              <NumberInput
                label="Retirement Age"
                value={retirementAge}
                onChange={setRetirementAge}
                placeholder="67"
                min={50}
                max={80}
                helpText="When you plan to retire"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">Financial Information</h3>
            <div className="space-y-4">
              <CurrencyInput
                label="Current Retirement Balance"
                value={currentBalance}
                onChange={setCurrentBalance}
                placeholder="25,000"
                helpText="Current value of all retirement accounts"
              />
              <CurrencyInput
                label="Monthly Contribution"
                value={monthlyContribution}
                onChange={setMonthlyContribution}
                placeholder="500"
                helpText="How much you contribute monthly"
              />
              <CurrencyInput
                label="Current Annual Income"
                value={currentIncome}
                onChange={setCurrentIncome}
                placeholder="75,000"
                helpText="Your current yearly income"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">Investment Assumptions</h3>
            <div className="grid grid-cols-2 gap-4">
              <PercentageInput
                label="Expected Annual Return"
                value={expectedReturn}
                onChange={setExpectedReturn}
                placeholder="7"
                helpText="Expected investment return (7-10% is typical)"
              />
              <PercentageInput
                label="Inflation Rate"
                value={inflationRate}
                onChange={setInflationRate}
                placeholder="3"
                helpText="Expected annual inflation rate"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <PercentageInput
                label="Employer Match"
                value={employerMatch}
                onChange={setEmployerMatch}
                placeholder="3"
                helpText="Employer 401(k) match percentage"
              />
              <PercentageInput
                label="Income Replacement"
                value={desiredReplacement}
                onChange={setDesiredReplacement}
                placeholder="80"
                helpText="Percentage of current income needed in retirement"
              />
            </div>
          </div>
        </div>
      }
      results={calculatorResults}
      insights={generateInsights()}
      onReset={handleReset}
      chartComponent={
        results.yearlyData.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">
              Retirement Savings Growth
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="age" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value: number, name: string) => [formatCurrency(value), name === 'totalContributions' ? 'Your Contributions' : 'Investment Growth']}
                    labelFormatter={(age) => `Age ${age}`}
                  />
                  <Area type="monotone" dataKey="totalContributions" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="totalInterest" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null
      }
    />
  );
}
