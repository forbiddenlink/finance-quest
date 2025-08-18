import { Decimal } from 'decimal.js';
import {
  CreditProfile,
  CreditAccount,
  CreditInquiry,
  ScoreImpact,
  ScoreSimulation,
  ValidationError,
  CreditFactor,
  PaymentStatus
} from './types';
import {
  FACTOR_WEIGHTS,
  PAYMENT_IMPACT,
  UTILIZATION_THRESHOLDS,
  ACCOUNT_AGE_IMPACT,
  CREDIT_MIX_SCORES,
  INQUIRY_IMPACT,
  VALIDATION_RULES,
  SCORE_RANGES
} from './constants';

export function validateProfile(profile: CreditProfile): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate accounts
  profile.accounts.forEach((account, index) => {
    if (account.balance < VALIDATION_RULES.balance.min || 
        account.balance > VALIDATION_RULES.balance.max) {
      errors.push({
        field: `account-${index}-balance`,
        message: `Balance must be between ${formatCurrency(VALIDATION_RULES.balance.min)} and ${formatCurrency(VALIDATION_RULES.balance.max)}`
      });
    }

    if (account.creditLimit < VALIDATION_RULES.creditLimit.min || 
        account.creditLimit > VALIDATION_RULES.creditLimit.max) {
      errors.push({
        field: `account-${index}-creditLimit`,
        message: `Credit limit must be between ${formatCurrency(VALIDATION_RULES.creditLimit.min)} and ${formatCurrency(VALIDATION_RULES.creditLimit.max)}`
      });
    }

    if (account.monthlyPayment < VALIDATION_RULES.monthlyPayment.min || 
        account.monthlyPayment > VALIDATION_RULES.monthlyPayment.max) {
      errors.push({
        field: `account-${index}-monthlyPayment`,
        message: `Monthly payment must be between ${formatCurrency(VALIDATION_RULES.monthlyPayment.min)} and ${formatCurrency(VALIDATION_RULES.monthlyPayment.max)}`
      });
    }

    const accountAge = getAccountAgeInMonths(account.openDate);
    if (accountAge < VALIDATION_RULES.accountAge.min || 
        accountAge > VALIDATION_RULES.accountAge.max) {
      errors.push({
        field: `account-${index}-openDate`,
        message: `Account age must be between ${VALIDATION_RULES.accountAge.min} and ${VALIDATION_RULES.accountAge.max} months`
      });
    }

    account.paymentHistory.forEach((payment, paymentIndex) => {
      if (payment.amount < VALIDATION_RULES.paymentAmount.min || 
          payment.amount > VALIDATION_RULES.paymentAmount.max) {
        errors.push({
          field: `account-${index}-payment-${paymentIndex}-amount`,
          message: `Payment amount must be between ${formatCurrency(VALIDATION_RULES.paymentAmount.min)} and ${formatCurrency(VALIDATION_RULES.paymentAmount.max)}`
        });
      }
    });
  });

  return errors;
}

export function calculateBaseScore(profile: CreditProfile): number {
  const paymentHistoryScore = calculatePaymentHistoryScore(profile);
  const utilizationScore = calculateUtilizationScore(profile);
  const creditAgeScore = calculateCreditAgeScore(profile);
  const creditMixScore = calculateCreditMixScore(profile);
  const newCreditScore = calculateNewCreditScore(profile);

  return new Decimal(paymentHistoryScore)
    .times(FACTOR_WEIGHTS.payment_history)
    .plus(new Decimal(utilizationScore).times(FACTOR_WEIGHTS.credit_utilization))
    .plus(new Decimal(creditAgeScore).times(FACTOR_WEIGHTS.credit_age))
    .plus(new Decimal(creditMixScore).times(FACTOR_WEIGHTS.credit_mix))
    .plus(new Decimal(newCreditScore).times(FACTOR_WEIGHTS.new_credit))
    .toNumber();
}

function calculatePaymentHistoryScore(profile: CreditProfile): number {
  let score = 850;

  // Deduct for late payments
  profile.accounts.forEach(account => {
    account.paymentHistory.forEach(payment => {
      score += PAYMENT_IMPACT[payment.status];
    });
  });

  // Deduct for collection accounts
  score -= profile.collectionAccounts * Math.abs(PAYMENT_IMPACT.collection);

  // Deduct for bankruptcies
  score -= profile.bankruptcies * 200;

  return Math.max(300, score);
}

function calculateUtilizationScore(profile: CreditProfile): number {
  const utilization = new Decimal(profile.totalBalances)
    .div(profile.totalCreditLimit)
    .toNumber();

  if (utilization <= UTILIZATION_THRESHOLDS.excellent) return 850;
  if (utilization <= UTILIZATION_THRESHOLDS.good) return 750;
  if (utilization <= UTILIZATION_THRESHOLDS.fair) return 650;
  if (utilization <= UTILIZATION_THRESHOLDS.poor) return 550;
  return 350;
}

function calculateCreditAgeScore(profile: CreditProfile): number {
  let score = 850;

  if (profile.oldestAccountAge < 6) {
    score += ACCOUNT_AGE_IMPACT.less_than_6m;
  } else if (profile.oldestAccountAge < 12) {
    score += ACCOUNT_AGE_IMPACT.six_to_12m;
  } else if (profile.oldestAccountAge < 24) {
    score += ACCOUNT_AGE_IMPACT.one_to_two_years;
  } else if (profile.oldestAccountAge < 60) {
    score += ACCOUNT_AGE_IMPACT.two_to_five_years;
  } else {
    score += ACCOUNT_AGE_IMPACT.five_plus_years;
  }

  // Adjust for average account age
  if (profile.averageAccountAge < profile.oldestAccountAge / 2) {
    score -= 20;
  }

  return Math.max(300, score);
}

function calculateCreditMixScore(profile: CreditProfile): number {
  const accountTypes = new Set(profile.accounts.map(a => a.type));
  const diversityScore = accountTypes.size;

  if (diversityScore >= 4) return 850 + CREDIT_MIX_SCORES.diverse;
  if (diversityScore === 3) return 750 + CREDIT_MIX_SCORES.moderate;
  if (diversityScore === 2) return 650 + CREDIT_MIX_SCORES.limited;
  return 550 + CREDIT_MIX_SCORES.poor;
}

function calculateNewCreditScore(profile: CreditProfile): number {
  let score = 850;
  const recentInquiries = profile.inquiries.filter(
    inquiry => getMonthsDifference(new Date(), inquiry.date) <= 12
  );

  // Deduct for recent inquiries
  recentInquiries.forEach((inquiry, index) => {
    if (index === 0) {
      score += INQUIRY_IMPACT.initial;
    } else {
      score += INQUIRY_IMPACT.additional_within_14d;
    }
  });

  return Math.max(300, score);
}

export function analyzeScoreFactors(profile: CreditProfile): ScoreImpact[] {
  const impacts: ScoreImpact[] = [];
  const baseScore = calculateBaseScore(profile);

  // Payment History
  if (profile.recentLatePayments > 0 || profile.collectionAccounts > 0) {
    impacts.push({
      factor: 'payment_history',
      currentScore: baseScore,
      potentialImprovement: 50,
      timeToImprove: '12-24 months',
      suggestedActions: [
        'Make all payments on time',
        'Set up automatic payments',
        'Address collection accounts'
      ]
    });
  }

  // Credit Utilization
  const utilization = new Decimal(profile.totalBalances)
    .div(profile.totalCreditLimit)
    .times(100)
    .toNumber();

  if (utilization > 30) {
    impacts.push({
      factor: 'credit_utilization',
      currentScore: baseScore,
      potentialImprovement: 40,
      timeToImprove: '1-3 months',
      suggestedActions: [
        'Pay down credit card balances',
        'Request credit limit increases',
        'Keep utilization below 30%'
      ]
    });
  }

  // Credit Age
  if (profile.averageAccountAge < 24) {
    impacts.push({
      factor: 'credit_age',
      currentScore: baseScore,
      potentialImprovement: 20,
      timeToImprove: '12-24 months',
      suggestedActions: [
        'Keep old accounts open',
        'Limit new account openings',
        'Be patient as accounts age'
      ]
    });
  }

  // Credit Mix
  const accountTypes = new Set(profile.accounts.map(a => a.type));
  if (accountTypes.size < 3) {
    impacts.push({
      factor: 'credit_mix',
      currentScore: baseScore,
      potentialImprovement: 15,
      timeToImprove: '6-12 months',
      suggestedActions: [
        'Consider adding a different type of credit',
        'Mix revolving and installment credit',
        'Maintain a diverse credit portfolio'
      ]
    });
  }

  // New Credit
  const recentInquiries = profile.inquiries.filter(
    inquiry => getMonthsDifference(new Date(), inquiry.date) <= 6
  );
  if (recentInquiries.length > 2) {
    impacts.push({
      factor: 'new_credit',
      currentScore: baseScore,
      potentialImprovement: 10,
      timeToImprove: '3-6 months',
      suggestedActions: [
        'Limit new credit applications',
        'Wait for recent inquiries to age',
        'Only apply for needed credit'
      ]
    });
  }

  return impacts;
}

export function simulateScoreChange(
  profile: CreditProfile,
  action: {
    type: 'pay_down_balance' | 'add_account' | 'close_account' | 'late_payment' | 'collection';
    details: Record<string, any>;
  }
): ScoreSimulation {
  const baseScore = calculateBaseScore(profile);
  const changes: ScoreSimulation['changes'] = [];
  let simulatedScore = baseScore;

  switch (action.type) {
    case 'pay_down_balance': {
      const paymentAmount = action.details.amount;
      const newUtilization = new Decimal(profile.totalBalances - paymentAmount)
        .div(profile.totalCreditLimit)
        .times(100)
        .toNumber();
      
      const utilizationImpact = calculateUtilizationImpact(newUtilization);
      simulatedScore += utilizationImpact;
      changes.push({
        factor: 'credit_utilization',
        impact: utilizationImpact,
        description: `Paying down ${formatCurrency(paymentAmount)} would reduce utilization to ${formatPercentage(newUtilization)}`
      });
      break;
    }

    case 'add_account': {
      const mixImpact = 10;
      const inquiryImpact = -5;
      simulatedScore += mixImpact + inquiryImpact;
      changes.push(
        {
          factor: 'credit_mix',
          impact: mixImpact,
          description: 'Improved credit mix diversity'
        },
        {
          factor: 'new_credit',
          impact: inquiryImpact,
          description: 'New credit inquiry impact'
        }
      );
      break;
    }

    case 'close_account': {
      const ageImpact = -5;
      const utilizationImpact = calculateUtilizationImpactAfterClose(
        profile,
        action.details.accountId
      );
      simulatedScore += ageImpact + utilizationImpact;
      changes.push(
        {
          factor: 'credit_age',
          impact: ageImpact,
          description: 'Reduced average account age'
        },
        {
          factor: 'credit_utilization',
          impact: utilizationImpact,
          description: 'Changed overall credit utilization'
        }
      );
      break;
    }

    case 'late_payment': {
      const impact = PAYMENT_IMPACT[action.details.status as PaymentStatus];
      simulatedScore += impact;
      changes.push({
        factor: 'payment_history',
        impact,
        description: `Impact of ${action.details.status} payment`
      });
      break;
    }

    case 'collection': {
      const impact = -150;
      simulatedScore += impact;
      changes.push({
        factor: 'payment_history',
        impact,
        description: 'Impact of account in collections'
      });
      break;
    }
  }

  return {
    baseScore,
    simulatedScore: Math.max(300, Math.min(850, simulatedScore)),
    changes,
    timeToRecover: getRecoveryTime(action.type)
  };
}

function calculateUtilizationImpact(newUtilization: number): number {
  if (newUtilization <= 10) return 20;
  if (newUtilization <= 30) return 10;
  if (newUtilization <= 50) return 0;
  if (newUtilization <= 75) return -10;
  return -20;
}

function calculateUtilizationImpactAfterClose(
  profile: CreditProfile,
  accountId: string
): number {
  const account = profile.accounts.find(a => a.id === accountId);
  if (!account) return 0;

  const newTotalLimit = profile.totalCreditLimit - account.creditLimit;
  const newTotalBalance = profile.totalBalances - account.balance;
  const newUtilization = new Decimal(newTotalBalance)
    .div(newTotalLimit)
    .times(100)
    .toNumber();

  return calculateUtilizationImpact(newUtilization);
}

function getRecoveryTime(actionType: string): string {
  switch (actionType) {
    case 'pay_down_balance':
      return '1-3 months';
    case 'add_account':
      return '6-12 months';
    case 'close_account':
      return '12-24 months';
    case 'late_payment':
      return '12-24 months';
    case 'collection':
      return '7 years';
    default:
      return 'varies';
  }
}

export function getScoreRange(score: number): keyof typeof SCORE_RANGES {
  if (score >= SCORE_RANGES.excellent.min) return 'excellent';
  if (score >= SCORE_RANGES.very_good.min) return 'very_good';
  if (score >= SCORE_RANGES.good.min) return 'good';
  if (score >= SCORE_RANGES.fair.min) return 'fair';
  return 'poor';
}

export function getAccountAgeInMonths(openDate: Date): number {
  return getMonthsDifference(new Date(), openDate);
}

export function getMonthsDifference(date1: Date, date2: Date): number {
  const months = (date1.getFullYear() - date2.getFullYear()) * 12;
  return months + date1.getMonth() - date2.getMonth();
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
