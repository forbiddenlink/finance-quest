'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import BudgetingMasteryLessonEnhanced from '@/components/chapters/fundamentals/lessons/BudgetingMasteryLessonEnhanced';
import BudgetingCalculatorSuite from '@/components/chapters/fundamentals/calculators/BudgetingCalculatorSuite';
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
            calculatorComponent={<BudgetingCalculatorSuite />}
            quizComponent={<BudgetingMasteryQuizEnhanced />}
            calculatorTitle="Advanced Budgeting Suite"
            calculatorDescription="Master budgeting with 4 professional tools: Budget Builder, Optimizer, Cash Flow Tracker, and Savings Goal Planner"
            quizTitle="Cash Flow Mastery Quiz"
            quizDescription="Prove your budgeting expertise and unlock emergency fund strategies! You need 80% to unlock Chapter 4."
        />
    );
}
