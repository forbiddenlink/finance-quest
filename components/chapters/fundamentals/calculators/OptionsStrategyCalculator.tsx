'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { useOptionsCalculator } from '@/lib/utils/calculatorHooks';
import { validateFields, CalculatorValidations } from '@/lib/utils/calculatorValidation';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { CurrencyInput, PercentageInput, NumberInput, SelectField } from '@/components/shared/calculators/FormFields';
import { InputGroup } from '@/components/shared/calculators/FormFields';
import { ResultCard } from '@/components/shared/calculators/ResultComponents';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import {
  DollarSign,
  Target,
  Percent,
  Calendar,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Calculator,
  BarChart3,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';

interface OptionsResult {
  callPrice: number;
  putPrice: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  impliedVolatility: number;
  timeDecay: number;
  profitLoss: number;
  breakEvenPoints: number[];
  maxProfit: number;
  maxLoss: number;
  probabilityOfProfit: number;
  strategy: OptionsStrategy;
  payoffDiagram: { price: number; pnl: number }[];
  riskMetrics: {
    metric: string;
    value: string;
    interpretation: string;
    color: string;
  }[];
  strategyAnalysis: {
    marketOutlook: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    complexity: 'Beginner' | 'Intermediate' | 'Advanced';
    timeHorizon: 'Short-term' | 'Medium-term' | 'Long-term';
    bestScenario: string;
    worstScenario: string;
  };
}

interface OptionsStrategy {
  name: string;
  type: 'Single' | 'Spread' | 'Combination' | 'Exotic';
  description: string;
  maxProfit: string;
  maxLoss: string;
  breakEven: string;
  marketView: string;
}

const OPTION_STRATEGIES: { [key: string]: OptionsStrategy } = {
  'long-call': {
    name: 'Long Call',
    type: 'Single',
    description: 'Buy a call option - bullish strategy with limited risk and unlimited profit potential',
    maxProfit: 'Unlimited (Stock Price - Strike Price - Premium)',
    maxLoss: 'Premium Paid',
    breakEven: 'Strike Price + Premium Paid',
    marketView: 'Bullish'
  },
  'long-put': {
    name: 'Long Put',
    type: 'Single',
    description: 'Buy a put option - bearish strategy with limited risk and high profit potential',
    maxProfit: 'Strike Price - Premium (if stock goes to $0)',
    maxLoss: 'Premium Paid',
    breakEven: 'Strike Price - Premium Paid',
    marketView: 'Bearish'
  },
  'covered-call': {
    name: 'Covered Call',
    type: 'Combination',
    description: 'Own stock + sell call option - generates income but caps upside',
    maxProfit: 'Strike Price - Stock Purchase Price + Premium Received',
    maxLoss: 'Stock Purchase Price - Premium Received',
    breakEven: 'Stock Purchase Price - Premium Received',
    marketView: 'Neutral to Slightly Bullish'
  },
  'cash-secured-put': {
    name: 'Cash-Secured Put',
    type: 'Single',
    description: 'Sell put with cash backing - collect premium while waiting to buy stock cheaper',
    maxProfit: 'Premium Received',
    maxLoss: 'Strike Price - Premium Received',
    breakEven: 'Strike Price - Premium Received',
    marketView: 'Neutral to Bullish'
  },
  'bull-call-spread': {
    name: 'Bull Call Spread',
    type: 'Spread',
    description: 'Buy lower strike call + sell higher strike call - limited risk and profit',
    maxProfit: 'Higher Strike - Lower Strike - Net Premium',
    maxLoss: 'Net Premium Paid',
    breakEven: 'Lower Strike + Net Premium',
    marketView: 'Moderately Bullish'
  },
  'bear-put-spread': {
    name: 'Bear Put Spread',
    type: 'Spread',
    description: 'Buy higher strike put + sell lower strike put - limited risk bearish strategy',
    maxProfit: 'Higher Strike - Lower Strike - Net Premium',
    maxLoss: 'Net Premium Paid',
    breakEven: 'Higher Strike - Net Premium',
    marketView: 'Moderately Bearish'
  },
  'iron-condor': {
    name: 'Iron Condor',
    type: 'Combination',
    description: 'Sell call spread + sell put spread - profit from low volatility',
    maxProfit: 'Net Premium Received',
    maxLoss: 'Spread Width - Net Premium',
    breakEven: 'Two breakeven points',
    marketView: 'Low Volatility / Range-bound'
  },
  'straddle': {
    name: 'Long Straddle',
    type: 'Combination',
    description: 'Buy call + buy put at same strike - profit from high volatility',
    maxProfit: 'Unlimited',
    maxLoss: 'Total Premium Paid',
    breakEven: 'Strike ± Total Premium',
    marketView: 'High Volatility (Direction Unknown)'
  }
};

export default function OptionsStrategyCalculator() {
  const { recordCalculatorUsage } = useProgressStore();

  // Market Data
  const [stockPrice, setStockPrice] = useState<number>(100);
  const [strikePrice, setStrikePrice] = useState<number>(100);
  const [strikePrice2, setStrikePrice2] = useState<number>(105); // For spreads
  const [timeToExpiration, setTimeToExpiration] = useState<number>(30); // days
  const [volatility, setVolatility] = useState<number>(25); // percentage
  const [riskFreeRate, setRiskFreeRate] = useState<number>(5); // percentage
  const [dividendYield, setDividendYield] = useState<number>(2); // percentage

  // Strategy Configuration
  const [selectedStrategy, setSelectedStrategy] = useState<string>('long-call');
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [position, setPosition] = useState<'long' | 'short'>('long');
  const [contracts, setContracts] = useState<number>(1);
  const [premiumPaid, setPremiumPaid] = useState<number>(0);

  const [result, setResult] = useState<OptionsResult | null>(null);

  useEffect(() => {
    recordCalculatorUsage('options-strategy-calculator');
  }, [recordCalculatorUsage]);

  // Black-Scholes calculation
  const calculateBlackScholes = useCallback((
    S: number, // Stock price
    K: number, // Strike price
    T: number, // Time to expiration (years)
    r: number, // Risk-free rate
    sigma: number, // Volatility
    q: number = 0 // Dividend yield
  ) => {
    const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    // Standard normal cumulative distribution function
    const normCDF = (x: number): number => {
      return 0.5 * (1 + erf(x / Math.sqrt(2)));
    };

    // Error function approximation
    const erf = (x: number): number => {
      const a1 =  0.254829592;
      const a2 = -0.284496736;
      const a3 =  1.421413741;
      const a4 = -1.453152027;
      const a5 =  1.061405429;
      const p  =  0.3275911;

      const sign = x < 0 ? -1 : 1;
      x = Math.abs(x);

      const t = 1.0 / (1.0 + p * x);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

      return sign * y;
    };

    const callPrice = S * Math.exp(-q * T) * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
    const putPrice = K * Math.exp(-r * T) * normCDF(-d2) - S * Math.exp(-q * T) * normCDF(-d1);

    // Greeks
    const delta = Math.exp(-q * T) * normCDF(d1);
    const gamma = Math.exp(-q * T) / (S * sigma * Math.sqrt(T)) * 
                  Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI);
    const theta = (-S * Math.exp(-q * T) * Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI) * sigma / (2 * Math.sqrt(T)) 
                   - r * K * Math.exp(-r * T) * normCDF(d2) 
                   + q * S * Math.exp(-q * T) * normCDF(d1)) / 365;
    const vega = S * Math.exp(-q * T) * Math.sqrt(T) * Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI) / 100;
    const rho = K * T * Math.exp(-r * T) * normCDF(d2) / 100;

    return {
      callPrice,
      putPrice,
      delta,
      gamma,
      theta,
      vega,
      rho
    };
  }, []);

  const calculateOptionsResult = useCallback(() => {
    const T = timeToExpiration / 365; // Convert days to years
    const r = riskFreeRate / 100;
    const sigma = volatility / 100;
    const q = dividendYield / 100;

    const bs = calculateBlackScholes(stockPrice, strikePrice, T, r, sigma, q);
    
    let profitLoss = 0;
    let maxProfit = 0;
    let maxLoss = 0;
    let breakEvenPoints: number[] = [];
    const timeDecay = Math.abs(bs.theta);
    const currentPremium = premiumPaid || (optionType === 'call' ? bs.callPrice : bs.putPrice);

    // Calculate strategy-specific metrics
    const strategy = OPTION_STRATEGIES[selectedStrategy];
    
    // Generate payoff diagram
    const payoffDiagram: { price: number; pnl: number }[] = [];
    const priceRange = stockPrice * 0.5; // 50% range around current price
    const step = stockPrice * 0.02; // 2% steps
    
    for (let price = stockPrice - priceRange; price <= stockPrice + priceRange; price += step) {
      let pnl = 0;
      
      switch (selectedStrategy) {
        case 'long-call':
          pnl = Math.max(price - strikePrice, 0) - currentPremium;
          break;
        case 'long-put':
          pnl = Math.max(strikePrice - price, 0) - currentPremium;
          break;
        case 'covered-call':
          pnl = Math.min(price - stockPrice, strikePrice - stockPrice) + currentPremium;
          break;
        case 'cash-secured-put':
          pnl = currentPremium - Math.max(strikePrice - price, 0);
          break;
        case 'bull-call-spread':
          const longCallPnL = Math.max(price - strikePrice, 0);
          const shortCallPnL = -Math.max(price - strikePrice2, 0);
          pnl = longCallPnL + shortCallPnL - currentPremium;
          break;
        default:
          pnl = Math.max(price - strikePrice, 0) - currentPremium;
      }
      
      payoffDiagram.push({ price, pnl: pnl * contracts * 100 }); // Multiply by contracts and 100 shares per contract
    }

    // Calculate current P&L
    switch (selectedStrategy) {
      case 'long-call':
        profitLoss = (Math.max(stockPrice - strikePrice, 0) - currentPremium) * contracts * 100;
        maxProfit = Infinity;
        maxLoss = currentPremium * contracts * 100;
        breakEvenPoints = [strikePrice + currentPremium];
        break;
      case 'long-put':
        profitLoss = (Math.max(strikePrice - stockPrice, 0) - currentPremium) * contracts * 100;
        maxProfit = (strikePrice - currentPremium) * contracts * 100;
        maxLoss = currentPremium * contracts * 100;
        breakEvenPoints = [strikePrice - currentPremium];
        break;
      case 'covered-call':
        profitLoss = (Math.min(stockPrice - stockPrice, strikePrice - stockPrice) + currentPremium) * contracts * 100;
        maxProfit = (strikePrice - stockPrice + currentPremium) * contracts * 100;
        maxLoss = (stockPrice - currentPremium) * contracts * 100;
        breakEvenPoints = [stockPrice - currentPremium];
        break;
      default:
        profitLoss = (Math.max(stockPrice - strikePrice, 0) - currentPremium) * contracts * 100;
        maxProfit = Infinity;
        maxLoss = currentPremium * contracts * 100;
        breakEvenPoints = [strikePrice + currentPremium];
    }

    // Calculate probability of profit (simplified)
    const probabilityOfProfit = stockPrice > breakEvenPoints[0] ? 60 : 40; // Simplified calculation

    // Risk metrics
    const riskMetrics = [
      {
        metric: 'Delta',
        value: (bs.delta * (position === 'long' ? 1 : -1)).toFixed(3),
        interpretation: 'Price sensitivity to $1 stock move',
        color: bs.delta > 0 ? 'text-green-400' : 'text-red-400'
      },
      {
        metric: 'Gamma',
        value: bs.gamma.toFixed(4),
        interpretation: 'Rate of change of delta',
        color: 'text-blue-400'
      },
      {
        metric: 'Theta',
        value: bs.theta.toFixed(2),
        interpretation: 'Daily time decay',
        color: 'text-red-400'
      },
      {
        metric: 'Vega',
        value: bs.vega.toFixed(2),
        interpretation: 'Sensitivity to 1% volatility change',
        color: 'text-purple-400'
      },
      {
        metric: 'Rho',
        value: bs.rho.toFixed(2),
        interpretation: 'Sensitivity to 1% interest rate change',
        color: 'text-yellow-400'
      }
    ];

    // Strategy analysis
    const strategyAnalysis = {
      marketOutlook: strategy.marketView,
      riskLevel: (selectedStrategy.includes('spread') ? 'Medium' : 
                 selectedStrategy.includes('straddle') || selectedStrategy.includes('condor') ? 'High' : 'Low') as 'Low' | 'Medium' | 'High',
      complexity: (selectedStrategy.includes('spread') || selectedStrategy.includes('condor') ? 'Advanced' :
                  selectedStrategy.includes('covered') || selectedStrategy.includes('secured') ? 'Intermediate' : 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced',
      timeHorizon: (timeToExpiration <= 30 ? 'Short-term' : 
                   timeToExpiration <= 90 ? 'Medium-term' : 'Long-term') as 'Short-term' | 'Medium-term' | 'Long-term',
      bestScenario: strategy.maxProfit,
      worstScenario: strategy.maxLoss
    };

    const optionsResult: OptionsResult = {
      callPrice: bs.callPrice,
      putPrice: bs.putPrice,
      delta: bs.delta,
      gamma: bs.gamma,
      theta: bs.theta,
      vega: bs.vega,
      rho: bs.rho,
      impliedVolatility: volatility,
      timeDecay,
      profitLoss,
      breakEvenPoints,
      maxProfit,
      maxLoss,
      probabilityOfProfit,
      strategy,
      payoffDiagram,
      riskMetrics,
      strategyAnalysis
    };

    setResult(optionsResult);
  }, [
    stockPrice, strikePrice, strikePrice2, timeToExpiration, volatility,
    riskFreeRate, dividendYield, selectedStrategy, optionType, position,
    contracts, premiumPaid, calculateBlackScholes
  ]);

  useEffect(() => {
    calculateOptionsResult();
  }, [calculateOptionsResult]);

  // Auto-update premium based on Black-Scholes when strategy changes
  useEffect(() => {
    if (!premiumPaid) {
      const T = timeToExpiration / 365;
      const r = riskFreeRate / 100;
      const sigma = volatility / 100;
      const q = dividendYield / 100;
      const bs = calculateBlackScholes(stockPrice, strikePrice, T, r, sigma, q);
      setPremiumPaid(optionType === 'call' ? bs.callPrice : bs.putPrice);
    }
  }, [selectedStrategy, optionType, stockPrice, strikePrice, timeToExpiration, volatility, riskFreeRate, dividendYield, calculateBlackScholes, premiumPaid]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (percent: number): string => {
    return `${percent.toFixed(2)}%`;
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-400 bg-green-900/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'High': return 'text-red-400 bg-red-900/20';
      default: return 'text-slate-400 bg-slate-900/20';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-green-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Options Strategy Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Strategy Selection */}
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Strategy Selection
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Options Strategy
                </label>
                <select
                  value={selectedStrategy}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                  className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                >
                  <optgroup label="Single Options">
                    <option value="long-call">Long Call</option>
                    <option value="long-put">Long Put</option>
                    <option value="cash-secured-put">Cash-Secured Put</option>
                  </optgroup>
                  <optgroup label="Spreads">
                    <option value="bull-call-spread">Bull Call Spread</option>
                    <option value="bear-put-spread">Bear Put Spread</option>
                  </optgroup>
                  <optgroup label="Combinations">
                    <option value="covered-call">Covered Call</option>
                    <option value="straddle">Long Straddle</option>
                    <option value="iron-condor">Iron Condor</option>
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Option Type
                  </label>
                  <select
                    value={optionType}
                    onChange={(e) => setOptionType(e.target.value as 'call' | 'put')}
                    className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  >
                    <option value="call">Call</option>
                    <option value="put">Put</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Position
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as 'long' | 'short')}
                    className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  >
                    <option value="long">Long (Buy)</option>
                    <option value="short">Short (Sell)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Number of Contracts
                </label>
                <input
                  type="number"
                  min="1"
                  value={contracts}
                  onChange={(e) => setContracts(Number(e.target.value))}
                  className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                />
              </div>
            </div>
          </div>

          {/* Market Data */}
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Market Data
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Current Stock Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={stockPrice}
                    onChange={(e) => setStockPrice(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Strike Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={strikePrice}
                      onChange={(e) => setStrikePrice(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                {(selectedStrategy.includes('spread') || selectedStrategy.includes('condor')) && (
                  <div>
                    <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                      Strike Price 2
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        step="0.01"
                        value={strikePrice2}
                        onChange={(e) => setStrikePrice2(Number(e.target.value))}
                        className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Option Premium
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={premiumPaid}
                    onChange={(e) => setPremiumPaid(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Days to Expiration
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min="1"
                      value={timeToExpiration}
                      onChange={(e) => setTimeToExpiration(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Implied Volatility %
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={volatility}
                      onChange={(e) => setVolatility(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Risk-Free Rate %
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={riskFreeRate}
                      onChange={(e) => setRiskFreeRate(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Dividend Yield %
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={dividendYield}
                      onChange={(e) => setDividendYield(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {result && (
            <>
              {/* Strategy Overview */}
              <div className={`p-6 border ${theme.borderColors.primary} rounded-lg bg-slate-800/50`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
                    {result.strategy.name}
                  </h3>
                  <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${getRiskLevelColor(result.strategyAnalysis.riskLevel)}`}>
                    {result.strategyAnalysis.riskLevel} Risk
                  </div>
                </div>

                <p className={`${theme.textColors.secondary} mb-4`}>
                  {result.strategy.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      result.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                    } mb-1`}>
                      {formatCurrency(result.profitLoss)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Current P&L</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-lg font-bold text-green-400 mb-1`}>
                      {result.maxProfit === Infinity ? 'Unlimited' : formatCurrency(result.maxProfit)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Max Profit</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-lg font-bold text-red-400 mb-1`}>
                      {formatCurrency(result.maxLoss)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Max Loss</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-600">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Market View:</span>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {result.strategyAnalysis.marketOutlook}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Complexity:</span>
                      <div className={`font-semibold ${getComplexityColor(result.strategyAnalysis.complexity)}`}>
                        {result.strategyAnalysis.complexity}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Time Horizon:</span>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {result.strategyAnalysis.timeHorizon}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Break-Even:</span>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {result.breakEvenPoints.map(bp => formatCurrency(bp)).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Black-Scholes Pricing */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Black-Scholes Option Pricing
                  </h3>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className={`text-xl font-bold text-green-400 mb-1`}>
                        {formatCurrency(result.callPrice)}
                      </div>
                      <div className={`text-sm ${theme.textColors.secondary}`}>Call Price</div>
                    </div>

                    <div className="text-center">
                      <div className={`text-xl font-bold text-red-400 mb-1`}>
                        {formatCurrency(result.putPrice)}
                      </div>
                      <div className={`text-sm ${theme.textColors.secondary}`}>Put Price</div>
                    </div>

                    <div className="text-center">
                      <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                        {formatPercent(result.impliedVolatility)}
                      </div>
                      <div className={`text-sm ${theme.textColors.secondary}`}>Implied Vol</div>
                    </div>

                    <div className="text-center">
                      <div className={`text-xl font-bold text-yellow-400 mb-1`}>
                        {formatPercent(result.probabilityOfProfit)}
                      </div>
                      <div className={`text-sm ${theme.textColors.secondary}`}>Prob. of Profit</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Greeks Analysis */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Greeks Risk Analysis
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
                      <tr>
                        <th className="px-4 py-3 text-left">Greek</th>
                        <th className="px-4 py-3 text-left">Value</th>
                        <th className="px-4 py-3 text-left">Interpretation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.riskMetrics.map((metric, index) => (
                        <tr key={index} className={`border-t ${theme.borderColors.primary}`}>
                          <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                            {metric.metric}
                          </td>
                          <td className={`px-4 py-3 font-semibold ${metric.color}`}>
                            {metric.value}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.secondary}`}>
                            {metric.interpretation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Strategy Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Best Case Scenario */}
                <div className={`p-4 bg-green-900/20 border border-green-500/20 rounded-lg`}>
                  <div className="flex items-start gap-3">
                    <ArrowUp className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className={`font-semibold text-green-400 mb-2`}>
                        Best Case Scenario
                      </h4>
                      <p className={`text-sm ${theme.textColors.secondary}`}>
                        {result.strategyAnalysis.bestScenario}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Worst Case Scenario */}
                <div className={`p-4 bg-red-900/20 border border-red-500/20 rounded-lg`}>
                  <div className="flex items-start gap-3">
                    <ArrowDown className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <h4 className={`font-semibold text-red-400 mb-2`}>
                        Worst Case Scenario
                      </h4>
                      <p className={`text-sm ${theme.textColors.secondary}`}>
                        {result.strategyAnalysis.worstScenario}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Options Education */}
              <div className={`p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg`}>
                <h4 className={`font-semibold text-blue-400 mb-2`}>
                  Options Trading Concepts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className={`${theme.textColors.secondary} mb-2`}><strong>Key Greeks:</strong></p>
                    <ul className={`space-y-1 ${theme.textColors.secondary}`}>
                      <li>• <strong>Delta:</strong> Price sensitivity to stock movement (0-1 for calls, -1-0 for puts)</li>
                      <li>• <strong>Gamma:</strong> Rate of delta change (higher for at-the-money options)</li>
                      <li>• <strong>Theta:</strong> Time decay (options lose value as expiration approaches)</li>
                      <li>• <strong>Vega:</strong> Volatility sensitivity (higher for longer-dated options)</li>
                    </ul>
                  </div>
                  <div>
                    <p className={`${theme.textColors.secondary} mb-2`}><strong>Strategy Tips:</strong></p>
                    <ul className={`space-y-1 ${theme.textColors.secondary}`}>
                      <li>• <strong>Moneyness:</strong> ITM options have higher delta, OTM have lower</li>
                      <li>• <strong>Time Decay:</strong> Accelerates in final 30 days before expiration</li>
                      <li>• <strong>Volatility:</strong> Higher IV increases option premiums</li>
                      <li>• <strong>Risk Management:</strong> Never risk more than you can afford to lose</li>
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
