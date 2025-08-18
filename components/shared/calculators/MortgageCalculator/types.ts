import { Decimal } from 'decimal.js';

export interface MortgageValues {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  termYears: string;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  hoaFees: number;
}

export interface PaymentBreakdown {
  year: number;
  month: number;
  monthNumber: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPayment: number;
  monthlyInterestRate: number;
  totalPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  paymentSchedule: PaymentBreakdown[];
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;
  totalMonthlyPayment: number;
  totalCost: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface MortgageState {
  values: MortgageValues;
  errors: ValidationError[];
  result: MortgageResult | null;
  downPaymentType: 'percentage' | 'amount';
  includeExtras: boolean;
}

export interface MortgageActions {
  updateValue: (field: keyof MortgageValues, value: string | number) => void;
  setDownPaymentType: (type: 'percentage' | 'amount') => void;
  setIncludeExtras: (include: boolean) => void;
  calculate: () => void;
  reset: () => void;
}

export interface YearlySummary {
  year: number;
  totalPrincipal: number;
  totalInterest: number;
  remainingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
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

export interface AmortizationSchedule {
  monthlyPayments: PaymentBreakdown[];
  yearlySummary: YearlySummary[];
  chartData: ChartData;
}

export interface StyleConfig {
  readonly [key: string]: {
    background: string;
    text: string;
    border: string;
  };
}

export type UseMortgageCalculator = () => [MortgageState, MortgageActions];

export interface LoanLimits {
  readonly conventional: {
    readonly singleUnit: number;
    readonly multiUnit: {
      readonly [key: string]: number;
    };
  };
  readonly fha: {
    readonly singleUnit: number;
    readonly multiUnit: {
      readonly [key: string]: number;
    };
  };
  readonly va: {
    readonly singleUnit: number;
    readonly multiUnit: {
      readonly [key: string]: number;
    };
  };
}

export interface PMIRates {
  readonly [key: string]: {
    readonly rate: number;
    readonly minEquity: number;
  };
}

export interface PropertyTaxRates {
  readonly national: {
    readonly average: number;
    readonly range: {
      readonly min: number;
      readonly max: number;
    };
  };
  readonly state?: {
    readonly [key: string]: number;
  };
}

export interface InsuranceRates {
  readonly base: number;
  readonly factors: {
    readonly [key: string]: number;
  };
}

export interface MortgageConstants {
  readonly loanLimits: LoanLimits;
  readonly pmiRates: PMIRates;
  readonly propertyTaxRates: PropertyTaxRates;
  readonly insuranceRates: InsuranceRates;
  readonly termOptions: readonly string[];
  readonly minDownPaymentPercent: number;
  readonly maxLoanAmount: number;
  readonly maxInterestRate: number;
  readonly maxTermYears: number;
}
