'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePortfolioAnalyzer } from '@/lib/hooks/calculators/usePortfolioAnalyzer';
import { PieChart as PieChartIcon, Target, DollarSign, Shield, TrendingUp, AlertTriangle, CheckCircle2, RefreshCw, BarChart3 } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';

export default function PortfolioAnalyzerCalculator() {
  const [state, actions] = usePortfolioAnalyzer();
  const { values, errors, result, isValid } = state;
  const { updateField, reset } = actions;

  const handleInputChange = (field: string, value: string) => {
    updateField(field, value);
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-6 w-6" />
            Portfolio Analyzer
          </CardTitle>
          <CardDescription>
            Analyze your investment portfolio&apos;s allocation, risk, and potential returns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="allocation" className="space-y-4">
            <TabsList>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
              <TabsTrigger value="risk-profile">Risk Profile</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
            </TabsList>

            <TabsContent value="allocation" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="totalValue">Total Portfolio Value</Label>
                  <Input
                    id="totalValue"
                    type="number"
                    value={values.totalValue}
                    onChange={(e) => handleInputChange('totalValue', e.target.value)}
                    error={getFieldError('totalValue')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cashAllocation">Cash Allocation (%)</Label>
                  <Input
                    id="cashAllocation"
                    type="number"
                    value={values.cashAllocation}
                    onChange={(e) => handleInputChange('cashAllocation', e.target.value)}
                    error={getFieldError('cashAllocation')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bondAllocation">Bond Allocation (%)</Label>
                  <Input
                    id="bondAllocation"
                    type="number"
                    value={values.bondAllocation}
                    onChange={(e) => handleInputChange('bondAllocation', e.target.value)}
                    error={getFieldError('bondAllocation')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockAllocation">Stock Allocation (%)</Label>
                  <Input
                    id="stockAllocation"
                    type="number"
                    value={values.stockAllocation}
                    onChange={(e) => handleInputChange('stockAllocation', e.target.value)}
                    error={getFieldError('stockAllocation')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="realEstateAllocation">Real Estate Allocation (%)</Label>
                  <Input
                    id="realEstateAllocation"
                    type="number"
                    value={values.realEstateAllocation}
                    onChange={(e) => handleInputChange('realEstateAllocation', e.target.value)}
                    error={getFieldError('realEstateAllocation')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternativeAllocation">Alternative Allocation (%)</Label>
                  <Input
                    id="alternativeAllocation"
                    type="number"
                    value={values.alternativeAllocation}
                    onChange={(e) => handleInputChange('alternativeAllocation', e.target.value)}
                    error={getFieldError('alternativeAllocation')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="risk-profile" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                  <Select
                    value={values.riskTolerance}
                    onValueChange={(value) => handleInputChange('riskTolerance', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk tolerance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investmentTimeframe">Investment Timeframe (years)</Label>
                  <Input
                    id="investmentTimeframe"
                    type="number"
                    value={values.investmentTimeframe}
                    onChange={(e) => handleInputChange('investmentTimeframe', e.target.value)}
                    error={getFieldError('investmentTimeframe')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incomeRequirement">Income Requirement (%)</Label>
                  <Input
                    id="incomeRequirement"
                    type="number"
                    value={values.incomeRequirement}
                    onChange={(e) => handleInputChange('incomeRequirement', e.target.value)}
                    error={getFieldError('incomeRequirement')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="averageExpenseRatio">Average Expense Ratio (%)</Label>
                  <Input
                    id="averageExpenseRatio"
                    type="number"
                    value={values.averageExpenseRatio}
                    onChange={(e) => handleInputChange('averageExpenseRatio', e.target.value)}
                    error={getFieldError('averageExpenseRatio')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rebalanceFrequency">Rebalance Frequency</Label>
                  <Select
                    value={values.rebalanceFrequency}
                    onValueChange={(value) => handleInputChange('rebalanceFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxBracket">Tax Bracket (%)</Label>
                  <Input
                    id="taxBracket"
                    type="number"
                    value={values.taxBracket}
                    onChange={(e) => handleInputChange('taxBracket', e.target.value)}
                    error={getFieldError('taxBracket')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assumptions" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="expectedInflation">Expected Inflation (%)</Label>
                  <Input
                    id="expectedInflation"
                    type="number"
                    value={values.expectedInflation}
                    onChange={(e) => handleInputChange('expectedInflation', e.target.value)}
                    error={getFieldError('expectedInflation')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedVolatility">Expected Volatility (%)</Label>
                  <Input
                    id="expectedVolatility"
                    type="number"
                    value={values.expectedVolatility}
                    onChange={(e) => handleInputChange('expectedVolatility', e.target.value)}
                    error={getFieldError('expectedVolatility')}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-x-2">
            <Button
              onClick={reset}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6" />
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
                    {result.suggestedChanges.map((change, index) => (
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
                  {result.insights.map((insight, index) => (
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
      )}
    </div>
  );
}