import { BalanceTransferCard } from './types';

export const POPULAR_TRANSFER_CARDS: BalanceTransferCard[] = [
  {
    id: 'citi-diamond-preferred',
    name: 'Citi Diamond Preferred',
    introAPR: 0,
    introPeriod: 21,
    regularAPR: 17.24,
    transferFeeRate: 3,
    transferFeeMin: 5,
    annualFee: 0,
    additionalBenefits: [
      {
        name: 'Extended Warranty',
        description: 'Extends manufacturer\'s warranty by 24 months',
        value: 100
      },
      {
        name: 'Purchase Protection',
        description: 'Covers purchases against damage or theft for 90 days',
        value: 150
      }
    ]
  },
  {
    id: 'wells-fargo-reflect',
    name: 'Wells Fargo Reflect',
    introAPR: 0,
    introPeriod: 18,
    regularAPR: 16.99,
    transferFeeRate: 3,
    transferFeeMin: 5,
    annualFee: 0,
    additionalBenefits: [
      {
        name: 'Cell Phone Protection',
        description: 'Up to $600 protection against damage or theft',
        value: 120
      }
    ]
  },
  {
    id: 'chase-slate-edge',
    name: 'Chase Slate Edge',
    introAPR: 0,
    introPeriod: 18,
    regularAPR: 18.24,
    transferFeeRate: 3,
    transferFeeMin: 5,
    annualFee: 0,
    additionalBenefits: [
      {
        name: 'Automatic Review',
        description: 'Automatic review for APR reduction after 6 months',
        value: 80
      }
    ]
  },
  {
    id: 'us-bank-platinum',
    name: 'U.S. Bank Platinum',
    introAPR: 0,
    introPeriod: 20,
    regularAPR: 18.24,
    transferFeeRate: 3,
    transferFeeMin: 5,
    annualFee: 0,
    additionalBenefits: [
      {
        name: 'Cell Phone Protection',
        description: 'Up to $600 protection against damage or theft',
        value: 120
      },
      {
        name: 'Security Features',
        description: 'Advanced security and fraud monitoring',
        value: 50
      }
    ]
  }
] as const;

export const CREDITOR_SUGGESTIONS = [
  'American Express',
  'Bank of America',
  'Capital One',
  'Chase',
  'Citibank',
  'Discover',
  'U.S. Bank',
  'Wells Fargo'
] as const;

export const PAYMENT_STRATEGIES = {
  minimum: {
    name: 'Minimum Payment',
    description: 'Pay only the minimum required amount',
    recommendation: 'Not recommended - leads to maximum interest charges'
  },
  fixed: {
    name: 'Fixed Payment',
    description: 'Pay a fixed amount each month',
    recommendation: 'Good for budgeting and consistent payoff progress'
  },
  aggressive: {
    name: 'Aggressive Payment',
    description: 'Pay as much as possible each month',
    recommendation: 'Best for minimizing interest and fastest payoff'
  }
} as const;

export const STYLE_CONFIG = {
  card: {
    selected: 'border-blue-500 bg-blue-50',
    unselected: 'border-gray-200 hover:border-blue-300'
  },
  debt: {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  },
  savings: {
    positive: 'text-green-600',
    negative: 'text-red-600'
  }
} as const;

export const INTEREST_RATE_THRESHOLDS = {
  high: 20,
  medium: 15
} as const;

export const VALIDATION_RULES = {
  balance: {
    min: 100,
    max: 50000
  },
  interestRate: {
    min: 0,
    max: 35
  },
  minimumPayment: {
    min: 15
  },
  monthlyPayment: {
    min: 25
  }
} as const;

export const ANALYSIS_THRESHOLDS = {
  significantSavings: 1000,
  worthwhileTransfer: 500,
  minimumDebtRatio: 0.1 // minimum ratio of transfer amount to credit limit
} as const;
