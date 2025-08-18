import { Asset, Liability, EstateValueInputs, EstateValueResults } from './types';

const FEDERAL_ESTATE_TAX_EXEMPTION = 12920000; // 2023 exemption amount
const FEDERAL_ESTATE_TAX_RATE = 0.40;

// State estate tax rates and exemptions (2023)
const STATE_TAX_INFO: Record<string, { exemption: number; rate: number }> = {
  WA: { exemption: 2193000, rate: 0.20 },
  OR: { exemption: 1000000, rate: 0.16 },
  MN: { exemption: 3000000, rate: 0.16 },
  IL: { exemption: 4000000, rate: 0.16 },
  MA: { exemption: 1000000, rate: 0.16 },
  RI: { exemption: 1725000, rate: 0.16 },
  CT: { exemption: 9100000, rate: 0.12 },
  NY: { exemption: 6580000, rate: 0.16 },
  // Add more states as needed
};

export function calculateAssetTotal(assets: Asset[]): number {
  return assets.reduce((total, asset) => total + asset.value, 0);
}

export function calculateLiabilityTotal(liabilities: Liability[]): number {
  return liabilities.reduce((total, liability) => total + liability.amount, 0);
}

export function calculateFederalEstateTax(netEstateValue: number, isMarried: boolean): number {
  const exemption = isMarried ? FEDERAL_ESTATE_TAX_EXEMPTION * 2 : FEDERAL_ESTATE_TAX_EXEMPTION;
  const taxableEstate = Math.max(0, netEstateValue - exemption);
  return taxableEstate * FEDERAL_ESTATE_TAX_RATE;
}

export function calculateStateEstateTax(netEstateValue: number, state: string): number {
  if (!STATE_TAX_INFO[state]) return 0;
  
  const { exemption, rate } = STATE_TAX_INFO[state];
  const taxableEstate = Math.max(0, netEstateValue - exemption);
  return taxableEstate * rate;
}

export function identifyTaxSavingStrategies(inputs: EstateValueInputs, results: EstateValueResults): string[] {
  const strategies: string[] = [];
  const { netEstateValue } = results;
  const { maritalStatus, hasChildren, hasTrust } = inputs;

  if (netEstateValue > FEDERAL_ESTATE_TAX_EXEMPTION) {
    strategies.push('Consider establishing an irrevocable life insurance trust (ILIT)');
    strategies.push('Explore annual gift tax exclusions to reduce estate value');
  }

  if (!hasTrust && netEstateValue > 1000000) {
    strategies.push('Consider creating a revocable living trust to avoid probate');
  }

  if (maritalStatus === 'married') {
    strategies.push('Utilize marital deduction and portability of estate tax exemption');
  }

  if (hasChildren && netEstateValue > 500000) {
    strategies.push('Consider establishing generation-skipping trusts');
    strategies.push('Explore family limited partnerships');
  }

  if (inputs.assets.some(asset => asset.type === 'business')) {
    strategies.push('Consider business succession planning strategies');
    strategies.push('Explore family limited partnership or LLC structures');
  }

  return strategies;
}

export function calculateEstateValue(inputs: EstateValueInputs): EstateValueResults {
  const grossEstateValue = calculateAssetTotal(inputs.assets);
  const totalLiabilities = calculateLiabilityTotal(inputs.liabilities);
  const netEstateValue = grossEstateValue - totalLiabilities;
  
  const isMarried = inputs.maritalStatus === 'married';
  const federalEstateTax = calculateFederalEstateTax(netEstateValue, isMarried);
  const stateEstateTax = calculateStateEstateTax(netEstateValue, inputs.state);
  
  const totalTaxLiability = federalEstateTax + stateEstateTax;
  const netToHeirs = netEstateValue - totalTaxLiability;

  // Calculate potential tax savings through basic strategies
  const potentialTaxSavings = Math.min(
    totalTaxLiability,
    totalTaxLiability * (inputs.hasTrust ? 0.3 : 0.5)
  );

  const results: EstateValueResults = {
    grossEstateValue,
    totalLiabilities,
    netEstateValue,
    federalEstateTax,
    stateEstateTax,
    totalTaxLiability,
    netToHeirs,
    potentialTaxSavings,
    recommendedStrategies: []
  };

  results.recommendedStrategies = identifyTaxSavingStrategies(inputs, results);

  return results;
}

export function validateEstateInputs(inputs: EstateValueInputs): boolean {
  // Basic validation
  if (!inputs.assets || !inputs.liabilities) return false;
  if (!inputs.state || !inputs.maritalStatus) return false;

  // Asset validation
  const validAssets = inputs.assets.every(asset => 
    asset.type && 
    typeof asset.value === 'number' && 
    asset.value >= 0 &&
    asset.description
  );

  // Liability validation
  const validLiabilities = inputs.liabilities.every(liability =>
    liability.type &&
    typeof liability.amount === 'number' &&
    liability.amount >= 0 &&
    liability.description
  );

  return validAssets && validLiabilities;
}
