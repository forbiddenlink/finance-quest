'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/lib/theme';
import { Brain, TrendingUp, Shield, Target, Zap, LucideIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    personality: 'spender' | 'saver' | 'investor' | 'avoider';
    points: number;
  }[];
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'spending_style',
    question: "When you receive unexpected money (like a tax refund), what's your first instinct?",
    options: [
      { text: "Plan something fun - a vacation, new gadget, or experience", personality: 'spender', points: 4 },
      { text: "Put it straight into savings or emergency fund", personality: 'saver', points: 4 },
      { text: "Research the best investment opportunity for growth", personality: 'investor', points: 4 },
      { text: "Feel overwhelmed and not sure what to do with it", personality: 'avoider', points: 4 }
    ]
  },
  {
    id: 'risk_tolerance',
    question: "How do you feel about financial risk?",
    options: [
      { text: "Life is short - I'd rather enjoy money now than worry about later", personality: 'spender', points: 3 },
      { text: "I prefer guaranteed returns, even if they're smaller", personality: 'saver', points: 3 },
      { text: "Higher risk can mean higher reward - I'm comfortable with volatility", personality: 'investor', points: 3 },
      { text: "Risk makes me anxious - I avoid financial decisions when possible", personality: 'avoider', points: 3 }
    ]
  },
  {
    id: 'financial_planning',
    question: "How do you approach long-term financial planning?",
    options: [
      { text: "I focus on enjoying today and figure out tomorrow later", personality: 'spender', points: 3 },
      { text: "I have detailed budgets and emergency funds planned out", personality: 'saver', points: 3 },
      { text: "I research and create investment strategies for wealth building", personality: 'investor', points: 3 },
      { text: "I know I should plan but get overwhelmed and procrastinate", personality: 'avoider', points: 3 }
    ]
  }
];

interface PersonalityType {
  type: 'spender' | 'saver' | 'investor' | 'avoider';
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
  actionPlan: string[];
  icon: LucideIcon;
  color: string;
}

const personalityTypes: PersonalityType[] = [
  {
    type: 'spender',
    title: 'The Experiencer',
    description: 'You value experiences and enjoy using money to enhance your lifestyle. You see money as a tool for happiness and fulfillment.',
    strengths: [
      'Great at enjoying life and creating memorable experiences',
      'Willing to invest in personal growth and relationships',
      'Good at recognizing opportunities for enjoyment'
    ],
    challenges: [
      'May struggle with long-term savings goals',
      'Impulse purchases can derail financial plans',
      'Emergency fund building requires extra discipline'
    ],
    actionPlan: [
      'Set up automatic transfers to savings before you see the money',
      'Use the 24-hour rule for purchases over $100',
      'Allocate a specific "fun money" budget each month',
      'Focus on experiences over material possessions'
    ],
    icon: Zap,
    color: 'from-orange-500 to-red-500'
  },
  {
    type: 'saver',
    title: 'The Security Builder',
    description: 'You prioritize financial security and stability. Money represents safety and peace of mind for you.',
    strengths: [
      'Excellent at building emergency funds and savings',
      'Natural budgeting and expense tracking abilities',
      'Good at avoiding debt and living within means'
    ],
    challenges: [
      'May miss out on growth opportunities due to risk aversion',
      'Could be too conservative with investments',
      'Might under-invest in personal development or experiences'
    ],
    actionPlan: [
      'Once emergency fund is complete, explore conservative investments',
      'Set aside a small "growth investment" budget monthly',
      'Consider balanced mutual funds or index funds',
      'Allocate some money for calculated risks and opportunities'
    ],
    icon: Shield,
    color: 'from-green-500 to-blue-500'
  },
  {
    type: 'investor',
    title: 'The Wealth Builder',
    description: 'You understand money as a tool for building wealth and achieving financial independence. You think long-term and strategically.',
    strengths: [
      'Great at researching and analyzing investment options',
      'Comfortable with calculated risks for higher returns',
      'Strong understanding of compound interest and time value of money'
    ],
    challenges: [
      'May neglect emergency funds in favor of investments',
      'Could overlook the importance of enjoying money today',
      'Might take on too much risk without proper diversification'
    ],
    actionPlan: [
      'Ensure you have 3-6 months emergency fund before aggressive investing',
      'Diversify across different asset classes and time horizons',
      'Set aside some money for present enjoyment and experiences',
      'Consider tax-advantaged accounts like 401k and IRA first'
    ],
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500'
  },
  {
    type: 'avoider',
    title: 'The Overwhelmed Learner',
    description: 'Financial decisions feel overwhelming, but you recognize the importance of getting your money right. You just need the right system and support.',
    strengths: [
      'Recognition that financial health is important',
      'Potential for significant improvement with the right guidance',
      'Once systems are in place, you can be very consistent'
    ],
    challenges: [
      'Analysis paralysis prevents taking action',
      'Lack of confidence in financial decision-making',
      'May avoid dealing with money until problems arise'
    ],
    actionPlan: [
      'Start with one simple automated system (like automatic savings)',
      'Focus on education before making major financial decisions',
      'Work with a financial advisor or use robo-advisors for guidance',
      'Break large financial goals into small, manageable steps'
    ],
    icon: Brain,
    color: 'from-blue-500 to-indigo-500'
  }
];

interface MoneyPersonalityAssessmentProps {
  onComplete?: (personalityType: PersonalityType) => void;
}

export default function MoneyPersonalityAssessment({ onComplete }: MoneyPersonalityAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, number>>({ spender: 0, saver: 0, investor: 0, avoider: 0 });
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<PersonalityType | null>(null);

  const handleAnswer = (option: AssessmentQuestion['options'][0]) => {
    try {
      const newAnswers = { ...answers, [assessmentQuestions[currentQuestion].id]: option.text };
      const newScores = { ...scores };
      newScores[option.personality] += option.points;
      
      setAnswers(newAnswers);
      setScores(newScores);

      if (currentQuestion < assessmentQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Calculate result
        const dominantPersonality = Object.entries(newScores).reduce((a, b) => 
          newScores[a[0] as keyof typeof newScores] > newScores[b[0] as keyof typeof newScores] ? a : b
        )[0] as PersonalityType['type'];
        
        const personalityResult = personalityTypes.find(p => p.type === dominantPersonality);
        
        if (!personalityResult) {
          toast.error('Assessment error. Please try again.', {
            duration: 3000,
            position: 'top-center',
          });
          return;
        }
        
        setResult(personalityResult);
        setShowResults(true);
        
        toast.success(`Assessment complete! You're "${personalityResult.title}" 🧠`, {
          duration: 4000,
          position: 'top-center',
        });
        
        if (onComplete) {
          onComplete(personalityResult);
        }
      }
    } catch (error) {
      console.error('Assessment error:', error);
      toast.error('Something went wrong. Please try again.', {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setScores({ spender: 0, saver: 0, investor: 0, avoider: 0 });
    setShowResults(false);
    setResult(null);
  };

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  if (showResults && result) {
    const IconComponent = result.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.backgrounds.card} rounded-xl shadow-xl border ${theme.borderColors.primary} p-8`}
      >
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className={`bg-gradient-to-r ${result.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <IconComponent className="w-10 h-10 text-white" />
          </div>
          <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2`}>
            Your Money Personality: {result.title}
          </h2>
          <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
            {result.description}
          </p>
        </div>

        {/* Strengths and Challenges */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`${theme.backgrounds.cardHover} rounded-lg p-6 border ${theme.borderColors.primary}`}
          >
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center`}>
              <Target className={`w-6 h-6 mr-2 ${theme.status.success.text}`} />
              Your Strengths
            </h3>
            <ul className="space-y-2">
              {result.strengths.map((strength, index) => (
                <li key={index} className={`flex items-start ${theme.textColors.secondary}`}>
                  <span className={`${theme.status.success.text} mr-2 mt-1`}>✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`${theme.backgrounds.cardHover} rounded-lg p-6 border ${theme.borderColors.primary}`}
          >
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center`}>
              <Brain className={`w-6 h-6 mr-2 ${theme.status.warning.text}`} />
              Growth Areas
            </h3>
            <ul className="space-y-2">
              {result.challenges.map((challenge, index) => (
                <li key={index} className={`flex items-start ${theme.textColors.secondary}`}>
                  <span className={`${theme.status.warning.text} mr-2 mt-1`}>!</span>
                  {challenge}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Action Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${theme.backgrounds.cardHover} rounded-lg p-6 border ${theme.borderColors.primary}`}
        >
          <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center`}>
            <Zap className={`w-6 h-6 mr-2 ${theme.status.info.text}`} />
            Your Personalized Action Plan
          </h3>
          <ol className="space-y-3">
            {result.actionPlan.map((action, index) => (
              <li key={index} className={`flex items-start ${theme.textColors.secondary}`}>
                <span className={`${theme.status.info.text} font-bold mr-3 mt-0.5 text-lg`}>
                  {index + 1}.
                </span>
                {action}
              </li>
            ))}
          </ol>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <motion.button
            onClick={resetAssessment}
            className={`px-6 py-3 ${theme.buttons.ghost} rounded-lg font-semibold transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retake Assessment
          </motion.button>
          <motion.button
            onClick={() => window.location.href = '/calculators'}
            className={`px-6 py-3 bg-gradient-to-r ${result.color} text-white rounded-lg font-semibold transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Financial Tools
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const question = assessmentQuestions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${theme.backgrounds.card} rounded-xl shadow-xl border ${theme.borderColors.primary} p-8`}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`${theme.status.info.bg.replace("/20", "")}/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Brain className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2`}>
          Money Personality Assessment
        </h2>
        <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Discover your financial personality type and get personalized strategies
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${theme.textColors.secondary}`}>
            Question {currentQuestion + 1} of {assessmentQuestions.length}
          </span>
          <span className={`text-sm font-medium ${theme.textColors.secondary}`}>
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className={`w-full bg-gray-200 rounded-full h-2`}>
          <motion.div
            className={`bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-2xl mx-auto"
        >
          <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6 text-center`}>
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left p-4 rounded-lg border ${theme.borderColors.primary} hover:${theme.borderColors.primary} ${theme.interactive.hover} transition-all group`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <span className={`${theme.textColors.primary} group-hover:${theme.status.info.text}`}>
                    {option.text}
                  </span>
                  <div className={`w-4 h-4 rounded-full border-2 ${theme.borderColors.primary} group-hover:border-blue-500 transition-colors`} />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
