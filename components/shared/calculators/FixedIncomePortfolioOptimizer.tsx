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
  PieChart as PieChartIcon, 
  Target, 
  BarChart3,
  AlertTriangle,
  Info,
  Settings
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';

interface FixedIncomeAllocation {
  category: string;
  allocation: number;
  expectedYield: number;
  duration: number;
  creditRating: string;
  color: string;
}

interface PortfolioMetrics {
  portfolioYield: number;
  weightedDuration: number;
  creditScore: number;
  riskScore: number;
  diversificationScore: number;
  liquidityScore: number;
  recommendedChanges: string[];
  totalValue: number;
  monthlyIncome: number;
  annualIncome: number;
}

interface RiskScenario {
  name: string;
  interestRateChange: number;
  creditSpreadChange: number;
  portfolioImpact: number;
}

export default function FixedIncomePortfolioOptimizer() {
  // Portfolio allocations
  const [allocations, setAllocations] = useState<FixedIncomeAllocation[]>([
    { category: 'Treasury Bonds', allocation: 30, expectedYield: 4.5, duration: 6.5, creditRating: 'AAA', color: '#3b82f6' },
    { category: 'Corporate Bonds (IG)', allocation: 25, expectedYield: 5.2, duration: 5.8, creditRating: 'A', color: '#10b981' },
    { category: 'Municipal Bonds', allocation: 15, expectedYield: 3.8, duration: 7.2, creditRating: 'AA', color: '#f59e0b' },
    { category: 'TIPS', allocation: 10, expectedYield: 2.5, duration: 8.1, creditRating: 'AAA', color: '#ef4444' },
    { category: 'High Yield Bonds', allocation: 10, expectedYield: 7.8, duration: 4.2, creditRating: 'BB', color: '#8b5cf6' },
    { category: 'International Bonds', allocation: 5, expectedYield: 4.8, duration: 5.5, creditRating: 'A', color: '#ec4899' },
    { category: 'Cash/Money Market', allocation: 5, expectedYield: 4.2, duration: 0.1, creditRating: 'AAA', color: '#6b7280' }
  ]);

  // Portfolio parameters
  const [portfolioValue, setPortfolioValue] = useState<number>(500000);
  const [riskTolerance, setRiskTolerance] = useState<'Conservative' | 'Moderate' | 'Aggressive'>('Moderate');
  const [investmentHorizon, setInvestmentHorizon] = useState<number>(10);
  const [taxRate, setTaxRate] = useState<number>(24);
  const [incomeNeeds, setIncomeNeeds] = useState<number>(30000);

  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [riskScenarios, setRiskScenarios] = useState<RiskScenario[]>([]);
  const [optimizationGoal, setOptimizationGoal] = useState<'yield' | 'stability' | 'balanced'>('balanced');

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('fixed-income-portfolio-optimizer');
  }, [recordCalculatorUsage]);

  const updateAllocation = (index: number, field: keyof FixedIncomeAllocation, value: number | string) => {
    const newAllocations = [...allocations];
    newAllocations[index] = { ...newAllocations[index], [field]: value };
    setAllocations(newAllocations);
  };

  const normalizeAllocations = () => {
    const total = allocations.reduce((sum, allocation) => sum + allocation.allocation, 0);
    if (total !== 100) {
      const factor = 100 / total;
      const normalizedAllocations = allocations.map(allocation => ({
        ...allocation,
        allocation: Number((allocation.allocation * factor).toFixed(1))
      }));
      setAllocations(normalizedAllocations);
    }
  };

  const calculateMetrics = useCallback((): PortfolioMetrics => {
    // Portfolio yield (weighted average)
    const portfolioYield = allocations.reduce((sum, allocation) => 
      sum + (allocation.expectedYield * allocation.allocation / 100), 0
    );

    // Weighted duration
    const weightedDuration = allocations.reduce((sum, allocation) => 
      sum + (allocation.duration * allocation.allocation / 100), 0
    );

    // Credit score calculation
    const creditScores = { 'AAA': 100, 'AA': 90, 'A': 80, 'BBB': 70, 'BB': 60, 'B': 50, 'CCC': 40 };
    const creditScore = allocations.reduce((sum, allocation) => 
      sum + ((creditScores[allocation.creditRating as keyof typeof creditScores] || 70) * allocation.allocation / 100), 0
    );

    // Risk score (based on duration and credit quality)
    const riskScore = Math.min(100, weightedDuration * 8 + (100 - creditScore) * 0.5);

    // Diversification score
    const diversificationScore = Math.max(0, 100 - Math.max(...allocations.map(a => a.allocation)) * 2);

    // Liquidity score (government bonds and short duration = higher liquidity)
    const liquidityScore = allocations.reduce((sum, allocation) => {
      let liquidityWeight = 0;
      if (allocation.category.includes('Treasury') || allocation.category.includes('Cash')) liquidityWeight = 100;
      else if (allocation.category.includes('Corporate') && allocation.creditRating === 'AAA') liquidityWeight = 80;
      else if (allocation.category.includes('Municipal')) liquidityWeight = 60;
      else liquidityWeight = 40;
      
      liquidityWeight = Math.max(liquidityWeight - allocation.duration * 5, 20);
      return sum + (liquidityWeight * allocation.allocation / 100);
    }, 0);

    // Generate recommendations
    const recommendedChanges: string[] = [];
    
    if (weightedDuration > 8) {
      recommendedChanges.push('Consider reducing duration exposure - high interest rate risk');
    }
    if (creditScore < 75) {
      recommendedChanges.push('Improve credit quality - consider more investment grade bonds');
    }
    if (diversificationScore < 70) {
      recommendedChanges.push('Increase diversification - reduce concentration in largest holdings');
    }
    if (portfolioYield < incomeNeeds / portfolioValue * 100) {
      recommendedChanges.push('Current yield may not meet income needs - consider higher yielding assets');
    }

    // Risk tolerance checks
    if (riskTolerance === 'Conservative' && riskScore > 40) {
      recommendedChanges.push('Portfolio risk too high for conservative profile - increase government bonds');
    }
    if (riskTolerance === 'Aggressive' && riskScore < 30) {
      recommendedChanges.push('Consider adding higher yielding bonds for aggressive profile');
    }

    const annualIncome = portfolioValue * portfolioYield / 100;
    const monthlyIncome = annualIncome / 12;

    return {
      portfolioYield,
      weightedDuration,
      creditScore,
      riskScore,
      diversificationScore,
      liquidityScore,
      recommendedChanges,
      totalValue: portfolioValue,
      monthlyIncome,
      annualIncome
    };
  }, [allocations, portfolioValue, riskTolerance, incomeNeeds]);

  const calculateRiskScenarios = useCallback((): RiskScenario[] => {
    const baseMetrics = calculateMetrics();
    
    const scenarios = [
      { name: 'Rising Rates (+2%)', interestRateChange: 2, creditSpreadChange: 0 },
      { name: 'Falling Rates (-1%)', interestRateChange: -1, creditSpreadChange: 0 },
      { name: 'Credit Crisis', interestRateChange: -0.5, creditSpreadChange: 2 },
      { name: 'Economic Boom', interestRateChange: 1.5, creditSpreadChange: -0.5 }
    ];

    return scenarios.map(scenario => {
      // Simplified impact calculation
      const durationImpact = -baseMetrics.weightedDuration * scenario.interestRateChange;
      const creditImpact = -allocations.reduce((sum, allocation) => {
        const creditSensitivity = allocation.creditRating === 'AAA' ? 0.1 : 
                                 allocation.creditRating === 'AA' ? 0.3 :
                                 allocation.creditRating === 'A' ? 0.5 :
                                 allocation.creditRating === 'BBB' ? 0.8 : 1.2;
        return sum + (allocation.allocation / 100 * creditSensitivity * scenario.creditSpreadChange);
      }, 0);
      
      const portfolioImpact = durationImpact + creditImpact;
      
      return {
        ...scenario,
        portfolioImpact
      };
    });
  }, [allocations, calculateMetrics]);

  const handleOptimize = () => {
    const portfolioMetrics = calculateMetrics();
    setMetrics(portfolioMetrics);
    
    const scenarios = calculateRiskScenarios();
    setRiskScenarios(scenarios);
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return theme.status.success.text;
    if (score < 60) return theme.status.warning.text;
    return theme.status.error.text;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.status.success.text;
    if (score >= 60) return theme.status.warning.text;
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
          <PieChartIcon className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h1 className={`${theme.typography.heading1} ${theme.textColors.primary}`}>
          Fixed Income Portfolio Optimizer
        </h1>
        <p className={`${theme.typography.body} ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Optimize your bond portfolio allocation for risk, return, and income objectives
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
              Portfolio Parameters
            </CardTitle>
            <CardDescription>Configure your investment objectives and constraints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="portfolioValue">Portfolio Value ($)</Label>
                <Input
                  id="portfolioValue"
                  type="number"
                  value={portfolioValue}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setPortfolioValue(value);
                    if (value < 0) {
                      e.target.setAttribute('aria-invalid', 'true');
                      e.target.setAttribute('aria-describedby', 'portfolio-value-error');
                    } else {
                      e.target.setAttribute('aria-invalid', 'false');
                      e.target.removeAttribute('aria-describedby');
                    }
                  }}
                  onBlur={(e) => {
                    const value = Number(e.target.value);
                    if (value < 0) {
                      e.target.setAttribute('aria-invalid', 'true');
                      e.target.setAttribute('aria-describedby', 'portfolio-value-error');
                    } else {
                      e.target.setAttribute('aria-invalid', 'false');
                      e.target.removeAttribute('aria-describedby');
                    }
                  }}
                  placeholder="500000"
                />
                {portfolioValue < 0 && (
                  <div id="portfolio-value-error" role="alert" className="text-red-400 text-sm mt-1">
                    Invalid amount: must be positive
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="incomeNeeds">Annual Income Needs ($)</Label>
                <Input
                  id="incomeNeeds"
                  type="number"
                  step="0.01"
                  value={incomeNeeds}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setIncomeNeeds(value);
                    if (value < 0) {
                      e.target.setAttribute('aria-invalid', 'true');
                      e.target.setAttribute('aria-describedby', 'income-needs-error');
                    } else {
                      e.target.setAttribute('aria-invalid', 'false');
                      e.target.removeAttribute('aria-describedby');
                    }
                  }}
                  onBlur={(e) => {
                    const value = Number(e.target.value);
                    if (value < 0) {
                      e.target.setAttribute('aria-invalid', 'true');
                      e.target.setAttribute('aria-describedby', 'income-needs-error');
                    } else {
                      e.target.setAttribute('aria-invalid', 'false');
                      e.target.removeAttribute('aria-describedby');
                    }
                  }}
                  placeholder="30000"
                />
                {incomeNeeds < 0 && (
                  <div id="income-needs-error" role="alert" className="text-red-400 text-sm mt-1">
                    Invalid amount: must be positive
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="investmentHorizon">Investment Horizon (Years)</Label>
                <Input
                  id="investmentHorizon"
                  type="number"
                  step="0.01"
                  value={investmentHorizon}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setInvestmentHorizon(value);
                    if (value < 0) {
                      e.target.setAttribute('aria-invalid', 'true');
                      e.target.setAttribute('aria-describedby', 'investment-horizon-error');
                    } else {
                      e.target.setAttribute('aria-invalid', 'false');
                      e.target.removeAttribute('aria-describedby');
                    }
                  }}
                  onBlur={(e) => {
                    const value = Number(e.target.value);
                    if (value < 0) {
                      e.target.setAttribute('aria-invalid', 'true');
                      e.target.setAttribute('aria-describedby', 'investment-horizon-error');
                    } else {
                      e.target.setAttribute('aria-invalid', 'false');
                      e.target.removeAttribute('aria-describedby');
                    }
                  }}
                  placeholder="10"
                />
                {investmentHorizon < 0 && (
                  <div id="investment-horizon-error" role="alert" className="text-red-400 text-sm mt-1">
                    Invalid value: must be positive
                  </div>
                )}
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
                  step="0.01"
                  value={taxRate}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setTaxRate(value);
                    if (value < 0 || value > 100) {
                      e.target.setAttribute('aria-invalid', 'true');
                      e.target.setAttribute('aria-describedby', 'tax-rate-error');
                    } else {
                      e.target.setAttribute('aria-invalid', 'false');
                      e.target.removeAttribute('aria-describedby');
                    }
                  }}
                  onBlur={(e) => {
                    const value = Number(e.target.value);
                    if (value < 0 || value > 100) {
                      e.target.setAttribute('aria-invalid', 'true');
                      e.target.setAttribute('aria-describedby', 'tax-rate-error');
                    } else {
                      e.target.setAttribute('aria-invalid', 'false');
                      e.target.removeAttribute('aria-describedby');
                    }
                  }}
                  placeholder="24"
                />
                {(taxRate < 0 || taxRate > 100) && (
                  <div id="tax-rate-error" role="alert" className="text-red-400 text-sm mt-1">
                    Invalid value: must be between 0 and 100
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="optimizationGoal">Optimization Goal</Label>
                <select
                  id="optimizationGoal"
                  value={optimizationGoal}
                  onChange={(e) => setOptimizationGoal(e.target.value as typeof optimizationGoal)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="yield">Maximize Yield</option>
                  <option value="stability">Maximize Stability</option>
                  <option value="balanced">Balanced Approach</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Allocation Configuration */}
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
                  Asset Allocation
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={normalizeAllocations}
                >
                  Normalize to 100%
                </Button>
              </CardTitle>
              <CardDescription>Configure your fixed income asset allocation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {allocations.map((allocation, index) => (
                  <motion.div
                    key={allocation.category}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 ${theme.backgrounds.card} rounded-lg border space-y-3`}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: allocation.color }}
                      />
                      <h5 className={`font-medium ${theme.textColors.primary} flex-1`}>
                        {allocation.category}
                      </h5>
                      <Badge variant="outline">
                        {allocation.creditRating}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Allocation (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={allocation.allocation}
                          onChange={(e) => updateAllocation(index, 'allocation', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Expected Yield (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={allocation.expectedYield}
                          onChange={(e) => updateAllocation(index, 'expectedYield', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Duration (Years)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={allocation.duration}
                          onChange={(e) => updateAllocation(index, 'duration', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Credit Rating</Label>
                        <select
                          value={allocation.creditRating}
                          onChange={(e) => updateAllocation(index, 'creditRating', e.target.value)}
                          className="w-full h-8 px-2 border border-gray-300 rounded text-sm"
                        >
                          <option value="AAA">AAA</option>
                          <option value="AA">AA</option>
                          <option value="A">A</option>
                          <option value="BBB">BBB</option>
                          <option value="BB">BB</option>
                          <option value="B">B</option>
                          <option value="CCC">CCC</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className={`text-sm ${theme.textColors.secondary}`}>
                  Total Allocation: {allocations.reduce((sum, a) => sum + a.allocation, 0).toFixed(1)}%
                </div>
                <Button 
                  onClick={handleOptimize}
                  className={`${theme.buttons.primary}`}
                  size="lg"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Optimize Portfolio
                </Button>
              </div>
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
                <PieChartIcon className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                Allocation Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocations.filter(a => a.allocation > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, allocation }) => `${category}: ${allocation}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="allocation"
                    >
                      {allocations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Optimization Results */}
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
              <CardDescription>Comprehensive analysis of your optimized portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${theme.status.success.text}`}>
                    {metrics.portfolioYield.toFixed(2)}%
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Portfolio Yield</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${getRiskColor(metrics.riskScore)}`}>
                    {metrics.weightedDuration.toFixed(1)}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Weighted Duration</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${theme.status.warning.text}`}>
                    {formatCurrency(metrics.monthlyIncome)}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Monthly Income</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${theme.status.info.text}`}>
                    {formatCurrency(metrics.annualIncome)}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Annual Income</div>
                </div>
              </div>

              <Separator />

              {/* Portfolio Scores */}
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Portfolio Quality Scores</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>Credit Quality:</span>
                      <span className={`font-bold ${getScoreColor(metrics.creditScore)}`}>
                        {metrics.creditScore.toFixed(0)}/100
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>Diversification:</span>
                      <span className={`font-bold ${getScoreColor(metrics.diversificationScore)}`}>
                        {metrics.diversificationScore.toFixed(0)}/100
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>Liquidity:</span>
                      <span className={`font-bold ${getScoreColor(metrics.liquidityScore)}`}>
                        {metrics.liquidityScore.toFixed(0)}/100
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>Risk Level:</span>
                      <span className={`font-bold ${getRiskColor(metrics.riskScore)}`}>
                        {metrics.riskScore.toFixed(0)}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Scenarios */}
              {riskScenarios.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Risk Scenario Analysis</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={riskScenarios}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `${value}%`}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Portfolio Impact']}
                          />
                          <Bar 
                            dataKey="portfolioImpact" 
                            fill="#3b82f6"
                            name="Portfolio Impact"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}

              {/* Recommendations */}
              {metrics.recommendedChanges.length > 0 && (
                <>
                  <Separator />
                  <div className={`p-4 ${theme.status.warning.bg}/10 border ${theme.status.warning.border} rounded-lg`}>
                    <h5 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center`}>
                      <AlertTriangle className={`w-4 h-4 ${theme.status.warning.text} mr-2`} />
                      Optimization Recommendations
                    </h5>
                    <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                      {metrics.recommendedChanges.map((recommendation, index) => (
                        <li key={index}>• {recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </>
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
              Fixed Income Portfolio Optimization Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Key Optimization Factors:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• <span className="font-medium">Duration Risk:</span> Interest rate sensitivity</li>
                  <li>• <span className="font-medium">Credit Quality:</span> Default risk assessment</li>
                  <li>• <span className="font-medium">Diversification:</span> Spread risk across sectors</li>
                  <li>• <span className="font-medium">Liquidity:</span> Ability to sell without loss</li>
                </ul>
              </div>
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Portfolio Construction Tips:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• Match duration to investment horizon</li>
                  <li>• Consider after-tax yield for municipal bonds</li>
                  <li>• Include TIPS for inflation protection</li>
                  <li>• Regular rebalancing maintains target allocation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
