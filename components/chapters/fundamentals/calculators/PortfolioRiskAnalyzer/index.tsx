'use client';

import React from 'react';
import { Shield } from 'lucide-react';
import { theme } from '@/lib/theme';
import { usePortfolioRiskAnalyzer } from './usePortfolioRiskAnalyzer';
import { InputSection, ResultsSection } from './components';

export default function PortfolioRiskAnalyzer() {
  const [state, actions] = usePortfolioRiskAnalyzer();
  const { holdings, parameters, metrics } = state;
  const { addHolding, removeHolding, updateHolding, updateParameter } = actions;

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Portfolio Risk Analyzer
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div>
          <InputSection
            holdings={holdings}
            parameters={parameters}
            onAddHolding={addHolding}
            onRemoveHolding={removeHolding}
            onUpdateHolding={updateHolding}
            onUpdateParameter={updateParameter}
          />
        </div>
        
        {/* Results Section */}
        <div className="lg:col-span-2">
          {metrics && <ResultsSection metrics={metrics} />}
        </div>
      </div>
    </div>
  );
}

