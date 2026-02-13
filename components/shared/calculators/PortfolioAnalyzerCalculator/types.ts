import { Decimal } from 'decimal.js';

export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive';
export type AssetClass = 'cash' | 'bonds' | 'stocks' | 'realEstate' | 'alternatives';
export type Priority = 'High' | 'Medium' | 'Low';
export type RiskLevel = Priority;

export interface PortfolioValues {
  totalValue: number;
  cashAllocation: number;
  bondAllocation: number;
  stockAllocation: number;
  realEstateAllocation: number;
  alternativeAllocation: number;
  riskTolerance: RiskTolerance;
  expectedVolatility: number;
  investmentTimeframe: number;
  rebalancingFrequency: number;
  incomeRequirement: number;
  averageExpenseRatio: number;
  taxBracket: number;
  expectedInflation: number;
}

export type BaseReturns = {
  readonly [key in AssetClass]: number;
};

export type RiskAdjustments = {
  readonly [key in RiskTolerance]: number;
};

export interface ProjectedReturns {
  conservative: number;
  expected: number;
  optimistic: number;
}

export interface RiskMetrics {
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  diversificationScore: number;
}

export type TargetAllocations = {
  readonly [key in AssetClass]: {
    readonly [key in RiskTolerance]: {
      min: number;
      max: number;
    };
  };
};

export interface ValidationError {
  field: string;
  message: string;
}

export interface PortfolioResult {
  totalAllocation: number;
  effectiveExpenseRatio: number;
  projectedReturns: ProjectedReturns;
  riskMetrics: RiskMetrics;
  recommendations: string[];
  rebalancingSchedule: Date[];
  rebalancingNeeded: boolean;
  suggestedChanges: Array<{
    asset: string;
    current: number;
    target: number;
    change: number;
  }>;
  insights: Array<{
    type: string;
    message: string;
  }>;
}

export interface PortfolioAnalyzerState {
  values: PortfolioValues;
  errors: ValidationError[];
  result: PortfolioResult | null;
  isValid: boolean;
}

export interface PortfolioAnalyzerActions {
  updateField: (field: keyof PortfolioValues, value: string) => void;
  reset: () => void;
  calculate: () => void;
}

export type UsePortfolioAnalyzer = () => [PortfolioAnalyzerState, PortfolioAnalyzerActions];

export interface StyleConfig {
  priority: {
    [key in Priority]: string;
  };
  riskLevel: {
    [key in RiskLevel]: string;
  };
}