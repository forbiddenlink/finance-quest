'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import CreditDebtLessonEnhanced from '@/components/chapters/fundamentals/lessons/CreditDebtLessonEnhanced';
import DebtPayoffCalculator from '@/components/shared/calculators/DebtPayoffCalculator';
import CreditDebtQuizEnhanced from '@/components/chapters/fundamentals/quizzes/CreditDebtQuizEnhanced';
import { CreditCard } from 'lucide-react';

export default function Chapter6Page() {
    return (
        <ChapterLayout
            chapterNumber={6}
            title="Credit & Debt Management"
            subtitle="Master credit building, debt optimization, and financial leverage strategies."
            icon={CreditCard}
            iconColor="text-red-400"
            lessonComponent={<CreditDebtLessonEnhanced />}
            calculatorComponent={<DebtPayoffCalculator />}
            quizComponent={<CreditDebtQuizEnhanced />}
            calculatorTitle="Debt Payoff Calculator"
            calculatorDescription="Calculate optimal debt repayment strategies and save thousands in interest"
            quizTitle="Credit & Debt Quiz"
            quizDescription="Test your credit knowledge! You need 80% to unlock Chapter 7."
        />
    );
}

