import {
  CompoundInterestConstants,
  CompoundingFrequencyConfig,
  ContributionFrequencyConfig,
  InvestmentGoalConfig,
  WithdrawalRateConfig
} from './types';

const COMPOUNDING_FREQUENCIES: CompoundingFrequencyConfig = {
  daily: {
    periodsPerYear: 365,
    label: 'Daily',
    description: 'Interest is compounded every day'
  },
  monthly: {
    periodsPerYear: 12,
    label: 'Monthly',
    description: 'Interest is compounded every month'
  },
  quarterly: {
    periodsPerYear: 4,
    label: 'Quarterly',
    description: 'Interest is compounded every three months'
  },
  annually: {
    periodsPerYear: 1,
    label: 'Annually',
    description: 'Interest is compounded once per year'
  }
} as const;

const CONTRIBUTION_FREQUENCIES: ContributionFrequencyConfig = {
  monthly: {
    periodsPerYear: 12,
    label: 'Monthly',
    description: 'Contribute every month'
  },
  quarterly: {
    periodsPerYear: 4,
    label: 'Quarterly',
    description: 'Contribute every three months'
  },
  annually: {
    periodsPerYear: 1,
    label: 'Annually',
    description: 'Contribute once per year'
  }
} as const;

const INVESTMENT_GOALS: InvestmentGoalConfig = {
  retirement: {
    label: 'Retirement',
    description: 'Save for retirement',
    recommendedAllocation: {
      stocks: 70,
      bonds: 25,
      cash: 5
    },
    defaultTimeHorizon: 30,
    riskLevel: 'medium'
  },
  education: {
    label: 'Education',
    description: 'Save for education expenses',
    recommendedAllocation: {
      stocks: 60,
      bonds: 30,
      cash: 10
    },
    defaultTimeHorizon: 18,
    riskLevel: 'medium'
  },
  home: {
    label: 'Home Purchase',
    description: 'Save for a home down payment',
    recommendedAllocation: {
      stocks: 40,
      bonds: 40,
      cash: 20
    },
    defaultTimeHorizon: 5,
    riskLevel: 'low'
  },
  other: {
    label: 'Other Goal',
    description: 'Save for other financial goals',
    recommendedAllocation: {
      stocks: 50,
      bonds: 30,
      cash: 20
    },
    defaultTimeHorizon: 10,
    riskLevel: 'medium'
  }
} as const;

const WITHDRAWAL_RATES: WithdrawalRateConfig = {
  conservative: 3,
  moderate: 4,
  aggressive: 5
} as const;

export const COMPOUND_INTEREST_CONSTANTS: CompoundInterestConstants = {
  maxInitialInvestment: 10000000,
  maxMonthlyContribution: 100000,
  maxInterestRate: 25,
  maxTimeHorizon: 50,
  maxInflationRate: 15,
  maxTaxRate: 50,
  defaultWithdrawalRate: WITHDRAWAL_RATES.moderate,
  compoundingFrequencies: COMPOUNDING_FREQUENCIES,
  contributionFrequencies: CONTRIBUTION_FREQUENCIES,
  investmentGoals: INVESTMENT_GOALS,
  withdrawalRates: WITHDRAWAL_RATES
} as const;
