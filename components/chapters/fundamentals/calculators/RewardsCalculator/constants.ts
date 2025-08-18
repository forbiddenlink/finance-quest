import { CreditCard, SpendingCategory } from './types';

export const SPENDING_CATEGORIES: Record<SpendingCategory, string> = {
  dining: 'Dining & Restaurants',
  groceries: 'Groceries & Supermarkets',
  gas: 'Gas & Fuel',
  travel: 'Travel & Transit',
  entertainment: 'Entertainment',
  shopping: 'Shopping & Retail',
  utilities: 'Utilities & Bills',
  other: 'Other Purchases'
} as const;

export const POPULAR_CARDS: CreditCard[] = [
  {
    id: 'chase-sapphire-preferred',
    name: 'Chase Sapphire Preferred',
    annualFee: 95,
    rewardType: 'points',
    baseRate: 1,
    bonusCategories: [
      { category: 'dining', rate: 3 },
      { category: 'travel', rate: 2 },
      { category: 'groceries', rate: 1.5 }
    ],
    signupBonus: {
      amount: 60000,
      spendRequirement: 4000,
      timeframe: 3
    },
    benefits: [
      {
        name: 'Travel Insurance',
        value: 200,
        description: 'Trip cancellation/interruption insurance up to $10,000'
      },
      {
        name: 'DoorDash',
        value: 60,
        description: '$60 annual DoorDash credit'
      }
    ]
  },
  {
    id: 'amex-gold',
    name: 'American Express Gold',
    annualFee: 250,
    rewardType: 'points',
    baseRate: 1,
    bonusCategories: [
      { category: 'dining', rate: 4 },
      { category: 'groceries', rate: 4, cap: 25000 }
    ],
    signupBonus: {
      amount: 60000,
      spendRequirement: 4000,
      timeframe: 6
    },
    benefits: [
      {
        name: 'Dining Credit',
        value: 120,
        description: '$10 monthly dining credit'
      },
      {
        name: 'Uber Credit',
        value: 120,
        description: '$10 monthly Uber/Uber Eats credit'
      }
    ]
  },
  {
    id: 'citi-double-cash',
    name: 'Citi Double Cash',
    annualFee: 0,
    rewardType: 'cashback',
    baseRate: 2,
    bonusCategories: [],
    benefits: [
      {
        name: 'Virtual Card Numbers',
        value: 50,
        description: 'Generate virtual card numbers for online shopping'
      }
    ]
  },
  {
    id: 'capital-one-venture',
    name: 'Capital One Venture',
    annualFee: 95,
    rewardType: 'miles',
    baseRate: 2,
    bonusCategories: [
      { category: 'travel', rate: 5 }
    ],
    signupBonus: {
      amount: 75000,
      spendRequirement: 4000,
      timeframe: 3
    },
    benefits: [
      {
        name: 'Global Entry/TSA PreCheck',
        value: 100,
        description: 'Credit for Global Entry or TSA PreCheck application fee'
      },
      {
        name: 'Travel Insurance',
        value: 150,
        description: 'Travel accident insurance and rental car coverage'
      }
    ]
  }
] as const;

export const DEFAULT_MONTHLY_SPENDING = [
  { category: 'groceries', amount: 500 },
  { category: 'dining', amount: 300 },
  { category: 'gas', amount: 200 },
  { category: 'travel', amount: 200 },
  { category: 'entertainment', amount: 100 },
  { category: 'shopping', amount: 300 },
  { category: 'utilities', amount: 200 },
  { category: 'other', amount: 500 }
] as const;

export const POINT_VALUES = {
  'chase-sapphire-preferred': {
    points: 1.25,
    transfer: 2.0
  },
  'amex-gold': {
    points: 1.0,
    transfer: 2.0
  },
  'capital-one-venture': {
    points: 1.0,
    transfer: 1.8
  }
} as const;

export const CATEGORY_ICONS = {
  dining: '🍽️',
  groceries: '🛒',
  gas: '⛽',
  travel: '✈️',
  entertainment: '🎭',
  shopping: '🛍️',
  utilities: '💡',
  other: '📦'
} as const;

export const REWARD_TYPE_INFO = {
  points: {
    name: 'Points',
    description: 'Flexible rewards that can be redeemed for travel, cash back, or transferred to partners',
    icon: '⭐'
  },
  miles: {
    name: 'Miles',
    description: 'Best for travel redemptions and airline transfers',
    icon: '✈️'
  },
  cashback: {
    name: 'Cash Back',
    description: 'Simple, straightforward rewards with no redemption restrictions',
    icon: '💵'
  }
} as const;

export const STYLE_CONFIG = {
  card: {
    selected: 'border-blue-500 bg-blue-50',
    unselected: 'border-gray-200 hover:border-blue-300'
  },
  category: {
    dining: 'bg-red-100 text-red-800',
    groceries: 'bg-green-100 text-green-800',
    gas: 'bg-yellow-100 text-yellow-800',
    travel: 'bg-blue-100 text-blue-800',
    entertainment: 'bg-purple-100 text-purple-800',
    shopping: 'bg-pink-100 text-pink-800',
    utilities: 'bg-indigo-100 text-indigo-800',
    other: 'bg-gray-100 text-gray-800'
  }
} as const;
