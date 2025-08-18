import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { lazyLoadCalculator } from '@/lib/utils/lazyLoad';

// Lazy load calculators
const InvestmentCalculator = lazyLoadCalculator('shared/calculators/InvestmentCalculatorEnhanced');
const RetirementCalculator = lazyLoadCalculator('shared/calculators/RetirementCalculatorEnhanced');
const BudgetCalculator = lazyLoadCalculator('shared/calculators/BudgetBuilderCalculator');
const DebtCalculator = lazyLoadCalculator('shared/calculators/DebtPayoffCalculator');
const MortgageCalculator = lazyLoadCalculator('shared/calculators/MortgageCalculatorEnhanced');
const TaxCalculator = lazyLoadCalculator('shared/calculators/TaxCalculatorEnhanced');
const PortfolioAnalyzer = lazyLoadCalculator('shared/calculators/PortfolioAnalyzerCalculator');
const RealEstateCalculator = lazyLoadCalculator('shared/calculators/RealEstateComparisonTool');
const EmergencyFundCalculator = lazyLoadCalculator('shared/calculators/EmergencyFundCalculatorEnhanced');
const CreditScoreCalculator = lazyLoadCalculator('shared/calculators/CreditScoreSimulator');

// Loading states
const LoadingCalculator = () => (
  <div className="flex items-center justify-center p-8 min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Loading calculator...</p>
    </div>
  </div>
);

// Error states
const ErrorCalculator = ({ error }: { error: Error }) => (
  <div className="p-8 text-red-500 min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <h3 className="font-semibold">Error loading calculator</h3>
      <p className="text-sm">{error.message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

// Calculator configuration
interface CalculatorConfig {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType;
  category: 'basic' | 'investment' | 'property' | 'retirement' | 'debt' | 'tax';
}

const calculators: CalculatorConfig[] = [
  {
    id: 'investment',
    name: 'Investment Calculator',
    description: 'Plan your investment strategy and analyze potential returns',
    component: InvestmentCalculator,
    category: 'investment'
  },
  {
    id: 'retirement',
    name: 'Retirement Planner',
    description: 'Plan for retirement and calculate required savings',
    component: RetirementCalculator,
    category: 'retirement'
  },
  {
    id: 'budget',
    name: 'Budget Builder',
    description: 'Create and optimize your budget',
    component: BudgetCalculator,
    category: 'basic'
  },
  {
    id: 'debt',
    name: 'Debt Payoff',
    description: 'Create a debt payoff strategy',
    component: DebtCalculator,
    category: 'debt'
  },
  {
    id: 'mortgage',
    name: 'Mortgage Calculator',
    description: 'Calculate mortgage payments and analyze options',
    component: MortgageCalculator,
    category: 'property'
  },
  {
    id: 'tax',
    name: 'Tax Calculator',
    description: 'Estimate taxes and plan deductions',
    component: TaxCalculator,
    category: 'tax'
  },
  {
    id: 'portfolio',
    name: 'Portfolio Analyzer',
    description: 'Analyze and optimize your investment portfolio',
    component: PortfolioAnalyzer,
    category: 'investment'
  },
  {
    id: 'real-estate',
    name: 'Real Estate Comparison',
    description: 'Compare real estate investment opportunities',
    component: RealEstateCalculator,
    category: 'property'
  },
  {
    id: 'emergency-fund',
    name: 'Emergency Fund',
    description: 'Calculate and plan your emergency fund',
    component: EmergencyFundCalculator,
    category: 'basic'
  },
  {
    id: 'credit-score',
    name: 'Credit Score Simulator',
    description: 'Simulate and improve your credit score',
    component: CreditScoreCalculator,
    category: 'debt'
  }
];

export default function CalculatorSuite() {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('all');
  const recordCalculatorUsage = useProgressStore(state => state.recordCalculatorUsage);

  useEffect(() => {
    if (activeCalculator) {
      recordCalculatorUsage(activeCalculator);
    }
  }, [activeCalculator, recordCalculatorUsage]);

  const filteredCalculators = calculators.filter(calc => 
    category === 'all' || calc.category === category
  );

  const ActiveCalculatorComponent = activeCalculator
    ? calculators.find(c => c.id === activeCalculator)?.component
    : null;

  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setCategory('all')}
          className={`px-4 py-2 rounded-md transition-colors ${
            category === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          All
        </button>
        {['basic', 'investment', 'property', 'retirement', 'debt', 'tax'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-md transition-colors ${
              category === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Calculator grid or active calculator */}
      {activeCalculator ? (
        <div className="space-y-4">
          <button
            onClick={() => setActiveCalculator(null)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to all calculators
          </button>
          <div className="border rounded-lg overflow-hidden">
            <Suspense fallback={<LoadingCalculator />}>
              {ActiveCalculatorComponent && <ActiveCalculatorComponent />}
            </Suspense>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCalculators.map(calc => (
            <motion.div
              key={calc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
              onClick={() => setActiveCalculator(calc.id)}
            >
              <h3 className="font-semibold">{calc.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{calc.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

