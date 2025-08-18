import { Decimal } from 'decimal.js';
import {
  PortfolioValues,
  BaseReturns,
  RiskAdjustments,
  TargetAllocations,
  AssetClass,
  RiskTolerance,
  ProjectedReturns,
  RiskMetrics
} from './types';

// Base return assumptions
const baseReturns: BaseReturns = {
  cash: 2,
  bonds: 4,
  stocks: 8,
  realEstate: 7,
  alternatives: 6
} as const;

// Risk adjustments
const riskAdjustments: RiskAdjustments = {
  conservative: 0.8,
  moderate: 1.0,
  aggressive: 1.2
} as const;

// Target allocation ranges
const targetAllocations: TargetAllocations = {
  cash: {
    conservative: { min: 15, max: 25 },
    moderate: { min: 5, max: 15 },
    aggressive: { min: 0, max: 10 }
  },
  bonds: {
    conservative: { min: 40, max: 60 },
    moderate: { min: 25, max: 45 },
    aggressive: { min: 10, max: 30 }
  },
  stocks: {
    conservative: { min: 20, max: 40 },
    moderate: { min: 30, max: 50 },
    aggressive: { min: 40, max: 70 }
  },
  realEstate: {
    conservative: { min: 0, max: 10 },
    moderate: { min: 5, max: 15 },
    aggressive: { min: 10, max: 20 }
  },
  alternatives: {
    conservative: { min: 0, max: 5 },
    moderate: { min: 5, max: 15 },
    aggressive: { min: 10, max: 20 }
  }
} as const;

export function calculateProjectedReturns(values: PortfolioValues): ProjectedReturns {
  // Calculate weighted average return using Decimal.js for precision
  const weightedReturn: number = new Decimal(values.cashAllocation).times(baseReturns.cash)
    .plus(new Decimal(values.bondAllocation).times(baseReturns.bonds))
    .plus(new Decimal(values.stockAllocation).times(baseReturns.stocks))
    .plus(new Decimal(values.realEstateAllocation).times(baseReturns.realEstate))
    .plus(new Decimal(values.alternativeAllocation).times(baseReturns.alternatives))
    .div(100)
    .toNumber();

  // Adjust for risk tolerance
  const riskAdjustment: number = riskAdjustments[values.riskTolerance];
  const expectedReturn: number = new Decimal(weightedReturn).times(riskAdjustment).toNumber();

  return {
    conservative: new Decimal(expectedReturn).times(0.7).toNumber(),
    expected: expectedReturn,
    optimistic: new Decimal(expectedReturn).times(1.3).toNumber()
  };
}

export function calculateRiskMetrics(values: PortfolioValues): RiskMetrics {
  // Calculate volatility based on asset allocation and risk tolerance
  const baseVolatility: number = new Decimal(values.stockAllocation).times(0.2)
    .plus(new Decimal(values.bondAllocation).times(0.05))
    .plus(new Decimal(values.realEstateAllocation).times(0.15))
    .plus(new Decimal(values.alternativeAllocation).times(0.25))
    .div(100)
    .toNumber();

  // Adjust volatility based on risk tolerance
  const volatility: number = new Decimal(baseVolatility)
    .times(riskAdjustments[values.riskTolerance])
    .toNumber();

  // Calculate Sharpe ratio (assuming risk-free rate of 2%)
  const riskFreeRate = 0.02;
  const expectedReturn: number = calculateProjectedReturns(values).expected;
  const sharpeRatio: number = new Decimal(expectedReturn - riskFreeRate)
    .div(volatility)
    .toNumber();

  // Calculate maximum drawdown (simplified estimation)
  const maxDrawdown: number = new Decimal(volatility)
    .times(2)
    .toNumber();

  // Calculate diversification score
  const totalAllocation: number = new Decimal(values.cashAllocation)
    .plus(values.bondAllocation)
    .plus(values.stockAllocation)
    .plus(values.realEstateAllocation)
    .plus(values.alternativeAllocation)
    .toNumber();

  const diversificationScore: number = totalAllocation === 0 ? 0 : 
    new Decimal(100).minus(
      new Decimal(values.cashAllocation).pow(2)
        .plus(new Decimal(values.bondAllocation).pow(2))
        .plus(new Decimal(values.stockAllocation).pow(2))
        .plus(new Decimal(values.realEstateAllocation).pow(2))
        .plus(new Decimal(values.alternativeAllocation).pow(2))
        .div(totalAllocation)
    ).div(100).toNumber();

  return {
    volatility,
    sharpeRatio,
    maxDrawdown,
    diversificationScore
  };
}

export function validateAllocations(values: PortfolioValues): boolean {
  const totalAllocation: number = new Decimal(values.cashAllocation)
    .plus(values.bondAllocation)
    .plus(values.stockAllocation)
    .plus(values.realEstateAllocation)
    .plus(values.alternativeAllocation)
    .toNumber();

  if (!new Decimal(totalAllocation).equals(100)) {
    return false;
  }

  // Check if allocations are within target ranges
  const assetClasses: AssetClass[] = ['cash', 'bonds', 'stocks', 'realEstate', 'alternatives'];
  return assetClasses.every((asset: AssetClass) => {
    const allocation: number = values[`${asset}Allocation` as keyof PortfolioValues];
    const { min, max } = targetAllocations[asset][values.riskTolerance];
    return allocation >= min && allocation <= max;
  });
}

export function generateRebalancingSchedule(values: PortfolioValues): Date[] {
  const schedule: Date[] = [];
  const currentDate: Date = new Date();
  const frequency: number = values.rebalancingFrequency;

  for (let i = 0; i < 4; i++) {
    const nextDate: Date = new Date(currentDate);
    nextDate.setMonth(currentDate.getMonth() + (i * frequency));
    schedule.push(nextDate);
  }

  return schedule;
}

export function generateRecommendations(values: PortfolioValues, metrics: RiskMetrics): string[] {
  const recommendations: string[] = [];

  // Check diversification
  if (metrics.diversificationScore < 0.5) {
    recommendations.push('Consider increasing portfolio diversification across asset classes');
  }

  // Check risk-adjusted returns
  if (metrics.sharpeRatio < 0.5) {
    recommendations.push('Portfolio may benefit from improved risk-adjusted returns');
  }

  // Check allocation alignment with risk tolerance
  const assetClasses: AssetClass[] = ['cash', 'bonds', 'stocks', 'realEstate', 'alternatives'];
  assetClasses.forEach((asset: AssetClass) => {
    const allocation: number = values[`${asset}Allocation` as keyof PortfolioValues];
    const { min, max } = targetAllocations[asset][values.riskTolerance];
    if (allocation < min) {
      recommendations.push(`Consider increasing ${asset} allocation to align with risk profile`);
    } else if (allocation > max) {
      recommendations.push(`Consider reducing ${asset} allocation to align with risk profile`);
    }
  });

  return recommendations;
}