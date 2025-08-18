import { StyleConfig } from './types';

export const FACTOR_WEIGHTS = {
  payment_history: 0.35,
  credit_utilization: 0.30,
  credit_age: 0.15,
  credit_mix: 0.10,
  new_credit: 0.10
} as const;

export const SCORE_RANGES = {
  excellent: { min: 800, max: 850, label: 'Excellent' },
  very_good: { min: 740, max: 799, label: 'Very Good' },
  good: { min: 670, max: 739, label: 'Good' },
  fair: { min: 580, max: 669, label: 'Fair' },
  poor: { min: 300, max: 579, label: 'Poor' }
} as const;

export const TIME_FRAMES = {
  immediate: {
    label: 'Immediate',
    description: 'Within 30 days',
    maxPoints: 20
  },
  short_term: {
    label: 'Short Term',
    description: '1-3 months',
    maxPoints: 40
  },
  medium_term: {
    label: 'Medium Term',
    description: '3-6 months',
    maxPoints: 60
  },
  long_term: {
    label: 'Long Term',
    description: '6+ months',
    maxPoints: 100
  }
} as const;

export const OPTIMIZATION_STRATEGIES = {
  utilization: {
    name: 'Credit Utilization Optimization',
    description: 'Optimize credit card balances and limits',
    maxImpact: 100,
    timeFrame: 'short_term' as const,
    actions: [
      'Pay down high-balance accounts',
      'Request credit limit increases',
      'Balance transfers',
      'Debt consolidation'
    ]
  },
  payment_history: {
    name: 'Payment History Improvement',
    description: 'Address negative payment history items',
    maxImpact: 110,
    timeFrame: 'long_term' as const,
    actions: [
      'Set up automatic payments',
      'Dispute errors',
      'Negotiate removals',
      'Write goodwill letters'
    ]
  },
  credit_mix: {
    name: 'Credit Mix Enhancement',
    description: 'Diversify credit types',
    maxImpact: 40,
    timeFrame: 'medium_term' as const,
    actions: [
      'Add missing credit types',
      'Consider secured products',
      'Balance account types',
      'Strategic applications'
    ]
  },
  credit_age: {
    name: 'Credit Age Management',
    description: 'Optimize account age metrics',
    maxImpact: 30,
    timeFrame: 'long_term' as const,
    actions: [
      'Keep old accounts active',
      'Limit new accounts',
      'Strategic account retention',
      'Authorized user strategies'
    ]
  }
} as const;

export const PAYDOWN_STRATEGIES = {
  avalanche: {
    name: 'Debt Avalanche',
    description: 'Pay highest interest first',
    benefits: [
      'Minimizes interest paid',
      'Fastest debt elimination',
      'Best mathematical approach'
    ],
    drawbacks: [
      'May take longer to see progress',
      'Requires discipline',
      'Less psychological reward'
    ]
  },
  snowball: {
    name: 'Debt Snowball',
    description: 'Pay smallest balance first',
    benefits: [
      'Quick wins for motivation',
      'Psychological momentum',
      'Simplifies finances faster'
    ],
    drawbacks: [
      'More interest paid overall',
      'Mathematically suboptimal',
      'Longer total payoff time'
    ]
  },
  balance: {
    name: 'Balanced Approach',
    description: 'Optimize both interest and utilization',
    benefits: [
      'Balanced score improvement',
      'Moderate interest savings',
      'Flexible strategy'
    ],
    drawbacks: [
      'More complex to manage',
      'Requires careful planning',
      'May need adjustments'
    ]
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
  interestRate: {
    min: 0,
    max: 100
  },
  targetScore: {
    min: 300,
    max: 850
  },
  monthlyBudget: {
    min: 0,
    max: 100000
  }
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

export const CHART_COLORS = {
  score: {
    line: 'rgba(59, 130, 246, 1)', // blue-500
    fill: 'rgba(59, 130, 246, 0.1)'
  },
  target: {
    line: 'rgba(16, 185, 129, 1)', // green-500
    fill: 'rgba(16, 185, 129, 0.1)'
  },
  projection: {
    line: 'rgba(245, 158, 11, 1)', // yellow-500
    fill: 'rgba(245, 158, 11, 0.1)'
  }
} as const;
