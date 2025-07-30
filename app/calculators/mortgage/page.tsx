'use client';

import MortgageCalculator from '@/components/shared/calculators/MortgageCalculator';
import { useProgressActions } from '@/lib/context/ProgressContext';
import { useEffect } from 'react';

export default function MortgageCalculatorPage() {
  const progressActions = useProgressActions();

  useEffect(() => {
    progressActions.useCalculator('mortgage-calculator');
  }, [progressActions]);

  return <MortgageCalculator />;
}
