import { StyleConfig } from './types';

export const BUREAU_INFO = {
  equifax: {
    name: 'Equifax',
    website: 'www.equifax.com',
    phone: '1-800-685-1111',
    disputeUrl: 'www.equifax.com/personal/disputes',
    scoreRange: {
      min: 300,
      max: 850
    }
  },
  experian: {
    name: 'Experian',
    website: 'www.experian.com',
    phone: '1-888-397-3742',
    disputeUrl: 'www.experian.com/disputes',
    scoreRange: {
      min: 300,
      max: 850
    }
  },
  transunion: {
    name: 'TransUnion',
    website: 'www.transunion.com',
    phone: '1-800-916-8800',
    disputeUrl: 'www.transunion.com/credit-disputes/dispute-your-credit',
    scoreRange: {
      min: 300,
      max: 850
    }
  }
} as const;

export const ACCOUNT_TYPE_INFO = {
  credit_card: {
    name: 'Credit Card',
    description: 'Revolving credit account for purchases',
    impactLevel: 'high',
    bestPractices: [
      'Keep utilization below 30%',
      'Pay in full when possible',
      'Monitor for fraud'
    ]
  },
  personal_loan: {
    name: 'Personal Loan',
    description: 'Fixed-term unsecured loan',
    impactLevel: 'medium',
    bestPractices: [
      'Make payments on time',
      'Consider refinancing if rates drop',
      'Avoid early payoff penalties'
    ]
  },
  auto_loan: {
    name: 'Auto Loan',
    description: 'Vehicle-secured installment loan',
    impactLevel: 'medium',
    bestPractices: [
      'Maintain auto insurance',
      'Consider GAP coverage',
      'Track maintenance records'
    ]
  },
  mortgage: {
    name: 'Mortgage',
    description: 'Property-secured home loan',
    impactLevel: 'high',
    bestPractices: [
      'Maintain homeowners insurance',
      'Pay property taxes on time',
      'Consider refinancing opportunities'
    ]
  },
  student_loan: {
    name: 'Student Loan',
    description: 'Education-related installment loan',
    impactLevel: 'medium',
    bestPractices: [
      'Understand repayment options',
      'Track forgiveness eligibility',
      'Consider income-driven plans'
    ]
  },
  retail_card: {
    name: 'Retail Card',
    description: 'Store-specific credit card',
    impactLevel: 'medium',
    bestPractices: [
      'Watch for high interest rates',
      'Don\'t open too many accounts',
      'Use only for planned purchases'
    ]
  }
} as const;

export const ALERT_TYPE_INFO = {
  identity_theft: {
    name: 'Identity Theft Alert',
    severity: 'high',
    responseTime: 'immediate',
    actions: [
      'Contact credit bureaus',
      'File police report',
      'Contact creditors',
      'Review all accounts'
    ]
  },
  new_account: {
    name: 'New Account Alert',
    severity: 'medium',
    responseTime: '24 hours',
    actions: [
      'Verify authorization',
      'Check account details',
      'Contact creditor if unauthorized'
    ]
  },
  balance_change: {
    name: 'Balance Change Alert',
    severity: 'low',
    responseTime: '48 hours',
    actions: [
      'Review transactions',
      'Check for unauthorized charges',
      'Contact card issuer if needed'
    ]
  },
  payment_status: {
    name: 'Payment Status Alert',
    severity: 'medium',
    responseTime: '24 hours',
    actions: [
      'Verify payment receipt',
      'Check payment history',
      'Contact creditor if error'
    ]
  },
  inquiry: {
    name: 'Inquiry Alert',
    severity: 'low',
    responseTime: '48 hours',
    actions: [
      'Verify application',
      'Check inquiry type',
      'Dispute if unauthorized'
    ]
  },
  public_record: {
    name: 'Public Record Alert',
    severity: 'high',
    responseTime: 'immediate',
    actions: [
      'Review record details',
      'Gather documentation',
      'Contact court if error',
      'Consider legal counsel'
    ]
  }
} as const;

export const DISPUTE_REASONS = [
  'Not my account',
  'Account closed',
  'Wrong balance',
  'Never late',
  'Incorrect payment history',
  'Account included in bankruptcy',
  'Identity theft',
  'Paid as agreed',
  'Account discharged',
  'Other'
] as const;

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

export const STYLE_CONFIG: StyleConfig = {
  high_impact: {
    background: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300'
  },
  medium_impact: {
    background: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300'
  },
  low_impact: {
    background: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300'
  },
  neutral: {
    background: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300'
  }
} as const;

export const CHART_COLORS = {
  accounts: {
    line: 'rgba(59, 130, 246, 1)', // blue-500
    fill: 'rgba(59, 130, 246, 0.1)'
  },
  balances: {
    line: 'rgba(16, 185, 129, 1)', // green-500
    fill: 'rgba(16, 185, 129, 0.1)'
  },
  payments: {
    line: 'rgba(245, 158, 11, 1)', // yellow-500
    fill: 'rgba(245, 158, 11, 0.1)'
  },
  inquiries: {
    line: 'rgba(239, 68, 68, 1)', // red-500
    fill: 'rgba(239, 68, 68, 0.1)'
  }
} as const;

export const REPORT_SECTIONS = {
  accounts: {
    name: 'Account Summary',
    description: 'Overview of all credit accounts and their current status',
    priority: 'high'
  },
  payment_history: {
    name: 'Payment History',
    description: 'Analysis of payment patterns and late payments',
    priority: 'high'
  },
  inquiries: {
    name: 'Credit Inquiries',
    description: 'Recent applications for credit and their impact',
    priority: 'medium'
  },
  public_records: {
    name: 'Public Records',
    description: 'Legal items that may affect creditworthiness',
    priority: 'high'
  },
  alerts: {
    name: 'Active Alerts',
    description: 'Important notifications requiring attention',
    priority: 'high'
  },
  discrepancies: {
    name: 'Report Discrepancies',
    description: 'Differences between credit bureau reports',
    priority: 'medium'
  }
} as const;
