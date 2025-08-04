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
  DollarSign,
  Target,
  BarChart3,
  Shield,
  Coins
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

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
  // Crypto Positions
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
      name: 'Chainlink',
      symbol: 'LINK',
      category: 'Utility',
      allocation: 10,
      currentPrice: 14.25,
      amount: 1000,
      marketCap: 8500000000,
      volatility: 90,
      liquidityRating: 80,
      bitcoinCorrelation: 0.65,
      technologyRating: 90,
      adoptionRating: 75,
      regulatoryRisk: 15
    },
    {
      id: 5,
      name: 'Polygon',
      symbol: 'MATIC',
      category: 'Layer 2',
      allocation: 5,
      currentPrice: 0.95,
      amount: 500,
      marketCap: 9000000000,
      volatility: 95,
      liquidityRating: 70,
      bitcoinCorrelation: 0.60,
      technologyRating: 85,
      adoptionRating: 70,
      regulatoryRisk: 35
    }
  ]);

  // Portfolio Parameters
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(100000);
  const [riskTolerance, setRiskTolerance] = useState<'Conservative' | 'Moderate' | 'Aggressive'>('Moderate');
  const [investmentHorizon, setInvestmentHorizon] = useState<number>(5);
  const [maxCryptoAllocation, setMaxCryptoAllocation] = useState<number>(10);
  const [investmentGoal, setInvestmentGoal] = useState<'Speculation' | 'Diversification' | 'Hedge'>('Diversification');

  const [metrics, setMetrics] = useState<CryptoMetrics | null>(null);

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('cryptocurrency-allocation-calculator');
  }, [recordCalculatorUsage]);

  const cryptoColors = {
    'Store of Value': '#f7931a', // Bitcoin orange
    'Smart Contract': '#627eea', // Ethereum blue
    'DeFi': '#ff6b6b',
    'Layer 1': '#4ecdc4',
    'Layer 2': '#45b7d1',
    'Utility': '#96ceb4',
    'Meme': '#feca57',
    'Privacy': '#6c5ce7'
  };

  const updateCryptoPosition = (index: number, field: keyof CryptoPosition, value: number | string) => {
    const newPositions = [...cryptoPositions];
    newPositions[index] = { ...newPositions[index], [field]: value };
    setCryptoPositions(newPositions);
  };

  const addCryptoPosition = () => {
    const newPosition: CryptoPosition = {
      id: Math.max(...cryptoPositions.map(p => p.id)) + 1,
      name: `New Crypto ${cryptoPositions.length + 1}`,
      symbol: 'NEW',
      category: 'Utility',
      allocation: 5,
      currentPrice: 1.0,
      amount: 500,
      marketCap: 1000000000,
      volatility: 80,
      liquidityRating: 60,
      bitcoinCorrelation: 0.70,
      technologyRating: 70,
      adoptionRating: 50,
      regulatoryRisk: 40
    };
    setCryptoPositions([...cryptoPositions, newPosition]);
  };

  const removeCryptoPosition = (id: number) => {
    if (cryptoPositions.length > 1) {
      setCryptoPositions(cryptoPositions.filter(position => position.id !== id));
    }
  };

  const analyzeCryptoPortfolio = useCallback((): CryptoMetrics => {
    const totalCryptoValue = cryptoPositions.reduce((sum, position) => sum + position.amount, 0);
    const cryptoAllocation = (totalCryptoValue / totalPortfolioValue) * 100;
    
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

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (cryptoAllocation > maxCryptoAllocation) {
      recommendations.push(`Crypto allocation (${cryptoAllocation.toFixed(1)}%) exceeds your target (${maxCryptoAllocation}%)`);
    }
    if (bitcoinCorrelation > 0.8) {
      recommendations.push('High Bitcoin correlation - consider more diverse crypto categories');
    }
    if (diversificationScore < 60) {
      recommendations.push('Limited diversification - spread across different crypto use cases');
    }
    if (liquidityScore < 70) {
      recommendations.push('Low liquidity assets - ensure you can exit positions when needed');
    }

    // Risk tolerance specific recommendations
    if (riskTolerance === 'Conservative' && cryptoAllocation > 5) {
      recommendations.push('Conservative investors typically limit crypto to 1-5% of portfolio');
    }
    if (riskTolerance === 'Moderate' && cryptoAllocation > 15) {
      recommendations.push('Moderate risk tolerance suggests keeping crypto under 10-15%');
    }

    // Category specific recommendations
    const btcWeight = cryptoPositions.find(p => p.symbol === 'BTC')?.amount || 0;
    const btcPercentage = (btcWeight / totalCryptoValue) * 100;
    if (btcPercentage < 30) {
      recommendations.push('Consider increasing Bitcoin allocation as portfolio foundation');
    }

    const smallCapExposure = cryptoPositions.filter(p => p.marketCap < 10000000000)
      .reduce((sum, p) => sum + p.amount, 0) / totalCryptoValue * 100;
    if (smallCapExposure > 30) {
      recommendations.push('High small-cap exposure increases volatility and risk');
    }

    const avgRegulatoryRisk = cryptoPositions.reduce((sum, position) => {
      const weight = position.amount / totalCryptoValue;
      return sum + (position.regulatoryRisk * weight);
    }, 0);
    if (avgRegulatoryRisk > 40) {
      recommendations.push('High regulatory risk - monitor policy changes closely');
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
  }, [cryptoPositions, totalPortfolioValue, maxCryptoAllocation, riskTolerance]);

  const handleAnalyze = () => {
    const portfolioMetrics = analyzeCryptoPortfolio();
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

  // Generate risk visualization data
  const generateRiskData = () => {
    if (!metrics) return [];
    
    return [
      { name: 'Conservative (1-5%)', allocation: 3, risk: 15, return: 8 },
      { name: 'Moderate (5-15%)', allocation: 10, risk: 35, return: 20 },
      { name: 'Aggressive (15-25%)', allocation: 20, risk: 55, return: 35 },
      { name: 'Your Portfolio', allocation: metrics.cryptoAllocation, risk: metrics.volatility, return: metrics.expectedReturn }
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
        <div className={`w-16 h-16 ${theme.status.warning.bg} rounded-full flex items-center justify-center mx-auto`}>
          <Coins className={`w-8 h-8 ${theme.status.warning.text}`} />
        </div>
        <h1 className={`${theme.typography.heading1} ${theme.textColors.primary}`}>
          Cryptocurrency Allocation Calculator
        </h1>
        <p className={`${theme.typography.body} ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Analyze and optimize your cryptocurrency portfolio allocation with risk management
        </p>
      </motion.div>

      {/* Investment Parameters */}
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
            <CardDescription>Configure your crypto investment strategy and risk limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalPortfolioValue">Total Portfolio Value ($)</Label>
                <Input
                  id="totalPortfolioValue"
                  type="number"
                  value={totalPortfolioValue}
                  onChange={(e) => setTotalPortfolioValue(Number(e.target.value))}
                  placeholder="100000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCryptoAllocation">Max Crypto Allocation (%)</Label>
                <Input
                  id="maxCryptoAllocation"
                  type="number"
                  value={maxCryptoAllocation}
                  onChange={(e) => setMaxCryptoAllocation(Number(e.target.value))}
                  placeholder="10"
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
                <Label htmlFor="investmentGoal">Investment Goal</Label>
                <select
                  id="investmentGoal"
                  value={investmentGoal}
                  onChange={(e) => setInvestmentGoal(e.target.value as typeof investmentGoal)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Speculation">Speculation</option>
                  <option value="Diversification">Diversification</option>
                  <option value="Hedge">Digital Hedge</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Crypto Positions Configuration */}
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
                  Cryptocurrency Positions
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCryptoPosition}
                >
                  Add Crypto
                </Button>
              </CardTitle>
              <CardDescription>Configure your cryptocurrency portfolio holdings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cryptoPositions.map((position, index) => (
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
                          style={{ backgroundColor: cryptoColors[position.category] }}
                        />
                        <div>
                          <input
                            type="text"
                            value={position.name}
                            onChange={(e) => updateCryptoPosition(index, 'name', e.target.value)}
                            className="font-medium bg-transparent border-none focus:outline-none text-sm"
                          />
                          <Badge variant="outline" className="ml-2">
                            {position.symbol}
                          </Badge>
                        </div>
                      </div>
                      {cryptoPositions.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCryptoPosition(position.id)}
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
                          onChange={(e) => updateCryptoPosition(index, 'category', e.target.value)}
                          className="w-full h-8 px-2 border border-gray-300 rounded text-sm"
                        >
                          <option value="Store of Value">Store of Value</option>
                          <option value="Smart Contract">Smart Contract</option>
                          <option value="DeFi">DeFi</option>
                          <option value="Layer 1">Layer 1</option>
                          <option value="Layer 2">Layer 2</option>
                          <option value="Utility">Utility</option>
                          <option value="Meme">Meme</option>
                          <option value="Privacy">Privacy</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Symbol</Label>
                        <Input
                          type="text"
                          value={position.symbol}
                          onChange={(e) => updateCryptoPosition(index, 'symbol', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Amount ($)</Label>
                        <Input
                          type="number"
                          value={position.amount}
                          onChange={(e) => updateCryptoPosition(index, 'amount', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Current Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={position.currentPrice}
                          onChange={(e) => updateCryptoPosition(index, 'currentPrice', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Volatility (%)</Label>
                        <Input
                          type="number"
                          value={position.volatility}
                          onChange={(e) => updateCryptoPosition(index, 'volatility', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Liquidity (1-100)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={position.liquidityRating}
                          onChange={(e) => updateCryptoPosition(index, 'liquidityRating', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">BTC Correlation</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={position.bitcoinCorrelation}
                          onChange={(e) => updateCryptoPosition(index, 'bitcoinCorrelation', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Regulatory Risk (1-100)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={position.regulatoryRisk}
                          onChange={(e) => updateCryptoPosition(index, 'regulatoryRisk', Number(e.target.value))}
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
                Analyze Crypto Portfolio
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
                Crypto Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cryptoPositions.map(position => ({
                        name: position.symbol,
                        value: position.amount,
                        fill: cryptoColors[position.category]
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
                      {cryptoPositions.map((position) => (
                        <Cell key={position.id} fill={cryptoColors[position.category]} />
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
                Cryptocurrency Portfolio Analysis
              </CardTitle>
              <CardDescription>Comprehensive risk and allocation analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${metrics.cryptoAllocation > maxCryptoAllocation ? theme.status.error.text : theme.status.success.text}`}>
                    {metrics.cryptoAllocation.toFixed(1)}%
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Portfolio Allocation</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${theme.status.warning.text}`}>
                    {metrics.expectedReturn.toFixed(0)}%
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Expected Return</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${metrics.volatility > 80 ? theme.status.error.text : theme.status.warning.text}`}>
                    {metrics.volatility.toFixed(0)}%
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Volatility</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${theme.status.error.text}`}>
                    {formatCurrency(metrics.potentialLoss)}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Potential Loss</div>
                </div>
              </div>

              <Separator />

              {/* Risk Analysis */}
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Risk Assessment</h4>
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
                      <span className={`text-sm ${theme.textColors.secondary}`}>Max Drawdown:</span>
                      <span className={`font-bold ${theme.status.error.text}`}>
                        {metrics.maxDrawdown.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>Liquidity:</span>
                      <span className={`font-bold ${getRatingColor(metrics.liquidityScore)}`}>
                        {metrics.liquidityScore.toFixed(0)}/100
                      </span>
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
                </div>
              </div>

              <Separator />

              {/* Risk/Return Comparison */}
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Risk vs Return Analysis</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generateRiskData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="allocation" fill="#3b82f6" name="Allocation %" />
                      <Bar dataKey="risk" fill="#ef4444" name="Risk %" />
                      <Bar dataKey="return" fill="#10b981" name="Expected Return %" />
                    </BarChart>
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
        <Card className={`${theme.status.warning.bg}/10 border ${theme.status.warning.border}`}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} flex items-center`}>
              <Shield className={`w-5 h-5 ${theme.status.warning.text} mr-2`} />
              Cryptocurrency Investment Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Key Considerations:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• <span className="font-medium">High Volatility:</span> Crypto can lose 50-90% of value</li>
                  <li>• <span className="font-medium">Regulatory Risk:</span> Government actions can impact prices</li>
                  <li>• <span className="font-medium">Technology Risk:</span> Smart contract bugs, hacks possible</li>
                  <li>• <span className="font-medium">Limited History:</span> No long-term performance data</li>
                </ul>
              </div>
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Allocation Guidelines:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• <span className="font-medium">Conservative:</span> 1-5% of total portfolio</li>
                  <li>• <span className="font-medium">Moderate:</span> 5-15% maximum allocation</li>
                  <li>• <span className="font-medium">Aggressive:</span> 15-25% for risk-tolerant investors</li>
                  <li>• <span className="font-medium">Never invest:</span> More than you can afford to lose</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
