'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Plus,
  Minus
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CashFlowItem {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually';
  date: string;
  category: string;
}

interface MonthlyProjection {
  month: string;
  income: number;
  expenses: number;
  netFlow: number;
  cumulativeBalance: number;
}

export default function CashFlowTrackerCalculator() {
  const [startingBalance, setStartingBalance] = useState(1000);
  const [cashFlowItems, setCashFlowItems] = useState<CashFlowItem[]>([
    { id: '1', name: 'Salary', amount: 5000, type: 'income', frequency: 'monthly', date: '2024-01-01', category: 'Primary Income' },
    { id: '2', name: 'Rent', amount: 1500, type: 'expense', frequency: 'monthly', date: '2024-01-01', category: 'Housing' },
    { id: '3', name: 'Groceries', amount: 400, type: 'expense', frequency: 'monthly', date: '2024-01-01', category: 'Food' },
    { id: '4', name: 'Car Payment', amount: 350, type: 'expense', frequency: 'monthly', date: '2024-01-01', category: 'Transportation' }
  ]);
  
  const [newItem, setNewItem] = useState<Partial<CashFlowItem>>({
    name: '',
    amount: 0,
    type: 'expense',
    frequency: 'monthly',
    category: ''
  });

  const [projectionMonths, setProjectionMonths] = useState(12);
  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('cash-flow-tracker-calculator');
  }, [recordCalculatorUsage]);

  const frequencyMultipliers = {
    weekly: 52,
    'bi-weekly': 26,
    monthly: 12,
    quarterly: 4,
    annually: 1
  };

  const addCashFlowItem = () => {
    if (!newItem.name || !newItem.amount || !newItem.category) {
      toast.error('Please fill in all fields');
      return;
    }

    const item: CashFlowItem = {
      id: Date.now().toString(),
      name: newItem.name,
      amount: Number(newItem.amount),
      type: newItem.type || 'expense',
      frequency: newItem.frequency || 'monthly',
      date: new Date().toISOString().split('T')[0],
      category: newItem.category
    };

    setCashFlowItems([...cashFlowItems, item]);
    setNewItem({ name: '', amount: 0, type: 'expense', frequency: 'monthly', category: '' });
    toast.success('Cash flow item added successfully!');
  };

  const removeCashFlowItem = (id: string) => {
    setCashFlowItems(cashFlowItems.filter(item => item.id !== id));
    toast.success('Item removed');
  };

  const calculateMonthlyAmount = (item: CashFlowItem) => {
    return (item.amount * frequencyMultipliers[item.frequency]) / 12;
  };

  const generateProjections = (): MonthlyProjection[] => {
    const projections: MonthlyProjection[] = [];
    let cumulativeBalance = startingBalance;

    for (let i = 0; i < projectionMonths; i++) {
      const month = new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const monthlyIncome = cashFlowItems
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + calculateMonthlyAmount(item), 0);
      
      const monthlyExpenses = cashFlowItems
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + calculateMonthlyAmount(item), 0);
      
      const netFlow = monthlyIncome - monthlyExpenses;
      cumulativeBalance += netFlow;

      projections.push({
        month,
        income: monthlyIncome,
        expenses: monthlyExpenses,
        netFlow,
        cumulativeBalance
      });
    }

    return projections;
  };

  const projections = generateProjections();
  const totalMonthlyIncome = cashFlowItems
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + calculateMonthlyAmount(item), 0);
  
  const totalMonthlyExpenses = cashFlowItems
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + calculateMonthlyAmount(item), 0);

  const monthlyNetFlow = totalMonthlyIncome - totalMonthlyExpenses;
  const worstMonth = projections.reduce((worst, current) => 
    current.cumulativeBalance < worst.cumulativeBalance ? current : worst
  );

  const getCashFlowHealth = () => {
    if (monthlyNetFlow > totalMonthlyIncome * 0.2) return { status: 'excellent', color: 'text-green-400', message: 'Excellent cash flow management!' };
    if (monthlyNetFlow > 0) return { status: 'good', color: 'text-blue-400', message: 'Good positive cash flow' };
    if (monthlyNetFlow > -totalMonthlyIncome * 0.1) return { status: 'warning', color: 'text-yellow-400', message: 'Tight cash flow - monitor closely' };
    return { status: 'critical', color: 'text-red-400', message: 'Negative cash flow - immediate action needed' };
  };

  const cashFlowHealth = getCashFlowHealth();

  return (
    <div className={`min-h-screen ${theme.backgrounds.primary} p-6`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl font-bold ${theme.textColors.primary} mb-4`}>
            Cash Flow Tracker Calculator
          </h1>
          <p className={`text-xl ${theme.textColors.secondary} max-w-3xl mx-auto`}>
            Track your income and expenses, project future cash flows, and identify potential shortfalls before they happen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
              <Plus className="w-6 h-6" />
              Add Cash Flow Item
            </h2>

            {/* Starting Balance */}
            <div className="mb-6">
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Starting Balance
              </label>
              <input
                type="number"
                value={startingBalance}
                onChange={(e) => setStartingBalance(Number(e.target.value))}
                className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="1000"
              />
            </div>

            {/* New Item Form */}
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Item Name
                </label>
                <input
                  type="text"
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., Salary, Rent, Groceries"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Amount
                  </label>
                  <input
                    type="number"
                    value={newItem.amount || 0}
                    onChange={(e) => setNewItem({ ...newItem, amount: Number(e.target.value) })}
                    className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Type
                  </label>
                  <select
                    value={newItem.type || 'expense'}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'income' | 'expense' })}
                    className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    title="Select item type"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Frequency
                  </label>
                  <select
                    value={newItem.frequency || 'monthly'}
                    onChange={(e) => setNewItem({ ...newItem, frequency: e.target.value as 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually' })}
                    className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    title="Select frequency"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={newItem.category || ''}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., Housing, Food"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addCashFlowItem}
                aria-label="Add cash flow item"
                className={`w-full py-3 px-4 ${theme.buttons.primary} rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2`}
              >
                <Plus className="w-5 h-5" />
                Add Item
              </motion.button>
            </div>

            {/* Projection Settings */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Projection Period (Months)
              </label>
              <input
                type="number"
                value={projectionMonths}
                onChange={(e) => setProjectionMonths(Math.min(24, Math.max(1, Number(e.target.value))))}
                className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                min="1"
                max="24"
                title="Number of months to project"
              />
            </div>
          </motion.div>

          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Cash Flow Summary */}
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <BarChart3 className="w-5 h-5" />
                Monthly Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    Total Income
                  </span>
                  <span className={`text-lg font-bold text-green-400`}>
                    ${totalMonthlyIncome.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    Total Expenses
                  </span>
                  <span className={`text-lg font-bold text-red-400`}>
                    ${totalMonthlyExpenses.toLocaleString()}
                  </span>
                </div>

                <div className={`flex justify-between items-center p-3 rounded-lg ${
                  monthlyNetFlow >= 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  <span className={`flex items-center gap-2 font-medium ${theme.textColors.primary}`}>
                    <DollarSign className="w-4 h-4" />
                    Net Cash Flow
                  </span>
                  <span className={`text-xl font-bold ${monthlyNetFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${monthlyNetFlow.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Cash Flow Health */}
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                {cashFlowHealth.status === 'critical' ? (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                Cash Flow Health
              </h3>
              
              <div className={`p-4 rounded-lg ${
                cashFlowHealth.status === 'excellent' ? 'bg-green-500/10 border border-green-500/20' :
                cashFlowHealth.status === 'good' ? 'bg-blue-500/10 border border-blue-500/20' :
                cashFlowHealth.status === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                'bg-red-500/10 border border-red-500/20'
              }`}>
                <p className={`text-lg font-medium ${cashFlowHealth.color} mb-2`}>
                  {cashFlowHealth.message}
                </p>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  {cashFlowHealth.status === 'critical' && 'Consider reducing expenses or increasing income immediately.'}
                  {cashFlowHealth.status === 'warning' && 'Look for opportunities to increase your cash flow buffer.'}
                  {cashFlowHealth.status === 'good' && 'Consider increasing savings or investments with your positive flow.'}
                  {cashFlowHealth.status === 'excellent' && 'Great job! You have strong financial momentum.'}
                </p>
              </div>

              {worstMonth.cumulativeBalance < 0 && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="font-medium text-red-400">Cash Flow Alert</span>
                  </div>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Your balance will go negative in {worstMonth.month} 
                    (${worstMonth.cumulativeBalance.toLocaleString()}). Plan ahead to avoid this.
                  </p>
                </div>
              )}
            </div>

            {/* Current Items */}
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
                Current Cash Flow Items
              </h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cashFlowItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className={`font-medium ${theme.textColors.primary}`}>{item.name}</p>
                      <p className={`text-xs ${theme.textColors.muted}`}>
                        {item.category} • {item.frequency}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${item.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                        {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeCashFlowItem(item.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Projections Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <Calendar className="w-5 h-5" />
              Cash Flow Projections
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {projections.map((projection, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${theme.textColors.primary}`}>
                      {projection.month}
                    </span>
                    <span className={`font-bold ${projection.cumulativeBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${projection.cumulativeBalance.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className={`text-xs ${theme.textColors.muted}`}>Income</p>
                      <p className="text-green-400">+${projection.income.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme.textColors.muted}`}>Expenses</p>
                      <p className="text-red-400">-${projection.expenses.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme.textColors.muted}`}>Net Flow</p>
                      <p className={`${projection.netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {projection.netFlow >= 0 ? '+' : ''}${projection.netFlow.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Educational Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`mt-8 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
        >
          <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
            Cash Flow Management Tips
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
              <h4 className="font-semibold text-blue-300 mb-2">Monitor Timing</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Track when money comes in vs. when bills are due to avoid temporary shortfalls.
              </p>
            </div>
            
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
              <h4 className="font-semibold text-green-300 mb-2">Build Buffers</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Maintain cash reserves to handle irregular expenses and timing mismatches.
              </p>
            </div>
            
            <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
              <h4 className="font-semibold text-purple-300 mb-2">Plan Ahead</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Use projections to identify future cash crunches and take action early.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
