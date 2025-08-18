import { useState, useEffect, useMemo, useCallback } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { TechnicalAnalysis, TechnicalAnalysisToolProps, PriceData } from './types';
import {
  generatePriceData,
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateBollingerBands
} from './utils';

export const useTechnicalAnalysis = (props: TechnicalAnalysisToolProps) => {
  const { recordCalculatorUsage } = useProgressStore();

  // Input Parameters
  const [symbol, setSymbol] = useState<string>(props.symbol || 'AAPL');
  const [currentPrice, setCurrentPrice] = useState<number>(props.initialPrice || 175.50);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>(props.timeframe || 'daily');
  const [lookbackPeriod, setLookbackPeriod] = useState<number>(props.lookbackPeriod || 100);
  
  // Technical Parameters
  const [rsiPeriod, setRsiPeriod] = useState<number>(props.rsiPeriod || 14);
  const [macdFast, setMacdFast] = useState<number>(props.macdFast || 12);
  const [macdSlow, setMacdSlow] = useState<number>(props.macdSlow || 26);
  const [macdSignal, setMacdSignal] = useState<number>(props.macdSignal || 9);
  const [bollingerPeriod, setBollingerPeriod] = useState<number>(props.bollingerPeriod || 20);
  const [bollingerStdDev, setBollingerStdDev] = useState<number>(props.bollingerStdDev || 2);

  const [analysis, setAnalysis] = useState<TechnicalAnalysis | null>(null);

  useEffect(() => {
    recordCalculatorUsage('technical-analysis-tool');
  }, [recordCalculatorUsage]);

  // Generate sample price data
  const priceData = useMemo<PriceData[]>(() => {
    return generatePriceData(currentPrice, lookbackPeriod);
  }, [currentPrice, lookbackPeriod]);

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
    const macdHistory: number[] = [];
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
    const indicators = [
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
        type: 'Buy',
        strength: 'Strong',
        description: 'RSI oversold condition in bullish trend - potential buying opportunity'
      });
    }
    
    if (macdLine > signalLine && histogram > 0) {
      signals.push({
        signal: 'MACD Bullish Crossover',
        type: 'Buy',
        strength: 'Moderate',
        description: 'MACD line crossed above signal line - momentum turning bullish'
      });
    }
    
    if (currentPrice > sma20[sma20.length - 1] && sma20[sma20.length - 1] > sma50[sma50.length - 1]) {
      signals.push({
        signal: 'Moving Average Alignment',
        type: 'Buy',
        strength: 'Moderate',
        description: 'Price above short-term MA, and short-term above medium-term MA'
      });
    }
    
    if (rsi > 70 && bollingerPosition > 80) {
      signals.push({
        signal: 'Overbought Condition',
        type: 'Sell',
        strength: 'Strong',
        description: 'RSI overbought and price near upper Bollinger Band'
      });
    }

    if (signals.length === 0) {
      signals.push({
        signal: 'Mixed Signals',
        type: 'Neutral',
        strength: 'Weak',
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
    bollingerPeriod, bollingerStdDev
  ]);

  useEffect(() => {
    performAnalysis();
  }, [performAnalysis]);

  return {
    symbol,
    setSymbol,
    currentPrice,
    setCurrentPrice,
    timeframe,
    setTimeframe,
    lookbackPeriod,
    setLookbackPeriod,
    rsiPeriod,
    setRsiPeriod,
    macdFast,
    setMacdFast,
    macdSlow,
    setMacdSlow,
    macdSignal,
    setMacdSignal,
    bollingerPeriod,
    setBollingerPeriod,
    bollingerStdDev,
    setBollingerStdDev,
    analysis
  };
};

