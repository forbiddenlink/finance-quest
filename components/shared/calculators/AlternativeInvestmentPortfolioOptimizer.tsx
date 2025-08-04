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
  Target,
  Info,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  Shuffle,
  Settings
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

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

interface OptimizedAllocation {
  category: string;
  current: number;
  suggested: number;
  difference: number;
  reasoning: string;
}

export default function AlternativeInvestmentPortfolioOptimizer() {
  // Alternative Asset Allocations
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
      expectedReturn: 25,
      volatility: 80,
      correlationToStocks: 0.35,
      correlationToBonds: 0.05,
      liquidityRating: 75,
      minimumInvestment: 10,
      expenseRatio: 0.50,
      accessibilityRating: 85
    },
    {
      id: 4,
      name: 'Private Equity (REITs/BDCs)',
      category: 'Private Equity',
      currentAllocation: 3,
      targetAllocation: 5,
      expectedReturn: 12,
      volatility: 35,
      correlationToStocks: 0.45,
      correlationToBonds: 0.15,
      liquidityRating: 30,
      minimumInvestment: 25000,
      expenseRatio: 2.00,
      accessibilityRating: 40
    },
    {
      id: 5,
      name: 'Infrastructure Funds',
      category: 'Infrastructure',
      currentAllocation: 4,
      targetAllocation: 6,
      expectedReturn: 9.5,
      volatility: 18,
      correlationToStocks: 0.55,
      correlationToBonds: 0.35,
      liquidityRating: 60,
      minimumInvestment: 10000,
      expenseRatio: 1.25,
      accessibilityRating: 60
    },
    {
      id: 6,
      name: 'Alternative Income (MLPs, BDCs)',
      category: 'Hedge Funds',
      currentAllocation: 5,
      targetAllocation: 4,
      expectedReturn: 7.8,
      volatility: 25,
      correlationToStocks: 0.70,
      correlationToBonds: 0.40,
      liquidityRating: 70,
      minimumInvestment: 5000,
      expenseRatio: 1.50,
      accessibilityRating: 70
    }
  ]);

  // Portfolio Parameters
  const [portfolioValue, setPortfolioValue] = useState<number>(500000);
  const [stockAllocation, setStockAllocation] = useState<number>(50);
  const [bondAllocation, setBondAllocation] = useState<number>(30);
  const [riskTolerance, setRiskTolerance] = useState<'Conservative' | 'Moderate' | 'Aggressive'>('Moderate');
  const [liquidityNeeds, setLiquidityNeeds] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [optimizationGoal, setOptimizationGoal] = useState<'Return' | 'Risk' | 'Sharpe'>('Sharpe');

  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [showOptimization, setShowOptimization] = useState<boolean>(false);

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('alternative-investment-portfolio-optimizer');
  }, [recordCalculatorUsage]);

  const assetColors = {
    'REITs': '#3b82f6',
    'Commodities': '#f59e0b',
    'Crypto': '#8b5cf6',
    'Private Equity': '#ef4444',
    'Hedge Funds': '#10b981',
    'Infrastructure': '#06b6d4',
    'Art/Collectibles': '#ec4899',
    'Peer-to-Peer': '#84cc16'
  };

  const updateAlternativeAsset = (index: number, field: keyof AlternativeAsset, value: number | string) => {
    const newAssets = [...alternativeAssets];
    newAssets[index] = { ...newAssets[index], [field]: value };
    setAlternativeAssets(newAssets);
  };

  const addAlternativeAsset = () => {
    const newAsset: AlternativeAsset = {
      id: Math.max(...alternativeAssets.map(a => a.id)) + 1,
      name: `New Alternative ${alternativeAssets.length + 1}`,
      category: 'REITs',
      currentAllocation: 2,
      targetAllocation: 2,
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
      if (asset.accessibilityRating < 50 && portfolioValue < 1000000) {
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
      totalValue: portfolioValue,
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

  const handleOptimize = () => {
    const portfolioMetrics = optimizePortfolio();
    setMetrics(portfolioMetrics);
    setShowOptimization(true);
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
        optimal: 80,
        fullMark: 100
      },
      {
        subject: 'Efficiency',
        current: metrics.efficientFrontierScore,
        optimal: 90,
        fullMark: 100
      }
    ];
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
        <div className={`w-16 h-16 ${theme.status.info.bg} rounded-full flex items-center justify-center mx-auto`}>
          <PieChartIcon className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h1 className={`${theme.typography.heading1} ${theme.textColors.primary}`}>
          Alternative Investment Portfolio Optimizer
        </h1>
        <p className={`${theme.typography.body} ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Optimize your alternative investment allocation for enhanced diversification and risk-adjusted returns
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
              <Settings className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              Portfolio Configuration
            </CardTitle>
            <CardDescription>Configure your portfolio parameters and optimization goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="portfolioValue">Portfolio Value ($)</Label>
                <Input
                  id="portfolioValue"
                  type="number"
                  value={portfolioValue}
                  onChange={(e) => setPortfolioValue(Number(e.target.value))}
                  placeholder="500000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockAllocation">Stock Allocation (%)</Label>
                <Input
                  id="stockAllocation"
                  type="number"
                  value={stockAllocation}
                  onChange={(e) => setStockAllocation(Number(e.target.value))}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bondAllocation">Bond Allocation (%)</Label>
                <Input
                  id="bondAllocation"
                  type="number"
                  value={bondAllocation}
                  onChange={(e) => setBondAllocation(Number(e.target.value))}
                  placeholder="30"
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
                <Label htmlFor="liquidityNeeds">Liquidity Needs</Label>
                <select
                  id="liquidityNeeds"
                  value={liquidityNeeds}
                  onChange={(e) => setLiquidityNeeds(e.target.value as typeof liquidityNeeds)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="optimizationGoal">Optimization Goal</Label>
                <select
                  id="optimizationGoal"
                  value={optimizationGoal}
                  onChange={(e) => setOptimizationGoal(e.target.value as typeof optimizationGoal)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Sharpe">Maximize Sharpe Ratio</option>
                  <option value="Return">Maximize Return</option>
                  <option value="Risk">Minimize Risk</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alternative Assets Configuration */}
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
                  <Target className={`w-5 h-5 ${theme.status.success.text} mr-2`} />
                  Alternative Assets
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addAlternativeAsset}
                >
                  Add Asset
                </Button>
              </CardTitle>
              <CardDescription>Configure your alternative investment allocations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {alternativeAssets.map((asset, index) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 ${theme.backgrounds.card} rounded-lg border space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: assetColors[asset.category] }}
                        />
                        <div>
                          <input
                            type="text"
                            value={asset.name}
                            onChange={(e) => updateAlternativeAsset(index, 'name', e.target.value)}
                            className="font-medium bg-transparent border-none focus:outline-none text-sm"
                          />
                          <Badge variant="outline" className="ml-2">
                            {asset.category}
                          </Badge>
                        </div>
                      </div>
                      {alternativeAssets.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeAlternativeAsset(asset.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Category</Label>
                        <select
                          value={asset.category}
                          onChange={(e) => updateAlternativeAsset(index, 'category', e.target.value)}
                          className="w-full h-8 px-2 border border-gray-300 rounded text-sm"
                        >
                          <option value="REITs">REITs</option>
                          <option value="Commodities">Commodities</option>
                          <option value="Crypto">Crypto</option>
                          <option value="Private Equity">Private Equity</option>
                          <option value="Hedge Funds">Hedge Funds</option>
                          <option value="Infrastructure">Infrastructure</option>
                          <option value="Art/Collectibles">Art/Collectibles</option>
                          <option value="Peer-to-Peer">Peer-to-Peer</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Current Allocation (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={asset.currentAllocation}
                          onChange={(e) => updateAlternativeAsset(index, 'currentAllocation', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Expected Return (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={asset.expectedReturn}
                          onChange={(e) => updateAlternativeAsset(index, 'expectedReturn', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Volatility (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={asset.volatility}
                          onChange={(e) => updateAlternativeAsset(index, 'volatility', Number(e.target.value))}
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
                          value={asset.correlationToStocks}
                          onChange={(e) => updateAlternativeAsset(index, 'correlationToStocks', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Liquidity (1-100)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={asset.liquidityRating}
                          onChange={(e) => updateAlternativeAsset(index, 'liquidityRating', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Min Investment ($)</Label>
                        <Input
                          type="number"
                          value={asset.minimumInvestment}
                          onChange={(e) => updateAlternativeAsset(index, 'minimumInvestment', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Expense Ratio (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={asset.expenseRatio}
                          onChange={(e) => updateAlternativeAsset(index, 'expenseRatio', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button 
                onClick={handleOptimize}
                className={`w-full ${theme.buttons.primary}`}
                size="lg"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Optimize Portfolio
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Allocation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                <DollarSign className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                Current Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Stocks', value: stockAllocation, fill: '#3b82f6' },
                        { name: 'Bonds', value: bondAllocation, fill: '#10b981' },
                        ...alternativeAssets.map(asset => ({
                          name: asset.category,
                          value: asset.currentAllocation,
                          fill: assetColors[asset.category]
                        }))
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => 
                        `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      dataKey="value"
                    >
                      {[...alternativeAssets].map((asset) => (
                        <Cell key={asset.id} fill={assetColors[asset.category]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Allocation']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Optimization Results */}
      {metrics && showOptimization && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                <BarChart3 className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                Portfolio Optimization Results
              </CardTitle>
              <CardDescription>Optimized allocation recommendations and portfolio analysis</CardDescription>
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
                  <div className={`text-2xl font-bold ${metrics.volatility > 15 ? theme.status.warning.text : theme.status.success.text}`}>
                    {metrics.volatility.toFixed(1)}%
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Volatility</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${metrics.sharpeRatio > 1 ? theme.status.success.text : theme.status.warning.text}`}>
                    {metrics.sharpeRatio.toFixed(2)}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Sharpe Ratio</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${theme.status.info.text}`}>
                    {metrics.altAllocation.toFixed(0)}%
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Alt Allocation</div>
                </div>
              </div>

              <Separator />

              {/* Portfolio Characteristics Radar */}
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Portfolio Characteristics</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={generateRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      <Radar name="Optimal" dataKey="optimal" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <Separator />

              {/* Optimization Suggestions */}
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Optimization Suggestions</h4>
                <div className="space-y-3">
                  {metrics.optimizedAllocation.map((suggestion, index) => (
                    <div key={index} className={`p-3 ${theme.backgrounds.card} rounded-lg border`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${theme.textColors.primary}`}>
                          {suggestion.category}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${theme.textColors.secondary}`}>
                            {suggestion.current.toFixed(1)}% → {suggestion.suggested.toFixed(1)}%
                          </span>
                          <Badge 
                            variant={suggestion.difference > 0 ? "default" : suggestion.difference < 0 ? "destructive" : "secondary"}
                          >
                            {suggestion.difference > 0 ? '+' : ''}{suggestion.difference.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <p className={`text-sm ${theme.textColors.secondary}`}>
                        {suggestion.reasoning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Recommendations */}
              {metrics.recommendations.length > 0 && (
                <div className={`p-4 ${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-lg`}>
                  <h5 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center`}>
                    <Info className={`w-4 h-4 ${theme.status.info.text} mr-2`} />
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
              Alternative Investment Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Benefits of Alternatives:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• <span className="font-medium">Diversification:</span> Low correlation with traditional assets</li>
                  <li>• <span className="font-medium">Inflation Hedge:</span> Many alternatives protect against inflation</li>
                  <li>• <span className="font-medium">Return Enhancement:</span> Potential for higher risk-adjusted returns</li>
                  <li>• <span className="font-medium">Risk Reduction:</span> Can reduce overall portfolio volatility</li>
                </ul>
              </div>
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Allocation Guidelines:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• <span className="font-medium">Conservative:</span> 5-15% alternative allocation</li>
                  <li>• <span className="font-medium">Moderate:</span> 15-30% allocation range</li>
                  <li>• <span className="font-medium">Aggressive:</span> 30-50% for sophisticated investors</li>
                  <li>• <span className="font-medium">Consider:</span> Liquidity needs, costs, and complexity</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
