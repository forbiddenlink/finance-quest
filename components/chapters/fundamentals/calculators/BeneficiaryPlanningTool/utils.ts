import {
  BeneficiaryPlanningInputs,
  BeneficiaryPlanningResults,
  Account,
  Beneficiary
} from './types';

// Account types that require beneficiary designations
const REQUIRED_DESIGNATION_ACCOUNTS = [
  'retirement',
  'life_insurance'
];

// Account types that support transfer on death
const TOD_ELIGIBLE_ACCOUNTS = [
  'bank',
  'investment'
];

// Minimum recommended review intervals by account type
const REVIEW_INTERVALS: Record<Account['type'], number> = {
  retirement: 12, // months
  life_insurance: 12,
  bank: 24,
  investment: 12,
  real_estate: 24,
  business: 12,
  other: 24
};

export function calculateTotalAssets(accounts: Account[]): number {
  return accounts.reduce((total, account) => total + account.value, 0);
}

export function calculateBeneficiarySummary(
  accounts: Account[]
): BeneficiaryPlanningResults['beneficiarySummary'] {
  const beneficiaryMap = new Map<string, {
    totalValue: number;
    accountTypes: Set<string>;
    isContingent: boolean;
  }>();

  const totalValue = calculateTotalAssets(accounts);

  accounts.forEach(account => {
    account.beneficiaries.forEach(beneficiary => {
      const key = beneficiary.name;
      const current = beneficiaryMap.get(key) || {
        totalValue: 0,
        accountTypes: new Set<string>(),
        isContingent: beneficiary.type === 'contingent'
      };

      const value = (account.value * beneficiary.percentage) / 100;
      current.totalValue += value;
      current.accountTypes.add(account.type);
      beneficiaryMap.set(key, current);
    });
  });

  return Array.from(beneficiaryMap.entries()).map(([name, data]) => ({
    beneficiaryName: name,
    totalValue: data.totalValue,
    percentageOfEstate: (data.totalValue / totalValue) * 100,
    accountTypes: Array.from(data.accountTypes),
    isContingent: data.isContingent
  }));
}

export function analyzeDesignationStatus(
  accounts: Account[]
): BeneficiaryPlanningResults['designationStatus'] {
  return accounts.map(account => {
    const issues: string[] = [];
    let status: 'complete' | 'incomplete' | 'review_needed' = 'complete';

    // Check if beneficiary designation is required
    if (REQUIRED_DESIGNATION_ACCOUNTS.includes(account.type) && !account.beneficiaries.length) {
      status = 'incomplete';
      issues.push('Required beneficiary designation missing');
    }

    // Check beneficiary percentages
    const totalPercentage = account.beneficiaries
      .filter(b => b.type === 'primary')
      .reduce((sum, b) => sum + b.percentage, 0);
    
    if (totalPercentage !== 100 && account.beneficiaries.length > 0) {
      status = 'incomplete';
      issues.push('Primary beneficiary percentages must total 100%');
    }

    // Check for contingent beneficiaries
    if (!account.beneficiaries.some(b => b.type === 'contingent')) {
      status = 'review_needed';
      issues.push('No contingent beneficiaries designated');
    }

    // Check last review date
    if (account.lastReviewed) {
      const monthsSinceReview = monthsBetween(new Date(account.lastReviewed), new Date());
      if (monthsSinceReview > REVIEW_INTERVALS[account.type]) {
        status = 'review_needed';
        issues.push(`Review overdue by ${monthsSinceReview - REVIEW_INTERVALS[account.type]} months`);
      }
    } else {
      status = 'review_needed';
      issues.push('No review date recorded');
    }

    return {
      accountDescription: account.description,
      status,
      issues
    };
  });
}

export function analyzeDistribution(
  accounts: Account[]
): BeneficiaryPlanningResults['distributionAnalysis'] {
  const analysis: BeneficiaryPlanningResults['distributionAnalysis'] = [];

  // Analyze retirement accounts
  const retirementAccounts = accounts.filter(a => a.type === 'retirement');
  if (retirementAccounts.length > 0) {
    const hasSpouseBeneficiary = retirementAccounts.some(a =>
      a.beneficiaries.some(b => b.relationship === 'spouse' && b.type === 'primary')
    );

    analysis.push({
      category: 'Retirement Accounts',
      analysis: hasSpouseBeneficiary
        ? 'Spousal beneficiary provides optimal tax treatment'
        : 'Consider tax implications of non-spousal beneficiaries',
      recommendations: hasSpouseBeneficiary
        ? ['Review spousal rollover options']
        : ['Consider spousal beneficiary for tax advantages', 'Review required distribution rules']
    });
  }

  // Analyze special needs beneficiaries
  const specialNeedsBeneficiaries = accounts.flatMap(a =>
    a.beneficiaries.filter(b => b.specialNeeds)
  );
  if (specialNeedsBeneficiaries.length > 0) {
    analysis.push({
      category: 'Special Needs Planning',
      analysis: 'Direct inheritance may affect government benefits',
      recommendations: [
        'Consider special needs trust',
        'Review impact on government benefits',
        'Consult with special needs planning attorney'
      ]
    });
  }

  // Analyze business interests
  const businessAccounts = accounts.filter(a => a.type === 'business');
  if (businessAccounts.length > 0) {
    analysis.push({
      category: 'Business Interests',
      analysis: 'Business succession planning needed',
      recommendations: [
        'Create buy-sell agreement',
        'Consider life insurance funding',
        'Review business valuation methods'
      ]
    });
  }

  // Analyze charitable giving
  const charityBeneficiaries = accounts.flatMap(a =>
    a.beneficiaries.filter(b => b.relationship === 'charity')
  );
  if (charityBeneficiaries.length > 0) {
    analysis.push({
      category: 'Charitable Giving',
      analysis: 'Charitable beneficiaries designated',
      recommendations: [
        'Verify charity tax ID numbers',
        'Consider charitable remainder trust',
        'Review tax deduction opportunities'
      ]
    });
  }

  return analysis;
}

export function generateReviewSchedule(
  accounts: Account[],
  reviewFrequency: BeneficiaryPlanningInputs['reviewFrequency']
): BeneficiaryPlanningResults['reviewSchedule'] {
  const today = new Date();
  const reviewIntervalMonths = {
    quarterly: 3,
    biannual: 6,
    annual: 12
  }[reviewFrequency];

  return accounts.map(account => {
    const lastReview = account.lastReviewed
      ? new Date(account.lastReviewed)
      : new Date(0);
    
    const monthsSinceReview = monthsBetween(lastReview, today);
    const standardInterval = REVIEW_INTERVALS[account.type];
    
    let priority: 'high' | 'medium' | 'low' = 'low';
    if (monthsSinceReview > standardInterval) {
      priority = 'high';
    } else if (monthsSinceReview > standardInterval * 0.75) {
      priority = 'medium';
    }

    const nextReview = new Date(Math.max(
      lastReview.getTime() + reviewIntervalMonths * 30 * 24 * 60 * 60 * 1000,
      today.getTime()
    ));

    return {
      accountDescription: account.description,
      lastReview: lastReview.toISOString().split('T')[0],
      nextReview: nextReview.toISOString().split('T')[0],
      priority
    };
  });
}

export function generateWarnings(
  inputs: BeneficiaryPlanningInputs
): BeneficiaryPlanningResults['warnings'] {
  const warnings: BeneficiaryPlanningResults['warnings'] = [];

  // Check for upcoming life events
  inputs.upcomingLifeEvents.forEach(event => {
    warnings.push({
      severity: 'high',
      message: `Review beneficiaries before ${event.event} on ${event.date}`,
      accountsAffected: event.impactedAccounts
    });
  });

  // Check for missing contingent beneficiaries
  const accountsWithoutContingent = inputs.accounts.filter(
    account => !account.beneficiaries.some(b => b.type === 'contingent')
  );
  if (accountsWithoutContingent.length > 0) {
    warnings.push({
      severity: 'medium',
      message: 'Missing contingent beneficiaries',
      accountsAffected: accountsWithoutContingent.map(a => a.description)
    });
  }

  // Check for special needs beneficiaries without trusts
  const specialNeedsWithoutTrust = inputs.accounts.filter(account =>
    account.beneficiaries.some(b => b.specialNeeds && !b.trustBeneficiary)
  );
  if (specialNeedsWithoutTrust.length > 0) {
    warnings.push({
      severity: 'high',
      message: 'Special needs beneficiaries should inherit through a trust',
      accountsAffected: specialNeedsWithoutTrust.map(a => a.description)
    });
  }

  // Check for overdue reviews
  const overdueAccounts = inputs.accounts.filter(account => {
    if (!account.lastReviewed) return true;
    const monthsSinceReview = monthsBetween(new Date(account.lastReviewed), new Date());
    return monthsSinceReview > REVIEW_INTERVALS[account.type];
  });
  if (overdueAccounts.length > 0) {
    warnings.push({
      severity: 'medium',
      message: 'Beneficiary designations overdue for review',
      accountsAffected: overdueAccounts.map(a => a.description)
    });
  }

  return warnings;
}

export function validateBeneficiaryPlanningInputs(inputs: BeneficiaryPlanningInputs): boolean {
  // Basic validation
  if (!inputs.accounts || !inputs.reviewFrequency) return false;

  // Account validation
  const validAccounts = inputs.accounts.every(account => {
    if (!account.type || !account.description || typeof account.value !== 'number') {
      return false;
    }

    // Beneficiary validation
    if (account.beneficiaries.length > 0) {
      const validBeneficiaries = account.beneficiaries.every(beneficiary =>
        beneficiary.name &&
        beneficiary.relationship &&
        beneficiary.type &&
        typeof beneficiary.percentage === 'number' &&
        beneficiary.percentage >= 0 &&
        beneficiary.percentage <= 100
      );

      if (!validBeneficiaries) return false;

      // Check primary beneficiary percentages total 100%
      const primaryTotal = account.beneficiaries
        .filter(b => b.type === 'primary')
        .reduce((sum, b) => sum + b.percentage, 0);
      
      if (Math.abs(primaryTotal - 100) > 0.01) return false;
    }

    return true;
  });

  // Life events validation
  const validEvents = inputs.upcomingLifeEvents.every(event =>
    event.event &&
    event.date &&
    Array.isArray(event.impactedAccounts) &&
    event.impactedAccounts.every(account => typeof account === 'string')
  );

  return validAccounts && validEvents;
}

export function calculateBeneficiaryPlan(
  inputs: BeneficiaryPlanningInputs
): BeneficiaryPlanningResults {
  const totalAssets = calculateTotalAssets(inputs.accounts);
  const beneficiarySummary = calculateBeneficiarySummary(inputs.accounts);
  const designationStatus = analyzeDesignationStatus(inputs.accounts);
  const distributionAnalysis = analyzeDistribution(inputs.accounts);
  const reviewSchedule = generateReviewSchedule(inputs.accounts, inputs.reviewFrequency);
  const warnings = generateWarnings(inputs);

  return {
    totalAssets,
    beneficiarySummary,
    designationStatus,
    distributionAnalysis,
    reviewSchedule,
    warnings
  };
}

// Helper function to calculate months between two dates
function monthsBetween(date1: Date, date2: Date): number {
  const months = (date2.getFullYear() - date1.getFullYear()) * 12;
  return months + date2.getMonth() - date1.getMonth();
}
