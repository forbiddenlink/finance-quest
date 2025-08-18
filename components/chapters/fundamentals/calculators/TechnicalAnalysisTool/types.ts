export interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'Buy' | 'Sell' | 'Hold' | 'Strong Buy' | 'Strong Sell';
  strength: number; // 0-100
  description: string;
}

export interface MovingAverages {
  sma20: number;
  sma50: number;
  sma200: number;
  ema12: number;
  ema26: number;
  macdLine: number;
  signalLine: number;
  histogram: number;
}

export interface Oscillators {
  rsi: number;
  stochastic: number;
  williamsR: number;
  commodityChannelIndex: number;
}

export interface Momentum {
  roc: number; // Rate of Change
  momentum: number;
  rsi: number;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
    position: number; // % position within bands
  };
}

export interface Volume {
  averageVolume: number;
  volumeRatio: number;
  onBalanceVolume: number;
  volumeTrend: 'Increasing' | 'Decreasing' | 'Stable';
}

export interface SupportResistance {
  support: number[];
  resistance: number[];
  nextSupport: number;
  nextResistance: number;
}

export interface Signal {
  signal: string;
  type: 'Buy' | 'Sell' | 'Neutral';
  strength: 'Strong' | 'Moderate' | 'Weak';
  description: string;
}

export interface TechnicalAnalysis {
  currentPrice: number;
  trend: 'Bullish' | 'Bearish' | 'Sideways';
  trendStrength: number;
  overallSignal: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  signalScore: number; // -100 to +100
  movingAverages: MovingAverages;
  oscillators: Oscillators;
  momentum: Momentum;
  volume: Volume;
  indicators: TechnicalIndicator[];
  supportResistance: SupportResistance;
  signals: Signal[];
  riskLevel: 'Low' | 'Medium' | 'High';
  volatility: number;
  recommendations: string[];
  warnings: string[];
}

export interface TechnicalAnalysisToolProps {
  symbol?: string;
  initialPrice?: number;
  timeframe?: 'daily' | 'weekly' | 'monthly';
  lookbackPeriod?: number;
  rsiPeriod?: number;
  macdFast?: number;
  macdSlow?: number;
  macdSignal?: number;
  bollingerPeriod?: number;
  bollingerStdDev?: number;
}

