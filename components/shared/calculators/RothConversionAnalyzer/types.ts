import { Decimal } from 'decimal.js';

export type FilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_household';
export type TaxYear = '2023' | '2024';
export type ConversionStrategyType = 'lump_sum' | 'gradual' | 'opportunistic';
export type AccountType = 'traditional_ira' | 'sep_ira' | 'simple_ira' | 'rollover_ira' | 'roth_ira';
export type InvestmentType = 'stocks' | 'bonds' | 'cash' | 'other';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Account {
  type: AccountType;
  balance: number;
  basis: number;
  investments: {
    type: InvestmentType;
    allocation: number;
    expectedReturn: number;
  }[];
  contributions: {
    year: number;
    amount: number;
    type: 'deductible' | 'nondeductible';
  }[];
}

export interface TaxBracket {
  rate: number;
  lowerBound: number;
  upperBound?: number;
}

export interface FilingStatusConfig {
  standardDeduction: number;
  brackets: TaxBracket[];
  rothContributionPhaseout: {
    start: number;
    end: number;
  };
  rothConversionIncomeLimits?: {
    start: number;
    end: number;
  };
}

export type TaxYearConfig = {
  readonly [year in TaxYear]: {
    readonly [status in FilingStatus]: FilingStatusConfig;
  };
};

export interface ConversionPlan {
  year: number;
  amount: number;
  taxBracket: number;
  taxDue: number;
  remainingBalance: number;
  rothBalance: number;
  projectedGrowth: number;
}

export interface ConversionAnalysis {
  totalTaxDue: number;
  effectiveTaxRate: number;
  breakEvenYears: number;
  lifetimeTaxSavings: number;
  rmds: {
    startAge: number;
    firstYearAmount: number;
    lifetimeTotal: number;
  };
  wealthTransfer: {
    traditionalValue: number;
    rothValue: number;
    taxSavings: number;
  };
  riskAnalysis: {
    marketRisk: RiskLevel;
    taxRisk: RiskLevel;
    rmdRisk: RiskLevel;
    overallRisk: RiskLevel;
  };
}

export interface ConversionStrategy {
  name: string;
  description: string;
  recommendedFor: string[];
  considerations: string[];
  risks: string[];
  timeline: {
    start: Date;
    milestones: {
      date: Date;
      action: string;
      amount: number;
    }[];
    completion: Date;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface RothConversionState {
  filingStatus: FilingStatus;
  taxYear: TaxYear;
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  accounts: Account[];
  currentIncome: number;
  projectedRetirementIncome: number;
  strategy: ConversionStrategy;
  errors: ValidationError[];
  analysis: ConversionAnalysis | null;
  conversionPlan: ConversionPlan[] | null;
  showAdvancedOptions: boolean;
}

export interface RothConversionActions {
  updateFilingStatus: (status: FilingStatus) => void;
  updateTaxYear: (year: TaxYear) => void;
  updateAge: (field: 'currentAge' | 'retirementAge' | 'lifeExpectancy', value: number) => void;
  updateIncome: (field: 'currentIncome' | 'projectedRetirementIncome', value: number) => void;
  addAccount: (account: Account) => void;
  removeAccount: (index: number) => void;
  updateAccount: (index: number, account: Partial<Account>) => void;
  updateStrategy: (strategy: ConversionStrategy) => void;
  setShowAdvancedOptions: (show: boolean) => void;
  analyze: () => void;
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

export type InvestmentConfig = {
  readonly [key in InvestmentType]: {
    defaultReturn: number;
    volatility: number;
    riskLevel: RiskLevel;
    description: string;
  };
};

export interface RMDConfig {
  readonly startAge: number;
  readonly factors: {
    readonly [key: number]: number;
  };
}

export interface StyleConfig {
  readonly [key: string]: {
    background: string;
    text: string;
    border: string;
  };
}

export type UseRothConversionAnalyzer = () => [RothConversionState, RothConversionActions];
