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

interface ValidationError {
  field: string;
  message: string;
}

interface InputValidation {
  isValid: boolean;
  errors: ValidationError[];
}

export default function EmergencyFundBuildingTimeline() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('4000');
  const [currentSavings, setCurrentSavings] = useState<string>('500');
  const [monthlyIncome, setMonthlyIncome] = useState<string>('6000');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('moderate');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const recordCalculatorUsage = useProgressStore((state) => state.recordCalculatorUsage);

  // Validation function
  const validateInputs = (): InputValidation => {
    const errors: ValidationError[] = [];
    const expensesNum = parseFloat(monthlyExpenses);
    const incomeNum = parseFloat(monthlyIncome);
    const savingsNum = parseFloat(currentSavings);

    if (!monthlyExpenses || isNaN(expensesNum) || expensesNum <= 0) {
      errors.push({ field: 'monthlyExpenses', message: 'Monthly expenses must be greater than $0' });
    }

    if (!monthlyIncome || isNaN(incomeNum) || incomeNum <= 0) {
      errors.push({ field: 'monthlyIncome', message: 'Monthly income must be greater than $0' });
    }

    if (isNaN(savingsNum) || savingsNum < 0) {
      errors.push({ field: 'currentSavings', message: 'Current savings cannot be negative' });
    }

    if (incomeNum > 0 && expensesNum > 0 && expensesNum >= incomeNum) {
      errors.push({ field: 'monthlyExpenses', message: 'Expenses should be less than income for building emergency fund' });
    }

    return { isValid: errors.length === 0, errors };
  };

  // Handle input changes with validation
  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'monthlyExpenses':
        setMonthlyExpenses(value);
        break;
      case 'monthlyIncome':
        setMonthlyIncome(value);
        break;
      case 'currentSavings':
        setCurrentSavings(value);
        break;
    }
    
    // Update validation errors
    setTimeout(() => {
      const validation = validateInputs();
      setValidationErrors(validation.errors);
    }, 0);
  };

  useEffect(() => {
    recordCalculatorUsage('emergency-fund-building-timeline');
  }, [recordCalculatorUsage]);

  // Safe calculation functions with error handling
  const safeParseFloat = (value: string, fallback: number = 0): number => {
    try {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? fallback : parsed;
    } catch (error) {
      console.error('Error parsing float:', error);
      return fallback;
    }
  };

  const monthlyExpensesNum = safeParseFloat(monthlyExpenses);
  const currentSavingsNum = safeParseFloat(currentSavings);
  const monthlyIncomeNum = safeParseFloat(monthlyIncome);

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
            <h3 id="financial-situation-label" className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Current Financial Situation
            </h3>
            <div className="space-y-4" role="group" aria-labelledby="financial-situation-label">
              <div>
                <label htmlFor="monthly-income-input" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Monthly Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">$</span>
                  <input
                    type="number"
                    id="monthly-income-input"
                    value={monthlyIncome}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                    className={`pl-8 w-full px-4 py-3 bg-slate-800/50 border rounded-md text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all ${
                      validationErrors.some(e => e.field === 'monthlyIncome') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-slate-600 focus:ring-amber-500'
                    }`}
                    placeholder="6000"
                    aria-describedby="monthly-income-help monthly-income-error"
                    aria-invalid={validationErrors.some(e => e.field === 'monthlyIncome') ? 'true' : 'false'}
                    min="0"
                    step="100"
                  />
                </div>
                {validationErrors.some(e => e.field === 'monthlyIncome') && (
                  <p id="monthly-income-error" className="text-red-400 text-sm mt-1" role="alert">
                    {validationErrors.find(e => e.field === 'monthlyIncome')?.message}
                  </p>
                )}
                <p id="monthly-income-help" className={`text-xs ${theme.textColors.muted} mt-1`}>
                  Your total monthly income after taxes
                </p>
              </div>

              <div>
                <label htmlFor="monthly-expenses-input" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Monthly Essential Expenses
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">$</span>
                  <input
                    type="number"
                    id="monthly-expenses-input"
                    value={monthlyExpenses}
                    onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                    className={`pl-8 w-full px-4 py-3 bg-slate-800/50 border rounded-md text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all ${
                      validationErrors.some(e => e.field === 'monthlyExpenses') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-slate-600 focus:ring-amber-500'
                    }`}
                    placeholder="4000"
                    aria-describedby="monthly-expenses-help monthly-expenses-error"
                    aria-invalid={validationErrors.some(e => e.field === 'monthlyExpenses') ? 'true' : 'false'}
                    min="0"
                    step="100"
                  />
                </div>
                {validationErrors.some(e => e.field === 'monthlyExpenses') && (
                  <p id="monthly-expenses-error" className="text-red-400 text-sm mt-1" role="alert">
                    {validationErrors.find(e => e.field === 'monthlyExpenses')?.message}
                  </p>
                )}
                <p id="monthly-expenses-help" className={`text-xs ${theme.textColors.muted} mt-1`}>
                  Your essential monthly expenses (rent, utilities, food, insurance)
                </p>
              </div>

              <div>
                <label htmlFor="current-savings-input" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Current Emergency Savings
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">$</span>
                  <input
                    type="number"
                    id="current-savings-input"
                    value={currentSavings}
                    onChange={(e) => handleInputChange('currentSavings', e.target.value)}
                    className={`pl-8 w-full px-4 py-3 bg-slate-800/50 border rounded-md text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all ${
                      validationErrors.some(e => e.field === 'currentSavings') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-slate-600 focus:ring-amber-500'
                    }`}
                    placeholder="500"
                    aria-describedby="current-savings-help current-savings-error"
                    aria-invalid={validationErrors.some(e => e.field === 'currentSavings') ? 'true' : 'false'}
                    min="0"
                    step="100"
                  />
                </div>
                {validationErrors.some(e => e.field === 'currentSavings') && (
                  <p id="current-savings-error" className="text-red-400 text-sm mt-1" role="alert">
                    {validationErrors.find(e => e.field === 'currentSavings')?.message}
                  </p>
                )}
                <p id="current-savings-help" className={`text-xs ${theme.textColors.muted} mt-1`}>
                  Your current emergency fund or available savings amount
                </p>
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
            <h3 id="strategy-selection-label" className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Choose Your Strategy
            </h3>
            <div className="space-y-3" role="radiogroup" aria-labelledby="strategy-selection-label">
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
                          id={`strategy-${strategy.id}`}
                          name="savings-strategy"
                          checked={selectedStrategy === strategy.id}
                          onChange={() => setSelectedStrategy(strategy.id)}
                          className="w-4 h-4 text-amber-600 bg-gray-800 border-gray-600 focus:ring-amber-500"
                          aria-describedby={`strategy-${strategy.id}-description`}
                        />
                        <label htmlFor={`strategy-${strategy.id}`} className="cursor-pointer">
                          <div className={`font-medium ${theme.textColors.primary}`}>
                            {strategy.name}
                          </div>
                          <div className={`text-sm ${theme.textColors.secondary}`}>
                            {formatCurrency(strategy.monthlyAmount)}/month
                          </div>
                        </label>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded ${getDifficultyColor(strategy.difficulty)}`}>
                        {strategy.difficulty}
                      </div>
                    </div>
                    <p id={`strategy-${strategy.id}-description`} className={`text-sm ${theme.textColors.secondary} mt-2`}>
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
                          data-progress={Math.min(100, (currentSavingsNum / phase.targetAmount) * 100)}
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
