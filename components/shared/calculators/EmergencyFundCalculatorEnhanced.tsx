'use client';

import React, { useState, useEffect } from 'react';
import { Shield, BarChart3, Calendar, Calculator as CalcIcon } from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { motion } from 'framer-motion';
import EmergencyFundScenarioAnalyzer from '@/components/chapters/fundamentals/calculators/EmergencyFundScenarioAnalyzer';
import EmergencyFundBuildingTimeline from '@/components/chapters/fundamentals/calculators/EmergencyFundBuildingTimeline';

// Import the original calculator component
import OriginalEmergencyFundCalculator from '@/app/calculators/emergency-fund/page';

type CalculatorView = 'overview' | 'scenario' | 'timeline' | 'calculator';

export default function EmergencyFundCalculatorEnhanced() {
  const [activeView, setActiveView] = useState<CalculatorView>('overview');
  const recordCalculatorUsage = useProgressStore((state) => state.recordCalculatorUsage);

  useEffect(() => {
    recordCalculatorUsage('emergency-fund-calculator-enhanced');
  }, [recordCalculatorUsage]);

  const calculatorViews = [
    {
      id: 'overview' as const,
      name: 'Overview',
      icon: Shield,
      description: 'Traditional emergency fund calculator with expense tracking'
    },
    {
      id: 'scenario' as const,
      name: 'Risk Analysis',
      icon: BarChart3,
      description: 'Analyze your personal risk factors and determine optimal fund size'
    },
    {
      id: 'timeline' as const,
      name: 'Building Plan',
      icon: Calendar,
      description: 'Create a personalized roadmap to build your emergency fund'
    },
    {
      id: 'calculator' as const,
      name: 'Full Calculator',
      icon: CalcIcon,
      description: 'Complete emergency fund calculator with charts and insights'
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'scenario':
        return <EmergencyFundScenarioAnalyzer />;
      case 'timeline':
        return <EmergencyFundBuildingTimeline />;
      case 'calculator':
        return <OriginalEmergencyFundCalculator />;
      default:
        return <EmergencyFundOverview />;
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
                  ? 'bg-amber-500/20 border-amber-500/30 text-amber-300 border'
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
function EmergencyFundOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4 flex items-center justify-center gap-3`}>
          <Shield className="w-8 h-8 text-amber-400" />
          Emergency Fund Calculator Suite
        </h2>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Comprehensive tools to analyze, plan, and build your perfect emergency fund based on your unique situation
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 text-center`}
        >
          <div className="text-3xl font-bold text-red-400 mb-2">40%</div>
          <p className={theme.textColors.secondary}>
            of Americans can&apos;t cover a $400 emergency expense
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 text-center`}
        >
          <div className="text-3xl font-bold text-amber-400 mb-2">3-6</div>
          <p className={theme.textColors.secondary}>
            months of expenses is the standard recommendation
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 text-center`}
        >
          <div className="text-3xl font-bold text-green-400 mb-2">4%+</div>
          <p className={theme.textColors.secondary}>
            APY available in high-yield savings accounts
          </p>
        </motion.div>
      </div>

      {/* Emergency Fund Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
        >
          <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4`}>
            Emergency Fund Levels
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                <span className="text-red-400 font-bold">$0</span>
              </div>
              <div>
                <div className={`font-medium ${theme.textColors.primary}`}>Crisis Mode</div>
                <div className={`text-sm ${theme.textColors.secondary}`}>Any emergency becomes debt</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center justify-center">
                <span className="text-yellow-400 font-bold">$1K</span>
              </div>
              <div>
                <div className={`font-medium ${theme.textColors.primary}`}>Starter Fund</div>
                <div className={`text-sm ${theme.textColors.secondary}`}>Covers small emergencies</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 font-bold">3M</span>
              </div>
              <div>
                <div className={`font-medium ${theme.textColors.primary}`}>Basic Security</div>
                <div className={`text-sm ${theme.textColors.secondary}`}>3 months of expenses</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                <span className="text-green-400 font-bold">6M</span>
              </div>
              <div>
                <div className={`font-medium ${theme.textColors.primary}`}>Full Protection</div>
                <div className={`text-sm ${theme.textColors.secondary}`}>6 months of expenses</div>
              </div>
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
            Building Strategy
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-amber-400">Phase 1: Foundation</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Save $1,000 first for immediate emergencies while paying down high-interest debt
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-amber-400">Phase 2: Core Fund</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Build to 3 months of essential expenses for job loss protection
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-amber-400">Phase 3: Full Security</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Extend to 6+ months based on your risk factors and situation
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-amber-400">Phase 4: Optimization</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Use high-yield accounts and laddered CDs for maximum growth
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`${theme.backgrounds.glass} border-2 border-amber-500/30 rounded-lg p-8 text-center`}
      >
        <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-4`}>
          Ready to Build Your Emergency Fund?
        </h3>
        <p className={`${theme.textColors.secondary} mb-6 max-w-2xl mx-auto`}>
          Use our comprehensive tools to analyze your personal risk factors, determine your optimal fund size, 
          and create a realistic building timeline that fits your budget and goals.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <div className={`px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <span className={`text-sm ${theme.textColors.secondary}`}>📊 Risk Analysis</span>
          </div>
          <div className={`px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <span className={`text-sm ${theme.textColors.secondary}`}>📅 Building Timeline</span>
          </div>
          <div className={`px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <span className={`text-sm ${theme.textColors.secondary}`}>🧮 Complete Calculator</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
