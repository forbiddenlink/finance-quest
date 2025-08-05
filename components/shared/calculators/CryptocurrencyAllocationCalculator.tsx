'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCryptocurrencyAllocationCalculator } from '@/lib/utils/calculatorHooks';
import { useProgressStore } from '@/lib/store/progressStore';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Coins, Shield, TrendingUp, AlertTriangle, CheckCircle2, RefreshCw, Target } from 'lucide-react';

export default function CryptocurrencyAllocationCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  const hookResult = useCryptocurrencyAllocationCalculator();
  const {
    values,
    errors,
    result,
    updateValue,
    updateRiskTolerance,
    updateRebalanceFrequency,
    autoBalance,
    reset
  } = hookResult;

  // Record usage when component mounts
  React.useEffect(() => {
    recordCalculatorUsage('crypto-allocation');
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

  interface ChartEntry {
    name: string;
    value: number;
    amount: number;
    color: string;
  }

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
      case 'Aggressive': return 'text-orange-600';
      case 'Very High Risk': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskLevelBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Very High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  interface Recommendation {
    title: string;
    description: string;
    priority: string;
    impact: string;
  }

  const riskToleranceOptions = [
    { value: 'conservative', label: 'Conservative' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'aggressive', label: 'Aggressive' }
  ];

  const rebalanceFrequencyOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'semiannual', label: 'Semi-Annual' },
    { value: 'annual', label: 'Annual' },
    { value: 'never', label: 'Never' }
  ];

  // Define types for crypto assets
  interface CryptoAsset {
    name: string;
    allocation: number;
    value: number;
    color: string;
    riskLevel: string;
    category: string;
    volatility: number;
    expectedReturn: number;
  }

  // Prepare chart data
  const allocationChartData = result?.cryptoAssets.map((asset: CryptoAsset) => ({
    name: asset.name,
    value: asset.allocation,
    amount: asset.value,
    color: asset.color
  })) || [];

  const riskData = result?.cryptoAssets.map((asset: CryptoAsset) => ({
    name: asset.name,
    risk: asset.volatility * 100,
    return: asset.expectedReturn * 100
  })) || [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Cryptocurrency Allocation Calculator
          </CardTitle>
          <CardDescription>
            Optimize your cryptocurrency portfolio allocation with risk-adjusted recommendations
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
                <Label htmlFor="totalPortfolio">Total Portfolio Value</Label>
                <Input
                  id="totalPortfolio"
                  type="number"
                  value={values.totalPortfolio}
                  onChange={(e) => updateValue('totalPortfolio', e.target.value)}
                  placeholder="100000"
                />
                {errors.totalPortfolio && (
                  <p className="text-sm text-red-600 mt-1">{errors.totalPortfolio}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cryptoPercentage">Cryptocurrency Allocation (%)</Label>
                <Input
                  id="cryptoPercentage"
                  type="number"
                  value={values.cryptoPercentage}
                  onChange={(e) => updateValue('cryptoPercentage', e.target.value)}
                  placeholder="10"
                />
                {errors.cryptoPercentage && (
                  <p className="text-sm text-red-600 mt-1">{errors.cryptoPercentage}</p>
                )}
                {result && (
                  <p className="text-sm text-gray-600 mt-1">
                    Crypto Value: {formatCurrency(result.totalCryptoValue)}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="investmentHorizon">Investment Horizon (Years)</Label>
                  <Input
                    id="investmentHorizon"
                    type="number"
                    value={values.investmentHorizon}
                    onChange={(e) => updateValue('investmentHorizon', e.target.value)}
                    placeholder="5"
                  />
                  {errors.investmentHorizon && (
                    <p className="text-sm text-red-600 mt-1">{errors.investmentHorizon}</p>
                  )}
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
              </div>

              <div>
                <Label htmlFor="rebalanceFrequency">Rebalance Frequency</Label>
                <select
                  id="rebalanceFrequency"
                  value={values.rebalanceFrequency}
                  onChange={(e) => updateRebalanceFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {rebalanceFrequencyOptions.map(option => (
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
              <CardTitle className="text-lg">Cryptocurrency Allocation (%)</CardTitle>
              {result && (
                <div className="text-sm text-gray-600">
                  Total: {result.totalAllocation.toFixed(1)}%
                  {!result.allocationValid && (
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
                  <Label htmlFor="bitcoin">Bitcoin (BTC)</Label>
                  <Input
                    id="bitcoin"
                    type="number"
                    value={values.bitcoin}
                    onChange={(e) => updateValue('bitcoin', e.target.value)}
                    placeholder="50"
                  />
                  {errors.bitcoin && (
                    <p className="text-sm text-red-600 mt-1">{errors.bitcoin}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="ethereum">Ethereum (ETH)</Label>
                  <Input
                    id="ethereum"
                    type="number"
                    value={values.ethereum}
                    onChange={(e) => updateValue('ethereum', e.target.value)}
                    placeholder="30"
                  />
                  {errors.ethereum && (
                    <p className="text-sm text-red-600 mt-1">{errors.ethereum}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="altcoins">Altcoins</Label>
                  <Input
                    id="altcoins"
                    type="number"
                    value={values.altcoins}
                    onChange={(e) => updateValue('altcoins', e.target.value)}
                    placeholder="15"
                  />
                  {errors.altcoins && (
                    <p className="text-sm text-red-600 mt-1">{errors.altcoins}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="defi">DeFi Tokens</Label>
                  <Input
                    id="defi"
                    type="number"
                    value={values.defi}
                    onChange={(e) => updateValue('defi', e.target.value)}
                    placeholder="5"
                  />
                  {errors.defi && (
                    <p className="text-sm text-red-600 mt-1">{errors.defi}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="stablecoins">Stablecoins</Label>
                  <Input
                    id="stablecoins"
                    type="number"
                    value={values.stablecoins}
                    onChange={(e) => updateValue('stablecoins', e.target.value)}
                    placeholder="0"
                  />
                  {errors.stablecoins && (
                    <p className="text-sm text-red-600 mt-1">{errors.stablecoins}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={autoBalance} className="flex-1 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Auto-Balance
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
                        <p className="text-sm text-gray-600">Crypto Value</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(result.totalCryptoValue)}
                        </p>
                      </div>
                      <Coins className="h-8 w-8 text-blue-600" />
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
                          {result.diversificationScore.toFixed(0)}/100
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
                  <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="allocation" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Coins className="h-5 w-5" />
                        Cryptocurrency Allocation Breakdown
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
                                {allocationChartData.map((entry: ChartEntry, index: number) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: unknown) => [`${value}%`, 'Allocation']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Allocation Details */}
                        <div className="space-y-3">
                          {result.cryptoAssets.map((asset: CryptoAsset, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: asset.color }}
                                />
                                <div>
                                  <span className="font-medium">{asset.name}</span>
                                  <div className="flex gap-2 mt-1">
                                    <Badge className={getRiskLevelBadgeColor(asset.riskLevel)}>
                                      {asset.riskLevel}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {asset.category}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{formatPercentage(asset.allocation)}</div>
                                <div className="text-sm text-gray-600">{formatCurrency(asset.value)}</div>
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
                        <Shield className="h-5 w-5" />
                        Risk Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Risk Score</span>
                              <span className="text-sm text-gray-600">{result.riskScore}/10</span>
                            </div>
                            <Progress value={(result.riskScore / 10) * 100} className="h-2" />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Diversification Score</span>
                              <span className="text-sm text-gray-600">{result.diversificationScore.toFixed(0)}/100</span>
                            </div>
                            <Progress value={result.diversificationScore} className="h-2" />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Correlation Score</span>
                              <span className="text-sm text-gray-600">{(result.correlationScore * 100).toFixed(0)}/100</span>
                            </div>
                            <Progress value={result.correlationScore * 100} className="h-2" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-3">Key Metrics</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Expected Return:</span>
                                <span className="font-medium">{formatPercentage(result.expectedReturn * 100)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Volatility:</span>
                                <span className="font-medium">{formatPercentage(result.volatility * 100)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Sharpe Ratio:</span>
                                <span className="font-medium">{result.sharpeRatio.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Max Drawdown:</span>
                                <span className="font-medium text-red-600">-{formatPercentage(result.maxDrawdown * 100)}</span>
                              </div>
                            </div>
                          </div>

                          {!result.allocationValid && (
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                Allocation doesn&apos;t equal 100%. Please adjust your allocations.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>

                      {/* Risk vs Return Chart */}
                      <div className="mt-6">
                        <h4 className="font-semibold mb-4">Risk vs Return Analysis</h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={riskData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value: unknown, name: string) => [
                                `${Number(value).toFixed(1)}%`,
                                name === 'risk' ? 'Volatility' : 'Expected Return'
                              ]} />
                              <Bar dataKey="return" fill="#10B981" name="Expected Return" />
                              <Bar dataKey="risk" fill="#EF4444" name="Volatility" />
                            </BarChart>
                          </ResponsiveContainer>
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
                          result.recommendations.map((rec: Recommendation, index: number) => (
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
                            <h3 className="text-lg font-semibold text-green-700">Well-Balanced Allocation!</h3>
                            <p className="text-gray-600">Your cryptocurrency allocation looks optimized for your risk profile.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {result.maxDrawdown > 0.5 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="font-medium">
                    High Risk Warning: Your portfolio could experience drawdowns of up to {formatPercentage(result.maxDrawdown * 100)}.
                    Consider reducing high-risk allocations or increasing stablecoin exposure.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please correct the input errors to see your cryptocurrency allocation analysis.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
