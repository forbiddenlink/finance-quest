'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Brain, Target, TrendingUp, DollarSign } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

// Import all 4 Money Mindset calculators
import PaycheckCalculator from './PaycheckCalculator';
import MoneyPersonalityAssessment from './MoneyPersonalityAssessment';
import FinancialGoalPrioritizer from './FinancialGoalPrioritizer';
import SpendingMindsetAnalyzer from './SpendingMindsetAnalyzer';

interface CalculatorTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  description: string;
}

const calculatorTabs: CalculatorTab[] = [
  {
    id: 'paycheck-calculator',
    label: 'Paycheck Calculator',
    icon: Calculator,
    component: PaycheckCalculator,
    description: 'Calculate take-home pay and understand your income breakdown'
  },
  {
    id: 'money-personality',
    label: 'Money Personality',
    icon: Brain,
    component: MoneyPersonalityAssessment,
    description: 'Discover your money personality type and optimize your financial behavior'
  },
  {
    id: 'goal-prioritizer',
    label: 'Goal Prioritizer',
    icon: Target,
    component: FinancialGoalPrioritizer,
    description: 'Prioritize and sequence your financial goals for maximum success'
  },
  {
    id: 'spending-mindset',
    label: 'Spending Mindset',
    icon: TrendingUp,
    component: SpendingMindsetAnalyzer,
    description: 'Analyze spending patterns and develop healthier money habits'
  }
];

export default function MoneyMindsetCalculatorSuite() {
  const [activeTab, setActiveTab] = useState<string>('paycheck-calculator');
  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('money-mindset-calculator-suite');
  }, [recordCalculatorUsage]);

  const activeCalculator = calculatorTabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeCalculator?.component || PaycheckCalculator;

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
      >
        <div className="flex items-center space-x-3 mb-4">
          <DollarSign className="w-6 h-6 text-blue-400" />
          <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
            Money Mindset Calculator Suite
          </h3>
        </div>
        <p className={`${theme.textColors.secondary} mb-6`}>
          Build a healthy relationship with money through 4 comprehensive tools that address psychology, 
          planning, and practical calculations.
        </p>

        {/* Calculator Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {calculatorTabs.map((tab, index) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                activeTab === tab.id
                  ? `${theme.backgrounds.card} border-blue-400/50 ring-2 ring-blue-400/20`
                  : `${theme.backgrounds.glass} ${theme.borderColors.primary} hover:border-blue-400/30`
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className={`w-8 h-8 mb-3 ${
                activeTab === tab.id ? 'text-blue-400' : 'text-slate-400'
              }`} />
              <h4 className={`font-medium mb-2 ${theme.textColors.primary}`}>
                {tab.label}
              </h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                {tab.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {calculatorTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? `${theme.buttons.primary} text-white`
                : `${theme.backgrounds.glass} ${theme.textColors.secondary} hover:bg-white/10`
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Active Calculator */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
      >
        <div className="flex items-center space-x-3 mb-6">
          {activeCalculator && <activeCalculator.icon className="w-6 h-6 text-blue-400" />}
          <div>
            <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
              {activeCalculator?.label}
            </h3>
            <p className={`${theme.textColors.secondary}`}>
              {activeCalculator?.description}
            </p>
          </div>
        </div>
        
        <ActiveComponent />
      </motion.div>
    </div>
  );
}
