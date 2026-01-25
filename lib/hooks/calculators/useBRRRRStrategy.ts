'use client';

import { useCalculatorBase } from '../useCalculatorBase';
import Decimal from 'decimal.js';

// Types
interface BRRRRValues {
  // Buy Phase
  purchasePrice: number;
  downPayment: number;
  closingCosts: number;
  initialLoanRate: number;
  initialLoanTerm: number;

  // Rehab Phase
  rehabCosts: number;
  rehabTimeframe: number;
  contingencyPercentage: number;
  holdingCosts: {
    insurance: number;
    taxes: number;
    utilities: number;
    loanPayments: number;
  };

  // Rent Phase
  expectedRent: number;
  vacancyRate: number;
  propertyManagementFee: number;
  maintenancePercentage: number;
  annualExpenses: {
    insurance: number;
    taxes: number;
    utilities: number;
    hoa?: number;
  };

  // Refinance Phase
  afterRepairValue: number;
  refinanceLTV: number;
  refinanceRate: number;
  refinanceTerm: number;
  refinanceCosts: number;

  // Market Assumptions
  annualAppreciation: number;
  annualRentIncrease: number;
  inflationRate: number;
}

interface BRRRRResult {
  // Initial Investment Analysis
  initialInvestment: {
    totalCosts: number;
    cashRequired: number;
    loanAmount: number;
    initialEquity: number;
  };

  // Rehab Analysis
  rehabAnalysis: {
    totalRehabCosts: number;
    contingencyAmount: number;
    totalHoldingCosts: number;
    projectedTimelineImpact: number;
  };

  // Rental Analysis
  rentalAnalysis: {
    grossRent: number;
    operatingExpenses: number;
    netOperatingIncome: number;
    cashFlow: {
      monthly: number;
      annual: number;
    };
    metrics: {
      capRate: number;
      cashOnCashReturn: number;
      rentToValue: number;
      operatingExpenseRatio: number;
      debtServiceCoverageRatio: number;
    };
  };

  // Refinance Analysis
  refinanceAnalysis: {
    newLoanAmount: number;
    newMonthlyPayment: number;
    cashOutAmount: number;
    equityAfterRefinance: number;
    breakEvenAnalysis: {
      monthsToBreakEven: number;
      returnOnInvestment: number;
    };
  };

  // Long-term Projections
  projections: Array<{
    year: number;
    propertyValue: number;
    equity: number;
    netOperatingIncome: number;
    cashFlow: number;
    totalReturn: number;
  }>;

  // Risk Analysis
  riskAnalysis: {
    score: number;
    factors: Array<{
      factor: string;
      risk: 'low' | 'moderate' | 'high';
      impact: string;
    }>;
    stressTests: {
      vacancyIncrease: number;
      rentDecrease: number;
      expenseIncrease: number;
      valueDecrease: number;
    };
  };

  // Strategy Viability
  viabilityAnalysis: {
    viable: boolean;
    score: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

// Validation rules
const validationRules = {
  purchasePrice: (value: number) => {
    if (value <= 0) return 'Purchase price must be positive';
    if (value > 10000000) return 'Purchase price exceeds maximum limit';
    return null;
  },
  downPayment: (value: number, values: BRRRRValues) => {
    if (value <= 0) return 'Down payment must be positive';
    if (value > values.purchasePrice) return 'Down payment cannot exceed purchase price';
    const percentage = (value / values.purchasePrice) * 100;
    if (percentage < 15) return 'Down payment should be at least 15% for BRRRR strategy';
    return null;
  },
  closingCosts: (value: number, values: BRRRRValues) => {
    if (value < 0) return 'Closing costs cannot be negative';
    if (value > values.purchasePrice * 0.1) return 'Closing costs seem unusually high';
    return null;
  },
  initialLoanRate: (value: number) => {
    if (value < 0) return 'Loan rate cannot be negative';
    if (value > 25) return 'Loan rate seems unusually high';
    return null;
  },
  initialLoanTerm: (value: number) => {
    if (value < 1) return 'Loan term must be at least 1 year';
    if (value > 30) return 'Loan term cannot exceed 30 years';
    return null;
  },
  rehabCosts: (value: number, values: BRRRRValues) => {
    if (value < 0) return 'Rehab costs cannot be negative';
    if (value > values.purchasePrice * 2) return 'Rehab costs seem unusually high';
    return null;
  },
  rehabTimeframe: (value: number) => {
    if (value < 1) return 'Rehab timeframe must be at least 1 month';
    if (value > 24) return 'Rehab timeframe seems unusually long';
    return null;
  },
  contingencyPercentage: (value: number) => {
    if (value < 0) return 'Contingency percentage cannot be negative';
    if (value > 50) return 'Contingency percentage seems unusually high';
    return null;
  },
  expectedRent: (value: number, values: BRRRRValues) => {
    if (value < 0) return 'Expected rent cannot be negative';
    const monthlyMortgage = calculateMonthlyMortgage(
      values.purchasePrice - values.downPayment,
      values.initialLoanRate,
      values.initialLoanTerm
    );
    if (value < monthlyMortgage) {
      return 'Expected rent should cover monthly mortgage payment';
    }
    return null;
  },
  vacancyRate: (value: number) => {
    if (value < 0) return 'Vacancy rate cannot be negative';
    if (value > 25) return 'Vacancy rate seems unusually high';
    return null;
  },
  propertyManagementFee: (value: number) => {
    if (value < 0) return 'Property management fee cannot be negative';
    if (value > 15) return 'Property management fee seems unusually high';
    return null;
  },
  maintenancePercentage: (value: number) => {
    if (value < 0) return 'Maintenance percentage cannot be negative';
    if (value > 15) return 'Maintenance percentage seems unusually high';
    return null;
  },
  afterRepairValue: (value: number, values: BRRRRValues) => {
    if (value <= values.purchasePrice) {
      return 'After repair value should be higher than purchase price';
    }
    if (value > values.purchasePrice * 3) {
      return 'After repair value seems unusually high';
    }
    return null;
  },
  refinanceLTV: (value: number) => {
    if (value < 50) return 'Refinance LTV seems unusually low';
    if (value > 85) return 'Refinance LTV seems unusually high';
    return null;
  },
  refinanceRate: (value: number) => {
    if (value < 0) return 'Refinance rate cannot be negative';
    if (value > 15) return 'Refinance rate seems unusually high';
    return null;
  },
  refinanceTerm: (value: number) => {
    if (value < 1) return 'Refinance term must be at least 1 year';
    if (value > 30) return 'Refinance term cannot exceed 30 years';
    return null;
  },
  refinanceCosts: (value: number, values: BRRRRValues) => {
    if (value < 0) return 'Refinance costs cannot be negative';
    if (value > values.afterRepairValue * 0.1) {
      return 'Refinance costs seem unusually high';
    }
    return null;
  },
  annualAppreciation: (value: number) => {
    if (value < -5) return 'Annual appreciation seems unusually low';
    if (value > 15) return 'Annual appreciation seems unusually high';
    return null;
  },
  annualRentIncrease: (value: number) => {
    if (value < 0) return 'Annual rent increase cannot be negative';
    if (value > 10) return 'Annual rent increase seems unusually high';
    return null;
  }
};

// Initial values
const initialValues: BRRRRValues = {
  purchasePrice: 200000,
  downPayment: 40000,
  closingCosts: 5000,
  initialLoanRate: 6,
  initialLoanTerm: 30,
  rehabCosts: 50000,
  rehabTimeframe: 3,
  contingencyPercentage: 10,
  holdingCosts: {
    insurance: 100,
    taxes: 200,
    utilities: 150,
    loanPayments: 1200
  },
  expectedRent: 2500,
  vacancyRate: 5,
  propertyManagementFee: 8,
  maintenancePercentage: 5,
  annualExpenses: {
    insurance: 1200,
    taxes: 2400,
    utilities: 1800
  },
  afterRepairValue: 300000,
  refinanceLTV: 75,
  refinanceRate: 4.5,
  refinanceTerm: 30,
  refinanceCosts: 4000,
  annualAppreciation: 3,
  annualRentIncrease: 2,
  inflationRate: 2
};

// Calculator hook
export function useBRRRRStrategy() {
  return useCalculatorBase<BRRRRValues, BRRRRResult>({
    id: 'brrrr-strategy',
    initialValues,
    validation: validationRules,
    compute: async (values) => {
      // Calculate initial investment analysis
      const initialInvestment = calculateInitialInvestment(values);

      // Calculate rehab analysis
      const rehabAnalysis = calculateRehabAnalysis(values);

      // Calculate rental analysis
      const rentalAnalysis = calculateRentalAnalysis(values);

      // Calculate refinance analysis
      const refinanceAnalysis = calculateRefinanceAnalysis(values);

      // Generate projections
      const projections = generateProjections(values, {
        initialInvestment,
        rentalAnalysis,
        refinanceAnalysis
      });

      // Perform risk analysis
      const riskAnalysis = analyzeRisks(values, {
        initialInvestment,
        rentalAnalysis,
        refinanceAnalysis
      });

      // Analyze strategy viability
      const viabilityAnalysis = analyzeViability(values, {
        initialInvestment,
        rehabAnalysis,
        rentalAnalysis,
        refinanceAnalysis,
        riskAnalysis
      });

      return {
        initialInvestment,
        rehabAnalysis,
        rentalAnalysis,
        refinanceAnalysis,
        projections,
        riskAnalysis,
        viabilityAnalysis
      };
    }
  });
}

// Helper functions
function calculateMonthlyMortgage(
  loanAmount: number,
  annualRate: number,
  termYears: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = termYears * 12;
  return (
    loanAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1)
  );
}

function calculateInitialInvestment(values: BRRRRValues) {
  const loanAmount = values.purchasePrice - values.downPayment;
  const totalCosts = values.purchasePrice + values.closingCosts;
  const cashRequired = values.downPayment + values.closingCosts;
  const initialEquity = values.purchasePrice - loanAmount;

  return {
    totalCosts,
    cashRequired,
    loanAmount,
    initialEquity
  };
}

function calculateRehabAnalysis(values: BRRRRValues) {
  const contingencyAmount = values.rehabCosts * (values.contingencyPercentage / 100);
  const totalRehabCosts = values.rehabCosts + contingencyAmount;
  const totalHoldingCosts = Object.values(values.holdingCosts).reduce((a, b) => a + b, 0) * values.rehabTimeframe;
  const projectedTimelineImpact = values.rehabTimeframe;

  return {
    totalRehabCosts,
    contingencyAmount,
    totalHoldingCosts,
    projectedTimelineImpact
  };
}

function calculateRentalAnalysis(values: BRRRRValues) {
  const grossRent = values.expectedRent * 12;
  const vacancyLoss = grossRent * (values.vacancyRate / 100);
  const managementFee = (grossRent - vacancyLoss) * (values.propertyManagementFee / 100);
  const maintenanceCost = grossRent * (values.maintenancePercentage / 100);
  const annualExpenses = Object.values(values.annualExpenses).reduce((a, b) => a + b, 0) +
    managementFee + maintenanceCost;

  const netOperatingIncome = grossRent - vacancyLoss - annualExpenses;
  const monthlyMortgage = calculateMonthlyMortgage(
    values.purchasePrice - values.downPayment,
    values.initialLoanRate,
    values.initialLoanTerm
  );

  const cashFlow = {
    monthly: (netOperatingIncome / 12) - monthlyMortgage,
    annual: netOperatingIncome - (monthlyMortgage * 12)
  };

  const metrics = {
    capRate: (netOperatingIncome / values.purchasePrice) * 100,
    cashOnCashReturn: (cashFlow.annual / values.downPayment) * 100,
    rentToValue: (grossRent / values.purchasePrice) * 100,
    operatingExpenseRatio: (annualExpenses / grossRent) * 100,
    debtServiceCoverageRatio: netOperatingIncome / (monthlyMortgage * 12)
  };

  return {
    grossRent,
    operatingExpenses: annualExpenses,
    netOperatingIncome,
    cashFlow,
    metrics
  };
}

function calculateRefinanceAnalysis(values: BRRRRValues) {
  const newLoanAmount = values.afterRepairValue * (values.refinanceLTV / 100);
  const newMonthlyPayment = calculateMonthlyMortgage(
    newLoanAmount,
    values.refinanceRate,
    values.refinanceTerm
  );

  const initialInvestment = values.downPayment + values.closingCosts + values.rehabCosts;
  const cashOutAmount = newLoanAmount - (values.purchasePrice - values.downPayment);
  const equityAfterRefinance = values.afterRepairValue - newLoanAmount;

  const monthlyNetIncome = (values.expectedRent * (1 - values.vacancyRate / 100)) -
    (Object.values(values.annualExpenses).reduce((a, b) => a + b, 0) / 12) -
    newMonthlyPayment;

  const breakEvenAnalysis = {
    monthsToBreakEven: Math.ceil(initialInvestment / monthlyNetIncome),
    returnOnInvestment: (monthlyNetIncome * 12 / initialInvestment) * 100
  };

  return {
    newLoanAmount,
    newMonthlyPayment,
    cashOutAmount,
    equityAfterRefinance,
    breakEvenAnalysis
  };
}

function generateProjections(
  values: BRRRRValues,
  analysis: {
    initialInvestment: ReturnType<typeof calculateInitialInvestment>;
    rentalAnalysis: ReturnType<typeof calculateRentalAnalysis>;
    refinanceAnalysis: ReturnType<typeof calculateRefinanceAnalysis>;
  }
): BRRRRResult['projections'] {
  const projections = [];
  let currentValue = values.afterRepairValue;
  let currentRent = values.expectedRent;
  let currentNOI = analysis.rentalAnalysis.netOperatingIncome;
  let currentEquity = analysis.refinanceAnalysis.equityAfterRefinance;
  let totalReturn = 0;

  for (let year = 1; year <= 10; year++) {
    // Update values for the year
    currentValue *= (1 + values.annualAppreciation / 100);
    currentRent *= (1 + values.annualRentIncrease / 100);
    currentNOI *= (1 + (values.annualRentIncrease - values.inflationRate) / 100);
    currentEquity = currentValue - analysis.refinanceAnalysis.newLoanAmount;

    const yearlyReturn = currentNOI + (currentValue - values.afterRepairValue) / year;
    totalReturn = (yearlyReturn / analysis.initialInvestment.cashRequired) * 100;

    projections.push({
      year,
      propertyValue: currentValue,
      equity: currentEquity,
      netOperatingIncome: currentNOI,
      cashFlow: currentNOI - (analysis.refinanceAnalysis.newMonthlyPayment * 12),
      totalReturn
    });
  }

  return projections;
}

function analyzeRisks(
  values: BRRRRValues,
  analysis: {
    initialInvestment: ReturnType<typeof calculateInitialInvestment>;
    rentalAnalysis: ReturnType<typeof calculateRentalAnalysis>;
    refinanceAnalysis: ReturnType<typeof calculateRefinanceAnalysis>;
  }
): BRRRRResult['riskAnalysis'] {
  let riskScore = 0;
  const riskFactors = [];

  // Analyze rehab risk
  const rehabToValueRatio = values.rehabCosts / values.purchasePrice;
  if (rehabToValueRatio > 0.5) {
    riskScore += 30;
    riskFactors.push({
      factor: 'High Rehab Costs',
      risk: 'high',
      impact: 'Significant rehab costs increase project risk'
    });
  }

  // Analyze refinance risk
  const ltvRisk = values.refinanceLTV > 75;
  if (ltvRisk) {
    riskScore += 20;
    riskFactors.push({
      factor: 'High Refinance LTV',
      risk: 'moderate',
      impact: 'Higher LTV reduces refinancing options'
    });
  }

  // Analyze cash flow risk
  const dscr = analysis.rentalAnalysis.metrics.debtServiceCoverageRatio;
  if (dscr < 1.25) {
    riskScore += 25;
    riskFactors.push({
      factor: 'Low DSCR',
      risk: 'high',
      impact: 'Limited cash flow coverage of debt service'
    });
  }

  // Analyze market risk
  if (values.annualAppreciation > 5) {
    riskScore += 15;
    riskFactors.push({
      factor: 'High Appreciation Assumption',
      risk: 'moderate',
      impact: 'Aggressive market growth assumptions'
    });
  }

  // Perform stress tests
  const stressTests = {
    vacancyIncrease: analysis.rentalAnalysis.cashFlow.annual * 0.8, // 20% higher vacancy
    rentDecrease: analysis.rentalAnalysis.cashFlow.annual * 0.9, // 10% lower rent
    expenseIncrease: analysis.rentalAnalysis.cashFlow.annual * 0.85, // 15% higher expenses
    valueDecrease: values.afterRepairValue * 0.9 // 10% lower ARV
  };

  return {
    score: riskScore,
    factors: riskFactors,
    stressTests
  };
}

function analyzeViability(
  values: BRRRRValues,
  analysis: {
    initialInvestment: ReturnType<typeof calculateInitialInvestment>;
    rehabAnalysis: ReturnType<typeof calculateRehabAnalysis>;
    rentalAnalysis: ReturnType<typeof calculateRentalAnalysis>;
    refinanceAnalysis: ReturnType<typeof calculateRefinanceAnalysis>;
    riskAnalysis: BRRRRResult['riskAnalysis'];
  }
): BRRRRResult['viabilityAnalysis'] {
  let viabilityScore = 100;
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  // Analyze cash-out potential
  const cashOutRatio = analysis.refinanceAnalysis.cashOutAmount / analysis.initialInvestment.cashRequired;
  if (cashOutRatio > 0.8) {
    viabilityScore += 10;
    strengths.push('Strong cash-out potential');
  } else if (cashOutRatio < 0.5) {
    viabilityScore -= 10;
    weaknesses.push('Limited cash-out potential');
    recommendations.push('Consider properties with better cash-out potential');
  }

  // Analyze cash flow
  const cashFlowYield = (analysis.rentalAnalysis.cashFlow.annual / analysis.initialInvestment.cashRequired) * 100;
  if (cashFlowYield > 8) {
    viabilityScore += 15;
    strengths.push('Strong cash flow yield');
  } else if (cashFlowYield < 5) {
    viabilityScore -= 15;
    weaknesses.push('Low cash flow yield');
    recommendations.push('Look for properties with better cash flow potential');
  }

  // Analyze rehab scope
  const rehabRatio = values.rehabCosts / values.purchasePrice;
  if (rehabRatio < 0.3) {
    viabilityScore += 10;
    strengths.push('Manageable rehab scope');
  } else if (rehabRatio > 0.5) {
    viabilityScore -= 10;
    weaknesses.push('Extensive rehab requirements');
    recommendations.push('Consider properties with less intensive rehab needs');
  }

  // Analyze refinance terms
  if (values.refinanceRate < 5 && values.refinanceLTV >= 75) {
    viabilityScore += 10;
    strengths.push('Favorable refinance terms');
  } else if (values.refinanceRate > 6 || values.refinanceLTV < 70) {
    viabilityScore -= 10;
    weaknesses.push('Suboptimal refinance terms');
    recommendations.push('Shop around for better refinance terms');
  }

  // Consider risk score
  if (analysis.riskAnalysis.score > 50) {
    viabilityScore -= 20;
    weaknesses.push('High risk profile');
    recommendations.push('Consider risk mitigation strategies');
  }

  // Add general recommendations
  if (analysis.rentalAnalysis.metrics.operatingExpenseRatio > 45) {
    recommendations.push('Look for ways to reduce operating expenses');
  }
  if (analysis.refinanceAnalysis.breakEvenAnalysis.monthsToBreakEven > 36) {
    recommendations.push('Consider strategies to improve breakeven timeline');
  }

  return {
    viable: viabilityScore >= 70,
    score: viabilityScore,
    strengths,
    weaknesses,
    recommendations
  };
}

