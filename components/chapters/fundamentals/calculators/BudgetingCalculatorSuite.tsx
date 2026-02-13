'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { 
  Calculator, 
  PieChart,
  Zap,
  Activity,
  Target
} from 'lucide-react';

// Import the new calculators
import BudgetBuilderCalculator from '@/components/shared/calculators/BudgetBuilderCalculator';
import BudgetOptimizerCalculator from '@/components/chapters/fundamentals/calculators/BudgetOptimizerCalculator';
import CashFlowTrackerCalculator from '@/components/chapters/fundamentals/calculators/CashFlowTrackerCalculator';
import SavingsGoalPlannerCalculator from '@/components/chapters/fundamentals/calculators/SavingsGoalPlannerCalculator';

type CalculatorType = 'budget-builder' | 'budget-optimizer' | 'cash-flow-tracker' | 'savings-goal-planner';

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
    id: 'budget-builder',
    name: 'Budget Builder',
    description: 'Create and analyze your complete budget with 50/30/20 rule guidance',
    icon: PieChart,
    color: 'text-blue-400',
    component: <BudgetBuilderCalculator />
  },
  {
    id: 'budget-optimizer',
    name: 'Budget Optimizer',
    description: 'Optimize your spending allocation and maximize savings potential',
    icon: Zap,
    color: 'text-green-400',
    component: <BudgetOptimizerCalculator />
  },
  {
    id: 'cash-flow-tracker',
    name: 'Cash Flow Tracker',
    description: 'Track income and expenses with future projection analysis',
    icon: Activity,
    color: 'text-purple-400',
    component: <CashFlowTrackerCalculator />
  },
  {
    id: 'savings-goal-planner',
    name: 'Savings Goal Planner',
    description: 'Set financial goals and optimize allocation strategy',
    icon: Target,
    color: 'text-orange-400',
    component: <SavingsGoalPlannerCalculator />
  }
];

export default function BudgetingCalculatorSuite() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('budget-builder');

  const activeCalc = calculators.find(calc => calc.id === activeCalculator);

  return (
    <div className={`min-h-screen ${theme.backgrounds.primary}`}>
      {/* Calculator Tabs */}
      <div className="sticky top-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6 overflow-x-auto">
            <div className="flex items-center gap-2 text-white/70 font-medium whitespace-nowrap">
              <Calculator className="w-5 h-5" />
              Budgeting Suite:
            </div>
            <div className="flex gap-2">
              {calculators.map((calculator) => {
                const Icon = calculator.icon;
                const isActive = activeCalculator === calculator.id;
                
                return (
                  <motion.button
                    key={calculator.id}
                    onClick={() => setActiveCalculator(calculator.id)}
                    aria-label={`Select ${calculator.name} calculator`}
                    aria-pressed={isActive}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? calculator.color : ''}`} />
                    {calculator.name}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Description */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <motion.div
          key={activeCalculator}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 mb-6`}
        >
          <div className="flex items-center gap-3 mb-2">
            {activeCalc && <activeCalc.icon className={`w-6 h-6 ${activeCalc.color}`} />}
            <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>
              {activeCalc?.name}
            </h2>
          </div>
          <p className={`${theme.textColors.secondary} text-lg`}>
            {activeCalc?.description}
          </p>
        </motion.div>
      </div>

      {/* Active Calculator */}
      <motion.div
        key={activeCalculator}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeCalc?.component}
      </motion.div>
    </div>
  );
}
