export type TrustType = 'revocable' | 'irrevocable' | 'charitable' | 'special_needs' | 'life_insurance' | 'generation_skipping';

export interface TrustAsset {
  type: 'real_estate' | 'investment' | 'business' | 'life_insurance' | 'personal' | 'other';
  description: string;
  value: number;
  appreciationRate?: number;
  incomeGenerated?: number;
}

export interface TrustBeneficiary {
  type: 'spouse' | 'child' | 'grandchild' | 'charity' | 'other';
  name: string;
  age?: number;
  specialNeeds?: boolean;
  distributionPercentage: number;
}

export interface TrustPlanningInputs {
  trustType: TrustType;
  assets: TrustAsset[];
  beneficiaries: TrustBeneficiary[];
  grantor: {
    age: number;
    maritalStatus: 'single' | 'married' | 'widowed' | 'divorced';
    state: string;
  };
  trustDuration: number; // Years
  distributionStrategy: 'immediate' | 'staged' | 'discretionary';
  retainControl: boolean;
  charitableIntent?: boolean;
}

export interface TrustPlanningResults {
  totalAssetValue: number;
  projectedGrowth: number;
  estateTaxSavings: number;
  incomeTaxImpact: number;
  beneficiaryDistributions: {
    beneficiaryName: string;
    amount: number;
    timing: string;
  }[];
  controlRetained: boolean;
  assetProtectionLevel: 'high' | 'medium' | 'low';
  flexibilityLevel: 'high' | 'medium' | 'low';
  annualMaintenanceCost: number;
  recommendedFeatures: string[];
  warnings: string[];
}

export interface TrustPlanningError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}
