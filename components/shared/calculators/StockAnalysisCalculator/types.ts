import { Decimal } from 'decimal.js';

export type AnalysisTimeframe = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'MAX';
export type TrendDirection = 'up' | 'down' | 'sideways';
export type SignalStrength = 'strong' | 'moderate' | 'weak';
export type RiskLevel = 'low' | 'medium' | 'high';
export type RecommendationType = 'buy' | 'sell' | 'hold';

export interface StockData {
  symbol: string;
  companyName: string;
  currentPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  eps: number;
  dividendYield: number;
  beta: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  movingAverages: {
    sma20: number;
    sma50: number;
    sma200: number;
    ema12: number;
    ema26: number;
  };
}

export interface FinancialMetrics {
  revenueGrowth: number;
  profitMargin: number;
  debtToEquity: number;
  currentRatio: number;
  quickRatio: number;
  returnOnEquity: number;
  returnOnAssets: number;
  freeCashFlow: number;
  priceToBook: number;
  priceToSales: number;
  priceToCashFlow: number;
  enterpriseValue: number;
  evToEbitda: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
  stochastic: {
    k: number;
    d: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  atr: number;
  obv: number;
}

export interface PriceTarget {
  low: number;
  median: number;
  high: number;
  meanTarget: number;
  numberOfAnalysts: number;
}

export interface TrendAnalysis {
  direction: TrendDirection;
  strength: SignalStrength;
  supportLevels: number[];
  resistanceLevels: number[];
  breakoutPoints: {
    price: number;
    volume: number;
    date: Date;
  }[];
}

export interface RiskAssessment {
  level: RiskLevel;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  factors: {
    marketRisk: number;
    sectorRisk: number;
    companySpecificRisk: number;
  };
}

export interface ValuationMetrics {
  intrinsicValue: number;
  discountRate: number;
  growthRate: number;
  marginOfSafety: number;
  fairValue: number;
  valuationRatios: {
    currentPE: number;
    forwardPE: number;
    pegRatio: number;
    evToRevenue: number;
  };
}

export interface AnalysisResult {
  stockData: StockData;
  financialMetrics: FinancialMetrics;
  technicalIndicators: TechnicalIndicators;
  priceTarget: PriceTarget;
  trendAnalysis: TrendAnalysis;
  riskAssessment: RiskAssessment;
  valuationMetrics: ValuationMetrics;
  recommendation: {
    type: RecommendationType;
    confidence: SignalStrength;
    reasons: string[];
    priceTargets: {
      entry: number;
      stopLoss: number;
      takeProfit: number;
    };
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface StockAnalysisState {
  symbol: string;
  timeframe: AnalysisTimeframe;
  errors: ValidationError[];
  isLoading: boolean;
  result: AnalysisResult | null;
  showAdvancedMetrics: boolean;
}

export interface StockAnalysisActions {
  updateSymbol: (symbol: string) => void;
  updateTimeframe: (timeframe: AnalysisTimeframe) => void;
  setShowAdvancedMetrics: (show: boolean) => void;
  analyze: () => Promise<void>;
  reset: () => void;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  scales: {
    y: {
      beginAtZero: boolean;
      ticks: {
        callback: (value: number) => string;
      };
    };
  };
  plugins: {
    tooltip: {
      callbacks: {
        label: (context: { dataset: { label: string }; parsed: { y: number } }) => string;
      };
    };
  };
}

export interface MarketData {
  readonly sectorPerformance: {
    readonly [key: string]: number;
  };
  readonly marketIndices: {
    readonly [key: string]: {
      value: number;
      change: number;
      percentChange: number;
    };
  };
  readonly volatilityIndex: {
    value: number;
    interpretation: 'low' | 'moderate' | 'high';
  };
}

export interface TechnicalLevels {
  readonly [key: string]: {
    readonly significance: SignalStrength;
    readonly price: number;
    readonly type: 'support' | 'resistance';
  }[];
}

export interface StyleConfig {
  readonly [key: string]: {
    background: string;
    text: string;
    border: string;
  };
}

export type UseStockAnalysisCalculator = () => [StockAnalysisState, StockAnalysisActions];
