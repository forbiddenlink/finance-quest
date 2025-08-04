'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Target, BarChart3, 
  Shuffle, Settings, Plus, Minus, Info
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import CalculatorWrapper from './CalculatorWrapper';

interface AlternativeAsset {
  id: number;
  name: string;
  category: 'REITs' | 'Commodities' | 'Crypto' | 'Private Equity' | 'Hedge Funds' | 'Infrastructure' | 'Art/Collectibles' | 'Peer-to-Peer';
  currentAllocation: number;
  targetAllocation: number;
  expectedReturn: number;
  volatility: number;
  correlationToStocks: number;
  correlationToBonds: number;
  liquidityRating: number;
  minimumInvestment: number;
  expenseRatio: number;
  accessibilityRating: number;
}

interface PortfolioMetrics {
  totalValue: number;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  diversificationScore: number;
  correlationScore: number;
  liquidityScore: number;
  altAllocation: number;
  efficientFrontierScore: number;
  riskAdjustedReturn: number;
  maxDrawdown: number;
  recommendations: string[];
  optimizedAllocation: OptimizedAllocation[];
}

interface OptimizedAllocation {
  category: string;
  current: number;
  suggested: number;
  difference: number;
  reasoning: string;
}

export default function AlternativeInvestmentPortfolioOptimizer() {
  const [portfolioValue, setPortfolioValue] = useState<string>('500000');
  const [stockAllocation, setStockAllocation] = useState<number>(60);
  const [bondAllocation, setBondAllocation] = useState<number>(25);
  const [riskTolerance, setRiskTolerance] = useState<'Conservative' | 'Moderate' | 'Aggressive'>('Moderate');
  const [liquidityNeeds, setLiquidityNeeds] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [optimizationGoal, setOptimizationGoal] = useState<'Return' | 'Risk' | 'Sharpe'>('Sharpe');
  const [timeHorizon, setTimeHorizon] = useState<number>(10);
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [showOptimization, setShowOptimization] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Default alternative assets
  const [alternativeAssets, setAlternativeAssets] = useState<AlternativeAsset[]>([
    {
      id: 1,
      name: 'Real Estate Investment Trusts',
      category: 'REITs',
      currentAllocation: 15,
      targetAllocation: 12,
      expectedReturn: 8.5,
      volatility: 22,
      correlationToStocks: 0.65,
      correlationToBonds: 0.25,
      liquidityRating: 90,
      minimumInvestment: 100,
      expenseRatio: 0.60,
      accessibilityRating: 95
    },
    {
      id: 2,
      name: 'Commodity ETFs',
      category: 'Commodities',
      currentAllocation: 8,
      targetAllocation: 10,
      expectedReturn: 6.2,
      volatility: 28,
      correlationToStocks: 0.25,
      correlationToBonds: -0.10,
      liquidityRating: 85,
      minimumInvestment: 100,
      expenseRatio: 0.75,
      accessibilityRating: 90
    },
    {
      id: 3,
      name: 'Cryptocurrency',
      category: 'Crypto',
      currentAllocation: 5,
      targetAllocation: 3,
      expectedReturn: 15.0,
      volatility: 75,
      correlationToStocks: 0.35,
      correlationToBonds: 0.05,
      liquidityRating: 95,
      minimumInvestment: 10,
      expenseRatio: 0.50,
      accessibilityRating: 85
    },
    {
      id: 4,
      name: 'Infrastructure Debt',
      category: 'Infrastructure',
      currentAllocation: 7,
      targetAllocation: 8,
      expectedReturn: 7.5,
      volatility: 15,
      correlationToStocks: 0.40,
      correlationToBonds: 0.60,
      liquidityRating: 60,
      minimumInvestment: 25000,
      expenseRatio: 1.20,
      accessibilityRating: 60
    }
  ]);

  const updateAssetAllocation = (id: number, allocation: number) => {
    setAlternativeAssets(prev => 
      prev.map(asset => 
        asset.id === id ? { ...asset, currentAllocation: allocation } : asset
      )
    );
  };

  const addAlternativeAsset = () => {
    const nextId = Math.max(...alternativeAssets.map(a => a.id)) + 1;
    const newAsset: AlternativeAsset = {
      id: nextId,
      name: 'Custom Alternative',
      category: 'Private Equity',
      currentAllocation: 5,
      targetAllocation: 5,
      expectedReturn: 8.0,
      volatility: 20.0,
      correlationToStocks: 0.50,
      correlationToBonds: 0.30,
      liquidityRating: 70,
      minimumInvestment: 1000,
      expenseRatio: 1.00,
      accessibilityRating: 75
    };
    setAlternativeAssets([...alternativeAssets, newAsset]);
  };

  const removeAlternativeAsset = (id: number) => {
    if (alternativeAssets.length > 1) {
      setAlternativeAssets(alternativeAssets.filter(asset => asset.id !== id));
    }
  };

  const optimizePortfolio = useCallback((): PortfolioMetrics => {
    const totalAltAllocation = alternativeAssets.reduce((sum, asset) => sum + asset.currentAllocation, 0);
    
    // Calculate portfolio metrics
    const portfolioReturn = 
      (stockAllocation / 100) * 10 + // Assume 10% stock return
      (bondAllocation / 100) * 4 + // Assume 4% bond return
      alternativeAssets.reduce((sum, asset) => sum + (asset.currentAllocation / 100) * asset.expectedReturn, 0);

    // Portfolio volatility calculation (simplified correlation matrix)
    let portfolioVariance = 0;
    const stockVol = 16; // Stock volatility
    const bondVol = 6; // Bond volatility
    
    // Traditional assets variance
    portfolioVariance += Math.pow((stockAllocation / 100) * stockVol, 2);
    portfolioVariance += Math.pow((bondAllocation / 100) * bondVol, 2);
    portfolioVariance += 2 * (stockAllocation / 100) * (bondAllocation / 100) * stockVol * bondVol * 0.1; // Stock-bond correlation
    
    // Alternative assets variance and covariance
    for (let i = 0; i < alternativeAssets.length; i++) {
      const assetI = alternativeAssets[i];
      const weightI = assetI.currentAllocation / 100;
      const volI = assetI.volatility;
      
      // Self variance
      portfolioVariance += Math.pow(weightI * volI, 2);
      
      // Correlation with stocks
      portfolioVariance += 2 * (stockAllocation / 100) * weightI * stockVol * volI * assetI.correlationToStocks;
      
      // Correlation with bonds
      portfolioVariance += 2 * (bondAllocation / 100) * weightI * bondVol * volI * assetI.correlationToBonds;
      
      // Correlation with other alternatives
      for (let j = i + 1; j < alternativeAssets.length; j++) {
        const assetJ = alternativeAssets[j];
        const weightJ = assetJ.currentAllocation / 100;
        const volJ = assetJ.volatility;
        
        // Estimate correlation between alternatives based on category similarity
        let correlation = 0.3; // Base correlation
        if (assetI.category === assetJ.category) correlation = 0.7;
        
        portfolioVariance += 2 * weightI * weightJ * volI * volJ * correlation;
      }
    }
    
    const volatility = Math.sqrt(portfolioVariance);
    
    // Sharpe ratio
    const riskFreeRate = 3.0;
    const sharpeRatio = (portfolioReturn - riskFreeRate) / volatility;

    // Diversification score
    const allocations = [
      stockAllocation / 100,
      bondAllocation / 100,
      ...alternativeAssets.map(a => a.currentAllocation / 100)
    ];
    const herfindahlIndex = allocations.reduce((sum, weight) => sum + Math.pow(weight, 2), 0);
    const diversificationScore = Math.max(0, (1 - herfindahlIndex) * 100);

    // Correlation score (lower correlation with traditional assets = better)
    const avgStockCorrelation = alternativeAssets.reduce((sum, asset) => {
      const weight = asset.currentAllocation / totalAltAllocation;
      return sum + (asset.correlationToStocks * weight);
    }, 0);
    const correlationScore = Math.max(0, (1 - avgStockCorrelation) * 100);

    // Liquidity score
    const liquidityScore = alternativeAssets.reduce((sum, asset) => {
      const weight = asset.currentAllocation / totalAltAllocation;
      return sum + (asset.liquidityRating * weight);
    }, 0);

    // Efficient frontier score (risk-adjusted return relative to optimal)
    const efficientFrontierScore = Math.min(100, (sharpeRatio / 1.5) * 100); // 1.5 as target Sharpe

    // Risk-adjusted return
    const riskAdjustedReturn = portfolioReturn / volatility;

    // Max drawdown estimate
    const maxDrawdown = volatility * 2.5; // Rule of thumb

    // Generate optimization recommendations
    const optimizedAllocation: OptimizedAllocation[] = [];
    const recommendations: string[] = [];

    // Optimization logic based on goal
    alternativeAssets.forEach(asset => {
      let suggestedAllocation = asset.currentAllocation;
      let reasoning = '';

      if (optimizationGoal === 'Sharpe') {
        // Favor assets with high return-to-vol ratio and low correlation
        const sharpeContribution = (asset.expectedReturn - riskFreeRate) / asset.volatility;
        const diversificationBenefit = 1 - asset.correlationToStocks;
        const score = sharpeContribution * diversificationBenefit;
        
        if (score > 0.3 && asset.liquidityRating >= 70) {
          suggestedAllocation = Math.min(asset.currentAllocation + 2, 15);
          reasoning = 'High risk-adjusted return with good diversification';
        } else if (score < 0.2) {
          suggestedAllocation = Math.max(asset.currentAllocation - 1, 1);
          reasoning = 'Low risk-adjusted return';
        } else {
          reasoning = 'Maintain current allocation';
        }
      } else if (optimizationGoal === 'Return') {
        if (asset.expectedReturn > 10 && riskTolerance === 'Aggressive') {
          suggestedAllocation = Math.min(asset.currentAllocation + 3, 20);
          reasoning = 'High expected return for aggressive profile';
        } else if (asset.expectedReturn < 6) {
          suggestedAllocation = Math.max(asset.currentAllocation - 2, 1);
          reasoning = 'Low expected return';
        } else {
          reasoning = 'Balanced return profile';
        }
      } else { // Risk optimization
        if (asset.volatility < 20 && asset.correlationToStocks < 0.5) {
          suggestedAllocation = Math.min(asset.currentAllocation + 2, 12);
          reasoning = 'Low volatility with good diversification';
        } else if (asset.volatility > 50) {
          suggestedAllocation = Math.max(asset.currentAllocation - 2, 1);
          reasoning = 'High volatility';
        } else {
          reasoning = 'Moderate risk profile';
        }
      }

      // Adjust for liquidity needs
      if (liquidityNeeds === 'High' && asset.liquidityRating < 60) {
        suggestedAllocation = Math.max(suggestedAllocation - 2, 1);
        reasoning += ' (reduced for liquidity needs)';
      }

      // Adjust for accessibility
      if (asset.accessibilityRating < 50 && parseFloat(portfolioValue) < 1000000) {
        suggestedAllocation = Math.max(suggestedAllocation - 1, 0);
        reasoning += ' (limited accessibility)';
      }

      optimizedAllocation.push({
        category: asset.name,
        current: asset.currentAllocation,
        suggested: suggestedAllocation,
        difference: suggestedAllocation - asset.currentAllocation,
        reasoning
      });
    });

    // Generate general recommendations
    if (totalAltAllocation < 15 && riskTolerance !== 'Conservative') {
      recommendations.push('Consider increasing alternative allocation for better diversification');
    }
    if (totalAltAllocation > 40) {
      recommendations.push('High alternative allocation may increase complexity and costs');
    }
    if (avgStockCorrelation > 0.7) {
      recommendations.push('Alternatives show high correlation with stocks - consider different asset classes');
    }
    if (liquidityScore < 60 && liquidityNeeds === 'High') {
      recommendations.push('Portfolio liquidity may not meet your needs - consider more liquid alternatives');
    }

    const avgExpenseRatio = alternativeAssets.reduce((sum, asset) => {
      const weight = asset.currentAllocation / totalAltAllocation;
      return sum + (asset.expenseRatio * weight);
    }, 0);
    if (avgExpenseRatio > 1.5) {
      recommendations.push('High expense ratios may erode returns - consider lower-cost options');
    }

    // Risk tolerance specific recommendations
    if (riskTolerance === 'Conservative' && volatility > 12) {
      recommendations.push('Portfolio volatility may be too high for conservative risk tolerance');
    }
    if (riskTolerance === 'Aggressive' && sharpeRatio < 0.8) {
      recommendations.push('Consider higher-return alternatives to improve risk-adjusted returns');
    }

    return {
      totalValue: parseFloat(portfolioValue),
      expectedReturn: portfolioReturn,
      volatility,
      sharpeRatio,
      diversificationScore,
      correlationScore,
      liquidityScore,
      altAllocation: totalAltAllocation,
      efficientFrontierScore,
      riskAdjustedReturn,
      maxDrawdown,
      recommendations,
      optimizedAllocation
    };
  }, [alternativeAssets, portfolioValue, stockAllocation, bondAllocation, riskTolerance, liquidityNeeds, optimizationGoal]);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    // Simulate optimization calculation time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const portfolioMetrics = optimizePortfolio();
    setMetrics(portfolioMetrics);
    setShowOptimization(true);
    setIsOptimizing(false);
  };

  // Generate radar chart data for portfolio characteristics
  const generateRadarData = () => {
    if (!metrics) return [];
    
    return [
      {
        subject: 'Expected Return',
        current: Math.min(metrics.expectedReturn * 10, 100),
        optimal: 75,
        fullMark: 100
      },
      {
        subject: 'Risk Management',
        current: Math.max(0, 100 - metrics.volatility * 2),
        optimal: 80,
        fullMark: 100
      },
      {
        subject: 'Diversification',
        current: metrics.diversificationScore,
        optimal: 85,
        fullMark: 100
      },
      {
        subject: 'Liquidity',
        current: metrics.liquidityScore,
        optimal: liquidityNeeds === 'High' ? 90 : liquidityNeeds === 'Medium' ? 75 : 60,
        fullMark: 100
      },
      {
        subject: 'Correlation',
        current: metrics.correlationScore,
        optimal: 75,
        fullMark: 100
      },
      {
        subject: 'Efficiency',
        current: metrics.efficientFrontierScore,
        optimal: 85,
        fullMark: 100
      }
    ];
  };

  // Results formatting
  const portfolioResults = metrics ? {
    primary: {
      label: 'Portfolio Expected Return',
      value: metrics.expectedReturn / 100,
      format: 'percentage' as const
    },
    secondary: [
      {
        label: 'Sharpe Ratio',
        value: metrics.sharpeRatio,
        format: 'number' as const
      },
      {
        label: 'Volatility',
        value: metrics.volatility / 100,
        format: 'percentage' as const
      },
      {
        label: 'Diversification Score',
        value: metrics.diversificationScore,
        format: 'number' as const
      },
      {
        label: 'Alternative Allocation',
        value: metrics.altAllocation / 100,
        format: 'percentage' as const
      }
    ]
  } : undefined;

  // Color scheme for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Metadata
  const metadata = {
    id: 'alternative-investment-portfolio-optimizer',
    title: 'Alternative Investment Portfolio Optimizer',
    description: 'Optimize your portfolio with alternative investments for better diversification and risk-adjusted returns',
    category: 'advanced' as const
  };

  return (
    <CalculatorWrapper
      metadata={metadata}
      results={portfolioResults}
      onReset={() => {
        setPortfolioValue('500000');
        setStockAllocation(60);
        setBondAllocation(25);
        setRiskTolerance('Moderate');
        setLiquidityNeeds('Medium');
        setOptimizationGoal('Sharpe');
        setTimeHorizon(10);
        setMetrics(null);
        setShowOptimization(false);
      }}
    >
      <div className="space-y-6">
        {/* Portfolio Settings */}
        <Card className={theme.utils.glass('normal')}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} flex items-center`}>
              <Settings className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              Portfolio Settings
            </CardTitle>
            <CardDescription className={theme.textColors.secondary}>
              Configure your portfolio parameters and optimization preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="portfolioValue" className={theme.textColors.primary}>
                  Portfolio Value
                </Label>
                <Input
                  id="portfolioValue"
                  type="text"
                  value={portfolioValue}
                  onChange={(e) => setPortfolioValue(e.target.value)}
                  className={theme.utils.input()}
                  placeholder="$500,000"
                />
              </div>
              <div>
                <Label htmlFor="timeHorizon" className={theme.textColors.primary}>
                  Time Horizon (Years)
                </Label>
                <Input
                  id="timeHorizon"
                  type="number"
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(parseInt(e.target.value) || 10)}
                  className={theme.utils.input()}
                  min="1"
                  max="50"
                />
              </div>
              <div>
                <Label className={theme.textColors.primary}>
                  Optimization Goal
                </Label>
                <div className="flex space-x-2 mt-1">
                  {(['Return', 'Risk', 'Sharpe'] as const).map((goal) => (
                    <Button
                      key={goal}
                      variant={optimizationGoal === goal ? "default" : "outline"}
                      size="sm"
                      onClick={() => setOptimizationGoal(goal)}
                      className={optimizationGoal === goal ? theme.buttons.primary : theme.buttons.secondary}
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <Separator className={theme.borderColors.primary} />
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className={theme.textColors.primary}>
                  Risk Tolerance
                </Label>
                <div className="flex space-x-2 mt-1">
                  {(['Conservative', 'Moderate', 'Aggressive'] as const).map((risk) => (
                    <Button
                      key={risk}
                      variant={riskTolerance === risk ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRiskTolerance(risk)}
                      className={riskTolerance === risk ? theme.buttons.primary : theme.buttons.secondary}
                    >
                      {risk}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label className={theme.textColors.primary}>
                  Liquidity Needs
                </Label>
                <div className="flex space-x-2 mt-1">
                  {(['Low', 'Medium', 'High'] as const).map((liquidity) => (
                    <Button
                      key={liquidity}
                      variant={liquidityNeeds === liquidity ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLiquidityNeeds(liquidity)}
                      className={liquidityNeeds === liquidity ? theme.buttons.primary : theme.buttons.secondary}
                    >
                      {liquidity}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="stockAllocation" className={theme.textColors.primary}>
                  Stock Allocation: {stockAllocation}%
                </Label>
                <input
                  id="stockAllocation"
                  type="range"
                  min="0"
                  max="100"
                  value={stockAllocation}
                  onChange={(e) => setStockAllocation(parseInt(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bondAllocation" className={theme.textColors.primary}>
                  Bond Allocation: {bondAllocation}%
                </Label>
                <input
                  id="bondAllocation"
                  type="range"
                  min="0"
                  max="100"
                  value={bondAllocation}
                  onChange={(e) => setBondAllocation(parseInt(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
              <div className="flex items-end">
                <div className={`p-3 rounded-lg ${theme.status.info.bg}/10 border ${theme.status.info.border}`}>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Alternative Allocation: {100 - stockAllocation - bondAllocation}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optimize Button */}
        <motion.div 
          className="text-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleOptimize}
            disabled={isOptimizing}
            size="lg"
            className={`${theme.buttons.primary} px-8 py-3 min-w-[200px] ${theme.interactive.glow}`}
          >
            {isOptimizing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Optimizing...
              </>
            ) : (
              <>
                <Target className="w-5 h-5 mr-2" />
                Optimize Portfolio
              </>
            )}
          </Button>
          {!showOptimization && (
            <p className={`${theme.textColors.muted} text-sm mt-2`}>
              Analyze your portfolio allocation and get personalized recommendations
            </p>
          )}
        </motion.div>

        {/* Alternative Assets Configuration */}
        <Card className={theme.utils.glass('normal')}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} flex items-center justify-between`}>
              <div className="flex items-center">
                <Target className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                Alternative Assets
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={`${theme.status.info.text} border-current`}>
                  {alternativeAssets.length} Assets
                </Badge>
                <Button
                  onClick={addAlternativeAsset}
                  size="sm"
                  className={theme.utils.button('secondary', 'sm')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Asset
                </Button>
              </div>
            </CardTitle>
            <CardDescription className={theme.textColors.secondary}>
              Configure your alternative investment allocations and characteristics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alternativeAssets.map((asset, index) => (
              <motion.div 
                key={asset.id} 
                className={`${theme.utils.glass('soft')} p-4 space-y-3 ${theme.interactive.hoverSoft}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="outline" 
                      className={`${theme.status.info.text} border-current px-3 py-1`}
                    >
                      {asset.category}
                    </Badge>
                    <span className={`font-medium ${theme.textColors.primary} text-lg`}>
                      {asset.name}
                    </span>
                    {asset.expectedReturn > 12 && (
                      <Badge className={`${theme.status.success.bg} ${theme.status.success.text} border-none`}>
                        High Return
                      </Badge>
                    )}
                  </div>
                  {alternativeAssets.length > 1 && (
                    <Button
                      onClick={() => removeAlternativeAsset(asset.id)}
                      size="sm"
                      variant="outline"
                      className={`${theme.buttons.ghost} hover:${theme.status.error.bg} hover:${theme.status.error.text}`}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className={theme.textColors.primary}>
                      Allocation: {asset.currentAllocation}%
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={asset.currentAllocation}
                      onChange={(e) => updateAssetAllocation(asset.id, parseInt(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                    <p>Expected Return: {asset.expectedReturn}%</p>
                    <p>Volatility: {asset.volatility}%</p>
                    <p>Stock Correlation: {asset.correlationToStocks}</p>
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                    <p>Liquidity Rating: {asset.liquidityRating}/100</p>
                    <p>Expense Ratio: {asset.expenseRatio}%</p>
                    <p>Min Investment: ${asset.minimumInvestment.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Optimization Results */}
        {showOptimization && metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Portfolio Performance Chart */}
            <Card className={theme.utils.glass('normal')}>
              <CardHeader>
                <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                  <BarChart3 className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                  Portfolio Performance Analysis
                </CardTitle>
                <CardDescription className={theme.textColors.secondary}>
                  Comprehensive analysis of your portfolio&apos;s risk-return profile and characteristics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Radar Chart */}
                  <div>
                    <h5 className={`font-medium ${theme.textColors.primary} mb-4`}>
                      Portfolio Characteristics
                    </h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={generateRadarData()}>
                        <PolarGrid gridType="polygon" className={theme.borderColors.primary} />
                        <PolarAngleAxis dataKey="subject" className={theme.textColors.secondary} />
                        <PolarRadiusAxis domain={[0, 100]} tickCount={5} className={theme.textColors.secondary} />
                        <Radar
                          name="Current"
                          dataKey="current"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Radar
                          name="Optimal"
                          dataKey="optimal"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.1}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Allocation Chart */}
                  <div>
                    <h5 className={`font-medium ${theme.textColors.primary} mb-4`}>
                      Current Allocation
                    </h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Stocks', value: stockAllocation, color: COLORS[0] },
                            { name: 'Bonds', value: bondAllocation, color: COLORS[1] },
                            ...alternativeAssets.map((asset, index) => ({
                              name: asset.name,
                              value: asset.currentAllocation,
                              color: COLORS[2 + (index % 4)]
                            }))
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {alternativeAssets.map((_, index) => (
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
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimization Recommendations */}
            <Card className={theme.utils.glass('normal')}>
              <CardHeader>
                <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                  <Shuffle className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                  Optimization Recommendations
                </CardTitle>
                <CardDescription className={theme.textColors.secondary}>
                  AI-powered recommendations to improve your portfolio&apos;s risk-adjusted returns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics.optimizedAllocation.map((allocation, index) => (
                  <motion.div 
                    key={index} 
                    className={`${theme.utils.glass('soft')} p-4 ${theme.interactive.hoverSoft}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`font-medium ${theme.textColors.primary} text-lg`}>
                        {allocation.category}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={allocation.difference > 0 ? "default" : allocation.difference < 0 ? "destructive" : "secondary"}
                          className={`px-3 py-1 font-semibold ${
                            allocation.difference > 0 
                              ? `${theme.status.success.bg} ${theme.status.success.text} border-none` 
                              : allocation.difference < 0 
                                ? `${theme.status.warning.bg} ${theme.status.warning.text} border-none`
                                : `${theme.status.neutral.bg} ${theme.status.neutral.text} border-none`
                          }`}
                        >
                          {allocation.difference > 0 ? '+' : ''}{allocation.difference.toFixed(1)}%
                        </Badge>
                        {allocation.difference > 2 && (
                          <Badge className={`${theme.status.info.bg} ${theme.status.info.text} border-none text-xs`}>
                            Strong Signal
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className={`${theme.textColors.secondary} flex items-center space-x-2`}>
                        <span className="font-medium">Current:</span>
                        <span>{allocation.current}%</span>
                      </div>
                      <div className={`${theme.textColors.secondary} flex items-center space-x-2`}>
                        <span className="font-medium">Suggested:</span>
                        <span className={allocation.difference > 0 ? theme.status.success.text : allocation.difference < 0 ? theme.status.warning.text : theme.textColors.secondary}>
                          {allocation.suggested}%
                        </span>
                      </div>
                      <div className={`${theme.textColors.secondary} italic`}>
                        {allocation.reasoning}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Educational Content */}
        <Card className={`${theme.status.info.bg}/10 border ${theme.status.info.border} ${theme.interactive.glow}`}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} flex items-center`}>
              <Info className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              Alternative Investment Guide
            </CardTitle>
            <CardDescription className={theme.textColors.secondary}>
              Essential knowledge for building a diversified alternative investment portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`${theme.utils.glass('soft')} p-4`}>
                <h5 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
                  <span className={`w-2 h-2 rounded-full ${theme.status.success.bg} mr-2`}></span>
                  Benefits of Alternatives
                </h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-2`}>
                  <li className="flex items-start space-x-2">
                    <span className={`${theme.status.success.text} mt-0.5`}>•</span>
                    <div>
                      <span className="font-medium text-white">Diversification:</span> Low correlation with traditional assets reduces overall portfolio risk
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`${theme.status.success.text} mt-0.5`}>•</span>
                    <div>
                      <span className="font-medium text-white">Inflation Hedge:</span> Many alternatives protect against inflation better than bonds
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`${theme.status.success.text} mt-0.5`}>•</span>
                    <div>
                      <span className="font-medium text-white">Return Enhancement:</span> Potential for higher risk-adjusted returns through alpha generation
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`${theme.status.success.text} mt-0.5`}>•</span>
                    <div>
                      <span className="font-medium text-white">Risk Reduction:</span> Can reduce overall portfolio volatility when properly allocated
                    </div>
                  </li>
                </ul>
              </div>
              <div className={`${theme.utils.glass('soft')} p-4`}>
                <h5 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
                  <span className={`w-2 h-2 rounded-full ${theme.status.warning.bg} mr-2`}></span>
                  Allocation Guidelines
                </h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-2`}>
                  <li className="flex items-start space-x-2">
                    <span className={`${theme.status.warning.text} mt-0.5`}>•</span>
                    <div>
                      <span className="font-medium text-white">Conservative:</span> 5-15% alternative allocation for risk-averse investors
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`${theme.status.warning.text} mt-0.5`}>•</span>
                    <div>
                      <span className="font-medium text-white">Moderate:</span> 15-30% allocation range for balanced portfolios
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`${theme.status.warning.text} mt-0.5`}>•</span>
                    <div>
                      <span className="font-medium text-white">Aggressive:</span> 30-50% for sophisticated investors with high risk tolerance
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`${theme.status.warning.text} mt-0.5`}>•</span>
                    <div>
                      <span className="font-medium text-white">Consider:</span> Liquidity needs, costs, complexity, and investment minimums
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Additional Educational Content */}
            <div className={`${theme.utils.glass('soft')} p-4`}>
              <h5 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
                <span className={`w-2 h-2 rounded-full ${theme.status.info.bg} mr-2`}></span>
                Key Risk Considerations
              </h5>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className={theme.textColors.secondary}>
                  <span className="font-medium text-white block mb-1">Liquidity Risk:</span>
                  Some alternatives may be difficult to sell quickly, especially during market stress.
                </div>
                <div className={theme.textColors.secondary}>
                  <span className="font-medium text-white block mb-1">Complexity Risk:</span>
                  Alternative investments often require more sophisticated understanding and due diligence.
                </div>
                <div className={theme.textColors.secondary}>
                  <span className="font-medium text-white block mb-1">Cost Risk:</span>
                  Higher expense ratios and fees can significantly impact long-term returns.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorWrapper>
  );
}
