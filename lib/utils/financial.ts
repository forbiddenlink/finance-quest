/**
 * Centralized financial calculation utilities
 * Following DRY principles for reusable financial formulas
 */

export interface PaymentCalculationInput {
  principal: number;
  rate: number;
  periods: number;
  futureValue?: number;
  type?: 0 | 1; // 0 = end of period, 1 = beginning
}

export interface CompoundInterestInput {
  principal: number;
  rate: number;
  compoundsPerYear: number;
  years: number;
  monthlyContribution?: number;
}

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTermYears: number;
  propertyTax?: number;
  insurance?: number;
  pmi?: number;
}

/**
 * Calculate monthly payment using PMT formula
 * Equivalent to Excel PMT function
 */
export function calculatePMT({
  principal,
  rate,
  periods,
  futureValue = 0,
  type = 0
}: PaymentCalculationInput): number {
  if (rate === 0) {
    return -(principal + futureValue) / periods;
  }

  const pvif = Math.pow(1 + rate, periods);
  const pmt = (-principal * pvif - futureValue) / ((1 + rate * type) * (pvif - 1));
  
  return pmt;
}

/**
 * Calculate compound interest with regular contributions
 */
export function calculateCompoundInterest({
  principal,
  rate,
  compoundsPerYear,
  years,
  monthlyContribution = 0
}: CompoundInterestInput) {
  const monthlyRate = rate / compoundsPerYear;
  const totalPeriods = years * compoundsPerYear;
  
  // Calculate principal growth
  const principalGrowth = principal * Math.pow(1 + monthlyRate, totalPeriods);
  
  // Calculate contributions growth (annuity formula)
  let contributionsGrowth = 0;
  if (monthlyContribution > 0 && monthlyRate > 0) {
    contributionsGrowth = monthlyContribution * 
      ((Math.pow(1 + monthlyRate, totalPeriods) - 1) / monthlyRate);
  } else if (monthlyContribution > 0) {
    contributionsGrowth = monthlyContribution * totalPeriods;
  }
  
  const totalValue = principalGrowth + contributionsGrowth;
  const totalContributions = principal + (monthlyContribution * totalPeriods);
  const totalInterest = totalValue - totalContributions;
  
  return {
    finalAmount: totalValue,
    totalContributions,
    totalInterest,
    effectiveRate: totalContributions > 0 ? (totalValue / totalContributions - 1) : 0
  };
}

/**
 * Calculate progressive tax using brackets
 */
export function calculateProgressiveTax(income: number, brackets: TaxBracket[]): number {
  let tax = 0;
  let remainingIncome = income;
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }
  
  return tax;
}

/**
 * Calculate mortgage payment and amortization
 */
export function calculateMortgage({
  homePrice,
  downPayment,
  interestRate,
  loanTermYears,
  propertyTax = 0,
  insurance = 0,
  pmi = 0
}: MortgageInput) {
  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  
  // Calculate principal & interest payment
  const monthlyPayment = calculatePMT({
    principal: loanAmount,
    rate: monthlyRate,
    periods: numberOfPayments
  });
  
  const principalAndInterest = Math.abs(monthlyPayment);
  const totalMonthlyPayment = principalAndInterest + propertyTax + insurance + 
    (downPayment < homePrice * 0.2 ? pmi : 0);
  
  const totalInterest = (principalAndInterest * numberOfPayments) - loanAmount;
  const totalCost = homePrice + totalInterest;
  
  return {
    monthlyPayment: totalMonthlyPayment,
    principalAndInterest,
    totalInterest,
    totalCost,
    loanAmount,
    downPaymentPercent: (downPayment / homePrice) * 100
  };
}

/**
 * Calculate debt payoff using avalanche or snowball method
 */
export interface Debt {
  id: string;
  name: string;
  balance: number;
  minimumPayment: number;
  interestRate: number;
}

export function calculateDebtPayoff(
  debts: Debt[],
  extraPayment: number,
  strategy: 'avalanche' | 'snowball'
) {
  if (debts.length === 0) return [];
  
  // Clone debts and sort by strategy
  let sortedDebts = [...debts];
  if (strategy === 'avalanche') {
    sortedDebts.sort((a, b) => b.interestRate - a.interestRate);
  } else {
    sortedDebts.sort((a, b) => a.balance - b.balance);
  }
  
  const projections = [];
  let month = 0;
  let totalPaid = 0;
  let totalInterest = 0;
  let remainingDebts = sortedDebts.map(debt => ({ ...debt }));
  
  while (remainingDebts.length > 0 && month < 360) { // Cap at 30 years
    month++;
    
    // Apply interest and minimum payments
    remainingDebts.forEach(debt => {
      const monthlyInterest = (debt.balance * (debt.interestRate / 100)) / 12;
      totalInterest += monthlyInterest;
      debt.balance += monthlyInterest;
      
      const payment = Math.min(debt.minimumPayment, debt.balance);
      debt.balance -= payment;
      totalPaid += payment;
    });
    
    // Apply extra payment to target debt
    if (remainingDebts.length > 0 && extraPayment > 0) {
      const targetDebt = remainingDebts[0];
      const extraApplied = Math.min(extraPayment, targetDebt.balance);
      targetDebt.balance -= extraApplied;
      totalPaid += extraApplied;
    }
    
    // Remove paid-off debts
    remainingDebts = remainingDebts.filter(debt => debt.balance > 0.01);
    
    const totalBalance = remainingDebts.reduce((sum, debt) => sum + debt.balance, 0);
    
    projections.push({
      month,
      totalBalance: Math.round(totalBalance),
      totalPaid: Math.round(totalPaid),
      totalInterest: Math.round(totalInterest),
      debtsFree: debts.length - remainingDebts.length
    });
    
    if (totalBalance < 0.01) break;
  }
  
  return projections;
}

/**
 * Format currency consistently across all calculators
 */
export function formatCurrency(
  amount: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showCents?: boolean;
  } = {}
): string {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    showCents = false
  } = options;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : minimumFractionDigits,
    maximumFractionDigits: showCents ? 2 : maximumFractionDigits,
  }).format(amount);
}

/**
 * Format percentage consistently
 */
export function formatPercentage(
  value: number,
  decimals: number = 1
): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Validate positive number input
 */
export function validatePositiveNumber(
  value: string | number,
  min: number = 0,
  max?: number
): { isValid: boolean; value: number; error?: string } {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return { isValid: false, value: 0, error: 'Please enter a valid number' };
  }
  
  if (numValue < min) {
    return { isValid: false, value: numValue, error: `Value must be at least ${min}` };
  }
  
  if (max !== undefined && numValue > max) {
    return { isValid: false, value: numValue, error: `Value must be no more than ${max}` };
  }
  
  return { isValid: true, value: numValue };
}

/**
 * Calculate emergency fund recommendations
 */
export function calculateEmergencyFund(
  monthlyExpenses: number,
  currentSavings: number,
  monthlySavingsGoal: number,
  targetMonths: number = 6
) {
  const targetAmount = monthlyExpenses * targetMonths;
  const remainingNeeded = Math.max(0, targetAmount - currentSavings);
  const timeToGoal = monthlySavingsGoal > 0 ? Math.ceil(remainingNeeded / monthlySavingsGoal) : 0;
  const currentProgress = targetAmount > 0 ? (currentSavings / targetAmount) * 100 : 0;
  
  return {
    targetAmount,
    remainingNeeded,
    timeToGoal,
    currentProgress: Math.min(currentProgress, 100),
    isComplete: currentSavings >= targetAmount
  };
}

/**
 * Tax bracket data for different filing statuses
 */
export const TAX_BRACKETS_2024 = {
  single: [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: Infinity, rate: 0.37 }
  ],
  marriedJointly: [
    { min: 0, max: 22000, rate: 0.10 },
    { min: 22000, max: 89450, rate: 0.12 },
    { min: 89450, max: 190750, rate: 0.22 },
    { min: 190750, max: 364200, rate: 0.24 },
    { min: 364200, max: 462500, rate: 0.32 },
    { min: 462500, max: 693750, rate: 0.35 },
    { min: 693750, max: Infinity, rate: 0.37 }
  ]
} as const;

/**
 * State tax rates (simplified flat rates)
 */
export const STATE_TAX_RATES = {
  'AL': 0.05, 'AK': 0.00, 'AZ': 0.03, 'AR': 0.05, 'CA': 0.08,
  'CO': 0.04, 'CT': 0.05, 'DE': 0.05, 'FL': 0.00, 'GA': 0.05,
  'HI': 0.08, 'ID': 0.06, 'IL': 0.05, 'IN': 0.03, 'IA': 0.06,
  'KS': 0.05, 'KY': 0.05, 'LA': 0.04, 'ME': 0.07, 'MD': 0.05,
  'MA': 0.05, 'MI': 0.04, 'MN': 0.08, 'MS': 0.05, 'MO': 0.05,
  'MT': 0.06, 'NE': 0.06, 'NV': 0.00, 'NH': 0.00, 'NJ': 0.06,
  'NM': 0.05, 'NY': 0.07, 'NC': 0.05, 'ND': 0.03, 'OH': 0.04,
  'OK': 0.05, 'OR': 0.09, 'PA': 0.03, 'RI': 0.06, 'SC': 0.06,
  'SD': 0.00, 'TN': 0.00, 'TX': 0.00, 'UT': 0.05, 'VT': 0.06,
  'VA': 0.05, 'WA': 0.00, 'WV': 0.06, 'WI': 0.06, 'WY': 0.00
} as const;
