import { Decimal } from 'decimal.js';
import {
  Income,
  Deduction,
  Credit,
  TaxCalculation,
  TaxSavingsOpportunity,
  ValidationError,
  FilingStatus,
  TaxYear,
  TaxBracket,
  ChartData,
  ChartOptions
} from './types';
import {
  TAX_YEAR_CONFIG,
  DEDUCTION_LIMITS,
  CREDIT_LIMITS
} from './constants';

export function validateInputs(
  filingStatus: FilingStatus,
  taxYear: TaxYear,
  incomes: Income[],
  deductions: Deduction[],
  credits: Credit[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate incomes
  incomes.forEach((income, index) => {
    if (income.amount < 0) {
      errors.push({
        field: `income-${index}-amount`,
        message: 'Income amount cannot be negative'
      });
    }

    if (income.taxWithheld && income.taxWithheld < 0) {
      errors.push({
        field: `income-${index}-withheld`,
        message: 'Tax withheld cannot be negative'
      });
    }

    if (income.type === 'self_employed') {
      if (!income.selfEmploymentTax || income.selfEmploymentTax < 0) {
        errors.push({
          field: `income-${index}-se-tax`,
          message: 'Self-employment tax must be calculated'
        });
      }
    }
  });

  // Validate deductions
  deductions.forEach((deduction, index) => {
    if (deduction.amount < 0) {
      errors.push({
        field: `deduction-${index}-amount`,
        message: 'Deduction amount cannot be negative'
      });
    }

    const limits = DEDUCTION_LIMITS[deduction.category];
    if (limits.maxAmount && deduction.amount > limits.maxAmount) {
      errors.push({
        field: `deduction-${index}-amount`,
        message: `${deduction.category} deduction cannot exceed ${formatCurrency(limits.maxAmount)}`
      });
    }
  });

  // Validate credits
  credits.forEach((credit, index) => {
    if (credit.amount < 0) {
      errors.push({
        field: `credit-${index}-amount`,
        message: 'Credit amount cannot be negative'
      });
    }

    const limits = CREDIT_LIMITS[credit.type];
    if (credit.amount > limits.maxCredit) {
      errors.push({
        field: `credit-${index}-amount`,
        message: `${credit.type} credit cannot exceed ${formatCurrency(limits.maxCredit)}`
      });
    }
  });

  return errors;
}

export function calculateTaxes(
  filingStatus: FilingStatus,
  taxYear: TaxYear,
  incomes: Income[],
  deductions: Deduction[],
  credits: Credit[]
): TaxCalculation {
  const yearConfig = TAX_YEAR_CONFIG[taxYear as keyof typeof TAX_YEAR_CONFIG];
  const config = yearConfig[filingStatus as keyof typeof yearConfig];

  // Calculate total income
  const totalIncome = incomes.reduce(
    (sum, income) => sum.plus(income.amount),
    new Decimal(0)
  ).toNumber();

  // Calculate total deductions
  const totalDeductions = deductions.reduce(
    (sum, deduction) => sum.plus(deduction.amount),
    new Decimal(0)
  ).toNumber();

  // Calculate AGI (simplified)
  const adjustedGrossIncome = totalIncome;

  // Calculate taxable income
  const taxableIncome = Math.max(0, adjustedGrossIncome - totalDeductions);

  // Calculate tax by bracket
  const brackets = calculateTaxByBracket(taxableIncome, config.brackets);
  const taxBeforeCredits = brackets.reduce(
    (sum, bracket) => sum.plus(bracket.tax),
    new Decimal(0)
  ).toNumber();

  // Calculate total credits
  const totalCredits = credits.reduce(
    (sum, credit) => sum.plus(credit.amount),
    new Decimal(0)
  ).toNumber();

  // Calculate tax after credits
  const taxAfterCredits = Math.max(0, taxBeforeCredits - totalCredits);

  // Calculate self-employment tax
  const selfEmploymentTax = incomes.reduce(
    (sum, income) => sum.plus(income.selfEmploymentTax || 0),
    new Decimal(0)
  ).toNumber();

  // Calculate tax withheld
  const taxWithheld = incomes.reduce(
    (sum, income) => sum.plus(income.taxWithheld || 0),
    new Decimal(0)
  ).toNumber();

  // Calculate estimated tax payments
  const estimatedTaxPayments = incomes.reduce(
    (sum, income) => sum.plus(
      income.quarterlyPayments?.reduce((qSum, payment) => qSum + payment, 0) || 0
    ),
    new Decimal(0)
  ).toNumber();

  // Calculate refund or amount due
  const refundOrDue = new Decimal(taxWithheld)
    .plus(estimatedTaxPayments)
    .minus(taxAfterCredits)
    .minus(selfEmploymentTax)
    .toNumber();

  // Calculate effective tax rate
  const effectiveTaxRate = totalIncome > 0
    ? new Decimal(taxAfterCredits).plus(selfEmploymentTax).div(totalIncome).times(100).toNumber()
    : 0;

  // Calculate marginal tax rate
  const marginalTaxRate = brackets.length > 0
    ? brackets[brackets.length - 1].rate
    : 0;

  return {
    totalIncome,
    adjustedGrossIncome,
    taxableIncome,
    totalDeductions,
    totalCredits,
    taxBeforeCredits,
    taxAfterCredits,
    selfEmploymentTax,
    estimatedTaxPayments,
    taxWithheld,
    refundOrDue,
    effectiveTaxRate,
    marginalTaxRate,
    brackets
  };
}

function calculateTaxByBracket(
  taxableIncome: number,
  brackets: TaxBracket[]
): { rate: number; income: number; tax: number; }[] {
  const result = [];
  let remainingIncome = new Decimal(taxableIncome);

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const nextBracket = brackets[i + 1];
    const lowerBound = new Decimal(bracket.lowerBound);
    const upperBound = nextBracket
      ? new Decimal(nextBracket.lowerBound)
      : new Decimal(Infinity);

    if (remainingIncome.lessThanOrEqualTo(0)) break;

    const incomeInBracket = Decimal.min(
      remainingIncome,
      upperBound.minus(lowerBound)
    );

    if (incomeInBracket.greaterThan(0)) {
      const taxInBracket = incomeInBracket.times(bracket.rate).div(100);
      result.push({
        rate: bracket.rate,
        income: incomeInBracket.toNumber(),
        tax: taxInBracket.toNumber()
      });
      remainingIncome = remainingIncome.minus(incomeInBracket);
    }
  }

  return result;
}

export function identifySavingsOpportunities(
  filingStatus: FilingStatus,
  taxYear: TaxYear,
  incomes: Income[],
  deductions: Deduction[],
  credits: Credit[],
  calculation: TaxCalculation
): TaxSavingsOpportunity[] {
  const opportunities: TaxSavingsOpportunity[] = [];

  // Check for retirement contributions
  if (!deductions.some(d => d.description?.toLowerCase().includes('401k'))) {
    opportunities.push({
      type: 'deduction',
      name: '401(k) Contributions',
      description: 'Contribute to your 401(k) to reduce taxable income',
      potentialSavings: calculation.marginalTaxRate * 19500 / 100,
      requirements: ['Employer-sponsored 401(k) plan'],
      deadlines: [new Date(parseInt(taxYear), 11, 31)]
    });
  }

  // Check for IRA contributions
  if (!deductions.some(d => d.description?.toLowerCase().includes('ira'))) {
    opportunities.push({
      type: 'deduction',
      name: 'IRA Contributions',
      description: 'Contribute to a traditional IRA to reduce taxable income',
      potentialSavings: calculation.marginalTaxRate * 6000 / 100,
      requirements: ['Income within IRA limits'],
      deadlines: [new Date(parseInt(taxYear) + 1, 3, 15)]
    });
  }

  // Check for HSA contributions
  if (!deductions.some(d => d.description?.toLowerCase().includes('hsa'))) {
    opportunities.push({
      type: 'deduction',
      name: 'HSA Contributions',
      description: 'Contribute to an HSA for tax-free healthcare savings',
      potentialSavings: calculation.marginalTaxRate * 3600 / 100,
      requirements: ['High-deductible health plan'],
      deadlines: [new Date(parseInt(taxYear) + 1, 3, 15)]
    });
  }

  // Check for charitable contributions
  const charitableDeductions = deductions.filter(d => d.category === 'charitable');
  if (charitableDeductions.length === 0) {
    opportunities.push({
      type: 'deduction',
      name: 'Charitable Contributions',
      description: 'Make charitable donations for tax deductions',
      potentialSavings: calculation.marginalTaxRate * 1000 / 100,
      requirements: ['Valid charitable organizations', 'Documentation'],
      deadlines: [new Date(parseInt(taxYear), 11, 31)]
    });
  }

  // Check for energy credits
  if (!credits.some(c => c.type === 'energy')) {
    opportunities.push({
      type: 'credit',
      name: 'Energy Efficiency Credits',
      description: 'Install energy-efficient improvements for tax credits',
      potentialSavings: 3200,
      requirements: ['Qualified energy improvements', 'Manufacturer certification'],
      deadlines: [new Date(parseInt(taxYear), 11, 31)]
    });
  }

  return opportunities;
}

export function generateChartData(calculation: TaxCalculation): ChartData {
  return {
    labels: calculation.brackets.map(b => `${b.rate}% Bracket`),
    datasets: [
      {
        label: 'Tax Paid',
        data: calculation.brackets.map(b => b.tax),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Income in Bracket',
        data: calculation.brackets.map(b => b.income),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };
}

export function getChartOptions(): ChartOptions {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => formatCurrency(value)
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    }
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
