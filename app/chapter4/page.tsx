'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import EmergencyFundsLessonEnhanced from '@/components/chapters/fundamentals/lessons/EmergencyFundsLessonEnhanced';
import EmergencyFundCalculatorSuite from '@/components/chapters/fundamentals/calculators/EmergencyFundCalculatorSuite';
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
            calculatorComponent={<EmergencyFundCalculatorSuite />}
            quizComponent={<EmergencyFundsQuizEnhanced />}
            calculatorTitle="Emergency Fund Calculator Suite"
            calculatorDescription="Comprehensive tools to build, optimize, and maintain your financial safety net"
            quizTitle="Emergency Fund Quiz"
            quizDescription="Test your knowledge of financial security! You need 80% to unlock Chapter 5."
        />
    );
}
