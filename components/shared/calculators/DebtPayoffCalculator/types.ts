import { Decimal } from 'decimal.js';

export type DebtType = 'credit_card' | 'personal_loan' | 'student_loan' | 'auto_loan' | 'mortgage' | 'other';
export type PayoffStrategy = 'avalanche' | 'snowball' | 'custom';

export interface Debt {
  id: string;
  name: string;
  type: DebtType;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  priority?: number;
}

export interface PaymentSchedule {
  month: number;
  debtId: string;
  startingBalance: number;
  payment: number;
  interestPaid: number;
  principalPaid: number;
  endingBalance: number;
  isComplete: boolean;
}

export interface DebtPayoffResult {
  totalPayment: number;
  minimumPaymentTotal: number;
  totalInterestPaid: number;
  totalInterestSaved: number;
  payoffDate: Date;
  monthsToPayoff: number;
  paymentSchedule: PaymentSchedule[];
  debtPayoffOrder: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface InputValidation {
  isValid: boolean;
  errors: ValidationError[];
}

export interface DebtPayoffState {
  debts: Debt[];
  extraPayment: string;
  payoffStrategy: PayoffStrategy;
  validationErrors: ValidationError[];
  results: DebtPayoffResult | null;
}

export interface DebtPayoffActions {
  addDebt: () => void;
  removeDebt: (id: string) => void;
  updateDebt: (id: string, field: keyof Debt, value: string | number) => void;
  updateExtraPayment: (value: string) => void;
  updatePayoffStrategy: (strategy: PayoffStrategy) => void;
  calculatePayoff: () => void;
  reset: () => void;
}

export interface DebtTypeConfig {
  readonly [key in DebtType]: {
    label: string;
    defaultInterestRate: number;
    minPaymentPercent: number;
  };
}

export interface StyleConfig {
  readonly [key: string]: {
    background: string;
    text: string;
    border: string;
  };
}

export type UseDebtPayoffCalculator = () => [DebtPayoffState, DebtPayoffActions];

export interface PaymentAllocation {
  debtId: string;
  amount: Decimal;
  isExtra: boolean;
}

export interface MonthlyPaymentSummary {
  totalPayment: Decimal;
  allocations: PaymentAllocation[];
  completedDebts: string[];
}

export interface DebtSnapshot {
  id: string;
  balance: Decimal;
  interestRate: Decimal;
  minimumPayment: Decimal;
  priority?: number;
}

export interface PayoffMetrics {
  totalInterestPaid: Decimal;
  monthsToPayoff: number;
  payoffDate: Date;
  totalPayment: Decimal;
}
