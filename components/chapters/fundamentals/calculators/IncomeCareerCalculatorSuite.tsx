'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Target, Briefcase, Building2 } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

// Import all 4 Income & Career calculators
import SalaryNegotiationCalculator from './SalaryNegotiationCalculator';
import CareerPathOptimizer from './CareerPathOptimizer';
import SideHustleROICalculator from './SideHustleROICalculator';
import SkillInvestmentROICalculator from './SkillInvestmentROICalculator';

interface CalculatorTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  description: string;
}

const calculatorTabs: CalculatorTab[] = [
  {
    id: 'salary-negotiation',
    label: 'Salary Negotiation',
    icon: TrendingUp,
    component: SalaryNegotiationCalculator,
    description: 'Analyze salary negotiation opportunities and calculate lifetime earnings impact'
  },
  {
    id: 'career-path',
    label: 'Career Path Optimizer',
    icon: Target,
    component: CareerPathOptimizer,
    description: 'Compare career paths based on your priorities and calculate long-term ROI'
  },
  {
    id: 'side-hustle',
    label: 'Side Hustle ROI',
    icon: Briefcase,
    component: SideHustleROICalculator,
    description: 'Evaluate side hustle opportunities and analyze profitability potential'
  },
  {
    id: 'skill-investment',
    label: 'Skill Investment',
    icon: Building2,
    component: SkillInvestmentROICalculator,
    description: 'Calculate ROI on skill development and education investments'
  }
];

export default function IncomeCareerCalculatorSuite() {
  const [activeTab, setActiveTab] = useState('salary-negotiation');
  const { recordCalculatorUsage } = useProgressStore();

  // Record usage when component mounts
  useEffect(() => {
    recordCalculatorUsage('income-career-calculator-suite');
  }, [recordCalculatorUsage]);

  // Record individual calculator usage when switching tabs
  useEffect(() => {
    recordCalculatorUsage(`${activeTab}-calculator`);
  }, [activeTab, recordCalculatorUsage]);

  const activeCalculator = calculatorTabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeCalculator?.component || SalaryNegotiationCalculator;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className={`inline-flex items-center gap-3 px-6 py-3 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-full`}>
          <Calculator className="w-6 h-6 text-blue-400" />
          <h1 className={`text-2xl font-bold ${theme.textColors.primary}`}>
            Income & Career Calculator Suite
          </h1>
        </div>
        <p className={`text-lg ${theme.textColors.secondary} max-w-3xl mx-auto`}>
          Optimize your earning potential with our comprehensive career and income planning tools. 
          Analyze salary negotiations, compare career paths, evaluate side hustles, and calculate skill investment ROI.
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-2`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {calculatorTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-label={`Select ${tab.label} calculator`}
                aria-pressed={isActive}
                className={`
                  p-4 rounded-lg transition-all duration-200 text-left group
                  ${isActive
                    ? `${theme.backgrounds.primary} text-white shadow-lg`
                    : `hover:bg-white/5 ${theme.textColors.secondary}`
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                  <span className={`font-semibold ${isActive ? 'text-white' : theme.textColors.primary}`}>
                    {tab.label}
                  </span>
                </div>
                <p className={`text-sm ${isActive ? 'text-blue-100' : theme.textColors.secondary} line-clamp-2`}>
                  {tab.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Calculator Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[600px]"
      >
        <ActiveComponent />
      </motion.div>

      {/* Educational Context Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}
      >
        <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
          Income & Career Optimization Strategy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Earning Potential Maximization</h4>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Negotiate salary increases strategically based on market data</li>
              <li>• Invest in high-ROI skills that command premium salaries</li>
              <li>• Develop multiple income streams through validated side hustles</li>
              <li>• Plan career progression with long-term earning goals</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Smart Career Decisions</h4>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Compare opportunities using weighted priority scoring</li>
              <li>• Calculate lifetime value of different career paths</li>
              <li>• Balance risk tolerance with growth potential</li>
              <li>• Time investments in education and skill development</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
