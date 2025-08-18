'use client';

import React from 'react';
import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import { Scroll, FileText, Scale, Users } from 'lucide-react';
import EstatePlanningLessonEnhanced from '@/components/chapters/fundamentals/lessons/EstatePlanningLessonEnhanced';
import EstatePlanningQuizEnhanced from '@/components/chapters/fundamentals/quizzes/EstatePlanningQuizEnhanced';
import EstateValueCalculator from '@/components/chapters/fundamentals/calculators/EstateValueCalculator';
import TrustPlanningCalculator from '@/components/chapters/fundamentals/calculators/TrustPlanningCalculator';
import InheritanceTaxCalculator from '@/components/chapters/fundamentals/calculators/InheritanceTaxCalculator';
import BeneficiaryPlanningTool from '@/components/chapters/fundamentals/calculators/BeneficiaryPlanningTool';

const calculatorTabs = [
  {
    id: 'estate-value',
    label: 'Estate Value',
    icon: Scroll,
    component: EstateValueCalculator,
    description: 'Calculate total estate value and potential tax implications'
  },
  {
    id: 'trust-planning',
    label: 'Trust Planning',
    icon: FileText,
    component: TrustPlanningCalculator,
    description: 'Compare different trust structures and their benefits'
  },
  {
    id: 'inheritance-tax',
    label: 'Inheritance Tax',
    icon: Scale,
    component: InheritanceTaxCalculator,
    description: 'Estimate inheritance taxes and plan for tax efficiency'
  },
  {
    id: 'beneficiary-planning',
    label: 'Beneficiary Planning',
    icon: Users,
    component: BeneficiaryPlanningTool,
    description: 'Organize and optimize beneficiary designations'
  }
];

export default function Chapter18Page() {
  return (
    <ChapterLayout
      chapterNumber={18}
      title="Estate Planning"
      subtitle="Secure your legacy and protect your assets with comprehensive estate planning strategies"
      icon={Scroll}
      iconColor="text-purple-400"
      lessonComponent={<EstatePlanningLessonEnhanced />}
      calculatorComponent={<EstateValueCalculator />}
      quizComponent={<EstatePlanningQuizEnhanced />}
      calculatorTitle="Estate Planning Suite"
      calculatorDescription="Comprehensive estate planning tools including estate value calculator, trust planning, inheritance tax analysis, and beneficiary planning"
      quizTitle="Estate Planning Quiz"
      quizDescription="Test your estate planning knowledge! This is the final chapter quiz."
      calculatorTabs={calculatorTabs}
    />
  );
}
