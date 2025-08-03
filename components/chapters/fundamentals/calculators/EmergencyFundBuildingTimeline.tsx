'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Target, Clock, CheckCircle } from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { motion } from 'framer-motion';

interface BuildingPhase {
  phase: number;
  name: string;
  targetAmount: number;
  description: string;
  priority: 'critical' | 'important' | 'optimal';
  tips: string[];
}

interface SavingsStrategy {
  id: string;
  name: string;
  description: string;
  monthlyAmount: number;
  timeToGoal: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  tips: string[];
}

export default function EmergencyFundBuildingTimeline() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('4000');
  const [currentSavings, setCurrentSavings] = useState<string>('500');
  const [monthlyIncome, setMonthlyIncome] = useState<string>('6000');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('moderate');
  
  const recordCalculatorUsage = useProgressStore((state) => state.recordCalculatorUsage);

  useEffect(() => {
    recordCalculatorUsage('emergency-fund-building-timeline');
  }, [recordCalculatorUsage]);

  const monthlyExpensesNum = parseFloat(monthlyExpenses) || 0;
  const currentSavingsNum = parseFloat(currentSavings) || 0;
  const monthlyIncomeNum = parseFloat(monthlyIncome) || 0;

  const buildingPhases: BuildingPhase[] = [
    {
      phase: 1,
      name: 'Starter Emergency Fund',
      targetAmount: 1000,
      description: 'Initial safety net for small emergencies',
      priority: 'critical',
      tips: [
        'Focus on this before paying extra on low-interest debt',
        'Use any windfalls (tax refunds, bonuses) to jumpstart',
        'Sell unused items to boost initial savings',
        'Consider a side gig for faster progress'
      ]
    },
    {
      phase: 2,
      name: 'Basic Emergency Fund',
      targetAmount: monthlyExpensesNum * 3,
      description: '3 months of essential expenses',
      priority: 'important',
      tips: [
        'Automate transfers right after payday',
        'Reduce discretionary spending temporarily',
        'Use the 50/30/20 budget rule',
        'Track progress weekly for motivation'
      ]
    },
    {
      phase: 3,
      name: 'Full Emergency Fund',
      targetAmount: monthlyExpensesNum * 6,
      description: '6 months of complete protection',
      priority: 'optimal',
      tips: [
        'Maintain this level for most people',
        'Consider high-yield savings for better returns',
        'Review and adjust annually',
        'Don\'t exceed unless high-risk situation'
      ]
    }
  ];

  const availableIncome = monthlyIncomeNum - monthlyExpensesNum;
  
  const savingsStrategies: SavingsStrategy[] = [
    {
      id: 'conservative',
      name: 'Conservative Approach',
      description: 'Small, sustainable amounts that fit any budget',
      monthlyAmount: Math.max(availableIncome * 0.05, 50),
      timeToGoal: 0,
      difficulty: 'easy',
      tips: [
        'Start small and build the habit',
        'Increase by $25 every 3 months',
        'Perfect for tight budgets',
        'Focus on consistency over amount'
      ]
    },
    {
      id: 'moderate',
      name: 'Balanced Approach',
      description: 'Reasonable pace with noticeable lifestyle adjustments',
      monthlyAmount: Math.max(availableIncome * 0.15, 200),
      timeToGoal: 0,
      difficulty: 'moderate',
      tips: [
        'Cut one major expense category',
        'Use the envelope method for tracking',
        'Consider meal planning to reduce food costs',
        'Shop with purpose and avoid impulse buys'
      ]
    },
    {
      id: 'aggressive',
      name: 'Aggressive Approach',
      description: 'Fast building with significant lifestyle changes',
      monthlyAmount: Math.max(availableIncome * 0.30, 500),
      timeToGoal: 0,
      difficulty: 'challenging',
      tips: [
        'Temporarily cut all non-essential spending',
        'Take on additional income sources',
        'Use the debt avalanche mindset for savings',
        'Consider moving to reduce housing costs'
      ]
    }
  ];

  // Calculate time to goal for each strategy
  savingsStrategies.forEach(strategy => {
    const totalGoal = monthlyExpensesNum * 6;
    const remaining = totalGoal - currentSavingsNum;
    strategy.timeToGoal = remaining > 0 ? Math.ceil(remaining / strategy.monthlyAmount) : 0;
  });

  const selectedStrategyData = savingsStrategies.find(s => s.id === selectedStrategy);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeToGoal = (months: number) => {
    if (months <= 0) return 'Already achieved!';
    if (months <= 12) return `${months} month${months === 1 ? '' : 's'}`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} year${years === 1 ? '' : 's'}`;
    return `${years}y ${remainingMonths}m`;
  };

  const getPhaseStatus = (phase: BuildingPhase) => {
    if (currentSavingsNum >= phase.targetAmount) return 'completed';
    if (currentSavingsNum >= (buildingPhases[phase.phase - 2]?.targetAmount || 0)) return 'current';
    return 'upcoming';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'important': return 'text-yellow-400 bg-yellow-500/20';
      case 'optimal': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20';
      case 'challenging': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-2 flex items-center justify-center gap-3`}>
          <Calendar className="w-6 h-6 text-amber-400" />
          Emergency Fund Building Timeline
        </h2>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Create a personalized roadmap to build your emergency fund with realistic timelines and strategies
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Current Situation */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Current Financial Situation
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Monthly Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="pl-8 w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="6000"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Monthly Essential Expenses
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(e.target.value)}
                    className="pl-8 w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="4000"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Current Emergency Savings
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                    className="pl-8 w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Available for Savings:</span>
                  <span className={`font-semibold ${availableIncome > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(availableIncome)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Strategy Selection */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Choose Your Strategy
            </h3>
            <div className="space-y-3">
              {savingsStrategies.map((strategy) => (
                <div key={strategy.id} className="space-y-2">
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedStrategy === strategy.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setSelectedStrategy(strategy.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={selectedStrategy === strategy.id}
                          onChange={() => setSelectedStrategy(strategy.id)}
                          className="w-4 h-4 text-amber-600 bg-gray-800 border-gray-600 focus:ring-amber-500"
                        />
                        <div>
                          <div className={`font-medium ${theme.textColors.primary}`}>
                            {strategy.name}
                          </div>
                          <div className={`text-sm ${theme.textColors.secondary}`}>
                            {formatCurrency(strategy.monthlyAmount)}/month
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded ${getDifficultyColor(strategy.difficulty)}`}>
                        {strategy.difficulty}
                      </div>
                    </div>
                    <p className={`text-sm ${theme.textColors.secondary} mt-2`}>
                      {strategy.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Building Phases Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6`}>
              Emergency Fund Building Phases
            </h3>
            <div className="space-y-6">
              {buildingPhases.map((phase, index) => {
                const status = getPhaseStatus(phase);
                const isCompleted = status === 'completed';
                const isCurrent = status === 'current';
                const monthsToComplete = selectedStrategyData ? 
                  Math.ceil(Math.max(0, phase.targetAmount - currentSavingsNum) / selectedStrategyData.monthlyAmount) : 0;

                return (
                  <motion.div 
                    key={phase.phase}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`relative p-6 rounded-lg border-2 ${
                      isCompleted ? 'border-green-500/30 bg-green-500/10' :
                      isCurrent ? 'border-amber-500/30 bg-amber-500/10' :
                      'border-white/10 bg-slate-800/20'
                    }`}
                  >
                    {/* Phase Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                          isCompleted ? 'border-green-500 bg-green-500/20' :
                          isCurrent ? 'border-amber-500 bg-amber-500/20' :
                          'border-white/20 bg-slate-800/50'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : isCurrent ? (
                            <Target className="w-6 h-6 text-amber-400" />
                          ) : (
                            <Clock className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className={`text-lg font-semibold ${
                            isCompleted ? 'text-green-400' :
                            isCurrent ? 'text-amber-400' :
                            theme.textColors.primary
                          }`}>
                            Phase {phase.phase}: {phase.name}
                          </h4>
                          <p className={theme.textColors.secondary}>
                            {phase.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${
                          isCompleted ? 'text-green-400' :
                          isCurrent ? 'text-amber-400' :
                          theme.textColors.primary
                        }`}>
                          {formatCurrency(phase.targetAmount)}
                        </div>
                        <div className={`px-2 py-1 text-xs rounded ${getPriorityColor(phase.priority)} mt-1`}>
                          {phase.priority}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm ${theme.textColors.secondary}`}>Progress</span>
                        <span className={`text-sm ${theme.textColors.primary}`}>
                          {isCompleted ? 'Complete!' : 
                           isCurrent ? formatTimeToGoal(monthsToComplete) :
                           'Not started'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-green-500' :
                            isCurrent ? 'bg-amber-500' :
                            'bg-gray-600'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (currentSavingsNum / phase.targetAmount) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Tips */}
                    {(isCurrent || (index === 0 && !isCompleted)) && (
                      <div className="space-y-2">
                        <h5 className={`font-medium ${theme.textColors.primary}`}>Key Strategies:</h5>
                        <ul className="space-y-1">
                          {phase.tips.slice(0, 3).map((tip, tipIndex) => (
                            <li key={tipIndex} className={`text-sm ${theme.textColors.secondary} flex items-start gap-2`}>
                              <span className="text-amber-400 mt-1">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Connection Line */}
                    {index < buildingPhases.length - 1 && (
                      <div className={`absolute left-6 -bottom-6 w-0.5 h-6 ${
                        getPhaseStatus(buildingPhases[index + 1]) === 'completed' ? 'bg-green-500' :
                        status === 'completed' ? 'bg-amber-500' :
                        'bg-gray-600'
                      }`}></div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Strategy Details */}
          {selectedStrategyData && (
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
                Your Selected Strategy: {selectedStrategyData.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Timeline Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={theme.textColors.secondary}>Monthly Savings:</span>
                      <span className="text-amber-400 font-medium">{formatCurrency(selectedStrategyData.monthlyAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textColors.secondary}>Time to Full Fund:</span>
                      <span className="text-amber-400 font-medium">{formatTimeToGoal(selectedStrategyData.timeToGoal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textColors.secondary}>% of Available Income:</span>
                      <span className="text-amber-400 font-medium">
                        {availableIncome > 0 ? ((selectedStrategyData.monthlyAmount / availableIncome) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Action Tips</h4>
                  <ul className="space-y-1">
                    {selectedStrategyData.tips.slice(0, 4).map((tip, index) => (
                      <li key={index} className={`text-sm ${theme.textColors.secondary} flex items-start gap-2`}>
                        <span className="text-amber-400 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
