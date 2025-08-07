'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, PieChart, AlertCircle, CheckCircle, Target, Brain } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import toast from 'react-hot-toast';

interface SpendingCategory {
  name: string;
  amount: number;
  budget: number;
  color: string;
  essential: boolean;
}

interface SpendingAnalysis {
  totalSpending: number;
  totalBudget: number;
  overspendingAmount: number;
  overspendingCategories: string[];
  essentialVsNonEssential: {
    essential: number;
    nonEssential: number;
  };
  mindsetType: 'balanced' | 'impulsive' | 'conservative' | 'inconsistent';
  recommendations: string[];
}

const defaultCategories: SpendingCategory[] = [
  { name: 'Housing', amount: 0, budget: 1200, color: '#3B82F6', essential: true },
  { name: 'Food & Groceries', amount: 0, budget: 500, color: '#10B981', essential: true },
  { name: 'Transportation', amount: 0, budget: 300, color: '#F59E0B', essential: true },
  { name: 'Utilities', amount: 0, budget: 150, color: '#8B5CF6', essential: true },
  { name: 'Healthcare', amount: 0, budget: 200, color: '#EF4444', essential: true },
  { name: 'Entertainment', amount: 0, budget: 200, color: '#EC4899', essential: false },
  { name: 'Shopping', amount: 0, budget: 300, color: '#06B6D4', essential: false },
  { name: 'Dining Out', amount: 0, budget: 250, color: '#84CC16', essential: false },
  { name: 'Subscriptions', amount: 0, budget: 100, color: '#F97316', essential: false },
  { name: 'Other', amount: 0, budget: 150, color: '#6B7280', essential: false }
];

const spendingTriggers = [
  'Stress/Emotional state',
  'Sales and discounts',
  'Social media influence',
  'Peer pressure',
  'Boredom',
  'Celebration/reward',
  'Convenience',
  'Brand loyalty',
  'FOMO (Fear of missing out)',
  'Impulse/spontaneous decisions'
];

export default function SpendingMindsetAnalyzer() {
  const [categories, setCategories] = useState<SpendingCategory[]>(defaultCategories);
  const [monthlyIncome, setMonthlyIncome] = useState<string>('5000');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<SpendingAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('spending-mindset-analyzer');
  }, [recordCalculatorUsage]);

  const updateCategoryAmount = (index: number, amount: string) => {
    const newCategories = [...categories];
    newCategories[index].amount = parseFloat(amount) || 0;
    setCategories(newCategories);
  };

  const updateCategoryBudget = (index: number, budget: string) => {
    const newCategories = [...categories];
    newCategories[index].budget = parseFloat(budget) || 0;
    setCategories(newCategories);
  };

  const toggleTrigger = (trigger: string) => {
    setTriggers(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const analyzeSpending = () => {
    const totalSpending = categories.reduce((sum, cat) => sum + cat.amount, 0);
    const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
    const income = parseFloat(monthlyIncome) || 0;

    const overspendingCategories = categories
      .filter(cat => cat.amount > cat.budget)
      .map(cat => cat.name);

    const overspendingAmount = categories.reduce((sum, cat) =>
      cat.amount > cat.budget ? sum + (cat.amount - cat.budget) : sum, 0
    );

    const essentialSpending = categories
      .filter(cat => cat.essential)
      .reduce((sum, cat) => sum + cat.amount, 0);

    const nonEssentialSpending = categories
      .filter(cat => !cat.essential)
      .reduce((sum, cat) => sum + cat.amount, 0);

    // Determine mindset type
    let mindsetType: SpendingAnalysis['mindsetType'] = 'balanced';
    const spendingRatio = totalSpending / income;
    const overspendingRatio = overspendingAmount / totalBudget;
    const nonEssentialRatio = nonEssentialSpending / totalSpending;

    if (spendingRatio > 0.9 && overspendingRatio > 0.2) {
      mindsetType = 'impulsive';
    } else if (spendingRatio < 0.7 && nonEssentialRatio < 0.2) {
      mindsetType = 'conservative';
    } else if (overspendingCategories.length > 3) {
      mindsetType = 'inconsistent';
    }

    // Generate recommendations
    const recommendations: string[] = [];

    if (mindsetType === 'impulsive') {
      recommendations.push('Implement a 24-hour waiting period for non-essential purchases');
      recommendations.push('Set up automatic savings to reduce available spending money');
      recommendations.push('Use the envelope method for discretionary spending');
    } else if (mindsetType === 'conservative') {
      recommendations.push('Consider allocating more budget for enjoyment and experiences');
      recommendations.push('Set aside a "guilt-free" spending allowance');
      recommendations.push('Focus on experiences over material purchases');
    } else if (mindsetType === 'inconsistent') {
      recommendations.push('Track spending daily to increase awareness');
      recommendations.push('Use budgeting apps with real-time notifications');
      recommendations.push('Review and adjust budgets monthly');
    } else {
      recommendations.push('Maintain your balanced approach to spending');
      recommendations.push('Consider increasing savings rate if possible');
      recommendations.push('Review your financial goals quarterly');
    }

    if (triggers.includes('Stress/Emotional state')) {
      recommendations.push('Develop healthy stress management alternatives to spending');
    }
    if (triggers.includes('Social media influence')) {
      recommendations.push('Limit exposure to shopping-related social media content');
    }
    if (triggers.includes('FOMO (Fear of missing out)')) {
      recommendations.push('Focus on your personal financial goals rather than others\' spending');
    }

    const newAnalysis: SpendingAnalysis = {
      totalSpending,
      totalBudget,
      overspendingAmount,
      overspendingCategories,
      essentialVsNonEssential: {
        essential: essentialSpending,
        nonEssential: nonEssentialSpending
      },
      mindsetType,
      recommendations
    };

    setAnalysis(newAnalysis);
    setShowAnalysis(true);
    toast.success('Spending analysis complete!');
  };

  const pieData = categories.map(cat => ({
    name: cat.name,
    value: cat.amount,
    color: cat.color
  })).filter(item => item.value > 0);

  const comparisonData = categories.map(cat => ({
    name: cat.name.length > 10 ? cat.name.substring(0, 10) + '...' : cat.name,
    actual: cat.amount,
    budget: cat.budget,
    overspending: Math.max(0, cat.amount - cat.budget)
  }));

  const getMindsetDescription = (type: SpendingAnalysis['mindsetType']) => {
    switch (type) {
      case 'balanced': return 'You maintain a healthy balance between spending and saving';
      case 'impulsive': return 'You tend to spend impulsively and may benefit from spending controls';
      case 'conservative': return 'You are very cautious with spending and could afford to enjoy more';
      case 'inconsistent': return 'Your spending patterns vary significantly across categories';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Income Input */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
          Monthly Income
        </h3>
        <input
          type="number"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(e.target.value)}
          className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="5000"
        />
      </div>

      {/* Spending Categories */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
          Monthly Spending by Category
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full border-2"
                  style={{ backgroundColor: category.color, borderColor: category.color }}
                />
                <span className={`${theme.textColors.primary} font-medium`}>
                  {category.name}
                </span>
                {category.essential && (
                  <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">
                    Essential
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block text-xs ${theme.textColors.secondary} mb-1`}>
                    Actual Spending
                  </label>
                  <input
                    type="number"
                    value={category.amount}
                    onChange={(e) => updateCategoryAmount(index, e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={`block text-xs ${theme.textColors.secondary} mb-1`}>
                    Budget
                  </label>
                  <input
                    type="number"
                    value={category.budget}
                    onChange={(e) => updateCategoryBudget(index, e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Triggers */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
          What Triggers Your Spending? (Select all that apply)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {spendingTriggers.map((trigger) => (
            <button
              key={trigger}
              onClick={() => toggleTrigger(trigger)}
              className={`p-3 rounded-lg border text-left transition-all duration-200 ${triggers.includes(trigger)
                  ? `border-blue-400 bg-blue-400/10 ${theme.textColors.primary}`
                  : `${theme.borderColors.primary} ${theme.textColors.secondary} hover:border-blue-400/50 hover:bg-blue-400/5`
                }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded border-2 ${triggers.includes(trigger)
                    ? 'border-blue-400 bg-blue-400'
                    : 'border-slate-400'
                  }`}>
                  {triggers.includes(trigger) && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-sm">{trigger}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Analyze Button */}
      <div className="text-center">
        <button
          onClick={analyzeSpending}
          className={`${theme.buttons.primary} px-8 py-3 rounded-lg font-medium text-lg`}
        >
          Analyze My Spending Mindset
        </button>
      </div>

      {/* Analysis Results */}
      {showAnalysis && analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Mindset Type */}
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6 text-center`}>
            <Brain className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <h3 className={`text-2xl font-bold ${theme.textColors.primary} capitalize mb-2`}>
              {analysis.mindsetType} Spender
            </h3>
            <p className={`${theme.textColors.secondary} text-lg`}>
              {getMindsetDescription(analysis.mindsetType)}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4 text-center`}>
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                ${analysis.totalSpending.toLocaleString()}
              </p>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Total Spending
              </p>
            </div>
            <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4 text-center`}>
              <Target className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                ${analysis.totalBudget.toLocaleString()}
              </p>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Total Budget
              </p>
            </div>
            <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4 text-center`}>
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                ${analysis.overspendingAmount.toLocaleString()}
              </p>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Overspending
              </p>
            </div>
            <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4 text-center`}>
              <PieChart className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                {Math.round((analysis.essentialVsNonEssential.nonEssential / analysis.totalSpending) * 100)}%
              </p>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Non-Essential
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending Distribution */}
            <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
                Spending Distribution
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }: { name: string; percent?: number }) =>
                      `${name} ${percent ? (percent * 100).toFixed(1) : '0.0'}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Budget vs Actual */}
            <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
                Budget vs Actual Spending
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`$${value}`, '']}
                  />
                  <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
                  <Bar dataKey="actual" fill="#10B981" name="Actual" />
                  <Bar dataKey="overspending" fill="#EF4444" name="Overspending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendations */}
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center`}>
              <Target className="w-5 h-5 text-blue-400 mr-2" />
              Personalized Recommendations
            </h4>
            <ul className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className={`${theme.textColors.secondary} flex items-start`}>
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>

          {/* Overspending Alert */}
          {analysis.overspendingCategories.length > 0 && (
            <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-6">
              <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                Overspending Alert
              </h4>
              <p className={`${theme.textColors.secondary} mb-3`}>
                You&apos;re overspending in the following categories:
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.overspendingCategories.map((category) => (
                  <span
                    key={category}
                    className="bg-red-400/20 text-red-300 px-3 py-1 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
