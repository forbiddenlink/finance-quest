import { Decimal } from 'decimal.js';

export type OptionType = 'call' | 'put';
export type PositionType = 'long' | 'short';
export type StrategyType = 'single' | 'vertical' | 'iron_condor' | 'butterfly' | 'straddle' | 'strangle' | 'covered_call' | 'protective_put';
export type ExpiryTerm = 'weekly' | 'monthly' | 'quarterly' | 'leaps';
export type RiskLevel = 'low' | 'medium' | 'high';
export type ProfitPotential = 'limited' | 'unlimited';
export type BreakEvenType = 'upper' | 'lower';

export interface Option {
  type: OptionType;
  position: PositionType;
  strike: number;
  premium: number;
  quantity: number;
  expiry: Date;
  term: ExpiryTerm;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export interface Strategy {
  type: StrategyType;
  name: string;
  description: string;
  legs: Option[];
  maxLoss: number;
  maxProfit: number;
  breakEvenPoints: number[];
  profitPotential: ProfitPotential;
  riskLevel: RiskLevel;
  marginRequirement: number;
  returnOnRisk: number;
}

export interface StrategyAnalysis {
  probabilityOfProfit: number;
  expectedValue: number;
  maxReturnOnCapital: number;
  timeDecayExposure: number;
  volatilityExposure: number;
  deltaExposure: number;
  gammaExposure: number;
  thetaExposure: number;
  vegaExposure: number;
  rhoExposure: number;
  riskRewardRatio: number;
}

export interface ProfitLossPoint {
  price: number;
  profitLoss: number;
  delta: number;
  gamma: number;
  theta: number;
}

export interface RiskProfile {
  maxLoss: number;
  maxProfit: number;
  breakEvenPoints: number[];
  profitProbability: number;
  riskLevel: RiskLevel;
  profitPotential: ProfitPotential;
  marginRequirement: number;
  returnOnRisk: number;
  profitLossCurve: ProfitLossPoint[];
}

export interface MarketData {
  underlyingPrice: number;
  volatility: number;
  riskFreeRate: number;
  daysToExpiration: number;
  dividendYield: number;
}

export interface GreeksExposure {
  totalDelta: number;
  totalGamma: number;
  totalTheta: number;
  totalVega: number;
  totalRho: number;
  netDeltaEquivalent: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface OptionsStrategyState {
  underlyingSymbol: string;
  underlyingPrice: number;
  strategy: Strategy;
  marketData: MarketData;
  analysis: StrategyAnalysis | null;
  riskProfile: RiskProfile | null;
  greeksExposure: GreeksExposure | null;
  errors: ValidationError[];
  isLoading: boolean;
  showAdvancedMetrics: boolean;
}

export interface OptionsStrategyActions {
  updateUnderlyingSymbol: (symbol: string) => void;
  updateUnderlyingPrice: (price: number) => void;
  updateStrategy: (strategy: Strategy) => void;
  updateMarketData: (data: Partial<MarketData>) => void;
  addOption: (option: Option) => void;
  removeOption: (index: number) => void;
  updateOption: (index: number, option: Partial<Option>) => void;
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

export interface StrategyConfig {
  readonly [key in StrategyType]: {
    name: string;
    description: string;
    maxLegs: number;
    marginRequirement: (options: Option[], underlyingPrice: number) => number;
    riskLevel: RiskLevel;
    profitPotential: ProfitPotential;
  };
}

export interface ExpiryConfig {
  readonly [key in ExpiryTerm]: {
    minDays: number;
    maxDays: number;
    label: string;
    description: string;
  };
}

export interface GreeksConfig {
  readonly deltaThresholds: {
    low: number;
    high: number;
  };
  readonly gammaThresholds: {
    low: number;
    high: number;
  };
  readonly thetaThresholds: {
    low: number;
    high: number;
  };
  readonly vegaThresholds: {
    low: number;
    high: number;
  };
  readonly rhoThresholds: {
    low: number;
    high: number;
  };
}

export interface StyleConfig {
  readonly [key: string]: {
    background: string;
    text: string;
    border: string;
  };
}

export type UseOptionsStrategyCalculator = () => [OptionsStrategyState, OptionsStrategyActions];
