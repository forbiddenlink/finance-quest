import { StyleConfig } from './types';

export const BUREAU_INFO = {
  equifax: {
    name: 'Equifax',
    website: 'www.equifax.com',
    phone: '1-800-685-1111',
    scoreRange: {
      min: 300,
      max: 850
    }
  },
  experian: {
    name: 'Experian',
    website: 'www.experian.com',
    phone: '1-888-397-3742',
    scoreRange: {
      min: 300,
      max: 850
    }
  },
  transunion: {
    name: 'TransUnion',
    website: 'www.transunion.com',
    phone: '1-800-916-8800',
    scoreRange: {
      min: 300,
      max: 850
    }
  }
} as const;

export const ALERT_TYPE_INFO = {
  identity_theft: {
    name: 'Identity Theft Alert',
    severity: 'high' as const,
    responseTime: 'immediate',
    description: 'Potential unauthorized use of your identity',
    actions: [
      'Contact credit bureaus',
      'File police report',
      'Contact creditors',
      'Review all accounts'
    ]
  },
  new_account: {
    name: 'New Account Alert',
    severity: 'medium' as const,
    responseTime: '24 hours',
    description: 'New credit account opened in your name',
    actions: [
      'Verify authorization',
      'Check account details',
      'Contact creditor if unauthorized'
    ]
  },
  balance_change: {
    name: 'Balance Change Alert',
    severity: 'low' as const,
    responseTime: '48 hours',
    description: 'Significant change in account balance',
    actions: [
      'Review transactions',
      'Check for unauthorized charges',
      'Contact card issuer if needed'
    ]
  },
  payment_status: {
    name: 'Payment Status Alert',
    severity: 'medium' as const,
    responseTime: '24 hours',
    description: 'Change in payment status on account',
    actions: [
      'Verify payment receipt',
      'Check payment history',
      'Contact creditor if error'
    ]
  },
  inquiry: {
    name: 'Inquiry Alert',
    severity: 'low' as const,
    responseTime: '48 hours',
    description: 'New credit inquiry on your report',
    actions: [
      'Verify application',
      'Check inquiry type',
      'Dispute if unauthorized'
    ]
  },
  public_record: {
    name: 'Public Record Alert',
    severity: 'high' as const,
    responseTime: 'immediate',
    description: 'New public record on your report',
    actions: [
      'Review record details',
      'Gather documentation',
      'Contact court if error',
      'Consider legal counsel'
    ]
  }
} as const;

export const MONITORING_FREQUENCIES = {
  daily: {
    label: 'Daily',
    description: 'Most frequent monitoring',
    recommendedFor: [
      'Active credit rebuilding',
      'Recent identity theft',
      'Frequent credit applications'
    ]
  },
  weekly: {
    label: 'Weekly',
    description: 'Regular monitoring',
    recommendedFor: [
      'Normal credit activity',
      'General maintenance',
      'Budget tracking'
    ]
  },
  monthly: {
    label: 'Monthly',
    description: 'Basic monitoring',
    recommendedFor: [
      'Stable credit profile',
      'Infrequent credit use',
      'Long-term tracking'
    ]
  }
} as const;

export const NOTIFICATION_TYPES = {
  email: {
    label: 'Email',
    description: 'Detailed alerts via email',
    features: [
      'Full alert details',
      'Clickable actions',
      'Historical record'
    ]
  },
  sms: {
    label: 'SMS',
    description: 'Quick text notifications',
    features: [
      'Instant alerts',
      'Brief summaries',
      'Mobile friendly'
    ]
  },
  push: {
    label: 'Push Notification',
    description: 'App-based alerts',
    features: [
      'Interactive alerts',
      'Quick actions',
      'In-app details'
    ]
  }
} as const;

export const SCORE_RANGES = {
  excellent: { min: 800, max: 850, label: 'Excellent' },
  very_good: { min: 740, max: 799, label: 'Very Good' },
  good: { min: 670, max: 739, label: 'Good' },
  fair: { min: 580, max: 669, label: 'Fair' },
  poor: { min: 300, max: 579, label: 'Poor' }
} as const;

export const DEFAULT_THRESHOLDS = {
  scoreChange: 20,
  balanceChange: 1000,
  utilizationChange: 10
} as const;

export const STYLE_CONFIG: StyleConfig = {
  increase: {
    background: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300'
  },
  decrease: {
    background: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300'
  },
  no_change: {
    background: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300'
  },
  high: {
    background: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300'
  },
  medium: {
    background: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300'
  },
  low: {
    background: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300'
  }
} as const;

export const CHART_COLORS = {
  equifax: {
    line: 'rgba(239, 68, 68, 1)', // red-500
    fill: 'rgba(239, 68, 68, 0.1)'
  },
  experian: {
    line: 'rgba(59, 130, 246, 1)', // blue-500
    fill: 'rgba(59, 130, 246, 0.1)'
  },
  transunion: {
    line: 'rgba(16, 185, 129, 1)', // green-500
    fill: 'rgba(16, 185, 129, 0.1)'
  }
} as const;
