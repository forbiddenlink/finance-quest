'use client';

import ChapterLayout from '@/components/shared/layouts/ChapterLayout';
import EstatePlanningLessonEnhanced from '@/components/chapters/fundamentals/lessons/EstatePlanningLessonEnhanced';
import EstatePlanningCalculator from '@/components/shared/calculators/EstatePlanningCalculator';
import TrustAnalysisCalculator from '@/components/shared/calculators/TrustAnalysisCalculator';
import InheritanceTaxCalculator from '@/components/shared/calculators/InheritanceTaxCalculator';
import WealthTransferCalculator from '@/components/shared/calculators/WealthTransferCalculator';
import EstatePlanningQuizEnhanced from '@/components/chapters/fundamentals/quizzes/EstatePlanningQuizEnhanced';
import { FileText, Calculator, Shield, Users, TrendingUp } from 'lucide-react';

export default function Chapter17Page() {
    const calculatorTabs = [
        {
            id: 'estate-planning',
            label: 'Estate Planning',
            icon: Calculator,
            component: EstatePlanningCalculator,
            description: 'Estate value, tax liability, and distribution planning with federal/state calculations'
        },
        {
            id: 'trust-analysis',
            label: 'Trust Analysis',
            icon: Shield,
            component: TrustAnalysisCalculator,
            description: 'Trust structures, tax benefits, and distribution strategies with projections'
        },
        {
            id: 'inheritance-tax',
            label: 'Inheritance Tax',
            icon: TrendingUp,
            component: InheritanceTaxCalculator,
            description: 'Federal/state tax calculations, exemptions, and step-up basis analysis'
        },
        {
            id: 'wealth-transfer',
            label: 'Wealth Transfer',
            icon: Users,
            component: WealthTransferCalculator,
            description: 'Generation-skipping strategies, gift tax planning, and transfer efficiency'
        }
    ];

    return (
        <ChapterLayout
            chapterNumber={17}
            title="Estate Planning & Wealth Transfer"
            subtitle="Master wealth preservation and transfer strategies across generations through strategic estate planning, trust structures, and tax-efficient strategies."
            icon={FileText}
            iconColor="text-purple-500"
            lessonComponent={<EstatePlanningLessonEnhanced />}
            calculatorComponent={<EstatePlanningCalculator />}
            quizComponent={<EstatePlanningQuizEnhanced />}
            calculatorTitle="Estate Planning Calculators"
            calculatorDescription="Professional tools for estate valuation, trust analysis, tax planning, and wealth transfer strategies."
            calculatorTabs={calculatorTabs}
        />
    );
}
