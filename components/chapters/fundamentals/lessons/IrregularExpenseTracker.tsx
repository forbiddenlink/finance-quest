'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { Calendar, Plus, Minus, Calculator, AlertTriangle } from 'lucide-react';

interface IrregularExpense {
  id: string;
  name: string;
  annualCost: number;
  category: 'vehicle' | 'home' | 'insurance' | 'medical' | 'seasonal' | 'gifts' | 'other';
  frequency: 'annual' | 'biannual' | 'quarterly';
  nextDue?: string;
}

const defaultExpenses: IrregularExpense[] = [
  { id: '1', name: 'Car Insurance', annualCost: 1200, category: 'insurance', frequency: 'biannual' },
  { id: '2', name: 'Car Maintenance/Repairs', annualCost: 1500, category: 'vehicle', frequency: 'annual' },
  { id: '3', name: 'Home Maintenance', annualCost: 2000, category: 'home', frequency: 'annual' },
  { id: '4', name: 'Holiday Gifts', annualCost: 1800, category: 'gifts', frequency: 'annual' },
  { id: '5', name: 'Vacation', annualCost: 3000, category: 'seasonal', frequency: 'annual' },
  { id: '6', name: 'Property Taxes', annualCost: 3600, category: 'home', frequency: 'annual' },
  { id: '7', name: 'Medical Deductible', annualCost: 1000, category: 'medical', frequency: 'annual' }
];

const categoryIcons = {
  vehicle: '🚗',
  home: '🏠',
  insurance: '🛡️',
  medical: '⚕️',
  seasonal: '🌞',
  gifts: '🎁',
  other: '📋'
};

export default function IrregularExpenseTracker() {
  const [expenses, setExpenses] = useState<IrregularExpense[]>(defaultExpenses);
  const [newExpense, setNewExpense] = useState<Partial<IrregularExpense>>({
    name: '',
    annualCost: 0,
    category: 'other',
    frequency: 'annual'
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const addExpense = () => {
    if (newExpense.name && newExpense.annualCost) {
      const expense: IrregularExpense = {
        id: Date.now().toString(),
        name: newExpense.name,
        annualCost: newExpense.annualCost,
        category: newExpense.category || 'other',
        frequency: newExpense.frequency || 'annual'
      };
      setExpenses([...expenses, expense]);
      setNewExpense({ name: '', annualCost: 0, category: 'other', frequency: 'annual' });
      setShowAddForm(false);
    }
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const calculateTotals = () => {
    const totalAnnual = expenses.reduce((sum, exp) => sum + exp.annualCost, 0);
    const monthlyNeeded = totalAnnual / 12;
    const weeklyNeeded = totalAnnual / 52;
    const dailyNeeded = totalAnnual / 365;

    return { totalAnnual, monthlyNeeded, weeklyNeeded, dailyNeeded };
  };

  const getCategoryTotals = () => {
    const totals: Record<string, number> = {};
    expenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.annualCost;
    });
    return totals;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const { totalAnnual, monthlyNeeded, weeklyNeeded, dailyNeeded } = calculateTotals();
  const categoryTotals = getCategoryTotals();

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
        <Calendar className="w-6 h-6" />
        Irregular Expenses Planner
      </h3>
      
      <p className={`${theme.textColors.secondary} mb-6`}>
        Plan for irregular expenses that destroy budgets. Set aside money monthly to avoid financial surprises.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 ${theme.status.error.bg} rounded-lg text-center`}>
          <div className={`text-sm font-medium ${theme.status.error.text} mb-1`}>Total Annual</div>
          <div className={`text-xl font-bold ${theme.status.error.text}`}>{formatCurrency(totalAnnual)}</div>
          <div className={`text-xs ${theme.textColors.muted}`}>Per year</div>
        </div>

        <div className={`p-4 ${theme.status.warning.bg} rounded-lg text-center`}>
          <div className={`text-sm font-medium ${theme.status.warning.text} mb-1`}>Monthly Savings</div>
          <div className={`text-xl font-bold ${theme.status.warning.text}`}>{formatCurrency(monthlyNeeded)}</div>
          <div className={`text-xs ${theme.textColors.muted}`}>Set aside each month</div>
        </div>

        <div className={`p-4 ${theme.status.info.bg} rounded-lg text-center`}>
          <div className={`text-sm font-medium ${theme.status.info.text} mb-1`}>Weekly Savings</div>
          <div className={`text-xl font-bold ${theme.status.info.text}`}>{formatCurrency(weeklyNeeded)}</div>
          <div className={`text-xs ${theme.textColors.muted}`}>Per week</div>
        </div>

        <div className={`p-4 ${theme.status.success.bg} rounded-lg text-center`}>
          <div className={`text-sm font-medium ${theme.status.success.text} mb-1`}>Daily Savings</div>
          <div className={`text-xl font-bold ${theme.status.success.text}`}>{formatCurrency(dailyNeeded)}</div>
          <div className={`text-xs ${theme.textColors.muted}`}>Per day</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-6">
        <h4 className={`font-bold ${theme.textColors.primary} mb-3`}>Category Breakdown</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(categoryTotals).map(([category, total]) => (
            <div key={category} className={`p-3 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                <span className={`text-sm font-medium ${theme.textColors.primary} capitalize`}>
                  {category}
                </span>
              </div>
              <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                {formatCurrency(total)}
              </div>
              <div className={`text-xs ${theme.textColors.muted}`}>
                {formatCurrency(total / 12)}/month
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className={`font-bold ${theme.textColors.primary}`}>Your Irregular Expenses</h4>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`px-4 py-2 ${theme.buttons.primary} rounded-lg text-sm flex items-center gap-2`}
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? 'Cancel' : 'Add Expense'}
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg mb-4`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Expense name"
                value={newExpense.name || ''}
                onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                className={`px-3 py-2 border ${theme.borderColors.primary} rounded-lg`}
              />
              <input
                type="number"
                placeholder="Annual cost"
                value={newExpense.annualCost || ''}
                onChange={(e) => setNewExpense({ ...newExpense, annualCost: Number(e.target.value) })}
                className={`px-3 py-2 border ${theme.borderColors.primary} rounded-lg`}
              />
              <select
                value={newExpense.category || 'other'}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as IrregularExpense['category'] })}
                className={`px-3 py-2 border ${theme.borderColors.primary} rounded-lg`}
              >
                <option value="vehicle">Vehicle</option>
                <option value="home">Home</option>
                <option value="insurance">Insurance</option>
                <option value="medical">Medical</option>
                <option value="seasonal">Seasonal</option>
                <option value="gifts">Gifts</option>
                <option value="other">Other</option>
              </select>
              <select
                value={newExpense.frequency || 'annual'}
                onChange={(e) => setNewExpense({ ...newExpense, frequency: e.target.value as IrregularExpense['frequency'] })}
                className={`px-3 py-2 border ${theme.borderColors.primary} rounded-lg`}
              >
                <option value="annual">Annual</option>
                <option value="biannual">Bi-annual</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <button
              onClick={addExpense}
              className={`mt-3 px-4 py-2 ${theme.buttons.primary} rounded-lg text-sm`}
            >
              Add Expense
            </button>
          </motion.div>
        )}

        {/* Expense Items */}
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{categoryIcons[expense.category]}</span>
                  <div>
                    <div className={`font-medium ${theme.textColors.primary}`}>
                      {expense.name}
                    </div>
                    <div className={`text-sm ${theme.textColors.muted} capitalize`}>
                      {expense.category} • {expense.frequency}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`font-bold ${theme.textColors.primary}`}>
                      {formatCurrency(expense.annualCost)}
                    </div>
                    <div className={`text-sm ${theme.textColors.muted}`}>
                      {formatCurrency(expense.annualCost / 12)}/month
                    </div>
                  </div>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className={`p-2 ${theme.status.error.bg} ${theme.status.error.text} rounded-lg hover:opacity-80`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan */}
      <div className={`p-4 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg`}>
        <h4 className={`font-bold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
          <Calculator className="w-5 h-5" />
          Your Sinking Fund Strategy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Monthly Auto-Transfer</h5>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Set up automatic transfer of <strong>{formatCurrency(monthlyNeeded)}</strong> to a separate &quot;Irregular Expenses&quot; savings account on payday.
            </p>
          </div>
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Account Strategy</h5>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Create separate sub-accounts or use a high-yield savings account to earn interest while money waits to be used.
            </p>
          </div>
        </div>
        <div className={`mt-4 p-3 ${theme.backgrounds.card} rounded-lg`}>
          <p className={`text-sm ${theme.textColors.primary} text-center font-bold`}>
            💡 This system prevents budget crashes and saves you from credit card debt when big expenses hit!
          </p>
        </div>
      </div>

      {/* Impact Warning */}
      {totalAnnual > 12000 && (
        <div className={`mt-4 p-4 ${theme.status.warning.bg} border-l-4 ${theme.status.warning.border} rounded-lg`}>
          <h4 className={`font-bold ${theme.status.warning.text} mb-2 flex items-center gap-2`}>
            <AlertTriangle className="w-5 h-5" />
            High Irregular Expenses Alert
          </h4>
          <p className={`text-sm ${theme.textColors.secondary}`}>
            Your irregular expenses total {formatCurrency(totalAnnual)} annually ({formatCurrency(monthlyNeeded)}/month). 
            This is significant! Make sure your budget accounts for this amount, or you&apos;ll constantly feel like you&apos;re behind.
          </p>
        </div>
      )}
    </div>
  );
}
