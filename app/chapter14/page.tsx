'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import BondFixedIncomeLessonEnhanced from '@/components/chapters/fundamentals/lessons/BondFixedIncomeLessonEnhanced';
import BondCalculator from '@/components/shared/calculators/BondCalculator';
import BondFixedIncomeQuizEnhanced from '@/components/chapters/fundamentals/quizzes/BondFixedIncomeQuizEnhanced';
import { DollarSign } from 'lucide-react';

export default function Chapter14Page() {
    return (
        <ChapterLayout
            chapterNumber={14}
            title="Bonds & Fixed Income Mastery"
            subtitle="Master bond investing, fixed income strategies, and portfolio diversification."
            icon={DollarSign}
            iconColor="text-amber-500"
            lessonComponent={<BondFixedIncomeLessonEnhanced />}
            calculatorComponent={<BondCalculator />}
            quizComponent={<BondFixedIncomeQuizEnhanced />}
            calculatorTitle="Bond Calculator"
            calculatorDescription="Calculate bond yields, prices, and portfolio allocation"
            quizTitle="Bond & Fixed Income Quiz"
            quizDescription="Complete your financial education journey! Test your bond knowledge to graduate."
        />
    );
}
