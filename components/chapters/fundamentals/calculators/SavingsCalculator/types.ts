export interface ChartDataPoint {
  year: number;
  deposited: number;
  total: number;
  interest: number;
}

export interface BankRate {
  bank: string;
  type: string;
  apy: number;
  lastUpdated: string;
}

export interface ScenarioComparison {
  scenario: string;
  futureValue: number;
  totalDeposited: number;
  interestEarned: number;
  color: string;
}

export interface MonteCarloResult {
  percentile: number;
  value: number;
}

export interface SavingsResults {
  futureValue: number;
  totalDeposited: number;
  interestEarned: number;
  effectiveRate: number;
  realValue: number; // Inflation-adjusted
  monthsToGoal: number;
  compoundingPower: number;
}

export interface SavingsCalculatorProps {
  initialDeposit?: string;
  monthlyDeposit?: string;
  interestRate?: string;
  timeYears?: string;
  inflationRate?: string;
  riskProfile?: 'conservative' | 'moderate' | 'aggressive';
}

export type ViewMode = 'basic' | 'advanced' | 'comparison' | 'monte-carlo';

export interface PresetScenario {
  label: string;
  initial: number;
  monthly: number;
  rate: number;
  years: number;
}

export interface Insight {
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
}

export interface CalculatorMetadata {
  id: string;
  title: string;
  description: string;
  category: 'basic';
  icon: any; // Replace with proper icon type
  tags: string[];
  educationalNotes: {
    title: string;
    content: string;
    tips: string[];
  }[];
}

export interface CalculatorResults {
  primary: {
    label: string;
    value: number;
    format: 'currency';
    variant: 'success';
    description: string;
  };
  secondary: {
    label: string;
    value: number;
    format: 'currency' | 'percentage';
    variant?: 'success';
    description: string;
  }[];
}

