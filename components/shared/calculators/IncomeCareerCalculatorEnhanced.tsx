'use client';

import React, { useState } from 'react';
import { TrendingUp, Calculator as CalcIcon, BookOpen, Target } from 'lucide-react';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import CareerValueCalculator from '@/components/chapters/fundamentals/calculators/CareerValueCalculator';
import SkillInvestmentROICalculator from '@/components/chapters/fundamentals/calculators/SkillInvestmentROICalculator';

// Import the original salary negotiation calculator
import SalaryNegotiationCalculator from '@/components/chapters/fundamentals/calculators/SalaryNegotiationCalculator';

type CalculatorView = 'overview' | 'negotiation' | 'career-value' | 'skill-roi';

export default function IncomeCareerCalculatorEnhanced() {
  const [activeView, setActiveView] = useState<CalculatorView>('overview');

  const calculatorViews = [
    {
      id: 'overview' as const,
      name: 'Overview',
      icon: TrendingUp,
      description: 'Career optimization strategies and key concepts'
    },
    {
      id: 'negotiation' as const,
      name: 'Salary Negotiation',
      icon: Target,
      description: 'Calculate the lifetime impact of salary negotiations'
    },
    {
      id: 'career-value' as const,
      name: 'Career Value',
      icon: CalcIcon,
      description: 'Compare total compensation packages and career paths'
    },
    {
      id: 'skill-roi' as const,
      name: 'Skill Investment',
      icon: BookOpen,
      description: 'Calculate ROI on skills, certifications, and education'
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'negotiation':
        return <SalaryNegotiationCalculator />;
      case 'career-value':
        return <CareerValueCalculator />;
      case 'skill-roi':
        return <SkillInvestmentROICalculator />;
      default:
        return <IncomeCareerOverview />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2 p-4 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-lg"
      >
        {calculatorViews.map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                activeView === view.id
                  ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300 border'
                  : 'bg-slate-800/50 border-white/10 text-gray-300 hover:bg-slate-700/50 border'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{view.name}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Description */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}
      >
        <p className={theme.textColors.secondary}>
          {calculatorViews.find(v => v.id === activeView)?.description}
        </p>
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
}

// Overview component showing key concepts
function IncomeCareerOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4 flex items-center justify-center gap-3`}>
          <TrendingUp className="w-8 h-8 text-yellow-400" />
          Income & Career Optimization Suite
        </h2>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Comprehensive tools to maximize your earning potential through strategic negotiations, career planning, and skill investments
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 text-center`}
        >
          <div className="text-3xl font-bold text-yellow-400 mb-2">$1M+</div>
          <p className={theme.textColors.secondary}>
            Lifetime value of a single 10% salary increase at age 25
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 text-center`}
        >
          <div className="text-3xl font-bold text-green-400 mb-2">70%</div>
          <p className={theme.textColors.secondary}>
            Of people who negotiate salary receive some increase
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 text-center`}
        >
          <div className="text-3xl font-bold text-blue-400 mb-2">5-15%</div>
          <p className={theme.textColors.secondary}>
            Typical salary increase from successful negotiations
          </p>
        </motion.div>
      </div>

      {/* Income Optimization Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
        >
          <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4`}>
            Total Compensation Elements
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={theme.textColors.secondary}>Base Salary</span>
              <span className={`${theme.textColors.primary} font-medium`}>60-80% of total value</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={theme.textColors.secondary}>Health Benefits</span>
              <span className={`${theme.textColors.primary} font-medium`}>$8K-15K annually</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={theme.textColors.secondary}>401k Matching</span>
              <span className={`${theme.textColors.primary} font-medium`}>3-6% of salary</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={theme.textColors.secondary}>Paid Time Off</span>
              <span className={`${theme.textColors.primary} font-medium`}>15-25 days value</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={theme.textColors.secondary}>Professional Development</span>
              <span className={`${theme.textColors.primary} font-medium`}>$2K-5K annually</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={theme.textColors.secondary}>Stock Options/Equity</span>
              <span className={`${theme.textColors.primary} font-medium`}>Variable potential</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
        >
          <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4`}>
            Career Growth Strategies
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-400">1. Market Research</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Know your worth through salary surveys, Glassdoor, and industry reports
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-400">2. Skill Development</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Invest in high-ROI skills that directly impact your earning potential
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-400">3. Strategic Job Changes</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Job changes typically yield 10-25% increases vs 2-5% annual raises
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-400">4. Value Documentation</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Track and quantify your contributions for performance reviews
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* High-ROI Career Investments */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
      >
        <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6`}>
          High-ROI Career Investments by Industry
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-400">Technology</h4>
            <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
              <li>• Cloud Certifications (AWS, Azure): 15-25% increase</li>
              <li>• Programming Languages: 10-20% increase</li>
              <li>• DevOps/Security Skills: 20-30% increase</li>
              <li>• AI/ML Specialization: 25-40% increase</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-green-400">Business/Finance</h4>
            <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
              <li>• MBA: 30-50% increase</li>
              <li>• CPA/CFA: 15-30% increase</li>
              <li>• Data Analysis Skills: 10-20% increase</li>
              <li>• Project Management (PMP): 10-15% increase</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-purple-400">General Skills</h4>
            <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
              <li>• Leadership Development: 15-25% increase</li>
              <li>• Communication Skills: 10-15% increase</li>
              <li>• Industry Certifications: 5-15% increase</li>
              <li>• Negotiation Training: 5-10% increase</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`${theme.backgrounds.glass} border-2 border-yellow-500/30 rounded-lg p-8 text-center`}
      >
        <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-4`}>
          Ready to Optimize Your Career?
        </h3>
        <p className={`${theme.textColors.secondary} mb-6 max-w-2xl mx-auto`}>
          Use our comprehensive tools to analyze your current position, plan strategic moves, 
          and calculate the ROI of career investments to maximize your lifetime earnings.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <div className={`px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <span className={`text-sm ${theme.textColors.secondary}`}>💼 Salary Negotiation</span>
          </div>
          <div className={`px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <span className={`text-sm ${theme.textColors.secondary}`}>📊 Career Value Analysis</span>
          </div>
          <div className={`px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <span className={`text-sm ${theme.textColors.secondary}`}>🎓 Skill Investment ROI</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
