'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import RealEstateAlternativesLessonEnhanced from '@/components/chapters/fundamentals/lessons/RealEstateAlternativesLessonEnhanced';
import RealEstateAlternativesQuizEnhanced from '@/components/chapters/fundamentals/quizzes/RealEstateAlternativesQuizEnhanced';
import PropertyInvestmentAnalyzer from '@/components/chapters/fundamentals/calculators/PropertyInvestmentAnalyzer';
import BRRRRStrategyCalculator from '@/components/chapters/fundamentals/calculators/BRRRRStrategyCalculator';
import RentalPropertyCalculator from '@/components/chapters/fundamentals/calculators/RentalPropertyCalculator';
import RealEstateComparisonTool from '@/components/chapters/fundamentals/calculators/RealEstateComparisonTool';
import { Home, RefreshCw, Building, ArrowRightLeft } from 'lucide-react';

export default function Chapter12Page() {
    const calculatorTabs = [
        {
            id: 'property-investment',
            label: 'Property Investment Analyzer',
            icon: Home,
            component: PropertyInvestmentAnalyzer,
            description: 'Complete real estate investment analysis with cash flow, ROI, and cap rate calculations'
        },
        {
            id: 'brrrr-strategy',
            label: 'BRRRR Strategy Calculator',
            icon: RefreshCw,
            component: BRRRRStrategyCalculator,
            description: 'Buy, Rehab, Rent, Refinance, Repeat strategy analysis and capital recovery'
        },
        {
            id: 'rental-property',
            label: 'Rental Property Calculator',
            icon: Building,
            component: RentalPropertyCalculator,
            description: 'Detailed rental income and expense analysis with profitability assessment'
        },
        {
            id: 'property-comparison',
            label: 'Property Comparison Tool',
            icon: ArrowRightLeft,
            component: RealEstateComparisonTool,
            description: 'Compare multiple properties side-by-side with comprehensive scoring system'
        }
    ];

    return (
        <ChapterLayout
            chapterNumber={12}
            title="Real Estate & Property Investment"
            subtitle="Learn real estate investing, property analysis, and wealth building through real estate."
            icon={Home}
            iconColor="text-emerald-500"
            lessonComponent={<RealEstateAlternativesLessonEnhanced />}
            calculatorComponent={<></>}
            calculatorTabs={calculatorTabs}
            quizComponent={<RealEstateAlternativesQuizEnhanced />}
            calculatorTitle="Real Estate Investment Calculators"
            calculatorDescription="Professional tools for analyzing property investments, rental income, and investment strategies"
            quizTitle="Real Estate Quiz"
            quizDescription="Test your real estate investment knowledge! You need 80% to unlock Chapter 13."
        />
    );
}
