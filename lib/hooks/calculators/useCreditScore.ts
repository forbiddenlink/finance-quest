'use client';

import { useCalculatorBase } from '../useCalculatorBase';
import { commonValidations } from '../useCalculatorBase';
import { Decimal } from 'decimal.js';

interface CreditScoreValues {
  // Current Profile
  current: {
    paymentHistory: number;
    creditUtilization: number;
    creditAge: number;
    creditMix: number;
    newCredit: number;
  };
  // Target Profile
  target: {
    paymentHistory: number;
    creditUtilization: number;
    creditAge: number;
    creditMix: number;
    newCredit: number;
  };
}

interface CreditScoreResult {
  // Score Analysis
  currentScore: number;
  targetScore: number;
  scoreChange: number;
  currentGrade: string;
  targetGrade: string;
  timeToTarget: string;

  // Factor Analysis
  factorAnalysis: Array<{
    name: string;
    weight: number;
    current: number;
    target: number;
    impact: number;
    priority: 'high' | 'medium' | 'low';
    timeToImprove: string;
    recommendations: string[];
  }>;

  // Score Projections
  timelineProjections: Array<{
    month: number;
    score: number;
    improvements: string[];
  }>;

  // Insights
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
  }>;
}

export function useCreditScore() {
  return useCalculatorBase<CreditScoreValues, CreditScoreResult>({
    id: 'credit-score-simulator',
    initialValues: {
      current: {
        paymentHistory: 85,
        creditUtilization: 30,
        creditAge: 5,
        creditMix: 3,
        newCredit: 2
      },
      target: {
        paymentHistory: 100,
        creditUtilization: 10,
        creditAge: 8,
        creditMix: 4,
        newCredit: 1
      }
    },
    validation: {
      'current.paymentHistory': [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(100)
      ],
      'current.creditUtilization': [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(100)
      ],
      'current.creditAge': [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(50)
      ],
      'current.creditMix': [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(5)
      ],
      'current.newCredit': [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(10)
      ],
      'target.paymentHistory': [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(100)
      ],
      'target.creditUtilization': [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(100)
      ],
      'target.creditAge': [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(50)
      ],
      'target.creditMix': [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(5)
      ],
      'target.newCredit': [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(10)
      ]
    },
    compute: (values) => {
      // Calculate current and target scores
      const currentScore = calculateCreditScore(values.current);
      const targetScore = calculateCreditScore(values.target);
      const scoreChange = targetScore - currentScore;

      // Analyze factors and generate recommendations
      const factorAnalysis = analyzeFactors(values.current, values.target);

      // Generate timeline projections
      const timelineProjections = generateTimelineProjections(values.current, values.target);

      // Generate insights
      const insights = generateInsights(currentScore, targetScore, factorAnalysis);

      return {
        currentScore,
        targetScore,
        scoreChange,
        currentGrade: getScoreGrade(currentScore),
        targetGrade: getScoreGrade(targetScore),
        timeToTarget: calculateTimeToTarget(factorAnalysis),
        factorAnalysis,
        timelineProjections,
        insights
      };
    }
  });
}

// Helper functions
function calculateCreditScore(profile: CreditScoreValues['current']): number {
  // Factor weights
  const weights = {
    paymentHistory: 0.35,
    creditUtilization: 0.30,
    creditAge: 0.15,
    creditMix: 0.10,
    newCredit: 0.10
  };

  // Calculate weighted scores
  const paymentScore = new Decimal(profile.paymentHistory).times(weights.paymentHistory);
  const utilizationScore = new Decimal(100 - profile.creditUtilization).times(weights.creditUtilization);
  const ageScore = new Decimal(Math.min(profile.creditAge * 10, 100)).times(weights.creditAge);
  const mixScore = new Decimal(profile.creditMix * 20).times(weights.creditMix);
  const newCreditScore = new Decimal(100 - (profile.newCredit * 10)).times(weights.newCredit);

  // Calculate base score (300-850 scale)
  const baseScore = paymentScore
    .plus(utilizationScore)
    .plus(ageScore)
    .plus(mixScore)
    .plus(newCreditScore);

  // Scale to FICO range
  return Math.round(baseScore.times(5.5).plus(300).toNumber());
}

function getScoreGrade(score: number): string {
  if (score >= 800) return 'Exceptional';
  if (score >= 740) return 'Very Good';
  if (score >= 670) return 'Good';
  if (score >= 580) return 'Fair';
  return 'Poor';
}

function analyzeFactors(
  current: CreditScoreValues['current'],
  target: CreditScoreValues['target']
): CreditScoreResult['factorAnalysis'] {
  return [
    {
      name: 'Payment History',
      weight: 35,
      current: current.paymentHistory,
      target: target.paymentHistory,
      impact: (target.paymentHistory - current.paymentHistory) * 0.35,
      priority: current.paymentHistory < 90 ? 'high' : 'low',
      timeToImprove: '6-12 months',
      recommendations: [
        'Set up automatic payments for all accounts',
        'Keep all accounts current',
        'Address any past-due accounts immediately',
        'Consider debt consolidation for better payment management'
      ]
    },
    {
      name: 'Credit Utilization',
      weight: 30,
      current: current.creditUtilization,
      target: target.creditUtilization,
      impact: (current.creditUtilization - target.creditUtilization) * 0.30,
      priority: current.creditUtilization > 30 ? 'high' : 'low',
      timeToImprove: '1-2 months',
      recommendations: [
        'Keep utilization below 30% on all cards',
        'Consider requesting credit limit increases',
        'Pay card balances before statement closing date',
        'Spread purchases across multiple cards'
      ]
    },
    {
      name: 'Credit Age',
      weight: 15,
      current: current.creditAge,
      target: target.creditAge,
      impact: (target.creditAge - current.creditAge) * 0.15,
      priority: current.creditAge < 5 ? 'medium' : 'low',
      timeToImprove: 'Ongoing',
      recommendations: [
        'Keep oldest accounts open',
        'Avoid closing old credit cards',
        'Use older accounts periodically',
        'Be patient as accounts age naturally'
      ]
    },
    {
      name: 'Credit Mix',
      weight: 10,
      current: current.creditMix,
      target: target.creditMix,
      impact: (target.creditMix - current.creditMix) * 0.10,
      priority: current.creditMix < 3 ? 'medium' : 'low',
      timeToImprove: '6-12 months',
      recommendations: [
        'Maintain a mix of credit types',
        'Consider adding a secured loan if lacking installment credit',
        'Keep a good balance of revolving and installment credit',
        'Don\'t open new accounts just for mix improvement'
      ]
    },
    {
      name: 'New Credit',
      weight: 10,
      current: current.newCredit,
      target: target.newCredit,
      impact: (current.newCredit - target.newCredit) * 0.10,
      priority: current.newCredit > 2 ? 'medium' : 'low',
      timeToImprove: '3-6 months',
      recommendations: [
        'Limit new credit applications',
        'Space out new credit requests',
        'Shop for rates within focused timeframes',
        'Let recent inquiries age before applying for more credit'
      ]
    }
  ];
}

function calculateTimeToTarget(factorAnalysis: CreditScoreResult['factorAnalysis']): string {
  const highPriorityFactors = factorAnalysis.filter(f => f.priority === 'high').length;
  const mediumPriorityFactors = factorAnalysis.filter(f => f.priority === 'medium').length;

  if (highPriorityFactors > 1) return '12-18 months';
  if (highPriorityFactors === 1) return '6-12 months';
  if (mediumPriorityFactors > 1) return '6-9 months';
  if (mediumPriorityFactors === 1) return '3-6 months';
  return '1-3 months';
}

function generateTimelineProjections(
  current: CreditScoreValues['current'],
  target: CreditScoreValues['target']
): CreditScoreResult['timelineProjections'] {
  const currentScore = calculateCreditScore(current);
  const targetScore = calculateCreditScore(target);
  const scoreGap = targetScore - currentScore;
  
  const projections: CreditScoreResult['timelineProjections'] = [];
  const months = [0, 3, 6, 9, 12, 18];

  for (const month of months) {
    const improvements: string[] = [];
    let projectedScore = currentScore;

    if (month >= 1) {
      // Utilization improvements (quick impact)
      if (current.creditUtilization > target.creditUtilization) {
        const utilizationImprovement = Math.min(
          (current.creditUtilization - target.creditUtilization) * (month / 3),
          current.creditUtilization - target.creditUtilization
        );
        projectedScore += utilizationImprovement * 2;
        if (utilizationImprovement > 0) {
          improvements.push('Reduced credit utilization');
        }
      }
    }

    if (month >= 6) {
      // Payment history improvements
      if (current.paymentHistory < target.paymentHistory) {
        const paymentImprovement = Math.min(
          (target.paymentHistory - current.paymentHistory) * (month / 12),
          target.paymentHistory - current.paymentHistory
        );
        projectedScore += paymentImprovement * 3;
        if (paymentImprovement > 0) {
          improvements.push('Improved payment history');
        }
      }

      // New credit improvements
      if (current.newCredit > target.newCredit) {
        const newCreditImprovement = Math.min(
          (current.newCredit - target.newCredit) * (month / 6),
          current.newCredit - target.newCredit
        );
        projectedScore += newCreditImprovement * 5;
        if (newCreditImprovement > 0) {
          improvements.push('Reduced recent credit applications');
        }
      }
    }

    if (month >= 12) {
      // Credit mix improvements
      if (current.creditMix < target.creditMix) {
        const mixImprovement = Math.min(
          (target.creditMix - current.creditMix) * (month / 12),
          target.creditMix - current.creditMix
        );
        projectedScore += mixImprovement * 10;
        if (mixImprovement > 0) {
          improvements.push('Diversified credit mix');
        }
      }
    }

    // Credit age improves naturally
    if (month > 0) {
      const ageImprovement = month / 12;
      projectedScore += ageImprovement * 2;
      if (month % 6 === 0) {
        improvements.push('Credit history lengthened');
      }
    }

    // Ensure score doesn't exceed target
    projectedScore = Math.min(projectedScore, targetScore);

    projections.push({
      month,
      score: Math.round(projectedScore),
      improvements
    });
  }

  return projections;
}

function generateInsights(
  currentScore: number,
  targetScore: number,
  factorAnalysis: CreditScoreResult['factorAnalysis']
): CreditScoreResult['insights'] {
  const insights: CreditScoreResult['insights'] = [];

  // Score level insights
  if (currentScore < 580) {
    insights.push({
      type: 'warning',
      message: 'Current score indicates significant credit challenges'
    });
  } else if (currentScore >= 740) {
    insights.push({
      type: 'success',
      message: 'Current score already qualifies for excellent rates'
    });
  }

  // Score improvement potential
  const improvement = targetScore - currentScore;
  if (improvement > 100) {
    insights.push({
      type: 'info',
      message: 'Significant score improvement possible with consistent effort'
    });
  } else if (improvement < 30) {
    insights.push({
      type: 'success',
      message: 'Close to target score - maintain good credit habits'
    });
  }

  // Factor-specific insights
  factorAnalysis.forEach(factor => {
    if (factor.priority === 'high') {
      insights.push({
        type: 'warning',
        message: `Focus on improving ${factor.name.toLowerCase()} for biggest impact`
      });
    }
  });

  // Quick-win opportunities
  const utilizationFactor = factorAnalysis.find(f => f.name === 'Credit Utilization');
  if (utilizationFactor && utilizationFactor.current > 50) {
    insights.push({
      type: 'info',
      message: 'Reducing credit utilization can provide quick score improvements'
    });
  }

  // Long-term considerations
  const ageFactor = factorAnalysis.find(f => f.name === 'Credit Age');
  if (ageFactor && ageFactor.current < 2) {
    insights.push({
      type: 'info',
      message: 'Building credit history takes time - focus on consistent good habits'
    });
  }

  return insights;
}

