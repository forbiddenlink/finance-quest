'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  TrendingUp,
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Rocket,
  Shield,
  Zap
} from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    personality: 'climber' | 'entrepreneur' | 'specialist';
  }[];
}

interface PersonalityProfile {
  type: 'climber' | 'entrepreneur' | 'specialist';
  title: string;
  description: string;
  strengths: string[];
  careerAdvice: string[];
  incomeStrategy: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const questions: Question[] = [
  {
    id: 'work_motivation',
    question: 'What motivates you most in your career?',
    options: [
      { value: 'advancement', label: 'Climbing the corporate ladder and gaining authority', personality: 'climber' },
      { value: 'independence', label: 'Creating something new and being my own boss', personality: 'entrepreneur' },
      { value: 'mastery', label: 'Becoming the absolute best at what I do', personality: 'specialist' }
    ]
  },
  {
    id: 'risk_tolerance',
    question: 'How do you feel about career risk?',
    options: [
      { value: 'calculated', label: 'Take strategic risks that advance my position', personality: 'climber' },
      { value: 'embrace', label: 'Embrace high risk for high reward opportunities', personality: 'entrepreneur' },
      { value: 'minimize', label: 'Prefer stability and steady, predictable growth', personality: 'specialist' }
    ]
  },
  {
    id: 'income_preference',
    question: 'What\'s your ideal income structure?',
    options: [
      { value: 'salary_growth', label: 'Steady salary with regular increases and bonuses', personality: 'climber' },
      { value: 'unlimited', label: 'Unlimited earning potential, even if unpredictable', personality: 'entrepreneur' },
      { value: 'premium_stable', label: 'Premium rates for specialized expertise', personality: 'specialist' }
    ]
  },
  {
    id: 'work_environment',
    question: 'What work environment energizes you?',
    options: [
      { value: 'corporate', label: 'Large organizations with clear hierarchies', personality: 'climber' },
      { value: 'startup', label: 'Fast-paced startups or my own company', personality: 'entrepreneur' },
      { value: 'focused', label: 'Focused environments where I can deep dive', personality: 'specialist' }
    ]
  },
  {
    id: 'success_measure',
    question: 'How do you measure career success?',
    options: [
      { value: 'title_power', label: 'Job title, team size, and organizational influence', personality: 'climber' },
      { value: 'freedom_impact', label: 'Freedom to make decisions and create impact', personality: 'entrepreneur' },
      { value: 'expertise_recognition', label: 'Recognition as a top expert in my field', personality: 'specialist' }
    ]
  },
  {
    id: 'learning_style',
    question: 'How do you prefer to develop your career?',
    options: [
      { value: 'network_politics', label: 'Building networks and understanding office politics', personality: 'climber' },
      { value: 'experiment_fail', label: 'Experimenting, failing fast, and pivoting quickly', personality: 'entrepreneur' },
      { value: 'deep_mastery', label: 'Deep study and mastering complex skills', personality: 'specialist' }
    ]
  }
];

const personalityProfiles: Record<string, PersonalityProfile> = {
  climber: {
    type: 'climber',
    title: 'The Corporate Climber',
    description: 'You thrive in structured environments and excel at navigating organizational hierarchies. Your strength lies in building strategic relationships and advancing through traditional career paths.',
    strengths: [
      'Political savvy and relationship building',
      'Strategic thinking and planning',
      'Leadership and team management',
      'Understanding organizational dynamics'
    ],
    careerAdvice: [
      'Focus on companies with clear advancement tracks',
      'Build relationships with decision makers and mentors',
      'Seek high-visibility projects and leadership roles',
      'Develop both technical and soft skills for management',
      'Consider MBA or executive education programs'
    ],
    incomeStrategy: 'Negotiate promotions every 18-24 months, target roles with budget responsibility, and build a track record of measurable business impact.',
    icon: TrendingUp,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  entrepreneur: {
    type: 'entrepreneur',
    title: 'The Entrepreneurial Spirit',
    description: 'You\'re driven by independence and unlimited potential. You see opportunities where others see problems and aren\'t afraid to chart your own course.',
    strengths: [
      'Innovation and creative problem solving',
      'Risk tolerance and adaptability',
      'Self-motivation and drive',
      'Opportunity recognition and execution'
    ],
    careerAdvice: [
      'Start side hustles while employed to test ideas',
      'Network with other entrepreneurs and investors',
      'Develop sales and marketing skills',
      'Learn to manage cash flow and business finances',
      'Consider startups or consulting before going solo'
    ],
    incomeStrategy: 'Build multiple income streams, focus on scalable businesses, and reinvest profits for exponential growth rather than lifestyle inflation.',
    icon: Rocket,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10'
  },
  specialist: {
    type: 'specialist',
    title: 'The Expert Specialist',
    description: 'You find deep satisfaction in mastering your craft and being recognized as a go-to expert. You prefer depth over breadth and quality over quantity.',
    strengths: [
      'Deep technical expertise and knowledge',
      'Quality focus and attention to detail',
      'Continuous learning and improvement',
      'Problem-solving for complex challenges'
    ],
    careerAdvice: [
      'Become the #1 expert in a high-value niche',
      'Build your reputation through content and speaking',
      'Seek roles where expertise directly drives value',
      'Consider consulting or freelancing for premium rates',
      'Stay current with industry trends and innovations'
    ],
    incomeStrategy: 'Command premium rates as a recognized expert, consider consulting or fractional roles, and leverage expertise for passive income through courses or products.',
    icon: Star,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10'
  }
};

interface CareerPersonalityAssessmentProps {
  onComplete?: (profile: PersonalityProfile) => void;
}

export default function CareerPersonalityAssessment({ onComplete }: CareerPersonalityAssessmentProps) {
  const { recordCalculatorUsage } = useProgressStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<PersonalityProfile | null>(null);

  // Record usage for analytics
  useState(() => {
    recordCalculatorUsage('career-personality-assessment');
  });

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // Calculate personality type
      setTimeout(() => {
        calculatePersonality(newAnswers);
      }, 300);
    }
  };

  const calculatePersonality = (finalAnswers: Record<string, string>) => {
    const scores = { climber: 0, entrepreneur: 0, specialist: 0 };

    questions.forEach(question => {
      const answer = finalAnswers[question.id];
      const option = question.options.find(opt => opt.value === answer);
      if (option) {
        scores[option.personality]++;
      }
    });

    // Find the highest scoring personality
    const topPersonality = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0] as keyof typeof personalityProfiles;

    const profile = personalityProfiles[topPersonality];
    setResults(profile);
    setIsComplete(true);
    onComplete?.(profile);
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
    setResults(null);
  };

  if (isComplete && results) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-6 ${results.bgColor} border-2 border-opacity-20 rounded-xl`}
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`inline-flex items-center justify-center w-16 h-16 ${results.bgColor} rounded-full mb-4`}
          >
            <results.icon className={`w-8 h-8 ${results.color}`} />
          </motion.div>
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
            {results.title}
          </h3>
          <p className={`${theme.textColors.secondary} text-lg`}>
            {results.description}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
              <Shield className="w-5 h-5" />
              Your Strengths
            </h4>
            <ul className="space-y-2">
              {results.strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`flex items-center gap-2 ${theme.textColors.secondary}`}
                >
                  <CheckCircle className={`w-4 h-4 ${results.color} flex-shrink-0`} />
                  {strength}
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Career Strategy
            </h4>
            <ul className="space-y-2">
              {results.careerAdvice.map((advice, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`flex items-start gap-2 ${theme.textColors.secondary}`}
                >
                  <ArrowRight className={`w-4 h-4 ${results.color} flex-shrink-0 mt-0.5`} />
                  {advice}
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}
          >
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
              <Zap className="w-5 h-5" />
              Income Optimization Strategy
            </h4>
            <p className={`${theme.textColors.secondary}`}>
              {results.incomeStrategy}
            </p>
          </motion.div>
        </div>

        <div className="flex justify-center mt-6">
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
    <div className={`p-6 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>
            Career Personality Assessment
          </h3>
          <span className={`text-sm ${theme.textColors.secondary}`}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2">
          <motion.div
            className={`h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-6`}>
            {questions[currentQuestion].question}
          </h4>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(questions[currentQuestion].id, option.value)}
                className={`w-full p-4 text-left ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg hover:${theme.borderColors.focus} hover:shadow-lg transition-all group`}
              >
                <div className="flex items-center justify-between">
                  <span className={`${theme.textColors.primary} font-medium group-hover:text-blue-400`}>
                    {option.label}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${theme.textColors.secondary} group-hover:text-blue-400 group-hover:translate-x-1 transition-all`} />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className={`mt-6 p-4 bg-slate-800/50 rounded-lg`}>
        <p className={`text-sm ${theme.textColors.secondary} text-center`}>
          💡 This assessment helps identify your natural career advancement style to optimize your income growth strategy.
        </p>
      </div>
    </div>
  );
}
