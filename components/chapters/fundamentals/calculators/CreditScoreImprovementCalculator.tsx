'use client';

import React, { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  TrendingUp,
  Target,
  Calendar,
  Shield,
  CheckCircle,
  AlertTriangle,
  Star,
  Calculator,
  Clock,
  DollarSign,
  Award
} from 'lucide-react';

interface ValidationError {
  field: string;
  message: string;
}

interface InputValidation {
  isValid: boolean;
  errors: ValidationError[];
}

interface CreditFactor {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  weight: number;
  impact: 'high' | 'medium' | 'low';
  description: string;
  actionSteps: string[];
  timeframe: string;
}

interface CreditScenario {
  timeframe: string;
  estimatedScore: number;
  actions: string[];
  benefits: string[];
  monthlySavings: number;
}

export default function CreditScoreImprovementCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [creditFactors, setCreditFactors] = useState<CreditFactor[]>([
    {
      id: 'payment_history',
      name: 'Payment History',
      currentValue: 85,
      targetValue: 100,
      weight: 35,
      impact: 'high',
      description: 'Percentage of on-time payments',
      actionSteps: [
        'Set up automatic payments for all bills',
        'Pay bills 1-2 days before due date',
        'Contact creditors for payment plans if struggling',
        'Never miss a payment - even $1 late hurts'
      ],
      timeframe: '1-3 months'
    },
    {
      id: 'credit_utilization',
      name: 'Credit Utilization',
      currentValue: 45,
      targetValue: 10,
      weight: 30,
      impact: 'high',
      description: 'Percentage of available credit used',
      actionSteps: [
        'Pay down credit card balances',
        'Request credit limit increases',
        'Pay balances before statement dates',
        'Spread balances across multiple cards'
      ],
      timeframe: '1-2 months'
    },
    {
      id: 'credit_age',
      name: 'Credit History Length',
      currentValue: 3,
      targetValue: 7,
      weight: 15,
      impact: 'medium',
      description: 'Average age of accounts in years',
      actionSteps: [
        'Keep old accounts open and active',
        'Make small purchases on old cards monthly',
        'Avoid closing your oldest accounts',
        'Be patient - time builds this factor'
      ],
      timeframe: '2+ years'
    },
    {
      id: 'credit_mix',
      name: 'Credit Mix',
      currentValue: 60,
      targetValue: 85,
      weight: 10,
      impact: 'low',
      description: 'Variety of credit types (cards, loans)',
      actionSteps: [
        'Consider a small personal loan',
        'Add an installment loan if needed',
        'Mix revolving and installment credit',
        'Don&apos;t force - only add if beneficial'
      ],
      timeframe: '3-6 months'
    },
    {
      id: 'new_credit',
      name: 'New Credit Inquiries',
      currentValue: 3,
      targetValue: 0,
      weight: 10,
      impact: 'low',
      description: 'Hard inquiries in past 2 years',
      actionSteps: [
        'Avoid applying for new credit',
        'Wait 6 months between applications',
        'Shop for rates within 14-day windows',
        'Check credit score with soft pulls only'
      ],
      timeframe: '6-24 months'
    }
  ]);
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Validation function
  const safeParseFloat = (value: string | number, min: number = 0, max: number = 100): number => {
    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(parsed)) return min;
    return Math.max(min, Math.min(max, parsed));
  };

  const validateInputs = (): InputValidation => {
    const errors: ValidationError[] = [];
    
    creditFactors.forEach(factor => {
      // Validate current value
      if (factor.currentValue < 0 || factor.currentValue > 100) {
        errors.push({ 
          field: `${factor.id}-current`, 
          message: `${factor.name} current value must be between 0-100` 
        });
      }
      
      // Validate target value
      if (factor.targetValue < 0 || factor.targetValue > 100) {
        errors.push({ 
          field: `${factor.id}-target`, 
          message: `${factor.name} target value must be between 0-100` 
        });
      }

      // Special validation for credit age (years)
      if (factor.id === 'credit_age') {
        if (factor.currentValue > 50) {
          errors.push({ 
            field: `${factor.id}-current`, 
            message: 'Credit age cannot exceed 50 years' 
          });
        }
        if (factor.targetValue > 50) {
          errors.push({ 
            field: `${factor.id}-target`, 
            message: 'Target credit age cannot exceed 50 years' 
          });
        }
      }

      // Special validation for new credit inquiries
      if (factor.id === 'new_credit') {
        if (factor.currentValue > 20) {
          errors.push({ 
            field: `${factor.id}-current`, 
            message: 'Hard inquiries cannot exceed 20' 
          });
        }
      }
    });

    setValidationErrors(errors);
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  useEffect(() => {
    recordCalculatorUsage('credit-score-improvement-calculator');
  }, [recordCalculatorUsage]);

  const updateFactor = (id: string, field: 'currentValue' | 'targetValue', value: number) => {
    setCreditFactors(prev => prev.map(factor =>
      factor.id === id ? { ...factor, [field]: value } : factor
    ));
    // Validate after update
    setTimeout(() => validateInputs(), 100);
  };

  const calculateEstimatedScore = (factors: CreditFactor[]) => {
    let weightedScore = 0;
    factors.forEach(factor => {
      // Normalize factor values to 0-100 scale for calculation
      let normalizedCurrent = factor.currentValue;
      
      // Special handling for different factors
      if (factor.id === 'credit_age') {
        normalizedCurrent = Math.min(factor.currentValue * 10, 100); // Years * 10, cap at 100
      } else if (factor.id === 'new_credit') {
        normalizedCurrent = Math.max(100 - (factor.currentValue * 20), 0); // Fewer inquiries = higher score
      } else if (factor.id === 'credit_utilization') {
        normalizedCurrent = Math.max(100 - factor.currentValue, 0); // Lower utilization = higher score
      }
      
      weightedScore += (normalizedCurrent * factor.weight) / 100;
    });
    
    // Convert to FICO scale (300-850)
    return Math.round(300 + (weightedScore * 5.5));
  };

  const calculateTargetScore = (factors: CreditFactor[]) => {
    let weightedScore = 0;
    factors.forEach(factor => {
      let normalizedTarget = factor.targetValue;
      
      if (factor.id === 'credit_age') {
        normalizedTarget = Math.min(factor.targetValue * 10, 100);
      } else if (factor.id === 'new_credit') {
        normalizedTarget = Math.max(100 - (factor.targetValue * 20), 0);
      } else if (factor.id === 'credit_utilization') {
        normalizedTarget = Math.max(100 - factor.targetValue, 0);
      }
      
      weightedScore += (normalizedTarget * factor.weight) / 100;
    });
    
    return Math.round(300 + (weightedScore * 5.5));
  };

  const generateScenarios = (): CreditScenario[] => {
    const estimated = calculateEstimatedScore(creditFactors);
    const target = calculateTargetScore(creditFactors);
    
    return [
      {
        timeframe: '3 Months',
        estimatedScore: Math.min(estimated + 30, target),
        actions: [
          'Pay all bills on time',
          'Reduce credit utilization below 30%',
          'Pay balances before statement dates',
          'Dispute any errors on credit reports'
        ],
        benefits: [
          'Better approval odds',
          'Lower interest rate quotes',
          'Reduced insurance premiums'
        ],
        monthlySavings: 50
      },
      {
        timeframe: '6 Months',
        estimatedScore: Math.min(estimated + 50, target),
        actions: [
          'Maintain perfect payment history',
          'Achieve under 10% utilization',
          'Request credit limit increases',
          'Keep old accounts active'
        ],
        benefits: [
          'Access to better credit cards',
          'Pre-approved loan offers',
          'Lower mortgage rates'
        ],
        monthlySavings: 150
      },
      {
        timeframe: '12 Months',
        estimatedScore: Math.min(estimated + 75, target),
        actions: [
          'Continue perfect payment habits',
          'Optimize credit mix if beneficial',
          'Avoid new credit applications',
          'Monitor and maintain progress'
        ],
        benefits: [
          'Excellent credit status',
          'Premium rewards cards',
          'Best available rates'
        ],
        monthlySavings: 300
      },
      {
        timeframe: '24 Months',
        estimatedScore: target,
        actions: [
          'Maintain excellent habits',
          'Focus on credit age building',
          'Strategic account management',
          'Long-term optimization'
        ],
        benefits: [
          'Maximum financial opportunities',
          'Lowest possible rates',
          'Premium financial products'
        ],
        monthlySavings: 500
      }
    ];
  };

  const scenarios = generateScenarios();
  const currentEstimated = calculateEstimatedScore(creditFactors);
  const targetEstimated = calculateTargetScore(creditFactors);

  const getScoreColor = (score: number) => {
    if (score >= 740) return 'text-green-400';
    if (score >= 670) return 'text-blue-400';
    if (score >= 580) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLevel = (score: number) => {
    if (score >= 800) return 'Exceptional';
    if (score >= 740) return 'Very Good';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return theme.status.error.bg;
      case 'medium': return theme.status.warning.bg;
      case 'low': return theme.status.info.bg;
      default: return theme.backgrounds.glass;
    }
  };

  return (
    <div className={`max-w-7xl mx-auto ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg shadow-lg p-6`}>
      <div className="mb-4 sm:mb-6">
        <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-1.5 sm:mb-2 flex items-start sm:items-center gap-2 sm:gap-3`}>
          <div className={`${theme.status.success.bg} p-1.5 sm:p-2 rounded-lg flex-shrink-0`}>
            <TrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.status.success.text}`} />
          </div>
          <span className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">Credit Score Improvement Calculator</span>
        </h2>
        <p className={`${theme.textColors.secondary} text-sm sm:text-base`}>
          Track your credit improvement journey and see exactly how to reach your target score
        </p>
      </div>

      {/* Current vs Target Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 sm:p-6 text-center`}>
          <h3 className={`font-semibold text-sm sm:text-base ${theme.status.info.text} mb-2 sm:mb-3 flex items-center justify-center gap-1.5 sm:gap-2`}>
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            Current Estimated Score
          </h3>
          <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${getScoreColor(currentEstimated)} mb-1.5 sm:mb-2`}>
            {currentEstimated}
          </div>
          <p className={`${theme.textColors.secondary} text-xs sm:text-sm`}>
            {getScoreLevel(currentEstimated)} Credit
          </p>
        </div>

        <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-4 sm:p-6 text-center`}>
          <h3 className={`font-semibold text-sm sm:text-base ${theme.status.success.text} mb-2 sm:mb-3 flex items-center justify-center gap-1.5 sm:gap-2`}>
            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            Target Score Potential
          </h3>
          <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${getScoreColor(targetEstimated)} mb-1.5 sm:mb-2`}>
            {targetEstimated}
          </div>
          <p className={`${theme.textColors.secondary} text-xs sm:text-sm`}>
            {getScoreLevel(targetEstimated)} Credit
          </p>
          <div className={`mt-2 sm:mt-3 text-base sm:text-lg font-semibold ${theme.status.success.text}`}>
            +{targetEstimated - currentEstimated} Point Improvement
          </div>
        </div>
      </div>

      {/* Credit Factors */}
      <div className="mb-8">
        <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
          <Calculator className="w-5 h-5" />
          Credit Score Factors
        </h3>
        
        <div className="space-y-4">
          {creditFactors.map((factor) => (
            <div key={factor.id} className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-3 sm:p-4`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Factor Info */}
                <div>
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <div className={`${getImpactColor(factor.impact)} p-1.5 sm:p-2 rounded-lg flex-shrink-0`}>
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-semibold text-sm sm:text-base ${theme.textColors.primary}`}>{factor.name}</h4>
                      <p className={`text-xs sm:text-sm ${theme.textColors.secondary}`}>{factor.weight}% of score</p>
                    </div>
                  </div>
                  <p className={`text-xs sm:text-sm ${theme.textColors.secondary} mb-2 sm:mb-3`}>
                    {factor.description}
                  </p>
                  <div className={`text-[10px] sm:text-xs ${theme.textColors.muted} flex items-center gap-1`}>
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Impact timeframe: {factor.timeframe}
                  </div>
                </div>

                {/* Current vs Target Values */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor={`${factor.id}-current`} className={`text-xs sm:text-sm font-medium ${theme.textColors.secondary} mb-1.5 sm:mb-2 block`}>
                      Current Value
                    </label>
                    <div className="relative">
                      <input
                        id={`${factor.id}-current`}
                        type="number"
                        value={factor.currentValue}
                        onChange={(e) => updateFactor(factor.id, 'currentValue', safeParseFloat(e.target.value, 0, factor.id === 'credit_age' ? 50 : factor.id === 'new_credit' ? 20 : 100))}
                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border ${
                          validationErrors.some(e => e.field === `${factor.id}-current`) 
                            ? 'border-red-500' 
                            : theme.borderColors.primary
                        } rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm`}
                        min="0"
                        max={factor.id === 'credit_age' ? '50' : factor.id === 'new_credit' ? '20' : '100'}
                        step={factor.id === 'credit_age' ? '0.5' : '1'}
                        aria-describedby={`${factor.id}-current-help ${validationErrors.some(e => e.field === `${factor.id}-current`) ? `${factor.id}-current-error` : ''}`}
                        {...(validationErrors.some(e => e.field === `${factor.id}-current`) ? { "aria-invalid": "true" } : {})}
                      />
                      <span className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs sm:text-sm`}>
                        {factor.id === 'credit_age' ? 'years' : factor.id === 'new_credit' ? 'inquiries' : '%'}
                      </span>
                    </div>
                    <div id={`${factor.id}-current-help`} className="sr-only">
                      Enter your current {factor.name.toLowerCase()}
                    </div>
                    {validationErrors.some(e => e.field === `${factor.id}-current`) && (
                      <div id={`${factor.id}-current-error`} role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
                        {validationErrors.find(e => e.field === `${factor.id}-current`)?.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${factor.id}-target`} className={`text-xs sm:text-sm font-medium ${theme.textColors.secondary} mb-1.5 sm:mb-2 block`}>
                      Target Value
                    </label>
                    <div className="relative">
                      <input
                        id={`${factor.id}-target`}
                        type="number"
                        value={factor.targetValue}
                        onChange={(e) => updateFactor(factor.id, 'targetValue', safeParseFloat(e.target.value, 0, factor.id === 'credit_age' ? 50 : factor.id === 'new_credit' ? 20 : 100))}
                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border ${
                          validationErrors.some(e => e.field === `${factor.id}-target`) 
                            ? 'border-red-500' 
                            : theme.borderColors.primary
                        } rounded-lg focus:ring-2 focus:ring-green-500 text-xs sm:text-sm`}
                        min="0"
                        max={factor.id === 'credit_age' ? '50' : factor.id === 'new_credit' ? '20' : '100'}
                        step={factor.id === 'credit_age' ? '0.5' : '1'}
                        aria-describedby={`${factor.id}-target-help ${validationErrors.some(e => e.field === `${factor.id}-target`) ? `${factor.id}-target-error` : ''}`}
                        {...(validationErrors.some(e => e.field === `${factor.id}-target`) ? { "aria-invalid": "true" } : {})}
                      />
                      <span className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs sm:text-sm`}>
                        {factor.id === 'credit_age' ? 'years' : factor.id === 'new_credit' ? 'inquiries' : '%'}
                      </span>
                    </div>
                    <div id={`${factor.id}-target-help`} className="sr-only">
                      Enter your target {factor.name.toLowerCase()}
                    </div>
                    {validationErrors.some(e => e.field === `${factor.id}-target`) && (
                      <div id={`${factor.id}-target-error`} role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
                        {validationErrors.find(e => e.field === `${factor.id}-target`)?.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Steps */}
                <div>
                  <h5 className={`font-medium text-sm sm:text-base ${theme.textColors.primary} mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2`}>
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Action Steps
                  </h5>
                  <ul className="space-y-1">
                    {factor.actionSteps.map((step, index) => (
                      <li key={index} className={`text-xs sm:text-sm ${theme.textColors.secondary} flex items-start gap-1.5 sm:gap-2`}>
                        <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme.status.info.bg} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 ${theme.status.info.text} rounded-full`}></span>
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Timeline */}
      <div className="mb-8">
        <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
          <Calendar className="w-5 h-5" />
          Improvement Timeline & Benefits
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {scenarios.map((scenario, index) => (
            <div key={index} className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-3 sm:p-4`}>
              <div className="text-center mb-3 sm:mb-4">
                <h4 className={`font-semibold text-sm sm:text-base ${theme.textColors.primary} mb-1.5 sm:mb-2`}>{scenario.timeframe}</h4>
                <div className={`text-2xl sm:text-3xl font-bold ${getScoreColor(scenario.estimatedScore)} mb-0.5 sm:mb-1`}>
                  {scenario.estimatedScore}
                </div>
                <p className={`text-xs sm:text-sm ${theme.textColors.secondary}`}>
                  {getScoreLevel(scenario.estimatedScore)} Credit
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div>
                  <h5 className={`text-xs sm:text-sm font-medium ${theme.textColors.primary} mb-1.5 sm:mb-2`}>Key Actions:</h5>
                  <ul className="space-y-1">
                    {scenario.actions.slice(0, 2).map((action, i) => (
                      <li key={i} className={`text-[10px] sm:text-xs ${theme.textColors.secondary} flex items-start gap-1`}>
                        <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400 flex-shrink-0 mt-0.5" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className={`text-xs sm:text-sm font-medium ${theme.textColors.primary} mb-1.5 sm:mb-2`}>Benefits:</h5>
                  <ul className="space-y-1">
                    {scenario.benefits.slice(0, 2).map((benefit, i) => (
                      <li key={i} className={`text-[10px] sm:text-xs ${theme.textColors.secondary} flex items-start gap-1`}>
                        <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded p-1.5 sm:p-2 text-center`}>
                  <p className={`text-[10px] sm:text-xs ${theme.status.success.text} mb-0.5 sm:mb-1`}>Est. Monthly Savings</p>
                  <p className={`text-sm sm:text-base font-bold ${theme.textColors.primary}`}>
                    ${scenario.monthlySavings}/month
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score Impact Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <AlertTriangle className="w-5 h-5" />
            Priority Actions
          </h3>
          
          <div className="space-y-3">
            {creditFactors
              .filter(factor => factor.impact === 'high')
              .map((factor) => {
                const improvement = factor.targetValue - factor.currentValue;
                const isUtilization = factor.id === 'credit_utilization';
                const positiveImprovement = isUtilization ? improvement < 0 : improvement > 0;
                
                return (
                  <div key={factor.id} className={`p-3 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-medium ${theme.status.warning.text}`}>{factor.name}</h4>
                      <span className={`text-sm ${theme.textColors.primary} font-bold`}>
                        {factor.weight}% impact
                      </span>
                    </div>
                    <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                      {positiveImprovement ? 
                        `Improve by ${Math.abs(improvement)}${factor.id === 'credit_age' ? ' years' : isUtilization ? '% utilization' : '%'} for maximum impact` :
                        'Already optimized!'
                      }
                    </p>
                    <div className={`text-xs ${theme.textColors.muted}`}>
                      Est. {factor.timeframe} to see results
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <DollarSign className="w-5 h-5" />
            Financial Impact
          </h3>
          
          <div className="space-y-4">
            <div className={`p-4 ${theme.status.error.bg} border ${theme.status.error.border} rounded-lg`}>
              <h4 className={`font-medium ${theme.status.error.text} mb-2`}>Current Credit Costs</h4>
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                ~${Math.round((750 - currentEstimated) * 10)}/month
              </div>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Higher rates on loans, credit cards, insurance
              </p>
            </div>

            <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
              <h4 className={`font-medium ${theme.status.success.text} mb-2`}>Potential Savings</h4>
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                ~${Math.round((targetEstimated - currentEstimated) * 10)}/month
              </div>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Better rates = more money in your pocket
              </p>
            </div>

            <div className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg text-center`}>
              <p className={`text-sm ${theme.textColors.secondary} mb-1`}>Lifetime Savings Potential</p>
              <div className={`text-3xl font-bold text-green-400`}>
                ${((targetEstimated - currentEstimated) * 10 * 12 * 20).toLocaleString()}
              </div>
              <p className={`text-xs ${theme.textColors.muted}`}>
                Over 20 years of better credit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
