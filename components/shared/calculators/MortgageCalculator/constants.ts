import { MortgageConstants } from './types';

export const MORTGAGE_CONSTANTS: MortgageConstants = {
  loanLimits: {
    conventional: {
      singleUnit: 726200,
      multiUnit: {
        '2': 929850,
        '3': 1123900,
        '4': 1396800
      }
    },
    fha: {
      singleUnit: 420680,
      multiUnit: {
        '2': 538650,
        '3': 651050,
        '4': 809150
      }
    },
    va: {
      singleUnit: 726200,
      multiUnit: {
        '2': 929850,
        '3': 1123900,
        '4': 1396800
      }
    }
  },
  pmiRates: {
    excellent: {
      rate: 0.3,
      minEquity: 15
    },
    good: {
      rate: 0.5,
      minEquity: 10
    },
    fair: {
      rate: 0.75,
      minEquity: 5
    },
    poor: {
      rate: 1.0,
      minEquity: 3
    }
  },
  propertyTaxRates: {
    national: {
      average: 1.1,
      range: {
        min: 0.3,
        max: 2.13
      }
    }
  },
  insuranceRates: {
    base: 0.35,
    factors: {
      location: 1.2,
      construction: 1.1,
      age: 1.15,
      claims: 1.25
    }
  },
  termOptions: ['15', '20', '30'] as const,
  minDownPaymentPercent: 3.5,
  maxLoanAmount: 2000000,
  maxInterestRate: 25,
  maxTermYears: 30
} as const;
