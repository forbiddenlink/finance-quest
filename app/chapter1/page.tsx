'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import MoneyFundamentalsLessonEnhanced from '@/components/chapters/fundamentals/lessons/MoneyFundamentalsLessonEnhanced';
import PaycheckCalculator from '@/components/chapters/fundamentals/calculators/PaycheckCalculator';
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
            calculatorComponent={<PaycheckCalculator />}
            quizComponent={<MoneyFundamentalsQuizEnhanced />}
            calculatorTitle="Paycheck Calculator"
            calculatorDescription="Calculate your take-home pay and understand deductions"
            quizTitle="Money Psychology Quiz"
            quizDescription="Test your understanding of financial psychology and money mindset"
            requiresPreviousChapters={false}
        />
    );
}
