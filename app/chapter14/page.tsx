'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import BondFixedIncomeLessonEnhanced from '@/components/chapters/fundamentals/lessons/BondFixedIncomeLessonEnhanced';
import AdvancedBondPricingCalculator from '@/components/shared/calculators/AdvancedBondPricingCalculator';
import YieldCurveAnalyzer from '@/components/shared/calculators/YieldCurveAnalyzer';
import BondLadderBuilder from '@/components/shared/calculators/BondLadderBuilder';
import FixedIncomePortfolioOptimizer from '@/components/shared/calculators/FixedIncomePortfolioOptimizer';
import BondFixedIncomeQuizEnhanced from '@/components/chapters/fundamentals/quizzes/BondFixedIncomeQuizEnhanced';
import { DollarSign, Calculator, TrendingUp, Layers, PieChart } from 'lucide-react';

export default function Chapter14Page() {
    const calculatorTabs = [
        {
            id: 'bond-pricing',
            label: 'Bond Pricing',
            icon: Calculator,
            component: AdvancedBondPricingCalculator,
            description: 'Advanced bond valuation, yield calculations, duration and convexity analysis'
        },
        {
            id: 'yield-curve',
            label: 'Yield Curve',
            icon: TrendingUp,
            component: YieldCurveAnalyzer,
            description: 'Analyze interest rate environments and economic implications'
        },
        {
            id: 'bond-ladder',
            label: 'Bond Ladder',
            icon: Layers,
            component: BondLadderBuilder,
            description: 'Build strategic bond ladders for steady income and risk management'
        },
        {
            id: 'portfolio-optimizer',
            label: 'Portfolio Optimizer',
            icon: PieChart,
            component: FixedIncomePortfolioOptimizer,
            description: 'Optimize fixed income allocation for risk, return, and income objectives'
        }
    ];

    return (
        <ChapterLayout
            chapterNumber={14}
            title="Bonds & Fixed Income Mastery"
            subtitle="Master bond investing, fixed income strategies, and portfolio diversification."
            icon={DollarSign}
            iconColor="text-amber-500"
            lessonComponent={<BondFixedIncomeLessonEnhanced />}
            calculatorComponent={<AdvancedBondPricingCalculator />}
            calculatorTabs={calculatorTabs}
            quizComponent={<BondFixedIncomeQuizEnhanced />}
            calculatorTitle="Bond & Fixed Income Calculators"
            calculatorDescription="Professional bond analysis and portfolio optimization tools"
            quizTitle="Bond & Fixed Income Quiz"
            quizDescription="Complete your financial education journey! Test your bond knowledge to graduate."
        />
    );
}
