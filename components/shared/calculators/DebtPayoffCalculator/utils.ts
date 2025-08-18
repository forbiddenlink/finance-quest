import { Decimal } from 'decimal.js';
import {
  Debt,
  DebtTypeConfig,
  DebtSnapshot,
  PaymentAllocation,
  MonthlyPaymentSummary,
  PayoffMetrics,
  PaymentSchedule,
  DebtPayoffResult,
  PayoffStrategy
} from './types';

export const DEBT_TYPES: DebtTypeConfig = {
  credit_card: {
    label: 'Credit Card',
    defaultInterestRate: 19.99,
    minPaymentPercent: 2
  },
  personal_loan: {
    label: 'Personal Loan',
    defaultInterestRate: 10.99,
    minPaymentPercent: 3
  },
  student_loan: {
    label: 'Student Loan',
    defaultInterestRate: 5.99,
    minPaymentPercent: 1
  },
  auto_loan: {
    label: 'Auto Loan',
    defaultInterestRate: 4.99,
    minPaymentPercent: 2
  },
  mortgage: {
    label: 'Mortgage',
    defaultInterestRate: 3.99,
    minPaymentPercent: 0.5
  },
  other: {
    label: 'Other',
    defaultInterestRate: 8.99,
    minPaymentPercent: 2
  }
} as const;

export function safeParseFloat(value: string | number, min: number = 0, max: number = 1000000): number {
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(parsed)) return 0;
  return Math.max(min, Math.min(max, parsed));
}

export function calculateMonthlyInterest(balance: Decimal, annualRate: Decimal): Decimal {
  return balance.times(annualRate.div(100)).div(12);
}

export function getDebtPriority(
  debt: DebtSnapshot,
  strategy: PayoffStrategy
): Decimal {
  switch (strategy) {
    case 'avalanche':
      return new Decimal(debt.interestRate);
    case 'snowball':
      return new Decimal(1).div(debt.balance);
    case 'custom':
      return new Decimal(debt.priority || 0);
    default:
      return new Decimal(0);
  }
}

export function allocatePayments(
  debts: DebtSnapshot[],
  totalPayment: Decimal,
  strategy: PayoffStrategy
): MonthlyPaymentSummary {
  const allocations: PaymentAllocation[] = [];
  let remainingPayment = totalPayment;
  const completedDebts: string[] = [];

  // First, allocate minimum payments
  debts.forEach(debt => {
    if (debt.balance.greaterThan(0)) {
      const allocation: PaymentAllocation = {
        debtId: debt.id,
        amount: Decimal.min(debt.minimumPayment, debt.balance),
        isExtra: false
      };
      allocations.push(allocation);
      remainingPayment = remainingPayment.minus(allocation.amount);
    }
  });

  // Then, allocate extra payment based on strategy
  if (remainingPayment.greaterThan(0)) {
    const sortedDebts = [...debts]
      .filter(debt => debt.balance.greaterThan(0))
      .sort((a, b) => 
        getDebtPriority(b, strategy)
          .minus(getDebtPriority(a, strategy))
          .toNumber()
      );

    for (const debt of sortedDebts) {
      if (remainingPayment.lessThanOrEqualTo(0)) break;

      const existingAllocation = allocations.find(a => a.debtId === debt.id);
      const remainingDebtBalance = debt.balance.minus(existingAllocation?.amount || 0);
      
      if (remainingDebtBalance.greaterThan(0)) {
        const extraPayment = Decimal.min(remainingPayment, remainingDebtBalance);
        allocations.push({
          debtId: debt.id,
          amount: extraPayment,
          isExtra: true
        });
        remainingPayment = remainingPayment.minus(extraPayment);
      }
    }
  }

  // Check for completed debts
  debts.forEach(debt => {
    const totalAllocated = allocations
      .filter(a => a.debtId === debt.id)
      .reduce((sum, a) => sum.plus(a.amount), new Decimal(0));
    
    if (totalAllocated.greaterThanOrEqualTo(debt.balance)) {
      completedDebts.push(debt.id);
    }
  });

  return {
    totalPayment: totalPayment.minus(remainingPayment),
    allocations,
    completedDebts
  };
}

export function calculatePayoffSchedule(
  debts: Debt[],
  extraPayment: number,
  strategy: PayoffStrategy
): DebtPayoffResult {
  let currentDate = new Date();
  const paymentSchedule: PaymentSchedule[] = [];
  let month = 1;
  let totalInterestPaid = new Decimal(0);
  
  // Convert debts to snapshots for calculations
  let debtSnapshots: DebtSnapshot[] = debts.map(debt => ({
    id: debt.id,
    balance: new Decimal(debt.balance),
    interestRate: new Decimal(debt.interestRate),
    minimumPayment: new Decimal(debt.minimumPayment),
    priority: debt.priority
  }));

  const minimumPaymentTotal = debtSnapshots.reduce(
    (sum, debt) => sum.plus(debt.minimumPayment),
    new Decimal(0)
  );
  const totalPayment = minimumPaymentTotal.plus(extraPayment);
  const debtPayoffOrder: string[] = [];

  while (debtSnapshots.some(debt => debt.balance.greaterThan(0))) {
    const { allocations, completedDebts } = allocatePayments(
      debtSnapshots,
      totalPayment,
      strategy
    );

    // Record newly completed debts
    completedDebts.forEach(debtId => {
      if (!debtPayoffOrder.includes(debtId)) {
        debtPayoffOrder.push(debtId);
      }
    });

    // Update balances and record payments
    debtSnapshots.forEach(debt => {
      if (debt.balance.greaterThan(0)) {
        const monthlyInterest = calculateMonthlyInterest(debt.balance, debt.interestRate);
        totalInterestPaid = totalInterestPaid.plus(monthlyInterest);

        const debtAllocations = allocations.filter(a => a.debtId === debt.id);
        const totalPayment = debtAllocations.reduce(
          (sum, a) => sum.plus(a.amount),
          new Decimal(0)
        );

        const principalPaid = totalPayment.minus(monthlyInterest);
        const startingBalance = debt.balance;
        debt.balance = Decimal.max(0, debt.balance.plus(monthlyInterest).minus(totalPayment));

        paymentSchedule.push({
          month,
          debtId: debt.id,
          startingBalance: startingBalance.toNumber(),
          payment: totalPayment.toNumber(),
          interestPaid: monthlyInterest.toNumber(),
          principalPaid: principalPaid.toNumber(),
          endingBalance: debt.balance.toNumber(),
          isComplete: debt.balance.equals(0)
        });
      }
    });

    month++;
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + month - 1);

  const originalInterest = calculateTotalInterestWithoutExtra(debts);
  const totalInterestSaved = originalInterest.minus(totalInterestPaid);

  return {
    totalPayment: totalPayment.toNumber(),
    minimumPaymentTotal: minimumPaymentTotal.toNumber(),
    totalInterestPaid: totalInterestPaid.toNumber(),
    totalInterestSaved: totalInterestSaved.toNumber(),
    payoffDate,
    monthsToPayoff: month - 1,
    paymentSchedule,
    debtPayoffOrder
  };
}

function calculateTotalInterestWithoutExtra(debts: Debt[]): Decimal {
  let totalInterest = new Decimal(0);
  
  debts.forEach(debt => {
    const balance = new Decimal(debt.balance);
    const monthlyRate = new Decimal(debt.interestRate).div(1200);
    const payment = new Decimal(debt.minimumPayment);
    
    if (monthlyRate.equals(0)) {
      const months = balance.div(payment).ceil();
      return months.toNumber();
    }
    
    // Using logarithmic formula for loan amortization
    const months = balance.times(monthlyRate)
      .div(payment.minus(balance.times(monthlyRate)))
      .neg()
      .ln()
      .div(monthlyRate.plus(1).ln())
      .ceil();
      
    const totalPayments = payment.times(months);
    totalInterest = totalInterest.plus(totalPayments.minus(balance));
  });
  
  return totalInterest;
}

export function validateDebt(debt: Debt): boolean {
  return (
    debt.balance > 0 &&
    debt.minimumPayment > 0 &&
    debt.minimumPayment <= debt.balance &&
    debt.interestRate >= 0 &&
    debt.interestRate <= 100 &&
    debt.name.trim().length > 0
  );
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
