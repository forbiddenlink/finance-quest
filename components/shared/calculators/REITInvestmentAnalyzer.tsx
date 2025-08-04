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
  Building, 
  AlertTriangle,
  Info,
  DollarSign,
  Target,
  BarChart3,
  Home
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface REITMetrics {
  dividendYield: number;
  ffoDividendCoverage: number;
  navDiscount: number;
  riskAdjustedReturn: number;
  liquidityScore: number;
  diversificationBenefit: number;
  inflationHedgeRating: number;
  overallRating: number;
  monthlyDividend: number;
  annualDividend: number;
  totalValue: number;
  recommendations: string[];
}

interface REITHolding {
  id: number;
  name: string;
  type: 'Residential' | 'Commercial' | 'Industrial' | 'Healthcare' | 'Retail' | 'Hotel' | 'Data Center' | 'Self Storage';
  allocation: number;
  price: number;
  shares: number;
  dividendYield: number;
  ffoPerShare: number;
  navPerShare: number;
  debtToEquity: number;
  occupancyRate: number;
}

export default function REITInvestmentAnalyzer() {
  // REIT Portfolio Holdings
  const [reitHoldings, setReitHoldings] = useState<REITHolding[]>([
    {
      id: 1,
      name: 'Residential REIT A',
      type: 'Residential',
      allocation: 30,
      price: 85.50,
      shares: 100,
      dividendYield: 4.2,
      ffoPerShare: 5.8,
      navPerShare: 92.0,
      debtToEquity: 0.45,
      occupancyRate: 95.2
    },
    {
      id: 2,
      name: 'Commercial Office REIT',
      type: 'Commercial',
      allocation: 25,
      price: 45.25,
      shares: 150,
      dividendYield: 6.8,
      ffoPerShare: 3.2,
      navPerShare: 48.5,
      debtToEquity: 0.52,
      occupancyRate: 88.7
    },
    {
      id: 3,
      name: 'Industrial Logistics REIT',
      type: 'Industrial',
      allocation: 20,
      price: 128.75,
      shares: 50,
      dividendYield: 3.5,
      ffoPerShare: 7.2,
      navPerShare: 135.0,
      debtToEquity: 0.38,
      occupancyRate: 97.8
    },
    {
      id: 4,
      name: 'Healthcare REIT',
      type: 'Healthcare',
      allocation: 15,
      price: 62.80,
      shares: 80,
      dividendYield: 5.1,
      ffoPerShare: 4.5,
      navPerShare: 65.2,
      debtToEquity: 0.41,
      occupancyRate: 92.5
    },
    {
      id: 5,
      name: 'Data Center REIT',
      type: 'Data Center',
      allocation: 10,
      price: 156.90,
      shares: 25,
      dividendYield: 2.8,
      ffoPerShare: 8.9,
      navPerShare: 162.0,
      debtToEquity: 0.35,
      occupancyRate: 99.1
    }
  ]);

  // Portfolio Parameters
  const [totalInvestment, setTotalInvestment] = useState<number>(50000);
  const [investmentGoal, setInvestmentGoal] = useState<'income' | 'growth' | 'balanced'>('income');
  const [riskTolerance, setRiskTolerance] = useState<'Conservative' | 'Moderate' | 'Aggressive'>('Moderate');
  const [taxRate, setTaxRate] = useState<number>(24);
  const [inflationRate, setInflationRate] = useState<number>(3.2);

  const [metrics, setMetrics] = useState<REITMetrics | null>(null);

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('reit-investment-analyzer');
  }, [recordCalculatorUsage]);

  const reitTypeColors = {
    'Residential': '#3b82f6',
    'Commercial': '#10b981',
    'Industrial': '#f59e0b',
    'Healthcare': '#ef4444',
    'Retail': '#8b5cf6',
    'Hotel': '#ec4899',
    'Data Center': '#06b6d4',
    'Self Storage': '#84cc16'
  };

  const updateREITHolding = (index: number, field: keyof REITHolding, value: number | string) => {
    const newHoldings = [...reitHoldings];
    newHoldings[index] = { ...newHoldings[index], [field]: value };
    setReitHoldings(newHoldings);
  };

  const addREITHolding = () => {
    const newHolding: REITHolding = {
      id: Math.max(...reitHoldings.map(h => h.id)) + 1,
      name: `New REIT ${reitHoldings.length + 1}`,
      type: 'Residential',
      allocation: 5,
      price: 50.0,
      shares: 50,
      dividendYield: 4.0,
      ffoPerShare: 3.5,
      navPerShare: 52.0,
      debtToEquity: 0.45,
      occupancyRate: 92.0
    };
    setReitHoldings([...reitHoldings, newHolding]);
  };

  const removeREITHolding = (id: number) => {
    if (reitHoldings.length > 1) {
      setReitHoldings(reitHoldings.filter(holding => holding.id !== id));
    }
  };

  const analyzeREITPortfolio = useCallback((): REITMetrics => {
    const totalValue = reitHoldings.reduce((sum, holding) => sum + (holding.price * holding.shares), 0);
    
    // Weighted dividend yield
    const dividendYield = reitHoldings.reduce((sum, holding) => {
      const weight = (holding.price * holding.shares) / totalValue;
      return sum + (holding.dividendYield * weight);
    }, 0);

    // FFO dividend coverage analysis
    const ffoDividendCoverage = reitHoldings.reduce((sum, holding) => {
      const weight = (holding.price * holding.shares) / totalValue;
      const dividendPerShare = holding.price * holding.dividendYield / 100;
      const coverage = holding.ffoPerShare / dividendPerShare;
      return sum + (coverage * weight);
    }, 0);

    // NAV discount/premium analysis
    const navDiscount = reitHoldings.reduce((sum, holding) => {
      const weight = (holding.price * holding.shares) / totalValue;
      const discount = ((holding.navPerShare - holding.price) / holding.navPerShare) * 100;
      return sum + (discount * weight);
    }, 0);

    // Risk-adjusted return (Sharpe-like metric)
    const avgOccupancy = reitHoldings.reduce((sum, holding) => {
      const weight = (holding.price * holding.shares) / totalValue;
      return sum + (holding.occupancyRate * weight);
    }, 0);
    const avgDebtRatio = reitHoldings.reduce((sum, holding) => {
      const weight = (holding.price * holding.shares) / totalValue;
      return sum + (holding.debtToEquity * weight);
    }, 0);
    const riskAdjustment = (avgOccupancy / 100) * (1 - Math.min(avgDebtRatio, 0.8));
    const riskAdjustedReturn = dividendYield * riskAdjustment;

    // Liquidity score (REITs are generally liquid but varies by type)
    const liquidityScore = reitHoldings.reduce((sum, holding) => {
      const weight = (holding.price * holding.shares) / totalValue;
      let liquidityRating = 85; // Base REIT liquidity
      if (holding.type === 'Data Center' || holding.type === 'Industrial') liquidityRating = 90;
      if (holding.type === 'Hotel' || holding.type === 'Retail') liquidityRating = 75;
      return sum + (liquidityRating * weight);
    }, 0);

    // Diversification benefit
    const typeDistribution = reitHoldings.reduce((acc, holding) => {
      const weight = (holding.price * holding.shares) / totalValue;
      acc[holding.type] = (acc[holding.type] || 0) + weight;
      return acc;
    }, {} as Record<string, number>);
    const herfindahlIndex = Object.values(typeDistribution).reduce((sum, weight) => sum + Math.pow(weight, 2), 0);
    const diversificationBenefit = Math.max(0, (1 - herfindahlIndex) * 100);

    // Inflation hedge rating
    const inflationHedgeRating = reitHoldings.reduce((sum, holding) => {
      const weight = (holding.price * holding.shares) / totalValue;
      let hedgeRating = 70; // Base inflation hedge
      if (holding.type === 'Residential' || holding.type === 'Industrial') hedgeRating = 85;
      if (holding.type === 'Data Center') hedgeRating = 90;
      if (holding.type === 'Retail' || holding.type === 'Hotel') hedgeRating = 60;
      return sum + (hedgeRating * weight);
    }, 0);

    // Overall rating
    const fundamentalScore = (ffoDividendCoverage / 2) * 20 + Math.max(0, navDiscount) * 2;
    const qualityScore = avgOccupancy + (100 - avgDebtRatio * 50);
    const overallRating = Math.min(100, (fundamentalScore + qualityScore + diversificationBenefit) / 3);

    // Income calculations
    const annualDividend = totalValue * dividendYield / 100;
    const monthlyDividend = annualDividend / 12;

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (ffoDividendCoverage < 1.2) {
      recommendations.push('Low FFO coverage - consider REITs with stronger fundamentals');
    }
    if (avgDebtRatio > 0.6) {
      recommendations.push('High debt levels - focus on lower-leveraged REITs');
    }
    if (diversificationBenefit < 60) {
      recommendations.push('Limited diversification - consider different REIT sectors');
    }
    if (dividendYield < inflationRate) {
      recommendations.push('Yield below inflation - consider higher-yielding or growth-oriented REITs');
    }
    if (avgOccupancy < 90) {
      recommendations.push('Low occupancy rates - focus on high-quality properties');
    }

    // Investment goal specific recommendations
    if (investmentGoal === 'income' && dividendYield < 5) {
      recommendations.push('For income focus, consider higher-yielding REIT sectors');
    }
    if (investmentGoal === 'growth' && navDiscount < 5) {
      recommendations.push('For growth focus, look for REITs trading below NAV');
    }

    return {
      dividendYield,
      ffoDividendCoverage,
      navDiscount,
      riskAdjustedReturn,
      liquidityScore,
      diversificationBenefit,
      inflationHedgeRating,
      overallRating,
      monthlyDividend,
      annualDividend,
      totalValue,
      recommendations
    };
  }, [reitHoldings, investmentGoal, inflationRate]);

  const handleAnalyze = () => {
    const portfolioMetrics = analyzeREITPortfolio();
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
          <Building className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h1 className={`${theme.typography.heading1} ${theme.textColors.primary}`}>
          REIT Investment Analyzer
        </h1>
        <p className={`${theme.typography.body} ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Analyze real estate investment trusts for income generation, diversification, and inflation protection
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
            <CardDescription>Configure your REIT investment objectives and constraints</CardDescription>
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
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="investmentGoal">Investment Goal</Label>
                <select
                  id="investmentGoal"
                  value={investmentGoal}
                  onChange={(e) => setInvestmentGoal(e.target.value as typeof investmentGoal)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="income">Income Focus</option>
                  <option value="growth">Growth Focus</option>
                  <option value="balanced">Balanced Approach</option>
                </select>
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
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  placeholder="24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inflationRate">Expected Inflation (%)</Label>
                <Input
                  id="inflationRate"
                  type="number"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  placeholder="3.2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* REIT Holdings Configuration */}
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
                  <Home className={`w-5 h-5 ${theme.status.success.text} mr-2`} />
                  REIT Holdings
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addREITHolding}
                >
                  Add REIT
                </Button>
              </CardTitle>
              <CardDescription>Configure your REIT portfolio holdings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reitHoldings.map((holding, index) => (
                  <motion.div
                    key={holding.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 ${theme.backgrounds.card} rounded-lg border space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: reitTypeColors[holding.type] }}
                        />
                        <div>
                          <input
                            type="text"
                            value={holding.name}
                            onChange={(e) => updateREITHolding(index, 'name', e.target.value)}
                            className="font-medium bg-transparent border-none focus:outline-none text-sm"
                          />
                          <Badge variant="outline" className="ml-2">
                            {holding.type}
                          </Badge>
                        </div>
                      </div>
                      {reitHoldings.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeREITHolding(holding.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Type</Label>
                        <select
                          value={holding.type}
                          onChange={(e) => updateREITHolding(index, 'type', e.target.value)}
                          className="w-full h-8 px-2 border border-gray-300 rounded text-sm"
                        >
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Industrial">Industrial</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Retail">Retail</option>
                          <option value="Hotel">Hotel</option>
                          <option value="Data Center">Data Center</option>
                          <option value="Self Storage">Self Storage</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={holding.price}
                          onChange={(e) => updateREITHolding(index, 'price', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Shares</Label>
                        <Input
                          type="number"
                          value={holding.shares}
                          onChange={(e) => updateREITHolding(index, 'shares', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Dividend Yield (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={holding.dividendYield}
                          onChange={(e) => updateREITHolding(index, 'dividendYield', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">FFO per Share ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={holding.ffoPerShare}
                          onChange={(e) => updateREITHolding(index, 'ffoPerShare', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">NAV per Share ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={holding.navPerShare}
                          onChange={(e) => updateREITHolding(index, 'navPerShare', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Debt/Equity</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={holding.debtToEquity}
                          onChange={(e) => updateREITHolding(index, 'debtToEquity', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Occupancy (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={holding.occupancyRate}
                          onChange={(e) => updateREITHolding(index, 'occupancyRate', Number(e.target.value))}
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
                Analyze REIT Portfolio
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
                REIT Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reitHoldings.map(holding => ({
                        name: holding.type,
                        value: holding.price * holding.shares,
                        fill: reitTypeColors[holding.type]
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
                      {reitHoldings.map((holding) => (
                        <Cell key={holding.id} fill={reitTypeColors[holding.type]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Value']}
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
                REIT Portfolio Analysis
              </CardTitle>
              <CardDescription>Comprehensive analysis of your REIT investment strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${theme.status.success.text}`}>
                    {metrics.dividendYield.toFixed(2)}%
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Portfolio Yield</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${metrics.ffoDividendCoverage >= 1.2 ? theme.status.success.text : theme.status.warning.text}`}>
                    {metrics.ffoDividendCoverage.toFixed(1)}x
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>FFO Coverage</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${formatCurrency(metrics.monthlyDividend).includes('-') ? theme.status.error.text : theme.status.info.text}`}>
                    {formatCurrency(metrics.monthlyDividend)}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Monthly Income</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${getRatingColor(metrics.overallRating)}`}>
                    {metrics.overallRating.toFixed(0)}/100
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Overall Rating</div>
                </div>
              </div>

              <Separator />

              {/* Quality Scores */}
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>REIT Quality Analysis</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>NAV Discount:</span>
                      <span className={`font-bold ${metrics.navDiscount > 0 ? theme.status.success.text : theme.status.warning.text}`}>
                        {metrics.navDiscount > 0 ? '+' : ''}{metrics.navDiscount.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>Diversification:</span>
                      <span className={`font-bold ${getRatingColor(metrics.diversificationBenefit)}`}>
                        {metrics.diversificationBenefit.toFixed(0)}/100
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
                      <span className={`text-sm ${theme.textColors.secondary}`}>Inflation Hedge:</span>
                      <span className={`font-bold ${getRatingColor(metrics.inflationHedgeRating)}`}>
                        {metrics.inflationHedgeRating.toFixed(0)}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Recommendations */}
              {metrics.recommendations.length > 0 && (
                <div className={`p-4 ${theme.status.warning.bg}/10 border ${theme.status.warning.border} rounded-lg`}>
                  <h5 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center`}>
                    <AlertTriangle className={`w-4 h-4 ${theme.status.warning.text} mr-2`} />
                    Investment Recommendations
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
              REIT Investment Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>REIT Advantages:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• <span className="font-medium">High Dividend Yields:</span> Typically 3-8% annually</li>
                  <li>• <span className="font-medium">Liquidity:</span> Trade like stocks on exchanges</li>
                  <li>• <span className="font-medium">Diversification:</span> Real estate exposure without direct ownership</li>
                  <li>• <span className="font-medium">Inflation Hedge:</span> Property values often rise with inflation</li>
                </ul>
              </div>
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Key Analysis Metrics:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• <span className="font-medium">FFO (Funds From Operations):</span> Cash flow measure</li>
                  <li>• <span className="font-medium">NAV (Net Asset Value):</span> Underlying property value</li>
                  <li>• <span className="font-medium">Occupancy Rates:</span> Property utilization efficiency</li>
                  <li>• <span className="font-medium">Debt-to-Equity:</span> Financial leverage assessment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
