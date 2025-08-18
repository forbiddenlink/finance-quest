import { Decimal } from 'decimal.js';
import {
  CreditReportState,
  CreditAccount,
  CreditInquiry,
  PublicRecord,
  CreditAlert,
  Discrepancy,
  ReportAnalysis,
  ValidationError,
  AccountType,
  AccountStatus,
  AlertType
} from './types';
import {
  VALIDATION_RULES,
  ACCOUNT_TYPE_INFO,
  ALERT_TYPE_INFO
} from './constants';

export function validateReport(state: CreditReportState): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate accounts
  state.accounts.forEach((account, index) => {
    if (account.balance < VALIDATION_RULES.balance.min || 
        account.balance > VALIDATION_RULES.balance.max) {
      errors.push({
        field: `account-${index}-balance`,
        message: `Balance must be between ${formatCurrency(VALIDATION_RULES.balance.min)} and ${formatCurrency(VALIDATION_RULES.balance.max)}`
      });
    }

    if (account.creditLimit !== undefined && (
        account.creditLimit < VALIDATION_RULES.creditLimit.min || 
        account.creditLimit > VALIDATION_RULES.creditLimit.max)) {
      errors.push({
        field: `account-${index}-creditLimit`,
        message: `Credit limit must be between ${formatCurrency(VALIDATION_RULES.creditLimit.min)} and ${formatCurrency(VALIDATION_RULES.creditLimit.max)}`
      });
    }

    if (account.monthlyPayment !== undefined && (
        account.monthlyPayment < VALIDATION_RULES.monthlyPayment.min || 
        account.monthlyPayment > VALIDATION_RULES.monthlyPayment.max)) {
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

export function analyzeReport(state: CreditReportState): ReportAnalysis {
  const accountAnalysis = analyzeAccounts(state.accounts);
  const paymentAnalysis = analyzePaymentHistory(state.accounts);
  const inquiryAnalysis = analyzeInquiries(state.inquiries);
  const publicRecordAnalysis = analyzePublicRecords(state.publicRecords);
  const alertAnalysis = analyzeAlerts(state.alerts);
  const discrepancyAnalysis = analyzeDiscrepancies(state.discrepancies);

  return {
    accounts: accountAnalysis,
    paymentHistory: paymentAnalysis,
    inquiries: inquiryAnalysis,
    publicRecords: publicRecordAnalysis,
    alerts: alertAnalysis,
    discrepancies: discrepancyAnalysis
  };
}

function analyzeAccounts(accounts: CreditAccount[]): ReportAnalysis['accounts'] {
  const byType = accounts.reduce((acc, account) => {
    acc[account.type] = (acc[account.type] || 0) + 1;
    return acc;
  }, {} as Record<AccountType, number>);

  const byStatus = accounts.reduce((acc, account) => {
    acc[account.status] = (acc[account.status] || 0) + 1;
    return acc;
  }, {} as Record<AccountStatus, number>);

  const ages = accounts.map(account => getAccountAgeInMonths(account.openDate));
  const averageAge = ages.length
    ? ages.reduce((sum, age) => sum + age, 0) / ages.length
    : 0;

  const totalBalances = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalLimits = accounts.reduce((sum, account) => sum + (account.creditLimit || 0), 0);
  const utilization = totalLimits > 0
    ? new Decimal(totalBalances).div(totalLimits).times(100).toNumber()
    : 0;

  return {
    total: accounts.length,
    byType,
    byStatus,
    averageAge,
    totalBalances,
    totalLimits,
    utilization
  };
}

function analyzePaymentHistory(accounts: CreditAccount[]): ReportAnalysis['paymentHistory'] {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  let totalPayments = 0;
  let latePayments = {
    last30Days: 0,
    last60Days: 0,
    last90Days: 0,
    lastYear: 0
  };

  accounts.forEach(account => {
    account.paymentHistory.forEach(payment => {
      totalPayments++;
      
      if (payment.status !== 'current') {
        const daysDiff = getDaysDifference(now, payment.date);
        
        if (daysDiff <= 30) latePayments.last30Days++;
        if (daysDiff <= 60) latePayments.last60Days++;
        if (daysDiff <= 90) latePayments.last90Days++;
        if (payment.date >= oneYearAgo) latePayments.lastYear++;
      }
    });
  });

  const onTimePercentage = totalPayments > 0
    ? new Decimal(totalPayments - latePayments.lastYear)
        .div(totalPayments)
        .times(100)
        .toNumber()
    : 100;

  return {
    totalPayments,
    latePayments,
    onTimePercentage
  };
}

function analyzeInquiries(inquiries: CreditInquiry[]): ReportAnalysis['inquiries'] {
  const hardInquiries = inquiries.filter(inquiry => inquiry.type === 'hard').length;
  const recentInquiries = inquiries.filter(
    inquiry => getMonthsDifference(new Date(), inquiry.date) <= 12
  ).length;

  let impactLevel: 'none' | 'low' | 'medium' | 'high';
  if (recentInquiries <= 2) impactLevel = 'none';
  else if (recentInquiries <= 4) impactLevel = 'low';
  else if (recentInquiries <= 6) impactLevel = 'medium';
  else impactLevel = 'high';

  return {
    total: inquiries.length,
    hardInquiries,
    recentInquiries,
    impactLevel
  };
}

function analyzePublicRecords(records: PublicRecord[]): ReportAnalysis['publicRecords'] {
  return {
    total: records.length,
    bankruptcies: records.filter(record => record.type === 'bankruptcy').length,
    taxLiens: records.filter(record => record.type === 'tax_lien').length,
    civilJudgments: records.filter(record => record.type === 'civil_judgment').length,
    collections: records.filter(record => record.type === 'collection').length
  };
}

function analyzeAlerts(alerts: CreditAlert[]): ReportAnalysis['alerts'] {
  const byType = alerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {} as Record<AlertType, number>);

  const bySeverity = alerts.reduce((acc, alert) => {
    acc[alert.severity]++;
    return acc;
  }, { low: 0, medium: 0, high: 0 });

  return {
    total: alerts.length,
    byType,
    bySeverity
  };
}

function analyzeDiscrepancies(discrepancies: Discrepancy[]): ReportAnalysis['discrepancies'] {
  const byType = discrepancies.reduce((acc, discrepancy) => {
    acc[discrepancy.type] = (acc[discrepancy.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byImpact = discrepancies.reduce((acc, discrepancy) => {
    acc[discrepancy.impact]++;
    return acc;
  }, { none: 0, low: 0, medium: 0, high: 0 });

  return {
    total: discrepancies.length,
    byType,
    byImpact
  };
}

export function findDiscrepancies(state: CreditReportState): Discrepancy[] {
  const discrepancies: Discrepancy[] = [];

  // Group accounts by type and compare across bureaus
  const accountsByType = state.accounts.reduce((acc, account) => {
    if (!acc[account.type]) acc[account.type] = {};
    if (!acc[account.type][account.bureau]) acc[account.type][account.bureau] = [];
    acc[account.type][account.bureau].push(account);
    return acc;
  }, {} as Record<AccountType, Record<string, CreditAccount[]>>);

  Object.entries(accountsByType).forEach(([type, bureauAccounts]) => {
    const bureaus = Object.keys(bureauAccounts);
    for (let i = 0; i < bureaus.length; i++) {
      for (let j = i + 1; j < bureaus.length; j++) {
        const bureau1 = bureaus[i];
        const bureau2 = bureaus[j];
        
        compareAccounts(
          bureauAccounts[bureau1],
          bureauAccounts[bureau2],
          bureau1 as any,
          bureau2 as any,
          discrepancies
        );
      }
    }
  });

  return discrepancies;
}

function compareAccounts(
  accounts1: CreditAccount[],
  accounts2: CreditAccount[],
  bureau1: CreditAccount['bureau'],
  bureau2: CreditAccount['bureau'],
  discrepancies: Discrepancy[]
) {
  accounts1.forEach(acc1 => {
    const acc2 = accounts2.find(a => a.accountNumber === acc1.accountNumber);
    if (!acc2) return;

    // Compare balances
    if (Math.abs(acc1.balance - acc2.balance) > 100) {
      discrepancies.push({
        id: `${acc1.id}-${acc2.id}-balance`,
        type: 'balance',
        bureau1,
        bureau2,
        field: 'balance',
        value1: acc1.balance,
        value2: acc2.balance,
        impact: getBalanceDiscrepancyImpact(acc1.balance, acc2.balance),
        recommendation: 'Contact creditor to verify current balance'
      });
    }

    // Compare payment history
    const recentPayments1 = acc1.paymentHistory.slice(-12);
    const recentPayments2 = acc2.paymentHistory.slice(-12);
    
    recentPayments1.forEach((payment1, index) => {
      const payment2 = recentPayments2[index];
      if (!payment2) return;

      if (payment1.status !== payment2.status) {
        discrepancies.push({
          id: `${acc1.id}-${acc2.id}-payment-${index}`,
          type: 'payment_history',
          bureau1,
          bureau2,
          field: `payment_status_${formatDate(payment1.date)}`,
          value1: payment1.status,
          value2: payment2.status,
          impact: getPaymentDiscrepancyImpact(payment1.status, payment2.status),
          recommendation: 'Review payment records and dispute any errors'
        });
      }
    });
  });
}

function getBalanceDiscrepancyImpact(balance1: number, balance2: number): Discrepancy['impact'] {
  const diff = Math.abs(balance1 - balance2);
  const maxBalance = Math.max(balance1, balance2);
  const percentage = new Decimal(diff).div(maxBalance).times(100).toNumber();

  if (percentage <= 5) return 'none';
  if (percentage <= 10) return 'low';
  if (percentage <= 20) return 'medium';
  return 'high';
}

function getPaymentDiscrepancyImpact(
  status1: CreditAccount['paymentHistory'][0]['status'],
  status2: CreditAccount['paymentHistory'][0]['status']
): Discrepancy['impact'] {
  const statusSeverity = {
    current: 0,
    late_30: 1,
    late_60: 2,
    late_90: 3,
    collection: 4,
    charge_off: 5
  };

  const diff = Math.abs(statusSeverity[status1] - statusSeverity[status2]);
  if (diff === 0) return 'none';
  if (diff === 1) return 'low';
  if (diff === 2) return 'medium';
  return 'high';
}

export function getAccountAgeInMonths(openDate: Date): number {
  return getMonthsDifference(new Date(), openDate);
}

export function getMonthsDifference(date1: Date, date2: Date): number {
  const months = (date1.getFullYear() - date2.getFullYear()) * 12;
  return months + date1.getMonth() - date2.getMonth();
}

export function getDaysDifference(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
