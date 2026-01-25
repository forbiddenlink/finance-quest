'use client';

import { useCalculatorBase, commonValidations } from '../useCalculatorBase';
import {
  formatCurrency,
  formatPercentage,
  financialRatios,
  calculateMonthlyPayment
} from '@/lib/utils/financialCalculations';
import { Decimal } from 'decimal.js';

interface DebtItem {
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  type: 'credit_card' | 'personal_loan' | 'student_loan' | 'mortgage' | 'auto_loan' | 'other';
  isDeductible: boolean;
}

interface DebtCalculatorValues {
  debts: DebtItem[];
  monthlyIncome: number;
  extraPayment: number;
  paymentStrategy: 'avalanche' | 'snowball';
  consolidationRate?: number;
  monthlyExpenses: number;
  creditScore: number;
}

interface PaymentSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  totalInterestPaid: number;
}

interface DebtSummary {
  originalBalance: number;
  currentBalance: number;
  monthlyPayment: number;
  weightedAverageRate: number;
  totalInterest: number;
  payoffDate: Date;
  schedule: PaymentSchedule[];
}

interface DebtCalculatorResult {
  summary: {
    totalDebt: number;
    totalMinimumPayment: number;
    weightedAverageRate: number;
    debtToIncome: number;
    monthsToPayoff: number;
    totalInterestPaid: number;
    totalInterestSaved: number;
    taxDeductibleInterest: number;
  };
  debtDetails: {
    [key: string]: DebtSummary;
  };
  payoffStrategy: {
    order: string[];
    monthlyAllocation: {
      [key: string]: number;
    };
    projectedPayoffDates: {
      [key: string]: Date;
    };
  };
  consolidation: {
    isRecommended: boolean;
    potentialSavings: number;
    monthlyPaymentDifference: number;
    newPayoffDate: Date;
  };
  metrics: {
    utilizationRate: number;
    debtServiceRatio: number;
    netDebtBurden: number;
  };
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
    category?: string;
  }>;
}

export function useDebtCalculator() {
  return useCalculatorBase<DebtCalculatorValues, DebtCalculatorResult>({
    id: 'debt-calculator',
    initialValues: {
      debts: [
        {
          name: 'Credit Card 1',
          balance: 5000,
          interestRate: 18.99,
          minimumPayment: 150,
          type: 'credit_card',
          isDeductible: false
        }
      ],
      monthlyIncome: 5000,
      extraPayment: 200,
      paymentStrategy: 'avalanche',
      monthlyExpenses: 3000,
      creditScore: 700
    },
    validation: {
      monthlyIncome: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      extraPayment: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      monthlyExpenses: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      creditScore: [
        commonValidations.required(),
        commonValidations.min(300),
        commonValidations.max(850)
      ],
      consolidationRate: [
        commonValidations.min(0),
        commonValidations.max(100)
      ]
    },
    compute: (values): DebtCalculatorResult => {
      // Calculate total debt and minimum payments
      const totalDebt = values.debts.reduce(
        (sum, debt) => sum.plus(debt.balance),
        new Decimal(0)
      );

      const totalMinimumPayment = values.debts.reduce(
        (sum, debt) => sum.plus(debt.minimumPayment),
        new Decimal(0)
      );

      // Calculate weighted average interest rate
      const weightedAverageRate = values.debts.reduce(
        (sum, debt) => sum.plus(
          new Decimal(debt.balance)
            .times(debt.interestRate)
            .dividedBy(totalDebt)
        ),
        new Decimal(0)
      );

      // Sort debts by strategy
      const sortedDebts = [...values.debts].sort((a, b) => {
        if (values.paymentStrategy === 'avalanche') {
          return b.interestRate - a.interestRate;
        }
        return a.balance - b.balance;
      });

      // Calculate payoff schedule for each debt
      const debtDetails: { [key: string]: DebtSummary } = {};
      let totalInterestPaid = new Decimal(0);
      let maxMonths = 0;
      let availableExtra = new Decimal(values.extraPayment);

      for (const debt of sortedDebts) {
        const schedule: PaymentSchedule[] = [];
        let balance = new Decimal(debt.balance);
        let totalInterest = new Decimal(0);
        let month = 0;
        let payment = new Decimal(debt.minimumPayment);

        // Add extra payment to first debt in strategy
        if (debt === sortedDebts[0]) {
          payment = payment.plus(availableExtra);
        }

        while (balance.greaterThan(0) && month < 360) { // 30-year maximum
          const monthlyInterest = balance
            .times(debt.interestRate / 100)
            .dividedBy(12);
          const principal = Decimal.min(
            payment.minus(monthlyInterest),
            balance
          );
          
          balance = balance.minus(principal);
          totalInterest = totalInterest.plus(monthlyInterest);
          
          schedule.push({
            month: month + 1,
            payment: payment.toNumber(),
            principal: principal.toNumber(),
            interest: monthlyInterest.toNumber(),
            remainingBalance: balance.toNumber(),
            totalInterestPaid: totalInterest.toNumber()
          });
          
          month++;
        }

        maxMonths = Math.max(maxMonths, month);
        totalInterestPaid = totalInterestPaid.plus(totalInterest);

        debtDetails[debt.name] = {
          originalBalance: debt.balance,
          currentBalance: balance.toNumber(),
          monthlyPayment: payment.toNumber(),
          weightedAverageRate: debt.interestRate,
          totalInterest: totalInterest.toNumber(),
          payoffDate: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000),
          schedule
        };
      }

      // Calculate consolidation analysis
      const consolidationAnalysis = values.consolidationRate
        ? analyzeConsolidation(values.debts, values.consolidationRate)
        : {
            isRecommended: false,
            potentialSavings: 0,
            monthlyPaymentDifference: 0,
            newPayoffDate: new Date()
          };

      // Calculate tax-deductible interest
      const taxDeductibleInterest = values.debts
        .filter(debt => debt.isDeductible)
        .reduce(
          (sum, debt) => sum.plus(
            new Decimal(debt.balance)
              .times(debt.interestRate / 100)
              .dividedBy(12)
          ),
          new Decimal(0)
        )
        .times(12)
        .toNumber();

      // Calculate metrics
      const creditCardDebt = values.debts
        .filter(debt => debt.type === 'credit_card')
        .reduce(
          (sum, debt) => sum.plus(debt.balance),
          new Decimal(0)
        );

      const utilizationRate = creditCardDebt
        .dividedBy(creditCardDebt.plus(5000)) // Assuming $5000 total credit limit
        .times(100)
        .toNumber();

      const debtServiceRatio = totalMinimumPayment
        .dividedBy(values.monthlyIncome)
        .times(100)
        .toNumber();

      const netDebtBurden = totalDebt
        .dividedBy(values.monthlyIncome * 12)
        .times(100)
        .toNumber();

      // Generate insights
      const insights = [];

      // Debt-to-income insights
      const dti = debtServiceRatio;
      if (dti > financialRatios.maxDTI) {
        insights.push({
          type: 'warning',
          message: `Debt-to-income ratio (${dti.toFixed(1)}%) exceeds recommended maximum`,
          category: 'debt-to-income'
        });
      }

      // Credit utilization insights
      if (utilizationRate > 30) {
        insights.push({
          type: 'warning',
          message: `High credit utilization (${utilizationRate.toFixed(1)}%) may impact credit score`,
          category: 'credit-utilization'
        });
      }

      // Payment strategy insights
      if (values.paymentStrategy === 'avalanche') {
        const snowballSavings = calculateStrategyDifference(
          values.debts,
          'snowball',
          values.extraPayment
        );
        if (snowballSavings < -500) { // If avalanche saves more than $500
          insights.push({
            type: 'success',
            message: `Current avalanche strategy saves $${Math.abs(snowballSavings).toFixed(0)} in interest`,
            category: 'strategy'
          });
        }
      }

      // Consolidation insights
      if (consolidationAnalysis.isRecommended) {
        insights.push({
          type: 'info',
          message: `Debt consolidation could save $${consolidationAnalysis.potentialSavings.toFixed(0)}`,
          category: 'consolidation'
        });
      }

      // High interest debt insights
      const highInterestDebt = values.debts.find(debt => debt.interestRate > 20);
      if (highInterestDebt) {
        insights.push({
          type: 'warning',
          message: `Consider refinancing ${highInterestDebt.name} to reduce ${highInterestDebt.interestRate}% interest rate`,
          category: 'high-interest'
        });
      }

      // Tax deduction insights
      if (taxDeductibleInterest > 0) {
        insights.push({
          type: 'info',
          message: `$${taxDeductibleInterest.toFixed(0)} in tax-deductible interest this year`,
          category: 'tax'
        });
      }

      return {
        summary: {
          totalDebt: totalDebt.toNumber(),
          totalMinimumPayment: totalMinimumPayment.toNumber(),
          weightedAverageRate: weightedAverageRate.toNumber(),
          debtToIncome: debtServiceRatio,
          monthsToPayoff: maxMonths,
          totalInterestPaid: totalInterestPaid.toNumber(),
          totalInterestSaved: calculateTotalInterestSaved(
            values.debts,
            values.extraPayment
          ),
          taxDeductibleInterest
        },
        debtDetails,
        payoffStrategy: {
          order: sortedDebts.map(debt => debt.name),
          monthlyAllocation: sortedDebts.reduce((alloc, debt) => ({
            ...alloc,
            [debt.name]: debt === sortedDebts[0]
              ? debt.minimumPayment + values.extraPayment
              : debt.minimumPayment
          }), {}),
          projectedPayoffDates: Object.fromEntries(
            Object.entries(debtDetails).map(([name, detail]) => [
              name,
              detail.payoffDate
            ])
          )
        },
        consolidation: consolidationAnalysis,
        metrics: {
          utilizationRate,
          debtServiceRatio,
          netDebtBurden
        },
        insights
      };
    },
    formatters: {
      monthlyIncome: formatCurrency,
      extraPayment: formatCurrency,
      monthlyExpenses: formatCurrency,
      consolidationRate: (value) => formatPercentage(value, 2)
    }
  });
}

// Helper functions

function analyzeConsolidation(
  debts: DebtItem[],
  consolidationRate: number
): {
  isRecommended: boolean;
  potentialSavings: number;
  monthlyPaymentDifference: number;
  newPayoffDate: Date;
} {
  const totalBalance = debts.reduce(
    (sum, debt) => sum + debt.balance,
    0
  );

  const currentMonthlyPayment = debts.reduce(
    (sum, debt) => sum + debt.minimumPayment,
    0
  );

  // Calculate consolidated loan payment (36-month term)
  const consolidatedPayment = calculateMonthlyPayment(
    totalBalance,
    consolidationRate,
    3
  );

  // Calculate total interest with current debts
  const currentTotalInterest = debts.reduce((sum, debt) => {
    const monthlyRate = debt.interestRate / 100 / 12;
    const months = Math.ceil(
      Math.log(
        debt.minimumPayment /
        (debt.minimumPayment - debt.balance * monthlyRate)
      ) / Math.log(1 + monthlyRate)
    );
    return sum + (debt.minimumPayment * months - debt.balance);
  }, 0);

  // Calculate total interest with consolidation
  const consolidatedTotalInterest = consolidatedPayment * 36 - totalBalance;

  const potentialSavings = currentTotalInterest - consolidatedTotalInterest;
  const monthlyPaymentDifference = consolidatedPayment - currentMonthlyPayment;

  // Determine if consolidation is recommended
  const isRecommended = potentialSavings > 1000 && // Save at least $1000
    monthlyPaymentDifference <= 0; // No increase in monthly payment

  return {
    isRecommended,
    potentialSavings,
    monthlyPaymentDifference,
    newPayoffDate: new Date(Date.now() + 36 * 30 * 24 * 60 * 60 * 1000)
  };
}

function calculateStrategyDifference(
  debts: DebtItem[],
  strategy: 'avalanche' | 'snowball',
  extraPayment: number
): number {
  // Sort debts by strategy
  const sortedDebts = [...debts].sort((a, b) => {
    if (strategy === 'avalanche') {
      return b.interestRate - a.interestRate;
    }
    return a.balance - b.balance;
  });

  // Calculate total interest paid
  let totalInterest = 0;
  let availableExtra = extraPayment;

  for (const debt of sortedDebts) {
    const payment = debt === sortedDebts[0]
      ? debt.minimumPayment + availableExtra
      : debt.minimumPayment;

    const monthlyRate = debt.interestRate / 100 / 12;
    const months = Math.ceil(
      Math.log(
        payment /
        (payment - debt.balance * monthlyRate)
      ) / Math.log(1 + monthlyRate)
    );

    totalInterest += payment * months - debt.balance;
  }

  return totalInterest;
}

function calculateTotalInterestSaved(
  debts: DebtItem[],
  extraPayment: number
): number {
  // Calculate interest without extra payments
  const baselineInterest = debts.reduce((sum, debt) => {
    const monthlyRate = debt.interestRate / 100 / 12;
    const months = Math.ceil(
      Math.log(
        debt.minimumPayment /
        (debt.minimumPayment - debt.balance * monthlyRate)
      ) / Math.log(1 + monthlyRate)
    );
    return sum + (debt.minimumPayment * months - debt.balance);
  }, 0);

  // Calculate interest with extra payments
  const optimizedInterest = calculateStrategyDifference(
    debts,
    'avalanche',
    extraPayment
  );

  return baselineInterest - optimizedInterest;
}
