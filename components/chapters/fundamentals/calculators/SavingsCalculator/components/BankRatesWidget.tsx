'use client';

import React from 'react';
import { theme } from '@/lib/theme';
import { BankRate } from '../types';

interface BankRatesWidgetProps {
  rates: BankRate[];
  onSelectRate: (rate: string) => void;
}

export const BankRatesWidget: React.FC<BankRatesWidgetProps> = ({ rates, onSelectRate }) => {
  if (!rates.length) return null;

  return (
    <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className={`${theme.typography.heading6} ${theme.textColors.primary}`}>
          🔴 Live Banking Rates
        </h4>
        <span className={`text-xs ${theme.textColors.muted}`}>
          Updated: {new Date().toLocaleTimeString()}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rates.slice(0, 6).map((rate, index) => (
          <div key={index} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} p-3 rounded-lg`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`font-medium ${theme.textColors.primary} text-sm`}>{rate.bank}</p>
                <p className={`text-xs ${theme.textColors.muted}`}>{rate.type}</p>
              </div>
              <div className={`text-right ${rate.apy >= 4 ? theme.status.success.text : theme.status.warning.text}`}>
                <p className="text-lg font-bold">{rate.apy}%</p>
                <p className="text-xs">APY</p>
              </div>
            </div>
            <button
              onClick={() => onSelectRate(rate.apy.toString())}
              className={`mt-2 w-full text-xs py-1 px-2 rounded ${theme.buttons.secondary} hover:${theme.status.info.bg} transition-colors`}
            >
              Use This Rate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

