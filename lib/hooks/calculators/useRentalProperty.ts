'use client';

import { useCalculatorBase } from '../useCalculatorBase';
import { commonValidations } from '../useCalculatorBase';
import { Decimal } from 'decimal.js';

interface RentalPropertyValues {
  // Property Information
  propertyValue: number;
  monthlyRent: number;
  parkingFees: number;
  storageFees: number;
  laundryIncome: number;

  // Operating Expenses (Monthly)
  mortgage: number;
  propertyTaxes: number;
  insurance: number;
  maintenance: number;
  utilities: number;
  propertyManagement: number;
  advertising: number;
  legal: number;
  accounting: number;
  hoaFees: number;
  capitalExpenditures: number;
  otherExpenses: number;

  // Vacancy and Market Assumptions
  vacancyRate: number;
  turnoverRate: number;

  // Investment Details
  downPayment: number;
  closingCosts: number;
  initialRepairs: number;
}

interface RentalPropertyResult {
  // Income Analysis
  grossRentalIncome: number;
  effectiveGrossIncome: number;
  totalOperatingExpenses: number;
  netOperatingIncome: number;
  cashFlow: number;

  // Investment Metrics
  capRate: number;
  cashOnCashReturn: number;
  totalInvestment: number;
  breakEvenMonths: number;

  // Risk Analysis
  debtServiceCoverageRatio: number;
  operatingExpenseRatio: number;
  vacancyLoss: number;

  // Financial Projections
  annualCashFlow: number;
  fiveYearEquityBuild: number;
  totalReturn: number;

  // Recommendations
  warnings: string[];
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
  }>;
}

export function useRentalProperty() {
  return useCalculatorBase<RentalPropertyValues, RentalPropertyResult>({
    id: 'rental-property-calculator',
    initialValues: {
      propertyValue: 350000,
      monthlyRent: 2800,
      parkingFees: 100,
      storageFees: 50,
      laundryIncome: 0,
      mortgage: 1800,
      propertyTaxes: 400,
      insurance: 150,
      maintenance: 200,
      utilities: 80,
      propertyManagement: 280,
      advertising: 50,
      legal: 30,
      accounting: 25,
      hoaFees: 0,
      capitalExpenditures: 150,
      otherExpenses: 50,
      vacancyRate: 6,
      turnoverRate: 20,
      downPayment: 70000,
      closingCosts: 8000,
      initialRepairs: 5000
    },
    validation: {
      propertyValue: [
        commonValidations.required(),
        commonValidations.min(50000),
        commonValidations.max(10000000)
      ],
      monthlyRent: [
        commonValidations.required(),
        commonValidations.min(100),
        commonValidations.max(100000)
      ],
      parkingFees: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      storageFees: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      laundryIncome: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      mortgage: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      propertyTaxes: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      insurance: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      maintenance: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      utilities: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      propertyManagement: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      advertising: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      legal: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      accounting: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      hoaFees: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      capitalExpenditures: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      otherExpenses: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      vacancyRate: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(100)
      ],
      turnoverRate: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(100)
      ],
      downPayment: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      closingCosts: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      initialRepairs: [
        commonValidations.required(),
        commonValidations.min(0)
      ]
    },
    compute: (values) => {
      // Calculate income metrics
      const monthlyIncome = calculateMonthlyIncome(values);
      const monthlyExpenses = calculateMonthlyExpenses(values);
      const operatingMetrics = calculateOperatingMetrics(values, monthlyIncome, monthlyExpenses);
      const investmentMetrics = calculateInvestmentMetrics(values, operatingMetrics);
      const riskMetrics = calculateRiskMetrics(values, operatingMetrics);
      const projections = calculateProjections(values, operatingMetrics);
      const analysis = analyzeInvestment(values, operatingMetrics, investmentMetrics, riskMetrics);

      return {
        ...operatingMetrics,
        ...investmentMetrics,
        ...riskMetrics,
        ...projections,
        ...analysis
      };
    }
  });
}

// Helper functions
function calculateMonthlyIncome(values: RentalPropertyValues) {
  const potentialRentalIncome = new Decimal(values.monthlyRent)
    .plus(values.parkingFees)
    .plus(values.storageFees)
    .plus(values.laundryIncome);

  const vacancyLoss = potentialRentalIncome
    .times(values.vacancyRate)
    .div(100);

  return {
    grossRentalIncome: potentialRentalIncome.toNumber(),
    effectiveGrossIncome: potentialRentalIncome.minus(vacancyLoss).toNumber(),
    vacancyLoss: vacancyLoss.toNumber()
  };
}

function calculateMonthlyExpenses(values: RentalPropertyValues) {
  const operatingExpenses = new Decimal(values.propertyTaxes)
    .plus(values.insurance)
    .plus(values.maintenance)
    .plus(values.utilities)
    .plus(values.propertyManagement)
    .plus(values.advertising)
    .plus(values.legal)
    .plus(values.accounting)
    .plus(values.hoaFees)
    .plus(values.capitalExpenditures)
    .plus(values.otherExpenses);

  return {
    operatingExpenses: operatingExpenses.toNumber(),
    totalExpenses: operatingExpenses.plus(values.mortgage).toNumber()
  };
}

function calculateOperatingMetrics(
  values: RentalPropertyValues,
  income: ReturnType<typeof calculateMonthlyIncome>,
  expenses: ReturnType<typeof calculateMonthlyExpenses>
) {
  const netOperatingIncome = new Decimal(income.effectiveGrossIncome)
    .minus(expenses.operatingExpenses);

  const cashFlow = netOperatingIncome.minus(values.mortgage);

  return {
    grossRentalIncome: income.grossRentalIncome,
    effectiveGrossIncome: income.effectiveGrossIncome,
    totalOperatingExpenses: expenses.operatingExpenses,
    netOperatingIncome: netOperatingIncome.toNumber(),
    cashFlow: cashFlow.toNumber()
  };
}

function calculateInvestmentMetrics(
  values: RentalPropertyValues,
  operatingMetrics: ReturnType<typeof calculateOperatingMetrics>
) {
  const totalInvestment = new Decimal(values.downPayment)
    .plus(values.closingCosts)
    .plus(values.initialRepairs);

  const annualNOI = new Decimal(operatingMetrics.netOperatingIncome).times(12);
  const capRate = annualNOI.div(values.propertyValue).times(100);

  const annualCashFlow = new Decimal(operatingMetrics.cashFlow).times(12);
  const cashOnCashReturn = annualCashFlow.div(totalInvestment).times(100);

  const monthlyProfit = new Decimal(operatingMetrics.cashFlow);
  const breakEvenMonths = totalInvestment.div(monthlyProfit).ceil();

  return {
    capRate: capRate.toNumber(),
    cashOnCashReturn: cashOnCashReturn.toNumber(),
    totalInvestment: totalInvestment.toNumber(),
    breakEvenMonths: breakEvenMonths.toNumber()
  };
}

function calculateRiskMetrics(
  values: RentalPropertyValues,
  operatingMetrics: ReturnType<typeof calculateOperatingMetrics>
) {
  const annualNOI = new Decimal(operatingMetrics.netOperatingIncome).times(12);
  const annualDebtService = new Decimal(values.mortgage).times(12);
  const debtServiceCoverageRatio = annualNOI.div(annualDebtService);

  const operatingExpenseRatio = new Decimal(operatingMetrics.totalOperatingExpenses)
    .div(operatingMetrics.effectiveGrossIncome)
    .times(100);

  return {
    debtServiceCoverageRatio: debtServiceCoverageRatio.toNumber(),
    operatingExpenseRatio: operatingExpenseRatio.toNumber(),
    vacancyLoss: new Decimal(operatingMetrics.grossRentalIncome)
      .minus(operatingMetrics.effectiveGrossIncome)
      .toNumber()
  };
}

function calculateProjections(
  values: RentalPropertyValues,
  operatingMetrics: ReturnType<typeof calculateOperatingMetrics>
) {
  const annualCashFlow = new Decimal(operatingMetrics.cashFlow).times(12);
  
  // Assume 3% annual appreciation and mortgage paydown
  const annualAppreciation = new Decimal(values.propertyValue).times(0.03);
  const annualMortgagePaydown = new Decimal(values.mortgage).times(0.2).times(12); // ~20% of payment to principal
  const fiveYearEquityBuild = annualAppreciation.plus(annualMortgagePaydown).times(5);

  const totalReturn = annualCashFlow.plus(annualAppreciation).plus(annualMortgagePaydown)
    .div(new Decimal(values.downPayment).plus(values.closingCosts).plus(values.initialRepairs))
    .times(100);

  return {
    annualCashFlow: annualCashFlow.toNumber(),
    fiveYearEquityBuild: fiveYearEquityBuild.toNumber(),
    totalReturn: totalReturn.toNumber()
  };
}

function analyzeInvestment(
  values: RentalPropertyValues,
  operatingMetrics: ReturnType<typeof calculateOperatingMetrics>,
  investmentMetrics: ReturnType<typeof calculateInvestmentMetrics>,
  riskMetrics: ReturnType<typeof calculateRiskMetrics>
) {
  const warnings: string[] = [];
  const insights: Array<{ type: 'success' | 'warning' | 'info'; message: string }> = [];

  // Cash flow analysis
  if (operatingMetrics.cashFlow < 0) {
    warnings.push('Property is cash flow negative');
    insights.push({
      type: 'warning',
      message: 'Monthly cash flow is negative, consider adjusting rent or reducing expenses'
    });
  } else if (operatingMetrics.cashFlow < 200) {
    insights.push({
      type: 'info',
      message: 'Cash flow is positive but thin, monitor expenses carefully'
    });
  }

  // Debt service coverage
  if (riskMetrics.debtServiceCoverageRatio < 1.25) {
    warnings.push('Low debt service coverage ratio');
    insights.push({
      type: 'warning',
      message: 'Debt service coverage ratio is below recommended 1.25x'
    });
  }

  // Operating expense ratio
  if (riskMetrics.operatingExpenseRatio > 50) {
    insights.push({
      type: 'warning',
      message: 'Operating expenses are high relative to income'
    });
  }

  // Vacancy rate
  if (values.vacancyRate > 8) {
    insights.push({
      type: 'info',
      message: 'Vacancy rate assumption may be conservative'
    });
  }

  // Return metrics
  if (investmentMetrics.capRate < 5) {
    insights.push({
      type: 'warning',
      message: 'Cap rate is below market average, property may be overpriced'
    });
  }

  if (investmentMetrics.cashOnCashReturn > 12) {
    insights.push({
      type: 'success',
      message: 'Strong cash-on-cash return indicates good investment potential'
    });
  }

  return {
    warnings,
    insights
  };
}

