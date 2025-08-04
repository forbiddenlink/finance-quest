'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStockAnalysisCalculator } from '@/lib/utils/calculatorHooks';
import { useProgressStore } from '@/lib/store/progressStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Target, Shield, BarChart3, CheckCircle2, AlertTriangle, RefreshCw, Lightbulb, Eye, DollarSign } from 'lucide-react';

export default function StockAnalysisCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  const {
    values,
    results,
    validation,
    updateField,
    reset
  } = useStockAnalysisCalculator();

  // Record usage when component mounts
  React.useEffect(() => {
    recordCalculatorUsage('stock-analysis');
  }, [recordCalculatorUsage]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const formatRatio = (value: number): string => {
    return value.toFixed(2);
  };

  const getRecommendationColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-100 text-green-800 border-green-300';
      case 'HOLD': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'SELL': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Prepare chart data
  const analysisData = results ? [
    { name: 'Current Price', value: parseFloat(values.currentPrice) || 0 },
    { name: 'Target Price', value: parseFloat(values.targetPrice) || 0 },
    { name: 'Fair Value', value: results.fairValue || 0 }
  ] : [];

  const returnData = results ? [
    { name: 'Price Appreciation', value: results.priceAppreciation || 0 },
    { name: 'Dividend Return', value: results.dividendReturn || 0 },
    { name: 'Total Return', value: results.totalReturn || 0 }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Stock Analysis Calculator
          </CardTitle>
          <CardDescription>
            Analyze stock valuation, returns, and investment potential with key financial metrics
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentPrice">Current Price ($)</Label>
                  <Input
                    id="currentPrice"
                    type="number"
                    value={values.currentPrice}
                    onChange={(e) => updateField('currentPrice', e.target.value)}
                    placeholder="100.00"
                  />
                  {validation.errors?.currentPrice && (
                    <p className="text-sm text-red-600 mt-1">{validation.errors.currentPrice}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="targetPrice">Target Price ($)</Label>
                  <Input
                    id="targetPrice"
                    type="number"
                    value={values.targetPrice}
                    onChange={(e) => updateField('targetPrice', e.target.value)}
                    placeholder="120.00"
                  />
                  {validation.errors?.targetPrice && (
                    <p className="text-sm text-red-600 mt-1">{validation.errors.targetPrice}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dividendYield">Dividend Yield (%)</Label>
                  <Input
                    id="dividendYield"
                    type="number"
                    value={values.dividendYield}
                    onChange={(e) => updateField('dividendYield', e.target.value)}
                    placeholder="2.5"
                  />
                  {validation.errors?.dividendYield && (
                    <p className="text-sm text-red-600 mt-1">{validation.errors.dividendYield}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="peRatio">P/E Ratio</Label>
                  <Input
                    id="peRatio"
                    type="number"
                    value={values.peRatio}
                    onChange={(e) => updateField('peRatio', e.target.value)}
                    placeholder="15"
                  />
                  {validation.errors?.peRatio && (
                    <p className="text-sm text-red-600 mt-1">{validation.errors.peRatio}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="eps">Earnings per Share ($)</Label>
                  <Input
                    id="eps"
                    type="number"
                    value={values.eps}
                    onChange={(e) => updateField('eps', e.target.value)}
                    placeholder="6.67"
                  />
                  {validation.errors?.eps && (
                    <p className="text-sm text-red-600 mt-1">{validation.errors.eps}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="growthRate">Growth Rate (%)</Label>
                  <Input
                    id="growthRate"
                    type="number"
                    value={values.growthRate}
                    onChange={(e) => updateField('growthRate', e.target.value)}
                    placeholder="8"
                  />
                  {validation.errors?.growthRate && (
                    <p className="text-sm text-red-600 mt-1">{validation.errors.growthRate}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="timeHorizon">Time Horizon (Years)</Label>
                  <Input
                    id="timeHorizon"
                    type="number"
                    value={values.timeHorizon}
                    onChange={(e) => updateField('timeHorizon', e.target.value)}
                    placeholder="1"
                  />
                  {validation.errors?.timeHorizon && (
                    <p className="text-sm text-red-600 mt-1">{validation.errors.timeHorizon}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={reset} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {results && (
            <>
              {/* Investment Recommendation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Investment Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={`text-lg px-4 py-2 ${getRecommendationColor(results.recommendation)}`}>
                        {results.recommendation}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {results.valueGap >= 0 ? '+' : ''}{formatPercentage(results.valueGap || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Value Gap</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {formatCurrency(results.fairValue || 0)}
                        </div>
                        <div className="text-sm text-blue-700">Fair Value</div>
                      </div>

                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {formatPercentage(results.totalReturn || 0)}
                        </div>
                        <div className="text-sm text-green-700">Total Return</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Analysis */}
              <Tabs defaultValue="valuation" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="valuation">Valuation</TabsTrigger>
                  <TabsTrigger value="returns">Returns</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="valuation" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Valuation Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Valuation Chart */}
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analysisData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value: any) => [formatCurrency(value), 'Price']} />
                              <Bar dataKey="value" fill="#3B82F6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-lg font-bold">{formatRatio(parseFloat(values.peRatio) || 0)}</div>
                            <div className="text-sm text-gray-600">P/E Ratio</div>
                          </div>

                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-lg font-bold">{formatCurrency(parseFloat(values.eps) || 0)}</div>
                            <div className="text-sm text-gray-600">EPS</div>
                          </div>

                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-lg font-bold">{formatPercentage(parseFloat(values.growthRate) || 0)}</div>
                            <div className="text-sm text-gray-600">Growth Rate</div>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-3">Valuation Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Current Price:</span>
                              <span className="font-medium">{formatCurrency(parseFloat(values.currentPrice) || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Fair Value:</span>
                              <span className="font-medium">{formatCurrency(results.fairValue || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Value Gap:</span>
                              <span className={`font-medium ${(results.valueGap || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatPercentage(results.valueGap || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="returns" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Return Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Returns Chart */}
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={returnData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value: any) => [formatPercentage(value), 'Return']} />
                              <Bar dataKey="value" fill="#10B981" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Return Breakdown */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-900">Price Appreciation</h4>
                            <p className="text-2xl font-bold text-blue-600">
                              {formatPercentage(results.priceAppreciation || 0)}
                            </p>
                            <p className="text-sm text-blue-700">Capital Gains</p>
                          </div>

                          <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-semibold text-green-900">Dividend Return</h4>
                            <p className="text-2xl font-bold text-green-600">
                              {formatPercentage(results.dividendReturn || 0)}
                            </p>
                            <p className="text-sm text-green-700">Annual Yield</p>
                          </div>

                          <div className="p-4 bg-purple-50 rounded-lg">
                            <h4 className="font-semibold text-purple-900">Total Return</h4>
                            <p className="text-2xl font-bold text-purple-600">
                              {formatPercentage(results.totalReturn || 0)}
                            </p>
                            <p className="text-sm text-purple-700">Combined Return</p>
                          </div>

                          <div className="p-4 bg-orange-50 rounded-lg">
                            <h4 className="font-semibold text-orange-900">Annualized Return</h4>
                            <p className="text-2xl font-bold text-orange-600">
                              {formatPercentage(results.annualizedReturn || 0)}
                            </p>
                            <p className="text-sm text-orange-700">Per Year</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Investment Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Investment Insights */}
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                              <Lightbulb className="h-4 w-4" />
                              Key Insights
                            </h4>
                            <div className="space-y-2 text-sm text-blue-700">
                              <div>• Current P/E ratio: {formatRatio(parseFloat(values.peRatio) || 0)}</div>
                              <div>• Expected growth rate: {formatPercentage(parseFloat(values.growthRate) || 0)}</div>
                              <div>• Dividend yield: {formatPercentage(parseFloat(values.dividendYield) || 0)}</div>
                              <div>• Investment time horizon: {values.timeHorizon} year(s)</div>
                            </div>
                          </div>

                          {/* Recommendation Logic */}
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-3">Recommendation Logic</h4>
                            <div className="text-sm space-y-2">
                              {results.valueGap > 10 && (
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>Stock appears undervalued (value gap > 10%)</span>
                                </div>
                              )}
                              {results.valueGap < -10 && (
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                  <span>Stock appears overvalued (value gap < -10%)</span>
                                </div>
                              )}
                              {results.valueGap >= -10 && results.valueGap <= 10 && (
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4 text-yellow-500" />
                                  <span>Stock appears fairly valued (-10% to +10% range)</span>
                                </div>
                              )}
                              
                              <div className="mt-3 pt-3 border-t">
                                <p><strong>Fair Value Calculation:</strong> EPS × (P/E Ratio + Growth Rate)</p>
                                <p className="text-xs text-gray-600 mt-1">
                                  ${values.eps} × ({values.peRatio} + {values.growthRate}) = {formatCurrency(results.fairValue || 0)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {Math.abs(results.valueGap || 0) > 20 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="font-medium">
                    {(results.valueGap || 0) > 20 ? 
                      'Significant undervaluation detected. Consider researching fundamental factors before investing.' :
                      'Significant overvaluation detected. Current price may be too high relative to fundamentals.'
                    }
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {!validation.isValid && validation.errors && Object.keys(validation.errors).length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please correct the input errors to see your stock analysis.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

  // Record usage when component mounts
  React.useEffect(() => {
    recordCalculatorUsage('stock-analysis');
  }, [recordCalculatorUsage]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const formatRatio = (value: number): string => {
    return value.toFixed(2);
  };

  const getRecommendationColor = (action: string) => {
    switch (action) {
      case 'Strong Buy': return 'bg-green-100 text-green-800 border-green-300';
      case 'Buy': return 'bg-green-50 text-green-700 border-green-200';
      case 'Hold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Sell': return 'bg-red-50 text-red-700 border-red-200';
      case 'Strong Sell': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-orange-600';
      case 'Very High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Prepare chart data
  const valuationData = result ? [
    { name: 'Current Price', value: values.currentPrice },
    { name: 'DCF Value', value: result.intrinsicValue.dcfValue },
    { name: 'Graham Number', value: result.intrinsicValue.grahamNumber },
    { name: 'Book Value', value: result.intrinsicValue.bookValue },
    { name: 'Target Price', value: values.targetPrice }
  ] : [];

  const metricsRadarData = result ? [
    { metric: 'PE Ratio', value: Math.min(result.valuationMetrics.peRatio, 50) },
    { metric: 'ROE', value: result.valuationMetrics.roe },
    { metric: 'ROA', value: result.valuationMetrics.roa * 10 },
    { metric: 'FCF Yield', value: result.valuationMetrics.freeCashFlowYield * 100 },
    { metric: 'Growth Rate', value: values.growthRate },
    { metric: 'Dividend Yield', value: values.dividendYield }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Stock Analysis Calculator
          </CardTitle>
          <CardDescription>
            Comprehensive stock valuation and analysis with DCF modeling, ratio analysis, and investment recommendations
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentPrice">Current Price ($)</Label>
                  <Input
                    id="currentPrice"
                    type="number"
                    value={values.currentPrice}
                    onChange={(e) => updateValue('currentPrice', e.target.value)}
                    placeholder="100.00"
                  />
                  {errors.currentPrice && (
                    <p className="text-sm text-red-600 mt-1">{errors.currentPrice}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="targetPrice">Target Price ($)</Label>
                  <Input
                    id="targetPrice"
                    type="number"
                    value={values.targetPrice}
                    onChange={(e) => updateValue('targetPrice', e.target.value)}
                    placeholder="120.00"
                  />
                  {errors.targetPrice && (
                    <p className="text-sm text-red-600 mt-1">{errors.targetPrice}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="marketCap">Market Cap ($M)</Label>
                  <Input
                    id="marketCap"
                    type="number"
                    value={values.marketCap}
                    onChange={(e) => updateValue('marketCap', e.target.value)}
                    placeholder="1000"
                  />
                  {errors.marketCap && (
                    <p className="text-sm text-red-600 mt-1">{errors.marketCap}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="beta">Beta</Label>
                  <Input
                    id="beta"
                    type="number"
                    step="0.1"
                    value={values.beta}
                    onChange={(e) => updateValue('beta', e.target.value)}
                    placeholder="1.2"
                  />
                  {errors.beta && (
                    <p className="text-sm text-red-600 mt-1">{errors.beta}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="earnings">Earnings per Share ($)</Label>
                  <Input
                    id="earnings"
                    type="number"
                    value={values.earnings}
                    onChange={(e) => updateValue('earnings', e.target.value)}
                    placeholder="5.00"
                  />
                  {errors.earnings && (
                    <p className="text-sm text-red-600 mt-1">{errors.earnings}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bookValue">Book Value per Share ($)</Label>
                  <Input
                    id="bookValue"
                    type="number"
                    value={values.bookValue}
                    onChange={(e) => updateValue('bookValue', e.target.value)}
                    placeholder="50.00"
                  />
                  {errors.bookValue && (
                    <p className="text-sm text-red-600 mt-1">{errors.bookValue}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="revenue">Revenue ($M)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={values.revenue}
                    onChange={(e) => updateValue('revenue', e.target.value)}
                    placeholder="500"
                  />
                  {errors.revenue && (
                    <p className="text-sm text-red-600 mt-1">{errors.revenue}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="freeCashFlow">Free Cash Flow ($M)</Label>
                  <Input
                    id="freeCashFlow"
                    type="number"
                    value={values.freeCashFlow}
                    onChange={(e) => updateValue('freeCashFlow', e.target.value)}
                    placeholder="50"
                  />
                  {errors.freeCashFlow && (
                    <p className="text-sm text-red-600 mt-1">{errors.freeCashFlow}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="debt">Total Debt ($M)</Label>
                  <Input
                    id="debt"
                    type="number"
                    value={values.debt}
                    onChange={(e) => updateValue('debt', e.target.value)}
                    placeholder="100"
                  />
                  {errors.debt && (
                    <p className="text-sm text-red-600 mt-1">{errors.debt}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="equity">Total Equity ($M)</Label>
                  <Input
                    id="equity"
                    type="number"
                    value={values.equity}
                    onChange={(e) => updateValue('equity', e.target.value)}
                    placeholder="200"
                  />
                  {errors.equity && (
                    <p className="text-sm text-red-600 mt-1">{errors.equity}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Growth & Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="growthRate">Growth Rate (%)</Label>
                  <Input
                    id="growthRate"
                    type="number"
                    value={values.growthRate}
                    onChange={(e) => updateValue('growthRate', e.target.value)}
                    placeholder="10"
                  />
                  {errors.growthRate && (
                    <p className="text-sm text-red-600 mt-1">{errors.growthRate}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dividendYield">Dividend Yield (%)</Label>
                  <Input
                    id="dividendYield"
                    type="number"
                    value={values.dividendYield}
                    onChange={(e) => updateValue('dividendYield', e.target.value)}
                    placeholder="2.5"
                  />
                  {errors.dividendYield && (
                    <p className="text-sm text-red-600 mt-1">{errors.dividendYield}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="industryPE">Industry PE Ratio</Label>
                  <Input
                    id="industryPE"
                    type="number"
                    value={values.industryPE}
                    onChange={(e) => updateValue('industryPE', e.target.value)}
                    placeholder="18"
                  />
                  {errors.industryPE && (
                    <p className="text-sm text-red-600 mt-1">{errors.industryPE}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="riskFreeRate">Risk-Free Rate (%)</Label>
                  <Input
                    id="riskFreeRate"
                    type="number"
                    value={values.riskFreeRate}
                    onChange={(e) => updateValue('riskFreeRate', e.target.value)}
                    placeholder="3"
                  />
                  {errors.riskFreeRate && (
                    <p className="text-sm text-red-600 mt-1">{errors.riskFreeRate}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="marketReturn">Market Return (%)</Label>
                  <Input
                    id="marketReturn"
                    type="number"
                    value={values.marketReturn}
                    onChange={(e) => updateValue('marketReturn', e.target.value)}
                    placeholder="10"
                  />
                  {errors.marketReturn && (
                    <p className="text-sm text-red-600 mt-1">{errors.marketReturn}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={reset} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result && (
            <>
              {/* Investment Recommendation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Investment Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={`text-lg px-4 py-2 ${getRecommendationColor(result.recommendation.action)}`}>
                        {result.recommendation.action}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {result.recommendation.upside >= 0 ? '+' : ''}{formatPercentage(result.recommendation.upside)}
                        </div>
                        <div className="text-sm text-gray-600">Upside Potential</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Confidence Level</span>
                        <span className="text-sm text-gray-600">{result.recommendation.confidence}%</span>
                      </div>
                      <Progress value={result.recommendation.confidence} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Key Reasoning:</h4>
                      {result.recommendation.reasoning.map((reason, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Analysis */}
              <Tabs defaultValue="valuation" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="valuation">Valuation</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="risk">Risk</TabsTrigger>
                  <TabsTrigger value="swot">SWOT</TabsTrigger>
                </TabsList>

                <TabsContent value="valuation" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Valuation Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Valuation Chart */}
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={valuationData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value: any) => [formatCurrency(value), 'Value']} />
                              <Bar dataKey="value" fill="#3B82F6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Intrinsic Values */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-900">DCF Value</h4>
                            <p className="text-2xl font-bold text-blue-600">
                              {formatCurrency(result.intrinsicValue.dcfValue)}
                            </p>
                            <p className="text-sm text-blue-700">Discounted Cash Flow</p>
                          </div>

                          <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-semibold text-green-900">Graham Number</h4>
                            <p className="text-2xl font-bold text-green-600">
                              {formatCurrency(result.intrinsicValue.grahamNumber)}
                            </p>
                            <p className="text-sm text-green-700">Value Investing Formula</p>
                          </div>

                          <div className="p-4 bg-purple-50 rounded-lg">
                            <h4 className="font-semibold text-purple-900">Book Value</h4>
                            <p className="text-2xl font-bold text-purple-600">
                              {formatCurrency(result.intrinsicValue.bookValue)}
                            </p>
                            <p className="text-sm text-purple-700">Net Asset Value</p>
                          </div>

                          <div className="p-4 bg-orange-50 rounded-lg">
                            <h4 className="font-semibold text-orange-900">Liquidation Value</h4>
                            <p className="text-2xl font-bold text-orange-600">
                              {formatCurrency(result.intrinsicValue.liquidationValue)}
                            </p>
                            <p className="text-sm text-orange-700">Conservative Estimate</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="metrics" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Financial Ratios
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Radar Chart */}
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={metricsRadarData}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="metric" />
                              <PolarRadiusAxis />
                              <Radar name="Value" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-lg font-bold">{formatRatio(result.valuationMetrics.peRatio)}</div>
                            <div className="text-sm text-gray-600">P/E Ratio</div>
                          </div>

                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-lg font-bold">{formatRatio(result.valuationMetrics.pbRatio)}</div>
                            <div className="text-sm text-gray-600">P/B Ratio</div>
                          </div>

                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-lg font-bold">{formatRatio(result.valuationMetrics.psRatio)}</div>
                            <div className="text-sm text-gray-600">P/S Ratio</div>
                          </div>

                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-lg font-bold">{formatPercentage(result.valuationMetrics.roe)}</div>
                            <div className="text-sm text-gray-600">ROE</div>
                          </div>

                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-lg font-bold">{formatPercentage(result.valuationMetrics.roa)}</div>
                            <div className="text-sm text-gray-600">ROA</div>
                          </div>

                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-lg font-bold">{formatRatio(result.valuationMetrics.debtToEquity)}</div>
                            <div className="text-sm text-gray-600">D/E Ratio</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="risk" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Risk Level</span>
                              <span className={`text-sm font-bold ${getRiskLevelColor(result.riskMetrics.riskLevel)}`}>
                                {result.riskMetrics.riskLevel}
                              </span>
                            </div>
                            <Progress value={(result.riskMetrics.volatilityScore / 10) * 100} className="h-2" />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Beta:</span>
                              <span className="font-medium">{formatRatio(result.riskMetrics.beta)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Expected Return:</span>
                              <span className="font-medium">{formatPercentage(result.riskMetrics.expectedReturn)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Volatility Score:</span>
                              <span className="font-medium">{result.riskMetrics.volatilityScore.toFixed(1)}/10</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-3">Risk Interpretation</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Beta {formatRatio(result.riskMetrics.beta)}:</strong> {
                              result.riskMetrics.beta > 1.2 ? 'High volatility relative to market' :
                              result.riskMetrics.beta > 0.8 ? 'Moderate volatility' : 'Low volatility'
                            }</p>
                            <p><strong>Expected Return:</strong> Based on CAPM model</p>
                            <p><strong>Risk Level:</strong> Overall assessment of investment risk</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="swot" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        SWOT Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {/* Strengths */}
                          <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Strengths
                            </h4>
                            <div className="space-y-2">
                              {result.analysis.strengths.length > 0 ? (
                                result.analysis.strengths.map((strength, index) => (
                                  <div key={index} className="text-sm text-green-700">• {strength}</div>
                                ))
                              ) : (
                                <div className="text-sm text-green-700">No significant strengths identified</div>
                              )}
                            </div>
                          </div>

                          {/* Opportunities */}
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                              <Lightbulb className="h-4 w-4" />
                              Opportunities
                            </h4>
                            <div className="space-y-2">
                              {result.analysis.opportunities.length > 0 ? (
                                result.analysis.opportunities.map((opportunity, index) => (
                                  <div key={index} className="text-sm text-blue-700">• {opportunity}</div>
                                ))
                              ) : (
                                <div className="text-sm text-blue-700">No significant opportunities identified</div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Weaknesses */}
                          <div className="p-4 bg-yellow-50 rounded-lg">
                            <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Weaknesses
                            </h4>
                            <div className="space-y-2">
                              {result.analysis.weaknesses.length > 0 ? (
                                result.analysis.weaknesses.map((weakness, index) => (
                                  <div key={index} className="text-sm text-yellow-700">• {weakness}</div>
                                ))
                              ) : (
                                <div className="text-sm text-yellow-700">No significant weaknesses identified</div>
                              )}
                            </div>
                          </div>

                          {/* Threats */}
                          <div className="p-4 bg-red-50 rounded-lg">
                            <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Threats
                            </h4>
                            <div className="space-y-2">
                              {result.analysis.threats.length > 0 ? (
                                result.analysis.threats.map((threat, index) => (
                                  <div key={index} className="text-sm text-red-700">• {threat}</div>
                                ))
                              ) : (
                                <div className="text-sm text-red-700">No significant threats identified</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {result.riskMetrics.volatilityScore > 8 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="font-medium">
                    High Risk Investment: This stock shows high volatility with a beta of {formatRatio(result.riskMetrics.beta)}. 
                    Consider your risk tolerance before investing.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {!isValid && Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please correct the input errors to see your stock analysis.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
