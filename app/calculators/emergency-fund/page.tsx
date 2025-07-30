'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Shield, Target, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';

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
  // Income and expenses
  const [monthlyIncome, setMonthlyIncome] = useState<string>('6000');
  const [rent, setRent] = useState<string>('1500');
  const [utilities, setUtilities] = useState<string>('200');
  const [groceries, setGroceries] = useState<string>('600');
  const [transportation, setTransportation] = useState<string>('400');
  const [insurance, setInsurance] = useState<string>('300');
  const [minimumDebt, setMinimumDebt] = useState<string>('250');
  const [other, setOther] = useState<string>('300');

  // Emergency fund settings
  const [monthsOfExpenses, setMonthsOfExpenses] = useState<string>('6');
  const [monthlySavings, setMonthlySavings] = useState<string>('500');
  const [currentSavings, setCurrentSavings] = useState<string>('1000');

  // Results
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [emergencyFundTarget, setEmergencyFundTarget] = useState(0);
  const [timeToGoal, setTimeToGoal] = useState(0);
  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseCategory[]>([]);
  const [savingsMilestones, setSavingsMilestones] = useState<SavingsMilestone[]>([]);

  // Track calculator usage
  const recordCalculatorUsage = useProgressStore((state) => state.recordCalculatorUsage);

  useEffect(() => {
    recordCalculatorUsage('emergency-fund');
  }, [recordCalculatorUsage]);

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

    const expenses = rentAmount + utilitiesAmount + groceriesAmount +
      transportationAmount + insuranceAmount + debtAmount + otherAmount;

    const target = expenses * months;
    const remaining = Math.max(0, target - current);
    const timeMonths = savings > 0 ? Math.ceil(remaining / savings) : 0;

    setTotalExpenses(expenses);
    setEmergencyFundTarget(target);
    setTimeToGoal(timeMonths);

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

    setExpenseBreakdown(breakdown);

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

    setSavingsMilestones(milestones);
  }, [rent, utilities, groceries, transportation, insurance, minimumDebt, other, monthsOfExpenses, monthlySavings, currentSavings]);

  useEffect(() => {
    calculateEmergencyFund();
  }, [calculateEmergencyFund]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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

  const incomeAfterExpenses = parseFloat(monthlyIncome) - totalExpenses;
  const savingsRate = parseFloat(monthlyIncome) > 0 ? (parseFloat(monthlySavings) / parseFloat(monthlyIncome)) * 100 : 0;
  const currentProgress = emergencyFundTarget > 0 ? (parseFloat(currentSavings) / emergencyFundTarget) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          Emergency Fund Calculator
        </h2>
        <p className="text-gray-600">
          Build your financial safety net with personalized targets and realistic timelines
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Controls */}
        <div className="xl:col-span-1 space-y-6">
          {/* Income */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Monthly Income</h3>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="6000"
              />
            </div>
          </div>

          {/* Essential Expenses */}
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Essential Monthly Expenses</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Housing (Rent/Mortgage)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="1500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Utilities</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={utilities}
                    onChange={(e) => setUtilities(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Groceries</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={groceries}
                    onChange={(e) => setGroceries(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transportation</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={transportation}
                    onChange={(e) => setTransportation(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Debt Payments</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={minimumDebt}
                    onChange={(e) => setMinimumDebt(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="250"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Other Essential</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={other}
                    onChange={(e) => setOther(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Fund Settings */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Emergency Fund Goals</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target (Months of Expenses)</label>
                <select
                  value={monthsOfExpenses}
                  onChange={(e) => setMonthsOfExpenses(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">1 month (Minimum)</option>
                  <option value="3">3 months (Standard)</option>
                  <option value="6">6 months (Recommended)</option>
                  <option value="9">9 months (Conservative)</option>
                  <option value="12">12 months (High Risk Jobs)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Savings Goal</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={monthlySavings}
                    onChange={(e) => setMonthlySavings(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="500"
                  />
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  {savingsRate.toFixed(1)}% of income
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Emergency Savings</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results and Charts */}
        <div className="xl:col-span-2 space-y-8">
          {/* Key Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Monthly Expenses</h3>
              <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpenses)}</p>
              <p className="text-sm text-red-600">Essential costs to cover</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Emergency Fund Target</h3>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(emergencyFundTarget)}</p>
              <p className="text-sm text-blue-600">{monthsOfExpenses} months of expenses</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">Time to Goal</h3>
              <p className="text-2xl font-bold text-green-700">{formatMonths(timeToGoal)}</p>
              <p className="text-sm text-green-600">At ${monthlySavings}/month</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Progress</h3>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-6 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(currentProgress, 100)}%` }}
                ></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {formatCurrency(parseFloat(currentSavings))} / {formatCurrency(emergencyFundTarget)} ({currentProgress.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Expense Breakdown Chart */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expense Breakdown</h3>
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
          </div>

          {/* Savings Milestones */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Milestones</h3>
            <div className="space-y-3">
              {savingsMilestones.map((milestone, index) => {
                const achieved = parseFloat(currentSavings) >= milestone.amount;

                return (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg border-2 ${achieved ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center gap-3">
                      {achieved ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Target className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <div className={`font-medium ${achieved ? 'text-green-900' : 'text-gray-900'}`}>
                          {milestone.description}
                        </div>
                        <div className={`text-sm ${achieved ? 'text-green-600' : 'text-gray-600'}`}>
                          {formatCurrency(milestone.amount)}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${achieved ? 'text-green-600' : 'text-gray-600'}`}>
                      {achieved ? '✓ Achieved!' : formatMonths(milestone.months)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Assessment */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-lg p-6 border-2 ${incomeAfterExpenses > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
          <div className="flex items-center gap-3 mb-3">
            {incomeAfterExpenses > 0 ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600" />
            )}
            <h4 className={`font-semibold ${incomeAfterExpenses > 0 ? 'text-green-900' : 'text-red-900'}`}>
              Budget Analysis
            </h4>
          </div>
          <p className={`text-sm ${incomeAfterExpenses > 0 ? 'text-green-700' : 'text-red-700'}`}>
            {incomeAfterExpenses > 0
              ? `Great! You have ${formatCurrency(incomeAfterExpenses)} left after essential expenses.`
              : `Warning: You're spending ${formatCurrency(Math.abs(incomeAfterExpenses))} more than you earn.`
            }
          </p>
        </div>

        <div className={`rounded-lg p-6 border-2 ${savingsRate >= 20 ? 'bg-green-50 border-green-200' :
            savingsRate >= 10 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
          }`}>
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className={`w-6 h-6 ${savingsRate >= 20 ? 'text-green-600' :
                savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'
              }`} />
            <h4 className={`font-semibold ${savingsRate >= 20 ? 'text-green-900' :
                savingsRate >= 10 ? 'text-yellow-900' : 'text-red-900'
              }`}>
              Savings Rate
            </h4>
          </div>
          <p className={`text-sm ${savingsRate >= 20 ? 'text-green-700' :
              savingsRate >= 10 ? 'text-yellow-700' : 'text-red-700'
            }`}>
            You&apos;re saving {savingsRate.toFixed(1)}% of income.
            {savingsRate >= 20 ? ' Excellent!' : savingsRate >= 10 ? ' Good, but could be higher.' : ' Try to reach at least 10%.'}
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Emergency Fund Strategy Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-semibold mb-2">Start Small, Build Steadily</h4>
            <p>Begin with $1,000, then work toward 3-6 months of expenses. Small wins build momentum!</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Automate Your Savings</h4>
            <p>Set up automatic transfers on payday. Pay yourself first before other expenses.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">High-Yield Storage</h4>
            <p>Keep emergency funds in high-yield savings accounts earning 4%+ while staying accessible.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Adjust for Your Risk</h4>
            <p>Commission workers, contractors, and single-income families need larger emergency funds.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
