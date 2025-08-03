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
            subtitle="Master the basics of banking, account types, and financial institution relationships."
            icon={Building2}
            iconColor="text-green-400"
            lessonComponent={<BankingFundamentalsLessonEnhanced />}
            calculatorComponent={<SavingsCalculator />}
            quizComponent={<BankingFundamentalsQuizEnhanced />}
            calculatorTitle="Savings Calculator"
            calculatorDescription="Use this savings calculator to see how your banking optimization can accelerate your wealth building!"
            quizTitle="Banking Fundamentals Quiz"
            quizDescription="Test your banking knowledge! You need 80% to unlock Chapter 3."
        />
    );
}
