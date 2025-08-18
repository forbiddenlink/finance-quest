'use client';

import React from 'react';
import { Plus, Minus, DollarSign, Percent } from 'lucide-react';
import { theme } from '@/lib/theme';
import { PortfolioHolding, AnalysisParameters } from '../types';

interface InputSectionProps {
  holdings: PortfolioHolding[];
  parameters: AnalysisParameters;
  onAddHolding: () => void;
  onRemoveHolding: (id: string) => void;
  onUpdateHolding: (id: string, field: keyof PortfolioHolding, value: string | number) => void;
  onUpdateParameter: (field: keyof AnalysisParameters, value: number) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  holdings,
  parameters,
  onAddHolding,
  onRemoveHolding,
  onUpdateHolding,
  onUpdateParameter
}) => {
  return (
    <div className="space-y-6">
      {/* Portfolio Holdings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
            Portfolio Holdings
          </h3>
          <button
            onClick={onAddHolding}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        
        <div className="space-y-3">
          {holdings.map((holding) => (
            <div key={holding.id} className={`p-3 border ${theme.borderColors.primary} rounded-lg bg-slate-800/30`}>
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  placeholder="Symbol"
                  value={holding.symbol}
                  onChange={(e) => onUpdateHolding(holding.id, 'symbol', e.target.value)}
                  className={`w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                />
                <button
                  onClick={() => onRemoveHolding(holding.id)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className={`block ${theme.textColors.secondary} mb-1`}>Value</label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400" />
                    <input
                      type="number"
                      value={holding.marketValue}
                      onChange={(e) => onUpdateHolding(holding.id, 'marketValue', Number(e.target.value))}
                      className={`w-full pl-6 pr-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block ${theme.textColors.secondary} mb-1`}>Expected Return %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={holding.expectedReturn}
                    onChange={(e) => onUpdateHolding(holding.id, 'expectedReturn', Number(e.target.value))}
                    className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
                
                <div>
                  <label className={`block ${theme.textColors.secondary} mb-1`}>Volatility %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={holding.volatility}
                    onChange={(e) => onUpdateHolding(holding.id, 'volatility', Number(e.target.value))}
                    className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
                
                <div>
                  <label className={`block ${theme.textColors.secondary} mb-1`}>Beta</label>
                  <input
                    type="number"
                    step="0.1"
                    value={holding.beta}
                    onChange={(e) => onUpdateHolding(holding.id, 'beta', Number(e.target.value))}
                    className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Parameters */}
      <div>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
          Analysis Parameters
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Risk-Free Rate %
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  step="0.1"
                  value={parameters.riskFreeRate}
                  onChange={(e) => onUpdateParameter('riskFreeRate', Number(e.target.value))}
                  className={`w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Market Return %
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  step="0.1"
                  value={parameters.marketReturn}
                  onChange={(e) => onUpdateParameter('marketReturn', Number(e.target.value))}
                  className={`w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Time Horizon (months)
              </label>
              <input
                type="number"
                min="1"
                value={parameters.timeHorizon}
                onChange={(e) => onUpdateParameter('timeHorizon', Number(e.target.value))}
                className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Rebalancing Threshold %
              </label>
              <input
                type="number"
                step="0.5"
                value={parameters.rebalancingThreshold}
                onChange={(e) => onUpdateParameter('rebalancingThreshold', Number(e.target.value))}
                className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

