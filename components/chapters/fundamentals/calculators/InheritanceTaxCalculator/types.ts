export interface InheritedAsset {
  type: 'real_estate' | 'investment' | 'retirement' | 'business' | 'life_insurance' | 'personal' | 'other';
  description: string;
  value: number;
  basis?: number;
  appreciationRate?: number;
  stateLocation?: string;
}

export interface Deduction {
  type: 'funeral' | 'debts' | 'administration' | 'charitable' | 'marital' | 'other';
  description: string;
  amount: number;
}

export interface InheritanceTaxInputs {
  decedent: {
    state: string;
    dateOfDeath: string;
    maritalStatus: 'single' | 'married' | 'widowed' | 'divorced';
  };
  heir: {
    relationship: 'spouse' | 'child' | 'grandchild' | 'sibling' | 'parent' | 'other';
    state: string;
    adjustedGrossIncome: number;
  };
  assets: InheritedAsset[];
  deductions: Deduction[];
  priorGifts: number;
  portabilityElection: boolean;
  deceasedSpouseExemption?: number;
}

export interface InheritanceTaxResults {
  grossEstate: number;
  totalDeductions: number;
  taxableEstate: number;
  federalEstateTax: number;
  stateEstateTax: number;
  stateInheritanceTax: number;
  totalTaxLiability: number;
  effectiveTaxRate: number;
  netInheritance: number;
  taxSavingOpportunities: {
    strategy: string;
    potentialSavings: number;
    description: string;
  }[];
  stepUpBasis: {
    asset: string;
    oldBasis: number;
    newBasis: number;
    taxSavings: number;
  }[];
  warnings: string[];
}

export interface InheritanceTaxError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}
