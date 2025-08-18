import { StyleConfig } from './types';

export const SCORE_RANGES = {
  excellent: { min: 800, max: 850, label: 'Excellent' },
  very_good: { min: 740, max: 799, label: 'Very Good' },
  good: { min: 670, max: 739, label: 'Good' },
  fair: { min: 580, max: 669, label: 'Fair' },
  poor: { min: 300, max: 579, label: 'Poor' }
} as const;

export const FACTOR_WEIGHTS = {
  payment_history: 0.35,
  credit_utilization: 0.30,
  credit_age: 0.15,
  credit_mix: 0.10,
  new_credit: 0.10
} as const;

export const PAYMENT_IMPACT = {
  current: 0,
  late_30: -50,
  late_60: -75,
  late_90: -100,
  collection: -150,
  charge_off: -200
} as const;

export const UTILIZATION_THRESHOLDS = {
  excellent: 0.10,
  good: 0.30,
  fair: 0.50,
  poor: 0.75
} as const;

export const ACCOUNT_AGE_IMPACT = {
  less_than_6m: -20,
  six_to_12m: -10,
  one_to_two_years: 0,
  two_to_five_years: 10,
  five_plus_years: 20
} as const;

export const CREDIT_MIX_SCORES = {
  diverse: 20,
  moderate: 10,
  limited: 0,
  poor: -10
} as const;

export const INQUIRY_IMPACT = {
  initial: -5,
  additional_within_14d: -10,
  recovery_time_months: 12
} as const;

export const RECOVERY_TIMES = {
  late_payment: {
    days_30: '12 months',
    days_60: '2-3 years',
    days_90: '3-4 years',
    collection: '7 years',
    charge_off: '7 years'
  },
  bankruptcy: {
    chapter_7: '10 years',
    chapter_13: '7 years'
  },
  inquiry: '2 years',
  collection_paid: '7 years',
  collection_settled: '7 years'
} as const;

export const STYLE_CONFIG: StyleConfig = {
  excellent: {
    background: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300'
  },
  very_good: {
    background: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-300'
  },
  good: {
    background: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300'
  },
  fair: {
    background: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300'
  },
  poor: {
    background: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300'
  }
} as const;

export const VALIDATION_RULES = {
  balance: {
    min: 0,
    max: 1000000
  },
  creditLimit: {
    min: 0,
    max: 1000000
  },
  monthlyPayment: {
    min: 0,
    max: 50000
  },
  paymentAmount: {
    min: 0,
    max: 100000
  },
  accountAge: {
    min: 0,
    max: 600 // 50 years in months
  }
} as const;

export const CHART_COLORS = {
  score: {
    line: 'rgba(59, 130, 246, 1)', // blue-500
    fill: 'rgba(59, 130, 246, 0.1)'
  },
  utilization: {
    line: 'rgba(16, 185, 129, 1)', // green-500
    fill: 'rgba(16, 185, 129, 0.1)'
  },
  payment_history: {
    line: 'rgba(245, 158, 11, 1)', // yellow-500
    fill: 'rgba(245, 158, 11, 0.1)'
  }
} as const;

export const SIMULATION_PRESETS = {
  pay_down_debt: {
    name: 'Pay Down Credit Card Debt',
    description: 'Simulate paying down credit card balances to reduce utilization',
    factors: ['credit_utilization'],
    timeframe: '1-3 months'
  },
  add_credit_card: {
    name: 'Open New Credit Card',
    description: 'Simulate opening a new credit card account',
    factors: ['new_credit', 'credit_mix', 'credit_utilization'],
    timeframe: '3-6 months'
  },
  add_installment_loan: {
    name: 'Add Installment Loan',
    description: 'Simulate adding a new installment loan to diversify credit mix',
    factors: ['new_credit', 'credit_mix'],
    timeframe: '6-12 months'
  },
  remove_collection: {
    name: 'Pay Off Collection Account',
    description: 'Simulate paying off or settling a collection account',
    factors: ['payment_history'],
    timeframe: 'Immediate impact, remains for 7 years'
  }
} as const;
