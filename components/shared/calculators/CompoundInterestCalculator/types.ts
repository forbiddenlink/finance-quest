import { Decimal } from 'decimal.js';

export type ContributionFrequency = 'monthly' | 'quarterly' | 'annually';
export type CompoundingFrequency = 'daily' | 'monthly' | 'quarterly' | 'annually';
export type InvestmentGoal = 'retirement' | 'education' | 'home' | 'other';

export interface CompoundInterestValues {
  initialInvestment: number;
  monthlyContribution: number;
  annualInterestRate: number;
  timeHorizonYears: number;
  contributionFrequency: ContributionFrequency;
  compoundingFrequency: CompoundingFrequency;
  investmentGoal: InvestmentGoal;
  inflationRate: number;
  taxRate: number;
}

export interface CompoundingPeriod {
  year: number;
  startingBalance: number;
  contributions: number;
  interest: number;
  endingBalance: number;
  realValue: number;
  afterTaxValue: number;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  realFutureValue: number;
  afterTaxFutureValue: number;
  effectiveAnnualRate: number;
  compoundingPeriods: CompoundingPeriod[];
  monthlyIncomeEstimate: number;
  withdrawalRate: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CompoundInterestState {
  values: CompoundInterestValues;
  errors: ValidationError[];
  result: CompoundInterestResult | null;
  showAdvancedOptions: boolean;
}

export interface CompoundInterestActions {
  updateValue: (field: keyof CompoundInterestValues, value: string | number) => void;
  setShowAdvancedOptions: (show: boolean) => void;
  calculate: () => void;
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

export interface CompoundingFrequencyConfig {
  readonly [key in CompoundingFrequency]: {
    periodsPerYear: number;
    label: string;
    description: string;
  };
}

export interface ContributionFrequencyConfig {
  readonly [key in ContributionFrequency]: {
    periodsPerYear: number;
    label: string;
    description: string;
  };
}

export interface InvestmentGoalConfig {
  readonly [key in InvestmentGoal]: {
    label: string;
    description: string;
    recommendedAllocation: {
      stocks: number;
      bonds: number;
      cash: number;
    };
    defaultTimeHorizon: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface WithdrawalRateConfig {
  readonly conservative: number;
  readonly moderate: number;
  readonly aggressive: number;
  readonly [key: string]: number;
}

export interface CompoundInterestConstants {
  readonly maxInitialInvestment: number;
  readonly maxMonthlyContribution: number;
  readonly maxInterestRate: number;
  readonly maxTimeHorizon: number;
  readonly maxInflationRate: number;
  readonly maxTaxRate: number;
  readonly defaultWithdrawalRate: number;
  readonly compoundingFrequencies: CompoundingFrequencyConfig;
  readonly contributionFrequencies: ContributionFrequencyConfig;
  readonly investmentGoals: InvestmentGoalConfig;
  readonly withdrawalRates: WithdrawalRateConfig;
}

export type UseCompoundInterestCalculator = () => [CompoundInterestState, CompoundInterestActions];

export interface StyleConfig {
  readonly [key: string]: {
    background: string;
    text: string;
    border: string;
  };
}
