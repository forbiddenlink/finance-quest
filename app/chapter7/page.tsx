'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import InvestmentFundamentalsLessonEnhanced from '@/components/chapters/fundamentals/lessons/InvestmentFundamentalsLessonEnhanced';
import InvestmentCalculatorEnhanced from '@/components/shared/calculators/InvestmentCalculatorEnhanced';
import InvestmentFundamentalsQuizEnhanced from '@/components/chapters/fundamentals/quizzes/InvestmentFundamentalsQuizEnhanced';
import { TrendingUp } from 'lucide-react';

export default function Chapter7Page() {
    return (
        <ChapterLayout
            chapterNumber={7}
            title="Investment Fundamentals"
            subtitle="Learn the fundamentals of investing, asset allocation, and building long-term wealth through smart investment strategies."
            icon={TrendingUp}
            iconColor="text-blue-400"
            lessonComponent={<InvestmentFundamentalsLessonEnhanced />}
            calculatorComponent={<InvestmentCalculatorEnhanced />}
            quizComponent={<InvestmentFundamentalsQuizEnhanced />}
            calculatorTitle="Investment Suite"
            calculatorDescription="Comprehensive investment tools for risk assessment, portfolio optimization, and growth projection"
            quizTitle="Investment Fundamentals Quiz"
            quizDescription="Test your knowledge of investment basics, asset allocation, and portfolio construction. You need 80% to unlock Chapter 8."
        />
    );
}
