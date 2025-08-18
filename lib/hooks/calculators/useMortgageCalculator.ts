import { useCalculatorBase, commonValidations } from '../useCalculatorBase';
import {
  calculateMonthlyPayment,
  generateAmortizationSchedule,
  formatCurrency,
  formatPercentage,
  financialRatios
} from '@/lib/utils/financialCalculations';
import { Decimal } from 'decimal.js';

interface MortgageCalculatorValues {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  hoa: number;
  monthlyIncome: number;
  otherDebt: number;
}

interface MortgageCalculatorResult {
  loanAmount: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;
  totalMonthlyPayment: number;
  totalPaymentToIncome: number;
  debtToIncome: number;
  downPaymentPercent: number;
  loanToValue: number;
  totalInterest: number;
  totalCost: number;
  isAffordable: boolean;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    totalInterest: number;
  }>;
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
  }>;
}

export function useMortgageCalculator() {
  return useCalculatorBase<MortgageCalculatorValues, MortgageCalculatorResult>({
    id: 'mortgage-calculator',
    initialValues: {
      homePrice: 300000,
      downPayment: 60000,
      interestRate: 4.5,
      loanTerm: 30,
      propertyTax: 3000,
      homeInsurance: 1200,
      pmi: 0.5,
      hoa: 0,
      monthlyIncome: 7500,
      otherDebt: 500
    },
    validation: {
      homePrice: [
        commonValidations.required(),
        commonValidations.positive(),
        commonValidations.min(50000, 'Home price must be at least $50,000')
      ],
      downPayment: [
        commonValidations.required(),
        commonValidations.min(0),
        {
          validate: (value, allValues) => value <= (allValues?.homePrice || 0),
          message: 'Down payment cannot exceed home price'
        }
      ],
      interestRate: [
        commonValidations.required(),
        commonValidations.percentage(),
        commonValidations.min(0.1, 'Interest rate must be at least 0.1%'),
        commonValidations.max(25, 'Interest rate cannot exceed 25%')
      ],
      loanTerm: [
        commonValidations.required(),
        commonValidations.integer(),
        commonValidations.min(5, 'Loan term must be at least 5 years'),
        commonValidations.max(50, 'Loan term cannot exceed 50 years')
      ],
      propertyTax: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      homeInsurance: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      pmi: [
        commonValidations.required(),
        commonValidations.percentage(),
        commonValidations.min(0),
        commonValidations.max(5, 'PMI rate cannot exceed 5%')
      ],
      hoa: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      monthlyIncome: [
        commonValidations.required(),
        commonValidations.positive(),
        commonValidations.min(1000, 'Monthly income must be at least $1,000')
      ],
      otherDebt: [
        commonValidations.required(),
        commonValidations.min(0)
      ]
    },
    dependencies: {
      downPayment: ['homePrice']
    },
    compute: (values): MortgageCalculatorResult => {
      // Calculate loan amount and ratios
      const loanAmount = values.homePrice - values.downPayment;
      const downPaymentPercent = (values.downPayment / values.homePrice) * 100;
      const loanToValue = (loanAmount / values.homePrice) * 100;

      // Calculate monthly P&I payment
      const monthlyPrincipalAndInterest = calculateMonthlyPayment(
        loanAmount,
        values.interestRate,
        values.loanTerm
      );

      // Calculate monthly escrow payments
      const monthlyPropertyTax = values.propertyTax / 12;
      const monthlyInsurance = values.homeInsurance / 12;
      const monthlyPMI = loanToValue > financialRatios.pmiThreshold
        ? (loanAmount * values.pmi / 100) / 12
        : 0;
      const monthlyHOA = values.hoa;

      // Calculate total monthly payment
      const totalMonthlyPayment = monthlyPrincipalAndInterest +
        monthlyPropertyTax +
        monthlyInsurance +
        monthlyPMI +
        monthlyHOA;

      // Calculate affordability ratios
      const totalPaymentToIncome = (totalMonthlyPayment / values.monthlyIncome) * 100;
      const debtToIncome = ((totalMonthlyPayment + values.otherDebt) / values.monthlyIncome) * 100;
      const isAffordable = debtToIncome <= financialRatios.maxDTI;

      // Generate amortization schedule
      const amortizationSchedule = generateAmortizationSchedule(
        loanAmount,
        values.interestRate,
        values.loanTerm
      );

      // Get total interest from amortization schedule
      const totalInterest = amortizationSchedule[amortizationSchedule.length - 1].totalInterest;

      // Calculate total cost
      const totalCost = totalMonthlyPayment * values.loanTerm * 12;

      // Generate insights
      const insights = [];

      if (downPaymentPercent < financialRatios.minDownPayment) {
        insights.push({
          type: 'warning',
          message: `Down payment less than ${financialRatios.minDownPayment}% may limit loan options`
        });
      }

      if (loanToValue > financialRatios.pmiThreshold) {
        insights.push({
          type: 'warning',
          message: 'Down payment less than 20% requires PMI, increasing monthly costs'
        });
      }

      if (debtToIncome > financialRatios.maxDTI) {
        insights.push({
          type: 'warning',
          message: `Debt-to-income ratio exceeds ${financialRatios.maxDTI}% recommended maximum`
        });
      }

      if (totalPaymentToIncome > financialRatios.maxPTI) {
        insights.push({
          type: 'info',
          message: `Housing payment exceeds ${financialRatios.maxPTI}% of income, consider a less expensive home`
        });
      }

      if (values.loanTerm > 30) {
        insights.push({
          type: 'info',
          message: 'Loan term exceeds standard 30-year term, consider shorter term to save on interest'
        });
      }

      if (values.interestRate < 4) {
        insights.push({
          type: 'success',
          message: 'Interest rate is historically low, good time to lock in rate'
        });
      }

      return {
        loanAmount,
        monthlyPrincipalAndInterest,
        monthlyPropertyTax,
        monthlyInsurance,
        monthlyPMI,
        monthlyHOA,
        totalMonthlyPayment,
        totalPaymentToIncome,
        debtToIncome,
        downPaymentPercent,
        loanToValue,
        totalInterest,
        totalCost,
        isAffordable,
        amortizationSchedule,
        insights
      };
    },
    formatters: {
      homePrice: formatCurrency,
      downPayment: formatCurrency,
      interestRate: (value) => formatPercentage(value, 3),
      propertyTax: formatCurrency,
      homeInsurance: formatCurrency,
      pmi: (value) => formatPercentage(value, 3),
      hoa: formatCurrency,
      monthlyIncome: formatCurrency,
      otherDebt: formatCurrency
    }
  });
}