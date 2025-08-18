export interface Asset {
  type: 'real_estate' | 'investment' | 'retirement' | 'business' | 'life_insurance' | 'personal' | 'other';
  description: string;
  value: number;
  basis?: number;
  notes?: string;
}

export interface Liability {
  type: 'mortgage' | 'loan' | 'credit' | 'tax' | 'other';
  description: string;
  amount: number;
  interestRate?: number;
  notes?: string;
}

export interface EstateValueInputs {
  assets: Asset[];
  liabilities: Liability[];
  state: string;
  maritalStatus: 'single' | 'married' | 'widowed' | 'divorced';
  hasChildren: boolean;
  hasTrust: boolean;
}

export interface EstateValueResults {
  grossEstateValue: number;
  totalLiabilities: number;
  netEstateValue: number;
  federalEstateTax: number;
  stateEstateTax: number;
  totalTaxLiability: number;
  netToHeirs: number;
  potentialTaxSavings: number;
  recommendedStrategies: string[];
}

export interface EstateValueError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}
