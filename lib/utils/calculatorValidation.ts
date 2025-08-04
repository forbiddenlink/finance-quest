/**
 * Calculator Validation Utilities
 * Comprehensive validation system for all calculators
 */

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  type?: 'number' | 'currency' | 'percentage' | 'integer';
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule;
}

/**
 * Validates a single field based on its rules
 */
export function validateField(value: any, rules: ValidationRule, fieldName: string): string | null {
  // Check required
  if (rules.required && (value === '' || value === null || value === undefined)) {
    return `${fieldName} is required`;
  }

  // Skip other validations if not required and empty
  if (!rules.required && (value === '' || value === null || value === undefined)) {
    return null;
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  // Check if valid number
  if (rules.type && ['number', 'currency', 'percentage', 'integer'].includes(rules.type)) {
    if (isNaN(numValue)) {
      return `${fieldName} must be a valid number`;
    }

    // Check integer
    if (rules.type === 'integer' && !Number.isInteger(numValue)) {
      return `${fieldName} must be a whole number`;
    }

    // Check percentage range
    if (rules.type === 'percentage' && (numValue < 0 || numValue > 100)) {
      return `${fieldName} must be between 0% and 100%`;
    }
  }

  // Check min/max
  if (rules.min !== undefined && numValue < rules.min) {
    return `${fieldName} must be at least ${rules.min}`;
  }

  if (rules.max !== undefined && numValue > rules.max) {
    return `${fieldName} must be no more than ${rules.max}`;
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
}

/**
 * Validates multiple fields at once
 */
export function validateFields(values: Record<string, any>, validations: FieldValidation): ValidationResult {
  const errors: Record<string, string> = {};

  Object.entries(validations).forEach(([fieldName, rules]) => {
    const error = validateField(values[fieldName], rules, fieldName);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Common validation rule presets
 */
export const ValidationPresets = {
  currency: (min = 0, max = 1000000000): ValidationRule => ({
    required: true,
    type: 'currency',
    min,
    max
  }),

  percentage: (min = 0, max = 100): ValidationRule => ({
    required: true,
    type: 'percentage',
    min,
    max
  }),

  positiveInteger: (min = 1, max = 100): ValidationRule => ({
    required: true,
    type: 'integer',
    min,
    max
  }),

  optionalCurrency: (min = 0, max = 1000000000): ValidationRule => ({
    required: false,
    type: 'currency',
    min,
    max
  }),

  age: (): ValidationRule => ({
    required: true,
    type: 'integer',
    min: 0,
    max: 120
  }),

  years: (min = 0, max = 50): ValidationRule => ({
    required: true,
    type: 'integer',
    min,
    max
  }),

  interestRate: (): ValidationRule => ({
    required: true,
    type: 'percentage',
    min: 0,
    max: 50
  }),

  monthlyPayment: (): ValidationRule => ({
    required: true,
    type: 'currency',
    min: 0,
    max: 100000
  }),

  custom: (validator: (value: any) => string | null): ValidationRule => ({
    custom: validator
  })
};

/**
 * Calculator-specific validation schemas
 */
export const CalculatorValidations = {
  compoundInterest: {
    principal: ValidationPresets.currency(1, 10000000),
    rate: ValidationPresets.interestRate(),
    time: ValidationPresets.years(1, 50),
    monthlyContribution: ValidationPresets.optionalCurrency(0, 100000)
  },

  mortgage: {
    homeValue: ValidationPresets.currency(50000, 50000000),
    downPayment: ValidationPresets.currency(0, 10000000),
    interestRate: ValidationPresets.percentage(0, 20),
    loanTermYears: ValidationPresets.years(1, 50),
    propertyTax: ValidationPresets.optionalCurrency(0, 500000),
    homeInsurance: ValidationPresets.optionalCurrency(0, 100000),
    pmi: ValidationPresets.optionalCurrency(0, 10000)
  },

  emergencyFund: {
    monthlyIncome: ValidationPresets.currency(1000, 1000000),
    rent: ValidationPresets.currency(0, 50000),
    utilities: ValidationPresets.currency(0, 5000),
    groceries: ValidationPresets.currency(0, 5000),
    transportation: ValidationPresets.currency(0, 5000),
    insurance: ValidationPresets.currency(0, 5000),
    minimumDebt: ValidationPresets.currency(0, 10000),
    other: ValidationPresets.currency(0, 10000),
    monthsOfExpenses: ValidationPresets.positiveInteger(1, 24),
    monthlySavings: ValidationPresets.currency(0, 50000),
    currentSavings: ValidationPresets.currency(0, 10000000)
  },

  debtPayoff: {
    balance: ValidationPresets.currency(1, 1000000),
    minimumPayment: ValidationPresets.monthlyPayment(),
    interestRate: ValidationPresets.interestRate(),
    extraPayment: ValidationPresets.optionalCurrency(0, 50000)
  },

  retirement: {
    currentAge: ValidationPresets.age(),
    retirementAge: ValidationPresets.custom((value) => {
      const age = parseInt(value);
      if (age < 50 || age > 80) return 'Retirement age should be between 50 and 80';
      return null;
    }),
    currentSavings: ValidationPresets.currency(0, 50000000),
    monthlyContribution: ValidationPresets.currency(0, 100000),
    expectedReturn: ValidationPresets.percentage(0, 15),
    inflationRate: ValidationPresets.percentage(0, 10)
  },

  stockAnalysis: {
    currentPrice: ValidationPresets.currency(0.01, 100000),
    targetPrice: ValidationPresets.currency(0.01, 100000),
    dividendYield: ValidationPresets.percentage(0, 50),
    peRatio: {
      required: false,
      type: 'number' as const,
      min: 0,
      max: 1000
    },
    growthRate: ValidationPresets.percentage(-50, 100)
  },

  budget: {
    income: ValidationPresets.currency(100, 1000000),
    housing: ValidationPresets.currency(0, 50000),
    transportation: ValidationPresets.currency(0, 10000),
    food: ValidationPresets.currency(0, 5000),
    utilities: ValidationPresets.currency(0, 2000),
    entertainment: ValidationPresets.currency(0, 5000),
    healthcare: ValidationPresets.currency(0, 5000),
    savings: ValidationPresets.currency(0, 50000)
  },

  businessValuation: {
    annualRevenue: ValidationPresets.currency(1000, 1000000000),
    growthRate: ValidationPresets.percentage(-50, 100),
    netMargin: ValidationPresets.percentage(-100, 100),
    discountRate: ValidationPresets.percentage(1, 50),
    terminalGrowthRate: ValidationPresets.percentage(-10, 20),
    projectionYears: { min: 3, max: 15, required: true },
    ebitda: ValidationPresets.currency(0, 100000000),
    ebitdaMultiple: { min: 0.1, max: 50, required: true },
    totalAssets: ValidationPresets.currency(0, 1000000000),
    totalLiabilities: ValidationPresets.currency(0, 1000000000)
  },

  bond: {
    faceValue: ValidationPresets.currency(100, 1000000),
    currentPrice: ValidationPresets.currency(1, 1000000),
    couponRate: ValidationPresets.percentage(0, 50),
    yearsToMaturity: { min: 0.1, max: 50, required: true },
    paymentFrequency: { min: 1, max: 12, required: true }
  },

  creditScore: {
    paymentHistory: ValidationPresets.percentage(0, 100),
    creditUtilization: ValidationPresets.percentage(0, 100),
    creditAge: { min: 0, max: 50, step: 0.5, required: true },
    creditMix: { min: 1, max: 6, required: true },
    newCredit: { min: 0, max: 20, required: true }
  },

  stockAnalysis: {
    currentPrice: ValidationPresets.currency(0.01, 100000),
    earnings: ValidationPresets.currency(0.01, 1000),
    bookValue: ValidationPresets.currency(0.01, 1000),
    revenue: ValidationPresets.currency(0.1, 10000),
    growthRate: ValidationPresets.percentage(-50, 100),
    dividendYield: ValidationPresets.percentage(0, 20),
    debt: ValidationPresets.currency(0, 10000),
    equity: ValidationPresets.currency(0.1, 10000),
    marketCap: ValidationPresets.currency(1, 50000),
    freeCashFlow: ValidationPresets.currency(-100, 10000),
    targetPrice: ValidationPresets.currency(0.01, 100000),
    peRatio: {
      required: false,
      type: 'number' as const,
      min: 0,
      max: 1000
    }
  },

  taxOptimizer: {
    income: ValidationPresets.currency(1000, 10000000),
    currentDeductions: ValidationPresets.currency(0, 1000000),
    retirement401k: ValidationPresets.currency(0, 70000),
    retirementIra: ValidationPresets.currency(0, 7000),
    hsaContribution: ValidationPresets.currency(0, 8300),
    charitableDonations: ValidationPresets.currency(0, 500000),
    mortgageInterest: ValidationPresets.currency(0, 100000),
    stateLocalTaxes: ValidationPresets.currency(0, 50000),
    businessExpenses: ValidationPresets.currency(0, 500000),
    childTaxCredit: ValidationPresets.currency(0, 10000),
    educationCredits: ValidationPresets.currency(0, 5000)
  },

  portfolioAnalyzer: {
    totalInvestment: {
      required: true,
      min: 1,
      message: 'Total investment must be at least $1'
    },
    usStocks: {
      required: true,
      min: 0,
      max: 100,
      message: 'US Stocks allocation must be between 0% and 100%'
    },
    intlStocks: {
      required: true,
      min: 0,
      max: 100,
      message: 'International Stocks allocation must be between 0% and 100%'
    },
    bonds: {
      required: true,
      min: 0,
      max: 100,
      message: 'Bonds allocation must be between 0% and 100%'
    },
    realEstate: {
      required: true,
      min: 0,
      max: 100,
      message: 'Real Estate allocation must be between 0% and 100%'
    },
    commodities: {
      required: true,
      min: 0,
      max: 100,
      message: 'Commodities allocation must be between 0% and 100%'
    },
    cash: {
      required: true,
      min: 0,
      max: 100,
      message: 'Cash allocation must be between 0% and 100%'
    },
    crypto: {
      required: true,
      min: 0,
      max: 100,
      message: 'Cryptocurrency allocation must be between 0% and 100%'
    },
    age: {
      required: true,
      min: 18,
      max: 100,
      message: 'Age must be between 18 and 100'
    },
    riskTolerance: {
      required: true,
      message: 'Risk tolerance is required'
    },
    investmentHorizon: {
      required: true,
      min: 1,
      max: 50,
      message: 'Investment horizon must be between 1 and 50 years'
    }
  },

  cryptoAllocation: {
    totalPortfolio: ValidationPresets.currency(1000, 100000000),
    cryptoPercentage: ValidationPresets.percentage(0, 50),
    bitcoin: ValidationPresets.percentage(0, 100),
    ethereum: ValidationPresets.percentage(0, 100),
    altcoins: ValidationPresets.percentage(0, 100),
    defi: ValidationPresets.percentage(0, 100),
    stablecoins: ValidationPresets.percentage(0, 100),
    riskTolerance: {
      required: true,
      message: 'Risk tolerance is required'
    },
    investmentHorizon: ValidationPresets.years(1, 20),
    rebalanceFrequency: {
      required: true,
      message: 'Rebalance frequency is required'
    }
  }
};

/**
 * Utility to format validation errors for display
 */
export function formatValidationErrors(errors: Record<string, string>): string[] {
  return Object.values(errors);
}

/**
 * Utility to check if any field has errors
 */
export function hasValidationErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Real-time validation hook for React components
 */
export function useFieldValidation(
  value: any,
  rules: ValidationRule,
  fieldName: string
): {
  error: string | null;
  isValid: boolean;
} {
  const error = validateField(value, rules, fieldName);
  return {
    error,
    isValid: error === null
  };
}
