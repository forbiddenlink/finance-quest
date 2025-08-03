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
            subtitle="Master money flow control, eliminate budget failures, and build automated wealth systems."
            icon={Target}
            iconColor="text-purple-400"
            lessonComponent={<BudgetingMasteryLessonEnhanced />}
            calculatorComponent={<BudgetBuilderCalculator />}
            quizComponent={<BudgetingMasteryQuizEnhanced />}
            calculatorTitle="Advanced Budget Builder"
            calculatorDescription="Build, track, and optimize your budget with interactive analysis and 50/30/20 guidance"
            quizTitle="Cash Flow Mastery Quiz"
            quizDescription="Prove your budgeting expertise and unlock emergency fund strategies! You need 80% to unlock Chapter 4."
        />
    );
}
