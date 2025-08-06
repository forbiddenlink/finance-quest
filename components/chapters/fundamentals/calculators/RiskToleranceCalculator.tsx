'use client';

import React, { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import styles from './RiskToleranceCalculator.module.css';
import {
  AlertTriangle,
  Target,
  BarChart3,
  Calendar,
  DollarSign,
  CheckCircle,
  Brain,
  Clock,
  PieChart,
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

interface RiskQuestion {
  id: string;
  question: string;
  description: string;
  answers: {
    text: string;
    score: number;
    explanation: string;
  }[];
}

interface RiskProfile {
  level: 'conservative' | 'moderate' | 'aggressive';
  name: string;
  description: string;
  allocation: {
    stocks: number;
    bonds: number;
    international: number;
    reits: number;
  };
  expectedReturn: number;
  volatility: number;
  benefits: string[];
  considerations: string[];
  color: string;
}

export default function RiskToleranceCalculator() {
  const { recordCalculatorUsage } = useProgressStore();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [ageRange, setAgeRange] = useState('20-30');
  const [investmentGoal, setInvestmentGoal] = useState('retirement');
  const [timeHorizon, setTimeHorizon] = useState('20+');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    recordCalculatorUsage('risk-tolerance-calculator');
  }, [recordCalculatorUsage]);

  // Validation functions
  const validateDemographics = (): InputValidation => {
    const errors: ValidationError[] = [];

    if (!ageRange) {
      errors.push({ field: 'ageRange', message: 'Please select your age range' });
    }

    if (!investmentGoal) {
      errors.push({ field: 'investmentGoal', message: 'Please select your investment goal' });
    }

    if (!timeHorizon) {
      errors.push({ field: 'timeHorizon', message: 'Please select your time horizon' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const clearValidationError = (field: string) => {
    setValidationErrors(prev => prev.filter(error => error.field !== field));
  };

  const getValidationError = (field: string): string | undefined => {
    return validationErrors.find(error => error.field === field)?.message;
  };

  const riskQuestions: RiskQuestion[] = [
    {
      id: 'market_decline',
      question: 'If your investment portfolio lost 20% of its value in one month, what would you do?',
      description: 'This tests your emotional response to market volatility',
      answers: [
        {
          text: 'Sell everything immediately to prevent further losses',
          score: 1,
          explanation: 'Conservative response - prioritizes capital preservation'
        },
        {
          text: 'Sell some investments to reduce risk',
          score: 2,
          explanation: 'Moderate response - seeks balance between growth and safety'
        },
        {
          text: 'Hold steady and wait for recovery',
          score: 3,
          explanation: 'Moderate-aggressive response - understands market cycles'
        },
        {
          text: 'Buy more investments at lower prices',
          score: 4,
          explanation: 'Aggressive response - sees opportunity in market volatility'
        }
      ]
    },
    {
      id: 'investment_experience',
      question: 'How would you describe your investment experience?',
      description: 'Experience affects comfort with complex investment strategies',
      answers: [
        {
          text: 'No experience - completely new to investing',
          score: 1,
          explanation: 'Start with simple, diversified investments'
        },
        {
          text: 'Some experience with basic investments (savings, CDs)',
          score: 2,
          explanation: 'Ready for index funds and target-date funds'
        },
        {
          text: 'Moderate experience with stocks and bonds',
          score: 3,
          explanation: 'Can handle more complex asset allocation'
        },
        {
          text: 'Extensive experience with various investments',
          score: 4,
          explanation: 'Comfortable with advanced strategies and higher risk'
        }
      ]
    },
    {
      id: 'financial_priority',
      question: 'What is your primary financial priority for this money?',
      description: 'Your goal affects the appropriate risk level',
      answers: [
        {
          text: 'Preserve my money and avoid any losses',
          score: 1,
          explanation: 'Capital preservation - focus on bonds and CDs'
        },
        {
          text: 'Generate steady income with modest growth',
          score: 2,
          explanation: 'Income focus - dividend stocks and bonds'
        },
        {
          text: 'Balance growth with some income and stability',
          score: 3,
          explanation: 'Balanced approach - mix of stocks and bonds'
        },
        {
          text: 'Maximize long-term growth regardless of volatility',
          score: 4,
          explanation: 'Growth focus - primarily stocks and growth assets'
        }
      ]
    },
    {
      id: 'loss_comfort',
      question: 'What is the maximum loss you could tolerate in one year?',
      description: 'This measures your practical risk tolerance',
      answers: [
        {
          text: 'I cannot accept any losses',
          score: 1,
          explanation: 'Very conservative - money market and CDs only'
        },
        {
          text: '5% loss maximum',
          score: 2,
          explanation: 'Conservative - mostly bonds with some stocks'
        },
        {
          text: '15% loss is acceptable',
          score: 3,
          explanation: 'Moderate - balanced stock/bond portfolio'
        },
        {
          text: '25%+ loss is acceptable for higher returns',
          score: 4,
          explanation: 'Aggressive - stock-heavy portfolio'
        }
      ]
    },
    {
      id: 'market_knowledge',
      question: 'How do you typically react to market news and volatility?',
      description: 'Emotional stability affects investment success',
      answers: [
        {
          text: 'I get very anxious and check my accounts frequently',
          score: 1,
          explanation: 'Consider automatic investing to reduce emotional decisions'
        },
        {
          text: 'I worry but try not to make hasty decisions',
          score: 2,
          explanation: 'Moderate emotional control - good for balanced approach'
        },
        {
          text: 'I stay calm and focus on long-term goals',
          score: 3,
          explanation: 'Good emotional discipline for growth investing'
        },
        {
          text: 'I see volatility as opportunity to buy more',
          score: 4,
          explanation: 'Excellent mindset for aggressive growth strategies'
        }
      ]
    }
  ];

  const riskProfiles: Record<string, RiskProfile> = {
    conservative: {
      level: 'conservative',
      name: 'Conservative Investor',
      description: 'Prioritizes capital preservation and steady income over growth',
      allocation: { stocks: 30, bonds: 60, international: 5, reits: 5 },
      expectedReturn: 5.5,
      volatility: 8,
      benefits: [
        'Lower volatility and more predictable returns',
        'Better preservation of capital during market downturns',
        'Steady income generation from bonds and dividends',
        'Suitable for shorter time horizons or near retirement'
      ],
      considerations: [
        'Lower long-term growth potential',
        'May not keep pace with inflation over time',
        'Could miss out on significant market gains',
        'Requires larger initial investment for same retirement goal'
      ],
      color: 'blue'
    },
    moderate: {
      level: 'moderate',
      name: 'Moderate Investor',
      description: 'Seeks balance between growth and stability for long-term goals',
      allocation: { stocks: 60, bonds: 30, international: 7, reits: 3 },
      expectedReturn: 7.5,
      volatility: 12,
      benefits: [
        'Good balance of growth and stability',
        'Moderate volatility with reasonable returns',
        'Suitable for most long-term investors',
        'Diversification across asset classes'
      ],
      considerations: [
        'Still experiences market volatility',
        'Requires discipline during market downturns',
        'May be too conservative for very young investors',
        'Returns may vary significantly year to year'
      ],
      color: 'yellow'
    },
    aggressive: {
      level: 'aggressive',
      name: 'Aggressive Investor',
      description: 'Focuses on maximum long-term growth with higher volatility tolerance',
      allocation: { stocks: 80, bonds: 10, international: 8, reits: 2 },
      expectedReturn: 9.5,
      volatility: 18,
      benefits: [
        'Highest long-term growth potential',
        'Best for young investors with long time horizons',
        'Takes advantage of compound growth',
        'Historically outperforms over 20+ year periods'
      ],
      considerations: [
        'High volatility with potential for large losses',
        'Requires strong emotional discipline',
        'Not suitable for short-term goals',
        'May experience extended periods of poor performance'
      ],
      color: 'red'
    }
  };

  const calculateRiskScore = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const averageScore = totalScore / riskQuestions.length;

    if (averageScore <= 2) return 'conservative';
    if (averageScore <= 3) return 'moderate';
    return 'aggressive';
  };

  const handleAnswer = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));

    if (currentQuestion < riskQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const getAgeAdjustedAllocation = (baseProfile: RiskProfile) => {
    const ageFactors = {
      '20-30': { stockBoost: 10, bondReduce: 10 },
      '31-40': { stockBoost: 5, bondReduce: 5 },
      '41-50': { stockBoost: 0, bondReduce: 0 },
      '51-60': { stockBoost: -10, bondReduce: -10 },
      '60+': { stockBoost: -20, bondReduce: -20 }
    };

    const factor = ageFactors[ageRange as keyof typeof ageFactors] || { stockBoost: 0, bondReduce: 0 };

    return {
      ...baseProfile.allocation,
      stocks: Math.max(20, Math.min(90, baseProfile.allocation.stocks + factor.stockBoost)),
      bonds: Math.max(5, Math.min(70, baseProfile.allocation.bonds - factor.bondReduce))
    };
  };

  if (showResults) {
    const riskLevel = calculateRiskScore();
    const profile = riskProfiles[riskLevel];
    const adjustedAllocation = getAgeAdjustedAllocation(profile);

    return (
      <div className={`max-w-6xl mx-auto ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg shadow-lg p-6`}>
        <div className="mb-6">
          <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2 flex items-center gap-3`}>
            <div className={`${theme.status.success.bg} p-2 rounded-lg`}>
              <Award className={`w-6 h-6 ${theme.status.success.text}`} />
            </div>
            Your Investment Risk Profile
          </h2>
          <p className={`${theme.textColors.secondary}`}>
            Based on your responses, here&apos;s your personalized investment strategy
          </p>
        </div>

        {/* Risk Profile Summary */}
        <div className={`mb-8 p-6 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-2xl font-bold ${theme.status.success.text}`}>{profile.name}</h3>
              <p className={`${theme.textColors.secondary} text-lg`}>{profile.description}</p>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${theme.textColors.primary}`}>
                {profile.expectedReturn}%
              </div>
              <p className={`text-sm ${theme.textColors.secondary}`}>Expected Annual Return</p>
            </div>
          </div>
        </div>

        {/* Recommended Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <PieChart className="w-5 h-5" />
              Recommended Asset Allocation
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className={`font-medium ${theme.textColors.primary}`}>US Stocks</span>
                <div className="text-right">
                  <span className={`text-lg font-bold text-green-600`}>{adjustedAllocation.stocks}%</span>
                  <p className={`text-xs ${theme.textColors.muted}`}>Growth potential</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className={`font-medium ${theme.textColors.primary}`}>Bonds</span>
                <div className="text-right">
                  <span className={`text-lg font-bold text-blue-600`}>{adjustedAllocation.bonds}%</span>
                  <p className={`text-xs ${theme.textColors.muted}`}>Stability</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className={`font-medium ${theme.textColors.primary}`}>International</span>
                <div className="text-right">
                  <span className={`text-lg font-bold text-purple-600`}>{adjustedAllocation.international}%</span>
                  <p className={`text-xs ${theme.textColors.muted}`}>Diversification</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className={`font-medium ${theme.textColors.primary}`}>REITs</span>
                <div className="text-right">
                  <span className={`text-lg font-bold text-orange-600`}>{adjustedAllocation.reits}%</span>
                  <p className={`text-xs ${theme.textColors.muted}`}>Real estate</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <BarChart3 className="w-5 h-5" />
              Risk & Return Profile
            </h3>

            <div className="space-y-4">
              <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
                <h4 className={`font-semibold ${theme.status.success.text} mb-2`}>Expected Return</h4>
                <p className={`text-2xl font-bold ${theme.textColors.primary}`}>{profile.expectedReturn}% annually</p>
                <p className={`text-sm ${theme.textColors.secondary}`}>Historical 20-year average</p>
              </div>

              <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
                <h4 className={`font-semibold ${theme.status.warning.text} mb-2`}>Volatility Range</h4>
                <p className={`text-lg font-bold ${theme.textColors.primary}`}>±{profile.volatility}%</p>
                <p className={`text-sm ${theme.textColors.secondary}`}>Typical annual variation</p>
              </div>

              <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
                <h4 className={`font-semibold ${theme.status.info.text} mb-2`}>Time Horizon</h4>
                <p className={`text-lg font-bold ${theme.textColors.primary}`}>{timeHorizon} years</p>
                <p className={`text-sm ${theme.textColors.secondary}`}>Recommended minimum</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits and Considerations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <CheckCircle className="w-5 h-5" />
              Benefits of This Approach
            </h3>
            <ul className="space-y-3">
              {profile.benefits.map((benefit, index) => (
                <li key={index} className={`flex items-start gap-3 ${theme.textColors.secondary}`}>
                  <div className={`w-2 h-2 ${theme.status.success.bg} rounded-full mt-2 flex-shrink-0`}></div>
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <AlertTriangle className="w-5 h-5" />
              Important Considerations
            </h3>
            <ul className="space-y-3">
              {profile.considerations.map((consideration, index) => (
                <li key={index} className={`flex items-start gap-3 ${theme.textColors.secondary}`}>
                  <div className={`w-2 h-2 ${theme.status.warning.bg} rounded-full mt-2 flex-shrink-0`}></div>
                  <span className="text-sm">{consideration}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Investment Recommendations */}
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6 mb-6`}>
          <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Target className="w-5 h-5" />
            Specific Investment Recommendations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Simple 3-Fund Portfolio</h4>
              <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                <li>• <strong>Total Stock Market Index:</strong> {adjustedAllocation.stocks}%</li>
                <li>• <strong>Total Bond Market Index:</strong> {adjustedAllocation.bonds}%</li>
                <li>• <strong>International Stock Index:</strong> {adjustedAllocation.international}%</li>
              </ul>
            </div>

            <div>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Target-Date Fund Alternative</h4>
              <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                Consider a target-date fund for {investmentGoal === 'retirement' ? '2060-2065' : 'your goal date'}
              </p>
              <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                <li>• Automatic rebalancing</li>
                <li>• Age-appropriate allocation</li>
                <li>• Single fund simplicity</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Steps */}
        <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-6 mb-6`}>
          <h3 className={`font-semibold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
            <DollarSign className="w-5 h-5" />
            Next Steps to Implement Your Strategy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
              <li>1. Open investment account (Fidelity, Vanguard, Schwab)</li>
              <li>2. Set up automatic monthly contributions</li>
              <li>3. Choose low-cost index funds matching your allocation</li>
            </ul>
            <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
              <li>4. Rebalance portfolio annually</li>
              <li>5. Increase contributions with raises</li>
              <li>6. Stay disciplined during market volatility</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetAssessment}
            aria-label="Retake the risk tolerance assessment"
            className={`${theme.buttons.primary} px-6 py-3 rounded-lg transition-all hover-lift focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900`}
          >
            Take Assessment Again
          </button>
        </div>
      </div>
    );
  }

  const question = riskQuestions[currentQuestion];
  const progressPercent = ((currentQuestion + 1) / riskQuestions.length) * 100;

  return (
    <div className={`max-w-4xl mx-auto ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg shadow-lg p-6`}>
      <div className="mb-6">
        <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2 flex items-center gap-3`}>
          <div className={`${theme.status.info.bg} p-2 rounded-lg`}>
            <Brain className={`w-6 h-6 ${theme.status.info.text}`} />
          </div>
          Investment Risk Tolerance Assessment
        </h2>
        <p className={`${theme.textColors.secondary}`}>
          Discover your ideal investment strategy based on your risk tolerance and goals
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${theme.textColors.secondary}`}>
            Question {currentQuestion + 1} of {riskQuestions.length}
          </span>
          <span className={`text-sm font-medium ${theme.textColors.secondary}`}>
            {progressPercent.toFixed(0)}% Complete
          </span>
        </div>
        <div 
          className={`w-full bg-gray-200 rounded-full h-2`}
          data-progress={Math.round(progressPercent / 10) * 10}
        >
          <div
            className={`${theme.status.info.bg.replace('/20', '')} h-2 rounded-full ${styles.progressBarFill}`}
            aria-hidden="true"
          ></div>
        </div>
      </div>

      {/* Demographic Questions (before starting) */}
      {currentQuestion === 0 && Object.keys(answers).length === 0 && (
        <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
          <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Calendar className="w-5 h-5" aria-hidden="true" />
            Quick Background Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label
                htmlFor="age-range-select"
                className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}
              >
                Age Range
              </label>
              <select
                id="age-range-select"
                value={ageRange}
                onChange={(e) => {
                  setAgeRange(e.target.value);
                  clearValidationError('ageRange');
                }}
                aria-describedby={getValidationError('ageRange') ? 'age-range-error' : undefined}
                {...(!!getValidationError('ageRange') ? { 'aria-invalid': 'true' } : {})}
                className={`w-full px-3 py-2 border ${getValidationError('ageRange') ? 'border-red-500' : theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-blue-500 ${theme.textColors.primary} bg-slate-800`}
              >
                <option value="20-30">20-30</option>
                <option value="31-40">31-40</option>
                <option value="41-50">41-50</option>
                <option value="51-60">51-60</option>
                <option value="60+">60+</option>
              </select>
              {getValidationError('ageRange') && (
                <div id="age-range-error" role="alert" className="mt-1 text-sm text-red-500">
                  {getValidationError('ageRange')}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="investment-goal-select"
                className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}
              >
                Investment Goal
              </label>
              <select
                id="investment-goal-select"
                value={investmentGoal}
                onChange={(e) => {
                  setInvestmentGoal(e.target.value);
                  clearValidationError('investmentGoal');
                }}
                aria-describedby={getValidationError('investmentGoal') ? 'investment-goal-error' : undefined}
                {...(!!getValidationError('investmentGoal') ? { 'aria-invalid': 'true' } : {})}
                className={`w-full px-3 py-2 border ${getValidationError('investmentGoal') ? 'border-red-500' : theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-blue-500 ${theme.textColors.primary} bg-slate-800`}
              >
                <option value="retirement">Retirement</option>
                <option value="house">House Purchase</option>
                <option value="education">Education</option>
                <option value="general">General Wealth</option>
              </select>
              {getValidationError('investmentGoal') && (
                <div id="investment-goal-error" role="alert" className="mt-1 text-sm text-red-500">
                  {getValidationError('investmentGoal')}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="time-horizon-select"
                className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}
              >
                Time Horizon
              </label>
              <select
                id="time-horizon-select"
                value={timeHorizon}
                onChange={(e) => {
                  setTimeHorizon(e.target.value);
                  clearValidationError('timeHorizon');
                }}
                aria-describedby={getValidationError('timeHorizon') ? 'time-horizon-error' : undefined}
                {...(!!getValidationError('timeHorizon') ? { 'aria-invalid': 'true' } : {})}
                className={`w-full px-3 py-2 border ${getValidationError('timeHorizon') ? 'border-red-500' : theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-blue-500 ${theme.textColors.primary} bg-slate-800`}
              >
                <option value="5-10">5-10 years</option>
                <option value="10-20">10-20 years</option>
                <option value="20+">20+ years</option>
              </select>
              {getValidationError('timeHorizon') && (
                <div id="time-horizon-error" role="alert" className="mt-1 text-sm text-red-500">
                  {getValidationError('timeHorizon')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Current Question */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6 mb-6`}>
        <fieldset>
          <legend className={`${theme.typography.heading3} ${theme.textColors.primary} mb-2`}>
            {question.question}
          </legend>
          <p className={`text-sm ${theme.textColors.muted} mb-6`} id={`question-${question.id}-description`}>
            {question.description}
          </p>

          <div
            role="radiogroup"
            aria-labelledby={`question-${question.id}-description`}
            className="space-y-3"
          >
            {question.answers.map((answer, index) => (
              <button
                key={index}
                role="radio"
                aria-checked="false"
                onClick={() => handleAnswer(question.id, answer.score)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleAnswer(question.id, answer.score);
                  }
                }}
                className={`w-full text-left p-4 border-2 ${theme.borderColors.primary} rounded-lg hover:border-blue-500 hover:bg-blue-50/10 transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900`}
                aria-describedby={`answer-${question.id}-${index}-explanation`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 border-2 ${theme.borderColors.primary} rounded-full flex items-center justify-center group-hover:border-blue-500 transition-colors`}>
                    <span className={`text-sm font-bold ${theme.textColors.secondary} group-hover:text-blue-400`}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${theme.textColors.primary} mb-1`}>
                      {answer.text}
                    </p>
                    <p
                      id={`answer-${question.id}-${index}-explanation`}
                      className={`text-sm ${theme.textColors.muted}`}
                    >
                      {answer.explanation}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Progress Info */}
      <div className={`text-center ${theme.textColors.secondary} text-sm`}>
        <Clock className="w-4 h-4 inline mr-2" />
        Assessment takes about 2-3 minutes to complete
      </div>
    </div>
  );
}
