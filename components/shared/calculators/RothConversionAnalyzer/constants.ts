import {
  TaxYearConfig,
  InvestmentConfig,
  RMDConfig,
  StyleConfig
} from './types';

export const TAX_YEAR_CONFIG: TaxYearConfig = {
  '2023': {
    single: {
      standardDeduction: 13850,
      brackets: [
        { rate: 10, lowerBound: 0, upperBound: 11000 },
        { rate: 12, lowerBound: 11000, upperBound: 44725 },
        { rate: 22, lowerBound: 44725, upperBound: 95375 },
        { rate: 24, lowerBound: 95375, upperBound: 182100 },
        { rate: 32, lowerBound: 182100, upperBound: 231250 },
        { rate: 35, lowerBound: 231250, upperBound: 578125 },
        { rate: 37, lowerBound: 578125 }
      ],
      rothContributionPhaseout: {
        start: 138000,
        end: 153000
      }
    },
    married_joint: {
      standardDeduction: 27700,
      brackets: [
        { rate: 10, lowerBound: 0, upperBound: 22000 },
        { rate: 12, lowerBound: 22000, upperBound: 89450 },
        { rate: 22, lowerBound: 89450, upperBound: 190750 },
        { rate: 24, lowerBound: 190750, upperBound: 364200 },
        { rate: 32, lowerBound: 364200, upperBound: 462500 },
        { rate: 35, lowerBound: 462500, upperBound: 693750 },
        { rate: 37, lowerBound: 693750 }
      ],
      rothContributionPhaseout: {
        start: 218000,
        end: 228000
      }
    },
    married_separate: {
      standardDeduction: 13850,
      brackets: [
        { rate: 10, lowerBound: 0, upperBound: 11000 },
        { rate: 12, lowerBound: 11000, upperBound: 44725 },
        { rate: 22, lowerBound: 44725, upperBound: 95375 },
        { rate: 24, lowerBound: 95375, upperBound: 182100 },
        { rate: 32, lowerBound: 182100, upperBound: 231250 },
        { rate: 35, lowerBound: 231250, upperBound: 346875 },
        { rate: 37, lowerBound: 346875 }
      ],
      rothContributionPhaseout: {
        start: 0,
        end: 10000
      },
      rothConversionIncomeLimits: {
        start: 0,
        end: 10000
      }
    },
    head_household: {
      standardDeduction: 20800,
      brackets: [
        { rate: 10, lowerBound: 0, upperBound: 15700 },
        { rate: 12, lowerBound: 15700, upperBound: 59850 },
        { rate: 22, lowerBound: 59850, upperBound: 95350 },
        { rate: 24, lowerBound: 95350, upperBound: 182100 },
        { rate: 32, lowerBound: 182100, upperBound: 231250 },
        { rate: 35, lowerBound: 231250, upperBound: 578100 },
        { rate: 37, lowerBound: 578100 }
      ],
      rothContributionPhaseout: {
        start: 138000,
        end: 153000
      }
    }
  },
  '2024': {
    single: {
      standardDeduction: 14600,
      brackets: [
        { rate: 10, lowerBound: 0, upperBound: 11600 },
        { rate: 12, lowerBound: 11600, upperBound: 47150 },
        { rate: 22, lowerBound: 47150, upperBound: 100525 },
        { rate: 24, lowerBound: 100525, upperBound: 191950 },
        { rate: 32, lowerBound: 191950, upperBound: 243725 },
        { rate: 35, lowerBound: 243725, upperBound: 609350 },
        { rate: 37, lowerBound: 609350 }
      ],
      rothContributionPhaseout: {
        start: 146000,
        end: 161000
      }
    },
    married_joint: {
      standardDeduction: 29200,
      brackets: [
        { rate: 10, lowerBound: 0, upperBound: 23200 },
        { rate: 12, lowerBound: 23200, upperBound: 94300 },
        { rate: 22, lowerBound: 94300, upperBound: 201050 },
        { rate: 24, lowerBound: 201050, upperBound: 383900 },
        { rate: 32, lowerBound: 383900, upperBound: 487450 },
        { rate: 35, lowerBound: 487450, upperBound: 731200 },
        { rate: 37, lowerBound: 731200 }
      ],
      rothContributionPhaseout: {
        start: 230000,
        end: 240000
      }
    },
    married_separate: {
      standardDeduction: 14600,
      brackets: [
        { rate: 10, lowerBound: 0, upperBound: 11600 },
        { rate: 12, lowerBound: 11600, upperBound: 47150 },
        { rate: 22, lowerBound: 47150, upperBound: 100525 },
        { rate: 24, lowerBound: 100525, upperBound: 191950 },
        { rate: 32, lowerBound: 191950, upperBound: 243725 },
        { rate: 35, lowerBound: 243725, upperBound: 365600 },
        { rate: 37, lowerBound: 365600 }
      ],
      rothContributionPhaseout: {
        start: 0,
        end: 10000
      },
      rothConversionIncomeLimits: {
        start: 0,
        end: 10000
      }
    },
    head_household: {
      standardDeduction: 21900,
      brackets: [
        { rate: 10, lowerBound: 0, upperBound: 16550 },
        { rate: 12, lowerBound: 16550, upperBound: 63100 },
        { rate: 22, lowerBound: 63100, upperBound: 100500 },
        { rate: 24, lowerBound: 100500, upperBound: 191950 },
        { rate: 32, lowerBound: 191950, upperBound: 243700 },
        { rate: 35, lowerBound: 243700, upperBound: 609350 },
        { rate: 37, lowerBound: 609350 }
      ],
      rothContributionPhaseout: {
        start: 146000,
        end: 161000
      }
    }
  }
} as const;

export const INVESTMENT_CONFIG: InvestmentConfig = {
  stocks: {
    defaultReturn: 8,
    volatility: 15,
    riskLevel: 'high',
    description: 'Equity investments in publicly traded companies'
  },
  bonds: {
    defaultReturn: 4,
    volatility: 5,
    riskLevel: 'medium',
    description: 'Fixed income securities with regular interest payments'
  },
  cash: {
    defaultReturn: 2,
    volatility: 1,
    riskLevel: 'low',
    description: 'Money market funds and high-yield savings'
  },
  other: {
    defaultReturn: 6,
    volatility: 10,
    riskLevel: 'medium',
    description: 'Alternative investments like REITs or commodities'
  }
} as const;

export const RMD_CONFIG: RMDConfig = {
  startAge: 73,
  factors: {
    73: 26.5,
    74: 25.5,
    75: 24.6,
    76: 23.7,
    77: 22.9,
    78: 22.0,
    79: 21.1,
    80: 20.2,
    81: 19.4,
    82: 18.5,
    83: 17.7,
    84: 16.8,
    85: 16.0,
    86: 15.2,
    87: 14.4,
    88: 13.7,
    89: 12.9,
    90: 12.2,
    91: 11.5,
    92: 10.8,
    93: 10.1,
    94: 9.5,
    95: 8.9,
    96: 8.4,
    97: 7.8,
    98: 7.3,
    99: 6.8,
    100: 6.4
  }
} as const;

export const STYLE_CONFIG: StyleConfig = {
  low_tax: {
    background: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300'
  },
  medium_tax: {
    background: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300'
  },
  high_tax: {
    background: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300'
  }
} as const;

export const ANALYSIS_CONSTANTS = {
  minAge: 18,
  maxAge: 100,
  minIncome: 0,
  maxIncome: 10000000,
  minBalance: 0,
  maxBalance: 100000000,
  minContribution: 0,
  maxContribution: 1000000,
  minReturn: -100,
  maxReturn: 100,
  minAllocation: 0,
  maxAllocation: 100,
  breakEvenThresholds: {
    short: 5,
    medium: 10,
    long: 15
  },
  riskThresholds: {
    market: {
      low: 10,
      high: 20
    },
    tax: {
      low: 22,
      high: 32
    },
    rmd: {
      low: 50000,
      high: 200000
    }
  }
} as const;
