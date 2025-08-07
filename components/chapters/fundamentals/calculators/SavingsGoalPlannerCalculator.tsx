'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import {
  Target,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Trophy,
  PiggyBank,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export default function SavingsGoalPlannerCalculator() {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 2500,
      targetDate: '2024-12-31',
      priority: 'high',
      category: 'Security'
    },
    {
      id: '2',
      name: 'Vacation to Europe',
      targetAmount: 5000,
      currentAmount: 800,
      targetDate: '2024-08-15',
      priority: 'medium',
      category: 'Lifestyle'
    },
    {
      id: '3',
      name: 'New Car Down Payment',
      targetAmount: 8000,
      currentAmount: 1200,
      targetDate: '2025-03-01',
      priority: 'medium',
      category: 'Transportation'
    }
  ]);

  const [newGoal, setNewGoal] = useState<Partial<SavingsGoal>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: '',
    priority: 'medium',
    category: ''
  });

  const [monthlyBudget, setMonthlyBudget] = useState(1000);
  const [interestRate, setInterestRate] = useState(4.5);

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('savings-goal-planner-calculator');
  }, [recordCalculatorUsage]);

  const addGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetDate || !newGoal.category) {
      toast.error('Please fill in all fields');
      return;
    }

    const goal: SavingsGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: Number(newGoal.currentAmount) || 0,
      targetDate: newGoal.targetDate,
      priority: newGoal.priority || 'medium',
      category: newGoal.category
    };

    setGoals([...goals, goal]);
    setNewGoal({ name: '', targetAmount: 0, currentAmount: 0, targetDate: '', priority: 'medium', category: '' });
    toast.success('Savings goal added successfully!');
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast.success('Goal removed');
  };

  const updateGoalProgress = (id: string, currentAmount: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, currentAmount: Math.max(0, currentAmount) } : goal
    ));
  };

  const calculateGoalMetrics = (goal: SavingsGoal) => {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const monthsRemaining = Math.max(1, Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const monthlyRequired = remainingAmount / monthsRemaining;
    const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
    
    // Calculate with compound interest
    const monthlyRate = interestRate / 100 / 12;
    const futureValue = goal.currentAmount * Math.pow(1 + monthlyRate, monthsRemaining);
    const monthlyRequiredWithInterest = remainingAmount > 0 ? 
      (goal.targetAmount - futureValue) / (((Math.pow(1 + monthlyRate, monthsRemaining) - 1) / monthlyRate) || 1) : 0;

    const isOnTrack = monthlyRequired <= (monthlyBudget * (goal.priority === 'high' ? 0.4 : goal.priority === 'medium' ? 0.3 : 0.2));
    const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      monthsRemaining,
      remainingAmount,
      monthlyRequired,
      monthlyRequiredWithInterest,
      progressPercentage,
      isOnTrack,
      daysRemaining,
      futureValue
    };
  };

  const optimizeAllocation = () => {
    const sortedGoals = [...goals].sort((a, b) => {
      // Sort by priority and urgency
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const aMetrics = calculateGoalMetrics(a);
      const bMetrics = calculateGoalMetrics(b);
      
      const aScore = priorityWeight[a.priority] * (100 / aMetrics.monthsRemaining);
      const bScore = priorityWeight[b.priority] * (100 / bMetrics.monthsRemaining);
      
      return bScore - aScore;
    });

    let remainingBudget = monthlyBudget;
    const allocations: { [key: string]: number } = {};

    sortedGoals.forEach(goal => {
      const metrics = calculateGoalMetrics(goal);
      const maxAllocation = remainingBudget * (goal.priority === 'high' ? 0.5 : goal.priority === 'medium' ? 0.3 : 0.2);
      const allocation = Math.min(maxAllocation, metrics.monthlyRequiredWithInterest, remainingBudget);
      
      allocations[goal.id] = allocation;
      remainingBudget -= allocation;
    });

    return { allocations, remainingBudget };
  };

  const { allocations, remainingBudget } = optimizeAllocation();
  const totalAllocated = Object.values(allocations).reduce((sum, amount) => sum + amount, 0);

  const getGoalStatus = (goal: SavingsGoal) => {
    const metrics = calculateGoalMetrics(goal);
    if (metrics.progressPercentage >= 100) return { status: 'completed', color: 'text-green-400', icon: Trophy };
    if (metrics.isOnTrack) return { status: 'on-track', color: 'text-blue-400', icon: CheckCircle };
    if (metrics.daysRemaining < 60) return { status: 'urgent', color: 'text-red-400', icon: AlertCircle };
    return { status: 'behind', color: 'text-yellow-400', icon: Clock };
  };

  return (
    <div className={`min-h-screen ${theme.backgrounds.primary} p-6`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl font-bold ${theme.textColors.primary} mb-4`}>
            Savings Goal Planner Calculator
          </h1>
          <p className={`text-xl ${theme.textColors.secondary} max-w-3xl mx-auto`}>
            Set financial goals, track progress, and optimize your savings allocation to achieve your dreams faster.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Goal Creation Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
              <Target className="w-6 h-6" />
              Create New Goal
            </h2>

            {/* Budget Settings */}
            <div className="mb-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Monthly Savings Budget
                </label>
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="1000"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Expected Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="4.5"
                  title="Expected annual interest rate"
                />
              </div>
            </div>

            {/* New Goal Form */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Goal Name
                </label>
                <input
                  type="text"
                  value={newGoal.name || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., Emergency Fund, Vacation"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Target Amount
                  </label>
                  <input
                    type="number"
                    value={newGoal.targetAmount || 0}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                    className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Current Amount
                  </label>
                  <input
                    type="number"
                    value={newGoal.currentAmount || 0}
                    onChange={(e) => setNewGoal({ ...newGoal, currentAmount: Number(e.target.value) })}
                    className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={newGoal.targetDate || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Priority Level
                  </label>
                  <select
                    value={newGoal.priority || 'medium'}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as 'high' | 'medium' | 'low' })}
                    className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    title="Select priority level"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Category
                </label>
                <input
                  type="text"
                  value={newGoal.category || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., Security, Lifestyle, Investment"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addGoal}
                className={`w-full py-3 px-4 ${theme.buttons.primary} rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2`}
              >
                <PiggyBank className="w-5 h-5" />
                Add Savings Goal
              </motion.button>
            </div>
          </motion.div>

          {/* Budget Allocation Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Allocation Summary */}
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <DollarSign className="w-5 h-5" />
                Allocation Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`${theme.textColors.secondary}`}>Monthly Budget</span>
                  <span className={`text-lg font-bold ${theme.textColors.primary}`}>
                    ${monthlyBudget.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`${theme.textColors.secondary}`}>Total Allocated</span>
                  <span className={`text-lg font-bold text-blue-400`}>
                    ${totalAllocated.toLocaleString()}
                  </span>
                </div>

                <div className={`flex justify-between items-center p-3 rounded-lg ${
                  remainingBudget > 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  <span className={`font-medium ${theme.textColors.primary}`}>Remaining Budget</span>
                  <span className={`text-xl font-bold ${remainingBudget >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${remainingBudget.toLocaleString()}
                  </span>
                </div>

                {remainingBudget > 0 && (
                  <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      💡 You have ${remainingBudget.toLocaleString()} left to allocate. Consider increasing existing goals or adding new ones.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Optimization Tips */}
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Zap className="w-5 h-5" />
                Smart Tips
              </h3>
              
              <div className="space-y-3">
                {goals.length === 0 && (
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    🎯 Start by adding your most important financial goal above.
                  </p>
                )}
                
                {goals.some(goal => calculateGoalMetrics(goal).progressPercentage >= 100) && (
                  <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                    <p className={`text-sm text-green-300`}>
                      🏆 Congratulations! You&apos;ve completed some goals. Consider setting new ones.
                    </p>
                  </div>
                )}

                {goals.some(goal => !calculateGoalMetrics(goal).isOnTrack) && (
                  <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                    <p className={`text-sm text-yellow-300`}>
                      ⚠️ Some goals are behind schedule. Consider adjusting target dates or increasing savings.
                    </p>
                  </div>
                )}

                <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                  <p className={`text-sm text-blue-300`}>
                    💡 Earning {interestRate}% annually? Your money grows faster with compound interest!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Goals List Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <Calendar className="w-5 h-5" />
              Your Goals
            </h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {goals.map((goal) => {
                const metrics = calculateGoalMetrics(goal);
                const status = getGoalStatus(goal);
                const StatusIcon = status.icon;
                const allocation = allocations[goal.id] || 0;

                return (
                  <div key={goal.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className={`font-semibold ${theme.textColors.primary}`}>{goal.name}</h4>
                        <p className={`text-xs ${theme.textColors.muted}`}>{goal.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          goal.priority === 'high' 
                            ? 'bg-red-500/20 text-red-300'
                            : goal.priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {goal.priority}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={theme.textColors.secondary}>Progress</span>
                        <span className={theme.textColors.primary}>
                          ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            metrics.progressPercentage >= 100 ? 'bg-green-400' : 'bg-blue-400'
                          }`}
                          data-width={Math.min(metrics.progressPercentage, 100)}
                          style={{ width: `${Math.min(metrics.progressPercentage, 100)}%` }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className={theme.textColors.muted}>Required/month</p>
                          <p className={`font-medium ${allocation >= metrics.monthlyRequiredWithInterest ? 'text-green-400' : 'text-yellow-400'}`}>
                            ${metrics.monthlyRequiredWithInterest.toFixed(0)}
                          </p>
                        </div>
                        <div>
                          <p className={theme.textColors.muted}>Allocated</p>
                          <p className="font-medium text-blue-400">${allocation.toFixed(0)}</p>
                        </div>
                        <div>
                          <p className={theme.textColors.muted}>Time left</p>
                          <p className={theme.textColors.primary}>{metrics.monthsRemaining} months</p>
                        </div>
                        <div>
                          <p className={theme.textColors.muted}>Target date</p>
                          <p className={theme.textColors.primary}>{new Date(goal.targetDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <input
                          type="number"
                          value={goal.currentAmount}
                          onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                          className={`flex-1 p-2 bg-white/5 border ${theme.borderColors.primary} rounded text-sm ${theme.textColors.primary} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                          placeholder="Update progress"
                          title="Update current amount"
                        />
                        <button
                          onClick={() => removeGoal(goal.id)}
                          className="px-3 py-2 text-red-400 hover:text-red-300 border border-red-500/20 rounded text-sm"
                          aria-label={`Remove ${goal.name}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {goals.length === 0 && (
                <div className="text-center py-8">
                  <PiggyBank className={`w-12 h-12 ${theme.textColors.muted} mx-auto mb-4`} />
                  <p className={`${theme.textColors.secondary}`}>No goals yet. Create your first savings goal above!</p>
                </div>
              )}
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
            Goal Setting Best Practices
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
              <h4 className="font-semibold text-blue-300 mb-2">SMART Goals</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Make goals Specific, Measurable, Achievable, Relevant, and Time-bound for better success rates.
              </p>
            </div>
            
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
              <h4 className="font-semibold text-green-300 mb-2">Automate Savings</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Set up automatic transfers to make saving effortless and ensure consistent progress.
              </p>
            </div>
            
            <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
              <h4 className="font-semibold text-purple-300 mb-2">Celebrate Milestones</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Acknowledge progress at 25%, 50%, and 75% completion to maintain motivation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
