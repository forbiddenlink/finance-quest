import { Decimal } from 'decimal.js';
import {
  ExistingDebt,
  BalanceTransferCard,
  TransferScenario,
  PaymentSchedule,
  DebtAnalysis,
  ValidationError
} from './types';
import {
  VALIDATION_RULES,
  ANALYSIS_THRESHOLDS,
  INTEREST_RATE_THRESHOLDS
} from './constants';

export function calculateTransferFee(
  amount: number,
  card: BalanceTransferCard
): number {
  const fee = new Decimal(amount).times(card.transferFeeRate).dividedBy(100);
  return Decimal.max(fee, card.transferFeeMin).toNumber();
}

export function calculateMonthlyPayment(
  balance: number,
  interestRate: number,
  months: number
): number {
  if (interestRate === 0) {
    return new Decimal(balance).dividedBy(months).toNumber();
  }

  const monthlyRate = new Decimal(interestRate).dividedBy(1200); // Convert APR to monthly rate
  const denominator = new Decimal(1).minus(
    new Decimal(1).plus(monthlyRate).pow(-months)
  );
  
  return new Decimal(balance).times(monthlyRate).dividedBy(denominator).toNumber();
}

export function generatePaymentSchedule(
  balance: number,
  monthlyPayment: number,
  card: BalanceTransferCard,
  transferFee: number
): PaymentSchedule[] {
  const schedule: PaymentSchedule[] = [];
  let remainingBalance = new Decimal(balance).plus(transferFee);
  let month = 1;

  while (remainingBalance.greaterThan(0) && month <= 120) { // Cap at 10 years
    const isIntroPeriod = month <= card.introPeriod;
    const currentRate = isIntroPeriod ? card.introAPR : card.regularAPR;
    const monthlyRate = new Decimal(currentRate).dividedBy(1200);
    
    const interest = remainingBalance.times(monthlyRate);
    const principal = Decimal.min(
      monthlyPayment,
      remainingBalance.plus(interest)
    ).minus(interest);
    
    const payment = principal.plus(interest);
    remainingBalance = remainingBalance.minus(principal);

    schedule.push({
      month,
      payment: payment.toNumber(),
      principal: principal.toNumber(),
      interest: interest.toNumber(),
      remainingBalance: remainingBalance.toNumber(),
      isIntroPeriod,
      interestRate: currentRate
    });

    month++;
  }

  return schedule;
}

export function analyzeTransferScenario(
  debts: ExistingDebt[],
  selectedDebts: string[],
  card: BalanceTransferCard,
  monthlyPayment?: number
): TransferScenario {
  const transferredDebts = debts.filter(debt => selectedDebts.includes(debt.id));
  const remainingDebts = debts.filter(debt => !selectedDebts.includes(debt.id));
  
  const totalTransferred = transferredDebts.reduce(
    (sum, debt) => sum.plus(debt.balance),
    new Decimal(0)
  ).toNumber();

  const transferFee = calculateTransferFee(totalTransferred, card);

  // Calculate optimal monthly payment if not provided
  const suggestedPayment = calculateMonthlyPayment(
    totalTransferred + transferFee,
    card.regularAPR,
    card.introPeriod
  );

  const payment = monthlyPayment || suggestedPayment;
  const schedule = generatePaymentSchedule(
    totalTransferred,
    payment,
    card,
    transferFee
  );

  const totalInterest = schedule.reduce(
    (sum, month) => sum.plus(month.interest),
    new Decimal(0)
  ).toNumber();

  const totalCost = new Decimal(totalTransferred)
    .plus(transferFee)
    .plus(totalInterest)
    .toNumber();

  // Calculate what it would cost without transfer
  const originalInterest = transferredDebts.reduce((sum, debt) => {
    const schedule = generatePaymentSchedule(
      debt.balance,
      debt.monthlyPayment || debt.minimumPayment,
      {
        ...card,
        introAPR: debt.interestRate,
        regularAPR: debt.interestRate,
        introPeriod: 0,
        transferFeeRate: 0,
        transferFeeMin: 0,
        annualFee: 0,
        additionalBenefits: []
      },
      0
    );
    return sum.plus(
      schedule.reduce((int, month) => int.plus(month.interest), new Decimal(0))
    );
  }, new Decimal(0));

  const savings = originalInterest.minus(totalInterest).minus(transferFee).toNumber();

  return {
    cardId: card.id,
    transferredDebts: selectedDebts,
    totalTransferred,
    transferFee,
    monthlyPayment: payment,
    payoffPeriod: schedule.length,
    totalInterest,
    totalCost,
    savings,
    remainingDebts
  };
}

export function generateDebtAnalysis(
  debts: ExistingDebt[],
  selectedDebts: string[],
  card: BalanceTransferCard,
  monthlyPayment?: number
): DebtAnalysis {
  // Calculate original debt metrics
  const originalTotalDebt = debts.reduce(
    (sum, debt) => sum + debt.balance,
    0
  );

  const originalMonthlyPayment = debts.reduce(
    (sum, debt) => sum + (debt.monthlyPayment || debt.minimumPayment),
    0
  );

  let originalPayoffTime = 0;
  let originalTotalInterest = 0;

  debts.forEach(debt => {
    const schedule = generatePaymentSchedule(
      debt.balance,
      debt.monthlyPayment || debt.minimumPayment,
      {
        ...card,
        introAPR: debt.interestRate,
        regularAPR: debt.interestRate,
        introPeriod: 0,
        transferFeeRate: 0,
        transferFeeMin: 0,
        annualFee: 0,
        additionalBenefits: []
      },
      0
    );
    originalPayoffTime = Math.max(originalPayoffTime, schedule.length);
    originalTotalInterest += schedule.reduce(
      (sum, month) => sum + month.interest,
      0
    );
  });

  const originalTotalCost = originalTotalDebt + originalTotalInterest;

  // Generate best scenario
  const bestScenario = analyzeTransferScenario(
    debts,
    selectedDebts,
    card,
    monthlyPayment
  );

  // Generate alternative scenarios
  const alternativeScenarios: TransferScenario[] = [];

  // Try different monthly payment amounts
  const paymentOptions = [
    bestScenario.monthlyPayment * 0.75,
    bestScenario.monthlyPayment * 1.25,
    bestScenario.monthlyPayment * 1.5
  ];

  paymentOptions.forEach(payment => {
    if (payment >= VALIDATION_RULES.monthlyPayment.min) {
      alternativeScenarios.push(
        analyzeTransferScenario(debts, selectedDebts, card, payment)
      );
    }
  });

  // Generate payment schedule
  const paymentSchedule = generatePaymentSchedule(
    bestScenario.totalTransferred,
    bestScenario.monthlyPayment,
    card,
    bestScenario.transferFee
  );

  // Generate recommendations
  const recommendations = [];

  // Check if savings are significant
  if (bestScenario.savings > ANALYSIS_THRESHOLDS.significantSavings) {
    recommendations.push({
      title: 'Proceed with Balance Transfer',
      description: `Transfer could save you ${formatCurrency(bestScenario.savings)}`,
      impact: bestScenario.savings
    });
  } else if (bestScenario.savings > 0) {
    recommendations.push({
      title: 'Consider Balance Transfer',
      description: 'Savings are modest but positive',
      impact: bestScenario.savings
    });
  } else {
    recommendations.push({
      title: 'Avoid Balance Transfer',
      description: 'Transfer would not save money',
      impact: bestScenario.savings
    });
  }

  // Check if monthly payment could be optimized
  const bestAlternative = alternativeScenarios.reduce((best, current) =>
    current.savings > best.savings ? current : best
  , bestScenario);

  if (bestAlternative.savings > bestScenario.savings + ANALYSIS_THRESHOLDS.worthwhileTransfer) {
    recommendations.push({
      title: 'Increase Monthly Payment',
      description: `Paying ${formatCurrency(bestAlternative.monthlyPayment)} monthly could save an additional ${
        formatCurrency(bestAlternative.savings - bestScenario.savings)
      }`,
      impact: bestAlternative.savings - bestScenario.savings
    });
  }

  return {
    originalTotalDebt,
    originalMonthlyPayment,
    originalPayoffTime,
    originalTotalInterest,
    originalTotalCost,
    bestScenario,
    alternativeScenarios,
    paymentSchedule,
    recommendations
  };
}

export function validateInputs(
  debts: ExistingDebt[],
  selectedDebts: string[],
  card?: BalanceTransferCard,
  monthlyPayment?: number
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate debts
  if (debts.length === 0) {
    errors.push({
      field: 'debts',
      message: 'Add at least one debt to analyze'
    });
  }

  debts.forEach(debt => {
    if (debt.balance < VALIDATION_RULES.balance.min) {
      errors.push({
        field: `${debt.id}_balance`,
        message: `Balance must be at least ${formatCurrency(VALIDATION_RULES.balance.min)}`
      });
    }
    if (debt.balance > VALIDATION_RULES.balance.max) {
      errors.push({
        field: `${debt.id}_balance`,
        message: `Balance cannot exceed ${formatCurrency(VALIDATION_RULES.balance.max)}`
      });
    }
    if (debt.interestRate < VALIDATION_RULES.interestRate.min) {
      errors.push({
        field: `${debt.id}_rate`,
        message: 'Interest rate cannot be negative'
      });
    }
    if (debt.interestRate > VALIDATION_RULES.interestRate.max) {
      errors.push({
        field: `${debt.id}_rate`,
        message: `Interest rate seems unusually high`
      });
    }
    if (debt.minimumPayment < VALIDATION_RULES.minimumPayment.min) {
      errors.push({
        field: `${debt.id}_minimum`,
        message: `Minimum payment must be at least ${formatCurrency(VALIDATION_RULES.minimumPayment.min)}`
      });
    }
    if (debt.monthlyPayment && debt.monthlyPayment < debt.minimumPayment) {
      errors.push({
        field: `${debt.id}_payment`,
        message: 'Monthly payment cannot be less than minimum payment'
      });
    }
  });

  // Validate selected debts
  if (selectedDebts.length === 0) {
    errors.push({
      field: 'selectedDebts',
      message: 'Select at least one debt to transfer'
    });
  }

  // Validate card selection
  if (!card) {
    errors.push({
      field: 'card',
      message: 'Select a balance transfer card'
    });
  }

  // Validate monthly payment
  if (monthlyPayment !== undefined) {
    if (monthlyPayment < VALIDATION_RULES.monthlyPayment.min) {
      errors.push({
        field: 'monthlyPayment',
        message: `Monthly payment must be at least ${formatCurrency(VALIDATION_RULES.monthlyPayment.min)}`
      });
    }

    const totalDebt = selectedDebts.reduce(
      (sum, id) => sum + (debts.find(d => d.id === id)?.balance || 0),
      0
    );

    if (card && monthlyPayment < calculateMonthlyPayment(totalDebt, card.regularAPR, 120)) {
      errors.push({
        field: 'monthlyPayment',
        message: 'Monthly payment too low to pay off debt within 10 years'
      });
    }
  }

  return errors;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

export function formatMonths(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${months} month${months === 1 ? '' : 's'}`;
  }
  
  if (remainingMonths === 0) {
    return `${years} year${years === 1 ? '' : 's'}`;
  }
  
  return `${years} year${years === 1 ? '' : 's'} and ${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`;
}

export function getInterestRateCategory(rate: number): 'high' | 'medium' | 'low' {
  if (rate >= INTEREST_RATE_THRESHOLDS.high) return 'high';
  if (rate >= INTEREST_RATE_THRESHOLDS.medium) return 'medium';
  return 'low';
}
