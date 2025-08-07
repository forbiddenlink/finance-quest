'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { 
  Calculator, 
  Shield,
  Target,
  TrendingUp,
  BarChart3
} from 'lucide-react';

// Import the individual calculators
import EmergencyFundCoreCalculator from './EmergencyFundCoreCalculator';
import EmergencyFundScenarioAnalyzer from './EmergencyFundScenarioAnalyzer';
import EmergencyFundBuildingTimeline from './EmergencyFundBuildingTimeline';
import EmergencyFundOptimizer from './EmergencyFundOptimizer';

type CalculatorType = 'core-calculator' | 'scenario-analyzer' | 'building-timeline' | 'fund-optimizer';

interface Calculator {
  id: CalculatorType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  component: React.ReactNode;
}

const calculators: Calculator[] = [
  {
    id: 'core-calculator',
    name: 'Emergency Fund Calculator',
    description: 'Calculate your ideal emergency fund size based on expenses and risk factors',
    icon: Shield,
    color: 'text-green-400',
    component: <EmergencyFundCoreCalculator />
  },
  {
    id: 'scenario-analyzer', 
    name: 'Scenario Analyzer',
    description: 'Analyze risk factors and get personalized emergency fund recommendations',
    icon: BarChart3,
    color: 'text-blue-400',
    component: <EmergencyFundScenarioAnalyzer />
  },
  {
    id: 'building-timeline',
    name: 'Building Timeline', 
    description: 'Create a step-by-step plan to build your emergency fund over time',
    icon: Target,
    color: 'text-purple-400',
    component: <EmergencyFundBuildingTimeline />
  },
  {
    id: 'fund-optimizer',
    name: 'Fund Optimizer',
    description: 'Optimize fund placement and growth strategies for maximum security and returns',
    icon: TrendingUp,
    color: 'text-yellow-400', 
    component: <EmergencyFundOptimizer />
  }
];

export default function EmergencyFundCalculatorSuite() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('core-calculator');

  const activeCalc = calculators.find(calc => calc.id === activeCalculator);

  return (
    <div className={`min-h-screen ${theme.backgrounds.primary}`}>
      {/* Calculator Tabs */}
      <div className="sticky top-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6 overflow-x-auto">
            <div className="flex items-center gap-2 text-white/70 font-medium whitespace-nowrap">
              <Calculator className="w-5 h-5" />
              Emergency Fund Suite:
            </div>
            <div className="flex gap-2">
              {calculators.map((calculator) => {
                const Icon = calculator.icon;
                const isActive = activeCalculator === calculator.id;
                
                return (
                  <button
                    key={calculator.id}
                    onClick={() => setActiveCalculator(calculator.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium 
                      transition-all duration-200 whitespace-nowrap
                      ${isActive 
                        ? 'bg-white/10 text-white border border-white/20' 
                        : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? calculator.color : ''}`} />
                    {calculator.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Header */}
      {activeCalc && (
        <div className="max-w-7xl mx-auto px-6 py-6">
          <motion.div 
            key={activeCalc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 mb-6`}
          >
            <div className="flex items-center gap-3 mb-2">
              <activeCalc.icon className={`w-6 h-6 ${activeCalc.color}`} />
              <h2 className="text-2xl font-bold text-white">{activeCalc.name}</h2>
            </div>
            <p className="text-slate-300 text-lg">{activeCalc.description}</p>
          </motion.div>
        </div>
      )}

      {/* Active Calculator Content */}
      <motion.div
        key={activeCalculator}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        data-testid={activeCalculator}
      >
        {activeCalc?.component}
      </motion.div>
    </div>
  );
}
