'use client';

import { useCalculatorBase } from '../useCalculatorBase';
import { commonValidations } from '../useCalculatorBase';
import { Decimal } from 'decimal.js';

interface PortfolioValues {
  // Portfolio Composition
  totalValue: number;
  cashAllocation: number;
  bondAllocation: number;
  stockAllocation: number;
  realEstateAllocation: number;
  alternativeAllocation: number;

  // Risk Profile
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentTimeframe: number;
  incomeRequirement: number;

  // Investment Details
  averageExpenseRatio: number;
  rebalanceFrequency: 'quarterly' | 'semi-annually' | 'annually';
  taxBracket: number;

  // Market Assumptions
  expectedInflation: number;
  expectedVolatility: number;
}

interface PortfolioResult {
  // Portfolio Analysis
  totalAllocation: number;
  effectiveExpenseRatio: number;
  projectedReturns: {
    conservative: number;
    expected: number;
    optimistic: number;
  };
  riskMetrics: {
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  diversificationScore: number;

  // Recommendations
  rebalancingNeeded: boolean;
  suggestedChanges: Array<{
    assetClass: string;
    currentAllocation: number;
    targetAllocation: number;
    action: 'increase' | 'decrease';
    amount: number;
  }>;
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
  }>;
}

export function usePortfolioAnalyzer() {
  return useCalculatorBase<PortfolioValues, PortfolioResult>({
    id: 'portfolio-analyzer',
    initialValues: {
      totalValue: 100000,
      cashAllocation: 5,
      bondAllocation: 30,
      stockAllocation: 50,
      realEstateAllocation: 10,
      alternativeAllocation: 5,
      riskTolerance: 'moderate',
      investmentTimeframe: 10,
      incomeRequirement: 4,
      averageExpenseRatio: 0.25,
      rebalanceFrequency: 'annually',
      taxBracket: 25,
      expectedInflation: 2.5,
      expectedVolatility: 15
    },
    validation: {
      totalValue: [
        commonValidations.required(),
        commonValidations.min(1000),
        commonValidations.max(1000000000)
      ],
      cashAllocation: [
        commonValidations.required(),
        commonValidations.percentage()
      ],
      bondAllocation: [
        commonValidations.required(),
        commonValidations.percentage()
      ],
      stockAllocation: [
        commonValidations.required(),
        commonValidations.percentage()
      ],
      realEstateAllocation: [
        commonValidations.required(),
        commonValidations.percentage()
      ],
      alternativeAllocation: [
        commonValidations.required(),
        commonValidations.percentage()
      ],
      investmentTimeframe: [
        commonValidations.required(),
        commonValidations.min(1),
        commonValidations.max(50)
      ],
      incomeRequirement: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(20)
      ],
      averageExpenseRatio: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(3)
      ],
      taxBracket: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(50)
      ],
      expectedInflation: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(10)
      ],
      expectedVolatility: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(50)
      ]
    },
    compute: (values) => {
      // Calculate total allocation
      const totalAllocation = new Decimal(values.cashAllocation)
        .plus(values.bondAllocation)
        .plus(values.stockAllocation)
        .plus(values.realEstateAllocation)
        .plus(values.alternativeAllocation)
        .toNumber();

      // Calculate effective expense ratio based on allocation weights
      const effectiveExpenseRatio = new Decimal(values.averageExpenseRatio)
        .times(values.stockAllocation + values.bondAllocation + values.alternativeAllocation)
        .div(100)
        .toNumber();

      // Calculate projected returns based on asset allocation and risk tolerance
      const returns = calculateProjectedReturns(values);
      const riskMetrics = calculateRiskMetrics(values);
      const diversificationScore = calculateDiversificationScore(values);
      const { rebalancingNeeded, suggestedChanges } = analyzeRebalancingNeeds(values);
      const insights = generateInsights(values, totalAllocation, effectiveExpenseRatio);

      return {
        totalAllocation,
        effectiveExpenseRatio,
        projectedReturns: returns,
        riskMetrics,
        diversificationScore,
        rebalancingNeeded,
        suggestedChanges,
        insights
      };
    }
  });
}

// Helper functions
function calculateProjectedReturns(values: PortfolioValues) {
  // Base return assumptions
  const baseReturns = {
    cash: 2,
    bonds: 4,
    stocks: 8,
    realEstate: 7,
    alternatives: 6
  };

  // Risk adjustments
  const riskAdjustments = {
    conservative: 0.8,
    moderate: 1.0,
    aggressive: 1.2
  };

  // Calculate weighted average return
  const weightedReturn = new Decimal(values.cashAllocation).times(baseReturns.cash)
    .plus(new Decimal(values.bondAllocation).times(baseReturns.bonds))
    .plus(new Decimal(values.stockAllocation).times(baseReturns.stocks))
    .plus(new Decimal(values.realEstateAllocation).times(baseReturns.realEstate))
    .plus(new Decimal(values.alternativeAllocation).times(baseReturns.alternatives))
    .div(100)
    .toNumber();

  // Adjust for risk tolerance
  const riskAdjustment = riskAdjustments[values.riskTolerance];
  const expectedReturn = new Decimal(weightedReturn).times(riskAdjustment).toNumber();

  return {
    conservative: new Decimal(expectedReturn).times(0.7).toNumber(),
    expected: expectedReturn,
    optimistic: new Decimal(expectedReturn).times(1.3).toNumber()
  };
}

function calculateRiskMetrics(values: PortfolioValues) {
  // Simplified risk calculations
  const volatility = new Decimal(values.expectedVolatility)
    .times(values.stockAllocation + values.alternativeAllocation)
    .div(100)
    .toNumber();

  const riskFreeRate = 2; // Assume 2% risk-free rate
  const expectedReturn = calculateProjectedReturns(values).expected;
  const sharpeRatio = new Decimal(expectedReturn - riskFreeRate)
    .div(volatility)
    .toNumber();

  const maxDrawdown = new Decimal(volatility)
    .times(1.5) // Typical relationship between volatility and max drawdown
    .toNumber();

  return {
    volatility,
    sharpeRatio,
    maxDrawdown
  };
}

function calculateDiversificationScore(values: PortfolioValues) {
  // Calculate Herfindahl-Hirschman Index (HHI)
  const hhi = new Decimal(values.cashAllocation).pow(2)
    .plus(new Decimal(values.bondAllocation).pow(2))
    .plus(new Decimal(values.stockAllocation).pow(2))
    .plus(new Decimal(values.realEstateAllocation).pow(2))
    .plus(new Decimal(values.alternativeAllocation).pow(2))
    .div(100)
    .toNumber();

  // Convert HHI to a 0-100 score where 100 is perfectly diversified
  return Math.max(0, Math.min(100, (10000 - hhi) / 80));
}

function analyzeRebalancingNeeds(values: PortfolioValues) {
  // Target allocations based on risk tolerance
  const targets = getTargetAllocations(values.riskTolerance);
  const threshold = 5; // 5% deviation threshold for rebalancing

  const suggestedChanges = [];
  let rebalancingNeeded = false;

  // Check each asset class
  const assetClasses = [
    { name: 'Cash', current: values.cashAllocation, target: targets.cash },
    { name: 'Bonds', current: values.bondAllocation, target: targets.bonds },
    { name: 'Stocks', current: values.stockAllocation, target: targets.stocks },
    { name: 'Real Estate', current: values.realEstateAllocation, target: targets.realEstate },
    { name: 'Alternatives', current: values.alternativeAllocation, target: targets.alternatives }
  ];

  for (const asset of assetClasses) {
    const deviation = asset.current - asset.target;
    if (Math.abs(deviation) > threshold) {
      rebalancingNeeded = true;
      suggestedChanges.push({
        assetClass: asset.name,
        currentAllocation: asset.current,
        targetAllocation: asset.target,
        action: deviation > 0 ? 'decrease' : 'increase',
        amount: Math.abs(deviation)
      });
    }
  }

  return { rebalancingNeeded, suggestedChanges };
}

function getTargetAllocations(riskTolerance: 'conservative' | 'moderate' | 'aggressive') {
  switch (riskTolerance) {
    case 'conservative':
      return {
        cash: 10,
        bonds: 50,
        stocks: 25,
        realEstate: 10,
        alternatives: 5
      };
    case 'aggressive':
      return {
        cash: 5,
        bonds: 15,
        stocks: 60,
        realEstate: 15,
        alternatives: 5
      };
    default: // moderate
      return {
        cash: 5,
        bonds: 30,
        stocks: 50,
        realEstate: 10,
        alternatives: 5
      };
  }
}

function generateInsights(
  values: PortfolioValues,
  totalAllocation: number,
  effectiveExpenseRatio: number
) {
  const insights: Array<{ type: 'success' | 'warning' | 'info'; message: string }> = [];

  // Check total allocation
  if (totalAllocation !== 100) {
    insights.push({
      type: 'warning',
      message: `Total allocation (${totalAllocation}%) should equal 100%`
    });
  }

  // Check expense ratio
  if (effectiveExpenseRatio > 0.5) {
    insights.push({
      type: 'warning',
      message: 'Consider lower-cost investment options to reduce expenses'
    });
  }

  // Check diversification
  if (values.stockAllocation > 70) {
    insights.push({
      type: 'warning',
      message: 'High stock allocation may increase portfolio volatility'
    });
  }

  if (values.cashAllocation > 20) {
    insights.push({
      type: 'info',
      message: 'High cash allocation may drag on long-term returns'
    });
  }

  // Check time horizon alignment
  if (values.riskTolerance === 'aggressive' && values.investmentTimeframe < 5) {
    insights.push({
      type: 'warning',
      message: 'Aggressive allocation may be unsuitable for short time horizon'
    });
  }

  if (values.riskTolerance === 'conservative' && values.investmentTimeframe > 20) {
    insights.push({
      type: 'info',
      message: 'Consider more growth-oriented allocation for long time horizon'
    });
  }

  return insights;
}

