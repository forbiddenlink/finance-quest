'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Shield,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Target,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    value: string;
    points: number;
  }[];
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'job_security',
    question: 'How would you describe your job security and income stability?',
    options: [
      { text: 'Very stable (government, tenured, established company)', value: 'very_stable', points: 1 },
      { text: 'Mostly stable (large company, union job, healthcare)', value: 'stable', points: 2 },
      { text: 'Somewhat stable (mid-size company, established industry)', value: 'somewhat_stable', points: 3 },
      { text: 'Variable (sales, commission, contract work)', value: 'variable', points: 4 },
      { text: 'Unpredictable (freelance, startup, gig economy)', value: 'unpredictable', points: 5 }
    ]
  },
  {
    id: 'dependents',
    question: 'How many people depend on your income?',
    options: [
      { text: 'Just me (single, no dependents)', value: 'single', points: 1 },
      { text: 'Me and one other (partner with income)', value: 'couple', points: 2 },
      { text: 'Small family (2-3 dependents, dual income)', value: 'small_family', points: 3 },
      { text: 'Large family (4+ dependents or single income)', value: 'large_family', points: 4 },
      { text: 'Extended family (caring for parents/relatives)', value: 'extended', points: 5 }
    ]
  },
  {
    id: 'health_situation',
    question: 'What is your health and insurance situation?',
    options: [
      { text: 'Excellent health, comprehensive insurance', value: 'excellent', points: 1 },
      { text: 'Good health, decent insurance coverage', value: 'good', points: 2 },
      { text: 'Average health, basic insurance', value: 'average', points: 3 },
      { text: 'Some health concerns, limited insurance', value: 'concerns', points: 4 },
      { text: 'Chronic conditions, poor/no insurance', value: 'poor', points: 5 }
    ]
  },
  {
    id: 'industry_risk',
    question: 'How recession-proof is your industry?',
    options: [
      { text: 'Very stable (healthcare, utilities, education)', value: 'recession_proof', points: 1 },
      { text: 'Mostly stable (government, food, basic services)', value: 'stable_industry', points: 2 },
      { text: 'Somewhat cyclical (finance, tech, manufacturing)', value: 'cyclical', points: 3 },
      { text: 'Highly cyclical (real estate, luxury goods)', value: 'highly_cyclical', points: 4 },
      { text: 'Very volatile (entertainment, travel, startups)', value: 'volatile', points: 5 }
    ]
  },
  {
    id: 'financial_stress',
    question: 'How do you typically handle financial stress?',
    options: [
      { text: 'I plan ahead and rarely feel financial stress', value: 'planner', points: 1 },
      { text: 'I worry sometimes but usually manage well', value: 'manager', points: 2 },
      { text: 'Moderate stress, I adapt to challenges', value: 'adapter', points: 3 },
      { text: 'High stress, financial problems affect my daily life', value: 'stressed', points: 4 },
      { text: 'Overwhelming stress, I avoid financial decisions', value: 'overwhelmed', points: 5 }
    ]
  },
  {
    id: 'emergency_experience',
    question: 'What is your experience with financial emergencies?',
    options: [
      { text: 'Never had a major financial emergency', value: 'none', points: 1 },
      { text: 'Minor emergencies, handled without debt', value: 'minor', points: 2 },
      { text: 'Moderate emergencies, some financial strain', value: 'moderate', points: 3 },
      { text: 'Major emergencies that required debt/borrowing', value: 'major', points: 4 },
      { text: 'Multiple emergencies, still recovering financially', value: 'multiple', points: 5 }
    ]
  }
];

interface EmergencyProfile {
  type: string;
  title: string;
  description: string;
  emergencyFundMonths: string;
  buildingStrategy: string;
  keyPriorities: string[];
  actionSteps: string[];
  warningNote: string;
}

const emergencyProfiles: { [key: string]: EmergencyProfile } = {
  conservative: {
    type: 'conservative',
    title: 'The Security Seeker',
    description: 'You value financial stability above all else. Your secure situation allows for a moderate emergency fund, but you prefer having extra cushion for peace of mind.',
    emergencyFundMonths: '4-6 months',
    buildingStrategy: 'Steady and consistent - automate $200-500/month until you reach your goal',
    keyPriorities: [
      'Focus on high-yield savings accounts (4-5% APY)',
      'Build your fund before aggressive investing',
      'Keep 1 month expenses in checking for immediate access'
    ],
    actionSteps: [
      'Open a dedicated high-yield savings account this week',
      'Set up automatic transfer of $300/month on payday',
      'Celebrate milestones: $1K, $5K, $10K, goal reached'
    ],
    warningNote: 'Don\'t over-save in low-yield accounts - your stable situation allows for some optimization'
  },
  balanced: {
    type: 'balanced',
    title: 'The Strategic Builder',
    description: 'You have moderate risk factors that require careful planning. Your approach balances security with growth, recognizing that emergencies can happen but shouldn\'t derail your financial progress.',
    emergencyFundMonths: '6-8 months',
    buildingStrategy: 'Aggressive initial building, then maintain and optimize for growth',
    keyPriorities: [
      'Build starter $1,000 fund first (month 1-2)',
      'Aggressive building phase: $400-600/month for 12-18 months',
      'Optimize placement for 4-5% growth while maintaining access'
    ],
    actionSteps: [
      'Calculate your exact monthly essential expenses',
      'Use tax refund or bonus to jumpstart your fund',
      'Review and adjust your target every 6 months'
    ],
    warningNote: 'Resist the urge to invest this money - emergency funds must be guaranteed and accessible'
  },
  aggressive: {
    type: 'aggressive',
    title: 'The Fortress Builder',
    description: 'Your high-risk situation demands a substantial emergency fund. Multiple risk factors mean emergencies are more likely and potentially more expensive. Your fund is your financial fortress.',
    emergencyFundMonths: '9-12 months',
    buildingStrategy: 'Emergency fund is your #1 financial priority - build before any other financial goals',
    keyPriorities: [
      'Maximum emergency fund size due to high risk factors',
      'Keep extra buffer for health/family emergency costs',
      'Consider laddered CDs for portion of fund (higher rates, still accessible)'
    ],
    actionSteps: [
      'Cut all non-essential spending until fund is built',
      'Pick up side work or freelance to accelerate building',
      'Keep detailed expense tracking to optimize fund size'
    ],
    warningNote: 'Do not invest or pay extra on debt until this fund is complete - it\'s your survival tool'
  }
};

interface EmergencyFundPersonalityAssessmentProps {
  onComplete?: (profile: EmergencyProfile) => void;
}

export default function EmergencyFundPersonalityAssessment({ onComplete }: EmergencyFundPersonalityAssessmentProps) {
  const { recordSimulationResult } = useProgressStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [totalScore, setTotalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [profile, setProfile] = useState<EmergencyProfile | null>(null);

  const handleAnswer = (option: AssessmentQuestion['options'][0]) => {
    try {
      const newAnswers = { ...answers, [assessmentQuestions[currentQuestion].id]: option.text };
      setAnswers(newAnswers);

      const newScore = totalScore + option.points;
      setTotalScore(newScore);

      // Progress to next question or calculate result
      if (currentQuestion < assessmentQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Calculate profile based on total score
        let profileType: string;
        if (newScore <= 12) {
          profileType = 'conservative';
        } else if (newScore <= 20) {
          profileType = 'balanced';
        } else {
          profileType = 'aggressive';
        }

        const personalityResult = emergencyProfiles[profileType];
        setProfile(personalityResult);
        setShowResult(true);

        // Record completion in progress store
        recordSimulationResult({
          scenarioId: 'emergency-fund-personality-assessment',
          totalScore: newScore,
          timeSpent: 0,
          correctAnswers: 1,
          totalQuestions: assessmentQuestions.length,
          financialOutcome: profileType === 'conservative' ? 4 : profileType === 'balanced' ? 6 : 9,
          grade: 'A',
          strengths: ['Emergency fund planning', 'Risk assessment'],
          improvements: [],
          completedAt: new Date()
        });

        toast.success(`Assessment complete! You're "${personalityResult.title}" 🛡️`, {
          duration: 4000,
          position: 'top-center',
        });

        if (onComplete) {
          onComplete(personalityResult);
        }
      }
    } catch (error) {
      console.error('Assessment error:', error);
      toast.error('Assessment error. Please try again.', {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTotalScore(0);
    setShowResult(false);
    setProfile(null);
  };

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  // Result display
  if (showResult && profile) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-8 max-w-4xl mx-auto`}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`w-20 h-20 mx-auto mb-4 ${theme.status.success.bg} rounded-full flex items-center justify-center`}
          >
            <Shield className={`w-10 h-10 ${theme.status.success.text}`} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}
          >
            {profile.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}
          >
            {profile.description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Emergency Fund Size */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center mb-4">
              <Target className={`w-6 h-6 text-blue-400 mr-3`} />
              <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>Recommended Fund Size</h3>
            </div>
            <p className={`text-3xl font-bold text-blue-400 mb-2`}>{profile.emergencyFundMonths}</p>
            <p className={`${theme.textColors.secondary}`}>of essential expenses</p>
          </motion.div>

          {/* Building Strategy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center mb-4">
              <TrendingUp className={`w-6 h-6 text-green-400 mr-3`} />
              <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>Building Strategy</h3>
            </div>
            <p className={`${theme.textColors.secondary} font-medium`}>{profile.buildingStrategy}</p>
          </motion.div>
        </div>

        {/* Key Priorities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6 mb-6`}
        >
          <div className="flex items-center mb-4">
            <CheckCircle className={`w-6 h-6 ${theme.status.success.text} mr-3`} />
            <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>Key Priorities</h3>
          </div>
          <div className="space-y-3">
            {profile.keyPriorities.map((priority, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-start"
              >
                <div className={`flex-shrink-0 w-6 h-6 ${theme.status.success.bg} rounded-full flex items-center justify-center mt-1 mr-3`}>
                  <CheckCircle className={`w-4 h-4 ${theme.status.success.text}`} />
                </div>
                <span className={`${theme.textColors.secondary} font-medium`}>{priority}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-6 mb-6`}
        >
          <div className="flex items-center mb-4">
            <Clock className={`w-6 h-6 ${theme.status.warning.text} mr-3`} />
            <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>Your Action Plan</h3>
          </div>
          <div className="space-y-3">
            {profile.actionSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="flex items-start"
              >
                <div className={`flex-shrink-0 w-8 h-8 ${theme.status.warning.bg} border-2 ${theme.status.warning.border} rounded-full flex items-center justify-center mt-1 mr-3`}>
                  <span className={`text-sm font-bold ${theme.status.warning.text}`}>{index + 1}</span>
                </div>
                <span className={`${theme.textColors.secondary} font-medium`}>{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Warning Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className={`${theme.status.error.bg} border ${theme.status.error.border} rounded-lg p-6 mb-8`}
        >
          <div className="flex items-center mb-3">
            <AlertTriangle className={`w-6 h-6 ${theme.status.error.text} mr-3`} />
            <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Important Note</h3>
          </div>
          <p className={`${theme.textColors.secondary} font-medium`}>{profile.warningNote}</p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetAssessment}
            className={`flex items-center justify-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} transition-all`}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Retake Assessment
          </button>

          <button
            onClick={() => {
              toast.success('Emergency fund plan saved! Use the Calculator tab to build your timeline.', {
                duration: 4000,
                position: 'top-center',
              });
            }}
            className={`flex items-center justify-center px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all shadow-lg hover-lift`}
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Build My Emergency Fund
          </button>
        </div>
      </motion.div>
    );
  }

  // Quiz interface
  const question = assessmentQuestions[currentQuestion];

  return (
    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-8 max-w-4xl mx-auto`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`w-16 h-16 mx-auto mb-4 ${theme.status.info.bg} rounded-full flex items-center justify-center animate-float`}>
          <Shield className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
          Emergency Fund Personality Assessment
        </h2>
        <p className={`${theme.textColors.secondary}`}>
          Discover your ideal emergency fund strategy based on your unique situation
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${theme.textColors.secondary}`}>
            Question {currentQuestion + 1} of {assessmentQuestions.length}
          </span>
          <span className={`text-sm font-medium text-blue-400`}>
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className={`w-full bg-slate-700 rounded-full h-2`}>
          <motion.div
            className={`h-2 bg-blue-400 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
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
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6 text-center`}>
            {question.question}
          </h3>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option)}
                aria-label={option.text}
                className={`w-full p-6 text-left ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg hover:${theme.borderColors.accent} hover:shadow-lg transition-all group`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${theme.textColors.primary} group-hover:text-blue-400 transition-colors`}>
                    {option.text}
                  </span>
                  <ArrowRight className={`w-5 h-5 ${theme.textColors.muted} group-hover:text-blue-400 group-hover:translate-x-1 transition-all`} />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className={`text-center text-sm ${theme.textColors.muted}`}>
        Assessment takes about 2-3 minutes to complete
      </div>
    </div>
  );
}
