export type CreditFactor = 'payment_history' | 'credit_utilization' | 'credit_age' | 'credit_mix' | 'new_credit';
export type AccountType = 'credit_card' | 'personal_loan' | 'auto_loan' | 'mortgage' | 'student_loan' | 'retail_card';
export type PaymentStatus = 'current' | 'late_30' | 'late_60' | 'late_90' | 'collection' | 'charge_off';
export type InquiryType = 'hard' | 'soft';
export type AccountStatus = 'open' | 'closed' | 'delinquent' | 'collection';

export interface CreditAccount {
  id: string;
  type: AccountType;
  balance: number;
  creditLimit: number;
  openDate: Date;
  paymentStatus: PaymentStatus;
  status: AccountStatus;
  monthlyPayment: number;
  paymentHistory: {
    date: Date;
    status: PaymentStatus;
    amount: number;
  }[];
}

export interface CreditInquiry {
  id: string;
  type: InquiryType;
  date: Date;
  lender: string;
  purpose: string;
}

export interface CreditProfile {
  accounts: CreditAccount[];
  inquiries: CreditInquiry[];
  totalBalances: number;
  totalCreditLimit: number;
  oldestAccountAge: number;
  averageAccountAge: number;
  recentLatePayments: number;
  collectionAccounts: number;
  bankruptcies: number;
}

export interface ScoreImpact {
  factor: CreditFactor;
  currentScore: number;
  potentialImprovement: number;
  timeToImprove: string;
  suggestedActions: string[];
}

export interface ScoreSimulation {
  baseScore: number;
  simulatedScore: number;
  changes: {
    factor: CreditFactor;
    impact: number;
    description: string;
  }[];
  timeToRecover: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CreditScoreState {
  profile: CreditProfile;
  currentScore: number;
  scoreFactors: ScoreImpact[];
  simulations: ScoreSimulation[];
  errors: ValidationError[];
  showAdvancedOptions: boolean;
}

export interface CreditScoreActions {
  addAccount: (account: CreditAccount) => void;
  removeAccount: (id: string) => void;
  updateAccount: (id: string, updates: Partial<CreditAccount>) => void;
  addInquiry: (inquiry: CreditInquiry) => void;
  removeInquiry: (id: string) => void;
  simulateAction: (action: {
    type: 'pay_down_balance' | 'add_account' | 'close_account' | 'late_payment' | 'collection';
    details: Record<string, any>;
  }) => void;
  resetSimulation: () => void;
  setShowAdvancedOptions: (show: boolean) => void;
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
      min?: number;
      max?: number;
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

export type UseCreditScoreSimulator = () => [CreditScoreState, CreditScoreActions];
