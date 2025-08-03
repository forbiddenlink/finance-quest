'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import BankingFundamentalsLessonEnhanced from '@/components/chapters/fundamentals/lessons/BankingFundamentalsLessonEnhanced';
import SavingsCalculator from '@/components/chapters/fundamentals/calculators/SavingsCalculator';
import BankingFundamentalsQuizEnhanced from '@/components/chapters/fundamentals/quizzes/BankingFundamentalsQuizEnhanced';
import { Building2 } from 'lucide-react';

export default function Chapter2Page() {
    return (
        <ChapterLayout
            chapterNumber={2}
            title="Banking & Account Fundamentals"
            subtitle="Master the banking strategies that save $300-500 annually and build your financial foundation."
            icon={Building2}
            iconColor="text-green-400"
            lessonComponent={<BankingFundamentalsLessonEnhanced />}
            calculatorComponent={<SavingsCalculator />}
            quizComponent={<BankingFundamentalsQuizEnhanced />}
            calculatorTitle="Smart Banking Savings Calculator"
            calculatorDescription="Compare how different banking choices impact your wealth over time - see the power of high-yield accounts!"
            quizTitle="Banking Optimization Quiz"
            quizDescription="Test your banking knowledge and unlock advanced money management strategies! You need 80% to unlock Chapter 3."
        />
    );
}
