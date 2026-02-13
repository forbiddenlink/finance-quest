'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import {
  Target,
  DollarSign,
  PieChart,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BudgetCategory {
  name: string;
  current: number;
  recommended: number;
  priority: 'high' | 'medium' | 'low';
  description: string;
}

export default function BudgetOptimizerCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { name: 'Housing', current: 1500, recommended: 1500, priority: 'high', description: 'Rent/mortgage, utilities, insurance' },
    { name: 'Transportation', current: 500, recommended: 750, priority: 'high', description: 'Car payment, gas, insurance, maintenance' },
    { name: 'Food', current: 600, recommended: 400, priority: 'high', description: 'Groceries and dining out' },
    { name: 'Savings', current: 200, recommended: 1000, priority: 'high', description: 'Emergency fund and investments' },
    { name: 'Entertainment', current: 300, recommended: 150, priority: 'medium', description: 'Movies, hobbies, subscriptions' },
    { name: 'Shopping', current: 400, recommended: 200, priority: 'low', description: 'Clothing and miscellaneous purchases' },
    { name: 'Personal Care', current: 150, recommended: 100, priority: 'medium', description: 'Haircuts, cosmetics, healthcare' },
    { name: 'Debt Payments', current: 350, recommended: 300, priority: 'high', description: 'Credit cards, loans (minimum payments)' }
  ]);

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('budget-optimizer-calculator');
  }, [recordCalculatorUsage]);

  const totalCurrent = categories.reduce((sum, cat) => sum + cat.current, 0);
  const leftover = monthlyIncome - totalCurrent;

  const updateCategory = (index: number, amount: number) => {
    const newCategories = [...categories];
    newCategories[index].current = Math.max(0, amount);
    setCategories(newCategories);
  };

  const optimizeBudget = () => {
    // Apply 50/30/20 rule with optimizations
    const needs = monthlyIncome * 0.5; // Housing, Transportation, Food, Debt
    const wants = monthlyIncome * 0.3; // Entertainment, Shopping, Personal Care
    const savings = monthlyIncome * 0.2; // Savings and investments

    const newCategories = [...categories];
    
    // Optimize needs (50%)
    const needsCategories = ['Housing', 'Transportation', 'Food', 'Debt Payments'];
    const needsTotal = needsCategories.reduce((sum, name) => {
      const cat = categories.find(c => c.name === name);
      return sum + (cat?.current || 0);
    }, 0);
    
    const needsRatio = needs / needsTotal;
    
    needsCategories.forEach(name => {
      const index = newCategories.findIndex(c => c.name === name);
      if (index !== -1) {
        newCategories[index].current = Math.round(newCategories[index].current * needsRatio);
      }
    });

    // Set savings to 20%
    const savingsIndex = newCategories.findIndex(c => c.name === 'Savings');
    if (savingsIndex !== -1) {
      newCategories[savingsIndex].current = Math.round(savings);
    }

    // Distribute wants (30%)
    const wantsCategories = ['Entertainment', 'Shopping', 'Personal Care'];
    const remainingWants = wants;
    wantsCategories.forEach((name) => {
      const index = newCategories.findIndex(c => c.name === name);
      if (index !== -1) {
        // Distribute wants based on priority
        const portion = name === 'Entertainment' ? 0.5 : name === 'Personal Care' ? 0.3 : 0.2;
        newCategories[index].current = Math.round(remainingWants * portion);
      }
    });

    setCategories(newCategories);
    toast.success('Budget optimized using the 50/30/20 rule!');
  };

  const getOptimizationTips = () => {
    const tips = [];
    
    if (leftover < 0) {
      tips.push({
        type: 'error',
        message: `You're overspending by $${Math.abs(leftover).toFixed(2)}. Reduce expenses immediately.`
      });
    }

    categories.forEach(cat => {
      const variance = ((cat.current - cat.recommended) / cat.recommended) * 100;
      if (variance > 20) {
        tips.push({
          type: 'warning',
          message: `${cat.name} is ${variance.toFixed(0)}% over recommended. Consider reducing.`
        });
      } else if (variance < -20 && cat.name === 'Savings') {
        tips.push({
          type: 'error',
          message: `Increase ${cat.name} by $${(cat.recommended - cat.current).toFixed(2)} to meet goals.`
        });
      }
    });

    if (tips.length === 0) {
      tips.push({
        type: 'success',
        message: 'Great job! Your budget is well-optimized.'
      });
    }

    return tips;
  };

  const tips = getOptimizationTips();
  const savingsRate = ((categories.find(c => c.name === 'Savings')?.current || 0) / monthlyIncome) * 100;

  return (
    <div className={`min-h-screen ${theme.backgrounds.primary} p-6`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl font-bold ${theme.textColors.primary} mb-4`}>
            Budget Optimizer Calculator
          </h1>
          <p className={`text-xl ${theme.textColors.secondary} max-w-3xl mx-auto`}>
            Optimize your budget allocation, identify overspending, and maximize your savings rate with AI-powered recommendations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
              <DollarSign className="w-6 h-6" />
              Budget Configuration
            </h2>

            {/* Monthly Income */}
            <div className="mb-6">
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Monthly Income
              </label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className={`w-full p-3 bg-white/5 border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="5000"
              />
            </div>

            {/* Category Inputs */}
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className={`text-sm font-medium ${theme.textColors.secondary}`}>
                      {category.name}
                    </label>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      category.priority === 'high' 
                        ? 'bg-red-500/20 text-red-300'
                        : category.priority === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {category.priority} priority
                    </span>
                  </div>
                  <input
                    type="number"
                    value={category.current}
                    onChange={(e) => updateCategory(index, Number(e.target.value))}
                    className={`w-full p-2 bg-white/5 border ${theme.borderColors.primary} rounded ${theme.textColors.primary} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    title={`Current amount for ${category.name}`}
                  />
                  <p className={`text-xs ${theme.textColors.muted}`}>
                    {category.description} (Recommended: ${category.recommended})
                  </p>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={optimizeBudget}
              aria-label="Auto-optimize budget allocation"
              className={`w-full mt-6 py-3 px-4 ${theme.buttons.primary} rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2`}
            >
              <Zap className="w-5 h-5" />
              Auto-Optimize Budget
            </motion.button>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Budget Summary */}
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <BarChart3 className="w-5 h-5" />
                Budget Summary
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className={`text-sm ${theme.textColors.secondary}`}>Total Spending</p>
                  <p className={`text-2xl font-bold ${totalCurrent > monthlyIncome ? 'text-red-400' : theme.textColors.primary}`}>
                    ${totalCurrent.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className={`text-sm ${theme.textColors.secondary}`}>Remaining</p>
                  <p className={`text-2xl font-bold ${leftover < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    ${leftover.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${theme.textColors.secondary}`}>Savings Rate</span>
                  <span className={`text-lg font-bold ${savingsRate >= 20 ? 'text-green-400' : savingsRate >= 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {savingsRate.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 bg-white/10 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      savingsRate >= 20 ? 'bg-green-400' : savingsRate >= 10 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    data-width={Math.min(savingsRate, 100)}
                    style={{ width: `${Math.min(savingsRate, 100)}%` }}
                  ></div>
                </div>
                <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                  Target: 20% savings rate for financial independence
                </p>
              </div>
            </div>

            {/* Optimization Tips */}
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Target className="w-5 h-5" />
                Optimization Tips
              </h3>
              
              <div className="space-y-3">
                {tips.map((tip, index) => (
                  <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                    tip.type === 'error' ? 'bg-red-500/10 border border-red-500/20' :
                    tip.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                    'bg-green-500/10 border border-green-500/20'
                  }`}>
                    {tip.type === 'error' ? (
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    ) : tip.type === 'warning' ? (
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      {tip.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Visualization */}
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <PieChart className="w-5 h-5" />
                Budget Breakdown
              </h3>
              
              <div className="space-y-3">
                {categories.map((category) => {
                  const percentage = (category.current / monthlyIncome) * 100;
                  const isOverBudget = category.current > category.recommended;
                  
                  return (
                    <div key={category.name} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textColors.secondary}`}>
                          {category.name}
                        </span>
                        <span className={`text-sm font-medium ${isOverBudget ? 'text-red-400' : theme.textColors.primary}`}>
                          ${category.current} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isOverBudget ? 'bg-red-400' : 'bg-blue-400'
                          }`}
                          data-width={Math.min(percentage, 100)}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
            Budget Optimization Strategies
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
              <h4 className="font-semibold text-blue-300 mb-2">50/30/20 Rule</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Allocate 50% to needs, 30% to wants, and 20% to savings and debt repayment.
              </p>
            </div>
            
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
              <h4 className="font-semibold text-green-300 mb-2">Priority-Based</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Focus on high-priority expenses first, then optimize medium and low priority items.
              </p>
            </div>
            
            <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
              <h4 className="font-semibold text-purple-300 mb-2">Zero-Based</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Give every dollar a purpose until income minus expenses equals zero.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
