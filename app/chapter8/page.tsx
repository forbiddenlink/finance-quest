'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import PortfolioConstructionLessonEnhanced from '@/components/chapters/fundamentals/lessons/PortfolioConstructionLessonEnhanced';
import PortfolioCalculatorEnhanced from '@/components/chapters/fundamentals/calculators/PortfolioCalculatorEnhanced';
import PortfolioConstructionQuizEnhanced from '@/components/chapters/fundamentals/quizzes/PortfolioConstructionQuizEnhanced';
import { PieChart } from 'lucide-react';

export default function Chapter8Page() {
    return (
        <ChapterLayout
            chapterNumber={8}
            title="Portfolio Construction & Asset Allocation"
            subtitle="Learn how to build diversified portfolios and optimize asset allocation for your risk tolerance and goals."
            icon={PieChart}
            iconColor="text-emerald-400"
            lessonComponent={<PortfolioConstructionLessonEnhanced />}
            calculatorComponent={<PortfolioCalculatorEnhanced />}
            quizComponent={<PortfolioConstructionQuizEnhanced />}
            calculatorTitle="Portfolio Construction Suite"
            calculatorDescription="Comprehensive tools for portfolio analysis, diversification measurement, and rebalancing optimization"
            quizTitle="Portfolio Construction Quiz"
            quizDescription="Test your knowledge of asset allocation and portfolio theory. You need 80% to unlock Chapter 9."
        />
    );
}
