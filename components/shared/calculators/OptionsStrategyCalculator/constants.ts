import {
  StrategyType,
  ExpiryTerm,
  StrategyConfig,
  ExpiryConfig,
  GreeksConfig,
  StyleConfig
} from './types';

export const STRATEGY_CONFIG: StrategyConfig = {
  single: {
    name: 'Single Option',
    description: 'A simple long or short position in a call or put option',
    maxLegs: 1,
    marginRequirement: (options, underlyingPrice) => {
      const option = options[0];
      if (option.position === 'long') {
        return option.premium * option.quantity * 100;
      }
      return option.type === 'call'
        ? underlyingPrice * 0.2 * option.quantity * 100
        : option.strike * 0.2 * option.quantity * 100;
    },
    riskLevel: 'high',
    profitPotential: 'unlimited'
  },
  vertical: {
    name: 'Vertical Spread',
    description: 'A combination of a long and short option of the same type and expiration but different strikes',
    maxLegs: 2,
    marginRequirement: (options, _) => {
      const width = Math.abs(options[0].strike - options[1].strike);
      return width * options[0].quantity * 100;
    },
    riskLevel: 'medium',
    profitPotential: 'limited'
  },
  iron_condor: {
    name: 'Iron Condor',
    description: 'A combination of a bull put spread and a bear call spread',
    maxLegs: 4,
    marginRequirement: (options, _) => {
      const putWidth = Math.abs(options[0].strike - options[1].strike);
      const callWidth = Math.abs(options[2].strike - options[3].strike);
      return Math.max(putWidth, callWidth) * options[0].quantity * 100;
    },
    riskLevel: 'low',
    profitPotential: 'limited'
  },
  butterfly: {
    name: 'Butterfly Spread',
    description: 'A three-legged options strategy using calls or puts with different strikes',
    maxLegs: 3,
    marginRequirement: (options, _) => {
      const width = Math.abs(options[0].strike - options[1].strike);
      return width * options[0].quantity * 100;
    },
    riskLevel: 'low',
    profitPotential: 'limited'
  },
  straddle: {
    name: 'Straddle',
    description: 'A combination of a call and put with the same strike and expiration',
    maxLegs: 2,
    marginRequirement: (options, _) => {
      return options[0].strike * options[0].quantity * 100;
    },
    riskLevel: 'high',
    profitPotential: 'unlimited'
  },
  strangle: {
    name: 'Strangle',
    description: 'A combination of a call and put with different strikes but same expiration',
    maxLegs: 2,
    marginRequirement: (options, _) => {
      return Math.min(options[0].strike, options[1].strike) * options[0].quantity * 100;
    },
    riskLevel: 'high',
    profitPotential: 'unlimited'
  },
  covered_call: {
    name: 'Covered Call',
    description: 'A long stock position combined with a short call option',
    maxLegs: 1,
    marginRequirement: (options, underlyingPrice) => {
      return underlyingPrice * options[0].quantity * 100;
    },
    riskLevel: 'low',
    profitPotential: 'limited'
  },
  protective_put: {
    name: 'Protective Put',
    description: 'A long stock position combined with a long put option',
    maxLegs: 1,
    marginRequirement: (options, underlyingPrice) => {
      return (underlyingPrice + options[0].premium) * options[0].quantity * 100;
    },
    riskLevel: 'low',
    profitPotential: 'unlimited'
  }
} as const;

export const EXPIRY_CONFIG: ExpiryConfig = {
  weekly: {
    minDays: 1,
    maxDays: 7,
    label: 'Weekly',
    description: 'Options expiring within a week'
  },
  monthly: {
    minDays: 8,
    maxDays: 45,
    label: 'Monthly',
    description: 'Options expiring within 1-2 months'
  },
  quarterly: {
    minDays: 46,
    maxDays: 180,
    label: 'Quarterly',
    description: 'Options expiring in 3-6 months'
  },
  leaps: {
    minDays: 181,
    maxDays: 730,
    label: 'LEAPS',
    description: 'Long-term options expiring in >6 months'
  }
} as const;

export const GREEKS_CONFIG: GreeksConfig = {
  deltaThresholds: {
    low: 0.2,
    high: 0.8
  },
  gammaThresholds: {
    low: 0.01,
    high: 0.05
  },
  thetaThresholds: {
    low: -0.1,
    high: -0.01
  },
  vegaThresholds: {
    low: 0.1,
    high: 0.5
  },
  rhoThresholds: {
    low: 0.1,
    high: 0.5
  }
} as const;

export const STYLE_CONFIG: StyleConfig = {
  profit: {
    background: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300'
  },
  loss: {
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

export const ANALYSIS_CONSTANTS = {
  minUnderlyingPrice: 0.01,
  maxUnderlyingPrice: 10000,
  minStrikePrice: 0.01,
  maxStrikePrice: 10000,
  minPremium: 0.01,
  maxPremium: 1000,
  minQuantity: 1,
  maxQuantity: 100,
  minVolatility: 1,
  maxVolatility: 200,
  minRiskFreeRate: 0,
  maxRiskFreeRate: 20,
  minDividendYield: 0,
  maxDividendYield: 20,
  profitProbabilityThresholds: {
    low: 0.3,
    medium: 0.5,
    high: 0.7
  },
  riskRewardThresholds: {
    poor: 0.5,
    fair: 1,
    good: 2,
    excellent: 3
  },
  timeDecayThresholds: {
    low: -0.01,
    medium: -0.05,
    high: -0.1
  },
  volatilityExposureThresholds: {
    low: 0.1,
    medium: 0.5,
    high: 1
  }
} as const;
