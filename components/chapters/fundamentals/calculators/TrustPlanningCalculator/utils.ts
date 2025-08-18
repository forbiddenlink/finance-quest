import { 
  TrustType, 
  TrustAsset, 
  TrustBeneficiary, 
  TrustPlanningInputs, 
  TrustPlanningResults 
} from './types';

const TRUST_TYPE_INFO: Record<TrustType, {
  assetProtection: 'high' | 'medium' | 'low';
  flexibility: 'high' | 'medium' | 'low';
  taxBenefits: boolean;
  annualCost: number;
  features: string[];
}> = {
  revocable: {
    assetProtection: 'low',
    flexibility: 'high',
    taxBenefits: false,
    annualCost: 1500,
    features: [
      'Maintain control and ability to modify',
      'Avoid probate',
      'Privacy protection',
      'Smooth transition of assets'
    ]
  },
  irrevocable: {
    assetProtection: 'high',
    flexibility: 'low',
    taxBenefits: true,
    annualCost: 2500,
    features: [
      'Remove assets from taxable estate',
      'Strong asset protection',
      'Tax benefits',
      'Protection from creditors'
    ]
  },
  charitable: {
    assetProtection: 'high',
    flexibility: 'medium',
    taxBenefits: true,
    annualCost: 2000,
    features: [
      'Income tax deductions',
      'Estate tax benefits',
      'Support charitable causes',
      'Potential income stream'
    ]
  },
  special_needs: {
    assetProtection: 'high',
    flexibility: 'medium',
    taxBenefits: true,
    annualCost: 2000,
    features: [
      'Preserve government benefits',
      'Provide supplemental care',
      'Professional management',
      'Long-term protection'
    ]
  },
  life_insurance: {
    assetProtection: 'high',
    flexibility: 'low',
    taxBenefits: true,
    annualCost: 1800,
    features: [
      'Remove life insurance from estate',
      'Tax-free death benefits',
      'Generation-skipping benefits',
      'Creditor protection'
    ]
  },
  generation_skipping: {
    assetProtection: 'high',
    flexibility: 'low',
    taxBenefits: true,
    annualCost: 3000,
    features: [
      'Multi-generational wealth transfer',
      'GST tax planning',
      'Dynasty trust potential',
      'Long-term asset protection'
    ]
  }
};

export function calculateAssetGrowth(
  assets: TrustAsset[],
  years: number
): { totalGrowth: number; projectedValue: number } {
  let totalGrowth = 0;
  let projectedValue = 0;

  assets.forEach(asset => {
    const rate = asset.appreciationRate || 0.03; // Default 3% growth
    const income = asset.incomeGenerated || 0;
    
    // Compound growth calculation
    const futureValue = asset.value * Math.pow(1 + rate, years);
    const totalIncome = income * years;
    
    totalGrowth += (futureValue - asset.value) + totalIncome;
    projectedValue += futureValue + totalIncome;
  });

  return { totalGrowth, projectedValue };
}

export function calculateEstateTaxSavings(
  totalValue: number,
  trustType: TrustType,
  state: string
): number {
  if (!TRUST_TYPE_INFO[trustType].taxBenefits) return 0;

  const federalExemption = 12920000; // 2023 exemption
  const federalRate = 0.40;
  
  // Simplified state tax calculation
  const stateTaxRates: Record<string, number> = {
    WA: 0.20,
    OR: 0.16,
    MN: 0.16,
    IL: 0.16,
    MA: 0.16,
    NY: 0.16
  };

  const stateRate = stateTaxRates[state] || 0;
  
  let taxSavings = 0;
  
  if (totalValue > federalExemption) {
    taxSavings += (totalValue - federalExemption) * federalRate;
  }
  
  if (stateRate > 0) {
    taxSavings += totalValue * stateRate;
  }

  return taxSavings;
}

export function calculateBeneficiaryDistributions(
  totalValue: number,
  beneficiaries: TrustBeneficiary[],
  distributionStrategy: TrustPlanningInputs['distributionStrategy']
): TrustPlanningResults['beneficiaryDistributions'] {
  return beneficiaries.map(beneficiary => {
    const amount = totalValue * (beneficiary.distributionPercentage / 100);
    let timing: string;

    switch (distributionStrategy) {
      case 'immediate':
        timing = 'Immediate distribution upon trust funding';
        break;
      case 'staged':
        timing = 'Staged distribution over time (ages 25, 30, 35)';
        break;
      case 'discretionary':
        timing = 'As needed based on trustee discretion';
        break;
      default:
        timing = 'According to trust terms';
    }

    return {
      beneficiaryName: beneficiary.name,
      amount,
      timing
    };
  });
}

export function validateTrustInputs(inputs: TrustPlanningInputs): boolean {
  // Basic validation
  if (!inputs.trustType || !inputs.assets || !inputs.beneficiaries) return false;
  if (!inputs.grantor.age || !inputs.grantor.state) return false;

  // Asset validation
  const validAssets = inputs.assets.every(asset => 
    asset.type && 
    typeof asset.value === 'number' && 
    asset.value >= 0 &&
    asset.description
  );

  // Beneficiary validation
  const validBeneficiaries = inputs.beneficiaries.every(beneficiary =>
    beneficiary.type &&
    beneficiary.name &&
    typeof beneficiary.distributionPercentage === 'number' &&
    beneficiary.distributionPercentage >= 0 &&
    beneficiary.distributionPercentage <= 100
  );

  // Total distribution percentage should be 100%
  const totalPercentage = inputs.beneficiaries.reduce(
    (sum, b) => sum + b.distributionPercentage,
    0
  );
  
  return validAssets && 
         validBeneficiaries && 
         Math.abs(totalPercentage - 100) < 0.01; // Allow for floating point imprecision
}

export function calculateTrustPlan(inputs: TrustPlanningInputs): TrustPlanningResults {
  const totalAssetValue = inputs.assets.reduce((sum, asset) => sum + asset.value, 0);
  const { totalGrowth, projectedValue } = calculateAssetGrowth(inputs.assets, inputs.trustDuration);
  const estateTaxSavings = calculateEstateTaxSavings(totalAssetValue, inputs.trustType, inputs.grantor.state);
  
  const trustInfo = TRUST_TYPE_INFO[inputs.trustType];
  const beneficiaryDistributions = calculateBeneficiaryDistributions(
    projectedValue,
    inputs.beneficiaries,
    inputs.distributionStrategy
  );

  // Calculate income tax impact (simplified)
  const incomeTaxImpact = trustInfo.taxBenefits ? -totalGrowth * 0.15 : 0;

  const results: TrustPlanningResults = {
    totalAssetValue,
    projectedGrowth: totalGrowth,
    estateTaxSavings,
    incomeTaxImpact,
    beneficiaryDistributions,
    controlRetained: inputs.retainControl,
    assetProtectionLevel: trustInfo.assetProtection,
    flexibilityLevel: trustInfo.flexibility,
    annualMaintenanceCost: trustInfo.annualCost,
    recommendedFeatures: trustInfo.features,
    warnings: []
  };

  // Add relevant warnings
  if (inputs.trustType === 'revocable' && totalAssetValue > 12920000) {
    results.warnings.push('Consider an irrevocable trust for estate tax benefits');
  }
  if (inputs.beneficiaries.some(b => b.specialNeeds) && inputs.trustType !== 'special_needs') {
    results.warnings.push('Special needs beneficiary detected - consider a Special Needs Trust');
  }
  if (inputs.charitableIntent && inputs.trustType !== 'charitable') {
    results.warnings.push('Consider a Charitable Trust for tax-efficient charitable giving');
  }

  return results;
}
