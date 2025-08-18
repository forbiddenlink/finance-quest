import {
  TaxYearConfig,
  DeductionLimits,
  CreditLimits,
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
      saltCap: 10000,
      childTaxCreditPhaseout: {
        start: 200000,
        end: 240000
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
      saltCap: 10000,
      childTaxCreditPhaseout: {
        start: 400000,
        end: 440000
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
      saltCap: 5000,
      childTaxCreditPhaseout: {
        start: 200000,
        end: 240000
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
      saltCap: 10000,
      childTaxCreditPhaseout: {
        start: 200000,
        end: 240000
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
      saltCap: 10000,
      childTaxCreditPhaseout: {
        start: 210000,
        end: 250000
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
      saltCap: 10000,
      childTaxCreditPhaseout: {
        start: 420000,
        end: 460000
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
      saltCap: 5000,
      childTaxCreditPhaseout: {
        start: 210000,
        end: 250000
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
      saltCap: 10000,
      childTaxCreditPhaseout: {
        start: 210000,
        end: 250000
      }
    }
  }
} as const;

export const DEDUCTION_LIMITS: DeductionLimits = {
  mortgage_interest: {
    maxAmount: 750000,
    specialRules: [
      'Limited to interest on first $750,000 of mortgage debt',
      'Home equity interest only deductible if used for home improvements'
    ]
  },
  property_tax: {
    maxAmount: 10000,
    specialRules: [
      'Combined with state and local tax deduction',
      'Subject to SALT cap'
    ]
  },
  charitable: {
    specialRules: [
      'Cash contributions limited to 60% of AGI',
      'Non-cash contributions limited to 30% of AGI',
      'Must have proper documentation'
    ]
  },
  medical: {
    specialRules: [
      'Only expenses exceeding 7.5% of AGI are deductible'
    ]
  },
  state_local_tax: {
    maxAmount: 10000,
    specialRules: [
      'Combined with property tax deduction',
      'Subject to SALT cap'
    ]
  },
  other: {
    specialRules: [
      'Must be properly documented',
      'Subject to specific limitations based on type'
    ]
  }
} as const;

export const CREDIT_LIMITS: CreditLimits = {
  child_tax: {
    maxCredit: 2000,
    refundable: true,
    phaseOut: {
      start: 200000,
      end: 240000
    },
    specialRules: [
      'Child must be under 17',
      'Must have valid SSN',
      'Up to $1,500 refundable'
    ]
  },
  education: {
    maxCredit: 2500,
    refundable: false,
    phaseOut: {
      start: 80000,
      end: 90000
    },
    specialRules: [
      'American Opportunity Credit',
      'First 4 years of post-secondary education',
      'Must be enrolled at least half-time'
    ]
  },
  energy: {
    maxCredit: 3200,
    refundable: false,
    specialRules: [
      'Residential clean energy credit',
      'Must meet energy efficiency requirements',
      'Requires manufacturer certification'
    ]
  },
  retirement_savings: {
    maxCredit: 1000,
    refundable: false,
    incomeLimit: 35500,
    specialRules: [
      'Saver\'s Credit',
      'Must contribute to qualified retirement account',
      'Credit percentage based on income'
    ]
  },
  other: {
    maxCredit: 0,
    refundable: false,
    specialRules: [
      'Various credits with specific requirements',
      'Check IRS guidelines for details'
    ]
  }
} as const;

export const STYLE_CONFIG: StyleConfig = {
  refund: {
    background: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300'
  },
  due: {
    background: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300'
  },
  neutral: {
    background: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300'
  }
} as const;
