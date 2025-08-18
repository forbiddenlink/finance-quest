import {
  AnalysisTimeframe,
  MarketData,
  TechnicalLevels,
  SignalStrength,
  StyleConfig
} from './types';

export const TIMEFRAMES: readonly AnalysisTimeframe[] = [
  '1D',
  '1W',
  '1M',
  '3M',
  '6M',
  '1Y',
  '5Y',
  'MAX'
] as const;

export const MARKET_DATA: MarketData = {
  sectorPerformance: {
    'Technology': 1.5,
    'Healthcare': 0.8,
    'Financials': -0.3,
    'Consumer Discretionary': 0.5,
    'Consumer Staples': 0.2,
    'Industrials': 0.7,
    'Energy': -1.2,
    'Materials': 0.4,
    'Utilities': 0.1,
    'Real Estate': -0.4,
    'Communication Services': 0.9
  },
  marketIndices: {
    'S&P 500': {
      value: 4500,
      change: 15.5,
      percentChange: 0.34
    },
    'NASDAQ': {
      value: 14000,
      change: 45.2,
      percentChange: 0.32
    },
    'DOW': {
      value: 35000,
      change: 125.3,
      percentChange: 0.36
    }
  },
  volatilityIndex: {
    value: 18.5,
    interpretation: 'moderate'
  }
} as const;

export const TECHNICAL_LEVELS: TechnicalLevels = {
  'AAPL': [
    { significance: 'strong', price: 150, type: 'support' },
    { significance: 'moderate', price: 155, type: 'resistance' },
    { significance: 'weak', price: 145, type: 'support' }
  ],
  'MSFT': [
    { significance: 'strong', price: 300, type: 'support' },
    { significance: 'moderate', price: 310, type: 'resistance' },
    { significance: 'weak', price: 295, type: 'support' }
  ]
} as const;

export const STYLE_CONFIG: StyleConfig = {
  buy: {
    background: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300'
  },
  sell: {
    background: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300'
  },
  hold: {
    background: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300'
  }
} as const;

export const ANALYSIS_CONSTANTS = {
  minSymbolLength: 1,
  maxSymbolLength: 5,
  rsiOverbought: 70,
  rsiOversold: 30,
  macdSignalPeriod: 9,
  bollingerBandsPeriod: 20,
  bollingerBandsStdDev: 2,
  atrPeriod: 14,
  stochasticPeriod: 14,
  volumeSignificanceThreshold: 1.5,
  riskLevels: {
    low: {
      maxVolatility: 15,
      minSharpeRatio: 1.5
    },
    medium: {
      maxVolatility: 25,
      minSharpeRatio: 1.0
    },
    high: {
      maxVolatility: Infinity,
      minSharpeRatio: 0
    }
  },
  valuationMetrics: {
    discountRate: {
      low: 0.08,
      medium: 0.1,
      high: 0.12
    },
    marginOfSafety: {
      conservative: 0.4,
      moderate: 0.3,
      aggressive: 0.2
    }
  }
} as const;
