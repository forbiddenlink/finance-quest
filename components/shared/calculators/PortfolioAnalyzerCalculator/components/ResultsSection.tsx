'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { TrendingUp, BarChart3, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PortfolioResult } from '../types';
import { formatCurrency, formatPercentage } from '../utils';

interface ResultsSectionProps {
  result: PortfolioResult;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      {/* Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Portfolio Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Total Allocation</Label>
              <div className="text-2xl font-bold">
                {formatPercentage(result.totalAllocation)}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Effective Expense Ratio</Label>
              <div className="text-2xl font-bold">
                {formatPercentage(result.effectiveExpenseRatio)}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Diversification Score</Label>
              <div className="text-2xl font-bold">
                {result.diversificationScore.toFixed(0)}/100
              </div>
            </div>
          </div>

          {/* Projected Returns */}
          <div className="space-y-2">
            <h3 className="font-semibold">Projected Returns</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Conservative</Label>
                <div className="text-xl font-semibold text-yellow-600">
                  {formatPercentage(result.projectedReturns.conservative)}
                </div>
              </div>
              <div>
                <Label>Expected</Label>
                <div className="text-xl font-semibold text-green-600">
                  {formatPercentage(result.projectedReturns.expected)}
                </div>
              </div>
              <div>
                <Label>Optimistic</Label>
                <div className="text-xl font-semibold text-blue-600">
                  {formatPercentage(result.projectedReturns.optimistic)}
                </div>
              </div>
            </div>
          </div>

          {/* Risk Metrics */}
          <div className="space-y-2">
            <h3 className="font-semibold">Risk Metrics</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Volatility</Label>
                <div className="text-xl font-semibold">
                  {formatPercentage(result.riskMetrics.volatility)}
                </div>
              </div>
              <div>
                <Label>Sharpe Ratio</Label>
                <div className="text-xl font-semibold">
                  {result.riskMetrics.sharpeRatio.toFixed(2)}
                </div>
              </div>
              <div>
                <Label>Max Drawdown</Label>
                <div className="text-xl font-semibold">
                  {formatPercentage(result.riskMetrics.maxDrawdown)}
                </div>
              </div>
            </div>
          </div>

          {/* Rebalancing Needs */}
          {result.rebalancingNeeded && (
            <div className="space-y-2">
              <h3 className="font-semibold">Suggested Rebalancing</h3>
              <div className="space-y-2">
                {result.suggestedChanges.map((change: { action: string; assetClass: string; amount: number; currentAllocation: number; targetAllocation: number }, index: number) => (
                  <Alert key={index}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {change.action === 'increase' ? 'Increase' : 'Decrease'} {change.assetClass} by{' '}
                      {formatPercentage(change.amount)} (Current: {formatPercentage(change.currentAllocation)}, Target: {formatPercentage(change.targetAllocation)})
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="space-y-2">
            <h3 className="font-semibold">Portfolio Insights</h3>
            <div className="space-y-2">
              {result.insights.map((insight: { type: string; message: string }, index: number) => (
                <Alert key={index} variant={insight.type === 'warning' ? 'destructive' : 'default'}>
                  {insight.type === 'warning' ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  <AlertDescription>{insight.message}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

