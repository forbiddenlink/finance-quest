'use client';

import React from 'react';
import { Calculator, TrendingUp, Globe, TrendingDown } from 'lucide-react';
import { theme } from '@/lib/theme';
import { CurrencyInput, NumberInput } from '@/components/shared/calculators/FormFields';
import { ViewMode } from '../types';

interface InputSectionProps {
  initialDeposit: string;
  monthlyDeposit: string;
  interestRate: string;
  timeYears: string;
  inflationRate: string;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  viewMode: ViewMode;
  setInitialDeposit: (value: string) => void;
  setMonthlyDeposit: (value: string) => void;
  setInterestRate: (value: string) => void;
  setTimeYears: (value: string) => void;
  setInflationRate: (value: string) => void;
  setRiskProfile: (value: 'conservative' | 'moderate' | 'aggressive') => void;
  setViewMode: (value: ViewMode) => void;
  applyPreset: (preset: { initial: number; monthly: number; rate: number; years: number }) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  initialDeposit,
  monthlyDeposit,
  interestRate,
  timeYears,
  inflationRate,
  riskProfile,
  viewMode,
  setInitialDeposit,
  setMonthlyDeposit,
  setInterestRate,
  setTimeYears,
  setInflationRate,
  setRiskProfile,
  setViewMode,
  applyPreset
}) => {
  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4`}>
        <h4 className={`${theme.typography.heading6} ${theme.textColors.primary} mb-3`}>Analysis Mode</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { mode: 'basic' as const, label: 'Basic', icon: Calculator },
            { mode: 'advanced' as const, label: 'Advanced', icon: TrendingUp },
            { mode: 'comparison' as const, label: 'Compare Banks', icon: Globe },
            { mode: 'monte-carlo' as const, label: 'Risk Analysis', icon: TrendingDown }
          ].map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-all ${
                viewMode === mode 
                  ? `${theme.status.success.bg} ${theme.status.success.text}` 
                  : `${theme.backgrounds.glass} ${theme.textColors.secondary} hover:${theme.status.info.bg}`
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Fields */}
      <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
        <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Your Savings Plan</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CurrencyInput
            id="initialDeposit"
            label="Initial Deposit"
            value={initialDeposit}
            onChange={setInitialDeposit}
            min={0}
            step={100}
            placeholder="Enter initial deposit"
          />

          <CurrencyInput
            id="monthlyDeposit"
            label="Monthly Deposit"
            value={monthlyDeposit}
            onChange={setMonthlyDeposit}
            min={0}
            step={25}
            placeholder="Enter monthly amount"
          />

          <NumberInput
            id="interestRate"
            label="Annual Interest Rate (%)"
            value={interestRate}
            onChange={setInterestRate}
            min={0}
            max={20}
            step={0.1}
            placeholder="Enter annual rate"
          />
          
          <NumberInput
            id="timeYears"
            label="Time Period (years)"
            value={timeYears}
            onChange={setTimeYears}
            min={1}
            max={50}
            step={1}
            placeholder="Enter number of years"
          />

          {viewMode === 'advanced' && (
            <>
              <NumberInput
                id="inflationRate"
                label="Inflation Rate (%)"
                value={inflationRate}
                onChange={setInflationRate}
                min={0}
                max={10}
                step={0.1}
                placeholder="Enter inflation rate"
              />
              
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                  Risk Profile
                </label>
                <select
                  value={riskProfile}
                  onChange={(e) => setRiskProfile(e.target.value as 'conservative' | 'moderate' | 'aggressive')}
                  className={`w-full p-2 rounded-lg bg-white/10 border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Quick Presets */}
        <div className={`mt-6 ${theme.backgrounds.glass} border ${theme.borderColors.primary} p-4 rounded-lg`}>
          <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Quick Scenarios</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Big Bank (0.01%)', initial: 1000, monthly: 200, rate: 0.01, years: 5 },
              { label: 'Credit Union (2.5%)', initial: 1000, monthly: 200, rate: 2.5, years: 5 },
              { label: 'Online Bank (4.5%)', initial: 1000, monthly: 200, rate: 4.5, years: 5 },
              { label: 'Emergency Fund Goal', initial: 0, monthly: 400, rate: 4.5, years: 2 }
            ].map((preset, index) => (
              <button
                key={index}
                onClick={() => applyPreset(preset)}
                className={`text-xs p-2 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded hover:${theme.status.info.bg} transition-colors`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

