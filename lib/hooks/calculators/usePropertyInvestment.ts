import { useCalculatorBase } from '../useCalculatorBase';
import { commonValidations } from '../useCalculatorBase';
import { Decimal } from 'decimal.js';

interface PropertyInvestmentValues {
  // Property Details
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  closingCosts: number;
  rehabCosts: number;

  // Income
  monthlyRent: number;
  vacancyRate: number;
  otherIncome: number;

  // Operating Expenses
  propertyTaxes: number;
  insurance: number;
  maintenance: number;
  propertyManagement: number;
  utilities: number;
  hoaFees: number;
  otherExpenses: number;

  // Market Assumptions
  rentGrowthRate: number;
  propertyAppreciationRate: number;
  expenseGrowthRate: number;
}

interface PropertyInvestmentResult {
  // Loan Analysis
  loanAmount: number;
  downPayment: number;
  totalInvestment: number;
  monthlyMortgage: number;

  // Income Analysis
  effectiveGrossIncome: number;
  totalOperatingExpenses: number;
  netOperatingIncome: number;
  cashFlow: number;

  // Investment Metrics
  capRate: number;
  cashOnCashReturn: number;
  returnOnInvestment: number;
  breakEvenPoint: number;

  // 5-Year Projections
  fiveYearProjections: Array<{
    year: number;
    propertyValue: number;
    netIncome: number;
    equity: number;
    roi: number;
  }>;

  // Risk Analysis
  debtServiceCoverageRatio: number;
  operatingExpenseRatio: number;
  priceToRentRatio: number;

  recommendations: string[];
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
  }>;
}

export function usePropertyInvestment() {
  return useCalculatorBase<PropertyInvestmentValues, PropertyInvestmentResult>({
    id: 'property-investment-analyzer',
    initialValues: {
      purchasePrice: 300000,
      downPaymentPercent: 20,
      interestRate: 7.0,
      loanTerm: 30,
      closingCosts: 8000,
      rehabCosts: 0,
      monthlyRent: 2500,
      vacancyRate: 5,
      otherIncome: 0,
      propertyTaxes: 3600,
      insurance: 1200,
      maintenance: 1800,
      propertyManagement: 0,
      utilities: 0,
      hoaFees: 0,
      otherExpenses: 600,
      rentGrowthRate: 3.0,
      propertyAppreciationRate: 3.5,
      expenseGrowthRate: 2.5
    },
    validation: {
      purchasePrice: [
        commonValidations.required(),
        commonValidations.min(50000),
        commonValidations.max(10000000)
      ],
      downPaymentPercent: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(100)
      ],
      interestRate: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(20)
      ],
      loanTerm: [
        commonValidations.required(),
        commonValidations.min(5),
        commonValidations.max(40)
      ],
      closingCosts: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      rehabCosts: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      monthlyRent: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      vacancyRate: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(100)
      ],
      otherIncome: [
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
      propertyManagement: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      utilities: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      hoaFees: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      otherExpenses: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      rentGrowthRate: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(10)
      ],
      propertyAppreciationRate: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(10)
      ],
      expenseGrowthRate: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(10)
      ]
    },
    compute: (values) => {
      // Calculate loan details
      const loanDetails = calculateLoanDetails(values);

      // Calculate income and expenses
      const operatingMetrics = calculateOperatingMetrics(values);

      // Calculate investment metrics
      const investmentMetrics = calculateInvestmentMetrics(values, loanDetails, operatingMetrics);

      // Calculate projections
      const projections = calculateProjections(values, loanDetails, operatingMetrics);

      // Calculate risk metrics
      const riskMetrics = calculateRiskMetrics(values, operatingMetrics, loanDetails);

      // Generate insights
      const analysis = analyzeInvestment(values, operatingMetrics, investmentMetrics, riskMetrics);

      return {
        ...loanDetails,
        ...operatingMetrics,
        ...investmentMetrics,
        ...projections,
        ...riskMetrics,
        ...analysis
      };
    }
  });
}

function calculateLoanDetails(values: PropertyInvestmentValues) {
  const downPayment = new Decimal(values.purchasePrice)
    .times(values.downPaymentPercent)
    .div(100);

  const loanAmount = new Decimal(values.purchasePrice).minus(downPayment);
  const totalInvestment = downPayment
    .plus(values.closingCosts)
    .plus(values.rehabCosts);

  // Calculate monthly mortgage payment using the loan amortization formula
  const monthlyRate = new Decimal(values.interestRate).div(12).div(100);
  const numberOfPayments = values.loanTerm * 12;
  const mortgageFactor = monthlyRate.plus(1).pow(numberOfPayments);
  const monthlyMortgage = loanAmount
    .times(monthlyRate.times(mortgageFactor))
    .div(mortgageFactor.minus(1));

  return {
    loanAmount: loanAmount.toNumber(),
    downPayment: downPayment.toNumber(),
    totalInvestment: totalInvestment.toNumber(),
    monthlyMortgage: monthlyMortgage.toNumber()
  };
}

function calculateOperatingMetrics(values: PropertyInvestmentValues) {
  const grossIncome = new Decimal(values.monthlyRent)
    .plus(values.otherIncome);

  const effectiveGrossIncome = grossIncome
    .times(new Decimal(100).minus(values.vacancyRate))
    .div(100);

  const totalOperatingExpenses = new Decimal(values.propertyTaxes)
    .plus(values.insurance)
    .plus(values.maintenance)
    .plus(values.propertyManagement)
    .plus(values.utilities)
    .plus(values.hoaFees)
    .plus(values.otherExpenses)
    .div(12); // Convert annual to monthly

  const netOperatingIncome = effectiveGrossIncome.minus(totalOperatingExpenses);
  const cashFlow = netOperatingIncome.minus(values.monthlyRent);

  return {
    effectiveGrossIncome: effectiveGrossIncome.toNumber(),
    totalOperatingExpenses: totalOperatingExpenses.toNumber(),
    netOperatingIncome: netOperatingIncome.toNumber(),
    cashFlow: cashFlow.toNumber()
  };
}

function calculateInvestmentMetrics(
  values: PropertyInvestmentValues,
  loanDetails: ReturnType<typeof calculateLoanDetails>,
  operatingMetrics: ReturnType<typeof calculateOperatingMetrics>
) {
  const annualNOI = new Decimal(operatingMetrics.netOperatingIncome).times(12);
  const capRate = annualNOI.div(values.purchasePrice).times(100);

  const annualCashFlow = new Decimal(operatingMetrics.cashFlow).times(12);
  const cashOnCashReturn = annualCashFlow.div(loanDetails.totalInvestment).times(100);

  const firstYearEquity = new Decimal(values.purchasePrice)
    .times(values.propertyAppreciationRate)
    .div(100);
  const firstYearPrincipalPaydown = calculatePrincipalPaydown(values, loanDetails, 1);
  const totalReturn = annualCashFlow
    .plus(firstYearEquity)
    .plus(firstYearPrincipalPaydown)
    .div(loanDetails.totalInvestment)
    .times(100);

  const breakEvenPoint = loanDetails.totalInvestment.div(annualCashFlow).ceil();

  return {
    capRate: capRate.toNumber(),
    cashOnCashReturn: cashOnCashReturn.toNumber(),
    returnOnInvestment: totalReturn.toNumber(),
    breakEvenPoint: breakEvenPoint.toNumber()
  };
}

function calculateProjections(
  values: PropertyInvestmentValues,
  loanDetails: ReturnType<typeof calculateLoanDetails>,
  operatingMetrics: ReturnType<typeof calculateOperatingMetrics>
) {
  const projections = [];

  let currentPropertyValue = new Decimal(values.purchasePrice);
  let currentRent = new Decimal(values.monthlyRent);
  let currentExpenses = new Decimal(operatingMetrics.totalOperatingExpenses);
  let remainingLoan = new Decimal(loanDetails.loanAmount);

  for (let year = 1; year <= 5; year++) {
    // Calculate appreciation
    currentPropertyValue = currentPropertyValue
      .times(new Decimal(100).plus(values.propertyAppreciationRate))
      .div(100);

    // Calculate rent growth
    currentRent = currentRent
      .times(new Decimal(100).plus(values.rentGrowthRate))
      .div(100);

    // Calculate expense growth
    currentExpenses = currentExpenses
      .times(new Decimal(100).plus(values.expenseGrowthRate))
      .div(100);

    // Calculate principal paydown
    const principalPaydown = calculatePrincipalPaydown(values, loanDetails, year);
    remainingLoan = remainingLoan.minus(principalPaydown);

    // Calculate equity
    const equity = currentPropertyValue.minus(remainingLoan);

    // Calculate net income
    const netIncome = currentRent
      .times(12)
      .times(new Decimal(100).minus(values.vacancyRate))
      .div(100)
      .minus(currentExpenses.times(12))
      .minus(new Decimal(loanDetails.monthlyMortgage).times(12));

    // Calculate ROI
    const roi = netIncome
      .plus(currentPropertyValue.minus(values.purchasePrice))
      .plus(principalPaydown)
      .div(loanDetails.totalInvestment)
      .times(100);

    projections.push({
      year,
      propertyValue: currentPropertyValue.toNumber(),
      netIncome: netIncome.toNumber(),
      equity: equity.toNumber(),
      roi: roi.toNumber()
    });
  }

  return {
    fiveYearProjections: projections
  };
}

function calculateRiskMetrics(
  values: PropertyInvestmentValues,
  operatingMetrics: ReturnType<typeof calculateOperatingMetrics>,
  loanDetails: ReturnType<typeof calculateLoanDetails>
) {
  const annualNOI = new Decimal(operatingMetrics.netOperatingIncome).times(12);
  const annualDebtService = new Decimal(loanDetails.monthlyMortgage).times(12);
  const debtServiceCoverageRatio = annualNOI.div(annualDebtService);

  const operatingExpenseRatio = new Decimal(operatingMetrics.totalOperatingExpenses)
    .times(12)
    .div(operatingMetrics.effectiveGrossIncome * 12)
    .times(100);

  const priceToRentRatio = new Decimal(values.purchasePrice)
    .div(values.monthlyRent * 12);

  return {
    debtServiceCoverageRatio: debtServiceCoverageRatio.toNumber(),
    operatingExpenseRatio: operatingExpenseRatio.toNumber(),
    priceToRentRatio: priceToRentRatio.toNumber()
  };
}

function calculatePrincipalPaydown(
  values: PropertyInvestmentValues,
  loanDetails: ReturnType<typeof calculateLoanDetails>,
  year: number
): Decimal {
  const monthlyRate = new Decimal(values.interestRate).div(12).div(100);
  const monthlyPayment = new Decimal(loanDetails.monthlyMortgage);
  const loanAmount = new Decimal(loanDetails.loanAmount);
  let remainingBalance = loanAmount;
  let totalPrincipal = new Decimal(0);

  // Calculate for each month in the year
  for (let month = 1; month <= year * 12; month++) {
    const interestPayment = remainingBalance.times(monthlyRate);
    const principalPayment = monthlyPayment.minus(interestPayment);
    remainingBalance = remainingBalance.minus(principalPayment);
    
    if (month > (year - 1) * 12) {
      totalPrincipal = totalPrincipal.plus(principalPayment);
    }
  }

  return totalPrincipal;
}

function analyzeInvestment(
  values: PropertyInvestmentValues,
  operatingMetrics: ReturnType<typeof calculateOperatingMetrics>,
  investmentMetrics: ReturnType<typeof calculateInvestmentMetrics>,
  riskMetrics: ReturnType<typeof calculateRiskMetrics>
) {
  const recommendations: string[] = [];
  const insights: Array<{ type: 'success' | 'warning' | 'info'; message: string }> = [];

  // Cash flow analysis
  if (operatingMetrics.cashFlow < 0) {
    recommendations.push('Consider increasing rent or reducing expenses to improve cash flow');
    insights.push({
      type: 'warning',
      message: 'Property is cash flow negative'
    });
  }

  // Cap rate analysis
  if (investmentMetrics.capRate < 5) {
    recommendations.push('Property may be overpriced for the market');
    insights.push({
      type: 'warning',
      message: 'Cap rate is below market average'
    });
  } else if (investmentMetrics.capRate > 8) {
    insights.push({
      type: 'success',
      message: 'Strong cap rate indicates good value'
    });
  }

  // Debt service coverage
  if (riskMetrics.debtServiceCoverageRatio < 1.25) {
    recommendations.push('Consider larger down payment or finding better financing terms');
    insights.push({
      type: 'warning',
      message: 'Low debt service coverage ratio increases risk'
    });
  }

  // Operating expense ratio
  if (riskMetrics.operatingExpenseRatio > 50) {
    recommendations.push('Look for ways to reduce operating expenses');
    insights.push({
      type: 'warning',
      message: 'High operating expense ratio may impact profitability'
    });
  }

  // Price to rent ratio
  if (riskMetrics.priceToRentRatio > 15) {
    recommendations.push('Property price may be too high relative to rental income');
    insights.push({
      type: 'warning',
      message: 'High price-to-rent ratio indicates potential overvaluation'
    });
  } else if (riskMetrics.priceToRentRatio < 10) {
    insights.push({
      type: 'success',
      message: 'Favorable price-to-rent ratio indicates good investment potential'
    });
  }

  // Down payment analysis
  if (values.downPaymentPercent < 20) {
    recommendations.push('Consider saving for larger down payment to avoid PMI');
    insights.push({
      type: 'info',
      message: 'Low down payment may result in additional costs'
    });
  }

  // Vacancy rate
  if (values.vacancyRate < 4) {
    insights.push({
      type: 'info',
      message: 'Vacancy rate assumption may be optimistic'
    });
  }

  return {
    recommendations,
    insights
  };
}

