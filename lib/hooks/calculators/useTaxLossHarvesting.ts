'use client';

import { useCalculatorBase } from '../useCalculatorBase';
import { formatCurrency } from '@/lib/utils/financial';

// Types
interface TaxLossHarvestingValues {
  portfolioValue: number;
  taxBracket: number;
  stateRate: number;
  unrealizedLosses: number;
  holdingPeriod: number;
  transactionCosts: number;
  washSaleWindow: number;
  reinvestmentStrategy: 'similar' | 'different' | 'cash';
}

interface TaxLossHarvestingResult {
  potentialTaxSavings: number;
  netBenefit: number;
  totalCosts: number;
  washSaleRisk: 'low' | 'medium' | 'high';
  optimalHarvestingAmount: number;
  recommendations: string[];
  harvestingOpportunities: Array<{
    amount: number;
    benefit: number;
    risk: string;
  }>;
  timing: {
    bestTime: string;
    waitPeriod: number;
  };
}

// Validation rules
const validationRules = {
  portfolioValue: (value: number) => {
    if (value < 0) return 'Portfolio value must be positive';
    if (value > 100000000) return 'Portfolio value exceeds maximum limit';
    return null;
  },
  taxBracket: (value: number) => {
    if (value < 0 || value > 100) return 'Tax bracket must be between 0 and 100';
    return null;
  },
  stateRate: (value: number) => {
    if (value < 0 || value > 15) return 'State tax rate must be between 0 and 15';
    return null;
  },
  unrealizedLosses: (value: number) => {
    if (value < 0) return 'Unrealized losses must be positive';
    return null;
  },
  holdingPeriod: (value: number) => {
    if (value < 0) return 'Holding period must be positive';
    return null;
  },
  transactionCosts: (value: number) => {
    if (value < 0) return 'Transaction costs must be positive';
    return null;
  },
  washSaleWindow: (value: number) => {
    if (value < 0) return 'Wash sale window must be positive';
    return null;
  },
  reinvestmentStrategy: (value: string) => {
    if (!['similar', 'different', 'cash'].includes(value)) {
      return 'Invalid reinvestment strategy';
    }
    return null;
  }
};

// Initial values
const initialValues: TaxLossHarvestingValues = {
  portfolioValue: 100000,
  taxBracket: 25,
  stateRate: 5,
  unrealizedLosses: 10000,
  holdingPeriod: 180,
  transactionCosts: 10,
  washSaleWindow: 30,
  reinvestmentStrategy: 'similar'
};

// Calculator hook
export function useTaxLossHarvesting() {
  return useCalculatorBase<TaxLossHarvestingValues, TaxLossHarvestingResult>({
    id: 'tax-loss-harvesting',
    initialValues,
    validation: validationRules,
    compute: async (values) => {
      // Calculate effective tax rate
      const effectiveTaxRate = values.taxBracket + values.stateRate;

      // Calculate potential tax savings
      const potentialTaxSavings = values.unrealizedLosses * (effectiveTaxRate / 100);

      // Calculate total transaction costs
      const totalCosts = values.transactionCosts * 2; // Buy and sell

      // Calculate net benefit
      const netBenefit = potentialTaxSavings - totalCosts;

      // Determine wash sale risk
      const washSaleRisk = determineWashSaleRisk(values);

      // Calculate optimal harvesting amount
      const optimalHarvestingAmount = calculateOptimalHarvestingAmount(values, netBenefit);

      // Generate harvesting opportunities
      const harvestingOpportunities = generateHarvestingOpportunities(values, netBenefit);

      // Determine timing recommendations
      const timing = determineTiming(values);

      // Generate recommendations
      const recommendations = generateRecommendations(values, {
        netBenefit,
        washSaleRisk,
        optimalHarvestingAmount,
        timing
      });

      return {
        potentialTaxSavings,
        netBenefit,
        totalCosts,
        washSaleRisk,
        optimalHarvestingAmount,
        recommendations,
        harvestingOpportunities,
        timing
      };
    }
  });
}

// Helper functions
function determineWashSaleRisk(values: TaxLossHarvestingValues): 'low' | 'medium' | 'high' {
  if (values.reinvestmentStrategy === 'cash') return 'low';
  if (values.reinvestmentStrategy === 'different') return 'medium';
  if (values.washSaleWindow < 30) return 'high';
  return 'medium';
}

function calculateOptimalHarvestingAmount(
  values: TaxLossHarvestingValues,
  netBenefit: number
): number {
  if (netBenefit <= 0) return 0;

  const maxHarvest = Math.min(
    values.unrealizedLosses,
    values.portfolioValue * 0.3 // Don't harvest more than 30% of portfolio
  );

  // Adjust for transaction costs
  const optimalAmount = maxHarvest - (values.transactionCosts * 2);
  return Math.max(0, optimalAmount);
}

function generateHarvestingOpportunities(
  values: TaxLossHarvestingValues,
  netBenefit: number
): Array<{ amount: number; benefit: number; risk: string }> {
  const opportunities = [];
  const effectiveTaxRate = values.taxBracket + values.stateRate;

  // Conservative harvest (33% of unrealized losses)
  const conservativeAmount = values.unrealizedLosses * 0.33;
  opportunities.push({
    amount: conservativeAmount,
    benefit: (conservativeAmount * (effectiveTaxRate / 100)) - values.transactionCosts,
    risk: 'low'
  });

  // Moderate harvest (66% of unrealized losses)
  const moderateAmount = values.unrealizedLosses * 0.66;
  opportunities.push({
    amount: moderateAmount,
    benefit: (moderateAmount * (effectiveTaxRate / 100)) - values.transactionCosts,
    risk: 'medium'
  });

  // Aggressive harvest (100% of unrealized losses)
  opportunities.push({
    amount: values.unrealizedLosses,
    benefit: netBenefit,
    risk: 'high'
  });

  return opportunities;
}

function determineTiming(values: TaxLossHarvestingValues): {
  bestTime: string;
  waitPeriod: number;
} {
  const currentDate = new Date();
  const yearEnd = new Date(currentDate.getFullYear(), 11, 31);
  const daysToYearEnd = Math.ceil(
    (yearEnd.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If close to year-end, suggest harvesting soon
  if (daysToYearEnd <= 45) {
    return {
      bestTime: 'before year-end',
      waitPeriod: 0
    };
  }

  // If holding period is short, suggest waiting
  if (values.holdingPeriod < 365) {
    const waitPeriod = 365 - values.holdingPeriod;
    return {
      bestTime: 'after long-term holding period',
      waitPeriod
    };
  }

  return {
    bestTime: 'now',
    waitPeriod: 0
  };
}

function generateRecommendations(
  values: TaxLossHarvestingValues,
  results: {
    netBenefit: number;
    washSaleRisk: 'low' | 'medium' | 'high';
    optimalHarvestingAmount: number;
    timing: { bestTime: string; waitPeriod: number };
  }
): string[] {
  const recommendations: string[] = [];

  // Net benefit recommendation
  if (results.netBenefit <= 0) {
    recommendations.push(
      'Tax-loss harvesting is not recommended at this time due to transaction costs exceeding potential tax savings.'
    );
  } else {
    recommendations.push(
      `Consider harvesting ${formatCurrency(results.optimalHarvestingAmount)} for an estimated net benefit of ${formatCurrency(results.netBenefit)}.`
    );
  }

  // Timing recommendation
  if (results.timing.waitPeriod > 0) {
    recommendations.push(
      `Wait ${results.timing.waitPeriod} days to qualify for long-term capital gains treatment.`
    );
  } else if (results.timing.bestTime === 'before year-end') {
    recommendations.push(
      'Consider harvesting losses before year-end for immediate tax benefits.'
    );
  }

  // Wash sale recommendation
  switch (results.washSaleRisk) {
    case 'high':
      recommendations.push(
        'High wash sale risk. Consider alternative investments or extending the waiting period.'
      );
      break;
    case 'medium':
      recommendations.push(
        'Monitor wash sale rules carefully when reinvesting in similar securities.'
      );
      break;
    case 'low':
      recommendations.push(
        'Low wash sale risk with current strategy. Maintain documentation of trades.'
      );
      break;
  }

  // Portfolio size recommendation
  if (values.portfolioValue < 50000) {
    recommendations.push(
      'Consider building larger portfolio before implementing tax-loss harvesting strategy.'
    );
  }

  // Transaction cost recommendation
  if (values.transactionCosts > 50) {
    recommendations.push(
      'High transaction costs. Consider a broker with lower fees to improve harvesting benefits.'
    );
  }

  return recommendations;
}

