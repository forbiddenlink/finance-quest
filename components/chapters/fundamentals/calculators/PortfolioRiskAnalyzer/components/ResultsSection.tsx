'use client';

import React from 'react';
import { Target, AlertTriangle } from 'lucide-react';
import { theme } from '@/lib/theme';
import { PortfolioMetrics } from '../types';
import { formatCurrency, formatPercent, getStatusColor, getActionColor } from '../utils';

interface ResultsSectionProps {
  metrics: PortfolioMetrics;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className={`p-6 border ${theme.borderColors.primary} rounded-lg bg-slate-800/50`}>
        <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4`}>
          Portfolio Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>
              {formatCurrency(metrics.totalValue)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Total Value</div>
          </div>

          <div className="text-center">
            <div className={`text-xl font-bold text-green-400 mb-1`}>
              {formatPercent(metrics.expectedReturn)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Expected Return</div>
          </div>

          <div className="text-center">
            <div className={`text-xl font-bold text-yellow-400 mb-1`}>
              {formatPercent(metrics.volatility)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Volatility</div>
          </div>

          <div className="text-center">
            <div className={`text-xl font-bold text-blue-400 mb-1`}>
              {metrics.sharpeRatio.toFixed(2)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Sharpe Ratio</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-600">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className={`${theme.textColors.secondary}`}>Portfolio Beta:</span>
              <div className={`font-semibold ${theme.textColors.primary}`}>
                {metrics.beta.toFixed(2)}
              </div>
            </div>
            <div>
              <span className={`${theme.textColors.secondary}`}>Diversification:</span>
              <div className={`font-semibold ${theme.textColors.primary}`}>
                {metrics.diversificationRatio.toFixed(2)}
              </div>
            </div>
            <div>
              <span className={`${theme.textColors.secondary}`}>VaR (95%):</span>
              <div className={`font-semibold text-red-400`}>
                {formatCurrency(metrics.var95)}
              </div>
            </div>
            <div>
              <span className={`${theme.textColors.secondary}`}>Max Drawdown:</span>
              <div className={`font-semibold text-red-400`}>
                {formatPercent(metrics.maxDrawdown)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Allocation */}
      <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
        <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
          <h3 className={`font-semibold ${theme.textColors.primary}`}>
            Current Allocation
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
              <tr>
                <th className="px-4 py-3 text-left">Asset</th>
                <th className="px-4 py-3 text-left">Allocation</th>
                <th className="px-4 py-3 text-left">Value</th>
                <th className="px-4 py-3 text-left">Weight</th>
              </tr>
            </thead>
            <tbody>
              {metrics.allocations.map((allocation, index) => (
                <tr key={index} className={`border-t ${theme.borderColors.primary}`}>
                  <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                    {allocation.asset}
                  </td>
                  <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                    {formatPercent(allocation.percentage)}
                  </td>
                  <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                    {formatCurrency(allocation.value)}
                  </td>
                  <td className={`px-4 py-3`}>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min(allocation.percentage, 100)}%` }}
                        />
                      </div>
                      <span className={`text-xs ${theme.textColors.secondary}`}>
                        {allocation.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
        <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
          <h3 className={`font-semibold ${theme.textColors.primary}`}>
            Risk Metrics Analysis
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
              <tr>
                <th className="px-4 py-3 text-left">Metric</th>
                <th className="px-4 py-3 text-left">Value</th>
                <th className="px-4 py-3 text-left">Benchmark</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.riskMetrics.map((metric, index) => (
                <tr key={index} className={`border-t ${theme.borderColors.primary}`}>
                  <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                    {metric.metric}
                  </td>
                  <td className={`px-4 py-3 ${theme.textColors.primary} font-semibold`}>
                    {metric.value}
                  </td>
                  <td className={`px-4 py-3 ${theme.textColors.secondary}`}>
                    {metric.benchmark}
                  </td>
                  <td className={`px-4 py-3`}>
                    <span className={`font-semibold ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rebalancing Recommendations */}
      {metrics.rebalancingNeeds.some(need => need.action !== 'Hold') && (
        <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
          <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
            <h3 className={`font-semibold ${theme.textColors.primary}`}>
              Rebalancing Recommendations
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
                <tr>
                  <th className="px-4 py-3 text-left">Asset</th>
                  <th className="px-4 py-3 text-left">Current</th>
                  <th className="px-4 py-3 text-left">Target</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {metrics.rebalancingNeeds.map((need, index) => (
                  <tr key={index} className={`border-t ${theme.borderColors.primary}`}>
                    <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                      {need.asset}
                    </td>
                    <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                      {formatPercent(need.current)}
                    </td>
                    <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                      {formatPercent(need.target)}
                    </td>
                    <td className={`px-4 py-3`}>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getActionColor(need.action)}`}>
                        {need.action}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                      {formatCurrency(need.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className={`p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg`}>
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className={`font-semibold text-blue-400 mb-2`}>
              Portfolio Optimization Recommendations
            </h4>
            <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
              {metrics.recommendations.map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className={`p-4 bg-red-900/20 border border-red-500/20 rounded-lg`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <h4 className={`font-semibold text-red-400 mb-2`}>
              Risk Factors to Monitor
            </h4>
            <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
              {metrics.riskFactors.map((risk, index) => (
                <li key={index}>• {risk}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

