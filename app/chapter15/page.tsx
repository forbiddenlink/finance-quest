'use client';

import React from 'react';
import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import { LineChart, Calculator, TrendingUp, FileText } from 'lucide-react';
import CreditScoreSimulator from '@/components/chapters/fundamentals/calculators/CreditScoreSimulator';
import CreditReportAnalyzer from '@/components/chapters/fundamentals/calculators/CreditReportAnalyzer';
import CreditScoreOptimizer from '@/components/chapters/fundamentals/calculators/CreditScoreOptimizer';
import CreditMonitoringTool from '@/components/chapters/fundamentals/calculators/CreditMonitoringTool';
import CreditScoresLessonEnhanced from '@/components/chapters/fundamentals/lessons/CreditScoresLessonEnhanced';
import CreditScoresQuizEnhanced from '@/components/chapters/fundamentals/quizzes/CreditScoresQuizEnhanced';

const calculatorTabs = [
  {
    id: 'credit-score-simulator',
    label: 'Score Simulator',
    icon: Calculator,
    component: CreditScoreSimulator,
    description: 'Simulate how different actions affect your credit score'
  },
  {
    id: 'credit-report-analyzer',
    label: 'Report Analyzer',
    icon: FileText,
    component: CreditReportAnalyzer,
    description: 'Analyze your credit report and identify improvement areas'
  },
  {
    id: 'credit-score-optimizer',
    label: 'Score Optimizer',
    icon: TrendingUp,
    component: CreditScoreOptimizer,
    description: 'Get personalized recommendations to optimize your credit score'
  },
  {
    id: 'credit-monitoring',
    label: 'Credit Monitoring',
    icon: LineChart,
    component: CreditMonitoringTool,
    description: 'Track your credit score progress and set alerts'
  }
];

export default function Chapter15Page() {
  return (
    <ChapterLayout
      chapterNumber={15}
      title="Credit Scores & Reports"
      subtitle="Master your credit score and understand credit reporting to unlock better financial opportunities"
      icon={LineChart}
      iconColor="text-purple-400"
      lessonComponent={<CreditScoresLessonEnhanced />}
      calculatorComponent={<CreditScoreSimulator />}
      quizComponent={<CreditScoresQuizEnhanced />}
      calculatorTitle="Credit Score Suite"
      calculatorDescription="Comprehensive tools for credit score simulation, report analysis, score optimization, and monitoring"
      quizTitle="Credit Scores & Reports Quiz"
      quizDescription="Test your understanding of credit scores and reports! You need 80% to unlock Chapter 16."
      calculatorTabs={calculatorTabs}
    />
  );
}