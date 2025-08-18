import {
  InheritanceTaxInputs,
  InheritanceTaxResults,
  InheritedAsset,
  Deduction
} from './types';

// 2024 tax rates and exemptions
const FEDERAL_ESTATE_TAX_EXEMPTION = 13610000;
const FEDERAL_ESTATE_TAX_RATE = 0.40;

// State estate tax rates and exemptions (2024)
const STATE_ESTATE_TAX: Record<string, { exemption: number; rate: number }> = {
  WA: { exemption: 2193000, rate: 0.20 },
  OR: { exemption: 1000000, rate: 0.16 },
  MN: { exemption: 3000000, rate: 0.16 },
  IL: { exemption: 4000000, rate: 0.16 },
  MA: { exemption: 1000000, rate: 0.16 },
  NY: { exemption: 6580000, rate: 0.16 }
};

// State inheritance tax rates by heir relationship (some states)
const STATE_INHERITANCE_TAX: Record<string, Record<string, number>> = {
  IA: {
    child: 0,
    grandchild: 0,
    sibling: 0.10,
    parent: 0.10,
    other: 0.15
  },
  KY: {
    child: 0,
    grandchild: 0,
    sibling: 0.16,
    parent: 0.16,
    other: 0.16
  },
  NE: {
    child: 0,
    grandchild: 0,
    sibling: 0.13,
    parent: 0.13,
    other: 0.18
  },
  PA: {
    child: 0.045,
    grandchild: 0.045,
    sibling: 0.12,
    parent: 0.045,
    other: 0.15
  }
};

export function calculateGrossEstate(assets: InheritedAsset[]): number {
  return assets.reduce((total, asset) => total + asset.value, 0);
}

export function calculateTotalDeductions(deductions: Deduction[]): number {
  return deductions.reduce((total, deduction) => total + deduction.amount, 0);
}

export function calculateFederalEstateTax(
  taxableEstate: number,
  portabilityElection: boolean,
  deceasedSpouseExemption: number = 0
): number {
  const totalExemption = FEDERAL_ESTATE_TAX_EXEMPTION + 
    (portabilityElection ? Math.min(deceasedSpouseExemption, FEDERAL_ESTATE_TAX_EXEMPTION) : 0);
  
  const taxableAmount = Math.max(0, taxableEstate - totalExemption);
  return taxableAmount * FEDERAL_ESTATE_TAX_RATE;
}

export function calculateStateEstateTax(
  taxableEstate: number,
  state: string
): number {
  if (!STATE_ESTATE_TAX[state]) return 0;
  
  const { exemption, rate } = STATE_ESTATE_TAX[state];
  const taxableAmount = Math.max(0, taxableEstate - exemption);
  return taxableAmount * rate;
}

export function calculateStateInheritanceTax(
  netInheritance: number,
  heirState: string,
  relationship: string
): number {
  if (!STATE_INHERITANCE_TAX[heirState]) return 0;
  
  const rates = STATE_INHERITANCE_TAX[heirState];
  const rate = rates[relationship] || rates.other;
  return netInheritance * rate;
}

export function calculateStepUpBasis(
  assets: InheritedAsset[]
): InheritanceTaxResults['stepUpBasis'] {
  return assets
    .filter(asset => asset.basis !== undefined)
    .map(asset => ({
      asset: asset.description,
      oldBasis: asset.basis!,
      newBasis: asset.value,
      taxSavings: (asset.value - asset.basis!) * 0.20 // Assumed capital gains rate
    }));
}

export function identifyTaxSavingOpportunities(
  inputs: InheritanceTaxInputs,
  results: InheritanceTaxResults
): InheritanceTaxResults['taxSavingOpportunities'] {
  const opportunities: InheritanceTaxResults['taxSavingOpportunities'] = [];

  // Check for portability election
  if (!inputs.portabilityElection && inputs.decedent.maritalStatus === 'widowed') {
    opportunities.push({
      strategy: 'Portability Election',
      potentialSavings: FEDERAL_ESTATE_TAX_RATE * FEDERAL_ESTATE_TAX_EXEMPTION,
      description: 'File Form 706 to elect portability of deceased spouse\'s unused exemption'
    });
  }

  // Check for charitable giving opportunities
  if (results.taxableEstate > FEDERAL_ESTATE_TAX_EXEMPTION) {
    const charitableSavings = FEDERAL_ESTATE_TAX_RATE * (results.taxableEstate - FEDERAL_ESTATE_TAX_EXEMPTION) * 0.1;
    opportunities.push({
      strategy: 'Charitable Giving',
      potentialSavings: charitableSavings,
      description: 'Consider charitable contributions to reduce taxable estate'
    });
  }

  // Check for family limited partnership opportunities
  const businessAssets = inputs.assets.filter(a => a.type === 'business');
  if (businessAssets.length > 0) {
    const totalBusinessValue = businessAssets.reduce((sum, a) => sum + a.value, 0);
    opportunities.push({
      strategy: 'Family Limited Partnership',
      potentialSavings: totalBusinessValue * 0.25, // Typical discount
      description: 'Structure business interests in FLP for valuation discounts'
    });
  }

  // Check for QPRT opportunities
  const realEstateAssets = inputs.assets.filter(a => a.type === 'real_estate');
  if (realEstateAssets.length > 0) {
    const totalRealEstateValue = realEstateAssets.reduce((sum, a) => sum + a.value, 0);
    opportunities.push({
      strategy: 'Qualified Personal Residence Trust',
      potentialSavings: totalRealEstateValue * 0.3,
      description: 'Transfer residence to QPRT to reduce gift tax value'
    });
  }

  return opportunities;
}

export function validateInheritanceTaxInputs(inputs: InheritanceTaxInputs): boolean {
  // Basic validation
  if (!inputs.decedent.state || !inputs.decedent.dateOfDeath) return false;
  if (!inputs.heir.relationship || !inputs.heir.state) return false;
  if (!inputs.assets || !inputs.deductions) return false;

  // Asset validation
  const validAssets = inputs.assets.every(asset => 
    asset.type && 
    typeof asset.value === 'number' && 
    asset.value >= 0 &&
    asset.description
  );

  // Deduction validation
  const validDeductions = inputs.deductions.every(deduction =>
    deduction.type &&
    typeof deduction.amount === 'number' &&
    deduction.amount >= 0 &&
    deduction.description
  );

  // Prior gifts validation
  if (typeof inputs.priorGifts !== 'number' || inputs.priorGifts < 0) return false;

  // Portability validation
  if (inputs.portabilityElection && inputs.decedent.maritalStatus !== 'widowed') return false;
  if (inputs.portabilityElection && !inputs.deceasedSpouseExemption) return false;

  return validAssets && validDeductions;
}

export function calculateInheritanceTax(inputs: InheritanceTaxInputs): InheritanceTaxResults {
  const grossEstate = calculateGrossEstate(inputs.assets);
  const totalDeductions = calculateTotalDeductions(inputs.deductions);
  const taxableEstate = grossEstate - totalDeductions + inputs.priorGifts;

  const federalEstateTax = calculateFederalEstateTax(
    taxableEstate,
    inputs.portabilityElection,
    inputs.deceasedSpouseExemption
  );

  const stateEstateTax = calculateStateEstateTax(
    taxableEstate,
    inputs.decedent.state
  );

  const netBeforeInheritanceTax = taxableEstate - federalEstateTax - stateEstateTax;
  const stateInheritanceTax = calculateStateInheritanceTax(
    netBeforeInheritanceTax,
    inputs.heir.state,
    inputs.heir.relationship
  );

  const totalTaxLiability = federalEstateTax + stateEstateTax + stateInheritanceTax;
  const effectiveTaxRate = totalTaxLiability / grossEstate;
  const netInheritance = grossEstate - totalTaxLiability;

  const stepUpBasis = calculateStepUpBasis(inputs.assets);
  const warnings: string[] = [];

  // Generate warnings
  if (taxableEstate > FEDERAL_ESTATE_TAX_EXEMPTION) {
    warnings.push('Estate exceeds federal exemption - consider tax planning strategies');
  }
  if (STATE_ESTATE_TAX[inputs.decedent.state]) {
    warnings.push(`State estate tax applies in ${inputs.decedent.state} - review state-specific planning options`);
  }
  if (STATE_INHERITANCE_TAX[inputs.heir.state]) {
    warnings.push(`Inheritance tax applies in ${inputs.heir.state} - consider impact on distributions`);
  }

  const results: InheritanceTaxResults = {
    grossEstate,
    totalDeductions,
    taxableEstate,
    federalEstateTax,
    stateEstateTax,
    stateInheritanceTax,
    totalTaxLiability,
    effectiveTaxRate,
    netInheritance,
    stepUpBasis,
    taxSavingOpportunities: [],
    warnings
  };

  // Calculate tax saving opportunities
  results.taxSavingOpportunities = identifyTaxSavingOpportunities(inputs, results);

  return results;
}
