'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Shield,
  Target,
  AlertTriangle,
  Percent,
  DollarSign,
  Plus,
  Minus
} from 'lucide-react';

interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  allocation: number;
  expectedReturn: number;
  volatility: number;
  beta: number;
  marketValue: number;
}

interface CorrelationMatrix {
  [key: string]: { [key: string]: number };
}

interface PortfolioMetrics {
  totalValue: number;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  beta: number;
  diversificationRatio: number;
  var95: number;
  var99: number;
  maxDrawdown: number;
  treynorRatio: number;
  informationRatio: number;
  sortino: number;
  allocations: { asset: string; percentage: number; value: number }[];
  riskMetrics: {
    metric: string;
    value: string;
    benchmark: string;
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    description: string;
  }[];
  rebalancingNeeds: {
    asset: string;
    current: number;
    target: number;
    action: 'Buy' | 'Sell' | 'Hold';
    amount: number;
  }[];
  recommendations: string[];
  riskFactors: string[];
}

const DEFAULT_HOLDINGS: PortfolioHolding[] = [
  {
    id: '1',
    symbol: 'VTI',
    name: 'Total Stock Market ETF',
    allocation: 40,
    expectedReturn: 10.0,
    volatility: 16.0,
    beta: 1.0,
    marketValue: 40000
  },
  {
    id: '2',
    symbol: 'VTIAX',
    name: 'International Stock ETF',
    allocation: 20,
    expectedReturn: 8.5,
    volatility: 18.5,
    beta: 0.9,
    marketValue: 20000
  },
  {
    id: '3',
    symbol: 'BND',
    name: 'Total Bond Market ETF',
    allocation: 30,
    expectedReturn: 4.0,
    volatility: 4.5,
    beta: 0.1,
    marketValue: 30000
  },
  {
    id: '4',
    symbol: 'VNQ',
    name: 'Real Estate ETF',
    allocation: 10,
    expectedReturn: 7.5,
    volatility: 20.0,
    beta: 0.8,
    marketValue: 10000
  }
];

// Simplified correlation matrix (in reality, this would come from market data)
const DEFAULT_CORRELATIONS: CorrelationMatrix = {
  'VTI': { 'VTI': 1.0, 'VTIAX': 0.85, 'BND': -0.1, 'VNQ': 0.75 },
  'VTIAX': { 'VTI': 0.85, 'VTIAX': 1.0, 'BND': -0.05, 'VNQ': 0.65 },
  'BND': { 'VTI': -0.1, 'VTIAX': -0.05, 'BND': 1.0, 'VNQ': 0.2 },
  'VNQ': { 'VTI': 0.75, 'VTIAX': 0.65, 'BND': 0.2, 'VNQ': 1.0 }
};

export default function PortfolioRiskAnalyzer() {
  const { recordCalculatorUsage } = useProgressStore();

  const [holdings, setHoldings] = useState<PortfolioHolding[]>(DEFAULT_HOLDINGS);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(4.5);
  const [marketReturn, setMarketReturn] = useState<number>(10.0);
  const [timeHorizon, setTimeHorizon] = useState<number>(12); // months
  const [rebalancingThreshold, setRebalancingThreshold] = useState<number>(5); // percentage

  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);

  useEffect(() => {
    recordCalculatorUsage('portfolio-risk-analyzer');
  }, [recordCalculatorUsage]);

  const calculatePortfolioMetrics = useCallback(() => {
    const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
    
    // Normalize allocations
    const normalizedHoldings = holdings.map(holding => ({
      ...holding,
      allocation: (holding.marketValue / totalValue) * 100
    }));

    // Portfolio expected return (weighted average)
    const expectedReturn = normalizedHoldings.reduce(
      (sum, holding) => sum + (holding.allocation / 100) * holding.expectedReturn,
      0
    );

    // Portfolio beta (weighted average)
    const beta = normalizedHoldings.reduce(
      (sum, holding) => sum + (holding.allocation / 100) * holding.beta,
      0
    );

    // Portfolio volatility using correlation matrix
    let portfolioVariance = 0;
    for (let i = 0; i < normalizedHoldings.length; i++) {
      for (let j = 0; j < normalizedHoldings.length; j++) {
        const holding1 = normalizedHoldings[i];
        const holding2 = normalizedHoldings[j];
        const weight1 = holding1.allocation / 100;
        const weight2 = holding2.allocation / 100;
        const correlation = DEFAULT_CORRELATIONS[holding1.symbol]?.[holding2.symbol] || 0;
        
        portfolioVariance += weight1 * weight2 * 
                           (holding1.volatility / 100) * 
                           (holding2.volatility / 100) * 
                           correlation;
      }
    }
    const volatility = Math.sqrt(portfolioVariance) * 100;

    // Risk-adjusted metrics
    const excessReturn = expectedReturn - riskFreeRate;
    const sharpeRatio = excessReturn / volatility;
    const treynorRatio = excessReturn / beta;
    
    // Diversification ratio
    const weightedAvgVolatility = normalizedHoldings.reduce(
      (sum, holding) => sum + (holding.allocation / 100) * holding.volatility,
      0
    );
    const diversificationRatio = weightedAvgVolatility / volatility;

    // Value at Risk (simplified normal distribution assumption)
    const zScore95 = 1.645;
    const zScore99 = 2.326;
    const var95 = totalValue * (expectedReturn / 100 - zScore95 * volatility / 100) * (timeHorizon / 12);
    const var99 = totalValue * (expectedReturn / 100 - zScore99 * volatility / 100) * (timeHorizon / 12);

    // Simplified max drawdown estimate
    const maxDrawdown = volatility * 2.5; // Rough approximation

    // Sortino ratio (simplified - using volatility as proxy for downside deviation)
    const sortino = excessReturn / (volatility * 0.7); // Approximate downside deviation

    // Information ratio (vs market)
    const trackingError = Math.abs(volatility - 16); // Assuming market volatility is 16%
    const informationRatio = (expectedReturn - marketReturn) / (trackingError || 1);

    // Allocations
    const allocations = normalizedHoldings.map(holding => ({
      asset: holding.symbol,
      percentage: holding.allocation,
      value: holding.marketValue
    }));

    // Risk metrics analysis
    const riskMetrics = [
      {
        metric: 'Sharpe Ratio',
        value: sharpeRatio.toFixed(2),
        benchmark: '> 1.0',
        status: (sharpeRatio > 1.5 ? 'Excellent' : 
                sharpeRatio > 1.0 ? 'Good' : 
                sharpeRatio > 0.5 ? 'Fair' : 'Poor') as 'Excellent' | 'Good' | 'Fair' | 'Poor',
        description: 'Risk-adjusted return per unit of volatility'
      },
      {
        metric: 'Portfolio Beta',
        value: beta.toFixed(2),
        benchmark: '0.8 - 1.2',
        status: (beta >= 0.8 && beta <= 1.2 ? 'Good' : 
                beta >= 0.6 && beta <= 1.4 ? 'Fair' : 'Poor') as 'Excellent' | 'Good' | 'Fair' | 'Poor',
        description: 'Sensitivity to market movements'
      },
      {
        metric: 'Volatility',
        value: `${volatility.toFixed(1)}%`,
        benchmark: '< 15%',
        status: (volatility < 10 ? 'Excellent' : 
                volatility < 15 ? 'Good' : 
                volatility < 20 ? 'Fair' : 'Poor') as 'Excellent' | 'Good' | 'Fair' | 'Poor',
        description: 'Portfolio price fluctuation risk'
      },
      {
        metric: 'Diversification Ratio',
        value: diversificationRatio.toFixed(2),
        benchmark: '> 1.2',
        status: (diversificationRatio > 1.4 ? 'Excellent' : 
                diversificationRatio > 1.2 ? 'Good' : 
                diversificationRatio > 1.0 ? 'Fair' : 'Poor') as 'Excellent' | 'Good' | 'Fair' | 'Poor',
        description: 'Effectiveness of diversification'
      },
      {
        metric: 'Max Drawdown',
        value: `${maxDrawdown.toFixed(1)}%`,
        benchmark: '< 20%',
        status: (maxDrawdown < 15 ? 'Excellent' : 
                maxDrawdown < 20 ? 'Good' : 
                maxDrawdown < 30 ? 'Fair' : 'Poor') as 'Excellent' | 'Good' | 'Fair' | 'Poor',
        description: 'Potential peak-to-trough decline'
      },
      {
        metric: 'Treynor Ratio',
        value: treynorRatio.toFixed(2),
        benchmark: '> 0.1',
        status: (treynorRatio > 0.15 ? 'Excellent' : 
                treynorRatio > 0.1 ? 'Good' : 
                treynorRatio > 0.05 ? 'Fair' : 'Poor') as 'Excellent' | 'Good' | 'Fair' | 'Poor',
        description: 'Risk-adjusted return per unit of systematic risk'
      }
    ];

    // Rebalancing analysis
    const targetAllocations = DEFAULT_HOLDINGS.reduce((acc, holding) => {
      acc[holding.symbol] = holding.allocation;
      return acc;
    }, {} as { [key: string]: number });

    const rebalancingNeeds = normalizedHoldings.map(holding => {
      const target = targetAllocations[holding.symbol] || holding.allocation;
      const current = holding.allocation;
      const targetValue = (target / 100) * totalValue;
      const action = current > target + rebalancingThreshold ? 'Sell' : 
                    current < target - rebalancingThreshold ? 'Buy' : 'Hold';
      const amount = Math.abs(holding.marketValue - targetValue);

      return {
        asset: holding.symbol,
        current,
        target,
        action: action as 'Buy' | 'Sell' | 'Hold',
        amount
      };
    });

    // Recommendations
    const recommendations: string[] = [];
    if (sharpeRatio < 0.8) {
      recommendations.push('Consider improving risk-adjusted returns by optimizing asset allocation');
    }
    if (volatility > 18) {
      recommendations.push('Portfolio volatility is high - consider adding more defensive assets');
    }
    if (diversificationRatio < 1.2) {
      recommendations.push('Increase diversification across uncorrelated asset classes');
    }
    if (beta > 1.3) {
      recommendations.push('Portfolio is highly sensitive to market movements - consider reducing risk');
    }
    if (expectedReturn < riskFreeRate + 3) {
      recommendations.push('Expected return may not adequately compensate for risk taken');
    }
    if (rebalancingNeeds.some(need => need.action !== 'Hold')) {
      recommendations.push('Portfolio allocation has drifted - consider rebalancing');
    }

    // Default recommendations
    if (recommendations.length === 0) {
      recommendations.push('Portfolio appears well-balanced for current risk tolerance');
      recommendations.push('Continue monitoring and rebalancing quarterly');
    }

    // Risk factors
    const riskFactors: string[] = [];
    if (beta > 1.2) {
      riskFactors.push('High market sensitivity increases volatility during downturns');
    }
    if (volatility > 16) {
      riskFactors.push('Above-average volatility may lead to larger short-term losses');
    }
    if (diversificationRatio < 1.3) {
      riskFactors.push('Limited diversification increases concentration risk');
    }
    if (var95 < -totalValue * 0.1) {
      riskFactors.push('Significant potential losses in stress scenarios');
    }
    if (normalizedHoldings.some(h => h.allocation > 50)) {
      riskFactors.push('High concentration in single asset increases idiosyncratic risk');
    }

    // Default risk factors
    if (riskFactors.length === 0) {
      riskFactors.push('Monitor correlation changes during market stress');
      riskFactors.push('Consider impact of inflation on bond allocation');
    }

    const portfolioMetrics: PortfolioMetrics = {
      totalValue,
      expectedReturn,
      volatility,
      sharpeRatio,
      beta,
      diversificationRatio,
      var95,
      var99,
      maxDrawdown,
      treynorRatio,
      informationRatio,
      sortino,
      allocations,
      riskMetrics,
      rebalancingNeeds,
      recommendations,
      riskFactors
    };

    setMetrics(portfolioMetrics);
  }, [holdings, riskFreeRate, marketReturn, timeHorizon, rebalancingThreshold]);

  useEffect(() => {
    calculatePortfolioMetrics();
  }, [calculatePortfolioMetrics]);

  const addHolding = () => {
    const newHolding: PortfolioHolding = {
      id: Date.now().toString(),
      symbol: '',
      name: '',
      allocation: 0,
      expectedReturn: 8.0,
      volatility: 15.0,
      beta: 1.0,
      marketValue: 0
    };
    setHoldings([...holdings, newHolding]);
  };

  const removeHolding = (id: string) => {
    setHoldings(holdings.filter(h => h.id !== id));
  };

  const updateHolding = (id: string, field: keyof PortfolioHolding, value: string | number) => {
    setHoldings(holdings.map(h => 
      h.id === id ? { ...h, [field]: value } : h
    ));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number): string => {
    return `${percent.toFixed(2)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'text-green-400';
      case 'Good': return 'text-blue-400';
      case 'Fair': return 'text-yellow-400';
      case 'Poor': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Buy': return 'text-green-400 bg-green-900/20';
      case 'Sell': return 'text-red-400 bg-red-900/20';
      case 'Hold': return 'text-slate-400 bg-slate-900/20';
      default: return 'text-slate-400 bg-slate-900/20';
    }
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Portfolio Risk Analyzer
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Portfolio Holdings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                Portfolio Holdings
              </h3>
              <button
                onClick={addHolding}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            
            <div className="space-y-3">
              {holdings.map((holding) => (
                <div key={holding.id} className={`p-3 border ${theme.borderColors.primary} rounded-lg bg-slate-800/30`}>
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="text"
                      placeholder="Symbol"
                      value={holding.symbol}
                      onChange={(e) => updateHolding(holding.id, 'symbol', e.target.value)}
                      className={`w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                    <button
                      onClick={() => removeHolding(holding.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className={`block ${theme.textColors.secondary} mb-1`}>Value</label>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400" />
                        <input
                          type="number"
                          value={holding.marketValue}
                          onChange={(e) => updateHolding(holding.id, 'marketValue', Number(e.target.value))}
                          className={`w-full pl-6 pr-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block ${theme.textColors.secondary} mb-1`}>Expected Return %</label>
                      <input
                        type="number"
                        step="0.1"
                        value={holding.expectedReturn}
                        onChange={(e) => updateHolding(holding.id, 'expectedReturn', Number(e.target.value))}
                        className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block ${theme.textColors.secondary} mb-1`}>Volatility %</label>
                      <input
                        type="number"
                        step="0.1"
                        value={holding.volatility}
                        onChange={(e) => updateHolding(holding.id, 'volatility', Number(e.target.value))}
                        className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block ${theme.textColors.secondary} mb-1`}>Beta</label>
                      <input
                        type="number"
                        step="0.1"
                        value={holding.beta}
                        onChange={(e) => updateHolding(holding.id, 'beta', Number(e.target.value))}
                        className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Parameters */}
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Analysis Parameters
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Risk-Free Rate %
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={riskFreeRate}
                      onChange={(e) => setRiskFreeRate(Number(e.target.value))}
                      className={`w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Market Return %
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={marketReturn}
                      onChange={(e) => setMarketReturn(Number(e.target.value))}
                      className={`w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Time Horizon (months)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Rebalancing Threshold %
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={rebalancingThreshold}
                    onChange={(e) => setRebalancingThreshold(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {metrics && (
            <>
              {/* Portfolio Overview */}
              <div className={`p-6 border ${theme.borderColors.primary} rounded-lg bg-slate-800/50`}>
                <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4`}>
                  Portfolio Overview
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>
                      {formatCurrency(metrics.totalValue)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Total Value</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-xl font-bold text-green-400 mb-1`}>
                      {formatPercent(metrics.expectedReturn)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Expected Return</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-xl font-bold text-yellow-400 mb-1`}>
                      {formatPercent(metrics.volatility)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Volatility</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-xl font-bold text-blue-400 mb-1`}>
                      {metrics.sharpeRatio.toFixed(2)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Sharpe Ratio</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-600">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Portfolio Beta:</span>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {metrics.beta.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Diversification:</span>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {metrics.diversificationRatio.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>VaR (95%):</span>
                      <div className={`font-semibold text-red-400`}>
                        {formatCurrency(metrics.var95)}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Max Drawdown:</span>
                      <div className={`font-semibold text-red-400`}>
                        {formatPercent(metrics.maxDrawdown)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Allocation */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Current Allocation
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
                      <tr>
                        <th className="px-4 py-3 text-left">Asset</th>
                        <th className="px-4 py-3 text-left">Allocation</th>
                        <th className="px-4 py-3 text-left">Value</th>
                        <th className="px-4 py-3 text-left">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.allocations.map((allocation, index) => (
                        <tr key={index} className={`border-t ${theme.borderColors.primary}`}>
                          <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                            {allocation.asset}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatPercent(allocation.percentage)}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatCurrency(allocation.value)}
                          </td>
                          <td className={`px-4 py-3`}>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-slate-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${Math.min(allocation.percentage, 100)}%` }}
                                />
                              </div>
                              <span className={`text-xs ${theme.textColors.secondary}`}>
                                {allocation.percentage.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Risk Metrics */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Risk Metrics Analysis
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
                      <tr>
                        <th className="px-4 py-3 text-left">Metric</th>
                        <th className="px-4 py-3 text-left">Value</th>
                        <th className="px-4 py-3 text-left">Benchmark</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.riskMetrics.map((metric, index) => (
                        <tr key={index} className={`border-t ${theme.borderColors.primary}`}>
                          <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                            {metric.metric}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary} font-semibold`}>
                            {metric.value}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.secondary}`}>
                            {metric.benchmark}
                          </td>
                          <td className={`px-4 py-3`}>
                            <span className={`font-semibold ${getStatusColor(metric.status)}`}>
                              {metric.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rebalancing Recommendations */}
              {metrics.rebalancingNeeds.some(need => need.action !== 'Hold') && (
                <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                  <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                    <h3 className={`font-semibold ${theme.textColors.primary}`}>
                      Rebalancing Recommendations
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
                        <tr>
                          <th className="px-4 py-3 text-left">Asset</th>
                          <th className="px-4 py-3 text-left">Current</th>
                          <th className="px-4 py-3 text-left">Target</th>
                          <th className="px-4 py-3 text-left">Action</th>
                          <th className="px-4 py-3 text-left">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.rebalancingNeeds.map((need, index) => (
                          <tr key={index} className={`border-t ${theme.borderColors.primary}`}>
                            <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                              {need.asset}
                            </td>
                            <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                              {formatPercent(need.current)}
                            </td>
                            <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                              {formatPercent(need.target)}
                            </td>
                            <td className={`px-4 py-3`}>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${getActionColor(need.action)}`}>
                                {need.action}
                              </span>
                            </td>
                            <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                              {formatCurrency(need.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className={`p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg`}>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold text-blue-400 mb-2`}>
                      Portfolio Optimization Recommendations
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      {metrics.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              <div className={`p-4 bg-red-900/20 border border-red-500/20 rounded-lg`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold text-red-400 mb-2`}>
                      Risk Factors to Monitor
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      {metrics.riskFactors.map((risk, index) => (
                        <li key={index}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Portfolio Theory Education */}
              <div className={`p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg`}>
                <h4 className={`font-semibold text-yellow-400 mb-2`}>
                  Modern Portfolio Theory Concepts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className={`${theme.textColors.secondary} mb-2`}><strong>Risk Metrics:</strong></p>
                    <ul className={`space-y-1 ${theme.textColors.secondary}`}>
                      <li>• <strong>Sharpe Ratio:</strong> Risk-adjusted return per unit of volatility</li>
                      <li>• <strong>Beta:</strong> Sensitivity to market movements (1.0 = market)</li>
                      <li>• <strong>VaR:</strong> Maximum expected loss at given confidence level</li>
                      <li>• <strong>Max Drawdown:</strong> Largest peak-to-trough decline</li>
                    </ul>
                  </div>
                  <div>
                    <p className={`${theme.textColors.secondary} mb-2`}><strong>Optimization Tips:</strong></p>
                    <ul className={`space-y-1 ${theme.textColors.secondary}`}>
                      <li>• <strong>Diversification:</strong> Reduces risk without sacrificing return</li>
                      <li>• <strong>Correlation:</strong> Low correlation assets improve diversification</li>
                      <li>• <strong>Rebalancing:</strong> Maintains target allocation and risk profile</li>
                      <li>• <strong>Risk Tolerance:</strong> Match portfolio volatility to comfort level</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
