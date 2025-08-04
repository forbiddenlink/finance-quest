'use client';

import React, { useState, useCallback, useMemo } from 'react';
import CalculatorWrapper, { 
  CalculatorMetadata, 
  CalculatorInsight 
} from '@/components/shared/calculators/CalculatorWrapper';
import { 
  PercentageInput, 
  NumberInput 
} from '@/components/shared/calculators/FormFields';
import { CreditCard, TrendingUp, Target } from 'lucide-react';
import { theme } from '@/lib/theme';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CreditProfile {
  paymentHistory: string;
  creditUtilization: string;
  creditAge: string;
  creditMix: string;
  newCredit: string;
}

interface CreditFactorAnalysis {
  name: string;
  current: number;
  target: number;
  weight: number;
  impact: number;
  priority: 'high' | 'medium' | 'low';
}

interface ScoreProjection {
  month: number;
  score: number;
  description: string;
}

export default function CreditScoreSimulator() {
  // Current credit profile
  const [currentProfile, setCurrentProfile] = useState<CreditProfile>({
    paymentHistory: '95',
    creditUtilization: '30',
    creditAge: '3',
    creditMix: '3',
    newCredit: '2'
  });

  // Target improvements
  const [targetProfile, setTargetProfile] = useState<CreditProfile>({
    paymentHistory: '100',
    creditUtilization: '10',
    creditAge: '5',
    creditMix: '4',
    newCredit: '0'
  });

  // Credit score calculation algorithm
  const calculateCreditScore = useCallback((
    paymentHistory: number,
    utilization: number,
    creditAge: number,
    creditMix: number,
    newCredit: number
  ): number => {
    // FICO-like scoring algorithm
    const paymentScore = Math.min(100, paymentHistory) * 0.35;
    const utilizationScore = Math.max(0, 100 - utilization * 2) * 0.30;
    const ageScore = Math.min(100, creditAge * 15) * 0.15;
    const mixScore = Math.min(100, creditMix * 20) * 0.10;
    const inquiryScore = Math.max(0, 100 - newCredit * 15) * 0.10;

    const totalScore = paymentScore + utilizationScore + ageScore + mixScore + inquiryScore;
    const scaledScore = 300 + (totalScore / 100) * 550;

    return Math.round(Math.min(850, Math.max(300, scaledScore)));
  }, []);

  // Calculate current and projected scores
  const scores = useMemo(() => {
    const current = calculateCreditScore(
      parseFloat(currentProfile.paymentHistory),
      parseFloat(currentProfile.creditUtilization),
      parseFloat(currentProfile.creditAge),
      parseFloat(currentProfile.creditMix),
      parseFloat(currentProfile.newCredit)
    );

    const projected = calculateCreditScore(
      parseFloat(targetProfile.paymentHistory),
      parseFloat(targetProfile.creditUtilization),
      parseFloat(targetProfile.creditAge),
      parseFloat(targetProfile.creditMix),
      parseFloat(targetProfile.newCredit)
    );

    return { current, projected, increase: projected - current };
  }, [currentProfile, targetProfile, calculateCreditScore]);

  // Generate factor analysis
  const factorAnalysis = useMemo((): CreditFactorAnalysis[] => {
    const factors = [
      {
        name: 'Payment History',
        current: parseFloat(currentProfile.paymentHistory),
        target: parseFloat(targetProfile.paymentHistory),
        weight: 35,
        impact: (parseFloat(targetProfile.paymentHistory) - parseFloat(currentProfile.paymentHistory)) * 2.45
      },
      {
        name: 'Credit Utilization',
        current: parseFloat(currentProfile.creditUtilization),
        target: parseFloat(targetProfile.creditUtilization),
        weight: 30,
        impact: (parseFloat(currentProfile.creditUtilization) - parseFloat(targetProfile.creditUtilization)) * 2.1
      },
      {
        name: 'Credit Age',
        current: parseFloat(currentProfile.creditAge),
        target: parseFloat(targetProfile.creditAge),
        weight: 15,
        impact: (parseFloat(targetProfile.creditAge) - parseFloat(currentProfile.creditAge)) * 10.5
      },
      {
        name: 'Credit Mix',
        current: parseFloat(currentProfile.creditMix),
        target: parseFloat(targetProfile.creditMix),
        weight: 10,
        impact: (parseFloat(targetProfile.creditMix) - parseFloat(currentProfile.creditMix)) * 14
      },
      {
        name: 'New Credit Inquiries',
        current: parseFloat(currentProfile.newCredit),
        target: parseFloat(targetProfile.newCredit),
        weight: 10,
        impact: (parseFloat(currentProfile.newCredit) - parseFloat(targetProfile.newCredit)) * 11.67
      }
    ];

    return factors.map(factor => ({
      ...factor,
      priority: Math.abs(factor.impact) > 15 ? 'high' : Math.abs(factor.impact) > 5 ? 'medium' : 'low'
    }));
  }, [currentProfile, targetProfile]);

  // Generate timeline projections
  const timelineProjections = useMemo((): ScoreProjection[] => {
    const scoreDiff = scores.increase;
    const timeToTarget = Math.max(1, Math.ceil(Math.abs(scoreDiff) / 10)); // ~10 points per month

    const projections: ScoreProjection[] = [];
    for (let month = 0; month <= timeToTarget; month++) {
      const progress = month / timeToTarget;
      const monthScore = scores.current + (scoreDiff * progress);

      let description = 'Starting point';
      if (month === Math.round(timeToTarget * 0.25)) description = 'Pay down high balances';
      if (month === Math.round(timeToTarget * 0.5)) description = 'Optimize utilization';
      if (month === Math.round(timeToTarget * 0.75)) description = 'Diversify credit mix';
      if (month === timeToTarget) description = 'Target achieved!';

      projections.push({
        month,
        score: Math.round(monthScore),
        description
      });
    }

    return projections;
  }, [scores]);

  // Generate intelligent insights
  const insights = useMemo((): CalculatorInsight[] => {
    const insights: CalculatorInsight[] = [];

    // Score range insights
    if (scores.current < 580) {
      insights.push({
        type: 'error',
        title: 'Poor Credit Score',
        message: 'Focus on payment history and reducing credit utilization below 30%. Consider secured credit cards to rebuild credit.'
      });
    } else if (scores.current < 670) {
      insights.push({
        type: 'warning',
        title: 'Fair Credit Score',
        message: 'Reduce credit utilization below 10% and maintain perfect payment history to reach good credit territory.'
      });
    } else if (scores.current >= 740) {
      insights.push({
        type: 'success',
        title: 'Excellent Credit Score',
        message: 'Maintain your excellent credit habits. Consider maximizing rewards and benefits from premium credit products.'
      });
    }

    // High-impact factor insights
    const highImpactFactors = factorAnalysis.filter(f => f.priority === 'high');
    highImpactFactors.forEach(factor => {
      if (factor.name === 'Credit Utilization' && factor.current > 30) {
        insights.push({
          type: 'warning',
          title: 'High Credit Utilization',
          message: `Your ${factor.current}% utilization is hurting your score. Pay down balances or request credit limit increases to get below 10%.`
        });
      }
      
      if (factor.name === 'Payment History' && factor.current < 100) {
        insights.push({
          type: 'error',
          title: 'Payment History Issues',
          message: 'Set up automatic payments to ensure 100% on-time payment history. This is the most important factor for your credit score.'
        });
      }
    });

    // Improvement potential
    if (scores.increase > 50) {
      insights.push({
        type: 'info',
        title: 'High Improvement Potential',
        message: `You could increase your score by ${scores.increase} points with the targeted improvements. Focus on the highest-impact factors first.`
      });
    }

    return insights;
  }, [scores, factorAnalysis]);

  // Handle input changes
  const updateCurrentProfile = useCallback((field: keyof CreditProfile, value: string) => {
    setCurrentProfile(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateTargetProfile = useCallback((field: keyof CreditProfile, value: string) => {
    setTargetProfile(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setCurrentProfile({
      paymentHistory: '95',
      creditUtilization: '30',
      creditAge: '3',
      creditMix: '3',
      newCredit: '2'
    });
    setTargetProfile({
      paymentHistory: '100',
      creditUtilization: '10',
      creditAge: '5',
      creditMix: '4',
      newCredit: '0'
    });
  }, []);

  const getScoreGrade = (score: number) => {
    if (score >= 800) return 'Exceptional';
    if (score >= 740) return 'Very Good';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  };

  // Calculator metadata
  const metadata: CalculatorMetadata = {
    id: 'credit-score-simulator',
    title: 'Credit Score Simulator',
    description: 'Model credit score improvements and create your optimization strategy',
    category: 'intermediate',
    icon: CreditCard,
    tags: ['credit', 'score', 'fico', 'improvement', 'financial health'],
    educationalNotes: [
      {
        title: 'Understanding Credit Score Factors',
        content: 'Your credit score is calculated using five main factors: payment history (35%), credit utilization (30%), length of credit history (15%), credit mix (10%), and new credit inquiries (10%). Focus on the highest-weighted factors for maximum impact.',
        tips: [
          'Payment history has the biggest impact - never miss a payment',
          'Keep credit utilization below 10% for optimal scoring',
          'Older accounts help your average account age - keep them open',
          'A mix of credit types (cards, loans, mortgage) can help your score',
          'Avoid unnecessary credit inquiries, especially before major purchases'
        ]
      },
      {
        title: 'Credit Score Improvement Strategy',
        content: 'Improving your credit score takes time and consistency. Focus on paying down high balances first, then work on optimizing other factors. Most improvements show up within 1-3 months, but significant changes can take 6-12 months.',
        tips: [
          'Pay down credit cards with highest utilization first',
          'Set up automatic payments to ensure perfect payment history',
          'Request credit limit increases to lower utilization ratios',
          'Consider becoming an authorized user on someone else\'s account',
          'Monitor your credit report regularly and dispute any errors'
        ]
      }
    ]
  };

  // Results formatting
  const results = {
    primary: {
      label: 'Projected Credit Score',
      value: scores.projected,
      format: 'number' as const,
      variant: scores.projected >= 740 ? 'success' as const : scores.projected >= 670 ? 'warning' as const : 'error' as const,
      description: `${getScoreGrade(scores.projected)} credit rating`
    },
    secondary: [
      {
        label: 'Current Score',
        value: scores.current,
        format: 'number' as const,
        description: getScoreGrade(scores.current)
      },
      {
        label: 'Score Increase',
        value: `+${scores.increase}`,
        format: 'number' as const,
        variant: scores.increase > 0 ? 'success' as const : 'info' as const,
        description: 'Potential improvement'
      },
      {
        label: 'Timeline to Target',
        value: timelineProjections.length - 1,
        format: 'months' as const,
        description: 'With consistent improvements'
      },
      {
        label: 'Top Priority Factor',
        value: factorAnalysis.find(f => f.priority === 'high')?.name || 'All factors optimized',
        format: 'number' as const,
        description: 'Focus area for maximum impact'
      }
    ]
  };

  return (
    <CalculatorWrapper
      metadata={metadata}
      results={results}
      insights={insights}
      onReset={handleReset}
    >
      <div className="space-y-8">
        {/* Current Credit Profile */}
        <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <Target className="w-5 h-5" />
            Current Credit Profile
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PercentageInput
              id="current-payment-history"
              label="Payment History (35% weight)"
              value={currentProfile.paymentHistory}
              onChange={(value) => updateCurrentProfile('paymentHistory', value)}
              min={0}
              max={100}
              helpText="Percentage of payments made on time"
            />
            
            <PercentageInput
              id="current-utilization"
              label="Credit Utilization (30% weight)"
              value={currentProfile.creditUtilization}
              onChange={(value) => updateCurrentProfile('creditUtilization', value)}
              min={0}
              max={100}
              helpText="Percentage of credit limits used"
            />
            
            <NumberInput
              id="current-credit-age"
              label="Average Credit Age (15% weight)"
              value={currentProfile.creditAge}
              onChange={(value) => updateCurrentProfile('creditAge', value)}
              min={0}
              max={50}
              step={0.5}
              suffix="years"
              helpText="Average age of all credit accounts"
            />
            
            <NumberInput
              id="current-credit-mix"
              label="Credit Mix (10% weight)"
              value={currentProfile.creditMix}
              onChange={(value) => updateCurrentProfile('creditMix', value)}
              min={1}
              max={6}
              step={1}
              suffix="types"
              helpText="Number of different credit account types"
            />
            
            <NumberInput
              id="current-new-credit"
              label="New Credit Inquiries (10% weight)"
              value={currentProfile.newCredit}
              onChange={(value) => updateCurrentProfile('newCredit', value)}
              min={0}
              max={20}
              step={1}
              suffix="inquiries"
              helpText="Hard inquiries in the last 2 years"
              className="md:col-span-2"
            />
          </div>
        </div>

        {/* Target Improvements */}
        <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <TrendingUp className="w-5 h-5" />
            Target Improvements
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PercentageInput
              id="target-payment-history"
              label="Payment History Goal"
              value={targetProfile.paymentHistory}
              onChange={(value) => updateTargetProfile('paymentHistory', value)}
              min={0}
              max={100}
              helpText="Target: 100% for optimal scoring"
            />
            
            <PercentageInput
              id="target-utilization"
              label="Credit Utilization Goal"
              value={targetProfile.creditUtilization}
              onChange={(value) => updateTargetProfile('creditUtilization', value)}
              min={0}
              max={100}
              helpText="Target: Below 10% for excellent scores"
            />
            
            <NumberInput
              id="target-credit-age"
              label="Credit Age Goal"
              value={targetProfile.creditAge}
              onChange={(value) => updateTargetProfile('creditAge', value)}
              min={0}
              max={50}
              step={0.5}
              suffix="years"
              helpText="Grows naturally over time"
            />
            
            <NumberInput
              id="target-credit-mix"
              label="Credit Mix Goal"
              value={targetProfile.creditMix}
              onChange={(value) => updateTargetProfile('creditMix', value)}
              min={1}
              max={6}
              step={1}
              suffix="types"
              helpText="Cards, auto loan, mortgage, etc."
            />
            
            <NumberInput
              id="target-new-credit"
              label="New Credit Goal"
              value={targetProfile.newCredit}
              onChange={(value) => updateTargetProfile('newCredit', value)}
              min={0}
              max={20}
              step={1}
              suffix="inquiries"
              helpText="Minimize new inquiries"
              className="md:col-span-2"
            />
          </div>
        </div>

        {/* Score Progression Chart */}
        {timelineProjections.length > 1 && (
          <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-6`}>
              Score Improvement Timeline
            </h4>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineProjections}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#94a3b8"
                    label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    domain={[300, 850]}
                    label={{ value: 'Credit Score', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => [
                      `${value} (${getScoreGrade(value)})`,
                      'Credit Score'
                    ]}
                    labelFormatter={(month: number) => `Month ${month}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Factor Impact Analysis */}
        <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-6`}>
            Factor Impact Analysis
          </h4>
          
          <div className="space-y-4">
            {factorAnalysis.map((factor, index) => (
              <div key={index} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`${theme.textColors.primary} font-medium`}>{factor.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      factor.priority === 'high' ? theme.status.error.bg + ' ' + theme.status.error.text :
                      factor.priority === 'medium' ? theme.status.warning.bg + ' ' + theme.status.warning.text :
                      theme.status.success.bg + ' ' + theme.status.success.text
                    }`}>
                      {factor.priority} priority
                    </span>
                  </div>
                  <span className={`${theme.textColors.secondary} text-sm`}>
                    {factor.weight}% weight
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className={`${theme.textColors.muted} block`}>Current</span>
                    <span className={`${theme.textColors.primary} font-medium`}>
                      {factor.name.includes('History') || factor.name.includes('Utilization') 
                        ? `${factor.current}%` 
                        : factor.name.includes('Age') 
                        ? `${factor.current} years`
                        : `${factor.current}`}
                    </span>
                  </div>
                  <div>
                    <span className={`${theme.textColors.muted} block`}>Target</span>
                    <span className={`${theme.textColors.primary} font-medium`}>
                      {factor.name.includes('History') || factor.name.includes('Utilization') 
                        ? `${factor.target}%` 
                        : factor.name.includes('Age') 
                        ? `${factor.target} years`
                        : `${factor.target}`}
                    </span>
                  </div>
                  <div>
                    <span className={`${theme.textColors.muted} block`}>Impact</span>
                    <span className={`font-medium ${
                      factor.impact > 0 ? theme.status.success.text : 
                      factor.impact < 0 ? theme.status.error.text : 
                      theme.textColors.secondary
                    }`}>
                      {factor.impact > 0 ? '+' : ''}{Math.round(factor.impact)} pts
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
