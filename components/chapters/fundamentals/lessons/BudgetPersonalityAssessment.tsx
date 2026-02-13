'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { 
  User, 
  Calculator, 
  Target, 
  Zap, 
  Brain, 
  TrendingUp, 
  Heart,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    value: string;
    points: Record<string, number>;
  }[];
}

interface PersonalityType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  strengths: string[];
  challenges: string[];
  budgetingTips: string[];
  recommendedTools: string[];
  color: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "How do you typically approach financial planning?",
    options: [
      { text: "I love detailed spreadsheets and tracking every penny", value: "A", points: { analytical: 3, organized: 2 } },
      { text: "I prefer simple rules and automated systems", value: "B", points: { automated: 3, simple: 2 } },
      { text: "I focus on big picture goals and outcomes", value: "C", points: { goal_oriented: 3, flexible: 1 } },
      { text: "I adapt my approach based on current situations", value: "D", points: { flexible: 3, intuitive: 2 } }
    ]
  },
  {
    id: 2,
    question: "When you overspend in a category, what's your typical reaction?",
    options: [
      { text: "Analyze where I went wrong and adjust next month's budget", value: "A", points: { analytical: 2, organized: 3 } },
      { text: "Set up automatic controls to prevent it happening again", value: "B", points: { automated: 3, cautious: 2 } },
      { text: "Focus on earning more to balance it out", value: "C", points: { goal_oriented: 2, optimistic: 3 } },
      { text: "Accept it and move on - life happens", value: "D", points: { flexible: 3, intuitive: 1 } }
    ]
  },
  {
    id: 3,
    question: "How often do you want to check your budget?",
    options: [
      { text: "Daily - I like to stay on top of everything", value: "A", points: { analytical: 3, organized: 2 } },
      { text: "Weekly - regular but not obsessive", value: "B", points: { organized: 2, automated: 1 } },
      { text: "Monthly - just enough to stay on track", value: "C", points: { goal_oriented: 2, simple: 2 } },
      { text: "Only when something feels off", value: "D", points: { flexible: 2, intuitive: 3 } }
    ]
  },
  {
    id: 4,
    question: "What motivates you most about budgeting?",
    options: [
      { text: "Having complete control and understanding of my finances", value: "A", points: { analytical: 3, organized: 2 } },
      { text: "Reducing financial stress and simplifying money management", value: "B", points: { automated: 2, simple: 3 } },
      { text: "Achieving specific financial goals faster", value: "C", points: { goal_oriented: 3, optimistic: 2 } },
      { text: "Having flexibility to enjoy life while staying responsible", value: "D", points: { flexible: 3, intuitive: 2 } }
    ]
  },
  {
    id: 5,
    question: "Which budgeting challenge resonates most with you?",
    options: [
      { text: "Making sure my categories and calculations are perfect", value: "A", points: { analytical: 3, organized: 2 } },
      { text: "Remembering to track expenses and stay consistent", value: "B", points: { automated: 3, simple: 1 } },
      { text: "Balancing current enjoyment with future goals", value: "C", points: { goal_oriented: 2, optimistic: 2 } },
      { text: "Sticking to rigid rules when life gets unpredictable", value: "D", points: { flexible: 3, intuitive: 2 } }
    ]
  }
];

const personalityTypes: PersonalityType[] = [
  {
    id: 'analytical',
    name: 'The Financial Analyst',
    icon: Calculator,
    description: 'You love detailed tracking, spreadsheets, and understanding exactly where every dollar goes. Numbers are your friend!',
    strengths: [
      'Excellent at identifying spending patterns',
      'Natural at optimizing expenses down to the penny',
      'Strong foundation for advanced financial planning',
      'Great at catching budget errors and inconsistencies'
    ],
    challenges: [
      'May get overwhelmed by too much detail',
      'Risk of analysis paralysis with spending decisions',
      'Might be too restrictive and forget to enjoy money'
    ],
    budgetingTips: [
      'Use zero-based budgeting with detailed categories',
      'Set up monthly budget analysis sessions',
      'Track weekly spending trends and patterns',
      'Build in a "fun money" category to prevent restriction fatigue'
    ],
    recommendedTools: [
      'Excel or Google Sheets with advanced formulas',
      'YNAB for detailed transaction categorization',
      'Personal Capital for investment tracking',
      'Tiller for spreadsheet-based budgeting'
    ],
    color: 'bg-blue-500'
  },
  {
    id: 'automated',
    name: 'The Automation Master',
    icon: Zap,
    description: 'You prefer simple, automated systems that work in the background. Set it up once and let technology handle the details!',
    strengths: [
      'Consistent saving through automation',
      'Low maintenance once systems are set up',
      'Excellent at preventing overspending',
      'Stress-free money management approach'
    ],
    challenges: [
      'May miss optimization opportunities',
      'Could become disconnected from spending habits',
      'Might not adjust quickly to life changes'
    ],
    budgetingTips: [
      'Set up automatic transfers for all savings goals',
      'Use the 50/30/20 rule with auto-allocations',
      'Automate bill payments to avoid late fees',
      'Schedule monthly 15-minute budget check-ins'
    ],
    recommendedTools: [
      'Bank auto-transfers and bill pay',
      'Mint for automated expense categorization',
      'Digit or Qapital for automatic saving',
      'Vanguard for automated investing'
    ],
    color: 'bg-purple-500'
  },
  {
    id: 'goal_oriented',
    name: 'The Goal Crusher',
    icon: Target,
    description: 'You\'re motivated by big financial goals and love seeing progress toward your dreams. The destination drives your decisions!',
    strengths: [
      'Strong motivation for consistent saving',
      'Excellent at prioritizing long-term benefits',
      'Natural ability to delay gratification',
      'Clear vision of financial future'
    ],
    challenges: [
      'May sacrifice too much current enjoyment',
      'Could ignore day-to-day budget details',
      'Risk of burnout from overly aggressive goals'
    ],
    budgetingTips: [
      'Create visual goal trackers and progress charts',
      'Break large goals into monthly milestones',
      'Celebrate progress wins along the way',
      'Balance future goals with present enjoyment'
    ],
    recommendedTools: [
      'Goal tracking apps like SmartyPig',
      'Visual progress tools like Personal Capital',
      'Separate savings accounts for each goal',
      'Investment calculators for long-term planning'
    ],
    color: 'bg-emerald-500'
  },
  {
    id: 'flexible',
    name: 'The Flexible Spender',
    icon: Heart,
    description: 'You value balance and flexibility. You want to be responsible with money while still enjoying life\'s pleasures and unexpected opportunities.',
    strengths: [
      'Adaptable to changing life circumstances',
      'Balanced approach to spending and saving',
      'Good at enjoying money without guilt',
      'Realistic about human behavior and mistakes'
    ],
    challenges: [
      'May lack consistent saving habits',
      'Could struggle with strict budgeting rules',
      'Might not optimize for maximum efficiency'
    ],
    budgetingTips: [
      'Use percentage-based budgeting for flexibility',
      'Build large buffer categories for spontaneous spending',
      'Focus on trends rather than daily tracking',
      'Create "opportunity funds" for unexpected chances'
    ],
    recommendedTools: [
      'Simple apps like YNAB or Mint',
      'High-yield savings for emergency flexibility',
      'Credit cards with good rewards (if disciplined)',
      'Investment apps with automatic rebalancing'
    ],
    color: 'bg-pink-500'
  }
];

export default function BudgetPersonalityAssessment() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityType | null>(null);

  // Record calculator usage on mount
  useEffect(() => {
    recordCalculatorUsage('budget-personality-assessment');
  }, [recordCalculatorUsage]);

  const handleAnswer = (questionId: number, optionValue: string, points: Record<string, number>) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionValue }));
    
    // Update scores
    setScores(prev => {
      const newScores = { ...prev };
      Object.entries(points).forEach(([trait, pointValue]) => {
        newScores[trait] = (newScores[trait] || 0) + pointValue;
      });
      return newScores;
    });

    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 500);
    } else {
      setTimeout(() => {
        determinePersonalityType();
        setShowResults(true);
        toast.success('Assessment complete! Here\'s your budgeting personality.', {
          duration: 3000,
          position: 'top-center',
        });
      }, 500);
    }
  };

  const determinePersonalityType = () => {
    // Calculate primary personality type based on scores
    const traitScores = {
      analytical: (scores.analytical || 0) + (scores.organized || 0),
      automated: (scores.automated || 0) + (scores.simple || 0),
      goal_oriented: (scores.goal_oriented || 0) + (scores.optimistic || 0),
      flexible: (scores.flexible || 0) + (scores.intuitive || 0)
    };

    const primaryType = Object.entries(traitScores).reduce((a, b) => 
      traitScores[a[0] as keyof typeof traitScores] > traitScores[b[0] as keyof typeof traitScores] ? a : b
    )[0];

    const personality = personalityTypes.find(p => p.id === primaryType);
    setSelectedPersonality(personality || personalityTypes[0]);
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setScores({});
    setShowResults(false);
    setSelectedPersonality(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults && selectedPersonality) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}
      >
        {/* Results Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${selectedPersonality.color} rounded-full mb-4`}>
            <selectedPersonality.icon className="w-8 h-8 text-white" />
          </div>
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
            You&apos;re {selectedPersonality.name}!
          </h3>
          <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
            {selectedPersonality.description}
          </p>
        </div>

        {/* Strengths */}
        <div className={`mb-6 p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
          <h4 className={`font-bold ${theme.status.success.text} mb-3 flex items-center gap-2`}>
            <Star className="w-5 h-5" />
            Your Budgeting Strengths
          </h4>
          <ul className="space-y-2">
            {selectedPersonality.strengths.map((strength, index) => (
              <li key={index} className={`flex items-start gap-2 ${theme.textColors.secondary}`}>
                <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mt-0.5 flex-shrink-0`} />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Challenges */}
        <div className={`mb-6 p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
          <h4 className={`font-bold ${theme.status.warning.text} mb-3 flex items-center gap-2`}>
            <Brain className="w-5 h-5" />
            Areas to Watch Out For
          </h4>
          <ul className="space-y-2">
            {selectedPersonality.challenges.map((challenge, index) => (
              <li key={index} className={`flex items-start gap-2 ${theme.textColors.secondary}`}>
                <div className={`w-2 h-2 ${selectedPersonality.color} rounded-full mt-2 flex-shrink-0`} />
                <span>{challenge}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Personalized Tips */}
        <div className={`mb-6 p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
          <h4 className={`font-bold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
            <Target className="w-5 h-5" />
            Your Personalized Budgeting Strategy
          </h4>
          <ul className="space-y-2">
            {selectedPersonality.budgetingTips.map((tip, index) => (
              <li key={index} className={`flex items-start gap-2 ${theme.textColors.secondary}`}>
                <ArrowRight className={`w-4 h-4 ${theme.status.info.text} mt-0.5 flex-shrink-0`} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Tools */}
        <div className={`mb-6 p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
          <h4 className={`font-bold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
            <Zap className="w-5 h-5" />
            Recommended Tools & Apps
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {selectedPersonality.recommendedTools.map((tool, index) => (
              <div key={index} className={`p-2 ${theme.backgrounds.cardHover} rounded border ${theme.borderColors.muted}`}>
                <span className={`text-sm ${theme.textColors.secondary}`}>{tool}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Plan */}
        <div className={`mb-6 p-4 ${selectedPersonality.color} bg-opacity-10 border border-current rounded-lg`}>
          <h4 className={`font-bold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
            <TrendingUp className="w-5 h-5" />
            Your 30-Day Action Plan
          </h4>
          <div className="space-y-3">
            <div className={`p-3 ${theme.backgrounds.card} rounded`}>
              <div className={`font-medium ${theme.textColors.primary} mb-1`}>Week 1-2: Foundation</div>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Set up your basic budgeting system using the tools and methods that match your personality type.
              </p>
            </div>
            <div className={`p-3 ${theme.backgrounds.card} rounded`}>
              <div className={`font-medium ${theme.textColors.primary} mb-1`}>Week 3: Optimization</div>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Track your spending patterns and adjust categories based on your actual behavior.
              </p>
            </div>
            <div className={`p-3 ${theme.backgrounds.card} rounded`}>
              <div className={`font-medium ${theme.textColors.primary} mb-1`}>Week 4: Mastery</div>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Implement automation and advanced strategies that align with your natural tendencies.
              </p>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetAssessment}
            className={`flex items-center gap-2 px-6 py-3 ${theme.buttons.ghost} rounded-lg mx-auto transition-all`}
          >
            <RefreshCw className="w-4 h-4" />
            Take Assessment Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
          <User className="w-6 h-6 text-blue-400" />
          Discover Your Budgeting Personality
        </h3>
        <p className={`${theme.textColors.secondary} text-sm mb-4`}>
          Answer 5 quick questions to discover your ideal budgeting approach and get personalized recommendations.
        </p>
        
        {/* Progress Bar */}
        <div className={`w-full bg-slate-700 rounded-full h-2 mb-4`}>
          <motion.div
            className="h-2 bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className={`text-center text-sm ${theme.textColors.muted}`}>
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      {/* Current Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              {questions[currentQuestion].question}
            </h4>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(questions[currentQuestion].id, option.value, option.points)}
                  aria-label={option.text}
                  className={`w-full p-4 text-left ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg transition-all hover:${theme.borderColors.accent} hover:scale-102 group`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 border-2 ${theme.borderColors.primary} rounded-full flex items-center justify-center group-hover:border-blue-400`}>
                      <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className={`${theme.textColors.primary} group-hover:text-blue-400 transition-colors`}>
                      {option.text}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Previous answers indicator */}
      {Object.keys(answers).length > 0 && (
        <div className="text-center">
          <p className={`text-sm ${theme.textColors.muted}`}>
            {Object.keys(answers).length} of {questions.length} questions answered
          </p>
        </div>
      )}
    </div>
  );
}
