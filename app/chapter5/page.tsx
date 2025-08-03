'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import IncomeCareerLessonEnhanced from '@/components/chapters/fundamentals/lessons/IncomeCareerLessonEnhanced';
import IncomeCareerCalculatorEnhanced from '@/components/shared/calculators/IncomeCareerCalculatorEnhanced';
import IncomeCareerQuizEnhanced from '@/components/chapters/fundamentals/quizzes/IncomeCareerQuizEnhanced';
import { TrendingUp } from 'lucide-react';

export default function Chapter5Page() {
    return (
        <ChapterLayout
            chapterNumber={5}
            title="Income & Career Optimization"
            subtitle="Maximize your earning potential and optimize your career trajectory."
            icon={TrendingUp}
            iconColor="text-yellow-400"
            lessonComponent={<IncomeCareerLessonEnhanced />}
            calculatorComponent={<IncomeCareerCalculatorEnhanced />}
            quizComponent={<IncomeCareerQuizEnhanced />}
            calculatorTitle="Salary Negotiation Calculator"
            calculatorDescription="Calculate the lifetime value of salary increases and career moves"
            quizTitle="Income Optimization Quiz"
            quizDescription="Test your career growth strategies! You need 80% to unlock Chapter 6."
        />
    );
}

