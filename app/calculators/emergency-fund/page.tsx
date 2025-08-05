'use client';

import React, { useState } from 'react';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { CurrencyInput, SelectField } from '@/components/shared/calculators/FormFields';
import { InputGroup } from '@/components/shared/calculators/FormFields';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Shield, Target, CheckCircle, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/financial';
import { Progress } from '@/components/ui/progress';
import { theme } from '@/lib/theme';
import { useEmergencyFundCalculator } from '@/lib/utils/calculatorHooks';

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
  // Extended inputs for detailed breakdown
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

  // Calculate total monthly expenses
  const totalExpenses =
    (parseFloat(rent) || 0) +
    (parseFloat(utilities) || 0) +
    (parseFloat(groceries) || 0) +
    (parseFloat(transportation) || 0) +
    (parseFloat(insurance) || 0) +
    (parseFloat(minimumDebt) || 0) +
    (parseFloat(other) || 0);

  // Use the simplified hook with calculated expenses
  const {
    results,
    updateField,
    reset: resetHook
  } = useEmergencyFundCalculator();

  // Sync the hook values with our detailed inputs
  React.useEffect(() => {
    updateField('monthlyExpenses', totalExpenses.toString());
    updateField('monthlyIncome', monthlyIncome);
    updateField('targetMonths', monthsOfExpenses);
    updateField('currentSavings', currentSavings);
    updateField('monthlySavings', monthlySavings);
  }, [totalExpenses, monthlyIncome, monthsOfExpenses, currentSavings, monthlySavings, updateField]);

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
    resetHook();
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

  // Generate expense breakdown for chart
  const expenseBreakdown: ExpenseCategory[] = [
    { name: 'Housing', amount: parseFloat(rent) || 0, essential: true, color: '#EF4444' },
    { name: 'Utilities', amount: parseFloat(utilities) || 0, essential: true, color: '#F97316' },
    { name: 'Food', amount: parseFloat(groceries) || 0, essential: true, color: '#EAB308' },
    { name: 'Transportation', amount: parseFloat(transportation) || 0, essential: true, color: '#22C55E' },
    { name: 'Insurance', amount: parseFloat(insurance) || 0, essential: true, color: '#3B82F6' },
    { name: 'Debt Payments', amount: parseFloat(minimumDebt) || 0, essential: true, color: '#8B5CF6' },
    { name: 'Other', amount: parseFloat(other) || 0, essential: false, color: '#6B7280' }
  ].filter(category => category.amount > 0);

  // Generate savings milestones
  const savingsMilestones: SavingsMilestone[] = [
    { amount: 1000, months: 0, description: 'Starter Emergency Fund', color: '#10B981' },
    { amount: totalExpenses * 1, months: 0, description: '1 Month of Expenses', color: '#3B82F6' },
    { amount: totalExpenses * 3, months: 0, description: '3 Months of Expenses', color: '#8B5CF6' },
    { amount: totalExpenses * 6, months: 0, description: '6 Months of Expenses', color: '#EF4444' },
    { amount: totalExpenses * 12, months: 0, description: '12 Months of Expenses', color: '#F59E0B' }
  ];

  // Calculate time to reach each milestone
  const monthlySavingsNum = parseFloat(monthlySavings) || 0;
  const currentSavingsNum = parseFloat(currentSavings) || 0;

  savingsMilestones.forEach(milestone => {
    const remainingToMilestone = Math.max(0, milestone.amount - currentSavingsNum);
    milestone.months = monthlySavingsNum > 0 ? Math.ceil(remainingToMilestone / monthlySavingsNum) : 0;
  });

  // Generate insights based on calculations
  const generateInsights = () => {
    if (!results) return [];

    const insights = [];
    const incomeNum = parseFloat(monthlyIncome) || 0;
    const incomeAfterExpenses = incomeNum - totalExpenses;

    // Budget health insight
    if (incomeAfterExpenses > 0) {
      insights.push({
        type: 'success' as const,
        title: 'Healthy Budget',
        message: `Great! You have ${formatCurrency(incomeAfterExpenses)} left after essential expenses. This gives you flexibility to build your emergency fund.`
      });
    } else {
      insights.push({
        type: 'error' as const,
        title: 'Budget Deficit',
        message: `Warning: You're spending ${formatCurrency(Math.abs(incomeAfterExpenses))} more than you earn. Focus on reducing expenses before building emergency savings.`
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
  const calculatorResults = results ? {
    primary: {
      label: 'Emergency Fund Target',
      value: results.targetAmount,
      format: 'currency' as const,
      variant: 'success' as const,
      description: `${monthsOfExpenses} months of essential expenses`
    },
    secondary: [
      {
        label: 'Monthly Expenses',
        value: totalExpenses,
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
  } : undefined;

  return (
    <CalculatorWrapper
      metadata={metadata}
      results={calculatorResults}
      insights={generateInsights()}
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* Income Section */}
        <InputGroup title="Monthly Income" description="Your total monthly take-home pay">
          <CurrencyInput
            id="monthly-income"
            label="Monthly Income"
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            placeholder="6,000"
            helpText="Your total monthly take-home pay"
            required
          />
        </InputGroup>

        {/* Essential Expenses */}
        <InputGroup
          title="Essential Monthly Expenses"
          description="Focus on truly essential expenses only - housing, utilities, food, transportation, insurance, and minimum debt payments"
        >
          <div className={theme.utils.calculatorFieldGrid(2)}>
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
          </div>
          <CurrencyInput
            id="other-essential"
            label="Other Essential Expenses"
            value={other}
            onChange={setOther}
            placeholder="300"
            helpText="Childcare, prescriptions, etc."
          />
        </InputGroup>

        {/* Emergency Fund Goals */}
        <InputGroup title="Emergency Fund Settings" description="Configure your savings target and monthly contribution">
          <div className={theme.utils.calculatorFieldGrid(3)}>
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
              helpText={results ? `${results.savingsRate.toFixed(1)}% of income` : ''}
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
        </InputGroup>

        {/* Key Metrics */}
        {results && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={theme.utils.calculatorMetric()}>
              <DollarSign className={`w-6 h-6 mx-auto mb-2 ${theme.textColors.accent}`} />
              <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                {formatCurrency(totalExpenses)}
              </div>
              <div className={`text-xs ${theme.textColors.muted}`}>Monthly Expenses</div>
            </div>

            <div className={theme.utils.calculatorMetric()}>
              <Target className={`w-6 h-6 mx-auto mb-2 ${theme.textColors.accent}`} />
              <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                {formatCurrency(results.targetAmount)}
              </div>
              <div className={`text-xs ${theme.textColors.muted}`}>Target Amount</div>
            </div>

            <div className={theme.utils.calculatorMetric()}>
              <Clock className={`w-6 h-6 mx-auto mb-2 ${theme.textColors.accent}`} />
              <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                {formatMonths(results.timeToGoal)}
              </div>
              <div className={`text-xs ${theme.textColors.muted}`}>Time to Goal</div>
            </div>

            <div className={theme.utils.calculatorMetric()}>
              <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${theme.textColors.accent}`} />
              <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                {results.savingsRate.toFixed(1)}%
              </div>
              <div className={`text-xs ${theme.textColors.muted}`}>Savings Rate</div>
            </div>
          </div>
        )}

        {/* Charts and Additional Content */}
        {expenseBreakdown.length > 0 && results && (
          <div className="space-y-8 mt-8">
            {/* Progress Bar */}
            <div className={theme.utils.calculatorSection()}>
              <h3 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Current Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{formatCurrency(parseFloat(currentSavings))}</span>
                  <span>{formatCurrency(results.targetAmount)}</span>
                </div>
                <Progress value={Math.min(results.currentProgress, 100)} className="h-3" />
                <div className="text-center text-sm text-gray-400">
                  {results.currentProgress.toFixed(1)}% Complete
                </div>
              </div>
            </div>

            {/* Expense Breakdown Chart */}
            <div className={theme.utils.calculatorChart()}>
              <h3 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Monthly Expense Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="amount"
                      nameKey="name"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {expenseBreakdown.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></div>
                    <span className={`text-sm ${theme.textColors.secondary}`}>{entry.name}: {formatCurrency(entry.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings Milestones */}
            <div className={theme.utils.calculatorSection()}>
              <h3 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Savings Milestones</h3>
              <div className="space-y-3">
                {savingsMilestones.map((milestone, index) => {
                  const achieved = parseFloat(currentSavings) >= milestone.amount;
                  return (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-lg border-2 ${achieved ? theme.status.success.bg + ' ' + theme.status.success.border :
                      theme.backgrounds.cardHover + ' ' + theme.borderColors.primary
                      }`}>
                      <div className="flex items-center gap-3">
                        {achieved ? (
                          <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
                        ) : (
                          <Target className={`w-5 h-5 ${theme.textColors.muted}`} />
                        )}
                        <div>
                          <div className={`font-medium ${achieved ? theme.status.success.text : theme.textColors.primary}`}>
                            {milestone.description}
                          </div>
                          <div className={`text-sm ${achieved ? theme.status.success.text : theme.textColors.secondary}`}>
                            {formatCurrency(milestone.amount)}
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${achieved ? theme.status.success.text : theme.textColors.secondary}`}>
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
