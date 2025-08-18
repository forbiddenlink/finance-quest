'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { theme } from '@/lib/theme';
import { SavingsResults } from '../types';

interface PeerComparisonProps {
  results: SavingsResults;
  interestRate: string;
  monthlyDeposit: string;
}

export const PeerComparison: React.FC<PeerComparisonProps> = ({
  results,
  interestRate,
  monthlyDeposit
}) => {
  return (
    <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
      <div className="flex items-center space-x-2 mb-4">
        <Users className={`w-5 h-5 ${theme.status.info.text}`} />
        <h4 className={`${theme.typography.heading6} ${theme.textColors.primary}`}>
          How You Compare to Others
        </h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
          <p className={`text-2xl font-bold ${theme.status.success.text}`}>
            {results.futureValue > 50000 ? '💪' : results.futureValue > 25000 ? '👍' : '📈'}
          </p>
          <p className={`text-sm ${theme.textColors.primary} font-medium`}>
            {results.futureValue > 50000 ? 'Top 25%' : results.futureValue > 25000 ? 'Above Average' : 'Getting Started'}
          </p>
          <p className={`text-xs ${theme.textColors.muted}`}>
            Compared to peers in your age group
          </p>
        </div>
        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
          <p className={`text-2xl font-bold ${theme.status.warning.text}`}>
            {parseFloat(interestRate) > 4 ? '🚀' : parseFloat(interestRate) > 2 ? '✈️' : '🐌'}
          </p>
          <p className={`text-sm ${theme.textColors.primary} font-medium`}>
            {parseFloat(interestRate) > 4 ? 'Excellent Rate' : parseFloat(interestRate) > 2 ? 'Good Rate' : 'Consider Upgrading'}
          </p>
          <p className={`text-xs ${theme.textColors.muted}`}>
            Your interest rate vs market average
          </p>
        </div>
        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
          <p className={`text-2xl font-bold ${theme.status.info.text}`}>
            {parseFloat(monthlyDeposit) > 300 ? '🏆' : parseFloat(monthlyDeposit) > 150 ? '💪' : '🌱'}
          </p>
          <p className={`text-sm ${theme.textColors.primary} font-medium`}>
            {parseFloat(monthlyDeposit) > 300 ? 'Super Saver' : parseFloat(monthlyDeposit) > 150 ? 'Good Saver' : 'Building Habits'}
          </p>
          <p className={`text-xs ${theme.textColors.muted}`}>
            Monthly savings vs recommended 20%
          </p>
        </div>
      </div>
    </div>
  );
};

