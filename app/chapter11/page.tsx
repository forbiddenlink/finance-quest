'use client';

import React from 'react';
import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import InsuranceRiskManagementLessonEnhanced from '@/components/chapters/fundamentals/lessons/InsuranceRiskManagementLessonEnhanced';
import InsuranceRiskManagementQuizEnhanced from '@/components/chapters/fundamentals/quizzes/InsuranceRiskManagementQuizEnhanced';
import LifeInsuranceCalculator from '@/components/chapters/fundamentals/calculators/LifeInsuranceCalculator';
import DisabilityInsuranceCalculator from '@/components/chapters/fundamentals/calculators/DisabilityInsuranceCalculator';
import PropertyInsuranceCalculator from '@/components/chapters/fundamentals/calculators/PropertyInsuranceCalculator';
import UmbrellaPolicyCalculator from '@/components/chapters/fundamentals/calculators/UmbrellaPolicyCalculator';
import { Heart, ShieldCheck, Home, Umbrella, Shield } from 'lucide-react';

export default function Chapter11() {
  const calculatorTabs = [
    {
      id: 'life-insurance',
      label: 'Life Insurance',
      icon: Heart,
      component: LifeInsuranceCalculator,
      description: 'Calculate life insurance needs for family protection and income replacement'
    },
    {
      id: 'disability-insurance',
      label: 'Disability Insurance', 
      icon: ShieldCheck,
      component: DisabilityInsuranceCalculator,
      description: 'Assess disability insurance coverage needs and income protection requirements'
    },
    {
      id: 'property-insurance',
      label: 'Property Insurance',
      icon: Home,
      component: PropertyInsuranceCalculator,
      description: 'Analyze property and liability insurance coverage across all your assets'
    },
    {
      id: 'umbrella-policy',
      label: 'Umbrella Policy',
      icon: Umbrella,
      component: UmbrellaPolicyCalculator,
      description: 'Determine optimal umbrella policy coverage for comprehensive liability protection'
    }
  ];

  return (
    <ChapterLayout
      chapterNumber={11}
      title="Insurance & Risk Management"
      subtitle="Protect your wealth and family through strategic insurance planning and comprehensive risk management"
      icon={Shield}
      iconColor="text-blue-400"
      lessonComponent={<InsuranceRiskManagementLessonEnhanced />}
      calculatorComponent={<LifeInsuranceCalculator />}
      quizComponent={<InsuranceRiskManagementQuizEnhanced onComplete={() => {}} />}
      calculatorTitle="Insurance & Risk Management Suite"
      calculatorDescription="Professional insurance calculators for life, disability, property, and umbrella coverage analysis"
      quizTitle="Insurance & Risk Management Quiz"
      quizDescription="Test your insurance knowledge! You need 80% to unlock Chapter 12."
      calculatorTabs={calculatorTabs}
    />
  );
}
