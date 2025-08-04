'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import StockMarketMasteryLessonEnhanced from '@/components/chapters/fundamentals/lessons/StockMarketMasteryLessonEnhanced';
import StockMarketMasteryQuizEnhanced from '@/components/chapters/fundamentals/quizzes/StockMarketMasteryQuizEnhanced';
import StockValuationCalculator from '@/components/chapters/fundamentals/calculators/StockValuationCalculator';
import OptionsStrategyCalculator from '@/components/chapters/fundamentals/calculators/OptionsStrategyCalculator';
import PortfolioRiskAnalyzer from '@/components/chapters/fundamentals/calculators/PortfolioRiskAnalyzer';
import TechnicalAnalysisTool from '@/components/chapters/fundamentals/calculators/TechnicalAnalysisTool';
import { TrendingUp } from 'lucide-react';

export default function Chapter13Page() {
    const calculatorTabs = [
        {
            id: 'stock-valuation',
            label: 'Stock Valuation',
            icon: TrendingUp,
            component: StockValuationCalculator,
            description: 'DCF, P/E analysis, and intrinsic value calculations'
        },
        {
            id: 'options-strategy',
            label: 'Options Strategy',
            icon: TrendingUp,
            component: OptionsStrategyCalculator,
            description: 'Black-Scholes pricing and options strategy analysis'
        },
        {
            id: 'portfolio-risk',
            label: 'Portfolio Risk',
            icon: TrendingUp,
            component: PortfolioRiskAnalyzer,
            description: 'Portfolio optimization and risk management tools'
        },
        {
            id: 'technical-analysis',
            label: 'Technical Analysis',
            icon: TrendingUp,
            component: TechnicalAnalysisTool,
            description: 'RSI, MACD, Bollinger Bands, and trading signals'
        }
    ];

    return (
        <ChapterLayout
            chapterNumber={13}
            title="Stock Market Mastery & Advanced Trading"
            subtitle="Master advanced stock analysis, trading strategies, and market dynamics."
            icon={TrendingUp}
            iconColor="text-purple-500"
            lessonComponent={<StockMarketMasteryLessonEnhanced />}
            calculatorComponent={<StockValuationCalculator />}
            calculatorTabs={calculatorTabs}
            quizComponent={<StockMarketMasteryQuizEnhanced />}
            quizTitle="Stock Market Mastery Quiz"
            quizDescription="Test your advanced stock market knowledge! You need 80% to unlock Chapter 14."
        />
    );
}
