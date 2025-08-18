import React from 'react';
import { usePortfolioAnalyzer } from './usePortfolioAnalyzer';
import { Priority, RiskLevel, StyleConfig } from './types';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';

const styleConfig: StyleConfig = {
  priority: {
    High: 'bg-red-100 text-red-800 border-red-300',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Low: 'bg-green-100 text-green-800 border-green-300'
  },
  riskLevel: {
    High: 'text-red-600',
    Medium: 'text-yellow-600',
    Low: 'text-green-600'
  }
} as const;

export default function PortfolioAnalyzerCalculator(): JSX.Element {
  const [state, actions] = usePortfolioAnalyzer();
  const { values, errors, result, isValid } = state;
  const { updateField, reset, calculate } = actions;

  const handleInputChange = (field: string, value: string): void => {
    updateField(field, value);
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  };

  const getPriorityColor = (priority: Priority): string => {
    return styleConfig.priority[priority];
  };

  const getRiskLevelColor = (riskLevel: RiskLevel): string => {
    return styleConfig.riskLevel[riskLevel];
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Asset Allocation</h3>
          
          {/* Asset Allocation Inputs */}
          <div className="space-y-2">
            {[
              { label: 'Cash', field: 'cashAllocation' },
              { label: 'Bonds', field: 'bondAllocation' },
              { label: 'Stocks', field: 'stockAllocation' },
              { label: 'Real Estate', field: 'realEstateAllocation' },
              { label: 'Alternatives', field: 'alternativeAllocation' }
            ].map(({ label, field }) => (
              <div key={field} className="flex items-center space-x-2">
                <label className="w-32">{label}</label>
                <input
                  type="number"
                  value={values[field as keyof typeof values]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="w-24 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                />
                <span>%</span>
                {getFieldError(field) && (
                  <span className="text-red-600 text-sm">{getFieldError(field)}</span>
                )}
              </div>
            ))}
          </div>

          {/* Risk Tolerance Selection */}
          <div className="space-y-2">
            <label className="block">Risk Tolerance</label>
            <select
              value={values.riskTolerance}
              onChange={(e) => handleInputChange('riskTolerance', e.target.value)}
              className="w-full px-2 py-1 border rounded"
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>

          {/* Additional Parameters */}
          <div className="space-y-2">
            <div>
              <label className="block">Expected Volatility (%)</label>
              <input
                type="number"
                value={values.expectedVolatility}
                onChange={(e) => handleInputChange('expectedVolatility', e.target.value)}
                className="w-full px-2 py-1 border rounded"
                min="0"
                max="100"
              />
              {getFieldError('expectedVolatility') && (
                <span className="text-red-600 text-sm">{getFieldError('expectedVolatility')}</span>
              )}
            </div>

            <div>
              <label className="block">Investment Timeframe (years)</label>
              <input
                type="number"
                value={values.investmentTimeframe}
                onChange={(e) => handleInputChange('investmentTimeframe', e.target.value)}
                className="w-full px-2 py-1 border rounded"
                min="1"
                max="50"
              />
              {getFieldError('investmentTimeframe') && (
                <span className="text-red-600 text-sm">{getFieldError('investmentTimeframe')}</span>
              )}
            </div>

            <div>
              <label className="block">Rebalancing Frequency (months)</label>
              <input
                type="number"
                value={values.rebalancingFrequency}
                onChange={(e) => handleInputChange('rebalancingFrequency', e.target.value)}
                className="w-full px-2 py-1 border rounded"
                min="1"
                max="12"
              />
              {getFieldError('rebalancingFrequency') && (
                <span className="text-red-600 text-sm">{getFieldError('rebalancingFrequency')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Projected Returns</h3>
              <div className="space-y-2">
                <div>Conservative: {formatPercentage(result.projectedReturns.conservative)}</div>
                <div>Expected: {formatPercentage(result.projectedReturns.expected)}</div>
                <div>Optimistic: {formatPercentage(result.projectedReturns.optimistic)}</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Risk Metrics</h3>
              <div className="space-y-2">
                <div>Volatility: {formatPercentage(result.riskMetrics.volatility)}</div>
                <div>Sharpe Ratio: {result.riskMetrics.sharpeRatio.toFixed(2)}</div>
                <div>Max Drawdown: {formatPercentage(result.riskMetrics.maxDrawdown)}</div>
                <div>Diversification Score: {formatPercentage(result.riskMetrics.diversificationScore)}</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Recommendations</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Rebalancing Schedule</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.rebalancingSchedule.map((date, index) => (
                  <li key={index}>{date.toLocaleDateString()}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={calculate}
          disabled={!isValid}
          className={`px-4 py-2 rounded ${
            isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Analyze Portfolio
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          Reset
        </button>
      </div>

      {errors.length > 0 && (
        <div className="text-red-600">
          Please correct the following errors:
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}