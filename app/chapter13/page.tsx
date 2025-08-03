'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import StockMarketMasteryLessonEnhanced from '@/components/chapters/fundamentals/lessons/StockMarketMasteryLessonEnhanced';
import StockAnalysisCalculator from '@/components/shared/calculators/StockAnalysisCalculator';
import StockMarketMasteryQuizEnhanced from '@/components/chapters/fundamentals/quizzes/StockMarketMasteryQuizEnhanced';
import { TrendingUp } from 'lucide-react';

export default function Chapter13Page() {
    return (
        <ChapterLayout
            chapterNumber={13}
            title="Stock Market Mastery & Advanced Trading"
            subtitle="Master advanced stock analysis, trading strategies, and market dynamics."
            icon={TrendingUp}
            iconColor="text-purple-500"
            lessonComponent={<StockMarketMasteryLessonEnhanced />}
            calculatorComponent={<StockAnalysisCalculator />}
            quizComponent={<StockMarketMasteryQuizEnhanced />}
            calculatorTitle="Stock Analysis Calculator"
            calculatorDescription="Analyze stock valuations, price targets, and risk metrics"
            quizTitle="Stock Market Mastery Quiz"
            quizDescription="Test your advanced stock market knowledge! You need 80% to unlock Chapter 14."
        />
    );
}
