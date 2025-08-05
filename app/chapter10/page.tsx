'use client';

import React from 'react';
import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import TaxOptimizationLessonEnhanced from '@/components/chapters/fundamentals/lessons/TaxOptimizationLessonEnhanced';
import TaxOptimizationQuizEnhanced from '@/components/chapters/fundamentals/quizzes/TaxOptimizationQuizEnhanced';
import TaxSavingsCalculator from '@/components/chapters/fundamentals/calculators/TaxSavingsCalculator';
import DeductionOptimizer from '@/components/chapters/fundamentals/calculators/DeductionOptimizer';
import TaxLossHarvestingCalculator from '@/components/chapters/fundamentals/calculators/TaxLossHarvestingCalculator';
import RothConversionAnalyzer from '@/components/chapters/fundamentals/calculators/RothConversionAnalyzer';
import { Calculator, Receipt, TrendingDown, RefreshCw } from 'lucide-react';

export default function Chapter10() {
  const calculatorTabs = [
    {
      id: 'tax-savings',
      label: 'Tax Savings',
      icon: Calculator,
      component: TaxSavingsCalculator,
      description: 'Comprehensive tax planning with federal and state optimization strategies'
    },
    {
      id: 'deduction-optimizer',
      label: 'Deduction Optimizer',
      icon: Receipt,
      component: DeductionOptimizer,
      description: 'Compare itemized vs standard deductions and maximize your tax benefits'
    },
    {
      id: 'tax-loss-harvesting',
      label: 'Tax-Loss Harvesting',
      icon: TrendingDown,
      component: TaxLossHarvestingCalculator,
      description: 'Optimize investment losses to minimize your tax burden'
    },
    {
      id: 'roth-conversion',
      label: 'Roth Conversion',
      icon: RefreshCw,
      component: RothConversionAnalyzer,
      description: 'Analyze Roth IRA conversion strategies for long-term tax benefits'
    }
  ];

  return (
    <ChapterLayout
      chapterNumber={10}
      title="Tax Optimization & Planning"
      subtitle="Master tax strategies to maximize your wealth and minimize your burden"
      icon={Calculator}
      iconColor="text-green-400"
      lessonComponent={<TaxOptimizationLessonEnhanced />}
      calculatorComponent={<TaxSavingsCalculator />}
      quizComponent={<TaxOptimizationQuizEnhanced />}
      calculatorTitle="Tax Optimization Suite"
      calculatorDescription="Comprehensive tax planning tools including savings calculator, deduction optimizer, tax-loss harvesting, and Roth conversion analysis"
      quizTitle="Tax Planning Quiz"
      quizDescription="Test your tax optimization knowledge! You need 80% to unlock Chapter 11."
      calculatorTabs={calculatorTabs}
    />
  );
}
