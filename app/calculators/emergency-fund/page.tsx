'use client';

import React, { useState, useCallback } from 'react';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { CurrencyInput, SelectField } from '@/components/shared/calculators/FormFields';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Shield, Target, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/financial';
import { Progress } from '@/components/ui/progress';

interface ExpenseCategory {
  name: string;
  amount: number;
  essential: boolean;
  color: string;
}

interface SavingsMilestone {
  amount: number;
  months: number;
  description: string;
  color: string;
}

export default function EmergencyFundCalculator() {
  // Input states
  const [monthlyIncome, setMonthlyIncome] = useState('6000');
  const [rent, setRent] = useState('1500');
  const [utilities, setUtilities] = useState('200');
  const [groceries, setGroceries] = useState('600');
  const [transportation, setTransportation] = useState('400');
  const [insurance, setInsurance] = useState('300');
  const [minimumDebt, setMinimumDebt] = useState('250');
  const [other, setOther] = useState('300');
  const [monthsOfExpenses, setMonthsOfExpenses] = useState('6');
  const [monthlySavings, setMonthlySavings] = useState('500');
  const [currentSavings, setCurrentSavings] = useState('1000');

  // Results state
  const [results, setResults] = useState({
    totalExpenses: 0,
    emergencyFundTarget: 0,
    timeToGoal: 0,
    expenseBreakdown: [] as ExpenseCategory[],
    savingsMilestones: [] as SavingsMilestone[],
    incomeAfterExpenses: 0,
    savingsRate: 0,
    currentProgress: 0
  });

  const calculateEmergencyFund = useCallback(() => {
    const rentAmount = parseFloat(rent) || 0;
    const utilitiesAmount = parseFloat(utilities) || 0;
    const groceriesAmount = parseFloat(groceries) || 0;
    const transportationAmount = parseFloat(transportation) || 0;
    const insuranceAmount = parseFloat(insurance) || 0;
    const debtAmount = parseFloat(minimumDebt) || 0;
    const otherAmount = parseFloat(other) || 0;
    const months = parseFloat(monthsOfExpenses) || 6;
    const savings = parseFloat(monthlySavings) || 0;
    const current = parseFloat(currentSavings) || 0;
    const income = parseFloat(monthlyIncome) || 0;

    const expenses = rentAmount + utilitiesAmount + groceriesAmount +
      transportationAmount + insuranceAmount + debtAmount + otherAmount;

    const target = expenses * months;
    const remaining = Math.max(0, target - current);
    const timeMonths = savings > 0 ? Math.ceil(remaining / savings) : 0;
    const incomeAfterExpenses = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    const currentProgress = target > 0 ? (current / target) * 100 : 0;

    // Expense breakdown for pie chart
    const breakdown: ExpenseCategory[] = [
      { name: 'Housing', amount: rentAmount, essential: true, color: '#EF4444' },
      { name: 'Utilities', amount: utilitiesAmount, essential: true, color: '#F97316' },
      { name: 'Food', amount: groceriesAmount, essential: true, color: '#EAB308' },
      { name: 'Transportation', amount: transportationAmount, essential: true, color: '#22C55E' },
      { name: 'Insurance', amount: insuranceAmount, essential: true, color: '#3B82F6' },
      { name: 'Debt Payments', amount: debtAmount, essential: true, color: '#8B5CF6' },
      { name: 'Other', amount: otherAmount, essential: false, color: '#6B7280' }
    ].filter(category => category.amount > 0);

    // Savings milestones
    const milestones: SavingsMilestone[] = [
      { amount: 1000, months: 0, description: 'Starter Emergency Fund', color: '#10B981' },
      { amount: expenses * 1, months: 0, description: '1 Month of Expenses', color: '#3B82F6' },
      { amount: expenses * 3, months: 0, description: '3 Months of Expenses', color: '#8B5CF6' },
      { amount: expenses * 6, months: 0, description: '6 Months of Expenses', color: '#EF4444' },
      { amount: expenses * 12, months: 0, description: '12 Months of Expenses', color: '#F59E0B' }
    ];

    milestones.forEach(milestone => {
      const remainingToMilestone = Math.max(0, milestone.amount - current);
      milestone.months = savings > 0 ? Math.ceil(remainingToMilestone / savings) : 0;
    });

    setResults({
      totalExpenses: expenses,
      emergencyFundTarget: target,
      timeToGoal: timeMonths,
      expenseBreakdown: breakdown,
      savingsMilestones: milestones,
      incomeAfterExpenses,
      savingsRate,
      currentProgress
    });
  }, [rent, utilities, groceries, transportation, insurance, minimumDebt, other, monthsOfExpenses, monthlySavings, currentSavings, monthlyIncome]);

  React.useEffect(() => {
    calculateEmergencyFund();
  }, [calculateEmergencyFund]);

  const handleReset = () => {
    setMonthlyIncome('6000');
    setRent('1500');
    setUtilities('200');
    setGroceries('600');
    setTransportation('400');
    setInsurance('300');
    setMinimumDebt('250');
    setOther('300');
    setMonthsOfExpenses('6');
    setMonthlySavings('500');
    setCurrentSavings('1000');
  };

  const formatMonths = (months: number) => {
    if (months === 0) return 'Already achieved!';
    if (months === 1) return '1 month';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  };

  // Generate insights based on calculations
  const generateInsights = () => {
    const insights = [];
    
    // Budget health insight
    if (results.incomeAfterExpenses > 0) {
      insights.push({
        type: 'success' as const,
        title: 'Healthy Budget',
        message: `Great! You have ${formatCurrency(results.incomeAfterExpenses)} left after essential expenses. This gives you flexibility to build your emergency fund.`
      });
    } else {
      insights.push({
        type: 'error' as const,
        title: 'Budget Deficit',
        message: `Warning: You're spending ${formatCurrency(Math.abs(results.incomeAfterExpenses))} more than you earn. Focus on reducing expenses before building emergency savings.`
      });
    }

    // Savings rate insight
    if (results.savingsRate >= 20) {
      insights.push({
        type: 'success' as const,
        title: 'Excellent Savings Rate',
        message: `Your ${results.savingsRate.toFixed(1)}% savings rate is excellent! You're well positioned to build wealth long-term.`
      });
    } else if (results.savingsRate >= 10) {
      insights.push({
        type: 'info' as const,
        title: 'Good Savings Rate',
        message: `Your ${results.savingsRate.toFixed(1)}% savings rate is good. Consider increasing to 20%+ for faster wealth building.`
      });
    } else {
      insights.push({
        type: 'warning' as const,
        title: 'Low Savings Rate',
        message: `Your ${results.savingsRate.toFixed(1)}% savings rate is below the recommended 10%. Try to cut expenses or increase income.`
      });
    }

    // Progress insight
    if (results.currentProgress >= 100) {
      insights.push({
        type: 'success' as const,
        title: 'Emergency Fund Complete!',
        message: `Congratulations! You've reached your emergency fund goal. Consider investing additional savings for growth.`
      });
    } else if (results.currentProgress >= 50) {
      insights.push({
        type: 'info' as const,
        title: 'Halfway There!',
        message: `You're ${results.currentProgress.toFixed(1)}% to your emergency fund goal. Keep up the momentum!`
      });
    }

    // Time to goal insight
    if (results.timeToGoal <= 12) {
      insights.push({
        type: 'success' as const,
        title: 'Quick Goal Achievement',
        message: `At your current savings rate, you'll reach your emergency fund goal in just ${formatMonths(results.timeToGoal)}!`
      });
    }

    return insights;
  };

  // Calculator metadata
  const metadata = {
    id: 'emergency-fund-calculator',
    title: 'Emergency Fund Calculator',
    description: 'Build your financial safety net with personalized targets and realistic timelines.',
    category: 'basic' as const,
    icon: Shield,
    tags: ['emergency fund', 'savings', 'financial security', 'budgeting'],
    educationalNotes: [
      {
        title: 'Emergency Fund Strategy',
        content: 'An emergency fund is your financial safety net for unexpected expenses like job loss, medical bills, or major repairs. It should be easily accessible but separate from your regular checking account.',
        tips: [
          'Start small with $1,000, then work toward 3-6 months of expenses',
          'Keep emergency funds in high-yield savings accounts',
          'Automate transfers on payday to build consistently',
          'Commission workers and contractors need larger emergency funds'
        ]
      },
      {
        title: 'Calculating Your Target',
        content: 'Your emergency fund should cover essential expenses only, not your entire lifestyle. Focus on housing, utilities, food, transportation, insurance, and minimum debt payments.',
        tips: [
          'Use only essential expenses in your calculation',
          'Single-income families should target 9-12 months',
          'Government employees might need only 3 months',
          'Freelancers should target 6-12 months minimum'
        ]
      }
    ]
  };

  // Results formatting for the wrapper
  const calculatorResults = {
    primary: {
      label: 'Emergency Fund Target',
      value: results.emergencyFundTarget,
      format: 'currency' as const,
      variant: 'success' as const,
      description: `${monthsOfExpenses} months of essential expenses`
    },
    secondary: [
      {
        label: 'Monthly Expenses',
        value: results.totalExpenses,
        format: 'currency' as const,
        description: 'Total essential monthly costs'
      },
      {
        label: 'Time to Goal',
        value: results.timeToGoal,
        format: 'months' as const,
        variant: results.timeToGoal <= 12 ? 'success' as const : 'info' as const,
        description: `At ${formatCurrency(parseFloat(monthlySavings))}/month`
      },
      {
        label: 'Current Progress',
        value: results.currentProgress,
        format: 'percentage' as const,
        variant: results.currentProgress >= 100 ? 'success' as const : 
                 results.currentProgress >= 50 ? 'info' as const : 'warning' as const,
        description: `${formatCurrency(parseFloat(currentSavings))} saved so far`
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
        {/* Income Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">Income</h3>
          <CurrencyInput
            id="monthly-income"
            label="Monthly Income"
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            placeholder="6,000"
            helpText="Your total monthly take-home pay"
          />
        </div>

        {/* Essential Expenses */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">Essential Monthly Expenses</h3>
          <div className="space-y-4">
            <CurrencyInput
              id="housing"
              label="Housing (Rent/Mortgage)"
              value={rent}
              onChange={setRent}
              placeholder="1,500"
              helpText="Monthly housing payment"
            />
            <CurrencyInput
              id="utilities"
              label="Utilities"
              value={utilities}
              onChange={setUtilities}
              placeholder="200"
              helpText="Electric, gas, water, internet, phone"
            />
            <CurrencyInput
              id="groceries"
              label="Groceries"
              value={groceries}
              onChange={setGroceries}
              placeholder="600"
              helpText="Essential food and household items"
            />
            <CurrencyInput
              id="transportation"
              label="Transportation"
              value={transportation}
              onChange={setTransportation}
              placeholder="400"
              helpText="Car payment, gas, public transit"
            />
            <CurrencyInput
              id="insurance"
              label="Insurance"
              value={insurance}
              onChange={setInsurance}
              placeholder="300"
              helpText="Health, auto, life insurance premiums"
            />
            <CurrencyInput
              id="debt-payments"
              label="Minimum Debt Payments"
              value={minimumDebt}
              onChange={setMinimumDebt}
              placeholder="250"
              helpText="Credit cards, loans (minimums only)"
            />
            <CurrencyInput
              id="other-essential"
              label="Other Essential"
              value={other}
              onChange={setOther}
              placeholder="300"
              helpText="Childcare, prescriptions, etc."
            />
          </div>
        </div>

        {/* Emergency Fund Goals */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">Emergency Fund Settings</h3>
          <div className="space-y-4">
            <SelectField
              id="months-target"
              label="Target (Months of Expenses)"
              value={monthsOfExpenses}
              onChange={setMonthsOfExpenses}
              options={[
                { value: '1', label: '1 month (Minimum)' },
                { value: '3', label: '3 months (Standard)' },
                { value: '6', label: '6 months (Recommended)' },
                { value: '9', label: '9 months (Conservative)' },
                { value: '12', label: '12 months (High Risk Jobs)' }
              ]}
              helpText="How many months of expenses to save"
            />
            <CurrencyInput
              id="monthly-savings"
              label="Monthly Savings Goal"
              value={monthlySavings}
              onChange={setMonthlySavings}
              placeholder="500"
              helpText={`${results.savingsRate.toFixed(1)}% of income`}
            />
            <CurrencyInput
              id="current-savings"
              label="Current Emergency Savings"
              value={currentSavings}
              onChange={setCurrentSavings}
              placeholder="1,000"
              helpText="Amount already saved for emergencies"
            />
          </div>
        </div>

        {/* Charts and Additional Content */}
        {results.expenseBreakdown.length > 0 && (
          <div className="space-y-8 mt-8">
            {/* Progress Bar */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">Current Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{formatCurrency(parseFloat(currentSavings))}</span>
                  <span>{formatCurrency(results.emergencyFundTarget)}</span>
                </div>
                <Progress value={Math.min(results.currentProgress, 100)} className="h-3" />
                <div className="text-center text-sm text-gray-600">
                  {results.currentProgress.toFixed(1)}% Complete
                </div>
              </div>
            </div>

            {/* Expense Breakdown Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">Monthly Expense Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="amount"
                      nameKey="name"
                    >
                      {results.expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {results.expenseBreakdown.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-sm text-gray-600">{entry.name}: {formatCurrency(entry.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings Milestones */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">Savings Milestones</h3>
              <div className="space-y-3">
                {results.savingsMilestones.map((milestone, index) => {
                  const achieved = parseFloat(currentSavings) >= milestone.amount;
                  return (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                      achieved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        {achieved ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Target className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <div className={`font-medium ${achieved ? 'text-green-700' : 'text-gray-700'}`}>
                            {milestone.description}
                          </div>
                          <div className={`text-sm ${achieved ? 'text-green-600' : 'text-gray-500'}`}>
                            {formatCurrency(milestone.amount)}
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${achieved ? 'text-green-600' : 'text-gray-500'}`}>
                        {achieved ? '✓ Achieved!' : formatMonths(milestone.months)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorWrapper>
  );
}
