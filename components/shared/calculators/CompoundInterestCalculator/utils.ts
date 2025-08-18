import { Decimal } from 'decimal.js';
import {
  CompoundInterestValues,
  CompoundingPeriod,
  CompoundInterestResult,
  ValidationError,
  ChartData,
  ChartOptions
} from './types';
import { COMPOUND_INTEREST_CONSTANTS } from './constants';

export function safeParseFloat(value: string | number, min: number = 0, max: number = 1000000): number {
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(parsed)) return 0;
  return Math.max(min, Math.min(max, parsed));
}

export function validateInputs(values: CompoundInterestValues): ValidationError[] {
  const errors: ValidationError[] = [];

  if (values.initialInvestment < 0) {
    errors.push({
      field: 'initialInvestment',
      message: 'Initial investment cannot be negative'
    });
  }

  if (values.initialInvestment > COMPOUND_INTEREST_CONSTANTS.maxInitialInvestment) {
    errors.push({
      field: 'initialInvestment',
      message: `Initial investment cannot exceed ${formatCurrency(COMPOUND_INTEREST_CONSTANTS.maxInitialInvestment)}`
    });
  }

  if (values.monthlyContribution < 0) {
    errors.push({
      field: 'monthlyContribution',
      message: 'Monthly contribution cannot be negative'
    });
  }

  if (values.monthlyContribution > COMPOUND_INTEREST_CONSTANTS.maxMonthlyContribution) {
    errors.push({
      field: 'monthlyContribution',
      message: `Monthly contribution cannot exceed ${formatCurrency(COMPOUND_INTEREST_CONSTANTS.maxMonthlyContribution)}`
    });
  }

  if (values.annualInterestRate < 0 || values.annualInterestRate > COMPOUND_INTEREST_CONSTANTS.maxInterestRate) {
    errors.push({
      field: 'annualInterestRate',
      message: `Interest rate must be between 0% and ${COMPOUND_INTEREST_CONSTANTS.maxInterestRate}%`
    });
  }

  if (values.timeHorizonYears < 1 || values.timeHorizonYears > COMPOUND_INTEREST_CONSTANTS.maxTimeHorizon) {
    errors.push({
      field: 'timeHorizonYears',
      message: `Time horizon must be between 1 and ${COMPOUND_INTEREST_CONSTANTS.maxTimeHorizon} years`
    });
  }

  if (values.inflationRate < 0 || values.inflationRate > COMPOUND_INTEREST_CONSTANTS.maxInflationRate) {
    errors.push({
      field: 'inflationRate',
      message: `Inflation rate must be between 0% and ${COMPOUND_INTEREST_CONSTANTS.maxInflationRate}%`
    });
  }

  if (values.taxRate < 0 || values.taxRate > COMPOUND_INTEREST_CONSTANTS.maxTaxRate) {
    errors.push({
      field: 'taxRate',
      message: `Tax rate must be between 0% and ${COMPOUND_INTEREST_CONSTANTS.maxTaxRate}%`
    });
  }

  return errors;
}

export function calculateCompoundInterest(values: CompoundInterestValues): CompoundInterestResult {
  const periodsPerYear = COMPOUND_INTEREST_CONSTANTS.compoundingFrequencies[values.compoundingFrequency].periodsPerYear;
  const contributionsPerYear = COMPOUND_INTEREST_CONSTANTS.contributionFrequencies[values.contributionFrequency].periodsPerYear;
  
  const periodicRate = new Decimal(values.annualInterestRate)
    .div(100)
    .div(periodsPerYear);
  
  const contributionAmount = new Decimal(values.monthlyContribution)
    .times(12)
    .div(contributionsPerYear);

  let balance = new Decimal(values.initialInvestment);
  let totalContributions = new Decimal(values.initialInvestment);
  const compoundingPeriods: CompoundingPeriod[] = [];
  
  for (let year = 1; year <= values.timeHorizonYears; year++) {
    const startingBalance = balance;
    const yearlyContributions = contributionAmount.times(contributionsPerYear);
    let yearlyInterest = new Decimal(0);

    // Calculate compound interest for each period within the year
    for (let period = 1; period <= periodsPerYear; period++) {
      const periodContribution = yearlyContributions.div(periodsPerYear);
      const interestEarned = balance.plus(periodContribution).times(periodicRate);
      yearlyInterest = yearlyInterest.plus(interestEarned);
      balance = balance.plus(periodContribution).plus(interestEarned);
    }

    totalContributions = totalContributions.plus(yearlyContributions);

    // Calculate real value (adjusted for inflation)
    const inflationFactor = new Decimal(1)
      .minus(new Decimal(values.inflationRate).div(100))
      .pow(year);
    const realValue = balance.times(inflationFactor);

    // Calculate after-tax value
    const totalGains = balance.minus(totalContributions);
    const taxableAmount = totalGains.times(new Decimal(values.taxRate).div(100));
    const afterTaxValue = balance.minus(taxableAmount);

    compoundingPeriods.push({
      year,
      startingBalance: startingBalance.toNumber(),
      contributions: yearlyContributions.toNumber(),
      interest: yearlyInterest.toNumber(),
      endingBalance: balance.toNumber(),
      realValue: realValue.toNumber(),
      afterTaxValue: afterTaxValue.toNumber()
    });
  }

  const totalInterest = balance.minus(totalContributions);
  const realFutureValue = balance.times(
    new Decimal(1)
      .minus(new Decimal(values.inflationRate).div(100))
      .pow(values.timeHorizonYears)
  );

  const taxableGains = balance.minus(totalContributions);
  const taxAmount = taxableGains.times(new Decimal(values.taxRate).div(100));
  const afterTaxFutureValue = balance.minus(taxAmount);

  // Calculate effective annual rate
  const effectiveAnnualRate = new Decimal(1)
    .plus(periodicRate)
    .pow(periodsPerYear)
    .minus(1)
    .times(100);

  // Estimate monthly income using the default withdrawal rate
  const withdrawalRate = new Decimal(COMPOUND_INTEREST_CONSTANTS.defaultWithdrawalRate).div(100);
  const monthlyIncomeEstimate = balance.times(withdrawalRate).div(12);

  return {
    futureValue: balance.toNumber(),
    totalContributions: totalContributions.toNumber(),
    totalInterest: totalInterest.toNumber(),
    realFutureValue: realFutureValue.toNumber(),
    afterTaxFutureValue: afterTaxFutureValue.toNumber(),
    effectiveAnnualRate: effectiveAnnualRate.toNumber(),
    compoundingPeriods,
    monthlyIncomeEstimate: monthlyIncomeEstimate.toNumber(),
    withdrawalRate: COMPOUND_INTEREST_CONSTANTS.defaultWithdrawalRate
  };
}

export function generateChartData(compoundingPeriods: CompoundingPeriod[]): ChartData {
  return {
    labels: compoundingPeriods.map(period => `Year ${period.year}`),
    datasets: [
      {
        label: 'Balance',
        data: compoundingPeriods.map(period => period.endingBalance),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Real Value',
        data: compoundingPeriods.map(period => period.realValue),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'After-Tax Value',
        data: compoundingPeriods.map(period => period.afterTaxValue),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long'
  }).format(date);
}
