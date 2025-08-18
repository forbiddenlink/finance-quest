'use client';

import React from 'react';
import { theme } from '@/lib/theme';
import { formatCurrency } from '@/lib/utils/financial';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { ChartDataPoint, ScenarioComparison, MonteCarloResult, ViewMode } from '../types';

interface ChartSectionProps {
  viewMode: ViewMode;
  chartData: ChartDataPoint[];
  scenarioData: ScenarioComparison[];
  monteCarloResults: MonteCarloResult[];
}

export const ChartSection: React.FC<ChartSectionProps> = ({
  viewMode,
  chartData,
  scenarioData,
  monteCarloResults
}) => {
  if (!chartData.length) return null;

  return (
    <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
      <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>
        {viewMode === 'comparison' ? 'Bank Comparison Analysis' : 
         viewMode === 'monte-carlo' ? 'Risk Analysis Results' :
         'Growth Over Time'}
      </h4>
      
      {/* Basic and Advanced Line Chart */}
      {(viewMode === 'basic' || viewMode === 'advanced') && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'advanced' ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[700]} opacity={0.3} />
                <XAxis
                  dataKey="year"
                  label={{ value: 'Years', position: 'insideBottom', offset: -10 }}
                  tick={{ fill: theme.colors.slate[400] }}
                />
                <YAxis
                  tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                  label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                  tick={{ fill: theme.colors.slate[400] }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.colors.slate[800],
                    border: `1px solid ${theme.colors.slate[700]}`,
                    borderRadius: '8px',
                    color: theme.colors.slate[100]
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name === 'deposited' ? 'Total Deposited' : 
                    name === 'interest' ? 'Interest Earned' : 'Total Value'
                  ]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="interest"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorInterest)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="deposited"
                  stroke={theme.colors.blue[400]}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[700]} opacity={0.3} />
                <XAxis
                  dataKey="year"
                  label={{ value: 'Years', position: 'insideBottom', offset: -10 }}
                  tick={{ fill: theme.colors.slate[400] }}
                />
                <YAxis
                  tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                  label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                  tick={{ fill: theme.colors.slate[400] }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.colors.slate[800],
                    border: `1px solid ${theme.colors.slate[700]}`,
                    borderRadius: '8px',
                    color: theme.colors.slate[100]
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name === 'deposited' ? 'Total Deposited' : 
                    name === 'interest' ? 'Interest Earned' : 'Total Value'
                  ]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="deposited"
                  stroke={theme.colors.blue[400]}
                  strokeWidth={2}
                  name="deposited"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={theme.colors.emerald[400]}
                  strokeWidth={3}
                  name="total"
                />
                <Line
                  type="monotone"
                  dataKey="interest"
                  stroke={theme.colors.amber[400]}
                  strokeWidth={2}
                  name="interest"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* Scenario Comparison Chart */}
      {viewMode === 'comparison' && scenarioData.length > 0 && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scenarioData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[700]} opacity={0.3} />
              <XAxis
                dataKey="scenario"
                tick={{ fill: theme.colors.slate[400], fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                tick={{ fill: theme.colors.slate[400] }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.slate[800],
                  border: `1px solid ${theme.colors.slate[700]}`,
                  borderRadius: '8px',
                  color: theme.colors.slate[100]
                }}
                formatter={(value: number) => [formatCurrency(value), 'Future Value']}
              />
              <Bar dataKey="futureValue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monte Carlo Results */}
      {viewMode === 'monte-carlo' && monteCarloResults.length > 0 && (
        <div className="space-y-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monteCarloResults}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[700]} opacity={0.3} />
                <XAxis
                  dataKey="percentile"
                  tick={{ fill: theme.colors.slate[400] }}
                  label={{ value: 'Percentile', position: 'insideBottom', offset: -10 }}
                />
                <YAxis
                  tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                  tick={{ fill: theme.colors.slate[400] }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.colors.slate[800],
                    border: `1px solid ${theme.colors.slate[700]}`,
                    borderRadius: '8px',
                    color: theme.colors.slate[100]
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Projected Value']}
                  labelFormatter={(label) => `${label}th Percentile`}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} p-4 rounded-lg`}>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Risk Analysis Summary</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className={`${theme.status.warning.text} font-medium`}>Worst Case (10%)</p>
                <p className={theme.textColors.primary}>{formatCurrency(monteCarloResults[0]?.value || 0)}</p>
              </div>
              <div>
                <p className={`${theme.status.info.text} font-medium`}>Expected (50%)</p>
                <p className={theme.textColors.primary}>{formatCurrency(monteCarloResults[2]?.value || 0)}</p>
              </div>
              <div>
                <p className={`${theme.status.success.text} font-medium`}>Best Case (90%)</p>
                <p className={theme.textColors.primary}>{formatCurrency(monteCarloResults[4]?.value || 0)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Legend */}
      {(viewMode === 'basic' || viewMode === 'advanced') && (
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-1 bg-blue-400 mr-2"></div>
            <span>Total Deposited</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-emerald-400 mr-2"></div>
            <span>Total Value</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-amber-400 mr-2"></div>
            <span>Interest Earned</span>
          </div>
        </div>
      )}
    </div>
  );
};

