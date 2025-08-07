'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  TrendingUp,
  CheckCircle,
  ChevronLeft,
  PieChart,
  BarChart3,
  Clock,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  question: string;
  description: string;
  options: {
    text: string;
    value: number;
    explanation: string;
  }[];
}

interface RiskProfile {
  type: 'Conservative' | 'Moderate' | 'Aggressive' | 'Very Aggressive';
  description: string;
  allocation: {
    stocks: number;
    bonds: number;
    international: number;
    reits: number;
  };
  expectedReturn: number;
  volatility: number;
  characteristics: string[];
  idealFor: string[];
}

const questions: Question[] = [
  {
    id: 'age',
    question: 'What is your current age?',
    description: 'Age affects your investment timeline and risk capacity',
    options: [
      { text: 'Under 30', value: 4, explanation: 'Long timeline allows for maximum growth potential' },
      { text: '30-40', value: 3, explanation: 'Strong growth focus with moderate time horizon' },
      { text: '40-50', value: 2, explanation: 'Balanced approach as retirement approaches' },
      { text: 'Over 50', value: 1, explanation: 'Conservative approach for capital preservation' }
    ]
  },
  {
    id: 'timeline',
    question: 'When will you need this money?',
    description: 'Investment timeline determines appropriate risk level',
    options: [
      { text: 'More than 20 years', value: 4, explanation: 'Long-term wealth building with maximum growth' },
      { text: '10-20 years', value: 3, explanation: 'Strong growth with some risk management' },
      { text: '5-10 years', value: 2, explanation: 'Moderate growth with stability focus' },
      { text: 'Less than 5 years', value: 1, explanation: 'Capital preservation is the priority' }
    ]
  },
  {
    id: 'experience',
    question: 'How much investment experience do you have?',
    description: 'Experience affects comfort with market volatility',
    options: [
      { text: 'Very experienced - I understand market cycles', value: 4, explanation: 'Comfortable with volatility for long-term gains' },
      { text: 'Some experience - I have invested before', value: 3, explanation: 'Growing comfort with market fluctuations' },
      { text: 'Limited experience - I am learning', value: 2, explanation: 'Prefer moderate risk while learning' },
      { text: 'No experience - I am new to investing', value: 1, explanation: 'Start conservative and build confidence' }
    ]
  },
  {
    id: 'market_drop',
    question: 'If your portfolio dropped 30% in a market crash, you would:',
    description: 'This reveals your true risk tolerance under stress',
    options: [
      { text: 'Buy more investments - markets recover', value: 4, explanation: 'Opportunistic mindset maximizes long-term wealth' },
      { text: 'Hold steady - stay the course', value: 3, explanation: 'Disciplined approach leads to market returns' },
      { text: 'Feel anxious but not sell', value: 2, explanation: 'Moderate portfolio reduces emotional stress' },
      { text: 'Sell to prevent further losses', value: 1, explanation: 'Conservative allocation prevents panic selling' }
    ]
  },
  {
    id: 'income_stability',
    question: 'How stable is your income?',
    description: 'Income stability affects your ability to ride out market volatility',
    options: [
      { text: 'Very stable - guaranteed income', value: 4, explanation: 'Stable income allows for aggressive growth' },
      { text: 'Mostly stable - regular employment', value: 3, explanation: 'Good income supports moderate risk taking' },
      { text: 'Somewhat variable - commission/contract', value: 2, explanation: 'Variable income suggests balanced approach' },
      { text: 'Highly variable - entrepreneur/freelancer', value: 1, explanation: 'Irregular income needs portfolio stability' }
    ]
  },
  {
    id: 'emergency_fund',
    question: 'Do you have an emergency fund covering 3-6 months of expenses?',
    description: 'Emergency funds allow you to take more investment risk',
    options: [
      { text: 'Yes, 6+ months covered', value: 4, explanation: 'Strong safety net enables aggressive investing' },
      { text: 'Yes, 3-6 months covered', value: 3, explanation: 'Adequate safety net supports growth investing' },
      { text: 'Partially - 1-3 months covered', value: 2, explanation: 'Building fund while investing moderately' },
      { text: 'No emergency fund yet', value: 1, explanation: 'Build emergency fund before aggressive investing' }
    ]
  },
  {
    id: 'goals',
    question: 'What is your primary investment goal?',
    description: 'Goals determine the appropriate risk/return balance',
    options: [
      { text: 'Maximum wealth building for retirement', value: 4, explanation: 'Growth focus maximizes long-term wealth' },
      { text: 'Balanced growth with some income', value: 3, explanation: 'Balanced approach for steady progress' },
      { text: 'Income generation with moderate growth', value: 2, explanation: 'Income focus with growth component' },
      { text: 'Capital preservation with minimal risk', value: 1, explanation: 'Conservative approach protects capital' }
    ]
  }
];

const riskProfiles: Record<string, RiskProfile> = {
  conservative: {
    type: 'Conservative',
    description: 'Prioritizes capital preservation with modest growth. Ideal for investors nearing retirement or those who cannot afford significant losses.',
    allocation: { stocks: 30, bonds: 50, international: 10, reits: 10 },
    expectedReturn: 5.5,
    volatility: 8,
    characteristics: [
      'Low volatility portfolio',
      'Steady income generation',
      'Capital preservation focus',
      'Limited downside risk'
    ],
    idealFor: [
      'Investors within 5 years of retirement',
      'Those needing steady income',
      'First-time investors building confidence',
      'Anyone uncomfortable with market volatility'
    ]
  },
  moderate: {
    type: 'Moderate',
    description: 'Balances growth potential with risk management. Suitable for investors with medium-term goals and moderate risk tolerance.',
    allocation: { stocks: 50, bonds: 30, international: 15, reits: 5 },
    expectedReturn: 7.0,
    volatility: 12,
    characteristics: [
      'Balanced risk and return',
      'Moderate portfolio volatility',
      'Diversified across asset classes',
      'Steady long-term growth'
    ],
    idealFor: [
      'Investors 10-15 years from retirement',
      'Those wanting balanced growth',
      'Moderate risk tolerance investors',
      'Building wealth steadily over time'
    ]
  },
  aggressive: {
    type: 'Aggressive',
    description: 'Emphasizes growth potential over stability. Best for younger investors with long time horizons who can weather market volatility.',
    allocation: { stocks: 70, bonds: 15, international: 10, reits: 5 },
    expectedReturn: 8.5,
    volatility: 16,
    characteristics: [
      'High growth potential',
      'Higher portfolio volatility',
      'Equity-focused allocation',
      'Maximum long-term wealth building'
    ],
    idealFor: [
      'Investors 15+ years from retirement',
      'Those comfortable with volatility',
      'Maximum wealth building goals',
      'Strong emergency fund holders'
    ]
  },
  very_aggressive: {
    type: 'Very Aggressive',
    description: 'Maximizes growth potential with highest risk tolerance. For experienced investors with very long time horizons and high risk capacity.',
    allocation: { stocks: 85, bonds: 5, international: 8, reits: 2 },
    expectedReturn: 9.5,
    volatility: 20,
    characteristics: [
      'Maximum growth potential',
      'High portfolio volatility',
      'Equity-heavy allocation',
      'Wealth maximization focus'
    ],
    idealFor: [
      'Young investors (20s-30s)',
      'Very long investment timelines',
      'High risk tolerance individuals',
      'Experienced market participants'
    ]
  }
};

export default function RiskToleranceAssessment() {
  const { recordCalculatorUsage } = useProgressStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    recordCalculatorUsage('risk-tolerance-assessment');
  }, [recordCalculatorUsage]);

  const handleAnswer = (value: number) => {
    setSelectedOption(value);
    
    setTimeout(() => {
      const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setShowResults(true);
      }
    }, 300);
  };

  const calculateRiskProfile = (): RiskProfile => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const averageScore = totalScore / questions.length;
    
    if (averageScore >= 3.5) return riskProfiles.very_aggressive;
    if (averageScore >= 2.5) return riskProfiles.aggressive;
    if (averageScore >= 1.5) return riskProfiles.moderate;
    return riskProfiles.conservative;
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setSelectedOption(null);
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[questions[currentQuestion - 1].id] || null);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const profile = showResults ? calculateRiskProfile() : null;

  if (showResults && profile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-8`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.status.success.bg} rounded-full mb-4`}>
            <Target className={`w-8 h-8 ${theme.status.success.text}`} />
          </div>
          <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
            Your Risk Profile: {profile.type}
          </h2>
          <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
            {profile.description}
          </p>
        </div>

        {/* Portfolio Allocation */}
        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 mb-8`}>
          <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-3`}>
            <PieChart className="w-6 h-6" />
            Recommended Portfolio Allocation
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className={`text-center p-4 ${theme.status.info.bg} rounded-lg`}>
              <div className={`text-2xl font-bold ${theme.status.info.text} mb-1`}>
                {profile.allocation.stocks}%
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>US Stocks</div>
            </div>
            <div className={`text-center p-4 ${theme.status.warning.bg} rounded-lg`}>
              <div className={`text-2xl font-bold ${theme.status.warning.text} mb-1`}>
                {profile.allocation.bonds}%
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Bonds</div>
            </div>
            <div className={`text-center p-4 ${theme.status.success.bg} rounded-lg`}>
              <div className={`text-2xl font-bold ${theme.status.success.text} mb-1`}>
                {profile.allocation.international}%
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>International</div>
            </div>
            <div className={`text-center p-4 ${theme.backgrounds.card} border rounded-lg`}>
              <div className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>
                {profile.allocation.reits}%
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>REITs</div>
            </div>
          </div>

          {/* Expected Returns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 ${theme.status.success.bg} rounded-lg text-center`}>
              <TrendingUp className={`w-8 h-8 ${theme.status.success.text} mx-auto mb-2`} />
              <div className={`text-2xl font-bold ${theme.status.success.text} mb-1`}>
                {profile.expectedReturn}%
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Expected Annual Return</div>
            </div>
            <div className={`p-4 ${theme.status.warning.bg} rounded-lg text-center`}>
              <BarChart3 className={`w-8 h-8 ${theme.status.warning.text} mx-auto mb-2`} />
              <div className={`text-2xl font-bold ${theme.status.warning.text} mb-1`}>
                {profile.volatility}%
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Expected Volatility</div>
            </div>
          </div>
        </div>

        {/* Profile Characteristics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <Star className="w-5 h-5" />
              Key Characteristics
            </h4>
            <ul className="space-y-3">
              {profile.characteristics.map((characteristic, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className={`w-5 h-5 ${theme.status.success.text} flex-shrink-0 mt-0.5`} />
                  <span className={`${theme.textColors.secondary}`}>{characteristic}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Ideal For
            </h4>
            <ul className="space-y-3">
              {profile.idealFor.map((ideal, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className={`w-5 h-5 ${theme.status.info.text} flex-shrink-0 mt-0.5`} />
                  <span className={`${theme.textColors.secondary}`}>{ideal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Growth Projection */}
        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 mb-8`}>
          <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Clock className="w-5 h-5" />
            Growth Projection: $1,000/month Investment
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[10, 20, 30, 40].map(years => {
              const monthlyContribution = 1000;
              const totalContributions = monthlyContribution * 12 * years;
              const rate = profile.expectedReturn / 100;
              const futureValue = monthlyContribution * 12 * (Math.pow(1 + rate, years) - 1) / rate;
              
              return (
                <div key={years} className={`text-center p-4 ${theme.status.info.bg} rounded-lg`}>
                  <div className={`text-lg font-bold ${theme.status.info.text} mb-1`}>
                    ${Math.round(futureValue / 1000)}K
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary} mb-1`}>
                    After {years} years
                  </div>
                  <div className={`text-xs ${theme.textColors.muted}`}>
                    Invested: ${Math.round(totalContributions / 1000)}K
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetAssessment}
            className={`px-6 py-3 border-2 ${theme.borderColors.primary} ${theme.textColors.secondary} rounded-xl hover:${theme.borderColors.accent} hover:${theme.textColors.primary} transition-all`}
          >
            Retake Assessment
          </button>
          <button
            onClick={() => {
              toast.success('Portfolio recommendation saved! 📊');
            }}
            className={`px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all shadow-lg hover:shadow-xl`}
          >
            Save My Portfolio Plan
          </button>
        </div>

        {/* Educational Note */}
        <div className={`mt-6 p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg text-center`}>
          <p className={`text-sm ${theme.status.info.text} font-medium`}>
            💡 This assessment provides general guidance. Consider consulting a financial advisor for personalized advice based on your complete financial situation.
          </p>
        </div>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];
  const currentAnswer = answers[question.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-8`}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.status.info.bg} rounded-full mb-4`}>
          <Target className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
          Risk Tolerance Assessment
        </h2>
        <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto mb-6`}>
          Discover your ideal investment allocation based on your goals, timeline, and comfort with market volatility.
        </p>
        
        {/* Progress Bar */}
        <div className={`w-full ${theme.backgrounds.glass} rounded-full h-3 mb-2`}>
          <motion.div
            className={`h-3 ${theme.status.info.bg} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className={`text-sm ${theme.textColors.muted}`}>
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 mb-8`}>
            <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-3`}>
              {question.question}
            </h3>
            <p className={`text-lg ${theme.textColors.secondary} mb-6`}>
              {question.description}
            </p>

            <div className="space-y-4">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                    selectedOption === option.value
                      ? `${theme.status.success.bg} ${theme.status.success.border} ${theme.status.success.text}`
                      : currentAnswer === option.value
                      ? `${theme.status.info.bg} ${theme.status.info.border} ${theme.status.info.text}`
                      : `${theme.backgrounds.glass} ${theme.borderColors.primary} hover:${theme.borderColors.accent}`
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                      selectedOption === option.value || currentAnswer === option.value
                        ? 'border-current'
                        : theme.borderColors.primary
                    }`}>
                      {(selectedOption === option.value || currentAnswer === option.value) && (
                        <div className="w-3 h-3 rounded-full bg-current" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${theme.textColors.primary} mb-2`}>
                        {option.text}
                      </div>
                      <div className={`text-sm ${theme.textColors.secondary}`}>
                        {option.explanation}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center max-w-3xl mx-auto">
        <button
          onClick={goToPrevious}
          disabled={currentQuestion === 0}
          className={`flex items-center gap-2 px-6 py-3 border-2 ${theme.borderColors.primary} ${theme.textColors.secondary} rounded-xl hover:${theme.borderColors.accent} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <div className={`text-sm ${theme.textColors.muted} text-center`}>
          {Object.keys(answers).length > 0 && (
            <span>Progress saved automatically</span>
          )}
        </div>

        <div className={`text-sm ${theme.textColors.muted}`}>
          {currentQuestion < questions.length - 1 ? 'Select an answer to continue' : 'Last question'}
        </div>
      </div>

      {/* Assessment Info */}
      <div className={`mt-8 p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg text-center max-w-3xl mx-auto`}>
        <p className={`text-sm ${theme.status.info.text} font-medium`}>
          🎯 This assessment considers your age, timeline, experience, and emotional comfort with market volatility to recommend an optimal portfolio allocation.
        </p>
      </div>
    </motion.div>
  );
}
