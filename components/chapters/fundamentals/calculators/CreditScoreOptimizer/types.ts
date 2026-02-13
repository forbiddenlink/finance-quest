export type CreditFactor = 'payment_history' | 'credit_utilization' | 'credit_age' | 'credit_mix' | 'new_credit';
export type AccountType = 'credit_card' | 'personal_loan' | 'auto_loan' | 'mortgage' | 'student_loan' | 'retail_card';
export type AccountStatus = 'open' | 'closed' | 'delinquent' | 'collection' | 'charge_off';
export type PaymentStatus = 'current' | 'late_30' | 'late_60' | 'late_90' | 'collection' | 'charge_off';
export type TimeFrame = 'immediate' | 'short_term' | 'medium_term' | 'long_term';
export type ImpactLevel = 'none' | 'low' | 'medium' | 'high';

export interface CreditAccount {
  id: string;
  type: AccountType;
  balance: number;
  creditLimit: number;
  openDate: Date;
  status: AccountStatus;
  paymentStatus: PaymentStatus;
  monthlyPayment: number;
  interestRate: number;
  annualFee?: number;
  rewards?: {
    type: string;
    rate: number;
  };
}

export interface OptimizationAction {
  id: string;
  type: string;
  description: string;
  impact: {
    factor: CreditFactor;
    points: number;
    timeFrame: TimeFrame;
  };
  requirements: string[];
  risks: string[];
  cost?: number;
  savings?: number;
  priority: number;
  completed: boolean;
}

export interface ScoreGoal {
  id: string;
  targetScore: number;
  timeFrame: TimeFrame;
  purpose: string;
  requiredActions: OptimizationAction[];
  projectedScore: number;
  confidenceLevel: number;
}

export interface FactorAnalysis {
  factor: CreditFactor;
  currentScore: number;
  maxScore: number;
  impact: ImpactLevel;
  issues: string[];
  recommendations: OptimizationAction[];
}

export interface UtilizationStrategy {
  accountId: string;
  currentBalance: number;
  targetBalance: number;
  paymentAmount: number;
  monthsToTarget: number;
  interestSaved: number;
  scoreImprovement: number;
}

export interface DebtPaydownPlan {
  totalDebt: number;
  monthlyBudget: number;
  strategies: {
    name: string;
    description: string;
    timeline: number;
    interestSaved: number;
    scoreImprovement: number;
    monthlyPayments: {
      accountId: string;
      amount: number;
    }[];
  }[];
  selectedStrategy?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CreditScoreState {
  currentScore: number;
  accounts: CreditAccount[];
  goals: ScoreGoal[];
  factorAnalysis: FactorAnalysis[];
  optimizationActions: OptimizationAction[];
  utilizationStrategies: UtilizationStrategy[];
  debtPaydownPlan: DebtPaydownPlan | null;
  errors: ValidationError[];
  showAdvancedOptions: boolean;
}

export interface CreditScoreActions {
  addAccount: (account: CreditAccount) => void;
  removeAccount: (id: string) => void;
  updateAccount: (id: string, updates: Partial<CreditAccount>) => void;
  addGoal: (goal: ScoreGoal) => void;
  removeGoal: (id: string) => void;
  updateGoal: (id: string, updates: Partial<ScoreGoal>) => void;
  completeAction: (id: string) => void;
  setSelectedPaydownStrategy: (strategyName: string) => void;
  updateMonthlyBudget: (amount: number) => void;
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

export type UseCreditScoreOptimizer = () => [CreditScoreState, CreditScoreActions];
