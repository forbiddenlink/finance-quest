'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import EmergencyFundsLessonEnhanced from '@/components/chapters/fundamentals/lessons/EmergencyFundsLessonEnhanced';
import EmergencyFundCalculator from '@/components/shared/calculators/EmergencyFundCalculator';
import EmergencyFundsQuizEnhanced from '@/components/chapters/fundamentals/quizzes/EmergencyFundsQuizEnhanced';
import { Shield } from 'lucide-react';

export default function Chapter4Page() {
    return (
        <ChapterLayout
            chapterNumber={4}
            title="Emergency Funds & Financial Security"
            subtitle="Build your financial safety net and protect against unexpected expenses."
            icon={Shield}
            iconColor="text-green-400"
            lessonComponent={<EmergencyFundsLessonEnhanced />}
            calculatorComponent={<EmergencyFundCalculator />}
            quizComponent={<EmergencyFundsQuizEnhanced />}
            calculatorTitle="Emergency Fund Calculator"
            calculatorDescription="Calculate how much you need for financial security"
            quizTitle="Emergency Fund Quiz"
            quizDescription="Test your knowledge of financial security! You need 80% to unlock Chapter 5."
        />
    );
}
