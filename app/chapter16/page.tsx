'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import BusinessFinanceLessonEnhanced from '@/components/chapters/fundamentals/lessons/BusinessFinanceLessonEnhanced';
import BusinessFinanceQuizEnhanced from '@/components/chapters/fundamentals/quizzes/BusinessFinanceQuizEnhanced';
import BusinessCashFlowAnalyzer from '@/components/shared/calculators/BusinessCashFlowAnalyzer';
import CompoundInterestCalculator from '@/components/shared/calculators/CompoundInterestCalculator';
import RewardsOptimizerCalculator from '@/components/shared/calculators/RewardsOptimizerCalculator';
import DebtPayoffCalculator from '@/components/shared/calculators/DebtPayoffCalculator';
import { Building2, DollarSign, TrendingUp, Target, Calculator } from 'lucide-react';

export default function Chapter16Page() {
  const calculatorTabs = [
    {
      id: 'cash-flow',
      label: 'Cash Flow',
      icon: DollarSign,
      component: BusinessCashFlowAnalyzer,
      description: 'Analyze business cash flow patterns and projections'
    },
    {
      id: 'growth',
      label: 'Growth Analysis',
      icon: TrendingUp,
      component: CompoundInterestCalculator,
      description: 'Calculate compound growth and investment returns'
    },
    {
      id: 'rewards',
      label: 'Business Rewards',
      icon: Target,
      component: RewardsOptimizerCalculator,
      description: 'Optimize business credit card rewards and cash back'
    },
    {
      id: 'debt',
      label: 'Debt Management',
      icon: Calculator,
      component: DebtPayoffCalculator,
      description: 'Manage business debt and loan payoff strategies'
    }
  ];

  return (
    <ChapterLayout
      chapterNumber={16}
      title="Business & Entrepreneurship Finance"
      subtitle="Master the financial fundamentals for starting, running, and scaling successful businesses"
      icon={Building2}
      iconColor="text-blue-500"
      lessonComponent={<BusinessFinanceLessonEnhanced />}
      calculatorComponent={<BusinessCashFlowAnalyzer />}
      quizComponent={<BusinessFinanceQuizEnhanced />}
      calculatorTabs={calculatorTabs}
    />
  );
}
