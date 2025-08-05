'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Home,
  Car,
  Plane,
  Shield,
  Star,
  RefreshCw,
  Calculator
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface SavingsGoal {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  color: string;
  category: 'emergency' | 'purchase' | 'experience' | 'investment';
}

interface TimelineData {
  month: string;
  cumulative: number;
  monthly: number;
  emergency: number;
  purchase: number;
  experience: number;
  investment: number;
}

const defaultGoals: SavingsGoal[] = [
  {
    id: 'emergency',
    name: 'Emergency Fund',
    icon: Shield,
    targetAmount: 15000,
    currentAmount: 3000,
    targetDate: '2025-12-31',
    priority: 'high',
    color: '#ef4444',
    category: 'emergency'
  },
  {
    id: 'house',
    name: 'House Down Payment',
    icon: Home,
    targetAmount: 50000,
    currentAmount: 8000,
    targetDate: '2027-06-30',
    priority: 'high',
    color: '#3b82f6',
    category: 'purchase'
  },
  {
    id: 'car',
    name: 'New Car',
    icon: Car,
    targetAmount: 25000,
    currentAmount: 5000,
    targetDate: '2026-03-31',
    priority: 'medium',
    color: '#8b5cf6',
    category: 'purchase'
  },
  {
    id: 'vacation',
    name: 'European Vacation',
    icon: Plane,
    targetAmount: 8000,
    currentAmount: 1200,
    targetDate: '2025-07-15',
    priority: 'low',
    color: '#10b981',
    category: 'experience'
  }
];

const goalCategories = [
  { id: 'emergency', name: 'Emergency Fund', icon: Shield, color: '#ef4444' },
  { id: 'purchase', name: 'Major Purchase', icon: Home, color: '#3b82f6' },
  { id: 'experience', name: 'Experience', icon: Plane, color: '#10b981' },
  { id: 'investment', name: 'Investment', icon: TrendingUp, color: '#f59e0b' }
];

export default function SavingsGoalVisualizer() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [goals, setGoals] = useState<SavingsGoal[]>(defaultGoals);
  const [monthlyBudget, setMonthlyBudget] = useState(1000);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [viewMode, setViewMode] = useState<'progress' | 'timeline' | 'allocation'>('progress');

  // Record calculator usage on mount
  useEffect(() => {
    recordCalculatorUsage('savings-goal-visualizer');
  }, [recordCalculatorUsage]);

  const [newGoal, setNewGoal] = useState<{
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    priority: 'high' | 'medium' | 'low';
    category: 'emergency' | 'purchase' | 'experience' | 'investment';
  }>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: '',
    priority: 'medium',
    category: 'purchase'
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateMonthsToGoal = (goal: SavingsGoal, monthlyAmount: number) => {
    if (monthlyAmount <= 0) return Infinity;
    return Math.ceil((goal.targetAmount - goal.currentAmount) / monthlyAmount);
  };

  const getOptimalAllocation = useCallback(() => {
    const totalNeeded = goals.reduce((sum, goal) => sum + (goal.targetAmount - goal.currentAmount), 0);
    
    if (totalNeeded === 0) return goals.map(goal => ({ ...goal, allocation: 0 }));
    
    // Priority weighting: high = 3, medium = 2, low = 1
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    const totalWeight = goals.reduce((sum, goal) => {
      const remaining = goal.targetAmount - goal.currentAmount;
      return sum + (remaining > 0 ? priorityWeights[goal.priority] : 0);
    }, 0);
    
    return goals.map(goal => {
      const remaining = goal.targetAmount - goal.currentAmount;
      if (remaining <= 0) return { ...goal, allocation: 0 };
      
      const weight = priorityWeights[goal.priority];
      const allocation = Math.round((weight / totalWeight) * monthlyBudget);
      return { ...goal, allocation };
    });
  }, [goals, monthlyBudget]);

  const generateTimelineData = useCallback(() => {
    const allocation = getOptimalAllocation();
    const data: TimelineData[] = [];
    const startDate = new Date();
    
    const runningTotals = goals.reduce((acc, goal) => {
      acc[goal.category] = goal.currentAmount;
      return acc;
    }, {} as Record<string, number>);
    
    for (let i = 0; i < 24; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      const monthData: TimelineData = {
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        cumulative: 0,
        monthly: monthlyBudget,
        emergency: 0,
        purchase: 0,
        experience: 0,
        investment: 0
      };
      
      allocation.forEach(goal => {
        if (goal.allocation > 0) {
          runningTotals[goal.category] = (runningTotals[goal.category] || 0) + goal.allocation;
          monthData[goal.category] = runningTotals[goal.category];
        }
      });
      
      monthData.cumulative = Object.values(runningTotals).reduce((sum, val) => sum + val, 0);
      data.push(monthData);
    }
    
    return data;
  }, [goals, monthlyBudget, getOptimalAllocation]);

  const addGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetDate) return;
    
    const categoryInfo = goalCategories.find(cat => cat.id === newGoal.category);
    const goal: SavingsGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      icon: categoryInfo?.icon || Home,
      targetAmount: newGoal.targetAmount,
      currentAmount: newGoal.currentAmount,
      targetDate: newGoal.targetDate,
      priority: newGoal.priority,
      color: categoryInfo?.color || '#3b82f6',
      category: newGoal.category
    };
    
    setGoals(prev => [...prev, goal]);
    setNewGoal({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      targetDate: '',
      priority: 'medium',
      category: 'purchase'
    });
    setShowAddGoal(false);
  };

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const updateGoalProgress = (id: string, amount: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, currentAmount: Math.max(0, Math.min(amount, goal.targetAmount)) } : goal
    ));
  };

  const resetToDefaults = () => {
    setGoals(defaultGoals);
    setMonthlyBudget(1000);
    setShowAddGoal(false);
  };

  const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalProgress = totalGoalAmount > 0 ? (totalCurrentAmount / totalGoalAmount) * 100 : 0;
  const allocation = getOptimalAllocation();
  const timelineData = generateTimelineData();

  const pieData = goalCategories.map(category => {
    const categoryGoals = goals.filter(goal => goal.category === category.id);
    const value = categoryGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    return { name: category.name, value, color: category.color };
  }).filter(item => item.value > 0);

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
          <Target className="w-6 h-6 text-purple-400" />
          Savings Goal Visualizer & Optimizer
        </h3>
        <p className={`${theme.textColors.secondary} text-sm mb-4`}>
          Track multiple savings goals, see optimal allocation strategies, and visualize your path to financial success.
        </p>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className={`text-sm ${theme.textColors.secondary}`}>Monthly Budget:</label>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              className={`px-3 py-1 w-24 bg-slate-700 border ${theme.borderColors.primary} rounded text-sm`}
            />
          </div>
          
          <div className="flex items-center gap-2">
            {['progress', 'timeline', 'allocation'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as typeof viewMode)}
                className={`px-3 py-1 rounded text-sm transition-all capitalize ${
                  viewMode === mode 
                    ? theme.buttons.primary 
                    : `${theme.backgrounds.glass} ${theme.textColors.secondary} hover:${theme.textColors.primary}`
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowAddGoal(!showAddGoal)}
            className={`px-4 py-2 ${theme.buttons.secondary} rounded text-sm transition-all`}
          >
            {showAddGoal ? 'Cancel' : '+ Add Goal'}
          </button>
          
          <button
            onClick={resetToDefaults}
            className={`px-4 py-2 ${theme.buttons.ghost} rounded text-sm transition-all`}
          >
            <RefreshCw className="w-4 h-4 mr-1 inline" />
            Reset
          </button>
        </div>
      </div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}
          >
            <h4 className={`font-bold ${theme.textColors.primary} mb-3`}>Add New Savings Goal</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Goal name"
                value={newGoal.name}
                onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                className={`px-3 py-2 bg-slate-700 border ${theme.borderColors.primary} rounded`}
              />
              <input
                type="number"
                placeholder="Target amount"
                value={newGoal.targetAmount || ''}
                onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: Number(e.target.value) }))}
                className={`px-3 py-2 bg-slate-700 border ${theme.borderColors.primary} rounded`}
              />
              <input
                type="number"
                placeholder="Current saved"
                value={newGoal.currentAmount || ''}
                onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: Number(e.target.value) }))}
                className={`px-3 py-2 bg-slate-700 border ${theme.borderColors.primary} rounded`}
              />
              <input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                className={`px-3 py-2 bg-slate-700 border ${theme.borderColors.primary} rounded`}
              />
              <select
                value={newGoal.priority}
                onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                className={`px-3 py-2 bg-slate-700 border ${theme.borderColors.primary} rounded`}
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value as typeof newGoal.category }))}
                className={`px-3 py-2 bg-slate-700 border ${theme.borderColors.primary} rounded`}
              >
                {goalCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={addGoal}
              className={`mt-3 px-4 py-2 ${theme.buttons.primary} rounded transition-all`}
            >
              Add Goal
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 ${theme.status.info.bg} rounded-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${theme.status.info.text}`}>Total Goals</span>
            <Target className={`w-5 h-5 ${theme.status.info.text}`} />
          </div>
          <div className={`text-2xl font-bold ${theme.status.info.text}`}>
            {formatCurrency(totalGoalAmount)}
          </div>
        </div>

        <div className={`p-4 ${theme.status.success.bg} rounded-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${theme.status.success.text}`}>Total Saved</span>
            <DollarSign className={`w-5 h-5 ${theme.status.success.text}`} />
          </div>
          <div className={`text-2xl font-bold ${theme.status.success.text}`}>
            {formatCurrency(totalCurrentAmount)}
          </div>
        </div>

        <div className={`p-4 ${theme.status.warning.bg} rounded-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${theme.status.warning.text}`}>Progress</span>
            <TrendingUp className={`w-5 h-5 ${theme.status.warning.text}`} />
          </div>
          <div className={`text-2xl font-bold ${theme.status.warning.text}`}>
            {totalProgress.toFixed(1)}%
          </div>
        </div>

        <div className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${theme.textColors.secondary}`}>Monthly Budget</span>
            <Calculator className={`w-5 h-5 ${theme.textColors.secondary}`} />
          </div>
          <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
            {formatCurrency(monthlyBudget)}
          </div>
        </div>
      </div>

      {/* Main Content Based on View Mode */}
      {viewMode === 'progress' && (
        <div className="space-y-4">
          <h4 className={`font-bold ${theme.textColors.primary} mb-3`}>Goal Progress</h4>
          {goals.map((goal) => {
            const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
            const IconComponent = goal.icon;
            const monthsRemaining = calculateMonthsToGoal(goal, allocation.find(a => a.id === goal.id)?.allocation || 0);
            
            return (
              <motion.div
                key={goal.id}
                layout
                className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: goal.color }}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h5 className={`font-medium ${theme.textColors.primary}`}>{goal.name}</h5>
                      <p className={`text-sm ${theme.textColors.muted} capitalize`}>
                        {goal.priority} priority • {goal.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${theme.textColors.primary}`}>
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </div>
                    <p className={`text-sm ${theme.textColors.muted}`}>
                      {monthsRemaining === Infinity ? 'No allocation' : `${monthsRemaining} months`}
                    </p>
                  </div>
                </div>
                
                <div className={`w-full bg-slate-700 rounded-full h-3 mb-3`}>
                  <motion.div
                    className="h-3 rounded-full"
                    style={{ backgroundColor: goal.color, width: `${Math.min(progress, 100)}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme.textColors.secondary}`}>
                    {progress.toFixed(1)}% complete
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={goal.currentAmount}
                      onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                      className={`px-2 py-1 w-24 bg-slate-700 border ${theme.borderColors.primary} rounded text-sm`}
                    />
                    <button
                      onClick={() => removeGoal(goal.id)}
                      className={`px-2 py-1 ${theme.status.error.bg} ${theme.status.error.text} rounded text-xs`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {viewMode === 'timeline' && (
        <div>
          <h4 className={`font-bold ${theme.textColors.primary} mb-3`}>24-Month Savings Timeline</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[600]} opacity={0.3} />
                <XAxis dataKey="month" tick={{ fill: theme.colors.slate[400] }} />
                <YAxis
                  tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                  tick={{ fill: theme.colors.slate[400] }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: theme.colors.slate[300] }}
                  contentStyle={{
                    backgroundColor: theme.colors.slate[800],
                    border: `1px solid ${theme.colors.slate[600]}`,
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="emergency"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="purchase"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="experience"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="investment"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {viewMode === 'allocation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className={`font-bold ${theme.textColors.primary} mb-3`}>Optimal Monthly Allocation</h4>
            <div className="space-y-3">
              {allocation.map((goal) => (
                <div key={goal.id} className={`p-3 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center" style={{ color: goal.color }}>
                        <goal.icon className="w-4 h-4" />
                      </div>
                      <span className={`${theme.textColors.primary}`}>{goal.name}</span>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${theme.textColors.primary}`}>
                        {formatCurrency(goal.allocation)}
                      </div>
                      <div className={`text-xs ${theme.textColors.muted}`}>
                        {monthlyBudget > 0 ? ((goal.allocation / monthlyBudget) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className={`p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${theme.status.info.text}`}>Total Allocated</span>
                  <span className={`font-bold ${theme.status.info.text}`}>
                    {formatCurrency(allocation.reduce((sum, goal) => sum + goal.allocation, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className={`font-bold ${theme.textColors.primary} mb-3`}>Goal Distribution</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: theme.colors.slate[300] }}
                    contentStyle={{
                      backgroundColor: theme.colors.slate[800],
                      border: `1px solid ${theme.colors.slate[600]}`,
                      borderRadius: '8px'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Action Recommendations */}
      <div className={`mt-6 p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
        <h4 className={`font-bold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
          <Star className="w-5 h-5" />
          Smart Recommendations
        </h4>
        <div className="space-y-2">
          {totalProgress < 20 && (
            <p className={`text-sm ${theme.textColors.secondary}`}>
              🚀 <strong>Get started:</strong> You&apos;re just beginning your savings journey. Focus on building emergency fund first.
            </p>
          )}
          {monthlyBudget < 500 && (
            <p className={`text-sm ${theme.textColors.secondary}`}>
              💡 <strong>Increase budget:</strong> Consider finding ways to increase your monthly savings rate for faster progress.
            </p>
          )}
          {goals.filter(g => g.priority === 'high').length > 2 && (
            <p className={`text-sm ${theme.textColors.secondary}`}>
              ⚖️ <strong>Prioritize:</strong> You have many high-priority goals. Consider focusing on 1-2 at a time.
            </p>
          )}
          {totalProgress >= 50 && (
            <p className={`text-sm ${theme.textColors.secondary}`}>
              🎉 <strong>Great progress:</strong> You&apos;re halfway there! Keep up the momentum and consider adding new goals.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
