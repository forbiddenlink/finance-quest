'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import RetirementPlanningLessonEnhanced from '@/components/chapters/fundamentals/lessons/RetirementPlanningLessonEnhanced';
import RetirementPlannerCalculator from '@/components/shared/calculators/RetirementPlannerCalculator';
import RetirementPlanningQuizEnhanced from '@/components/chapters/fundamentals/quizzes/RetirementPlanningQuizEnhanced';
import { PiggyBank } from 'lucide-react';

export default function Chapter9Page() {
    return (
        <ChapterLayout
            chapterNumber={9}
            title="Retirement Planning & Long-Term Wealth"
            subtitle="Master retirement planning strategies, calculate savings goals, and optimize tax-advantaged accounts."
            icon={PiggyBank}
            iconColor="text-orange-400"
            lessonComponent={<RetirementPlanningLessonEnhanced />}
            calculatorComponent={<RetirementPlannerCalculator />}
            quizComponent={<RetirementPlanningQuizEnhanced />}
            calculatorTitle="Retirement Planner"
            calculatorDescription="Calculate retirement savings goals and analyze withdrawal strategies"
            quizTitle="Retirement Planning Quiz"
            quizDescription="Test your retirement planning knowledge! You need 80% to unlock Chapter 10."
        />
    );
}
