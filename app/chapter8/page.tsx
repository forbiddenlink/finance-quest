'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import PortfolioConstructionLessonEnhanced from '@/components/chapters/fundamentals/lessons/PortfolioConstructionLessonEnhanced';
import PortfolioAnalyzerCalculator from '@/components/shared/calculators/PortfolioAnalyzerCalculator';
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
            calculatorComponent={<PortfolioAnalyzerCalculator />}
            quizComponent={<PortfolioConstructionQuizEnhanced />}
            calculatorTitle="Portfolio Analyzer"
            calculatorDescription="Analyze portfolio allocation, risk metrics, and diversification strategies"
            quizTitle="Portfolio Construction Quiz"
            quizDescription="Test your knowledge of asset allocation and portfolio theory. You need 80% to unlock Chapter 9."
        />
    );
}
