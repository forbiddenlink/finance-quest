'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import AlternativeInvestmentsLesson from '@/components/chapters/fundamentals/lessons/AlternativeInvestmentsLesson';
import AlternativeInvestmentsQuiz from '@/components/chapters/fundamentals/quizzes/AlternativeInvestmentsQuiz';
import REITInvestmentAnalyzer from '@/components/shared/calculators/REITInvestmentAnalyzer';
import CommodityPortfolioBuilder from '@/components/shared/calculators/CommodityPortfolioBuilder';
import CryptocurrencyAllocationCalculator from '@/components/shared/calculators/CryptocurrencyAllocationCalculator';
import PortfolioAnalyzerCalculator from '@/components/shared/calculators/PortfolioAnalyzerCalculator';
import { Building, Calculator, Package, Bitcoin, PieChart } from 'lucide-react';

export default function Chapter15Page() {
  const calculatorTabs = [
    {
      id: 'reit',
      label: 'REIT Analysis',
      icon: Building,
      component: REITInvestmentAnalyzer,
      description: 'Analyze Real Estate Investment Trust performance and yields'
    },
    {
      id: 'commodity',
      label: 'Commodities',
      icon: Package,
      component: CommodityPortfolioBuilder,
      description: 'Evaluate commodity investment strategies and correlations'
    },
    {
      id: 'crypto',
      label: 'Cryptocurrency',
      icon: Bitcoin,
      component: CryptocurrencyAllocationCalculator,
      description: 'Calculate crypto portfolio allocation and risk metrics'
    },
    {
      id: 'optimizer',
      label: 'Portfolio Optimizer',
      icon: PieChart,
      component: PortfolioAnalyzerCalculator,
      description: 'Optimize portfolio allocation with alternative investments'
    }
  ];

  return (
    <ChapterLayout
      chapterNumber={15}
      title="Alternative Investments"
      subtitle="Explore REITs, commodities, cryptocurrency, and other alternative assets for portfolio diversification"
      icon={Calculator}
      iconColor="text-purple-500"
      lessonComponent={<AlternativeInvestmentsLesson />}
      calculatorComponent={<REITInvestmentAnalyzer />}
      quizComponent={<AlternativeInvestmentsQuiz />}
      calculatorTabs={calculatorTabs}
    />
  );
}
