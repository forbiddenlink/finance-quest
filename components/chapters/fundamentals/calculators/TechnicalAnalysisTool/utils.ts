import { PriceData } from './types';

export const generatePriceData = (currentPrice: number, days: number): PriceData[] => {
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

export const calculateSMA = (data: number[], period: number): number[] => {
  const sma: number[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
};

export const calculateEMA = (data: number[], period: number): number[] => {
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
};

export const calculateRSI = (data: number[], period: number): number => {
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
};

export const calculateBollingerBands = (data: number[], period: number, stdDev: number) => {
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
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercent = (percent: number): string => {
  return `${percent.toFixed(2)}%`;
};

export const getSignalColor = (signal: string): string => {
  switch (signal) {
    case 'Strong Buy': return 'text-green-400 bg-green-900/20';
    case 'Buy': return 'text-green-300 bg-green-900/15';
    case 'Hold': return 'text-yellow-400 bg-yellow-900/20';
    case 'Sell': return 'text-red-300 bg-red-900/15';
    case 'Strong Sell': return 'text-red-400 bg-red-900/20';
    default: return 'text-slate-400 bg-slate-900/20';
  }
};

export const getTrendColor = (trend: string): string => {
  switch (trend) {
    case 'Bullish': return 'text-green-400';
    case 'Bearish': return 'text-red-400';
    case 'Sideways': return 'text-yellow-400';
    default: return 'text-slate-400';
  }
};

export const getSignalTypeColor = (type: string): string => {
  switch (type) {
    case 'Buy': return 'text-green-400';
    case 'Sell': return 'text-red-400';
    case 'Neutral': return 'text-yellow-400';
    default: return 'text-slate-400';
  }
};

export const getRiskLevelColor = (level: string): string => {
  switch (level) {
    case 'Low': return 'text-green-400 bg-green-900/20';
    case 'Medium': return 'text-yellow-400 bg-yellow-900/20';
    case 'High': return 'text-red-400 bg-red-900/20';
    default: return 'text-slate-400 bg-slate-900/20';
  }
};

