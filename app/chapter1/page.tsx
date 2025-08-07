'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import MoneyFundamentalsLessonEnhanced from '@/components/chapters/fundamentals/lessons/MoneyFundamentalsLessonEnhanced';
import MoneyMindsetCalculatorSuite from '@/components/chapters/fundamentals/calculators/MoneyMindsetCalculatorSuite';
import MoneyFundamentalsQuizEnhanced from '@/components/chapters/fundamentals/quizzes/MoneyFundamentalsQuizEnhanced';
import { Brain } from 'lucide-react';

export default function Chapter1Page() {
    return (
        <ChapterLayout
            chapterNumber={1}
            title="Money Psychology & Mindset"
            subtitle="Build a healthy relationship with money and develop the psychological foundation for financial success."
            icon={Brain}
            iconColor="text-blue-400"
            lessonComponent={<MoneyFundamentalsLessonEnhanced />}
            calculatorComponent={<MoneyMindsetCalculatorSuite />}
            quizComponent={<MoneyFundamentalsQuizEnhanced />}
            calculatorTitle="Money Mindset Calculator Suite"
            calculatorDescription="Complete toolkit for paycheck analysis, personality assessment, goal prioritization, and spending mindset analysis"
            quizTitle="Money Psychology Quiz"
            quizDescription="Test your understanding of financial psychology and money mindset"
            requiresPreviousChapters={false}
        />
    );
}
