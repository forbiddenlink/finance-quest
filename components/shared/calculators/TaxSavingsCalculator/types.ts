import { Decimal } from 'decimal.js';

export type FilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_household';
export type TaxYear = '2023' | '2024';
export type DeductionType = 'standard' | 'itemized';
export type IncomeType = 'w2' | 'self_employed' | 'investment' | 'rental' | 'other';
export type DeductionCategory = 'mortgage_interest' | 'property_tax' | 'charitable' | 'medical' | 'state_local_tax' | 'other';
export type CreditType = 'child_tax' | 'education' | 'energy' | 'retirement_savings' | 'other';

export interface Income {
  type: IncomeType;
  amount: number;
  description?: string;
  taxWithheld?: number;
  selfEmploymentTax?: number;
  quarterlyPayments?: number[];
}

export interface Deduction {
  category: DeductionCategory;
  amount: number;
  description?: string;
  documentation?: string;
  limitations?: {
    maxAmount?: number;
    phaseOutStart?: number;
    phaseOutEnd?: number;
  };
}

export interface Credit {
  type: CreditType;
  amount: number;
  description?: string;
  refundable: boolean;
  limitations?: {
    maxCredit?: number;
    incomeLimit?: number;
    phaseOut?: {
      start: number;
      end: number;
    };
  };
}

export interface TaxBracket {
  rate: number;
  lowerBound: number;
  upperBound?: number;
}

export interface FilingStatusConfig {
  standardDeduction: number;
  brackets: TaxBracket[];
  saltCap: number;
  childTaxCreditPhaseout: {
    start: number;
    end: number;
  };
}

export type TaxYearConfig = {
  readonly [year in TaxYear]: {
    readonly [status in FilingStatus]: FilingStatusConfig;
  };
};

export type DeductionLimits = {
  readonly [key in DeductionCategory]: {
    maxAmount?: number;
    phaseOutStart?: number;
    phaseOutEnd?: number;
    specialRules?: string[];
  };
};

export type CreditLimits = {
  readonly [key in CreditType]: {
    maxCredit: number;
    refundable: boolean;
    incomeLimit?: number;
    phaseOut?: {
      start: number;
      end: number;
    };
    specialRules?: string[];
  };
}

export interface TaxCalculation {
  totalIncome: number;
  adjustedGrossIncome: number;
  taxableIncome: number;
  totalDeductions: number;
  totalCredits: number;
  taxBeforeCredits: number;
  taxAfterCredits: number;
  selfEmploymentTax: number;
  estimatedTaxPayments: number;
  taxWithheld: number;
  refundOrDue: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  brackets: {
    rate: number;
    income: number;
    tax: number;
  }[];
}

export interface TaxSavingsOpportunity {
  type: 'deduction' | 'credit' | 'strategy';
  name: string;
  description: string;
  potentialSavings: number;
  requirements: string[];
  deadlines?: Date[];
  risks?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface TaxSavingsState {
  filingStatus: FilingStatus;
  taxYear: TaxYear;
  deductionType: DeductionType;
  incomes: Income[];
  deductions: Deduction[];
  credits: Credit[];
  errors: ValidationError[];
  calculation: TaxCalculation | null;
  savingsOpportunities: TaxSavingsOpportunity[];
  showAdvancedOptions: boolean;
}

export interface TaxSavingsActions {
  updateFilingStatus: (status: FilingStatus) => void;
  updateTaxYear: (year: TaxYear) => void;
  updateDeductionType: (type: DeductionType) => void;
  addIncome: (income: Income) => void;
  removeIncome: (index: number) => void;
  updateIncome: (index: number, income: Partial<Income>) => void;
  addDeduction: (deduction: Deduction) => void;
  removeDeduction: (index: number) => void;
  updateDeduction: (index: number, deduction: Partial<Deduction>) => void;
  addCredit: (credit: Credit) => void;
  removeCredit: (index: number) => void;
  updateCredit: (index: number, credit: Partial<Credit>) => void;
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

export interface StyleConfig {
  readonly [key: string]: {
    background: string;
    text: string;
    border: string;
  };
}

export type UseTaxSavingsCalculator = () => [TaxSavingsState, TaxSavingsActions];
