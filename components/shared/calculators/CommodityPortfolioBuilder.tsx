'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, AlertTriangle, Info, Target, BarChart3, 
  Package, Plus, Minus, TrendingUp, Settings
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import CalculatorWrapper from './CalculatorWrapper';

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
  // Commodity Positions with enhanced defaults
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
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updatePositionAmount = (id: number, amount: number) => {
    setCommodityPositions(prev => 
      prev.map(position => 
        position.id === id ? { ...position, amount: Math.max(0, amount) } : position
      )
    );
  };

  const addCommodityPosition = () => {
    const nextId = Math.max(...commodityPositions.map(p => p.id)) + 1;
    const newPosition: CommodityPosition = {
      id: nextId,
      name: 'Custom Commodity',
      category: 'Metals',
      allocation: 5,
      currentPrice: 50.00,
      expectedReturn: 6.0,
      volatility: 25.0,
      correlationToInflation: 0.40,
      correlationToStock: 0.20,
      amount: 1000,
      etfSymbol: 'CUSTOM',
      expenseRatio: 0.75
    };
    setCommodityPositions([...commodityPositions, newPosition]);
  };

  const removeCommodityPosition = (id: number) => {
    if (commodityPositions.length > 1) {
      setCommodityPositions(commodityPositions.filter(position => position.id !== id));
    }
  };

  const calculatePortfolioMetrics = useCallback((): CommodityMetrics => {
    const totalValue = commodityPositions.reduce((sum, position) => sum + position.amount, 0);
    
    if (totalValue === 0) {
      return {
        portfolioValue: 0,
        expectedReturn: 0,
        volatility: 0,
        sharpeRatio: 0,
        inflationHedgeRating: 0,
        diversificationScore: 0,
        correlationScore: 0,
        riskLevel: 'Low',
        monthlyVolatility: 0,
        maxDrawdown: 0,
        commodityExposure: 0,
        recommendations: ['Add commodity positions to analyze portfolio']
      };
    }

    // Expected return calculation
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
      recommendations.push('Consider diversifying across more commodity categories for better risk management');
    }
    if (volatility > 35) {
      recommendations.push('High volatility detected - consider reducing position sizes or adding stable commodities like gold');
    }
    if (inflationHedgeRating < 40) {
      recommendations.push('Low inflation hedge - add more inflation-sensitive commodities like energy or agriculture');
    }
    if (avgStockCorrelation > 0.5) {
      recommendations.push('High stock correlation - commodities may not provide effective portfolio diversification');
    }

    // Category-specific recommendations
    const energyWeight = categoryDistribution['Energy'] || 0;
    if (energyWeight > 0.4) {
      recommendations.push('High energy concentration - consider reducing for better sector balance');
    }
    
    const expenseRatio = commodityPositions.reduce((sum, position) => {
      const weight = position.amount / totalValue;
      return sum + (position.expenseRatio * weight);
    }, 0);
    if (expenseRatio > 0.8) {
      recommendations.push('High expense ratios detected - consider lower-cost commodity ETFs to improve returns');
    }

    // Enhanced recommendations based on risk tolerance
    if (riskTolerance === 'Conservative' && volatility > 25) {
      recommendations.push('Portfolio volatility may be too high for conservative risk tolerance - increase stable commodities');
    }
    if (riskTolerance === 'Aggressive' && expectedReturn < 8) {
      recommendations.push('Expected return may be low for aggressive profile - consider higher-return commodities');
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
  }, [commodityPositions, totalInvestment, riskTolerance]);

  const handleAnalyzePortfolio = async () => {
    setIsAnalyzing(true);
    // Simulate analysis time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const portfolioMetrics = calculatePortfolioMetrics();
    setMetrics(portfolioMetrics);
    setShowAnalysis(true);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setShowAnalysis(false);
    setMetrics(null);
  };

  // Results formatting for CalculatorWrapper
  const portfolioResults = metrics ? {
    primary: {
      label: 'Expected Return',
      value: metrics.expectedReturn / 100,
      format: 'percentage' as const
    },
    secondary: [
      {
        label: 'Portfolio Volatility',
        value: metrics.volatility / 100,
        format: 'percentage' as const
      },
      {
        label: 'Sharpe Ratio',
        value: metrics.sharpeRatio,
        format: 'number' as const
      },
      {
        label: 'Inflation Hedge Rating',
        value: metrics.inflationHedgeRating,
        format: 'number' as const
      },
      {
        label: 'Diversification Score',
        value: metrics.diversificationScore,
        format: 'number' as const
      }
    ]
  } : undefined;

  // Chart colors
  const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <CalculatorWrapper
      metadata={{
        id: 'commodity-portfolio-builder',
        title: 'Commodity Portfolio Builder',
        description: 'Build and analyze a diversified commodity portfolio for inflation protection and portfolio diversification',
        category: 'advanced'
      }}
      results={portfolioResults}
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* Portfolio Settings */}
        <Card className={theme.utils.glass('normal')}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} flex items-center`}>
              <Settings className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              Portfolio Configuration
            </CardTitle>
            <CardDescription className={theme.textColors.secondary}>
              Set your investment parameters and risk preferences for commodity allocation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="totalInvestment" className={theme.textColors.primary}>
                  Total Investment Amount
                </Label>
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                  <Input
                    id="totalInvestment"
                    type="number"
                    value={totalInvestment}
                    onChange={(e) => setTotalInvestment(parseInt(e.target.value) || 0)}
                    className={`${theme.utils.input()} pl-8`}
                    min="1000"
                    step="1000"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="investmentHorizon" className={theme.textColors.primary}>
                  Investment Horizon (Years)
                </Label>
                <Input
                  id="investmentHorizon"
                  type="number"
                  value={investmentHorizon}
                  onChange={(e) => setInvestmentHorizon(parseInt(e.target.value) || 1)}
                  className={theme.utils.input()}
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <Label htmlFor="inflationTarget" className={theme.textColors.primary}>
                  Inflation Target (%)
                </Label>
                <Input
                  id="inflationTarget"
                  type="number"
                  step="0.1"
                  value={inflationTarget}
                  onChange={(e) => setInflationTarget(parseFloat(e.target.value) || 3.0)}
                  className={theme.utils.input()}
                  min="0"
                  max="10"
                />
              </div>
            </div>
            
            <Separator className={theme.borderColors.primary} />
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className={theme.textColors.primary}>Risk Tolerance</Label>
                <div className="flex space-x-2 mt-2">
                  {(['Conservative', 'Moderate', 'Aggressive'] as const).map((risk) => (
                    <Button
                      key={risk}
                      variant={riskTolerance === risk ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRiskTolerance(risk)}
                      className={riskTolerance === risk ? theme.utils.button('primary', 'sm') : theme.utils.button('secondary', 'sm')}
                    >
                      {risk}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label className={theme.textColors.primary}>Rebalance Frequency</Label>
                <div className="flex space-x-2 mt-2">
                  {(['Monthly', 'Quarterly', 'Annually'] as const).map((freq) => (
                    <Button
                      key={freq}
                      variant={rebalanceFrequency === freq ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRebalanceFrequency(freq)}
                      className={rebalanceFrequency === freq ? theme.utils.button('accent', 'sm') : theme.utils.button('secondary', 'sm')}
                    >
                      {freq}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commodity Positions */}
        <Card className={theme.utils.glass('normal')}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} flex items-center justify-between`}>
              <div className="flex items-center">
                <Package className={`w-5 h-5 ${theme.status.warning.text} mr-2`} />
                Commodity Positions
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={`${theme.status.warning.text} border-current`}>
                  {commodityPositions.length} Commodities
                </Badge>
                <Button
                  onClick={addCommodityPosition}
                  size="sm"
                  className={theme.utils.button('secondary', 'sm')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Position
                </Button>
              </div>
            </CardTitle>
            <CardDescription className={theme.textColors.secondary}>
              Configure your commodity allocations across different sectors for optimal diversification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {commodityPositions.map((position, index) => (
              <motion.div 
                key={position.id} 
                className={`${theme.utils.glass('soft')} p-4 space-y-3 ${theme.interactive.hoverSoft}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1 font-medium ${
                        position.category === 'Energy' ? `${theme.status.warning.text} border-current` :
                        position.category === 'Metals' ? `${theme.status.success.text} border-current` :
                        position.category === 'Agriculture' ? `${theme.status.info.text} border-current` :
                        `${theme.textColors.secondary} border-current`
                      }`}
                    >
                      {position.category}
                    </Badge>
                    <span className={`font-semibold ${theme.textColors.primary} text-lg`}>
                      {position.name}
                    </span>
                    <Badge variant="outline" className={`${theme.textColors.muted} text-xs`}>
                      {position.etfSymbol}
                    </Badge>
                    {position.correlationToInflation > 0.5 && (
                      <Badge className={`${theme.status.success.bg} ${theme.status.success.text} border-none text-xs`}>
                        Inflation Hedge
                      </Badge>
                    )}
                  </div>
                  {commodityPositions.length > 1 && (
                    <Button
                      onClick={() => removeCommodityPosition(position.id)}
                      size="sm"
                      variant="outline"
                      className={`${theme.buttons.ghost} hover:${theme.status.error.bg} hover:${theme.status.error.text}`}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label className={`${theme.textColors.primary} text-sm font-medium`}>
                      Investment Amount
                    </Label>
                    <div className="relative">
                      <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-sm`}>$</span>
                      <Input
                        type="number"
                        value={position.amount}
                        onChange={(e) => updatePositionAmount(position.id, parseInt(e.target.value) || 0)}
                        className={`${theme.utils.input()} pl-8`}
                        min="0"
                        step="100"
                      />
                    </div>
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                    <p><span className="font-medium text-white">Expected Return:</span> {position.expectedReturn}%</p>
                    <p><span className="font-medium text-white">Volatility:</span> {position.volatility}%</p>
                    <p><span className="font-medium text-white">Current Price:</span> ${position.currentPrice}</p>
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                    <p><span className="font-medium text-white">Inflation Correlation:</span> {position.correlationToInflation}</p>
                    <p><span className="font-medium text-white">Stock Correlation:</span> {position.correlationToStock}</p>
                    <p><span className="font-medium text-white">Expense Ratio:</span> {position.expenseRatio}%</p>
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>
                    <p><span className="font-medium text-white">Portfolio Weight:</span></p>
                    <p className={`text-lg font-semibold ${theme.textColors.primary}`}>
                      {((position.amount / commodityPositions.reduce((sum, p) => sum + p.amount, 0)) * 100 || 0).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Analyze Button */}
        <motion.div 
          className="text-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleAnalyzePortfolio}
            disabled={isAnalyzing}
            size="lg"
            className={`${theme.utils.button('primary', 'lg')} min-w-[200px] ${theme.interactive.glow}`}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="w-5 h-5 mr-2" />
                Analyze Portfolio
              </>
            )}
          </Button>
          {!showAnalysis && (
            <p className={`${theme.textColors.muted} text-sm mt-2`}>
              Get comprehensive analysis of your commodity portfolio&apos;s risk-return profile
            </p>
          )}
        </motion.div>

        {/* Analysis Results */}
        {showAnalysis && metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Portfolio Overview */}
            <Card className={theme.utils.glass('normal')}>
              <CardHeader>
                <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                  <TrendingUp className={`w-5 h-5 ${theme.status.success.text} mr-2`} />
                  Portfolio Analysis Overview
                </CardTitle>
                <CardDescription className={theme.textColors.secondary}>
                  Comprehensive risk-return analysis of your commodity portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Portfolio Allocation Chart */}
                  <div>
                    <h5 className={`font-semibold ${theme.textColors.primary} mb-4`}>
                      Commodity Allocation
                    </h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={commodityPositions.map((position, index) => ({
                            name: position.name,
                            value: position.amount,
                            category: position.category,
                            color: COLORS[index % COLORS.length]
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => {
                            const total = commodityPositions.reduce((sum, p) => sum + p.amount, 0);
                            const percentage = (((value || 0) / total) * 100).toFixed(1);
                            return `${name}: ${percentage}%`;
                          }}
                        >
                          {commodityPositions.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Investment']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-4">
                    <h5 className={`font-semibold ${theme.textColors.primary} mb-4`}>
                      Key Portfolio Metrics
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`${theme.utils.glass('soft')} p-3 text-center`}>
                        <p className={`text-2xl font-bold ${theme.status.success.text}`}>
                          {metrics.expectedReturn.toFixed(1)}%
                        </p>
                        <p className={`text-sm ${theme.textColors.secondary}`}>Expected Return</p>
                      </div>
                      <div className={`${theme.utils.glass('soft')} p-3 text-center`}>
                        <p className={`text-2xl font-bold ${
                          metrics.volatility < 25 ? theme.status.success.text :
                          metrics.volatility < 35 ? theme.status.warning.text : theme.status.error.text
                        }`}>
                          {metrics.volatility.toFixed(1)}%
                        </p>
                        <p className={`text-sm ${theme.textColors.secondary}`}>Volatility</p>
                      </div>
                      <div className={`${theme.utils.glass('soft')} p-3 text-center`}>
                        <p className={`text-2xl font-bold ${
                          metrics.sharpeRatio > 0.5 ? theme.status.success.text :
                          metrics.sharpeRatio > 0.2 ? theme.status.warning.text : theme.status.error.text
                        }`}>
                          {metrics.sharpeRatio.toFixed(2)}
                        </p>
                        <p className={`text-sm ${theme.textColors.secondary}`}>Sharpe Ratio</p>
                      </div>
                      <div className={`${theme.utils.glass('soft')} p-3 text-center`}>
                        <p className={`text-2xl font-bold ${
                          metrics.inflationHedgeRating > 50 ? theme.status.success.text :
                          metrics.inflationHedgeRating > 30 ? theme.status.warning.text : theme.status.error.text
                        }`}>
                          {metrics.inflationHedgeRating.toFixed(0)}
                        </p>
                        <p className={`text-sm ${theme.textColors.secondary}`}>Inflation Hedge</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {metrics.recommendations.length > 0 && (
              <Card className={`${theme.status.info.bg}/10 border ${theme.status.info.border}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                    <AlertTriangle className={`w-5 h-5 ${theme.status.warning.text} mr-2`} />
                    Portfolio Recommendations
                  </CardTitle>
                  <CardDescription className={theme.textColors.secondary}>
                    AI-powered suggestions to optimize your commodity portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.recommendations.map((recommendation, index) => (
                      <motion.div
                        key={index}
                        className={`${theme.utils.glass('soft')} p-3 flex items-start space-x-3`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`w-2 h-2 rounded-full ${theme.status.warning.bg} mt-2 flex-shrink-0`}></div>
                        <p className={`${theme.textColors.secondary} leading-relaxed`}>
                          {recommendation}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Educational Content */}
        <Card className={`${theme.status.info.bg}/10 border ${theme.status.info.border} ${theme.interactive.glow}`}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} flex items-center`}>
              <Info className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              Commodity Investment Guide
            </CardTitle>
            <CardDescription className={theme.textColors.secondary}>
              Essential knowledge for commodity portfolio construction and risk management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className={`${theme.utils.glass('soft')} p-4`}>
                <h5 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
                  <Zap className={`w-4 h-4 ${theme.status.warning.text} mr-2`} />
                  Energy Commodities
                </h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-2`}>
                  <li>• <span className="font-medium text-white">Oil & Gas:</span> High volatility, inflation sensitive</li>
                  <li>• <span className="font-medium text-white">Seasonality:</span> Weather and demand patterns</li>
                  <li>• <span className="font-medium text-white">Geopolitics:</span> Supply disruption risks</li>
                  <li>• <span className="font-medium text-white">Storage Costs:</span> Contango and backwardation</li>
                </ul>
              </div>
              <div className={`${theme.utils.glass('soft')} p-4`}>
                <h5 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
                  <Target className={`w-4 h-4 ${theme.status.success.text} mr-2`} />
                  Metals Portfolio
                </h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-2`}>
                  <li>• <span className="font-medium text-white">Precious Metals:</span> Store of value, crisis hedge</li>
                  <li>• <span className="font-medium text-white">Industrial Metals:</span> Economic growth exposure</li>
                  <li>• <span className="font-medium text-white">Low Correlation:</span> Portfolio diversification</li>
                  <li>• <span className="font-medium text-white">Currency Hedge:</span> Dollar weakness protection</li>
                </ul>
              </div>
              <div className={`${theme.utils.glass('soft')} p-4`}>
                <h5 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
                  <Package className={`w-4 h-4 ${theme.status.info.text} mr-2`} />
                  Agriculture & Livestock
                </h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-2`}>
                  <li>• <span className="font-medium text-white">Food Security:</span> Population growth demand</li>
                  <li>• <span className="font-medium text-white">Weather Risk:</span> Climate impact on prices</li>
                  <li>• <span className="font-medium text-white">Seasonal Patterns:</span> Harvest cycle effects</li>
                  <li>• <span className="font-medium text-white">Biofuel Demand:</span> Energy sector linkage</li>
                </ul>
              </div>
            </div>

            {/* Risk Management Section */}
            <div className={`${theme.utils.glass('soft')} p-4`}>
              <h5 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
                <AlertTriangle className={`w-4 h-4 ${theme.status.error.text} mr-2`} />
                Risk Management Best Practices
              </h5>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className={theme.textColors.secondary}>
                  <span className="font-medium text-white block mb-1">Diversification:</span>
                  Spread investments across multiple commodity categories to reduce concentration risk and improve risk-adjusted returns.
                </div>
                <div className={theme.textColors.secondary}>
                  <span className="font-medium text-white block mb-1">Volatility Management:</span>
                  Monitor portfolio volatility and adjust position sizes based on your risk tolerance and investment horizon.
                </div>
                <div className={theme.textColors.secondary}>
                  <span className="font-medium text-white block mb-1">Rebalancing:</span>
                  Regular rebalancing helps maintain target allocations and can improve long-term returns through disciplined selling high and buying low.
                </div>
                <div className={theme.textColors.secondary}>
                  <span className="font-medium text-white block mb-1">Cost Awareness:</span>
                  ETF expense ratios and tracking errors can significantly impact returns over time. Choose cost-efficient vehicles when possible.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorWrapper>
  );
}
