export type SpendingCategory =
  | 'dining'
  | 'groceries'
  | 'gas'
  | 'travel'
  | 'entertainment'
  | 'shopping'
  | 'utilities'
  | 'other';

export type RewardType = 'points' | 'miles' | 'cashback';

export interface CreditCard {
  id: string;
  name: string;
  annualFee: number;
  rewardType: RewardType;
  baseRate: number;
  bonusCategories: {
    category: SpendingCategory;
    rate: number;
    cap?: number;
  }[];
  signupBonus?: {
    amount: number;
    spendRequirement: number;
    timeframe: number; // in months
  };
  benefits: {
    name: string;
    value: number;
    description: string;
  }[];
}

export interface MonthlySpending {
  category: SpendingCategory;
  amount: number;
}

export interface RewardValue {
  points: number;
  cashValue: number;
}

export interface CardRewards {
  cardId: string;
  cardName: string;
  annualFee: number;
  baseRewards: RewardValue;
  categoryRewards: {
    category: SpendingCategory;
    rewards: RewardValue;
  }[];
  totalRewards: RewardValue;
  signupBonus?: RewardValue;
  benefitsValue: number;
  netValue: number;
}

export interface RewardsAnalysis {
  monthlyRewards: CardRewards[];
  annualRewards: CardRewards[];
  bestOverallCard: string;
  bestNoFeeCard: string;
  recommendedCombination: {
    cards: string[];
    totalValue: number;
    explanation: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface RewardsCalculatorState {
  selectedCards: CreditCard[];
  monthlySpending: MonthlySpending[];
  analysis: RewardsAnalysis | null;
  errors: ValidationError[];
  isCalculating: boolean;
}

export interface RewardsCalculatorActions {
  addCard: (card: CreditCard) => void;
  removeCard: (cardId: string) => void;
  updateSpending: (spending: MonthlySpending[]) => void;
  calculateRewards: () => void;
  reset: () => void;
}

export type UseRewardsCalculator = () => [RewardsCalculatorState, RewardsCalculatorActions];
