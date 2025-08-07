'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, ChevronUp, ChevronDown, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import toast from 'react-hot-toast';

interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  timeframe: number; // months
  priority: number;
  category: 'emergency' | 'debt' | 'investment' | 'purchase' | 'lifestyle';
  urgency: 'high' | 'medium' | 'low';
}

interface GoalAnalysis {
  goal: FinancialGoal;
  monthlyRequired: number;
  feasibilityScore: number;
  recommendations: string[];
}

const goalCategories = [
  { value: 'emergency', label: 'Emergency Fund', color: 'text-red-400' },
  { value: 'debt', label: 'Debt Payoff', color: 'text-orange-400' },
  { value: 'investment', label: 'Investment', color: 'text-green-400' },
  { value: 'purchase', label: 'Major Purchase', color: 'text-blue-400' },
  { value: 'lifestyle', label: 'Lifestyle Goal', color: 'text-purple-400' }
];

const urgencyLevels = [
  { value: 'high', label: 'High Priority', color: 'text-red-400' },
  { value: 'medium', label: 'Medium Priority', color: 'text-yellow-400' },
  { value: 'low', label: 'Low Priority', color: 'text-green-400' }
];

export default function FinancialGoalPrioritizer() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState<string>('5000');
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('3500');
  const [analysis, setAnalysis] = useState<GoalAnalysis[]>([]);
  const { recordCalculatorUsage } = useProgressStore();

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    timeframe: '',
    category: 'emergency' as FinancialGoal['category'],
    urgency: 'medium' as FinancialGoal['urgency']
  });

  const analyzeGoals = useCallback(() => {
    const income = parseFloat(monthlyIncome) || 0;
    const expenses = parseFloat(monthlyExpenses) || 0;
    const availableForGoals = income - expenses;

    // Calculate priority scores based on category, urgency, and timeframe
    const scoredGoals = goals.map(goal => {
      let priorityScore = 0;

      // Category weights
      switch (goal.category) {
        case 'emergency': priorityScore += 100; break;
        case 'debt': priorityScore += 90; break;
        case 'investment': priorityScore += 70; break;
        case 'purchase': priorityScore += 50; break;
        case 'lifestyle': priorityScore += 30; break;
      }

      // Urgency weights
      switch (goal.urgency) {
        case 'high': priorityScore += 30; break;
        case 'medium': priorityScore += 20; break;
        case 'low': priorityScore += 10; break;
      }

      // Timeframe consideration (shorter = higher priority for debts, longer for investments)
      if (goal.category === 'debt' && goal.timeframe <= 12) priorityScore += 20;
      if (goal.category === 'investment' && goal.timeframe >= 24) priorityScore += 15;

      return { ...goal, priorityScore };
    });

    const sortedGoals = scoredGoals.sort((a, b) => b.priorityScore - a.priorityScore);

    // Analyze feasibility
    const analysisResults: GoalAnalysis[] = sortedGoals.map(goal => {
      const remainingAmount = goal.targetAmount - goal.currentAmount;
      const monthlyRequired = remainingAmount / goal.timeframe;
      const feasibilityScore = availableForGoals > 0 ?
        Math.min(100, (availableForGoals / monthlyRequired) * 100) : 0;

      const recommendations: string[] = [];

      if (feasibilityScore >= 80) {
        recommendations.push('Highly achievable with current income');
      } else if (feasibilityScore >= 60) {
        recommendations.push('Achievable but may require budget adjustments');
      } else if (feasibilityScore >= 40) {
        recommendations.push('Consider extending timeframe or increasing income');
      } else {
        recommendations.push('May need significant lifestyle changes or income increase');
      }

      if (goal.category === 'emergency' && goal.targetAmount < income * 3) {
        recommendations.push('Consider targeting 3-6 months of expenses for emergency fund');
      }

      if (goal.category === 'debt') {
        recommendations.push('Consider debt avalanche or snowball method');
      }

      if (goal.timeframe < 12 && remainingAmount > availableForGoals * 6) {
        recommendations.push('Timeframe may be too aggressive - consider extending');
      }

      return {
        goal,
        monthlyRequired,
        feasibilityScore,
        recommendations
      };
    });

    setAnalysis(analysisResults);
  }, [goals, monthlyIncome, monthlyExpenses]);

  useEffect(() => {
    recordCalculatorUsage('financial-goal-prioritizer');
  }, [recordCalculatorUsage]);

  useEffect(() => {
    if (goals.length > 0) {
      analyzeGoals();
    }
  }, [goals.length, analyzeGoals]);

  const addGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.timeframe) {
      toast.error('Please fill in all required fields');
      return;
    }

    const goal: FinancialGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      timeframe: parseInt(newGoal.timeframe),
      priority: goals.length + 1,
      category: newGoal.category,
      urgency: newGoal.urgency
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      timeframe: '',
      category: 'emergency',
      urgency: 'medium'
    });
    setShowAddForm(false);
    toast.success('Goal added successfully!');
  };

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    toast.success('Goal removed');
  };

  const moveGoal = (id: string, direction: 'up' | 'down') => {
    const currentIndex = goals.findIndex(goal => goal.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= goals.length) return;

    const newGoals = [...goals];
    [newGoals[currentIndex], newGoals[newIndex]] = [newGoals[newIndex], newGoals[currentIndex]];
    setGoals(newGoals);
  };

  const getCategoryColor = (category: FinancialGoal['category']) => {
    return goalCategories.find(cat => cat.value === category)?.color || 'text-gray-400';
  };

  const getUrgencyColor = (urgency: FinancialGoal['urgency']) => {
    return urgencyLevels.find(level => level.value === urgency)?.color || 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Income & Expenses Input */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
          Monthly Financial Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Monthly Income
            </label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5000"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Monthly Expenses
            </label>
            <input
              type="number"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="3500"
            />
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg">
          <p className={`${theme.textColors.primary} font-medium`}>
            Available for Goals: ${(parseFloat(monthlyIncome) - parseFloat(monthlyExpenses)).toLocaleString()}/month
          </p>
        </div>
      </div>

      {/* Add Goal Button */}
      <div className="flex justify-between items-center">
        <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
          Your Financial Goals
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className={`${theme.buttons.primary} px-4 py-2 rounded-lg flex items-center space-x-2`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Add New Financial Goal
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Goal Name *
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Emergency Fund"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Target Amount *
                </label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10000"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Current Amount
                </label>
                <input
                  type="number"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: e.target.value }))}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Timeframe (months) *
                </label>
                <input
                  type="number"
                  value={newGoal.timeframe}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, timeframe: e.target.value }))}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Category
                </label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value as FinancialGoal['category'] }))}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Goal category"
                >
                  {goalCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Urgency
                </label>
                <select
                  value={newGoal.urgency}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, urgency: e.target.value as FinancialGoal['urgency'] }))}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Goal urgency level"
                >
                  {urgencyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className={`px-4 py-2 rounded-lg ${theme.backgrounds.glass} ${theme.textColors.secondary} hover:bg-white/10`}
              >
                Cancel
              </button>
              <button
                onClick={addGoal}
                className={`${theme.buttons.primary} px-4 py-2 rounded-lg`}
              >
                Add Goal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals Analysis */}
      {analysis.length > 0 && (
        <div className="space-y-4">
          <h4 className={`text-lg font-semibold ${theme.textColors.primary}`}>
            Prioritized Goals Analysis
          </h4>
          {analysis.map((item, index) => (
            <motion.div
              key={item.goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl font-bold text-blue-400">#{index + 1}</span>
                    <h5 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                      {item.goal.name}
                    </h5>
                    <span className={`text-sm ${getCategoryColor(item.goal.category)}`}>
                      {goalCategories.find(cat => cat.value === item.goal.category)?.label}
                    </span>
                    <span className={`text-sm ${getUrgencyColor(item.goal.urgency)}`}>
                      {urgencyLevels.find(level => level.value === item.goal.urgency)?.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-slate-400">
                    <span>Target: ${item.goal.targetAmount.toLocaleString()}</span>
                    <span>Current: ${item.goal.currentAmount.toLocaleString()}</span>
                    <span>Timeline: {item.goal.timeframe} months</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => moveGoal(item.goal.id, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-50"
                    aria-label="Move goal up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveGoal(item.goal.id, 'down')}
                    disabled={index === analysis.length - 1}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-50"
                    aria-label="Move goal down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeGoal(item.goal.id)}
                    className="p-1 rounded text-red-400 hover:text-red-300"
                    aria-label="Remove goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className={`text-sm font-medium ${theme.textColors.secondary}`}>
                      Monthly Required
                    </span>
                  </div>
                  <p className={`text-xl font-bold ${theme.textColors.primary}`}>
                    ${item.monthlyRequired.toLocaleString()}
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span className={`text-sm font-medium ${theme.textColors.secondary}`}>
                      Feasibility
                    </span>
                  </div>
                  <p className={`text-xl font-bold ${item.feasibilityScore >= 80 ? 'text-green-400' :
                      item.feasibilityScore >= 60 ? 'text-yellow-400' :
                        item.feasibilityScore >= 40 ? 'text-orange-400' : 'text-red-400'
                    }`}>
                    {Math.round(item.feasibilityScore)}%
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className={`text-sm font-medium ${theme.textColors.secondary}`}>
                      Progress
                    </span>
                  </div>
                  <p className={`text-xl font-bold ${theme.textColors.primary}`}>
                    {Math.round((item.goal.currentAmount / item.goal.targetAmount) * 100)}%
                  </p>
                </div>
              </div>

              {item.recommendations.length > 0 && (
                <div className="mt-4 p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
                  <h6 className={`text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Recommendations:
                  </h6>
                  <ul className="space-y-1">
                    {item.recommendations.map((rec, recIndex) => (
                      <li key={recIndex} className={`text-sm ${theme.textColors.secondary} flex items-start`}>
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {goals.length === 0 && (
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-8 text-center`}>
          <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-2`}>
            No Goals Yet
          </h4>
          <p className={`${theme.textColors.secondary} mb-4`}>
            Add your first financial goal to get started with prioritization and planning.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className={`${theme.buttons.primary} px-6 py-3 rounded-lg`}
          >
            Add Your First Goal
          </button>
        </div>
      )}
    </div>
  );
}
