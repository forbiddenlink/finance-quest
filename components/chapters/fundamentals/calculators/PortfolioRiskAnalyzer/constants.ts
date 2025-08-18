import { PortfolioHolding, CorrelationMatrix, AnalysisParameters } from './types';

export const DEFAULT_HOLDINGS: PortfolioHolding[] = [
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
export const DEFAULT_CORRELATIONS: CorrelationMatrix = {
  'VTI': { 'VTI': 1.0, 'VTIAX': 0.85, 'BND': -0.1, 'VNQ': 0.75 },
  'VTIAX': { 'VTI': 0.85, 'VTIAX': 1.0, 'BND': -0.05, 'VNQ': 0.65 },
  'BND': { 'VTI': -0.1, 'VTIAX': -0.05, 'BND': 1.0, 'VNQ': 0.2 },
  'VNQ': { 'VTI': 0.75, 'VTIAX': 0.65, 'BND': 0.2, 'VNQ': 1.0 }
};

export const DEFAULT_PARAMETERS: AnalysisParameters = {
  riskFreeRate: 4.5,
  marketReturn: 10.0,
  timeHorizon: 12, // months
  rebalancingThreshold: 5 // percentage
};

export const RISK_THRESHOLDS = {
  sharpeRatio: {
    excellent: 1.5,
    good: 1.0,
    fair: 0.5
  },
  beta: {
    min: 0.8,
    max: 1.2,
    fairMin: 0.6,
    fairMax: 1.4
  },
  volatility: {
    excellent: 10,
    good: 15,
    fair: 20
  },
  diversificationRatio: {
    excellent: 1.4,
    good: 1.2,
    fair: 1.0
  },
  maxDrawdown: {
    excellent: 15,
    good: 20,
    fair: 30
  },
  treynorRatio: {
    excellent: 0.15,
    good: 0.1,
    fair: 0.05
  }
};

export const RISK_FREE_RATE = 2; // Assume 2% risk-free rate
export const Z_SCORE_95 = 1.645;
export const Z_SCORE_99 = 2.326;
export const MAX_DRAWDOWN_FACTOR = 2.5; // Rough approximation
export const DOWNSIDE_DEVIATION_FACTOR = 0.7; // Approximate downside deviation
export const MARKET_VOLATILITY = 16; // Assuming market volatility is 16%

