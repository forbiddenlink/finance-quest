'use client';

import { useCalculatorBase } from '../useCalculatorBase';
import { commonValidations } from '../useCalculatorBase';
import { Decimal } from 'decimal.js';

interface EmergencyFundValues {
  // Basic Information
  monthlyExpenses: number;
  monthlyIncome: number;
  currentSavings: number;
  monthlySavingsTarget: number;

  // Risk Factors
  jobStability: 'stable' | 'variable' | 'unstable';
  incomeType: 'salary' | 'hourly' | 'commission' | 'self-employed';
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  dependents: number;
  housingType: 'own' | 'mortgage' | 'rent';
  debtLevel: 'none' | 'low' | 'moderate' | 'high';
  insuranceCoverage: 'comprehensive' | 'basic' | 'minimal' | 'none';
  industryStability: 'growing' | 'stable' | 'declining';

  // Building Strategy
  savingsStrategy: 'conservative' | 'moderate' | 'aggressive';
  useHighYieldSavings: boolean;
  includeInflation: boolean;
}

interface EmergencyFundResult {
  // Fund Size Analysis
  recommendedMonths: number;
  minimumFund: number;
  recommendedFund: number;
  optimalFund: number;
  riskScore: number;

  // Building Timeline
  monthsToMinimum: number;
  monthsToRecommended: number;
  monthsToOptimal: number;
  projectedSavings: Array<{
    month: number;
    balance: number;
    milestone: string;
  }>;

  // Risk Analysis
  riskFactors: Array<{
    factor: string;
    level: 'high' | 'medium' | 'low';
    impact: number;
    recommendation: string;
  }>;

  // Building Strategy
  buildingPhases: Array<{
    phase: number;
    name: string;
    targetAmount: number;
    description: string;
    priority: 'critical' | 'important' | 'optimal';
    tips: string[];
  }>;

  // Insights
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
  }>;
}

export function useEmergencyFund() {
  return useCalculatorBase<EmergencyFundValues, EmergencyFundResult>({
    id: 'emergency-fund-calculator',
    initialValues: {
      monthlyExpenses: 4000,
      monthlyIncome: 6000,
      currentSavings: 5000,
      monthlySavingsTarget: 1000,
      jobStability: 'stable',
      incomeType: 'salary',
      healthStatus: 'good',
      dependents: 0,
      housingType: 'rent',
      debtLevel: 'low',
      insuranceCoverage: 'basic',
      industryStability: 'stable',
      savingsStrategy: 'moderate',
      useHighYieldSavings: true,
      includeInflation: true
    },
    validation: {
      monthlyExpenses: [
        commonValidations.required(),
        commonValidations.min(100),
        commonValidations.max(100000)
      ],
      monthlyIncome: [
        commonValidations.required(),
        commonValidations.min(100),
        commonValidations.max(1000000)
      ],
      currentSavings: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      monthlySavingsTarget: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      dependents: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(20)
      ]
    },
    compute: (values) => {
      // Calculate risk score and recommended months
      const riskAnalysis = calculateRiskScore(values);
      const { riskScore, riskFactors } = riskAnalysis;
      const recommendedMonths = calculateRecommendedMonths(riskScore);

      // Calculate fund sizes
      const minimumFund = new Decimal(values.monthlyExpenses).times(3);
      const recommendedFund = new Decimal(values.monthlyExpenses).times(recommendedMonths);
      const optimalFund = new Decimal(values.monthlyExpenses).times(recommendedMonths + 2);

      // Calculate building timeline
      const timeline = calculateBuildingTimeline(values, {
        minimumFund: minimumFund.toNumber(),
        recommendedFund: recommendedFund.toNumber(),
        optimalFund: optimalFund.toNumber()
      });

      // Generate building phases
      const buildingPhases = generateBuildingPhases(values, recommendedMonths);

      // Generate insights
      const insights = generateInsights(values, {
        riskScore,
        recommendedMonths,
        timeline,
        currentFund: values.currentSavings
      });

      return {
        recommendedMonths,
        minimumFund: minimumFund.toNumber(),
        recommendedFund: recommendedFund.toNumber(),
        optimalFund: optimalFund.toNumber(),
        riskScore,
        ...timeline,
        riskFactors,
        buildingPhases,
        insights
      };
    }
  });
}

function calculateRiskScore(values: EmergencyFundValues) {
  const riskFactors: EmergencyFundResult['riskFactors'] = [];
  let totalRisk = 0;

  // Job and Income Stability (0-3 points)
  const jobRisk = {
    stable: 0,
    variable: 1.5,
    unstable: 3
  }[values.jobStability];
  totalRisk += jobRisk;
  riskFactors.push({
    factor: 'Job Stability',
    level: jobRisk > 2 ? 'high' : jobRisk > 1 ? 'medium' : 'low',
    impact: jobRisk,
    recommendation: jobRisk > 1 ? 'Consider building a larger emergency fund due to job uncertainty' : 'Your stable job provides good foundation'
  });

  // Income Type (0-2 points)
  const incomeRisk = {
    salary: 0,
    hourly: 0.5,
    commission: 1.5,
    'self-employed': 2
  }[values.incomeType];
  totalRisk += incomeRisk;
  riskFactors.push({
    factor: 'Income Type',
    level: incomeRisk > 1 ? 'high' : incomeRisk > 0.5 ? 'medium' : 'low',
    impact: incomeRisk,
    recommendation: incomeRisk > 1 ? 'Variable income requires larger safety net' : 'Regular income provides stability'
  });

  // Health Status (0-2 points)
  const healthRisk = {
    excellent: 0,
    good: 0.5,
    fair: 1,
    poor: 2
  }[values.healthStatus];
  totalRisk += healthRisk;
  riskFactors.push({
    factor: 'Health Status',
    level: healthRisk > 1 ? 'high' : healthRisk > 0.5 ? 'medium' : 'low',
    impact: healthRisk,
    recommendation: healthRisk > 0.5 ? 'Health concerns suggest need for larger fund' : 'Good health reduces emergency risk'
  });

  // Dependents (0-3 points)
  const dependentRisk = Math.min(values.dependents * 0.5, 3);
  totalRisk += dependentRisk;
  riskFactors.push({
    factor: 'Dependents',
    level: dependentRisk > 2 ? 'high' : dependentRisk > 1 ? 'medium' : 'low',
    impact: dependentRisk,
    recommendation: dependentRisk > 1 ? 'Multiple dependents increase emergency fund needs' : 'Fewer dependents mean lower risk'
  });

  // Housing Type (0-2 points)
  const housingRisk = {
    own: 0,
    mortgage: 1,
    rent: 2
  }[values.housingType];
  totalRisk += housingRisk;
  riskFactors.push({
    factor: 'Housing Situation',
    level: housingRisk > 1 ? 'high' : housingRisk > 0.5 ? 'medium' : 'low',
    impact: housingRisk,
    recommendation: housingRisk > 1 ? 'Renting may require larger emergency fund' : 'Home ownership provides stability'
  });

  // Debt Level (0-3 points)
  const debtRisk = {
    none: 0,
    low: 1,
    moderate: 2,
    high: 3
  }[values.debtLevel];
  totalRisk += debtRisk;
  riskFactors.push({
    factor: 'Debt Level',
    level: debtRisk > 2 ? 'high' : debtRisk > 1 ? 'medium' : 'low',
    impact: debtRisk,
    recommendation: debtRisk > 1 ? 'High debt suggests need for larger safety net' : 'Low debt reduces financial risk'
  });

  // Insurance Coverage (0-2 points)
  const insuranceRisk = {
    comprehensive: 0,
    basic: 0.5,
    minimal: 1,
    none: 2
  }[values.insuranceCoverage];
  totalRisk += insuranceRisk;
  riskFactors.push({
    factor: 'Insurance Coverage',
    level: insuranceRisk > 1 ? 'high' : insuranceRisk > 0.5 ? 'medium' : 'low',
    impact: insuranceRisk,
    recommendation: insuranceRisk > 0.5 ? 'Limited insurance suggests larger emergency fund' : 'Good coverage reduces emergency risk'
  });

  // Industry Stability (0-2 points)
  const industryRisk = {
    growing: 0,
    stable: 0.5,
    declining: 2
  }[values.industryStability];
  totalRisk += industryRisk;
  riskFactors.push({
    factor: 'Industry Stability',
    level: industryRisk > 1 ? 'high' : industryRisk > 0.5 ? 'medium' : 'low',
    impact: industryRisk,
    recommendation: industryRisk > 1 ? 'Industry volatility requires larger safety net' : 'Stable industry reduces risk'
  });

  return {
    riskScore: totalRisk,
    riskFactors: riskFactors.sort((a, b) => b.impact - a.impact)
  };
}

function calculateRecommendedMonths(riskScore: number): number {
  // Base recommendation is 3-6 months
  // Risk score adjusts this up or down
  const baseMonths = 3;
  const additionalMonths = Math.ceil(riskScore);
  return Math.min(Math.max(baseMonths + additionalMonths, 3), 12);
}

function calculateBuildingTimeline(
  values: EmergencyFundValues,
  targets: { minimumFund: number; recommendedFund: number; optimalFund: number }
) {
  const monthlySavings = new Decimal(values.monthlySavingsTarget);
  const currentSavings = new Decimal(values.currentSavings);
  
  // Calculate months to reach each target
  const monthsToMinimum = Math.ceil(
    new Decimal(targets.minimumFund)
      .minus(currentSavings)
      .div(monthlySavings)
      .toNumber()
  );

  const monthsToRecommended = Math.ceil(
    new Decimal(targets.recommendedFund)
      .minus(currentSavings)
      .div(monthlySavings)
      .toNumber()
  );

  const monthsToOptimal = Math.ceil(
    new Decimal(targets.optimalFund)
      .minus(currentSavings)
      .div(monthlySavings)
      .toNumber()
  );

  // Generate monthly projections
  const projectedSavings: EmergencyFundResult['projectedSavings'] = [];
  let currentBalance = currentSavings;
  const totalMonths = monthsToOptimal;

  for (let month = 0; month <= totalMonths; month++) {
    const balance = currentBalance.plus(monthlySavings.times(month));
    let milestone = '';

    if (balance.gte(targets.minimumFund) && !projectedSavings.find(p => p.milestone === 'Minimum Fund')) {
      milestone = 'Minimum Fund';
    } else if (balance.gte(targets.recommendedFund) && !projectedSavings.find(p => p.milestone === 'Recommended Fund')) {
      milestone = 'Recommended Fund';
    } else if (balance.gte(targets.optimalFund) && !projectedSavings.find(p => p.milestone === 'Optimal Fund')) {
      milestone = 'Optimal Fund';
    }

    projectedSavings.push({
      month,
      balance: balance.toNumber(),
      milestone
    });
  }

  return {
    monthsToMinimum,
    monthsToRecommended,
    monthsToOptimal,
    projectedSavings
  };
}

function generateBuildingPhases(
  values: EmergencyFundValues,
  recommendedMonths: number
): EmergencyFundResult['buildingPhases'] {
  const monthlyExpenses = new Decimal(values.monthlyExpenses);

  return [
    {
      phase: 1,
      name: 'Starter Emergency Fund',
      targetAmount: 1000,
      description: 'Initial safety net for small emergencies',
      priority: 'critical',
      tips: [
        'Focus on this before paying extra on low-interest debt',
        'Use any windfalls (tax refunds, bonuses) to jumpstart',
        'Sell unused items to boost initial savings',
        'Consider a side gig for faster progress'
      ]
    },
    {
      phase: 2,
      name: 'Basic Emergency Fund',
      targetAmount: monthlyExpenses.times(3).toNumber(),
      description: '3 months of essential expenses',
      priority: 'important',
      tips: [
        'Automate transfers right after payday',
        'Reduce discretionary spending temporarily',
        'Use the 50/30/20 budget rule',
        'Track progress weekly for motivation'
      ]
    },
    {
      phase: 3,
      name: 'Full Emergency Fund',
      targetAmount: monthlyExpenses.times(recommendedMonths).toNumber(),
      description: `${recommendedMonths} months of complete protection`,
      priority: 'optimal',
      tips: [
        'Maintain this level based on your risk factors',
        values.useHighYieldSavings ? 'Keep funds in high-yield savings for better returns' : 'Consider high-yield savings for better returns',
        'Review and adjust fund size annually',
        'Balance emergency savings with other financial goals'
      ]
    }
  ];
}

function generateInsights(
  values: EmergencyFundValues,
  analysis: {
    riskScore: number;
    recommendedMonths: number;
    timeline: ReturnType<typeof calculateBuildingTimeline>;
    currentFund: number;
  }
): EmergencyFundResult['insights'] {
  const insights: EmergencyFundResult['insights'] = [];

  // Fund size insights
  const minimumFund = new Decimal(values.monthlyExpenses).times(3);
  const currentFundRatio = new Decimal(values.currentSavings).div(minimumFund);

  if (currentFundRatio.lt(1)) {
    insights.push({
      type: 'warning',
      message: 'Current savings below minimum recommended emergency fund'
    });
  } else if (currentFundRatio.gte(1) && currentFundRatio.lt(analysis.recommendedMonths / 3)) {
    insights.push({
      type: 'info',
      message: 'Basic emergency fund established, continue building to recommended level'
    });
  } else {
    insights.push({
      type: 'success',
      message: 'Emergency fund at or above recommended level'
    });
  }

  // Savings rate insights
  const monthlyIncomeDecimal = new Decimal(values.monthlyIncome);
  const savingsRate = new Decimal(values.monthlySavingsTarget).div(monthlyIncomeDecimal).times(100);

  if (savingsRate.lt(10)) {
    insights.push({
      type: 'warning',
      message: 'Current savings rate may slow emergency fund building'
    });
  } else if (savingsRate.gt(20)) {
    insights.push({
      type: 'success',
      message: 'Strong savings rate will help reach goals faster'
    });
  }

  // Risk-based insights
  if (analysis.riskScore > 10) {
    insights.push({
      type: 'warning',
      message: 'High risk factors suggest need for larger emergency fund'
    });
  }

  // Strategy insights
  if (values.useHighYieldSavings) {
    insights.push({
      type: 'success',
      message: 'High-yield savings account will help fund grow while maintaining liquidity'
    });
  } else {
    insights.push({
      type: 'info',
      message: 'Consider high-yield savings account to earn better returns on emergency fund'
    });
  }

  // Timeline insights
  if (analysis.timeline.monthsToRecommended > 24) {
    insights.push({
      type: 'warning',
      message: 'Long timeline to reach recommended fund size, consider increasing savings rate'
    });
  }

  // Debt and emergency fund balance
  if (values.debtLevel === 'high' && currentFundRatio.lt(1)) {
    insights.push({
      type: 'warning',
      message: 'High debt level with low emergency fund increases financial risk'
    });
  }

  return insights;
}

