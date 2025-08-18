'use client';

import React from 'react';
import { TrendingUp, Target, DollarSign } from 'lucide-react';
import { theme } from '@/lib/theme';
import { formatCurrency } from '@/lib/utils/financial';
import { SavingsResults } from '../types';

interface InsightsSectionProps {
  results: SavingsResults;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ results }) => {
  if (!results) return null;

  return (
    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
      <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>
        Educational Insights
      </h4>
      
      <div className="space-y-4">
        <div className={`${theme.backgrounds.cardHover} p-4 rounded-lg`}>
          <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>
            <TrendingUp className="inline w-4 h-4 mr-2" />
            Compounding Power
          </h5>
          <p className={`text-sm ${theme.textColors.secondary}`}>
            Your money will grow by <span className="text-emerald-400 font-semibold">{results.compoundingPower.toFixed(1)}x</span> due to compound interest.
            The power of compounding means your earnings generate their own earnings over time.
          </p>
        </div>

        <div className={`${theme.backgrounds.cardHover} p-4 rounded-lg`}>
          <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>
            <Target className="inline w-4 h-4 mr-2" />
            Time to Goal
          </h5>
          <p className={`text-sm ${theme.textColors.secondary}`}>
            At your current savings rate, you&apos;ll reach major milestones in approximately{' '}
            <span className="text-blue-400 font-semibold">{results.monthsToGoal} months</span>.
            Increasing your monthly contribution can significantly reduce this timeline.
          </p>
        </div>

        <div className={`${theme.backgrounds.cardHover} p-4 rounded-lg`}>
          <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>
            <DollarSign className="inline w-4 h-4 mr-2" />
            Inflation Impact
          </h5>
          <p className={`text-sm ${theme.textColors.secondary}`}>
            After adjusting for inflation (3% annually), your real purchasing power will be{' '}
            <span className="text-amber-400 font-semibold">{formatCurrency(results.realValue)}</span>.
            This shows the importance of earning returns above the inflation rate.
          </p>
        </div>
      </div>
    </div>
  );
};

