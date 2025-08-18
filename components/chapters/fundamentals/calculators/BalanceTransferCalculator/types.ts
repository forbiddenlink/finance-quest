export interface ExistingDebt {
  id: string;
  creditor: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  monthlyPayment?: number;
}

export interface BalanceTransferCard {
  id: string;
  name: string;
  introAPR: number;
  introPeriod: number;
  regularAPR: number;
  transferFeeRate: number;
  transferFeeMin: number;
  creditLimit?: number;
  annualFee: number;
  additionalBenefits: {
    name: string;
    description: string;
    value: number;
  }[];
}

export interface TransferScenario {
  cardId: string;
  transferredDebts: string[];
  totalTransferred: number;
  transferFee: number;
  monthlyPayment: number;
  payoffPeriod: number;
  totalInterest: number;
  totalCost: number;
  savings: number;
  remainingDebts: ExistingDebt[];
}

export interface PaymentSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  isIntroPeriod: boolean;
  interestRate: number;
}

export interface DebtAnalysis {
  originalTotalDebt: number;
  originalMonthlyPayment: number;
  originalPayoffTime: number;
  originalTotalInterest: number;
  originalTotalCost: number;
  bestScenario: TransferScenario;
  alternativeScenarios: TransferScenario[];
  paymentSchedule: PaymentSchedule[];
  recommendations: {
    title: string;
    description: string;
    impact: number;
  }[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface BalanceTransferState {
  existingDebts: ExistingDebt[];
  availableCards: BalanceTransferCard[];
  selectedCard: BalanceTransferCard | null;
  selectedDebts: string[];
  monthlyPayment?: number;
  analysis: DebtAnalysis | null;
  errors: ValidationError[];
  isCalculating: boolean;
}

export interface BalanceTransferActions {
  addDebt: (debt: ExistingDebt) => void;
  removeDebt: (debtId: string) => void;
  updateDebt: (debtId: string, updates: Partial<ExistingDebt>) => void;
  selectCard: (cardId: string) => void;
  selectDebts: (debtIds: string[]) => void;
  setMonthlyPayment: (amount: number) => void;
  calculateTransfer: () => void;
  reset: () => void;
}

export type UseBalanceTransferCalculator = () => [BalanceTransferState, BalanceTransferActions];
