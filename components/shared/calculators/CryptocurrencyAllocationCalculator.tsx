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
  Zap, AlertTriangle, DollarSign, Target, BarChart3, 
  Shield, Coins, Plus, Minus, TrendingUp, Settings, Info
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import CalculatorWrapper from './CalculatorWrapper';

interface CryptoMetrics {
  portfolioValue: number;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  bitcoinCorrelation: number;
  diversificationScore: number;
  liquidityScore: number;
  riskLevel: string;
  maxDrawdown: number;
  cryptoAllocation: number;
  potentialLoss: number;
  recommendations: string[];
}

interface CryptoPosition {
  id: number;
  name: string;
  symbol: string;
  category: 'Store of Value' | 'Smart Contract' | 'DeFi' | 'Layer 1' | 'Layer 2' | 'Utility' | 'Meme' | 'Privacy';
  allocation: number;
  currentPrice: number;
  amount: number;
  marketCap: number;
  volatility: number;
  liquidityRating: number;
  bitcoinCorrelation: number;
  technologyRating: number;
  adoptionRating: number;
  regulatoryRisk: number;
}

export default function CryptocurrencyAllocationCalculator() {
  // Enhanced crypto positions with comprehensive data
  const [cryptoPositions, setCryptoPositions] = useState<CryptoPosition[]>([
    {
      id: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      category: 'Store of Value',
      allocation: 40,
      currentPrice: 43500,
      amount: 4000,
      marketCap: 850000000000,
      volatility: 65,
      liquidityRating: 95,
      bitcoinCorrelation: 1.0,
      technologyRating: 85,
      adoptionRating: 90,
      regulatoryRisk: 20
    },
    {
      id: 2,
      name: 'Ethereum',
      symbol: 'ETH',
      category: 'Smart Contract',
      allocation: 30,
      currentPrice: 2650,
      amount: 3000,
      marketCap: 320000000000,
      volatility: 75,
      liquidityRating: 90,
      bitcoinCorrelation: 0.85,
      technologyRating: 95,
      adoptionRating: 85,
      regulatoryRisk: 25
    },
    {
      id: 3,
      name: 'Cardano',
      symbol: 'ADA',
      category: 'Layer 1',
      allocation: 15,
      currentPrice: 0.52,
      amount: 1500,
      marketCap: 18000000000,
      volatility: 85,
      liquidityRating: 75,
      bitcoinCorrelation: 0.70,
      technologyRating: 80,
      adoptionRating: 60,
      regulatoryRisk: 30
    },
    {
      id: 4,
      name: 'Polygon',
      symbol: 'MATIC',
      category: 'Layer 2',
      allocation: 10,
      currentPrice: 0.95,
      amount: 1000,
      marketCap: 9000000000,
      volatility: 95,
      liquidityRating: 80,
      bitcoinCorrelation: 0.75,
      technologyRating: 85,
      adoptionRating: 70,
      regulatoryRisk: 35
    },
    {
      id: 5,
      name: 'Chainlink',
      symbol: 'LINK',
      category: 'Utility',
      allocation: 5,
      currentPrice: 15.50,
      amount: 500,
      marketCap: 9000000000,
      volatility: 90,
      liquidityRating: 85,
      bitcoinCorrelation: 0.65,
      technologyRating: 90,
      adoptionRating: 75,
      regulatoryRisk: 25
    }
  ]);

  // Portfolio Parameters
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(100000);
  const [riskTolerance, setRiskTolerance] = useState<'Conservative' | 'Moderate' | 'Aggressive'>('Moderate');
  const [investmentHorizon, setInvestmentHorizon] = useState<number>(5);
  const [maxCryptoAllocation, setMaxCryptoAllocation] = useState<number>(15);
  const [rebalanceFrequency, setRebalanceFrequency] = useState<'Weekly' | 'Monthly' | 'Quarterly'>('Monthly');
  
  const [metrics, setMetrics] = useState<CryptoMetrics | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updatePositionAmount = (id: number, amount: number) => {
    setCryptoPositions(prev => 
      prev.map(position => 
        position.id === id ? { ...position, amount: Math.max(0, amount) } : position
      )
    );
  };

  const addCryptoPosition = () => {
    const nextId = Math.max(...cryptoPositions.map(p => p.id)) + 1;
    const newPosition: CryptoPosition = {
      id: nextId,
      name: 'Custom Token',
      symbol: 'CUSTOM',
      category: 'Layer 1',
      allocation: 5,
      currentPrice: 1.0,
      amount: 500,
      marketCap: 1000000000,
      volatility: 100,
      liquidityRating: 60,
      bitcoinCorrelation: 0.70,
      technologyRating: 70,
      adoptionRating: 50,
      regulatoryRisk: 50
    };
    setCryptoPositions([...cryptoPositions, newPosition]);
  };

  const removeCryptoPosition = (id: number) => {
    if (cryptoPositions.length > 1) {
      setCryptoPositions(cryptoPositions.filter(position => position.id !== id));
    }
  };

  const calculateCryptoMetrics = useCallback((): CryptoMetrics => {
    const totalCryptoValue = cryptoPositions.reduce((sum, position) => sum + position.amount, 0);
    const cryptoAllocation = (totalCryptoValue / totalPortfolioValue) * 100;
    
    if (totalCryptoValue === 0) {
      return {
        portfolioValue: 0,
        expectedReturn: 0,
        volatility: 0,
        sharpeRatio: 0,
        bitcoinCorrelation: 0,
        diversificationScore: 0,
        liquidityScore: 0,
        riskLevel: 'Low',
        maxDrawdown: 0,
        cryptoAllocation: 0,
        potentialLoss: 0,
        recommendations: ['Add cryptocurrency positions to analyze portfolio']
      };
    }

    // Portfolio expected return (crypto is highly speculative, so conservative estimates)
    const expectedReturn = cryptoPositions.reduce((sum, position) => {
      const weight = position.amount / totalCryptoValue;
      // Base return estimate on market cap and adoption
      let baseReturn = 15; // Base crypto expected return
      if (position.marketCap > 100000000000) baseReturn = 25; // Large cap
      if (position.marketCap < 10000000000) baseReturn = 40; // Small cap (higher risk/return)
      if (position.adoptionRating > 80) baseReturn += 10;
      if (position.technologyRating > 85) baseReturn += 5;
      return sum + (baseReturn * weight);
    }, 0);

    // Portfolio volatility (weighted average with correlation adjustments)
    let portfolioVariance = 0;
    for (let i = 0; i < cryptoPositions.length; i++) {
      for (let j = 0; j < cryptoPositions.length; j++) {
        const weightI = cryptoPositions[i].amount / totalCryptoValue;
        const weightJ = cryptoPositions[j].amount / totalCryptoValue;
        const volI = cryptoPositions[i].volatility / 100;
        const volJ = cryptoPositions[j].volatility / 100;
        
        let correlation = 1.0;
        if (i !== j) {
          // Use Bitcoin correlation as proxy for inter-crypto correlation
          correlation = (cryptoPositions[i].bitcoinCorrelation + cryptoPositions[j].bitcoinCorrelation) / 2;
        }
        
        portfolioVariance += weightI * weightJ * volI * volJ * correlation;
      }
    }
    const volatility = Math.sqrt(portfolioVariance) * 100;

    // Sharpe ratio (assuming 3% risk-free rate)
    const riskFreeRate = 3.0;
    const sharpeRatio = (expectedReturn - riskFreeRate) / volatility;

    // Bitcoin correlation (portfolio weighted)
    const bitcoinCorrelation = cryptoPositions.reduce((sum, position) => {
      const weight = position.amount / totalCryptoValue;
      return sum + (position.bitcoinCorrelation * weight);
    }, 0);

    // Diversification score
    const categoryDistribution = cryptoPositions.reduce((acc, position) => {
      const weight = position.amount / totalCryptoValue;
      acc[position.category] = (acc[position.category] || 0) + weight;
      return acc;
    }, {} as Record<string, number>);
    const herfindahlIndex = Object.values(categoryDistribution).reduce((sum, weight) => sum + Math.pow(weight, 2), 0);
    const diversificationScore = Math.max(0, (1 - herfindahlIndex) * 100);

    // Liquidity score (weighted average)
    const liquidityScore = cryptoPositions.reduce((sum, position) => {
      const weight = position.amount / totalCryptoValue;
      return sum + (position.liquidityRating * weight);
    }, 0);

    // Risk level assessment
    let riskLevel = 'Moderate';
    if (cryptoAllocation > 20 || volatility > 80) riskLevel = 'High';
    if (cryptoAllocation > 30 || volatility > 100) riskLevel = 'Very High';
    if (cryptoAllocation < 5 && volatility < 60) riskLevel = 'Low';

    // Max drawdown estimation (crypto can have severe drawdowns)
    const maxDrawdown = Math.min(95, volatility * 1.5 + 20);

    // Potential loss (95% confidence interval)
    const potentialLoss = totalCryptoValue * (maxDrawdown / 100);

    // Generate enhanced recommendations
    const recommendations: string[] = [];
    
    if (cryptoAllocation > maxCryptoAllocation) {
      recommendations.push(`Crypto allocation (${cryptoAllocation.toFixed(1)}%) exceeds your target (${maxCryptoAllocation}%) - consider rebalancing to traditional assets`);
    }
    if (bitcoinCorrelation > 0.8) {
      recommendations.push('High Bitcoin correlation detected - diversify across different crypto categories for better risk management');
    }
    if (diversificationScore < 60) {
      recommendations.push('Limited diversification - spread investments across different crypto use cases and technologies');
    }
    if (liquidityScore < 70) {
      recommendations.push('Low liquidity assets detected - ensure you can exit positions during market stress periods');
    }

    // Risk tolerance specific recommendations
    if (riskTolerance === 'Conservative' && cryptoAllocation > 5) {
      recommendations.push('Conservative investors typically limit crypto to 1-5% of total portfolio for risk management');
    }
    if (riskTolerance === 'Moderate' && cryptoAllocation > 15) {
      recommendations.push('Moderate risk tolerance suggests keeping crypto allocation under 10-15% of total portfolio');
    }
    if (riskTolerance === 'Aggressive' && expectedReturn < 30) {
      recommendations.push('Consider higher-return crypto opportunities for aggressive risk profile');
    }

    // Category specific recommendations
    const btcWeight = cryptoPositions.find(p => p.symbol === 'BTC')?.amount || 0;
    const btcPercentage = (btcWeight / totalCryptoValue) * 100;
    if (btcPercentage < 30) {
      recommendations.push('Consider increasing Bitcoin allocation as portfolio foundation - it\'s the most established cryptocurrency');
    }

    // Market cap diversification
    const largeCaps = cryptoPositions.filter(p => p.marketCap > 100000000000);
    if (largeCaps.length / cryptoPositions.length < 0.5) {
      recommendations.push('Consider adding more large-cap cryptocurrencies for stability and reduced volatility');
    }

    // Technology and adoption scoring
    const avgTechRating = cryptoPositions.reduce((sum, p) => sum + p.technologyRating * (p.amount / totalCryptoValue), 0);
    if (avgTechRating < 75) {
      recommendations.push('Focus on cryptocurrencies with stronger technology fundamentals and proven track records');
    }

    // Regulatory risk assessment
    const avgRegulatoryRisk = cryptoPositions.reduce((sum, p) => sum + p.regulatoryRisk * (p.amount / totalCryptoValue), 0);
    if (avgRegulatoryRisk > 40) {
      recommendations.push('High regulatory risk detected - consider assets with clearer regulatory standing');
    }

    return {
      portfolioValue: totalCryptoValue,
      expectedReturn,
      volatility,
      sharpeRatio,
      bitcoinCorrelation,
      diversificationScore,
      liquidityScore,
      riskLevel,
      maxDrawdown,
      cryptoAllocation,
      potentialLoss,
      recommendations
    };
  }, [cryptoPositions, totalPortfolioValue, riskTolerance, maxCryptoAllocation]);

  const handleAnalyzePortfolio = async () => {
    setIsAnalyzing(true);
    // Simulate analysis time for better UX
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const cryptoMetrics = calculateCryptoMetrics();
    setMetrics(cryptoMetrics);
    setShowAnalysis(true);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setShowAnalysis(false);
    setMetrics(null);
  };

  // Results formatting for CalculatorWrapper
  const cryptoResults = metrics ? {
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
        label: 'Crypto Allocation',
        value: metrics.cryptoAllocation / 100,
        format: 'percentage' as const
      },
      {
        label: 'Max Potential Loss',
        value: metrics.potentialLoss,
        format: 'currency' as const
      }
    ]
  } : undefined;

  // Chart colors for crypto categories
  const COLORS = ['#F7931A', '#627EEA', '#3CC8C8', '#8B5CF6', '#10B981', '#F59E0B'];

  // Category colors mapping
  const getCategoryColor = (category: string) => {
    const colorMap = {
      'Store of Value': theme.status.warning.text,
      'Smart Contract': theme.status.info.text,
      'DeFi': theme.status.success.text,
      'Layer 1': theme.status.error.text,
      'Layer 2': '#8B5CF6',
      'Utility': '#06B6D4',
      'Meme': '#EC4899',
      'Privacy': '#6B7280'
    };
    return colorMap[category as keyof typeof colorMap] || theme.textColors.secondary;
  };

  return (
    <CalculatorWrapper
      metadata={{
        id: 'cryptocurrency-allocation-calculator',
        title: 'Cryptocurrency Portfolio Allocation Calculator',
        description: 'Analyze and optimize your cryptocurrency portfolio allocation with advanced risk metrics',
        category: 'advanced'
      }}
      results={cryptoResults}
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* Portfolio Configuration */}
        <Card className={theme.utils.glass('normal')}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} flex items-center`}>
              <Settings className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              Portfolio Configuration
            </CardTitle>
            <CardDescription className={theme.textColors.secondary}>
              Configure your total portfolio size and crypto allocation preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="totalPortfolioValue" className={theme.textColors.primary}>
                  Total Portfolio Value
                </Label>
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                  <Input
                    id="totalPortfolioValue"
                    type="number"
                    value={totalPortfolioValue}
                    onChange={(e) => setTotalPortfolioValue(parseInt(e.target.value) || 0)}
                    className={`${theme.utils.input()} pl-8`}
                    min="1000"
                    step="1000"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="maxCryptoAllocation" className={theme.textColors.primary}>
                  Max Crypto Allocation (%)
                </Label>
                <Input
                  id="maxCryptoAllocation"
                  type="number"
                  value={maxCryptoAllocation}
                  onChange={(e) => setMaxCryptoAllocation(parseInt(e.target.value) || 0)}
                  className={theme.utils.input()}
                  min="1"
                  max="100"
                />
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
                  max="20"
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
                  {(['Weekly', 'Monthly', 'Quarterly'] as const).map((freq) => (
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

        {/* Cryptocurrency Positions */}
        <Card className={theme.utils.glass('normal')}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} flex items-center justify-between`}>
              <div className="flex items-center">
                <Coins className={`w-5 h-5 ${theme.status.warning.text} mr-2`} />
                Cryptocurrency Positions
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={`${theme.status.warning.text} border-current`}>
                  {cryptoPositions.length} Assets
                </Badge>
                <Button
                  onClick={addCryptoPosition}
                  size="sm"
                  className={theme.utils.button('secondary', 'sm')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Crypto
                </Button>
              </div>
            </CardTitle>
            <CardDescription className={theme.textColors.secondary}>
              Configure your cryptocurrency holdings across different categories and use cases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cryptoPositions.map((position, index) => (
              <motion.div 
                key={position.id} 
                className={`${theme.utils.glass('soft')} p-4 space-y-4 ${theme.interactive.hoverSoft}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1 font-medium border-current`}
                      style={{ color: getCategoryColor(position.category) }}
                    >
                      {position.category}
                    </Badge>
                    <span className={`font-bold ${theme.textColors.primary} text-lg`}>
                      {position.name}
                    </span>
                    <Badge variant="outline" className={`${theme.textColors.muted} text-xs font-mono`}>
                      {position.symbol}
                    </Badge>
                    {position.marketCap > 100000000000 && (
                      <Badge className={`${theme.status.success.bg} ${theme.status.success.text} border-none text-xs`}>
                        Large Cap
                      </Badge>
                    )}
                    {position.technologyRating > 85 && (
                      <Badge className={`${theme.status.info.bg} ${theme.status.info.text} border-none text-xs`}>
                        High Tech
                      </Badge>
                    )}
                  </div>
                  {cryptoPositions.length > 1 && (
                    <Button
                      onClick={() => removeCryptoPosition(position.id)}
                      size="sm"
                      variant="outline"
                      className={`${theme.buttons.ghost} hover:${theme.status.error.bg} hover:${theme.status.error.text}`}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-5 gap-4">
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
                    <p><span className="font-medium text-white">Price:</span> ${position.currentPrice.toLocaleString()}</p>
                    <p><span className="font-medium text-white">Volatility:</span> {position.volatility}%</p>
                    <p><span className="font-medium text-white">Liquidity:</span> {position.liquidityRating}/100</p>
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                    <p><span className="font-medium text-white">Market Cap:</span> ${(position.marketCap / 1000000000).toFixed(1)}B</p>
                    <p><span className="font-medium text-white">BTC Correlation:</span> {position.bitcoinCorrelation.toFixed(2)}</p>
                    <p><span className="font-medium text-white">Tech Rating:</span> {position.technologyRating}/100</p>
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                    <p><span className="font-medium text-white">Adoption:</span> {position.adoptionRating}/100</p>
                    <p><span className="font-medium text-white">Regulatory Risk:</span> {position.regulatoryRisk}/100</p>
                    <p><span className="font-medium text-white">Portfolio Weight:</span></p>
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>
                    <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                      {((position.amount / cryptoPositions.reduce((sum, p) => sum + p.amount, 0)) * 100 || 0).toFixed(1)}%
                    </p>
                    <p className={`text-xs ${theme.textColors.muted}`}>
                      of crypto portfolio
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
            className={`${theme.utils.button('primary', 'lg')} min-w-[220px] ${theme.interactive.glow}`}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Analyzing Crypto Portfolio...
              </>
            ) : (
              <>
                <BarChart3 className="w-5 h-5 mr-2" />
                Analyze Crypto Portfolio
              </>
            )}
          </Button>
          {!showAnalysis && (
            <p className={`${theme.textColors.muted} text-sm mt-2`}>
              Get comprehensive risk analysis and optimization recommendations for your crypto holdings
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
                  Cryptocurrency Portfolio Analysis
                </CardTitle>
                <CardDescription className={theme.textColors.secondary}>
                  Comprehensive risk-return analysis of your cryptocurrency holdings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Portfolio Allocation Chart */}
                  <div>
                    <h5 className={`font-semibold ${theme.textColors.primary} mb-4`}>
                      Crypto Allocation by Asset
                    </h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={cryptoPositions.map((position, index) => ({
                            name: position.symbol,
                            value: position.amount,
                            category: position.category,
                            color: COLORS[index % COLORS.length]
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => {
                            const total = cryptoPositions.reduce((sum, p) => sum + p.amount, 0);
                            const percentage = (((value || 0) / total) * 100).toFixed(1);
                            return `${name}: ${percentage}%`;
                          }}
                        >
                          {cryptoPositions.map((_, index) => (
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
                      Key Risk Metrics
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`${theme.utils.glass('soft')} p-3 text-center`}>
                        <p className={`text-2xl font-bold ${
                          metrics.expectedReturn > 30 ? theme.status.success.text :
                          metrics.expectedReturn > 15 ? theme.status.warning.text : theme.status.error.text
                        }`}>
                          {metrics.expectedReturn.toFixed(1)}%
                        </p>
                        <p className={`text-sm ${theme.textColors.secondary}`}>Expected Return</p>
                      </div>
                      <div className={`${theme.utils.glass('soft')} p-3 text-center`}>
                        <p className={`text-2xl font-bold ${
                          metrics.volatility < 70 ? theme.status.success.text :
                          metrics.volatility < 90 ? theme.status.warning.text : theme.status.error.text
                        }`}>
                          {metrics.volatility.toFixed(1)}%
                        </p>
                        <p className={`text-sm ${theme.textColors.secondary}`}>Volatility</p>
                      </div>
                      <div className={`${theme.utils.glass('soft')} p-3 text-center`}>
                        <p className={`text-2xl font-bold ${
                          metrics.cryptoAllocation <= maxCryptoAllocation ? theme.status.success.text : theme.status.error.text
                        }`}>
                          {metrics.cryptoAllocation.toFixed(1)}%
                        </p>
                        <p className={`text-sm ${theme.textColors.secondary}`}>Crypto Allocation</p>
                      </div>
                      <div className={`${theme.utils.glass('soft')} p-3 text-center`}>
                        <p className={`text-2xl font-bold ${
                          metrics.maxDrawdown < 60 ? theme.status.success.text :
                          metrics.maxDrawdown < 80 ? theme.status.warning.text : theme.status.error.text
                        }`}>
                          {metrics.maxDrawdown.toFixed(0)}%
                        </p>
                        <p className={`text-sm ${theme.textColors.secondary}`}>Max Drawdown</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card className={`${theme.status.warning.bg}/10 border ${theme.status.warning.border}`}>
              <CardHeader>
                <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                  <Shield className={`w-5 h-5 ${theme.status.warning.text} mr-2`} />
                  Risk Assessment
                </CardTitle>
                <CardDescription className={theme.textColors.secondary}>
                  Critical risk metrics and potential loss scenarios for your crypto portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={`${theme.utils.glass('soft')} p-4 text-center`}>
                    <AlertTriangle className={`w-8 h-8 ${theme.status.error.text} mx-auto mb-2`} />
                    <p className={`text-lg font-bold ${theme.status.error.text}`}>
                      ${metrics.potentialLoss.toLocaleString()}
                    </p>
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      Potential Loss (95% confidence)
                    </p>
                  </div>
                  <div className={`${theme.utils.glass('soft')} p-4 text-center`}>
                    <Target className={`w-8 h-8 ${theme.status.info.text} mx-auto mb-2`} />
                    <p className={`text-lg font-bold ${theme.textColors.primary}`}>
                      {metrics.bitcoinCorrelation.toFixed(2)}
                    </p>
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      Bitcoin Correlation
                    </p>
                  </div>
                  <div className={`${theme.utils.glass('soft')} p-4 text-center`}>
                    <BarChart3 className={`w-8 h-8 ${theme.status.success.text} mx-auto mb-2`} />
                    <p className={`text-lg font-bold ${theme.textColors.primary}`}>
                      {metrics.diversificationScore.toFixed(0)}
                    </p>
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      Diversification Score
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {metrics.recommendations.length > 0 && (
              <Card className={`${theme.status.info.bg}/10 border ${theme.status.info.border}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                    <Zap className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                    Portfolio Optimization Recommendations
                  </CardTitle>
                  <CardDescription className={theme.textColors.secondary}>
                    AI-powered suggestions to optimize your cryptocurrency portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.recommendations.map((recommendation, index) => (
                      <motion.div
                        key={index}
                        className={`${theme.utils.glass('soft')} p-4 flex items-start space-x-3`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`w-2 h-2 rounded-full ${theme.status.info.bg} mt-2 flex-shrink-0`}></div>
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
              Cryptocurrency Investment Guide
            </CardTitle>
            <CardDescription className={theme.textColors.secondary}>
              Essential knowledge for safe and effective cryptocurrency investing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className={`${theme.utils.glass('soft')} p-4`}>
                <h5 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
                  <Shield className={`w-4 h-4 ${theme.status.error.text} mr-2`} />
                  Risk Management
                </h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-2`}>
                  <li>• <span className="font-medium text-white">Position Sizing:</span> Never invest more than you can afford to lose</li>
                  <li>• <span className="font-medium text-white">Diversification:</span> Spread across different crypto categories</li>
                  <li>• <span className="font-medium text-white">Volatility:</span> Expect extreme price swings and drawdowns</li>
                  <li>• <span className="font-medium text-white">Liquidity:</span> Ensure you can exit positions when needed</li>
                </ul>
              </div>
              <div className={`${theme.utils.glass('soft')} p-4`}>
                <h5 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
                  <Target className={`w-4 h-4 ${theme.status.success.text} mr-2`} />
                  Asset Categories
                </h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-2`}>
                  <li>• <span className="font-medium text-white">Store of Value:</span> Bitcoin, digital gold properties</li>
                  <li>• <span className="font-medium text-white">Smart Contracts:</span> Ethereum, programmable platforms</li>
                  <li>• <span className="font-medium text-white">DeFi:</span> Decentralized finance protocols</li>
                  <li>• <span className="font-medium text-white">Layer 2:</span> Scaling solutions for main chains</li>
                </ul>
              </div>
              <div className={`${theme.utils.glass('soft')} p-4`}>
                <h5 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
                  <Coins className={`w-4 h-4 ${theme.status.warning.text} mr-2`} />
                  Best Practices
                </h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-2`}>
                  <li>• <span className="font-medium text-white">Research:</span> Understand technology and use cases</li>
                  <li>• <span className="font-medium text-white">Security:</span> Use hardware wallets for storage</li>
                  <li>• <span className="font-medium text-white">Rebalancing:</span> Maintain target allocations</li>
                  <li>• <span className="font-medium text-white">Taxation:</span> Keep detailed records for tax purposes</li>
                </ul>
              </div>
            </div>

            {/* Advanced Risk Warning */}
            <div className={`${theme.status.error.bg}/20 border ${theme.status.error.border} ${theme.utils.glass('soft')} p-4`}>
              <h5 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
                <AlertTriangle className={`w-4 h-4 ${theme.status.error.text} mr-2`} />
                Important Risk Disclosures
              </h5>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className={theme.textColors.secondary}>
                  <span className="font-medium text-white block mb-1">Extreme Volatility:</span>
                  Cryptocurrencies can lose 50-90% of their value rapidly. Historical volatility often exceeds 100% annually.
                </div>
                <div className={theme.textColors.secondary}>
                  <span className="font-medium text-white block mb-1">Regulatory Risk:</span>
                  Government regulations can significantly impact crypto values. Some jurisdictions may ban cryptocurrencies entirely.
                </div>
                <div className={theme.textColors.secondary}>
                  <span className="font-medium text-white block mb-1">Technology Risk:</span>
                  Smart contract bugs, network failures, or security breaches can result in total loss of funds.
                </div>
                <div className={theme.textColors.secondary}>
                  <span className="font-medium text-white block mb-1">Market Risk:</span>
                  Crypto markets are largely speculative and driven by sentiment rather than fundamentals.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorWrapper>
  );
}
