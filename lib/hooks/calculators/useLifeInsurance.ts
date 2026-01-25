'use client';

import { useCalculatorBase } from '../useCalculatorBase';
import { formatCurrency } from '@/lib/utils/financial';

// Types
interface LifeInsuranceValues {
  // Personal Information
  age: number;
  gender: 'male' | 'female';
  smoker: boolean;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  familyHistory: {
    heartDisease: boolean;
    cancer: boolean;
    diabetes: boolean;
  };

  // Financial Information
  annualIncome: number;
  totalDebt: number;
  mortgageBalance: number;
  dependents: number;
  yearsOfSupport: number;
  collegeExpenses: boolean;
  existingCoverage: number;
  monthlyBudget?: number;

  // Coverage Preferences
  coverageType: 'term' | 'whole' | 'universal';
  termLength?: number; // Required for term insurance
  cashValuePreference?: 'high' | 'moderate' | 'low'; // For whole/universal
}

interface LifeInsuranceResult {
  // Coverage Analysis
  recommendedCoverage: number;
  coverageBreakdown: {
    incomeReplacement: number;
    debtPayoff: number;
    education: number;
    finalExpenses: number;
  };

  // Risk Assessment
  riskScore: number;
  riskFactors: string[];
  healthClass: 'preferred_plus' | 'preferred' | 'standard_plus' | 'standard' | 'substandard';

  // Cost Estimates
  estimatedPremium: {
    monthly: number;
    annual: number;
  };
  premiumFactors: {
    factor: string;
    impact: 'high' | 'moderate' | 'low';
    description: string;
  }[];

  // Policy Recommendations
  recommendedPolicies: {
    type: string;
    coverage: number;
    term?: number;
    monthlyPremium: number;
    features: string[];
    pros: string[];
    cons: string[];
  }[];

  // Financial Analysis
  affordabilityAnalysis: {
    affordabilityScore: number;
    monthlyBudgetImpact: number;
    recommendations: string[];
  };

  // Additional Insights
  insights: string[];
  warnings: string[];
}

// Validation rules
const validationRules = {
  age: (value: number) => {
    if (value < 18) return 'Age must be at least 18';
    if (value > 85) return 'Age cannot exceed 85';
    return null;
  },
  gender: (value: string) => {
    if (!['male', 'female'].includes(value)) {
      return 'Invalid gender selection';
    }
    return null;
  },
  healthStatus: (value: string) => {
    if (!['excellent', 'good', 'fair', 'poor'].includes(value)) {
      return 'Invalid health status';
    }
    return null;
  },
  annualIncome: (value: number) => {
    if (value < 0) return 'Annual income cannot be negative';
    if (value > 10000000) return 'Annual income exceeds maximum limit';
    return null;
  },
  totalDebt: (value: number) => {
    if (value < 0) return 'Total debt cannot be negative';
    return null;
  },
  mortgageBalance: (value: number) => {
    if (value < 0) return 'Mortgage balance cannot be negative';
    return null;
  },
  dependents: (value: number) => {
    if (value < 0) return 'Number of dependents cannot be negative';
    if (value > 20) return 'Number of dependents exceeds maximum limit';
    return null;
  },
  yearsOfSupport: (value: number) => {
    if (value < 0) return 'Years of support cannot be negative';
    if (value > 50) return 'Years of support exceeds maximum limit';
    return null;
  },
  existingCoverage: (value: number) => {
    if (value < 0) return 'Existing coverage cannot be negative';
    return null;
  },
  monthlyBudget: (value: number | undefined) => {
    if (value === undefined) return null;
    if (value < 0) return 'Monthly budget cannot be negative';
    return null;
  },
  coverageType: (value: string) => {
    if (!['term', 'whole', 'universal'].includes(value)) {
      return 'Invalid coverage type';
    }
    return null;
  },
  termLength: (value: number | undefined, values: LifeInsuranceValues) => {
    if (values.coverageType === 'term') {
      if (!value) return 'Term length is required for term insurance';
      if (value < 5) return 'Term length must be at least 5 years';
      if (value > 30) return 'Term length cannot exceed 30 years';
    }
    return null;
  }
};

// Initial values
const initialValues: LifeInsuranceValues = {
  age: 30,
  gender: 'male',
  smoker: false,
  healthStatus: 'good',
  familyHistory: {
    heartDisease: false,
    cancer: false,
    diabetes: false
  },
  annualIncome: 75000,
  totalDebt: 50000,
  mortgageBalance: 200000,
  dependents: 2,
  yearsOfSupport: 20,
  collegeExpenses: true,
  existingCoverage: 0,
  coverageType: 'term',
  termLength: 20
};

// Calculator hook
export function useLifeInsurance() {
  return useCalculatorBase<LifeInsuranceValues, LifeInsuranceResult>({
    id: 'life-insurance',
    initialValues,
    validation: validationRules,
    compute: async (values) => {
      // Calculate recommended coverage
      const coverageBreakdown = calculateCoverageBreakdown(values);
      const recommendedCoverage = Object.values(coverageBreakdown).reduce((a, b) => a + b, 0);

      // Assess risk and determine health class
      const { riskScore, riskFactors, healthClass } = assessRisk(values);

      // Calculate premium estimates
      const { estimatedPremium, premiumFactors } = calculatePremiums(values, recommendedCoverage, healthClass);

      // Generate policy recommendations
      const recommendedPolicies = generatePolicyRecommendations(values, recommendedCoverage, estimatedPremium);

      // Analyze affordability
      const affordabilityAnalysis = analyzeAffordability(values, estimatedPremium);

      // Generate insights and warnings
      const { insights, warnings } = generateInsights(values, {
        recommendedCoverage,
        estimatedPremium,
        healthClass,
        affordabilityAnalysis
      });

      return {
        recommendedCoverage,
        coverageBreakdown,
        riskScore,
        riskFactors,
        healthClass,
        estimatedPremium,
        premiumFactors,
        recommendedPolicies,
        affordabilityAnalysis,
        insights,
        warnings
      };
    }
  });
}

// Helper functions
function calculateCoverageBreakdown(values: LifeInsuranceValues) {
  const incomeReplacement = values.annualIncome * values.yearsOfSupport;
  const debtPayoff = values.totalDebt + values.mortgageBalance;
  const education = values.collegeExpenses ? 
    values.dependents * 100000 : // Estimated college cost per dependent
    0;
  const finalExpenses = 25000; // Estimated funeral and final expenses

  return {
    incomeReplacement,
    debtPayoff,
    education,
    finalExpenses
  };
}

function assessRisk(values: LifeInsuranceValues): {
  riskScore: number;
  riskFactors: string[];
  healthClass: 'preferred_plus' | 'preferred' | 'standard_plus' | 'standard' | 'substandard';
} {
  let riskScore = 0;
  const riskFactors: string[] = [];

  // Age factor
  riskScore += values.age * 0.5;
  if (values.age > 60) {
    riskFactors.push('Advanced age increases risk');
  }

  // Smoking factor
  if (values.smoker) {
    riskScore += 50;
    riskFactors.push('Smoking status significantly increases risk');
  }

  // Health status factor
  switch (values.healthStatus) {
    case 'excellent':
      riskScore += 0;
      break;
    case 'good':
      riskScore += 10;
      break;
    case 'fair':
      riskScore += 25;
      riskFactors.push('Fair health status increases risk');
      break;
    case 'poor':
      riskScore += 50;
      riskFactors.push('Poor health status significantly increases risk');
      break;
  }

  // Family history factors
  if (values.familyHistory.heartDisease) {
    riskScore += 15;
    riskFactors.push('Family history of heart disease');
  }
  if (values.familyHistory.cancer) {
    riskScore += 15;
    riskFactors.push('Family history of cancer');
  }
  if (values.familyHistory.diabetes) {
    riskScore += 10;
    riskFactors.push('Family history of diabetes');
  }

  // Determine health class
  let healthClass: 'preferred_plus' | 'preferred' | 'standard_plus' | 'standard' | 'substandard';
  if (riskScore < 20) {
    healthClass = 'preferred_plus';
  } else if (riskScore < 40) {
    healthClass = 'preferred';
  } else if (riskScore < 60) {
    healthClass = 'standard_plus';
  } else if (riskScore < 80) {
    healthClass = 'standard';
  } else {
    healthClass = 'substandard';
  }

  return { riskScore, riskFactors, healthClass };
}

function calculatePremiums(
  values: LifeInsuranceValues,
  coverage: number,
  healthClass: string
): {
  estimatedPremium: { monthly: number; annual: number };
  premiumFactors: Array<{ factor: string; impact: 'high' | 'moderate' | 'low'; description: string }>;
} {
  let baseRate = 0;
  const premiumFactors = [];

  // Base rate calculation
  switch (values.coverageType) {
    case 'term':
      baseRate = 0.1; // Per $1000 of coverage
      break;
    case 'whole':
      baseRate = 0.5;
      break;
    case 'universal':
      baseRate = 0.4;
      break;
  }

  // Age factor
  const ageFactor = 1 + (values.age - 20) * 0.02;
  premiumFactors.push({
    factor: 'Age',
    impact: values.age > 50 ? 'high' : 'moderate',
    description: `Age ${values.age} affects base premium`
  });

  // Health class factor
  let healthFactor = 1;
  switch (healthClass) {
    case 'preferred_plus':
      healthFactor = 0.8;
      break;
    case 'preferred':
      healthFactor = 1;
      break;
    case 'standard_plus':
      healthFactor = 1.25;
      break;
    case 'standard':
      healthFactor = 1.5;
      break;
    case 'substandard':
      healthFactor = 2;
      break;
  }
  premiumFactors.push({
    factor: 'Health Class',
    impact: healthFactor > 1.25 ? 'high' : 'moderate',
    description: `${healthClass.replace('_', ' ').toUpperCase()} health classification`
  });

  // Smoking factor
  const smokingFactor = values.smoker ? 2.5 : 1;
  if (values.smoker) {
    premiumFactors.push({
      factor: 'Smoking',
      impact: 'high',
      description: 'Smoking status significantly increases premium'
    });
  }

  // Calculate monthly premium
  const monthlyPremium = (coverage / 1000) * baseRate * ageFactor * healthFactor * smokingFactor;

  return {
    estimatedPremium: {
      monthly: monthlyPremium,
      annual: monthlyPremium * 12
    },
    premiumFactors
  };
}

function generatePolicyRecommendations(
  values: LifeInsuranceValues,
  coverage: number,
  premium: { monthly: number; annual: number }
): Array<{
  type: string;
  coverage: number;
  term?: number;
  monthlyPremium: number;
  features: string[];
  pros: string[];
  cons: string[];
}> {
  const recommendations = [];

  // Term Life Recommendation
  if (values.age <= 55) {
    recommendations.push({
      type: 'Term Life',
      coverage,
      term: 20,
      monthlyPremium: premium.monthly * 0.9, // Usually cheaper than whole life
      features: [
        'Level premium for term period',
        'Simple and straightforward',
        'High coverage at lower cost'
      ],
      pros: [
        'Most affordable option',
        'Fixed premiums',
        'Simple to understand'
      ],
      cons: [
        'No cash value',
        'Coverage expires',
        'May need to renew at higher rates'
      ]
    });
  }

  // Whole Life Recommendation
  if (values.age <= 65) {
    recommendations.push({
      type: 'Whole Life',
      coverage: coverage * 0.75, // Lower coverage due to higher cost
      monthlyPremium: premium.monthly * 2.5,
      features: [
        'Lifetime coverage',
        'Builds cash value',
        'Fixed premiums'
      ],
      pros: [
        'Permanent coverage',
        'Builds cash value',
        'Tax-advantaged growth'
      ],
      cons: [
        'Higher premiums',
        'Lower initial death benefit',
        'Less flexible'
      ]
    });
  }

  // Universal Life Recommendation
  if (values.age <= 60) {
    recommendations.push({
      type: 'Universal Life',
      coverage: coverage * 0.8,
      monthlyPremium: premium.monthly * 2,
      features: [
        'Flexible premiums',
        'Adjustable death benefit',
        'Cash value growth'
      ],
      pros: [
        'Premium flexibility',
        'Adjustable coverage',
        'Potential cash value growth'
      ],
      cons: [
        'More complex',
        'Returns not guaranteed',
        'Higher fees than term'
      ]
    });
  }

  return recommendations;
}

function analyzeAffordability(
  values: LifeInsuranceValues,
  premium: { monthly: number; annual: number }
): {
  affordabilityScore: number;
  monthlyBudgetImpact: number;
  recommendations: string[];
} {
  const monthlyIncome = values.annualIncome / 12;
  const recommendedMaxPremium = monthlyIncome * 0.05; // 5% of monthly income
  const monthlyBudgetImpact = (premium.monthly / monthlyIncome) * 100;
  
  let affordabilityScore = 100;
  const recommendations: string[] = [];

  // Adjust score based on premium to income ratio
  if (premium.monthly > recommendedMaxPremium) {
    affordabilityScore -= ((premium.monthly - recommendedMaxPremium) / recommendedMaxPremium) * 20;
    recommendations.push('Consider reducing coverage to lower premium costs');
  }

  // Adjust score based on existing debt
  const debtToIncomeRatio = (values.totalDebt / values.annualIncome) * 100;
  if (debtToIncomeRatio > 40) {
    affordabilityScore -= (debtToIncomeRatio - 40) * 0.5;
    recommendations.push('High debt-to-income ratio may impact affordability');
  }

  // Check against specified budget
  if (values.monthlyBudget && premium.monthly > values.monthlyBudget) {
    affordabilityScore -= ((premium.monthly - values.monthlyBudget) / values.monthlyBudget) * 30;
    recommendations.push('Premium exceeds specified monthly budget');
  }

  // Add general recommendations
  if (affordabilityScore < 60) {
    recommendations.push('Consider term life insurance for more affordable coverage');
  }
  if (values.existingCoverage > 0) {
    recommendations.push('Factor in existing coverage when determining additional needs');
  }

  return {
    affordabilityScore: Math.max(0, Math.min(100, affordabilityScore)),
    monthlyBudgetImpact,
    recommendations
  };
}

function generateInsights(
  values: LifeInsuranceValues,
  results: {
    recommendedCoverage: number;
    estimatedPremium: { monthly: number; annual: number };
    healthClass: string;
    affordabilityAnalysis: {
      affordabilityScore: number;
      recommendations: string[];
    };
  }
): { insights: string[]; warnings: string[] } {
  const insights: string[] = [];
  const warnings: string[] = [];

  // Coverage insights
  const coverageToIncomeRatio = results.recommendedCoverage / values.annualIncome;
  insights.push(
    `Recommended coverage is ${coverageToIncomeRatio.toFixed(1)}x annual income`
  );

  if (values.existingCoverage > 0) {
    const totalCoverage = results.recommendedCoverage + values.existingCoverage;
    insights.push(
      `Total coverage with existing policy would be ${formatCurrency(totalCoverage)}`
    );
  }

  // Health and risk insights
  if (values.smoker) {
    warnings.push('Smoking significantly increases premiums and health risks');
  }

  if (values.healthStatus === 'excellent' || values.healthStatus === 'good') {
    insights.push('Good health status qualifies for better rates');
  } else {
    warnings.push('Health status may impact premium rates');
  }

  // Age-based insights
  if (values.age < 35) {
    insights.push('Young age provides opportunity for lower premiums');
  } else if (values.age > 55) {
    warnings.push('Age may limit some coverage options or increase costs');
  }

  // Affordability insights
  if (results.affordabilityAnalysis.affordabilityScore < 70) {
    warnings.push('Premium may be difficult to maintain with current budget');
  }

  // Policy type insights
  switch (values.coverageType) {
    case 'term':
      insights.push(
        `Term policy provides coverage until age ${values.age + (values.termLength || 0)}`
      );
      break;
    case 'whole':
      insights.push('Whole life policy builds cash value over time');
      break;
    case 'universal':
      insights.push('Universal life policy offers premium payment flexibility');
      break;
  }

  // Dependent-related insights
  if (values.dependents > 0) {
    insights.push(
      `Coverage includes support for ${values.dependents} dependent(s) for ${values.yearsOfSupport} years`
    );
  }

  if (values.collegeExpenses) {
    insights.push('Coverage includes estimated college expenses for dependents');
  }

  return { insights, warnings };
}

