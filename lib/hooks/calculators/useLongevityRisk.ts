import { useCalculatorBase } from '../useCalculatorBase';
import { financialUtils } from '@/lib/utils/financial';
import Decimal from 'decimal.js';

// Types
interface LongevityRiskValues {
  // Personal Information
  currentAge: number;
  gender: 'male' | 'female';
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  familyLongevity: {
    parents: number; // Average age of parents' death or current age
    grandparents: number; // Average age of grandparents' death
    siblings?: number; // Optional: Average age of siblings' death or current age
  };
  lifestyle: {
    smoking: boolean;
    exercise: 'sedentary' | 'moderate' | 'active';
    diet: 'poor' | 'average' | 'healthy';
    stress: 'low' | 'moderate' | 'high';
  };

  // Financial Information
  currentSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  retirementAge: number;
  socialSecurityBenefit: number;
  pensionIncome?: number;
  otherIncome?: number;
  inflationAssumption: number;
  investmentReturn: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';

  // Healthcare Considerations
  chronicConditions: boolean;
  familyHealthHistory: {
    heartDisease: boolean;
    cancer: boolean;
    diabetes: boolean;
    alzheimers: boolean;
  };
  longTermCareInsurance: boolean;
  medicareSupplement: boolean;
}

interface LongevityRiskResult {
  // Life Expectancy Analysis
  lifeExpectancy: {
    median: number;
    percentile90: number;
    percentile95: number;
    factors: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
  };

  // Financial Projections
  financialProjections: Array<{
    age: number;
    savings: number;
    income: number;
    expenses: number;
    netWorth: number;
    fundingStatus: 'adequate' | 'warning' | 'critical';
  }>;

  // Risk Analysis
  riskAnalysis: {
    longevityRisk: 'low' | 'moderate' | 'high';
    shortfallRisk: 'low' | 'moderate' | 'high';
    healthcareRisk: 'low' | 'moderate' | 'high';
    inflationRisk: 'low' | 'moderate' | 'high';
    riskFactors: Array<{
      factor: string;
      severity: 'low' | 'moderate' | 'high';
      impact: string;
    }>;
  };

  // Healthcare Projections
  healthcareProjections: {
    annualCosts: Array<{
      age: number;
      basicCare: number;
      chronicCare: number;
      longTermCare: number;
      totalCost: number;
    }>;
    lifetimeCosts: {
      expectedTotal: number;
      worstCase: number;
      insuranceCoverage: number;
      outOfPocket: number;
    };
  };

  // Recommendations
  recommendations: {
    savingsAdjustment: number;
    expenseReduction: number;
    retirementAgeAdjustment: number;
    insuranceNeeds: string[];
    lifestyleChanges: string[];
    investmentStrategy: string[];
  };

  // Stress Tests
  stressTests: {
    earlyRetirement: {
      feasible: boolean;
      impact: number;
    };
    marketDownturn: {
      recoveryPeriod: number;
      minimumSavings: number;
    };
    highInflation: {
      additionalSavingsNeeded: number;
      impactOnExpenses: number;
    };
    healthEvent: {
      costImpact: number;
      recoveryTime: number;
    };
  };
}

// Validation rules
const validationRules = {
  currentAge: (value: number) => {
    if (value < 25) return 'Current age must be at least 25';
    if (value > 90) return 'Current age cannot exceed 90';
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
  'familyLongevity.parents': (value: number) => {
    if (value < 40) return 'Parents age seems unusually low';
    if (value > 120) return 'Parents age seems unusually high';
    return null;
  },
  'familyLongevity.grandparents': (value: number) => {
    if (value < 40) return 'Grandparents age seems unusually low';
    if (value > 120) return 'Grandparents age seems unusually high';
    return null;
  },
  'lifestyle.exercise': (value: string) => {
    if (!['sedentary', 'moderate', 'active'].includes(value)) {
      return 'Invalid exercise level';
    }
    return null;
  },
  'lifestyle.diet': (value: string) => {
    if (!['poor', 'average', 'healthy'].includes(value)) {
      return 'Invalid diet quality';
    }
    return null;
  },
  'lifestyle.stress': (value: string) => {
    if (!['low', 'moderate', 'high'].includes(value)) {
      return 'Invalid stress level';
    }
    return null;
  },
  currentSavings: (value: number) => {
    if (value < 0) return 'Current savings cannot be negative';
    return null;
  },
  monthlyIncome: (value: number) => {
    if (value < 0) return 'Monthly income cannot be negative';
    return null;
  },
  monthlyExpenses: (value: number) => {
    if (value < 0) return 'Monthly expenses cannot be negative';
    return null;
  },
  retirementAge: (value: number, values: LongevityRiskValues) => {
    if (value <= values.currentAge) {
      return 'Retirement age must be greater than current age';
    }
    if (value > 90) return 'Retirement age cannot exceed 90';
    return null;
  },
  socialSecurityBenefit: (value: number) => {
    if (value < 0) return 'Social Security benefit cannot be negative';
    if (value > 4000) return 'Social Security benefit seems unusually high';
    return null;
  },
  inflationAssumption: (value: number) => {
    if (value < 0) return 'Inflation assumption cannot be negative';
    if (value > 10) return 'Inflation assumption seems unusually high';
    return null;
  },
  investmentReturn: (value: number) => {
    if (value < -2) return 'Investment return seems unusually low';
    if (value > 15) return 'Investment return seems unusually high';
    return null;
  },
  riskTolerance: (value: string) => {
    if (!['conservative', 'moderate', 'aggressive'].includes(value)) {
      return 'Invalid risk tolerance';
    }
    return null;
  }
};

// Initial values
const initialValues: LongevityRiskValues = {
  currentAge: 55,
  gender: 'male',
  healthStatus: 'good',
  familyLongevity: {
    parents: 80,
    grandparents: 85
  },
  lifestyle: {
    smoking: false,
    exercise: 'moderate',
    diet: 'average',
    stress: 'moderate'
  },
  currentSavings: 500000,
  monthlyIncome: 6000,
  monthlyExpenses: 4000,
  retirementAge: 65,
  socialSecurityBenefit: 2000,
  inflationAssumption: 2.5,
  investmentReturn: 6,
  riskTolerance: 'moderate',
  chronicConditions: false,
  familyHealthHistory: {
    heartDisease: false,
    cancer: false,
    diabetes: false,
    alzheimers: false
  },
  longTermCareInsurance: false,
  medicareSupplement: true
};

// Calculator hook
export function useLongevityRisk() {
  return useCalculatorBase<LongevityRiskValues, LongevityRiskResult>({
    id: 'longevity-risk',
    initialValues,
    validation: validationRules,
    compute: async (values) => {
      // Calculate life expectancy
      const lifeExpectancy = calculateLifeExpectancy(values);

      // Generate financial projections
      const financialProjections = generateFinancialProjections(values, lifeExpectancy);

      // Analyze risks
      const riskAnalysis = analyzeRisks(values, {
        lifeExpectancy,
        financialProjections
      });

      // Project healthcare costs
      const healthcareProjections = projectHealthcareCosts(values, lifeExpectancy);

      // Generate recommendations
      const recommendations = generateRecommendations(values, {
        lifeExpectancy,
        financialProjections,
        riskAnalysis,
        healthcareProjections
      });

      // Perform stress tests
      const stressTests = performStressTests(values, {
        lifeExpectancy,
        financialProjections,
        healthcareProjections
      });

      return {
        lifeExpectancy,
        financialProjections,
        riskAnalysis,
        healthcareProjections,
        recommendations,
        stressTests
      };
    }
  });
}

// Helper functions
function calculateLifeExpectancy(values: LongevityRiskValues) {
  let baseExpectancy = values.gender === 'female' ? 81 : 76;
  const factors: Array<{ factor: string; impact: number; description: string }> = [];

  // Health status adjustment
  const healthImpact = {
    excellent: 5,
    good: 2,
    fair: -2,
    poor: -5
  }[values.healthStatus];
  baseExpectancy += healthImpact;
  factors.push({
    factor: 'Health Status',
    impact: healthImpact,
    description: `${values.healthStatus} health adds ${healthImpact} years`
  });

  // Family longevity
  const familyImpact = (values.familyLongevity.parents + values.familyLongevity.grandparents) / 2;
  if (familyImpact > 80) {
    baseExpectancy += 2;
    factors.push({
      factor: 'Family Longevity',
      impact: 2,
      description: 'Long-lived family history adds 2 years'
    });
  }

  // Lifestyle factors
  if (values.lifestyle.smoking) {
    baseExpectancy -= 10;
    factors.push({
      factor: 'Smoking',
      impact: -10,
      description: 'Smoking reduces life expectancy by 10 years'
    });
  }

  const exerciseImpact = {
    sedentary: -2,
    moderate: 1,
    active: 3
  }[values.lifestyle.exercise];
  baseExpectancy += exerciseImpact;
  factors.push({
    factor: 'Exercise',
    impact: exerciseImpact,
    description: `${values.lifestyle.exercise} exercise level impact`
  });

  const dietImpact = {
    poor: -3,
    average: 0,
    healthy: 2
  }[values.lifestyle.diet];
  baseExpectancy += dietImpact;
  factors.push({
    factor: 'Diet',
    impact: dietImpact,
    description: `${values.lifestyle.diet} diet impact`
  });

  // Health conditions
  if (values.chronicConditions) {
    baseExpectancy -= 5;
    factors.push({
      factor: 'Chronic Conditions',
      impact: -5,
      description: 'Chronic health conditions impact'
    });
  }

  // Calculate percentiles
  const median = baseExpectancy;
  const percentile90 = median + 5;
  const percentile95 = median + 8;

  return {
    median,
    percentile90,
    percentile95,
    factors
  };
}

function generateFinancialProjections(
  values: LongevityRiskValues,
  lifeExpectancy: LongevityRiskResult['lifeExpectancy']
) {
  const projections: LongevityRiskResult['financialProjections'] = [];
  let currentSavings = values.currentSavings;
  const monthlyNetSavings = values.monthlyIncome - values.monthlyExpenses;
  const inflationFactor = 1 + (values.inflationAssumption / 100);
  const returnFactor = 1 + (values.investmentReturn / 100);

  for (let age = values.currentAge; age <= lifeExpectancy.percentile95; age++) {
    let income = values.monthlyIncome * 12;
    let expenses = values.monthlyExpenses * 12;

    // Adjust for retirement
    if (age >= values.retirementAge) {
      income = (values.socialSecurityBenefit + (values.pensionIncome || 0) + (values.otherIncome || 0)) * 12;
      expenses *= inflationFactor ** (age - values.currentAge);
    }

    // Calculate savings growth
    currentSavings *= returnFactor;
    if (age < values.retirementAge) {
      currentSavings += monthlyNetSavings * 12;
    } else {
      currentSavings -= expenses - income;
    }

    const netWorth = currentSavings;
    const fundingStatus = determineFundingStatus(currentSavings, expenses, age - values.retirementAge);

    projections.push({
      age,
      savings: currentSavings,
      income,
      expenses,
      netWorth,
      fundingStatus
    });
  }

  return projections;
}

function determineFundingStatus(
  savings: number,
  annualExpenses: number,
  yearsInRetirement: number
): 'adequate' | 'warning' | 'critical' {
  const expenseMultiple = savings / annualExpenses;

  if (yearsInRetirement < 0) {
    return expenseMultiple >= 25 ? 'adequate' :
           expenseMultiple >= 15 ? 'warning' : 'critical';
  }

  return expenseMultiple >= 20 ? 'adequate' :
         expenseMultiple >= 10 ? 'warning' : 'critical';
}

function analyzeRisks(
  values: LongevityRiskValues,
  analysis: {
    lifeExpectancy: LongevityRiskResult['lifeExpectancy'];
    financialProjections: LongevityRiskResult['financialProjections'];
  }
): LongevityRiskResult['riskAnalysis'] {
  const riskFactors: Array<{
    factor: string;
    severity: 'low' | 'moderate' | 'high';
    impact: string;
  }> = [];

  // Analyze longevity risk
  const longevityRisk = determineLongevityRisk(values, analysis.lifeExpectancy);
  riskFactors.push({
    factor: 'Longevity',
    severity: longevityRisk,
    impact: `Risk of outliving median life expectancy by ${
      analysis.lifeExpectancy.percentile95 - analysis.lifeExpectancy.median
    } years`
  });

  // Analyze shortfall risk
  const shortfallRisk = determineShortfallRisk(analysis.financialProjections);
  riskFactors.push({
    factor: 'Financial Shortfall',
    severity: shortfallRisk,
    impact: 'Risk of depleting retirement savings'
  });

  // Analyze healthcare risk
  const healthcareRisk = determineHealthcareRisk(values);
  riskFactors.push({
    factor: 'Healthcare Costs',
    severity: healthcareRisk,
    impact: 'Risk of high healthcare expenses'
  });

  // Analyze inflation risk
  const inflationRisk = determineInflationRisk(values);
  riskFactors.push({
    factor: 'Inflation',
    severity: inflationRisk,
    impact: 'Risk of purchasing power erosion'
  });

  return {
    longevityRisk,
    shortfallRisk,
    healthcareRisk,
    inflationRisk,
    riskFactors
  };
}

function determineLongevityRisk(
  values: LongevityRiskValues,
  lifeExpectancy: LongevityRiskResult['lifeExpectancy']
): 'low' | 'moderate' | 'high' {
  const familyLongevityScore = (values.familyLongevity.parents + values.familyLongevity.grandparents) / 2;
  const healthScore = values.healthStatus === 'excellent' ? 3 :
                     values.healthStatus === 'good' ? 2 :
                     values.healthStatus === 'fair' ? 1 : 0;

  const riskScore = familyLongevityScore > 85 ? 3 :
                   familyLongevityScore > 75 ? 2 : 1;

  const totalScore = riskScore + healthScore;
  return totalScore >= 5 ? 'high' :
         totalScore >= 3 ? 'moderate' : 'low';
}

function determineShortfallRisk(
  projections: LongevityRiskResult['financialProjections']
): 'low' | 'moderate' | 'high' {
  const finalProjection = projections[projections.length - 1];
  const criticalYears = projections.filter(p => p.fundingStatus === 'critical').length;
  const warningYears = projections.filter(p => p.fundingStatus === 'warning').length;

  if (criticalYears > projections.length * 0.2) return 'high';
  if (warningYears > projections.length * 0.3) return 'moderate';
  return 'low';
}

function determineHealthcareRisk(values: LongevityRiskValues): 'low' | 'moderate' | 'high' {
  let riskScore = 0;

  // Chronic conditions
  if (values.chronicConditions) riskScore += 3;

  // Family health history
  if (values.familyHealthHistory.heartDisease) riskScore += 2;
  if (values.familyHealthHistory.cancer) riskScore += 2;
  if (values.familyHealthHistory.diabetes) riskScore += 1;
  if (values.familyHealthHistory.alzheimers) riskScore += 2;

  // Insurance coverage
  if (!values.longTermCareInsurance) riskScore += 2;
  if (!values.medicareSupplement) riskScore += 1;

  // Health status
  if (values.healthStatus === 'poor') riskScore += 3;
  if (values.healthStatus === 'fair') riskScore += 2;

  return riskScore >= 8 ? 'high' :
         riskScore >= 4 ? 'moderate' : 'low';
}

function determineInflationRisk(values: LongevityRiskValues): 'low' | 'moderate' | 'high' {
  const inflationSensitivity = values.monthlyExpenses / values.monthlyIncome;
  const investmentSpread = values.investmentReturn - values.inflationAssumption;

  if (inflationSensitivity > 0.7 && investmentSpread < 2) return 'high';
  if (inflationSensitivity > 0.5 && investmentSpread < 3) return 'moderate';
  return 'low';
}

function projectHealthcareCosts(
  values: LongevityRiskValues,
  lifeExpectancy: LongevityRiskResult['lifeExpectancy']
): LongevityRiskResult['healthcareProjections'] {
  const annualCosts: LongevityRiskResult['healthcareProjections']['annualCosts'] = [];
  let lifetimeBasicCare = 0;
  let lifetimeChronicCare = 0;
  let lifetimeLongTermCare = 0;

  for (let age = values.currentAge; age <= lifeExpectancy.percentile95; age++) {
    const yearIndex = age - values.currentAge;
    const inflationFactor = (1 + values.inflationAssumption / 100) ** yearIndex;

    // Basic healthcare costs
    const basicCare = 5000 * inflationFactor * (age > 65 ? 1.5 : 1);

    // Chronic care costs
    const chronicCare = values.chronicConditions ?
      10000 * inflationFactor * (age > 75 ? 2 : 1) : 0;

    // Long-term care costs
    const longTermCare = age > 75 ?
      (values.longTermCareInsurance ? 20000 : 50000) * inflationFactor : 0;

    const totalCost = basicCare + chronicCare + longTermCare;

    annualCosts.push({
      age,
      basicCare,
      chronicCare,
      longTermCare,
      totalCost
    });

    lifetimeBasicCare += basicCare;
    lifetimeChronicCare += chronicCare;
    lifetimeLongTermCare += longTermCare;
  }

  const lifetimeCosts = {
    expectedTotal: lifetimeBasicCare + lifetimeChronicCare + lifetimeLongTermCare,
    worstCase: (lifetimeBasicCare + lifetimeChronicCare + lifetimeLongTermCare) * 1.5,
    insuranceCoverage: values.longTermCareInsurance ?
      lifetimeLongTermCare * 0.7 : 0,
    outOfPocket: (lifetimeBasicCare + lifetimeChronicCare + lifetimeLongTermCare) -
      (values.longTermCareInsurance ? lifetimeLongTermCare * 0.7 : 0)
  };

  return {
    annualCosts,
    lifetimeCosts
  };
}

function generateRecommendations(
  values: LongevityRiskValues,
  analysis: {
    lifeExpectancy: LongevityRiskResult['lifeExpectancy'];
    financialProjections: LongevityRiskResult['financialProjections'];
    riskAnalysis: LongevityRiskResult['riskAnalysis'];
    healthcareProjections: LongevityRiskResult['healthcareProjections'];
  }
): LongevityRiskResult['recommendations'] {
  const recommendations: LongevityRiskResult['recommendations'] = {
    savingsAdjustment: 0,
    expenseReduction: 0,
    retirementAgeAdjustment: 0,
    insuranceNeeds: [],
    lifestyleChanges: [],
    investmentStrategy: []
  };

  // Analyze savings needs
  const finalProjection = analysis.financialProjections[analysis.financialProjections.length - 1];
  if (finalProjection.fundingStatus !== 'adequate') {
    const shortfall = finalProjection.expenses * 25 - finalProjection.savings;
    recommendations.savingsAdjustment = Math.max(0, shortfall / (values.retirementAge - values.currentAge));
  }

  // Analyze expenses
  const expenseRatio = values.monthlyExpenses / values.monthlyIncome;
  if (expenseRatio > 0.7) {
    recommendations.expenseReduction = values.monthlyExpenses * 0.2;
  }

  // Analyze retirement age
  if (analysis.riskAnalysis.shortfallRisk === 'high') {
    recommendations.retirementAgeAdjustment = 2;
  }

  // Insurance recommendations
  if (!values.longTermCareInsurance && values.currentAge > 50) {
    recommendations.insuranceNeeds.push(
      'Consider long-term care insurance to protect against high healthcare costs'
    );
  }
  if (!values.medicareSupplement && values.currentAge > 60) {
    recommendations.insuranceNeeds.push(
      'Consider Medicare supplement insurance for additional healthcare coverage'
    );
  }

  // Lifestyle recommendations
  if (values.lifestyle.exercise === 'sedentary') {
    recommendations.lifestyleChanges.push(
      'Increase physical activity to improve health outcomes'
    );
  }
  if (values.lifestyle.diet === 'poor') {
    recommendations.lifestyleChanges.push(
      'Improve dietary habits to reduce health risks'
    );
  }
  if (values.lifestyle.stress === 'high') {
    recommendations.lifestyleChanges.push(
      'Implement stress management techniques'
    );
  }

  // Investment strategy recommendations
  const yearsToRetirement = values.retirementAge - values.currentAge;
  if (yearsToRetirement > 15 && values.riskTolerance === 'conservative') {
    recommendations.investmentStrategy.push(
      'Consider a more growth-oriented investment strategy given long time horizon'
    );
  }
  if (yearsToRetirement < 5 && values.riskTolerance === 'aggressive') {
    recommendations.investmentStrategy.push(
      'Consider reducing portfolio risk as retirement approaches'
    );
  }

  return recommendations;
}

function performStressTests(
  values: LongevityRiskValues,
  analysis: {
    lifeExpectancy: LongevityRiskResult['lifeExpectancy'];
    financialProjections: LongevityRiskResult['financialProjections'];
    healthcareProjections: LongevityRiskResult['healthcareProjections'];
  }
): LongevityRiskResult['stressTests'] {
  // Early retirement test
  const earlyRetirement = testEarlyRetirement(values, analysis);

  // Market downturn test
  const marketDownturn = testMarketDownturn(values, analysis);

  // High inflation test
  const highInflation = testHighInflation(values, analysis);

  // Health event test
  const healthEvent = testHealthEvent(values, analysis);

  return {
    earlyRetirement,
    marketDownturn,
    highInflation,
    healthEvent
  };
}

function testEarlyRetirement(
  values: LongevityRiskValues,
  analysis: {
    financialProjections: LongevityRiskResult['financialProjections'];
  }
) {
  const earlyRetirementAge = values.retirementAge - 2;
  const monthsEarly = 24;
  const lostIncome = values.monthlyIncome * monthsEarly;
  const additionalExpenses = values.monthlyExpenses * monthsEarly;
  const impact = lostIncome + additionalExpenses;

  return {
    feasible: analysis.financialProjections[0].savings > impact * 2,
    impact
  };
}

function testMarketDownturn(
  values: LongevityRiskValues,
  analysis: {
    financialProjections: LongevityRiskResult['financialProjections'];
  }
) {
  const downturnImpact = values.currentSavings * 0.3; // 30% market decline
  const monthlyContribution = values.monthlyIncome - values.monthlyExpenses;
  const recoveryPeriod = Math.ceil(downturnImpact / (monthlyContribution * 12));
  const minimumSavings = values.currentSavings * 0.7;

  return {
    recoveryPeriod,
    minimumSavings
  };
}

function testHighInflation(
  values: LongevityRiskValues,
  analysis: {
    financialProjections: LongevityRiskResult['financialProjections'];
  }
) {
  const highInflationRate = values.inflationAssumption * 2;
  const yearsInRetirement = analysis.financialProjections.length;
  const normalExpenses = values.monthlyExpenses * 12 * yearsInRetirement;
  const highInflationExpenses = values.monthlyExpenses * 12 * 
    (1 + highInflationRate / 100) ** yearsInRetirement;

  return {
    additionalSavingsNeeded: highInflationExpenses - normalExpenses,
    impactOnExpenses: highInflationExpenses / normalExpenses - 1
  };
}

function testHealthEvent(
  values: LongevityRiskValues,
  analysis: {
    healthcareProjections: LongevityRiskResult['healthcareProjections'];
  }
) {
  const baselineCosts = analysis.healthcareProjections.lifetimeCosts.expectedTotal;
  const severeEventCost = 100000;
  const recoveryMonths = values.healthStatus === 'excellent' ? 6 :
                        values.healthStatus === 'good' ? 9 :
                        values.healthStatus === 'fair' ? 12 : 18;

  return {
    costImpact: severeEventCost,
    recoveryTime: recoveryMonths
  };
}

