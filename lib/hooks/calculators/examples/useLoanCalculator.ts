import { useCalculatorBase, commonValidations } from '../../useCalculatorBase';
import { Decimal } from 'decimal.js';

interface LoanCalculatorValues {
  loanAmount: number;
  interestRate: number;
  years: number;
  monthlyIncome: number;
  downPayment: number;
  propertyValue?: number;
  propertyTax?: number;
  insurance?: number;
  pmi?: number;
}

interface LoanCalculatorResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  principalAndInterest: number;
  taxesAndInsurance: number;
  debtToIncome: number;
  loanToValue: number;
  isPmiRequired: boolean;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
  }>;
}

const calculateMonthlyPayment = (
  principal: Decimal,
  annualRate: Decimal,
  years: number
): Decimal => {
  const monthlyRate = annualRate.div(12).div(100);
  const totalPayments = years * 12;
  
  if (monthlyRate.equals(0)) {
    return principal.div(totalPayments);
  }

  return principal
    .mul(monthlyRate.mul(Decimal.pow(monthlyRate.add(1), totalPayments)))
    .div(Decimal.pow(monthlyRate.add(1), totalPayments).minus(1));
};

export function useLoanCalculator() {
  return useCalculatorBase<LoanCalculatorValues, LoanCalculatorResult>({
    id: 'loan-calculator',
    initialValues: {
      loanAmount: 300000,
      interestRate: 4.5,
      years: 30,
      monthlyIncome: 7500,
      downPayment: 60000,
      propertyValue: 375000,
      propertyTax: 3000,
      insurance: 1200
    },
    validation: {
      loanAmount: [
        commonValidations.required(),
        commonValidations.positive(),
        {
          validate: (value, allValues) => {
            if (!allValues.monthlyIncome) return true;
            const payment = calculateMonthlyPayment(
              new Decimal(value),
              new Decimal(allValues.interestRate),
              allValues.years
            );
            return payment.lte(new Decimal(allValues.monthlyIncome).mul(0.43));
          },
          message: 'Loan amount too high for income (exceeds 43% DTI)'
        }
      ],
      interestRate: [
        commonValidations.required(),
        commonValidations.percentage(),
        {
          validate: (value) => value >= 0.1,
          message: 'Interest rate must be at least 0.1%'
        }
      ],
      years: [
        commonValidations.required(),
        commonValidations.integer(),
        commonValidations.min(1),
        commonValidations.max(50)
      ],
      monthlyIncome: [
        commonValidations.required(),
        commonValidations.positive()
      ],
      downPayment: [
        commonValidations.required(),
        commonValidations.min(0),
        {
          validate: (value, allValues) => {
            if (!allValues.propertyValue) return true;
            return value <= allValues.propertyValue;
          },
          message: 'Down payment cannot exceed property value'
        }
      ],
      propertyValue: [
        commonValidations.positive()
      ],
      propertyTax: [
        commonValidations.min(0)
      ],
      insurance: [
        commonValidations.min(0)
      ]
    },
    dependencies: {
      loanAmount: ['monthlyIncome', 'propertyValue', 'downPayment'],
      downPayment: ['propertyValue', 'loanAmount']
    },
    compute: (values): LoanCalculatorResult => {
      // Convert values to Decimal for precise calculation
      const loan = new Decimal(values.loanAmount);
      const rate = new Decimal(values.interestRate);
      const monthlyIncome = new Decimal(values.monthlyIncome);
      const propertyValue = new Decimal(values.propertyValue || 0);
      const propertyTax = new Decimal(values.propertyTax || 0);
      const insurance = new Decimal(values.insurance || 0);
      const downPayment = new Decimal(values.downPayment);

      // Calculate monthly principal and interest
      const monthlyPI = calculateMonthlyPayment(loan, rate, values.years);

      // Calculate monthly taxes and insurance
      const monthlyTI = propertyTax.plus(insurance).div(12);

      // Calculate PMI if needed (0.5% annually if LTV > 80%)
      const loanToValue = loan.div(propertyValue).mul(100);
      const isPmiRequired = loanToValue.gt(80);
      const pmi = isPmiRequired ? loan.mul(0.005).div(12) : new Decimal(0);

      // Total monthly payment
      const monthlyPayment = monthlyPI.plus(monthlyTI).plus(pmi);

      // Calculate debt-to-income ratio
      const debtToIncome = monthlyPayment.div(monthlyIncome).mul(100);

      // Generate amortization schedule
      const schedule = [];
      let balance = loan;
      const monthlyRate = rate.div(12).div(100);

      for (let month = 1; month <= values.years * 12; month++) {
        const interest = balance.mul(monthlyRate);
        const principal = monthlyPI.minus(interest);
        balance = balance.minus(principal);

        schedule.push({
          month,
          payment: monthlyPI.toNumber(),
          principal: principal.toNumber(),
          interest: interest.toNumber(),
          balance: balance.toNumber()
        });
      }

      // Generate insights
      const insights = [];

      if (debtToIncome.gt(43)) {
        insights.push({
          type: 'warning',
          message: 'Debt-to-income ratio exceeds 43% recommended maximum'
        });
      }

      if (isPmiRequired) {
        insights.push({
          type: 'info',
          message: 'Private Mortgage Insurance (PMI) required due to down payment < 20%'
        });
      }

      if (values.years > 30) {
        insights.push({
          type: 'warning',
          message: 'Loan term exceeds standard 30-year term'
        });
      }

      if (rate.lt(3)) {
        insights.push({
          type: 'success',
          message: 'Interest rate is historically low'
        });
      }

      return {
        monthlyPayment: monthlyPayment.toNumber(),
        totalPayment: monthlyPayment.mul(values.years * 12).toNumber(),
        totalInterest: monthlyPayment.mul(values.years * 12).minus(loan).toNumber(),
        principalAndInterest: monthlyPI.toNumber(),
        taxesAndInsurance: monthlyTI.toNumber(),
        debtToIncome: debtToIncome.toNumber(),
        loanToValue: loanToValue.toNumber(),
        isPmiRequired,
        amortizationSchedule: schedule,
        insights
      };
    },
    formatters: {
      loanAmount: (value) => value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }),
      interestRate: (value) => `${value.toFixed(3)}%`,
      monthlyIncome: (value) => value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }),
      downPayment: (value) => value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      })
    }
  });
}
