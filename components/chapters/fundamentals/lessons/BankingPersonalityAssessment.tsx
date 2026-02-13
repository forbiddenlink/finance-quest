'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/lib/theme';
import { 
  Building2, 
  Smartphone, 
  Users, 
  Shield, 
  CheckCircle, 
  Star,
  TrendingUp,
  Zap
} from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    points: {
      branch_loyalist: number;
      rate_optimizer: number;
      fee_avoider: number;
      digital_native: number;
    };
  }[];
}

interface BankingPersonality {
  id: string;
  name: string;
  description: string;
  icon: typeof Building2;
  color: string;
  strengths: string[];
  challenges: string[];
  bankingRecommendations: {
    primaryBank: string;
    savingsStrategy: string;
    tools: string[];
    warnings: string[];
  };
  actionPlan: string[];
}

const questions: Question[] = [
  {
    id: 'banking_preference',
    question: 'When you need to handle banking tasks, you prefer to:',
    options: [
      {
        id: 'in_person',
        text: 'Visit a branch and talk to a real person',
        points: { branch_loyalist: 3, rate_optimizer: 0, fee_avoider: 1, digital_native: 0 }
      },
      {
        id: 'mobile_app',
        text: 'Use mobile apps and online banking exclusively',
        points: { branch_loyalist: 0, rate_optimizer: 1, fee_avoider: 1, digital_native: 3 }
      },
      {
        id: 'phone_call',
        text: 'Call customer service when needed',
        points: { branch_loyalist: 2, rate_optimizer: 1, fee_avoider: 2, digital_native: 0 }
      },
      {
        id: 'research_online',
        text: 'Research everything online first, then take action',
        points: { branch_loyalist: 0, rate_optimizer: 3, fee_avoider: 2, digital_native: 2 }
      }
    ]
  },
  {
    id: 'fee_response',
    question: 'When you see a $35 overdraft fee on your account, your first reaction is:',
    options: [
      {
        id: 'call_bank',
        text: 'Call the bank immediately to get it waived',
        points: { branch_loyalist: 2, rate_optimizer: 1, fee_avoider: 3, digital_native: 1 }
      },
      {
        id: 'research_alternatives',
        text: 'Research banks with no overdraft fees',
        points: { branch_loyalist: 0, rate_optimizer: 2, fee_avoider: 3, digital_native: 2 }
      },
      {
        id: 'accept_it',
        text: 'Accept it as part of banking and move on',
        points: { branch_loyalist: 3, rate_optimizer: 0, fee_avoider: 0, digital_native: 1 }
      },
      {
        id: 'setup_automation',
        text: 'Set up alerts and automation to prevent future fees',
        points: { branch_loyalist: 1, rate_optimizer: 2, fee_avoider: 2, digital_native: 3 }
      }
    ]
  },
  {
    id: 'rate_importance',
    question: 'How important is getting the highest interest rate on your savings?',
    options: [
      {
        id: 'extremely_important',
        text: 'Extremely - I\'ll switch banks for 0.1% more',
        points: { branch_loyalist: 0, rate_optimizer: 3, fee_avoider: 2, digital_native: 2 }
      },
      {
        id: 'somewhat_important',
        text: 'Important, but convenience matters more',
        points: { branch_loyalist: 2, rate_optimizer: 1, fee_avoider: 1, digital_native: 1 }
      },
      {
        id: 'not_priority',
        text: 'Not a priority - I value service and relationship',
        points: { branch_loyalist: 3, rate_optimizer: 0, fee_avoider: 0, digital_native: 0 }
      },
      {
        id: 'balance_both',
        text: 'I want good rates with modern technology',
        points: { branch_loyalist: 0, rate_optimizer: 2, fee_avoider: 1, digital_native: 3 }
      }
    ]
  },
  {
    id: 'new_technology',
    question: 'When your bank introduces a new mobile feature, you:',
    options: [
      {
        id: 'early_adopter',
        text: 'Try it immediately and love new features',
        points: { branch_loyalist: 0, rate_optimizer: 1, fee_avoider: 1, digital_native: 3 }
      },
      {
        id: 'wait_and_see',
        text: 'Wait for reviews and then maybe try it',
        points: { branch_loyalist: 1, rate_optimizer: 2, fee_avoider: 2, digital_native: 1 }
      },
      {
        id: 'prefer_traditional',
        text: 'Prefer traditional methods that work',
        points: { branch_loyalist: 3, rate_optimizer: 0, fee_avoider: 1, digital_native: 0 }
      },
      {
        id: 'evaluate_benefits',
        text: 'Evaluate if it saves money or improves returns',
        points: { branch_loyalist: 1, rate_optimizer: 3, fee_avoider: 2, digital_native: 2 }
      }
    ]
  },
  {
    id: 'banking_relationship',
    question: 'Your ideal banking relationship is:',
    options: [
      {
        id: 'personal_banker',
        text: 'Having a personal banker who knows me',
        points: { branch_loyalist: 3, rate_optimizer: 0, fee_avoider: 1, digital_native: 0 }
      },
      {
        id: 'best_rates',
        text: 'Getting the best rates, regardless of bank',
        points: { branch_loyalist: 0, rate_optimizer: 3, fee_avoider: 2, digital_native: 1 }
      },
      {
        id: 'no_fees_hassles',
        text: 'No fees, no hassles, simple banking',
        points: { branch_loyalist: 1, rate_optimizer: 1, fee_avoider: 3, digital_native: 2 }
      },
      {
        id: 'cutting_edge',
        text: 'Cutting-edge technology and innovation',
        points: { branch_loyalist: 0, rate_optimizer: 1, fee_avoider: 1, digital_native: 3 }
      }
    ]
  }
];

const personalities: Record<string, BankingPersonality> = {
  branch_loyalist: {
    id: 'branch_loyalist',
    name: 'The Branch Loyalist',
    description: 'You value personal relationships and in-person service above all else. You prefer the security and trust that comes from face-to-face banking.',
    icon: Building2,
    color: 'blue',
    strengths: [
      'Strong personal relationships with bank staff',
      'Comfortable navigating complex banking needs in person',
      'Loyal customer who can leverage relationship benefits',
      'Prefers proven, traditional banking methods'
    ],
    challenges: [
      'May pay higher fees for convenience and service',
      'Could miss out on better rates at online banks',
      'Limited to banks with physical presence in your area',
      'May be slower to adopt cost-saving technology'
    ],
    bankingRecommendations: {
      primaryBank: 'Local credit union or community bank with strong service reputation',
      savingsStrategy: 'Build relationship for better rates and fee waivers over time',
      tools: ['In-person financial planning', 'Relationship manager', 'Traditional investment services'],
      warnings: ['Watch out for loyalty costing you money', 'Compare rates annually', 'Don\'t ignore fee waivers available online']
    },
    actionPlan: [
      'Schedule annual review with your banker to negotiate better rates',
      'Ask about relationship rewards and fee waivers you might qualify for',
      'Consider adding an online savings account for emergency fund (higher rates)',
      'Set up basic online banking for routine transactions to save branch visits',
      'Compare your rates to online banks annually - use as negotiation leverage'
    ]
  },
  rate_optimizer: {
    id: 'rate_optimizer',
    name: 'The Rate Optimizer',
    description: 'You are laser-focused on maximizing returns and minimizing costs. Every basis point matters, and you\'ll switch banks for better rates.',
    icon: TrendingUp,
    color: 'green',
    strengths: [
      'Maximizes earning potential on every dollar',
      'Always aware of best rates and deals in market',
      'Willing to optimize banking setup for maximum return',
      'Good at calculating opportunity costs'
    ],
    challenges: [
      'May sacrifice convenience for slightly better rates',
      'Can spend too much time chasing marginal improvements',
      'Might overlook relationship benefits and fee waivers',
      'Could have complex banking setup that\'s hard to manage'
    ],
    bankingRecommendations: {
      primaryBank: 'High-yield online bank with competitive rates and no fees',
      savingsStrategy: 'Multiple high-yield accounts, CDs for guaranteed returns, money market optimization',
      tools: ['Rate comparison websites', 'Automated rate monitoring', 'Multiple bank relationships'],
      warnings: ['Don\'t let rate chasing cost more than it saves', 'Consider total relationship value', 'Factor in time costs']
    },
    actionPlan: [
      'Set up automated rate monitoring to track when to switch banks',
      'Optimize between online savings (4-5% APY) and short-term CDs',
      'Use primary checking at bank that reimburses ATM fees',
      'Consider high-yield money market for larger emergency fund amounts',
      'Review and optimize every 6 months, but don\'t over-optimize'
    ]
  },
  fee_avoider: {
    id: 'fee_avoider',
    name: 'The Fee Avoider',
    description: 'You are paranoid about banking fees and focus on keeping more of your hard-earned money. Every fee feels like theft.',
    icon: Shield,
    color: 'red',
    strengths: [
      'Excellent at avoiding unnecessary banking costs',
      'Vigilant about account terms and fee structures',
      'Motivated to find free banking alternatives',
      'Keeps more money by avoiding fee traps'
    ],
    challenges: [
      'May miss opportunities due to fear of fees',
      'Could choose inferior service to avoid costs',
      'Might over-focus on fees vs. total banking value',
      'Can be stressed by complex fee structures'
    ],
    bankingRecommendations: {
      primaryBank: 'Credit union or online bank with truly no fees',
      savingsStrategy: 'Simple, no-fee accounts with competitive rates',
      tools: ['Fee-free checking and savings', 'ATM fee reimbursement', 'Overdraft alerts and protection'],
      warnings: ['Don\'t let fee avoidance cost you money elsewhere', 'Some fees might be worth paying for value', 'Read the fine print']
    },
    actionPlan: [
      'Switch to a credit union or online bank with no monthly fees',
      'Set up account alerts for balances and transactions',
      'Use only in-network ATMs or banks that reimburse fees',
      'Enable overdraft protection linked to savings account',
      'Review fee schedule annually and negotiate with your bank'
    ]
  },
  digital_native: {
    id: 'digital_native',
    name: 'The Digital Native',
    description: 'You embrace technology and want banking to be seamless, mobile-first, and innovative. Branches are obsolete to you.',
    icon: Smartphone,
    color: 'purple',
    strengths: [
      'Comfortable with mobile-first banking',
      'Quick to adopt new fintech solutions',
      'Efficient at managing money digitally',
      'Open to innovative banking approaches'
    ],
    challenges: [
      'May miss personal service when needed',
      'Could be vulnerable to digital security issues',
      'Might choose flashy features over financial fundamentals',
      'Limited options for complex banking needs'
    ],
    bankingRecommendations: {
      primaryBank: 'Modern online bank or fintech with excellent mobile experience',
      savingsStrategy: 'Automated savings, robo-advisors, app-based optimization',
      tools: ['Mobile banking apps', 'Automated transfers', 'Digital financial planning', 'Integration with budgeting apps'],
      warnings: ['Don\'t sacrifice FDIC protection for features', 'Ensure strong security practices', 'Have backup for tech failures']
    },
    actionPlan: [
      'Choose a bank with best-in-class mobile app and digital experience',
      'Set up automated savings and investment transfers',
      'Use budgeting apps that integrate with your banking',
      'Enable biometric authentication and strong security',
      'Consider robo-advisor for investment automation'
    ]
  }
};

export default function BankingPersonalityAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState({
    branch_loyalist: 0,
    rate_optimizer: 0,
    fee_avoider: 0,
    digital_native: 0
  });
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    const question = questions[currentQuestion];
    const answer = question.options.find(opt => opt.id === selectedAnswer);
    
    if (answer) {
      // Update scores
      setScores(prev => ({
        branch_loyalist: prev.branch_loyalist + answer.points.branch_loyalist,
        rate_optimizer: prev.rate_optimizer + answer.points.rate_optimizer,
        fee_avoider: prev.fee_avoider + answer.points.fee_avoider,
        digital_native: prev.digital_native + answer.points.digital_native
      }));

      // Save answer
      setAnswers(prev => ({
        ...prev,
        [question.id]: selectedAnswer
      }));
    }

    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate final scores and show results
      const finalScores = { ...scores };
      if (answer) {
        finalScores.branch_loyalist += answer.points.branch_loyalist;
        finalScores.rate_optimizer += answer.points.rate_optimizer;
        finalScores.fee_avoider += answer.points.fee_avoider;
        finalScores.digital_native += answer.points.digital_native;
      }
      setScores(finalScores);
      setShowResults(true);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setScores({
      branch_loyalist: 0,
      rate_optimizer: 0,
      fee_avoider: 0,
      digital_native: 0
    });
    setShowResults(false);
    setSelectedAnswer(null);
  };

  const getDominantPersonality = (): BankingPersonality => {
    const maxScore = Math.max(...Object.values(scores));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dominantType = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'branch_loyalist';
    return personalities[dominantType];
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const personality = getDominantPersonality();
    const IconComponent = personality.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`w-20 h-20 ${theme.status.success.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            <IconComponent className={`w-10 h-10 ${theme.status.success.text}`} />
          </motion.div>
          
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
            You are: {personality.name}
          </h3>
          
          <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
            {personality.description}
          </p>
        </div>

        {/* Personality Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(scores).map(([type, score]) => {
            const typePersonality = personalities[type];
            const TypeIcon = typePersonality.icon;
            const isWinner = score === Math.max(...Object.values(scores));
            
            return (
              <div
                key={type}
                className={`p-4 rounded-lg text-center transition-all ${
                  isWinner 
                    ? `${theme.status.success.bg} border-2 ${theme.status.success.border}` 
                    : `${theme.backgrounds.cardHover} border ${theme.borderColors.muted}`
                }`}
              >
                <TypeIcon className={`w-6 h-6 mx-auto mb-2 ${isWinner ? theme.status.success.text : theme.textColors.muted}`} />
                <div className={`text-lg font-bold ${isWinner ? theme.status.success.text : theme.textColors.primary}`}>
                  {score}
                </div>
                <div className={`text-xs ${isWinner ? theme.status.success.text : theme.textColors.muted}`}>
                  {typePersonality.name.replace('The ', '')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Strengths and Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`p-4 ${theme.status.success.bg} border-l-4 ${theme.status.success.border} rounded-lg`}>
            <h4 className={`font-bold ${theme.status.success.text} mb-3 flex items-center gap-2`}>
              <Star className="w-5 h-5" />
              Your Strengths
            </h4>
            <ul className="space-y-2">
              {personality.strengths.map((strength, index) => (
                <li key={index} className={`text-sm ${theme.status.success.text} flex items-start gap-2`}>
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className={`p-4 ${theme.status.warning.bg} border-l-4 ${theme.status.warning.border} rounded-lg`}>
            <h4 className={`font-bold ${theme.status.warning.text} mb-3 flex items-center gap-2`}>
              <Shield className="w-5 h-5" />
              Watch Out For
            </h4>
            <ul className="space-y-2">
              {personality.challenges.map((challenge, index) => (
                <li key={index} className={`text-sm ${theme.status.warning.text} flex items-start gap-2`}>
                  <span className="w-4 h-4 mt-0.5 flex-shrink-0 text-center">⚠️</span>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className={`p-6 ${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg mb-8`}>
          <h4 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Building2 className="w-6 h-6" />
            Your Personalized Banking Strategy
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className={`font-bold ${theme.textColors.primary} mb-2`}>Recommended Setup</h5>
              <div className="space-y-2 text-sm">
                <div>
                  <span className={`font-medium ${theme.textColors.secondary}`}>Primary Bank: </span>
                  <span className={`${theme.textColors.primary}`}>{personality.bankingRecommendations.primaryBank}</span>
                </div>
                <div>
                  <span className={`font-medium ${theme.textColors.secondary}`}>Savings Strategy: </span>
                  <span className={`${theme.textColors.primary}`}>{personality.bankingRecommendations.savingsStrategy}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className={`font-bold ${theme.textColors.primary} mb-2`}>Recommended Tools</h5>
              <ul className="space-y-1">
                {personality.bankingRecommendations.tools.map((tool, index) => (
                  <li key={index} className={`text-sm ${theme.textColors.secondary} flex items-center gap-2`}>
                    <Zap className="w-3 h-3" />
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`mt-4 p-3 ${theme.status.info.bg} rounded-lg`}>
            <h5 className={`font-bold ${theme.status.info.text} mb-2`}>Important Warnings</h5>
            <ul className="space-y-1">
              {personality.bankingRecommendations.warnings.map((warning, index) => (
                <li key={index} className={`text-sm ${theme.status.info.text} flex items-center gap-2`}>
                  <span>⚠️</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Plan */}
        <div className={`p-6 ${theme.status.success.bg} border-l-4 ${theme.status.success.border} rounded-lg mb-6`}>
          <h4 className={`text-xl font-bold ${theme.status.success.text} mb-4 flex items-center gap-2`}>
            <CheckCircle className="w-6 h-6" />
            Your 30-Day Action Plan
          </h4>
          <div className="space-y-3">
            {personality.actionPlan.map((action, index) => (
              <label key={index} className="flex items-start space-x-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 mt-1 text-green-600 rounded" />
                <span className={`text-sm ${theme.status.success.text} font-medium`}>
                  <span className={`inline-block w-6 h-6 rounded-full ${theme.backgrounds.card} ${theme.textColors.primary} text-center text-xs leading-6 mr-2`}>
                    {index + 1}
                  </span>
                  {action}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetAssessment}
            className={`px-6 py-3 ${theme.buttons.secondary} rounded-xl font-medium transition-all hover-lift`}
          >
            Take Assessment Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      {/* Header */}
      <div className="mb-8">
        <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
          <Users className="w-6 h-6" />
          Banking Personality Assessment
        </h3>
        <p className={`${theme.textColors.secondary} mb-4`}>
          Discover your banking style and get personalized recommendations for optimizing your financial setup.
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${theme.status.success.bg}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className={`${theme.textColors.muted}`}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className={`${theme.textColors.muted}`}>
            {Math.round(progress)}% Complete
          </span>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8">
            <h4 className={`text-xl font-bold ${theme.textColors.primary} mb-6`}>
              {questions[currentQuestion].question}
            </h4>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  aria-label={option.text}
                  aria-pressed={selectedAnswer === option.id}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                    selectedAnswer === option.id
                      ? `${theme.borderColors.primary} ${theme.status.info.bg}`
                      : `${theme.borderColors.muted} hover:${theme.borderColors.primary} hover:${theme.backgrounds.cardHover}`
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <span className={`${theme.textColors.primary} font-medium`}>{option.text}</span>
                    {selectedAnswer === option.id && (
                      <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className={`${theme.textColors.muted}`}>
                {currentQuestion + 1} / {questions.length} questions
              </span>
            </div>
            
            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className={`px-8 py-3 ${theme.buttons.primary} rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover-lift`}
            >
              {currentQuestion === questions.length - 1 ? 'See My Results' : 'Next Question'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
