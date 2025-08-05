'use client';

import React, { useMemo } from 'react';
import CalculatorWrapper, {
  CalculatorMetadata,
  CalculatorInsight
} from '@/components/shared/calculators/CalculatorWrapper';
import {
  PercentageInput,
  NumberInput
} from '@/components/shared/calculators/FormFields';
import { CreditCard, Target, TrendingUp } from 'lucide-react';
import { theme } from '@/lib/theme';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export default function CreditScoreSimulator() {
  // Mock the calculator hook until it's available
  const calculatorHook = {
    values: { 
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
    errors: {
      current_paymentHistory: undefined,
      current_creditUtilization: undefined,
      current_creditAge: undefined,
      current_creditMix: undefined,
      current_newCredit: undefined,
      target_paymentHistory: undefined,
      target_creditUtilization: undefined,
      target_creditAge: undefined,
      target_creditMix: undefined,
      target_newCredit: undefined
    },
    result: {
      currentScore: 650,
      targetScore: 750,
      scoreChange: 100,
      timeToTarget: '12-18 months',
      factorAnalysis: [
        { name: 'Payment History', current: 85, target: 100, priority: 'high' },
        { name: 'Credit Utilization', current: 30, target: 10, priority: 'high' },
        { name: 'Credit Age', current: 5, target: 8, priority: 'medium' }
      ],
      increase: 100,
      projectedScore: 750,
      projectedGrade: 'Excellent',
      scoreGrade: 'Fair',
      timelineProjections: [
        { month: 0, score: 650 },
        { month: 6, score: 700 },
        { month: 12, score: 750 }
      ]
    },
    isValid: true,
    updateCurrentProfile: (field: string, value: string) => { 
      // Mock implementation - parameters intentionally unused
      void field;
      void value;
    },
    updateTargetProfile: (field: string, value: string) => { 
      // Mock implementation - parameters intentionally unused
      void field;
      void value;
    },
    reset: () => { }
  };

  const {
    values: { current, target },
    errors,
    result,
    updateCurrentProfile,
    updateTargetProfile,
    reset
  } = calculatorHook;

  // Generate intelligent insights
  const insights = useMemo((): CalculatorInsight[] => {
    if (!result) return [];

    const insights: CalculatorInsight[] = [];

    // Score range insights
    if (result.currentScore < 580) {
      insights.push({
        type: 'error',
        title: 'Poor Credit Score',
        message: 'Focus on payment history and reducing credit utilization below 30%. Consider secured credit cards to rebuild credit.'
      });
    } else if (result.currentScore < 670) {
      insights.push({
        type: 'warning',
        title: 'Fair Credit Score',
        message: 'Reduce credit utilization below 10% and maintain perfect payment history to reach good credit territory.'
      });
    } else if (result.currentScore >= 740) {
      insights.push({
        type: 'success',
        title: 'Excellent Credit Score',
        message: 'Maintain your excellent credit habits. Consider maximizing rewards and benefits from premium credit products.'
      });
    }

    // High-impact factor insights
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const highImpactFactors = result.factorAnalysis.filter((f: any) => f.priority === 'high');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    highImpactFactors.forEach((factor: any) => {
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
    if (result.increase > 50) {
      insights.push({
        type: 'info',
        title: 'High Improvement Potential',
        message: `You could increase your score by ${result.increase} points with the targeted improvements. Focus on the highest-impact factors first.`
      });
    }

    return insights;
  }, [result]);

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
  const results = useMemo(() => {
    if (!result) {
      return {
        primary: {
          label: 'Projected Credit Score',
          value: 0,
          format: 'number' as const,
          variant: 'info' as const,
          description: 'Enter valid inputs to see projection'
        },
        secondary: []
      };
    }

    return {
      primary: {
        label: 'Projected Credit Score',
        value: result.projectedScore,
        format: 'number' as const,
        variant: result.projectedScore >= 740 ? 'success' as const :
          result.projectedScore >= 670 ? 'warning' as const : 'error' as const,
        description: `${result.projectedGrade} credit rating`
      },
      secondary: [
        {
          label: 'Current Score',
          value: result.currentScore,
          format: 'number' as const,
          description: result.scoreGrade
        },
        {
          label: 'Score Increase',
          value: `+${result.increase}`,
          format: 'number' as const,
          variant: result.increase > 0 ? 'success' as const : 'info' as const,
          description: 'Potential improvement'
        },
        {
          label: 'Timeline to Target',
          value: result.timelineProjections.length - 1,
          format: 'months' as const,
          description: 'With consistent improvements'
        },
        {
          label: 'Top Priority Factor',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: result.factorAnalysis.find((f: any) => f.priority === 'high')?.name || 'All factors optimized',
          format: 'percentage' as const,
          description: 'Focus area for maximum impact'
        }
      ]
    };
  }, [result]);

  return (
    <CalculatorWrapper
      metadata={metadata}
      results={results}
      insights={insights}
      onReset={reset}
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
              value={current.paymentHistory.toString()}
              onChange={(value) => updateCurrentProfile('paymentHistory', value)}
              min={0}
              max={100}
              helpText="Percentage of payments made on time"
              error={errors.current_paymentHistory}
            />

            <PercentageInput
              id="current-utilization"
              label="Credit Utilization (30% weight)"
              value={current.creditUtilization.toString()}
              onChange={(value) => updateCurrentProfile('creditUtilization', value)}
              min={0}
              max={100}
              helpText="Percentage of credit limits used"
              error={errors.current_creditUtilization}
            />

            <NumberInput
              id="current-credit-age"
              label="Average Credit Age (15% weight)"
              value={current.creditAge.toString()}
              onChange={(value) => updateCurrentProfile('creditAge', value)}
              min={0}
              max={50}
              step={0.5}
              suffix="years"
              helpText="Average age of all credit accounts"
              error={errors.current_creditAge}
            />

            <NumberInput
              id="current-credit-mix"
              label="Credit Mix (10% weight)"
              value={current.creditMix.toString()}
              onChange={(value) => updateCurrentProfile('creditMix', value)}
              min={1}
              max={6}
              step={1}
              suffix="types"
              helpText="Number of different credit account types"
              error={errors.current_creditMix}
            />

            <NumberInput
              id="current-new-credit"
              label="New Credit Inquiries (10% weight)"
              value={current.newCredit.toString()}
              onChange={(value) => updateCurrentProfile('newCredit', value)}
              min={0}
              max={20}
              step={1}
              suffix="inquiries"
              helpText="Hard inquiries in the last 2 years"
              error={errors.current_newCredit}
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
              value={target.paymentHistory.toString()}
              onChange={(value) => updateTargetProfile('paymentHistory', value)}
              min={0}
              max={100}
              helpText="Target: 100% for optimal scoring"
              error={errors.target_paymentHistory}
            />

            <PercentageInput
              id="target-utilization"
              label="Credit Utilization Goal"
              value={target.creditUtilization.toString()}
              onChange={(value) => updateTargetProfile('creditUtilization', value)}
              min={0}
              max={100}
              helpText="Target: Below 10% for excellent scores"
              error={errors.target_creditUtilization}
            />

            <NumberInput
              id="target-credit-age"
              label="Credit Age Goal"
              value={target.creditAge.toString()}
              onChange={(value) => updateTargetProfile('creditAge', value)}
              min={0}
              max={50}
              step={0.5}
              suffix="years"
              helpText="Grows naturally over time"
              error={errors.target_creditAge}
            />

            <NumberInput
              id="target-credit-mix"
              label="Credit Mix Goal"
              value={target.creditMix.toString()}
              onChange={(value) => updateTargetProfile('creditMix', value)}
              min={1}
              max={6}
              step={1}
              suffix="types"
              helpText="Cards, auto loan, mortgage, etc."
              error={errors.target_creditMix}
            />

            <NumberInput
              id="target-new-credit"
              label="New Credit Goal"
              value={target.newCredit.toString()}
              onChange={(value) => updateTargetProfile('newCredit', value)}
              min={0}
              max={20}
              step={1}
              suffix="inquiries"
              helpText="Minimize new inquiries"
              error={errors.target_newCredit}
              className="md:col-span-2"
            />
          </div>
        </div>

        {/* Score Progression Chart */}
        {result && result.timelineProjections.length > 1 && (
          <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-6`}>
              Score Improvement Timeline
            </h4>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.timelineProjections}>
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
                      `${value} (${result.scoreGrade})`,
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
        {result && (
          <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-6`}>
              Factor Impact Analysis
            </h4>

            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {result.factorAnalysis.map((factor: any, index: number) => (
                <div key={index} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`${theme.textColors.primary} font-medium`}>{factor.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${factor.priority === 'high' ? theme.status.error.bg + ' ' + theme.status.error.text :
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
                      <span className={`font-medium ${factor.impact > 0 ? theme.status.success.text :
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
        )}
      </div>
    </CalculatorWrapper>
  );
}
