'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import BudgetingMasteryLessonEnhanced from '@/components/chapters/fundamentals/lessons/BudgetingMasteryLessonEnhanced';
import BudgetBuilderCalculator from '@/components/shared/calculators/BudgetBuilderCalculator';
import BudgetingMasteryQuizEnhanced from '@/components/chapters/fundamentals/quizzes/BudgetingMasteryQuizEnhanced';
import { Target } from 'lucide-react';

export default function Chapter3Page() {
    return (
        <ChapterLayout
            chapterNumber={3}
            title="Budgeting & Cash Flow Mastery"
            subtitle="Master your money flow and build sustainable spending habits."
            icon={Target}
            iconColor="text-purple-400"
            lessonComponent={<BudgetingMasteryLessonEnhanced />}
            calculatorComponent={<BudgetBuilderCalculator />}
            quizComponent={<BudgetingMasteryQuizEnhanced />}
            calculatorTitle="Budget Builder"
            calculatorDescription="Create and optimize your personal budget with advanced analysis"
            quizTitle="Budgeting Mastery Quiz"
            quizDescription="Test your cash flow management skills! You need 80% to unlock Chapter 4."
        />
    );
}
