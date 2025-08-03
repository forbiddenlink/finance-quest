'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import RealEstateAlternativesLessonEnhanced from '@/components/chapters/fundamentals/lessons/RealEstateAlternativesLessonEnhanced';
import MortgageCalculator from '@/components/shared/calculators/MortgageCalculator';
import RealEstateAlternativesQuizEnhanced from '@/components/chapters/fundamentals/quizzes/RealEstateAlternativesQuizEnhanced';
import { Home } from 'lucide-react';

export default function Chapter12Page() {
    return (
        <ChapterLayout
            chapterNumber={12}
            title="Real Estate & Property Investment"
            subtitle="Learn real estate investing, property analysis, and wealth building through real estate."
            icon={Home}
            iconColor="text-emerald-500"
            lessonComponent={<RealEstateAlternativesLessonEnhanced />}
            calculatorComponent={<MortgageCalculator />}
            quizComponent={<RealEstateAlternativesQuizEnhanced />}
            calculatorTitle="Real Estate Calculator"
            calculatorDescription="Analyze property investments, mortgages, and rental returns"
            quizTitle="Real Estate Quiz"
            quizDescription="Test your real estate investment knowledge! You need 80% to unlock Chapter 13."
        />
    );
}
