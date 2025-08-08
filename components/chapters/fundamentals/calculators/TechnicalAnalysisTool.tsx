'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Activity,
  Target,
  AlertTriangle,
  DollarSign
} from 'lucide-react';

interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'Buy' | 'Sell' | 'Hold' | 'Strong Buy' | 'Strong Sell';
  strength: number; // 0-100
  description: string;
}

interface TechnicalAnalysis {
  currentPrice: number;
  trend: 'Bullish' | 'Bearish' | 'Sideways';
  trendStrength: number;
  overallSignal: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  signalScore: number; // -100 to +100
  
  movingAverages: {
    sma20: number;
    sma50: number;
    sma200: number;
    ema12: number;
    ema26: number;
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  
  oscillators: {
    rsi: number;
    stochastic: number;
    williamsR: number;
    commodityChannelIndex: number;
  };
  
  momentum: {
    roc: number; // Rate of Change
    momentum: number;
    rsi: number;
    bollinger: {
      upper: number;
      middle: number;
      lower: number;
      position: number; // % position within bands
    };
  };
  
  volume: {
    averageVolume: number;
    volumeRatio: number;
    onBalanceVolume: number;
    volumeTrend: 'Increasing' | 'Decreasing' | 'Stable';
  };
  
  indicators: TechnicalIndicator[];
  supportResistance: {
    support: number[];
    resistance: number[];
    nextSupport: number;
    nextResistance: number;
  };
  
  signals: {
    signal: string;
    type: 'Buy' | 'Sell' | 'Neutral';
    strength: 'Strong' | 'Moderate' | 'Weak';
    description: string;
  }[];
  
  riskLevel: 'Low' | 'Medium' | 'High';
  volatility: number;
  recommendations: string[];
  warnings: string[];
}

// Simulated price data for demonstration
const generatePriceData = (currentPrice: number, days: number): PriceData[] => {
  const data: PriceData[] = [];
  let price = currentPrice * 0.9; // Start 10% lower
  const volatility = 0.02; // 2% daily volatility
  
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * volatility * 2;
    const open = price;
    const close = price * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = Math.floor(1000000 + Math.random() * 2000000);
    
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume
    });
    
    price = close;
  }
  
  return data;
};

export default function TechnicalAnalysisTool() {
  const { recordCalculatorUsage } = useProgressStore();

  // Input Parameters
  const [symbol, setSymbol] = useState<string>('AAPL');
  const [currentPrice, setCurrentPrice] = useState<number>(175.50);
  const [timeframe, setTimeframe] = useState<string>('daily');
  const [lookbackPeriod, setLookbackPeriod] = useState<number>(100);
  
  // Technical Parameters
  const [rsiPeriod, setRsiPeriod] = useState<number>(14);
  const [macdFast, setMacdFast] = useState<number>(12);
  const [macdSlow, setMacdSlow] = useState<number>(26);
  const [macdSignal, setMacdSignal] = useState<number>(9);
  const [bollingerPeriod, setBollingerPeriod] = useState<number>(20);
  const [bollingerStdDev, setBollingerStdDev] = useState<number>(2);

  const [analysis, setAnalysis] = useState<TechnicalAnalysis | null>(null);

  useEffect(() => {
    recordCalculatorUsage('technical-analysis-tool');
  }, [recordCalculatorUsage]);

  // Generate sample price data
  const priceData = useMemo(() => {
    return generatePriceData(currentPrice, lookbackPeriod);
  }, [currentPrice, lookbackPeriod]);

  // Calculate Simple Moving Average
  const calculateSMA = useCallback((data: number[], period: number): number[] => {
    const sma: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  }, []);

  // Calculate Exponential Moving Average
  const calculateEMA = useCallback((data: number[], period: number): number[] => {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    // First EMA is SMA
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += data[i];
    }
    ema.push(sum / period);
    
    // Calculate subsequent EMAs
    for (let i = period; i < data.length; i++) {
      ema.push((data[i] * multiplier) + (ema[ema.length - 1] * (1 - multiplier)));
    }
    
    return ema;
  }, []);

  // Calculate RSI
  const calculateRSI = useCallback((data: number[], period: number): number => {
    if (data.length < period + 1) return 50;
    
    const changes = [];
    for (let i = 1; i < data.length; i++) {
      changes.push(data[i] - data[i - 1]);
    }
    
    const gains = changes.map(change => Math.max(change, 0));
    const losses = changes.map(change => Math.max(-change, 0));
    
    const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }, []);

  // Calculate Bollinger Bands
  const calculateBollingerBands = useCallback((data: number[], period: number, stdDev: number) => {
    if (data.length < period) return { upper: 0, middle: 0, lower: 0 };
    
    const sma = calculateSMA(data, period);
    const currentSMA = sma[sma.length - 1];
    
    const recentData = data.slice(-period);
    const variance = recentData.reduce((sum, price) => sum + Math.pow(price - currentSMA, 2), 0) / period;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      upper: currentSMA + (standardDeviation * stdDev),
      middle: currentSMA,
      lower: currentSMA - (standardDeviation * stdDev)
    };
  }, [calculateSMA]);

  // Perform Technical Analysis
  const performAnalysis = useCallback(() => {
    const prices = priceData.map(d => d.close);
    const volumes = priceData.map(d => d.volume);
    
    if (prices.length < 50) {
      return; // Need more data
    }

    // Moving Averages
    const sma20 = calculateSMA(prices, 20);
    const sma50 = calculateSMA(prices, 50);
    const sma200 = calculateSMA(prices, 200);
    const ema12 = calculateEMA(prices, macdFast);
    const ema26 = calculateEMA(prices, macdSlow);
    
    // MACD
    const macdLine = ema12[ema12.length - 1] - ema26[ema26.length - 1];
    const macdHistory = [];
    for (let i = 0; i < Math.min(ema12.length, ema26.length); i++) {
      macdHistory.push(ema12[i] - ema26[i]);
    }
    const signalEMA = calculateEMA(macdHistory, macdSignal);
    const signalLine = signalEMA[signalEMA.length - 1];
    const histogram = macdLine - signalLine;

    // RSI and other oscillators
    const rsi = calculateRSI(prices, rsiPeriod);
    const stochastic = Math.min(100, Math.max(0, ((currentPrice - Math.min(...prices.slice(-14))) / 
                      (Math.max(...prices.slice(-14)) - Math.min(...prices.slice(-14)))) * 100));
    const williamsR = -100 + stochastic;
    const commodityChannelIndex = (currentPrice - sma20[sma20.length - 1]) / (0.015 * sma20[sma20.length - 1]);

    // Bollinger Bands
    const bollinger = calculateBollingerBands(prices, bollingerPeriod, bollingerStdDev);
    const bollingerPosition = ((currentPrice - bollinger.lower) / (bollinger.upper - bollinger.lower)) * 100;

    // Rate of Change and Momentum
    const roc = ((currentPrice - prices[prices.length - 21]) / prices[prices.length - 21]) * 100;
    const momentum = currentPrice - prices[prices.length - 11];

    // Volume Analysis
    const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const currentVolume = volumes[volumes.length - 1];
    const volumeRatio = currentVolume / avgVolume;
    
    // On Balance Volume (simplified)
    let obv = 0;
    for (let i = 1; i < Math.min(prices.length, 20); i++) {
      if (prices[i] > prices[i - 1]) {
        obv += volumes[i];
      } else if (prices[i] < prices[i - 1]) {
        obv -= volumes[i];
      }
    }

    // Trend Analysis
    const recentPrices = prices.slice(-20);
    const priceChange = (recentPrices[recentPrices.length - 1] - recentPrices[0]) / recentPrices[0];
    const trend = priceChange > 0.05 ? 'Bullish' : priceChange < -0.05 ? 'Bearish' : 'Sideways';
    const trendStrength = Math.min(100, Math.abs(priceChange) * 1000);

    // Support and Resistance (simplified)
    const recentHighs = prices.slice(-50).filter((_, i, arr) => {
      return i > 0 && i < arr.length - 1 && arr[i] > arr[i - 1] && arr[i] > arr[i + 1];
    }).sort((a, b) => b - a);
    
    const recentLows = prices.slice(-50).filter((_, i, arr) => {
      return i > 0 && i < arr.length - 1 && arr[i] < arr[i - 1] && arr[i] < arr[i + 1];
    }).sort((a, b) => a - b);

    const resistance = recentHighs.slice(0, 3);
    const support = recentLows.slice(0, 3);

    // Technical Indicators
    const indicators: TechnicalIndicator[] = [
      {
        name: 'RSI (14)',
        value: rsi,
        signal: rsi > 70 ? 'Sell' : rsi < 30 ? 'Buy' : 'Hold',
        strength: rsi > 80 || rsi < 20 ? 90 : rsi > 70 || rsi < 30 ? 70 : 40,
        description: `RSI at ${rsi.toFixed(1)} - ${rsi > 70 ? 'overbought' : rsi < 30 ? 'oversold' : 'neutral'}`
      },
      {
        name: 'MACD',
        value: macdLine,
        signal: histogram > 0 && macdLine > signalLine ? 'Buy' : histogram < 0 && macdLine < signalLine ? 'Sell' : 'Hold',
        strength: Math.min(90, Math.abs(histogram) * 100),
        description: `MACD ${macdLine > signalLine ? 'bullish' : 'bearish'} crossover`
      },
      {
        name: 'SMA Cross',
        value: sma20[sma20.length - 1],
        signal: currentPrice > sma20[sma20.length - 1] && sma20[sma20.length - 1] > sma50[sma50.length - 1] ? 'Buy' : 
               currentPrice < sma20[sma20.length - 1] && sma20[sma20.length - 1] < sma50[sma50.length - 1] ? 'Sell' : 'Hold',
        strength: Math.min(90, Math.abs((currentPrice - sma20[sma20.length - 1]) / currentPrice) * 1000),
        description: `Price ${currentPrice > sma20[sma20.length - 1] ? 'above' : 'below'} SMA20`
      },
      {
        name: 'Bollinger Bands',
        value: bollingerPosition,
        signal: bollingerPosition > 80 ? 'Sell' : bollingerPosition < 20 ? 'Buy' : 'Hold',
        strength: bollingerPosition > 90 || bollingerPosition < 10 ? 90 : 
                 bollingerPosition > 80 || bollingerPosition < 20 ? 70 : 40,
        description: `${bollingerPosition.toFixed(0)}% through Bollinger Bands`
      },
      {
        name: 'Stochastic',
        value: stochastic,
        signal: stochastic > 80 ? 'Sell' : stochastic < 20 ? 'Buy' : 'Hold',
        strength: stochastic > 90 || stochastic < 10 ? 90 : stochastic > 80 || stochastic < 20 ? 70 : 40,
        description: `Stochastic at ${stochastic.toFixed(1)} - ${stochastic > 80 ? 'overbought' : stochastic < 20 ? 'oversold' : 'neutral'}`
      }
    ];

    // Signal aggregation
    const buySignals = indicators.filter(i => i.signal === 'Buy' || i.signal === 'Strong Buy').length;
    const sellSignals = indicators.filter(i => i.signal === 'Sell' || i.signal === 'Strong Sell').length;
    const totalSignals = indicators.length;
    
    const signalScore = ((buySignals - sellSignals) / totalSignals) * 100;
    
    let overallSignal: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
    if (signalScore > 50) overallSignal = 'Strong Buy';
    else if (signalScore > 20) overallSignal = 'Buy';
    else if (signalScore > -20) overallSignal = 'Hold';
    else if (signalScore > -50) overallSignal = 'Sell';
    else overallSignal = 'Strong Sell';

    // Trading signals
    const signals = [];
    
    if (rsi < 30 && trend === 'Bullish') {
      signals.push({
        signal: 'RSI Oversold in Uptrend',
        type: 'Buy' as const,
        strength: 'Strong' as const,
        description: 'RSI oversold condition in bullish trend - potential buying opportunity'
      });
    }
    
    if (macdLine > signalLine && histogram > 0) {
      signals.push({
        signal: 'MACD Bullish Crossover',
        type: 'Buy' as const,
        strength: 'Moderate' as const,
        description: 'MACD line crossed above signal line - momentum turning bullish'
      });
    }
    
    if (currentPrice > sma20[sma20.length - 1] && sma20[sma20.length - 1] > sma50[sma50.length - 1]) {
      signals.push({
        signal: 'Moving Average Alignment',
        type: 'Buy' as const,
        strength: 'Moderate' as const,
        description: 'Price above short-term MA, and short-term above medium-term MA'
      });
    }
    
    if (rsi > 70 && bollingerPosition > 80) {
      signals.push({
        signal: 'Overbought Condition',
        type: 'Sell' as const,
        strength: 'Strong' as const,
        description: 'RSI overbought and price near upper Bollinger Band'
      });
    }

    if (signals.length === 0) {
      signals.push({
        signal: 'Mixed Signals',
        type: 'Neutral' as const,
        strength: 'Weak' as const,
        description: 'No clear directional signals detected'
      });
    }

    // Risk assessment
    const volatility = Math.sqrt(
      prices.slice(-20).reduce((sum, price, i, arr) => {
        if (i === 0) return 0;
        const dailyReturn = (price - arr[i - 1]) / arr[i - 1];
        return sum + (dailyReturn * dailyReturn);
      }, 0) / 19
    ) * Math.sqrt(252) * 100; // Annualized volatility

    const riskLevel = volatility > 30 ? 'High' : volatility > 20 ? 'Medium' : 'Low';

    // Recommendations
    const recommendations: string[] = [];
    
    if (overallSignal === 'Strong Buy' || overallSignal === 'Buy') {
      recommendations.push('Consider opening or adding to position with proper risk management');
    }
    if (rsi < 30) {
      recommendations.push('RSI indicates oversold condition - watch for reversal signals');
    }
    if (volatility > 25) {
      recommendations.push('High volatility detected - consider smaller position sizes');
    }
    if (volumeRatio > 1.5) {
      recommendations.push('Above-average volume confirms price movement strength');
    }
    if (trend === 'Sideways') {
      recommendations.push('Sideways trend - consider range trading strategies');
    }

    if (recommendations.length === 0) {
      recommendations.push('Monitor price action and wait for clearer signals');
    }

    // Warnings
    const warnings: string[] = [];
    
    if (rsi > 80 || rsi < 20) {
      warnings.push('Extreme RSI readings - potential reversal risk');
    }
    if (volatility > 35) {
      warnings.push('Very high volatility - exercise extra caution');
    }
    if (volumeRatio < 0.5) {
      warnings.push('Low volume - price movements may not be sustainable');
    }
    if (indicators.filter(i => i.signal === 'Hold').length > indicators.length * 0.7) {
      warnings.push('Majority of indicators neutral - avoid major position changes');
    }

    const technicalAnalysis: TechnicalAnalysis = {
      currentPrice,
      trend,
      trendStrength,
      overallSignal,
      signalScore,
      
      movingAverages: {
        sma20: sma20[sma20.length - 1],
        sma50: sma50[sma50.length - 1],
        sma200: sma200.length > 0 ? sma200[sma200.length - 1] : 0,
        ema12: ema12[ema12.length - 1],
        ema26: ema26[ema26.length - 1],
        macdLine,
        signalLine,
        histogram
      },
      
      oscillators: {
        rsi,
        stochastic,
        williamsR,
        commodityChannelIndex
      },
      
      momentum: {
        roc,
        momentum,
        rsi,
        bollinger: {
          upper: bollinger.upper,
          middle: bollinger.middle,
          lower: bollinger.lower,
          position: bollingerPosition
        }
      },
      
      volume: {
        averageVolume: avgVolume,
        volumeRatio,
        onBalanceVolume: obv,
        volumeTrend: volumeRatio > 1.2 ? 'Increasing' : volumeRatio < 0.8 ? 'Decreasing' : 'Stable'
      },
      
      indicators,
      
      supportResistance: {
        support,
        resistance,
        nextSupport: support[0] || currentPrice * 0.95,
        nextResistance: resistance[0] || currentPrice * 1.05
      },
      
      signals,
      riskLevel,
      volatility,
      recommendations,
      warnings
    };

    setAnalysis(technicalAnalysis);
  }, [
    priceData, currentPrice, rsiPeriod, macdFast, macdSlow, macdSignal,
    bollingerPeriod, bollingerStdDev, calculateSMA, calculateEMA,
    calculateRSI, calculateBollingerBands
  ]);

  useEffect(() => {
    performAnalysis();
  }, [performAnalysis]);

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

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'Strong Buy': return 'text-green-400 bg-green-900/20';
      case 'Buy': return 'text-green-300 bg-green-900/15';
      case 'Hold': return 'text-yellow-400 bg-yellow-900/20';
      case 'Sell': return 'text-red-300 bg-red-900/15';
      case 'Strong Sell': return 'text-red-400 bg-red-900/20';
      default: return 'text-slate-400 bg-slate-900/20';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Bullish': return 'text-green-400';
      case 'Bearish': return 'text-red-400';
      case 'Sideways': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getSignalTypeColor = (type: string) => {
    switch (type) {
      case 'Buy': return 'text-green-400';
      case 'Sell': return 'text-red-400';
      case 'Neutral': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-400 bg-green-900/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'High': return 'text-red-400 bg-red-900/20';
      default: return 'text-slate-400 bg-slate-900/20';
    }
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-orange-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Technical Analysis Tool
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Symbol and Price */}
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Stock Symbol & Price
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="stock-symbol" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Stock Symbol
                </label>
                <input
                  id="stock-symbol"
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  placeholder="AAPL"
                />
              </div>

              <div>
                <label htmlFor="current-price" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Current Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="current-price"
                    type="number"
                    step="0.01"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="timeframe" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Timeframe
                  </label>
                  <select
                    id="timeframe"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="lookback-days" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Lookback Days
                  </label>
                  <input
                    id="lookback-days"
                    type="number"
                    min="50"
                    max="500"
                    value={lookbackPeriod}
                    onChange={(e) => setLookbackPeriod(Number(e.target.value))}
                    className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Technical Parameters */}
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Technical Parameters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="rsi-period" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  RSI Period
                </label>
                <input
                  id="rsi-period"
                  type="number"
                  min="5"
                  max="50"
                  value={rsiPeriod}
                  onChange={(e) => setRsiPeriod(Number(e.target.value))}
                  className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="macd-fast" className={`block text-xs font-medium ${theme.textColors.primary} mb-1`}>
                    MACD Fast
                  </label>
                  <input
                    id="macd-fast"
                    type="number"
                    min="5"
                    max="20"
                    value={macdFast}
                    onChange={(e) => setMacdFast(Number(e.target.value))}
                    className={`w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>

                <div>
                  <label htmlFor="macd-slow" className={`block text-xs font-medium ${theme.textColors.primary} mb-1`}>
                    MACD Slow
                  </label>
                  <input
                    id="macd-slow"
                    type="number"
                    min="20"
                    max="40"
                    value={macdSlow}
                    onChange={(e) => setMacdSlow(Number(e.target.value))}
                    className={`w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${theme.textColors.primary} mb-1`}>
                    Signal
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="15"
                    value={macdSignal}
                    onChange={(e) => setMacdSignal(Number(e.target.value))}
                    className={`w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label 
                    htmlFor="bollinger-period"
                    className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}
                  >
                    Bollinger Period
                  </label>
                  <input
                    id="bollinger-period"
                    type="number"
                    min="10"
                    max="50"
                    value={bollingerPeriod}
                    onChange={(e) => setBollingerPeriod(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="bollinger-std-dev"
                    className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}
                  >
                    Std Deviation
                  </label>
                  <input
                    id="bollinger-std-dev"
                    type="number"
                    step="0.1"
                    min="1"
                    max="3"
                    value={bollingerStdDev}
                    onChange={(e) => setBollingerStdDev(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {analysis && (
            <>
              {/* Overall Analysis */}
              <div className={`p-6 border ${theme.borderColors.primary} rounded-lg bg-slate-800/50`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
                    {symbol} Technical Analysis
                  </h3>
                  <div className={`px-4 py-2 rounded-lg font-semibold ${getSignalColor(analysis.overallSignal)}`}>
                    {analysis.overallSignal}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>
                      {formatCurrency(analysis.currentPrice)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Current Price</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-xl font-bold ${getTrendColor(analysis.trend)} mb-1`}>
                      {analysis.trend}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Trend</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                      {analysis.signalScore.toFixed(0)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Signal Score</div>
                  </div>

                  <div className="text-center">
                    <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${getRiskLevelColor(analysis.riskLevel)}`}>
                      {analysis.riskLevel}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary} mt-1`}>Risk Level</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-600">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Volatility:</span>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {formatPercent(analysis.volatility)}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Support:</span>
                      <div className={`font-semibold text-green-400`}>
                        {formatCurrency(analysis.supportResistance.nextSupport)}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Resistance:</span>
                      <div className={`font-semibold text-red-400`}>
                        {formatCurrency(analysis.supportResistance.nextResistance)}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Volume Trend:</span>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {analysis.volume.volumeTrend}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Indicators */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Key Technical Indicators
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
                      <tr>
                        <th className="px-4 py-3 text-left">Indicator</th>
                        <th className="px-4 py-3 text-left">Value</th>
                        <th className="px-4 py-3 text-left">Signal</th>
                        <th className="px-4 py-3 text-left">Strength</th>
                        <th className="px-4 py-3 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.indicators.map((indicator, index) => (
                        <tr key={index} className={`border-t ${theme.borderColors.primary}`}>
                          <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                            {indicator.name}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {indicator.value.toFixed(2)}
                          </td>
                          <td className={`px-4 py-3`}>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getSignalColor(indicator.signal)}`}>
                              {indicator.signal}
                            </span>
                          </td>
                          <td className={`px-4 py-3`}>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${Math.min(indicator.strength, 100)}%` }}
                                />
                              </div>
                              <span className={`text-xs ${theme.textColors.secondary}`}>
                                {indicator.strength.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.secondary}`}>
                            {indicator.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Moving Averages & MACD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 border ${theme.borderColors.primary} rounded-lg bg-slate-800/30`}>
                  <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>
                    Moving Averages
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>SMA 20:</span>
                      <span className={`font-semibold ${analysis.currentPrice > analysis.movingAverages.sma20 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(analysis.movingAverages.sma20)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>SMA 50:</span>
                      <span className={`font-semibold ${analysis.currentPrice > analysis.movingAverages.sma50 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(analysis.movingAverages.sma50)}
                      </span>
                    </div>
                    {analysis.movingAverages.sma200 > 0 && (
                      <div className="flex justify-between">
                        <span className={`${theme.textColors.secondary}`}>SMA 200:</span>
                        <span className={`font-semibold ${analysis.currentPrice > analysis.movingAverages.sma200 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(analysis.movingAverages.sma200)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`p-4 border ${theme.borderColors.primary} rounded-lg bg-slate-800/30`}>
                  <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>
                    MACD Analysis
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>MACD Line:</span>
                      <span className={`font-semibold ${analysis.movingAverages.macdLine > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {analysis.movingAverages.macdLine.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>Signal Line:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {analysis.movingAverages.signalLine.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>Histogram:</span>
                      <span className={`font-semibold ${analysis.movingAverages.histogram > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {analysis.movingAverages.histogram.toFixed(3)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Oscillators */}
              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg bg-slate-800/30`}>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>
                  Oscillators
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${analysis.oscillators.rsi > 70 ? 'text-red-400' : analysis.oscillators.rsi < 30 ? 'text-green-400' : theme.textColors.primary} mb-1`}>
                      {analysis.oscillators.rsi.toFixed(1)}
                    </div>
                    <div className={`text-xs ${theme.textColors.secondary}`}>RSI ({rsiPeriod})</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-lg font-bold ${analysis.oscillators.stochastic > 80 ? 'text-red-400' : analysis.oscillators.stochastic < 20 ? 'text-green-400' : theme.textColors.primary} mb-1`}>
                      {analysis.oscillators.stochastic.toFixed(1)}
                    </div>
                    <div className={`text-xs ${theme.textColors.secondary}`}>Stochastic</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-lg font-bold ${theme.textColors.primary} mb-1`}>
                      {analysis.oscillators.williamsR.toFixed(1)}
                    </div>
                    <div className={`text-xs ${theme.textColors.secondary}`}>Williams %R</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-lg font-bold ${theme.textColors.primary} mb-1`}>
                      {analysis.oscillators.commodityChannelIndex.toFixed(1)}
                    </div>
                    <div className={`text-xs ${theme.textColors.secondary}`}>CCI</div>
                  </div>
                </div>
              </div>

              {/* Trading Signals */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Trading Signals
                  </h3>
                </div>
                
                <div className="p-4 space-y-3">
                  {analysis.signals.map((signal, index) => (
                    <div key={index} className={`p-3 border ${theme.borderColors.primary} rounded-lg bg-slate-700/30`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${getSignalTypeColor(signal.type)}`}>
                            {signal.signal}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getSignalTypeColor(signal.type)} bg-opacity-20`}>
                            {signal.type}
                          </span>
                        </div>
                        <span className={`text-xs ${theme.textColors.secondary} px-2 py-1 bg-slate-600 rounded`}>
                          {signal.strength}
                        </span>
                      </div>
                      <p className={`text-sm ${theme.textColors.secondary}`}>
                        {signal.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className={`p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg`}>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold text-blue-400 mb-2`}>
                      Trading Recommendations
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {analysis.warnings.length > 0 && (
                <div className={`p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className={`font-semibold text-yellow-400 mb-2`}>
                        Risk Warnings
                      </h4>
                      <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                        {analysis.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Analysis Education */}
              <div className={`p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg`}>
                <h4 className={`font-semibold text-purple-400 mb-2`}>
                  Technical Analysis Concepts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className={`${theme.textColors.secondary} mb-2`}><strong>Key Indicators:</strong></p>
                    <ul className={`space-y-1 ${theme.textColors.secondary}`}>
                      <li>• <strong>RSI:</strong> Measures overbought (&gt;70) and oversold (&lt;30) conditions</li>
                      <li>• <strong>MACD:</strong> Shows relationship between two moving averages</li>
                      <li>• <strong>Bollinger Bands:</strong> Price volatility and potential reversal levels</li>
                      <li>• <strong>Moving Averages:</strong> Trend direction and support/resistance</li>
                    </ul>
                  </div>
                  <div>
                    <p className={`${theme.textColors.secondary} mb-2`}><strong>Trading Tips:</strong></p>
                    <ul className={`space-y-1 ${theme.textColors.secondary}`}>
                      <li>• <strong>Confirmation:</strong> Use multiple indicators to confirm signals</li>
                      <li>• <strong>Risk Management:</strong> Always set stop-losses and position sizes</li>
                      <li>• <strong>Volume:</strong> High volume confirms price movements</li>
                      <li>• <strong>Trend:</strong> Trade with the trend, not against it</li>
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
