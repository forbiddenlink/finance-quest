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
import { usePortfolioAnalyzerCalculator } from '@/lib/utils/calculatorHooks';
import { useProgressStore } from '@/lib/store/progressStore';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon, BarChart3, Target, DollarSign, Shield, TrendingUp, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function PortfolioAnalyzerCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  const {
    values,
    errors,
    result,
    isValid,
    updateValue,
    updateRiskTolerance,
    autoRebalance,
    reset
  } = usePortfolioAnalyzerCalculator();

  // Record usage when component mounts
  React.useEffect(() => {
    recordCalculatorUsage('portfolio-analyzer');
  }, [recordCalculatorUsage]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
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
      case 'Conservative': return 'text-green-600';
      case 'Moderate': return 'text-yellow-600';
      case 'Aggressive': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const riskToleranceOptions = [
    { value: 'conservative', label: 'Conservative' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'aggressive', label: 'Aggressive' }
  ];

  // Prepare chart data
  const allocationChartData = result?.allocations.map(allocation => ({
    name: allocation.category,
    value: allocation.allocation,
    amount: allocation.value,
    color: allocation.color
  })) || [];

  const performanceData = result ? [
    { name: 'Expected Return', value: result.expectedReturn * 100 },
    { name: 'Volatility', value: result.volatility * 100 }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Portfolio Analyzer
          </CardTitle>
          <CardDescription>
            Analyze your portfolio allocation, risk profile, and get personalized recommendations
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Portfolio Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="totalInvestment">Total Investment</Label>
                <Input
                  id="totalInvestment"
                  type="number"
                  value={values.totalInvestment}
                  onChange={(e) => updateValue('totalInvestment', e.target.value)}
                  placeholder="100000"
                />
                {errors.totalInvestment && (
                  <p className="text-sm text-red-600 mt-1">{errors.totalInvestment}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={values.age}
                    onChange={(e) => updateValue('age', e.target.value)}
                    placeholder="35"
                  />
                  {errors.age && (
                    <p className="text-sm text-red-600 mt-1">{errors.age}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="investmentHorizon">Investment Horizon (Years)</Label>
                  <Input
                    id="investmentHorizon"
                    type="number"
                    value={values.investmentHorizon}
                    onChange={(e) => updateValue('investmentHorizon', e.target.value)}
                    placeholder="25"
                  />
                  {errors.investmentHorizon && (
                    <p className="text-sm text-red-600 mt-1">{errors.investmentHorizon}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <select
                  id="riskTolerance"
                  value={values.riskTolerance}
                  onChange={(e) => updateRiskTolerance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {riskToleranceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Asset Allocation (%)</CardTitle>
              {result && (
                <div className="text-sm text-gray-600">
                  Total: {result.totalAllocation.toFixed(1)}%
                  {Math.abs(result.totalAllocation - 100) > 1 && (
                    <span className="text-red-600 ml-2">
                      ⚠ Should equal 100%
                    </span>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usStocks">US Stocks</Label>
                  <Input
                    id="usStocks"
                    type="number"
                    value={values.usStocks}
                    onChange={(e) => updateValue('usStocks', e.target.value)}
                    placeholder="50"
                  />
                  {errors.usStocks && (
                    <p className="text-sm text-red-600 mt-1">{errors.usStocks}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="intlStocks">International Stocks</Label>
                  <Input
                    id="intlStocks"
                    type="number"
                    value={values.intlStocks}
                    onChange={(e) => updateValue('intlStocks', e.target.value)}
                    placeholder="20"
                  />
                  {errors.intlStocks && (
                    <p className="text-sm text-red-600 mt-1">{errors.intlStocks}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bonds">Bonds</Label>
                  <Input
                    id="bonds"
                    type="number"
                    value={values.bonds}
                    onChange={(e) => updateValue('bonds', e.target.value)}
                    placeholder="20"
                  />
                  {errors.bonds && (
                    <p className="text-sm text-red-600 mt-1">{errors.bonds}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="realEstate">Real Estate</Label>
                  <Input
                    id="realEstate"
                    type="number"
                    value={values.realEstate}
                    onChange={(e) => updateValue('realEstate', e.target.value)}
                    placeholder="5"
                  />
                  {errors.realEstate && (
                    <p className="text-sm text-red-600 mt-1">{errors.realEstate}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="commodities">Commodities</Label>
                  <Input
                    id="commodities"
                    type="number"
                    value={values.commodities}
                    onChange={(e) => updateValue('commodities', e.target.value)}
                    placeholder="3"
                  />
                  {errors.commodities && (
                    <p className="text-sm text-red-600 mt-1">{errors.commodities}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cash">Cash</Label>
                  <Input
                    id="cash"
                    type="number"
                    value={values.cash}
                    onChange={(e) => updateValue('cash', e.target.value)}
                    placeholder="2"
                  />
                  {errors.cash && (
                    <p className="text-sm text-red-600 mt-1">{errors.cash}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="crypto">Cryptocurrency</Label>
                  <Input
                    id="crypto"
                    type="number"
                    value={values.crypto}
                    onChange={(e) => updateValue('crypto', e.target.value)}
                    placeholder="0"
                  />
                  {errors.crypto && (
                    <p className="text-sm text-red-600 mt-1">{errors.crypto}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={autoRebalance} className="flex-1 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Auto-Rebalance
            </Button>
            <Button onClick={reset} variant="outline" className="flex-1">
              Reset
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Portfolio Value</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(result.totalValue)}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Risk Level</p>
                        <p className={`text-2xl font-bold ${getRiskLevelColor(result.riskLevel)}`}>
                          {result.riskLevel}
                        </p>
                      </div>
                      <Shield className="h-8 w-8 text-gray-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Expected Return</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatPercentage(result.expectedReturn * 100)}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Diversification</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {result.diversificationScore}/100
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analysis */}
              <Tabs defaultValue="allocation" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="allocation">Allocation</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="allocation" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5" />
                        Asset Allocation Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid lg:grid-cols-2 gap-6">
                        {/* Pie Chart */}
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={allocationChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {allocationChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: any) => [`${value}%`, 'Allocation']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Allocation Details */}
                        <div className="space-y-3">
                          {result.allocations.map((allocation, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: allocation.color }}
                                />
                                <span className="font-medium">{allocation.category}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{formatPercentage(allocation.allocation)}</div>
                                <div className="text-sm text-gray-600">{formatCurrency(allocation.value)}</div>
                                {allocation.target > 0 && (
                                  <div className="text-xs text-gray-500">
                                    Target: {formatPercentage(allocation.target)}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Portfolio Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Risk Score</span>
                              <span className="text-sm text-gray-600">{result.riskScore}/20</span>
                            </div>
                            <Progress value={(result.riskScore / 20) * 100} className="h-2" />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Diversification Score</span>
                              <span className="text-sm text-gray-600">{result.diversificationScore}/100</span>
                            </div>
                            <Progress value={result.diversificationScore} className="h-2" />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Allocation Health</span>
                              <span className="text-sm text-gray-600">{result.allocationHealthScore}/100</span>
                            </div>
                            <Progress value={result.allocationHealthScore} className="h-2" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-3">Key Metrics</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Expected Annual Return:</span>
                                <span className="font-medium">{formatPercentage(result.expectedReturn * 100)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Portfolio Volatility:</span>
                                <span className="font-medium">{formatPercentage(result.volatility * 100)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Sharpe Ratio:</span>
                                <span className="font-medium">{result.sharpeRatio.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {result.rebalanceNeeded && (
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                Your portfolio may benefit from rebalancing. See recommendations below.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Portfolio Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {result.recommendations.length > 0 ? (
                          result.recommendations.map((rec, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{rec.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                                </div>
                                <Badge className={getPriorityColor(rec.priority)}>
                                  {rec.priority}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-500">
                                <strong>Impact:</strong> {rec.impact}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-green-700">Great Portfolio!</h3>
                            <p className="text-gray-600">Your portfolio allocation looks well-balanced.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}

          {!isValid && Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please correct the input errors to see your portfolio analysis.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
