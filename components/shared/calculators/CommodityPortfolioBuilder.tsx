'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Zap,
  AlertTriangle,
  Info,
  DollarSign,
  Target,
  BarChart3,
  Package
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

interface CommodityMetrics {
  portfolioValue: number;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  inflationHedgeRating: number;
  diversificationScore: number;
  correlationScore: number;
  riskLevel: string;
  monthlyVolatility: number;
  maxDrawdown: number;
  commodityExposure: number;
  recommendations: string[];
}

interface CommodityPosition {
  id: number;
  name: string;
  category: 'Energy' | 'Metals' | 'Agriculture' | 'Livestock' | 'Industrial';
  allocation: number;
  currentPrice: number;
  expectedReturn: number;
  volatility: number;
  correlationToInflation: number;
  correlationToStock: number;
  amount: number;
  etfSymbol: string;
  expenseRatio: number;
}

export default function CommodityPortfolioBuilder() {
  // Commodity Positions
  const [commodityPositions, setCommodityPositions] = useState<CommodityPosition[]>([
    {
      id: 1,
      name: 'Crude Oil',
      category: 'Energy',
      allocation: 25,
      currentPrice: 78.50,
      expectedReturn: 8.5,
      volatility: 35.2,
      correlationToInflation: 0.65,
      correlationToStock: 0.25,
      amount: 5000,
      etfSymbol: 'USO',
      expenseRatio: 0.79
    },
    {
      id: 2,
      name: 'Gold',
      category: 'Metals',
      allocation: 20,
      currentPrice: 1985.00,
      expectedReturn: 5.2,
      volatility: 18.4,
      correlationToInflation: 0.42,
      correlationToStock: -0.15,
      amount: 4000,
      etfSymbol: 'GLD',
      expenseRatio: 0.40
    },
    {
      id: 3,
      name: 'Agricultural Basket',
      category: 'Agriculture',
      allocation: 20,
      currentPrice: 42.75,
      expectedReturn: 6.8,
      volatility: 22.1,
      correlationToInflation: 0.55,
      correlationToStock: 0.15,
      amount: 4000,
      etfSymbol: 'DBA',
      expenseRatio: 0.85
    },
    {
      id: 4,
      name: 'Industrial Metals',
      category: 'Industrial',
      allocation: 15,
      currentPrice: 38.25,
      expectedReturn: 7.4,
      volatility: 28.6,
      correlationToInflation: 0.48,
      correlationToStock: 0.40,
      amount: 3000,
      etfSymbol: 'DBB',
      expenseRatio: 0.83
    },
    {
      id: 5,
      name: 'Natural Gas',
      category: 'Energy',
      allocation: 10,
      currentPrice: 3.15,
      expectedReturn: 10.2,
      volatility: 45.8,
      correlationToInflation: 0.38,
      correlationToStock: 0.20,
      amount: 2000,
      etfSymbol: 'UNG',
      expenseRatio: 1.15
    },
    {
      id: 6,
      name: 'Livestock',
      category: 'Livestock',
      allocation: 10,
      currentPrice: 28.90,
      expectedReturn: 4.5,
      volatility: 16.7,
      correlationToInflation: 0.32,
      correlationToStock: 0.10,
      amount: 2000,
      etfSymbol: 'COW',
      expenseRatio: 0.60
    }
  ]);

  // Portfolio Parameters
  const [totalInvestment, setTotalInvestment] = useState<number>(20000);
  const [investmentHorizon, setInvestmentHorizon] = useState<number>(5);
  const [riskTolerance, setRiskTolerance] = useState<'Conservative' | 'Moderate' | 'Aggressive'>('Moderate');
  const [inflationTarget, setInflationTarget] = useState<number>(3.0);
  const [rebalanceFrequency, setRebalanceFrequency] = useState<'Monthly' | 'Quarterly' | 'Annually'>('Quarterly');

  const [metrics, setMetrics] = useState<CommodityMetrics | null>(null);

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('commodity-portfolio-builder');
  }, [recordCalculatorUsage]);

  const commodityColors = {
    'Energy': '#f59e0b',
    'Metals': '#6b7280',
    'Agriculture': '#10b981',
    'Livestock': '#8b5cf6',
    'Industrial': '#ef4444'
  };

  const updateCommodityPosition = (index: number, field: keyof CommodityPosition, value: number | string) => {
    const newPositions = [...commodityPositions];
    newPositions[index] = { ...newPositions[index], [field]: value };
    setCommodityPositions(newPositions);
  };

  const addCommodityPosition = () => {
    const newPosition: CommodityPosition = {
      id: Math.max(...commodityPositions.map(p => p.id)) + 1,
      name: `New Commodity ${commodityPositions.length + 1}`,
      category: 'Energy',
      allocation: 5,
      currentPrice: 50.0,
      expectedReturn: 6.0,
      volatility: 25.0,
      correlationToInflation: 0.40,
      correlationToStock: 0.20,
      amount: 1000,
      etfSymbol: 'NEW',
      expenseRatio: 0.75
    };
    setCommodityPositions([...commodityPositions, newPosition]);
  };

  const removeCommodityPosition = (id: number) => {
    if (commodityPositions.length > 1) {
      setCommodityPositions(commodityPositions.filter(position => position.id !== id));
    }
  };

  const analyzeCommodityPortfolio = useCallback((): CommodityMetrics => {
    const totalValue = commodityPositions.reduce((sum, position) => sum + position.amount, 0);
    
    // Portfolio expected return (weighted average)
    const expectedReturn = commodityPositions.reduce((sum, position) => {
      const weight = position.amount / totalValue;
      return sum + (position.expectedReturn * weight);
    }, 0);

    // Portfolio volatility (using correlation matrix approximation)
    let portfolioVariance = 0;
    for (let i = 0; i < commodityPositions.length; i++) {
      for (let j = 0; j < commodityPositions.length; j++) {
        const weightI = commodityPositions[i].amount / totalValue;
        const weightJ = commodityPositions[j].amount / totalValue;
        const volI = commodityPositions[i].volatility / 100;
        const volJ = commodityPositions[j].volatility / 100;
        
        // Approximate correlation based on categories and stock correlation
        let correlation = 1.0;
        if (i !== j) {
          if (commodityPositions[i].category === commodityPositions[j].category) {
            correlation = 0.7; // High intra-category correlation
          } else {
            // Average correlation between different commodity types
            correlation = (commodityPositions[i].correlationToStock + commodityPositions[j].correlationToStock) / 2;
          }
        }
        
        portfolioVariance += weightI * weightJ * volI * volJ * correlation;
      }
    }
    const volatility = Math.sqrt(portfolioVariance) * 100;

    // Sharpe ratio (assuming 3% risk-free rate)
    const riskFreeRate = 3.0;
    const sharpeRatio = (expectedReturn - riskFreeRate) / volatility;

    // Inflation hedge rating
    const inflationHedgeRating = commodityPositions.reduce((sum, position) => {
      const weight = position.amount / totalValue;
      return sum + (position.correlationToInflation * weight * 100);
    }, 0);

    // Diversification score
    const categoryDistribution = commodityPositions.reduce((acc, position) => {
      const weight = position.amount / totalValue;
      acc[position.category] = (acc[position.category] || 0) + weight;
      return acc;
    }, {} as Record<string, number>);
    const herfindahlIndex = Object.values(categoryDistribution).reduce((sum, weight) => sum + Math.pow(weight, 2), 0);
    const diversificationScore = Math.max(0, (1 - herfindahlIndex) * 100);

    // Correlation score (lower correlation with stocks = better)
    const avgStockCorrelation = commodityPositions.reduce((sum, position) => {
      const weight = position.amount / totalValue;
      return sum + (position.correlationToStock * weight);
    }, 0);
    const correlationScore = Math.max(0, (1 - Math.abs(avgStockCorrelation)) * 100);

    // Risk level assessment
    let riskLevel = 'Low';
    if (volatility > 20) riskLevel = 'Moderate';
    if (volatility > 30) riskLevel = 'High';
    if (volatility > 40) riskLevel = 'Very High';

    // Monthly volatility
    const monthlyVolatility = volatility / Math.sqrt(12);

    // Estimated max drawdown (approximate)
    const maxDrawdown = volatility * 2.5; // Rule of thumb for commodities

    // Commodity exposure percentage
    const commodityExposure = (totalValue / totalInvestment) * 100;

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (diversificationScore < 60) {
      recommendations.push('Consider diversifying across more commodity categories');
    }
    if (volatility > 35) {
      recommendations.push('High volatility - consider reducing position sizes or adding stable commodities');
    }
    if (inflationHedgeRating < 40) {
      recommendations.push('Low inflation hedge - add more inflation-sensitive commodities');
    }
    if (avgStockCorrelation > 0.5) {
      recommendations.push('High stock correlation - commodities may not provide effective diversification');
    }

    // Category-specific recommendations
    const energyWeight = categoryDistribution['Energy'] || 0;
    if (energyWeight > 0.4) {
      recommendations.push('High energy concentration - consider reducing for better balance');
    }
    
    const expenseRatio = commodityPositions.reduce((sum, position) => {
      const weight = position.amount / totalValue;
      return sum + (position.expenseRatio * weight);
    }, 0);
    if (expenseRatio > 0.8) {
      recommendations.push('High expense ratios - consider lower-cost commodity ETFs');
    }

    return {
      portfolioValue: totalValue,
      expectedReturn,
      volatility,
      sharpeRatio,
      inflationHedgeRating,
      diversificationScore,
      correlationScore,
      riskLevel,
      monthlyVolatility,
      maxDrawdown,
      commodityExposure,
      recommendations
    };
  }, [commodityPositions, totalInvestment]);

  const handleAnalyze = () => {
    const portfolioMetrics = analyzeCommodityPortfolio();
    setMetrics(portfolioMetrics);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return theme.status.success.text;
    if (rating >= 60) return theme.status.warning.text;
    return theme.status.error.text;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Generate performance simulation data
  const generatePerformanceData = () => {
    if (!metrics) return [];
    
    const months = investmentHorizon * 12;
    const monthlyReturn = metrics.expectedReturn / 12 / 100;
    const monthlyVol = metrics.monthlyVolatility / 100;
    
    let value = totalInvestment;
    const data = [];
    
    for (let i = 0; i <= months; i++) {
      if (i === 0) {
        data.push({ month: i, value, cumulative: 0 });
      } else {
        // Simple random walk simulation
        const shock = (Math.random() - 0.5) * monthlyVol * 2;
        value *= (1 + monthlyReturn + shock);
        const cumulative = ((value - totalInvestment) / totalInvestment) * 100;
        data.push({ month: i, value, cumulative });
      }
    }
    
    return data;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className={`w-16 h-16 ${theme.status.warning.bg} rounded-full flex items-center justify-center mx-auto`}>
          <Package className={`w-8 h-8 ${theme.status.warning.text}`} />
        </div>
        <h1 className={`${theme.typography.heading1} ${theme.textColors.primary}`}>
          Commodity Portfolio Builder
        </h1>
        <p className={`${theme.typography.body} ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Build diversified commodity exposure for inflation protection and portfolio diversification
        </p>
      </motion.div>

      {/* Portfolio Parameters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} flex items-center`}>
              <Target className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              Investment Parameters
            </CardTitle>
            <CardDescription>Configure your commodity investment strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalInvestment">Total Investment ($)</Label>
                <Input
                  id="totalInvestment"
                  type="number"
                  value={totalInvestment}
                  onChange={(e) => setTotalInvestment(Number(e.target.value))}
                  placeholder="20000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="investmentHorizon">Investment Horizon (Years)</Label>
                <Input
                  id="investmentHorizon"
                  type="number"
                  value={investmentHorizon}
                  onChange={(e) => setInvestmentHorizon(Number(e.target.value))}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <select
                  id="riskTolerance"
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value as typeof riskTolerance)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Conservative">Conservative</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Aggressive">Aggressive</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inflationTarget">Inflation Protection Target (%)</Label>
                <Input
                  id="inflationTarget"
                  type="number"
                  step="0.1"
                  value={inflationTarget}
                  onChange={(e) => setInflationTarget(Number(e.target.value))}
                  placeholder="3.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rebalanceFrequency">Rebalance Frequency</Label>
                <select
                  id="rebalanceFrequency"
                  value={rebalanceFrequency}
                  onChange={(e) => setRebalanceFrequency(e.target.value as typeof rebalanceFrequency)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annually">Annually</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Commodity Positions Configuration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center justify-between`}>
                <div className="flex items-center">
                  <Zap className={`w-5 h-5 ${theme.status.warning.text} mr-2`} />
                  Commodity Positions
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCommodityPosition}
                >
                  Add Position
                </Button>
              </CardTitle>
              <CardDescription>Configure your commodity portfolio allocations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {commodityPositions.map((position, index) => (
                  <motion.div
                    key={position.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 ${theme.backgrounds.card} rounded-lg border space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: commodityColors[position.category] }}
                        />
                        <div>
                          <input
                            type="text"
                            value={position.name}
                            onChange={(e) => updateCommodityPosition(index, 'name', e.target.value)}
                            className="font-medium bg-transparent border-none focus:outline-none text-sm"
                          />
                          <Badge variant="outline" className="ml-2">
                            {position.etfSymbol}
                          </Badge>
                        </div>
                      </div>
                      {commodityPositions.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCommodityPosition(position.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Category</Label>
                        <select
                          value={position.category}
                          onChange={(e) => updateCommodityPosition(index, 'category', e.target.value)}
                          className="w-full h-8 px-2 border border-gray-300 rounded text-sm"
                        >
                          <option value="Energy">Energy</option>
                          <option value="Metals">Metals</option>
                          <option value="Agriculture">Agriculture</option>
                          <option value="Livestock">Livestock</option>
                          <option value="Industrial">Industrial</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Amount ($)</Label>
                        <Input
                          type="number"
                          value={position.amount}
                          onChange={(e) => updateCommodityPosition(index, 'amount', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Expected Return (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={position.expectedReturn}
                          onChange={(e) => updateCommodityPosition(index, 'expectedReturn', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Volatility (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={position.volatility}
                          onChange={(e) => updateCommodityPosition(index, 'volatility', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Inflation Correlation</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="-1"
                          max="1"
                          value={position.correlationToInflation}
                          onChange={(e) => updateCommodityPosition(index, 'correlationToInflation', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Stock Correlation</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="-1"
                          max="1"
                          value={position.correlationToStock}
                          onChange={(e) => updateCommodityPosition(index, 'correlationToStock', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">ETF Symbol</Label>
                        <Input
                          type="text"
                          value={position.etfSymbol}
                          onChange={(e) => updateCommodityPosition(index, 'etfSymbol', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Expense Ratio (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={position.expenseRatio}
                          onChange={(e) => updateCommodityPosition(index, 'expenseRatio', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button 
                onClick={handleAnalyze}
                className={`w-full ${theme.buttons.primary}`}
                size="lg"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze Portfolio
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Portfolio Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                <DollarSign className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                Commodity Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={commodityPositions.map(position => ({
                        name: position.category,
                        value: position.amount,
                        fill: commodityColors[position.category]
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => 
                        `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      dataKey="value"
                    >
                      {commodityPositions.map((position) => (
                        <Cell key={position.id} fill={commodityColors[position.category]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Analysis Results */}
      {metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                <BarChart3 className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                Portfolio Analysis Results
              </CardTitle>
              <CardDescription>Comprehensive analysis of your commodity portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${theme.status.info.text}`}>
                    {metrics.expectedReturn.toFixed(1)}%
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Expected Return</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${metrics.volatility > 30 ? theme.status.warning.text : theme.status.success.text}`}>
                    {metrics.volatility.toFixed(1)}%
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Volatility</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${metrics.sharpeRatio > 0.5 ? theme.status.success.text : theme.status.warning.text}`}>
                    {metrics.sharpeRatio.toFixed(2)}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Sharpe Ratio</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${getRatingColor(metrics.inflationHedgeRating)}`}>
                    {metrics.inflationHedgeRating.toFixed(0)}/100
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Inflation Hedge</div>
                </div>
              </div>

              <Separator />

              {/* Risk and Diversification Metrics */}
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Risk & Diversification Analysis</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>Risk Level:</span>
                      <Badge 
                        variant={metrics.riskLevel === 'High' || metrics.riskLevel === 'Very High' ? 'destructive' : 'default'}
                      >
                        {metrics.riskLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>Diversification:</span>
                      <span className={`font-bold ${getRatingColor(metrics.diversificationScore)}`}>
                        {metrics.diversificationScore.toFixed(0)}/100
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>Stock Correlation:</span>
                      <span className={`font-bold ${getRatingColor(metrics.correlationScore)}`}>
                        {metrics.correlationScore.toFixed(0)}/100
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>Max Drawdown:</span>
                      <span className={`font-bold ${theme.status.error.text}`}>
                        {metrics.maxDrawdown.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Performance Projection */}
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Performance Projection</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generatePerformanceData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        label={{ value: 'Portfolio Value ($)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          name === 'value' ? formatCurrency(value) : `${value.toFixed(1)}%`,
                          name === 'value' ? 'Portfolio Value' : 'Cumulative Return'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <Separator />

              {/* Recommendations */}
              {metrics.recommendations.length > 0 && (
                <div className={`p-4 ${theme.status.warning.bg}/10 border ${theme.status.warning.border} rounded-lg`}>
                  <h5 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center`}>
                    <AlertTriangle className={`w-4 h-4 ${theme.status.warning.text} mr-2`} />
                    Portfolio Recommendations
                  </h5>
                  <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                    {metrics.recommendations.map((recommendation, index) => (
                      <li key={index}>• {recommendation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Educational Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card className={`${theme.status.info.bg}/10 border ${theme.status.info.border}`}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} flex items-center`}>
              <Info className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              Commodity Investment Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Commodity Benefits:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• <span className="font-medium">Inflation Protection:</span> Prices often rise with inflation</li>
                  <li>• <span className="font-medium">Diversification:</span> Low correlation with stocks/bonds</li>
                  <li>• <span className="font-medium">Crisis Hedge:</span> Often perform well during market stress</li>
                  <li>• <span className="font-medium">Supply/Demand Dynamics:</span> Limited supply, growing demand</li>
                </ul>
              </div>
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Key Considerations:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• <span className="font-medium">Volatility:</span> Commodities can be highly volatile</li>
                  <li>• <span className="font-medium">No Income:</span> Most don&apos;t pay dividends or interest</li>
                  <li>• <span className="font-medium">Storage Costs:</span> ETFs may have higher expense ratios</li>
                  <li>• <span className="font-medium">Contango Risk:</span> Futures-based ETFs may lose value over time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
