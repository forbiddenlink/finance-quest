'use client';

import React, { useState, useEffect } from 'react';
import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import { useProgressStore } from '@/lib/store/progressStore';
import { PiggyBank, Target, TrendingUp, Calculator, CheckCircle, Clock, BookOpen, Brain, DollarSign, Calendar, Heart, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import RetirementPlannerCalculator from '@/components/shared/calculators/RetirementPlannerCalculator';
import RetirementAccountOptimizer from '@/components/chapters/fundamentals/calculators/RetirementAccountOptimizer';
import WithdrawalStrategyPlanner from '@/components/chapters/fundamentals/calculators/WithdrawalStrategyPlanner';
import LongevityRiskAnalyzer from '@/components/chapters/fundamentals/calculators/LongevityRiskAnalyzer';
import RetirementPlanningLessonEnhanced from '@/components/chapters/fundamentals/lessons/RetirementPlanningLessonEnhanced';
import RetirementPlanningQuizEnhanced from '@/components/chapters/fundamentals/quizzes/RetirementPlanningQuizEnhanced';

const calculatorTabs = [
  {
    id: 'retirement-planner',
    label: 'Retirement Planner',
    icon: PiggyBank,
    component: RetirementPlannerCalculator,
    description: 'Calculate savings goals and track retirement progress'
  },
  {
    id: 'account-optimizer',
    label: 'Account Optimizer',
    icon: Target,
    component: RetirementAccountOptimizer,
    description: 'Optimize 401(k), IRA, and Roth contributions for tax efficiency'
  },
  {
    id: 'withdrawal-strategy',
    label: 'Withdrawal Strategies',
    icon: TrendingUp,
    component: WithdrawalStrategyPlanner,
    description: 'Plan withdrawal strategies to maximize portfolio longevity'
  },
  {
    id: 'longevity-risk',
    label: 'Longevity Analysis',
    icon: Heart,
    component: LongevityRiskAnalyzer,
    description: 'Analyze longevity risk and plan for extended lifespans'
  }
];

export default function Chapter9Page() {
  return (
    <ChapterLayout
      chapterNumber={9}
      title="Retirement Planning & Long-Term Wealth"
      subtitle="Master retirement planning strategies, calculate savings goals, and optimize tax-advantaged accounts."
      icon={PiggyBank}
      iconColor="text-orange-400"
      lessonComponent={<RetirementPlanningLessonEnhanced />}
      calculatorComponent={<RetirementPlannerCalculator />}
      quizComponent={<RetirementPlanningQuizEnhanced />}
      calculatorTitle="Retirement Planning Suite"
      calculatorDescription="Comprehensive retirement planning tools including goal calculation, account optimization, withdrawal strategies, and longevity analysis"
      quizTitle="Retirement Planning Quiz"
      quizDescription="Test your retirement planning knowledge! You need 80% to unlock Chapter 10."
      calculatorTabs={calculatorTabs}
    />
  );
}
