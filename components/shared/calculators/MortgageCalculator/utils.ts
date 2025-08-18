import { Decimal } from 'decimal.js';
import {
  MortgageValues,
  PaymentBreakdown,
  MortgageResult,
  ValidationError,
  YearlySummary,
  ChartData,
  AmortizationSchedule
} from './types';
import { MORTGAGE_CONSTANTS } from './constants';

export function safeParseFloat(value: string | number, min: number = 0, max: number = 1000000): number {
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(parsed)) return 0;
  return Math.max(min, Math.min(max, parsed));
}

export function validateInputs(values: MortgageValues): ValidationError[] {
  const errors: ValidationError[] = [];

  if (values.homePrice <= 0) {
    errors.push({ field: 'homePrice', message: 'Home price must be greater than $0' });
  }

  if (values.homePrice > MORTGAGE_CONSTANTS.maxLoanAmount) {
    errors.push({
      field: 'homePrice',
      message: `Home price cannot exceed ${formatCurrency(MORTGAGE_CONSTANTS.maxLoanAmount)}`
    });
  }

  const downPaymentPercent = (values.downPayment / values.homePrice) * 100;
  if (downPaymentPercent < MORTGAGE_CONSTANTS.minDownPaymentPercent) {
    errors.push({
      field: 'downPayment',
      message: `Down payment must be at least ${MORTGAGE_CONSTANTS.minDownPaymentPercent}% of home price`
    });
  }

  if (values.downPayment >= values.homePrice) {
    errors.push({
      field: 'downPayment',
      message: 'Down payment cannot equal or exceed home price'
    });
  }

  if (values.interestRate <= 0 || values.interestRate > MORTGAGE_CONSTANTS.maxInterestRate) {
    errors.push({
      field: 'interestRate',
      message: `Interest rate must be between 0% and ${MORTGAGE_CONSTANTS.maxInterestRate}%`
    });
  }

  if (!MORTGAGE_CONSTANTS.termOptions.includes(values.termYears)) {
    errors.push({
      field: 'termYears',
      message: 'Please select a valid loan term'
    });
  }

  if (values.propertyTax < 0) {
    errors.push({
      field: 'propertyTax',
      message: 'Property tax cannot be negative'
    });
  }

  if (values.homeInsurance < 0) {
    errors.push({
      field: 'homeInsurance',
      message: 'Home insurance cannot be negative'
    });
  }

  if (values.pmi < 0) {
    errors.push({
      field: 'pmi',
      message: 'PMI cannot be negative'
    });
  }

  if (values.hoaFees < 0) {
    errors.push({
      field: 'hoaFees',
      message: 'HOA fees cannot be negative'
    });
  }

  return errors;
}

export function calculateMortgage(values: MortgageValues): MortgageResult {
  const loanAmount = new Decimal(values.homePrice).minus(values.downPayment);
  const monthlyInterestRate = new Decimal(values.interestRate).div(1200);
  const numberOfPayments = new Decimal(values.termYears).times(12);

  // Calculate monthly payment using the mortgage payment formula
  const monthlyPayment = loanAmount.times(
    monthlyInterestRate.times(
      new Decimal(1).plus(monthlyInterestRate).pow(numberOfPayments)
    ).div(
      new Decimal(1).plus(monthlyInterestRate).pow(numberOfPayments).minus(1)
    )
  );

  // Generate amortization schedule
  const paymentSchedule: PaymentBreakdown[] = [];
  let balance = loanAmount;
  let cumulativeInterest = new Decimal(0);
  let cumulativePrincipal = new Decimal(0);

  for (let month = 1; month <= numberOfPayments.toNumber(); month++) {
    const interestPayment = balance.times(monthlyInterestRate);
    const principalPayment = monthlyPayment.minus(interestPayment);

    balance = balance.minus(principalPayment);
    cumulativeInterest = cumulativeInterest.plus(interestPayment);
    cumulativePrincipal = cumulativePrincipal.plus(principalPayment);

    paymentSchedule.push({
      year: Math.ceil(month / 12),
      month: ((month - 1) % 12) + 1,
      monthNumber: month,
      principal: principalPayment.toNumber(),
      interest: interestPayment.toNumber(),
      balance: Math.max(0, balance.toNumber()),
      cumulativeInterest: cumulativeInterest.toNumber(),
      cumulativePrincipal: cumulativePrincipal.toNumber()
    });
  }

  // Calculate monthly extras
  const monthlyPropertyTax = new Decimal(values.propertyTax).div(12);
  const monthlyHomeInsurance = new Decimal(values.homeInsurance).div(12);
  const monthlyPMI = new Decimal(values.pmi);
  const monthlyHOA = new Decimal(values.hoaFees);

  // Calculate totals
  const totalMonthlyPayment = monthlyPayment
    .plus(monthlyPropertyTax)
    .plus(monthlyHomeInsurance)
    .plus(monthlyPMI)
    .plus(monthlyHOA);

  const totalCost = totalMonthlyPayment
    .times(numberOfPayments)
    .plus(values.downPayment);

  return {
    loanAmount: loanAmount.toNumber(),
    monthlyPayment: monthlyPayment.toNumber(),
    monthlyInterestRate: monthlyInterestRate.times(100).toNumber(),
    totalPayment: monthlyPayment.times(numberOfPayments).toNumber(),
    totalInterest: cumulativeInterest.toNumber(),
    totalPrincipal: cumulativePrincipal.toNumber(),
    paymentSchedule,
    monthlyPropertyTax: monthlyPropertyTax.toNumber(),
    monthlyHomeInsurance: monthlyHomeInsurance.toNumber(),
    monthlyPMI: monthlyPMI.toNumber(),
    monthlyHOA: monthlyHOA.toNumber(),
    totalMonthlyPayment: totalMonthlyPayment.toNumber(),
    totalCost: totalCost.toNumber()
  };
}

export function generateAmortizationSchedule(paymentSchedule: PaymentBreakdown[]): AmortizationSchedule {
  // Generate yearly summary
  const yearlySummary: YearlySummary[] = [];
  let currentYear = 1;
  let yearlyPrincipal = new Decimal(0);
  let yearlyInterest = new Decimal(0);

  paymentSchedule.forEach((payment, index) => {
    if (payment.year === currentYear) {
      yearlyPrincipal = yearlyPrincipal.plus(payment.principal);
      yearlyInterest = yearlyInterest.plus(payment.interest);
    }

    if (payment.year !== currentYear || index === paymentSchedule.length - 1) {
      yearlySummary.push({
        year: currentYear,
        totalPrincipal: yearlyPrincipal.toNumber(),
        totalInterest: yearlyInterest.toNumber(),
        remainingBalance: payment.balance,
        cumulativePrincipal: payment.cumulativePrincipal,
        cumulativeInterest: payment.cumulativeInterest
      });

      currentYear = payment.year;
      yearlyPrincipal = new Decimal(payment.principal);
      yearlyInterest = new Decimal(payment.interest);
    }
  });

  // Generate chart data
  const chartData: ChartData = {
    labels: yearlySummary.map(summary => `Year ${summary.year}`),
    datasets: [
      {
        label: 'Principal',
        data: yearlySummary.map(summary => summary.totalPrincipal),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Interest',
        data: yearlySummary.map(summary => summary.totalInterest),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  return {
    monthlyPayments: paymentSchedule,
    yearlySummary,
    chartData
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

export function calculateDownPaymentAmount(homePrice: number, percentage: number): number {
  return new Decimal(homePrice).times(percentage).div(100).toNumber();
}

export function calculateDownPaymentPercentage(homePrice: number, amount: number): number {
  if (homePrice === 0) return 0;
  return new Decimal(amount).div(homePrice).times(100).toNumber();
}
