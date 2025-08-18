export interface Beneficiary {
  name: string;
  relationship: 'spouse' | 'child' | 'grandchild' | 'sibling' | 'parent' | 'charity' | 'trust' | 'other';
  type: 'primary' | 'contingent';
  percentage: number;
  age?: number;
  specialNeeds?: boolean;
  trustBeneficiary?: boolean;
  charityTaxId?: string;
  notes?: string;
}

export interface Account {
  type: 'retirement' | 'life_insurance' | 'bank' | 'investment' | 'real_estate' | 'business' | 'other';
  description: string;
  value: number;
  beneficiaries: Beneficiary[];
  transferOnDeath: boolean;
  requiresDesignation: boolean;
  lastReviewed?: string;
}

export interface BeneficiaryPlanningInputs {
  accounts: Account[];
  defaultContingent?: Beneficiary;
  reviewFrequency: 'annual' | 'biannual' | 'quarterly';
  lastFullReview?: string;
  upcomingLifeEvents: {
    event: string;
    date: string;
    impactedAccounts: string[];
  }[];
}

export interface BeneficiaryPlanningResults {
  totalAssets: number;
  beneficiarySummary: {
    beneficiaryName: string;
    totalValue: number;
    percentageOfEstate: number;
    accountTypes: string[];
    isContingent: boolean;
  }[];
  designationStatus: {
    accountDescription: string;
    status: 'complete' | 'incomplete' | 'review_needed';
    issues: string[];
  }[];
  distributionAnalysis: {
    category: string;
    analysis: string;
    recommendations: string[];
  }[];
  reviewSchedule: {
    accountDescription: string;
    lastReview: string;
    nextReview: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  warnings: {
    severity: 'high' | 'medium' | 'low';
    message: string;
    accountsAffected: string[];
  }[];
}

export interface BeneficiaryPlanningError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}
