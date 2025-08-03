'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Award,
  TrendingUp,
  DollarSign,
  PiggyBank
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EmergencyFundsQuizProps {
  onComplete?: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'sizing' | 'placement' | 'building' | 'protection' | 'psychology';
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

const enhancedQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the primary purpose of a $1,000 starter emergency fund?",
    options: [
      "To invest in the stock market for higher returns",
      "To cover 80% of small emergencies while building your full fund",
      "To pay off credit card debt faster",
      "To use for vacation savings"
    ],
    correctAnswer: 1,
    explanation: "A starter emergency fund prevents small crises from becoming debt disasters while you build your full emergency fund.",
    category: 'building',
    difficulty: 'basic'
  },
  {
    id: 2,
    question: "For someone with variable freelance income, what emergency fund size is recommended?",
    options: [
      "3 months of expenses",
      "6 months of expenses", 
      "10-12 months of expenses",
      "1 month of expenses"
    ],
    correctAnswer: 2,
    explanation: "Variable income requires larger emergency funds (10-12 months) to smooth out income fluctuations and provide stability during low-earning periods.",
    category: 'sizing',
    difficulty: 'intermediate'
  },
  {
    id: 3,
    question: "Where should you NOT keep your emergency fund?",
    options: [
      "High-yield savings account earning 4.5%",
      "FDIC-insured money market account",
      "Stock market index funds for growth",
      "Online bank with instant transfer capability"
    ],
    correctAnswer: 2,
    explanation: "Emergency funds should never be invested in stocks due to volatility risk. You need guaranteed access to the full amount when emergencies strike.",
    category: 'placement',
    difficulty: 'basic'
  },
  {
    id: 4,
    question: "What percentage of Americans cannot cover a $400 emergency without borrowing money?",
    options: [
      "20%",
      "30%",
      "40%",
      "50%"
    ],
    correctAnswer: 2,
    explanation: "40% of Americans can't cover a $400 emergency, highlighting the critical need for emergency funds to avoid debt cycles.",
    category: 'psychology',
    difficulty: 'basic'
  },
  {
    id: 5,
    question: "When calculating emergency fund size, which expenses should you include?",
    options: [
      "All current monthly expenses including entertainment and dining out",
      "Only housing, food, utilities, minimum debt payments, and insurance",
      "Just housing and food costs",
      "All expenses plus 20% buffer for inflation"
    ],
    correctAnswer: 1,
    explanation: "Emergency mode spending focuses on essential expenses only - housing, food, utilities, minimum debt payments, and insurance. Non-essentials are cut during crises.",
    category: 'sizing',
    difficulty: 'intermediate'
  },
  {
    id: 6,
    question: "Which scenario qualifies as a legitimate emergency fund use?",
    options: [
      "Black Friday sale on electronics you've wanted",
      "Friend's wedding gift and travel expenses",
      "Major car transmission repair needed for work commute",
      "Down payment opportunity on investment property"
    ],
    correctAnswer: 2,
    explanation: "True emergencies are unexpected, necessary, and urgent. Car repairs needed for work qualify - they're unplanned, essential for income, and time-sensitive.",
    category: 'protection',
    difficulty: 'intermediate'
  },
  {
    id: 7,
    question: "How much more income can people with emergency funds expect to earn over their lifetime?",
    options: [
      "5-10% more",
      "15-20% more", 
      "20%+ more",
      "No significant difference"
    ],
    correctAnswer: 2,
    explanation: "Emergency funds provide peace of mind and negotiating power, allowing better career decisions and smart risk-taking that leads to 20%+ higher lifetime earnings.",
    category: 'psychology',
    difficulty: 'advanced'
  },
  {
    id: 8,
    question: "What's the optimal automation strategy for building an emergency fund?",
    options: [
      "Transfer money only when you remember each month",
      "Save whatever is left over at month-end",
      "Automate transfers on payday before spending temptation hits",
      "Only save windfall money like tax refunds"
    ],
    correctAnswer: 2,
    explanation: "Automation on payday follows the 'pay yourself first' principle, ensuring consistent progress before spending decisions can interfere with saving goals.",
    category: 'building',
    difficulty: 'intermediate'
  },
  {
    id: 9,
    question: "For a dual-income household where both partners work in stable tech jobs, what emergency fund size is appropriate?",
    options: [
      "1-2 months expenses (very low risk)",
      "3-4 months expenses (stable employment)",
      "6-8 months expenses (moderate risk)",
      "10-12 months expenses (high risk)"
    ],
    correctAnswer: 1,
    explanation: "Stable tech employment with dual incomes provides high job security and income diversification, requiring only 3-4 months of essential expenses for adequate protection.",
    category: 'sizing',
    difficulty: 'advanced'
  },
  {
    id: 10,
    question: "What's the annual earning difference between a traditional savings account (0.01%) and high-yield savings (4.5%) on a $15,000 emergency fund?",
    options: [
      "$150",
      "$450",
      "$673",
      "$900"
    ],
    correctAnswer: 2,
    explanation: "Traditional savings: $15,000 × 0.01% = $1.50/year. High-yield savings: $15,000 × 4.5% = $675/year. Difference: $673 in free money annually.",
    category: 'placement',
    difficulty: 'advanced'
  }
];

export default function EmergencyFundsQuizEnhanced({ onComplete }: EmergencyFundsQuizProps) {
  const { recordQuizScore } = useProgressStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(enhancedQuizQuestions.length).fill(null));
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const question = enhancedQuizQuestions[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    setShowExplanation(false);
    setSelectedAnswer(userAnswers[currentQuestion + 1] || null);
    
    if (currentQuestion < enhancedQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const handlePrevious = () => {
    setShowExplanation(false);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(userAnswers[currentQuestion - 1]);
    }
  };

  const completeQuiz = () => {
    const correctAnswers = userAnswers.reduce((count: number, answer, index) => {
      return answer === enhancedQuizQuestions[index].correctAnswer ? count + 1 : count;
    }, 0);

    const finalScore = Math.round((correctAnswers / enhancedQuizQuestions.length) * 100);
    setScore(finalScore);
    setQuizCompleted(true);

    // Calculate category scores for detailed feedback
    const categories = {
      sizing: { correct: 0, total: 0 },
      placement: { correct: 0, total: 0 },
      building: { correct: 0, total: 0 },
      protection: { correct: 0, total: 0 },
      psychology: { correct: 0, total: 0 }
    };

    enhancedQuizQuestions.forEach((q, index) => {
      categories[q.category].total += 1;
      if (userAnswers[index] === q.correctAnswer) {
        categories[q.category].correct += 1;
      }
    });

    // Record detailed progress with category breakdown
    recordQuizScore('emergency-funds-enhanced-quiz', finalScore, enhancedQuizQuestions.length);

    // Show appropriate feedback
    if (finalScore >= 80) {
      toast.success(`Outstanding! ${finalScore}% - Emergency Fund Mastery Achieved! 🛡️`, {
        duration: 4000,
        position: 'top-center',
      });
      onComplete?.();
    } else {
      toast.error(`${finalScore}% - Review the lessons and retake for chapter advancement`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sizing': return Target;
      case 'placement': return TrendingUp;
      case 'building': return PiggyBank;
      case 'protection': return Shield;
      case 'psychology': return AlertCircle;
      default: return DollarSign;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'sizing': return 'Fund Sizing';
      case 'placement': return 'Optimal Placement';
      case 'building': return 'Building Strategy';
      case 'protection': return 'Fund Protection';
      case 'psychology': return 'Financial Psychology';
      default: return 'General';
    }
  };

  if (quizCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <GradientCard variant="glass" gradient="red" className="p-8 text-center">
          <div className={`w-24 h-24 ${score >= 80 ? theme.status.success.bg : theme.status.error.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {score >= 80 ? (
              <Award className={`w-12 h-12 ${theme.status.success.text}`} />
            ) : (
              <AlertCircle className={`w-12 h-12 ${theme.status.error.text}`} />
            )}
          </div>

          <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
            Quiz Results: {score}%
          </h2>

          <p className={`text-lg ${theme.textColors.secondary} mb-8`}>
            {score >= 80 
              ? "🎉 Excellent! You've mastered emergency fund fundamentals and earned chapter advancement!"
              : "📚 Good effort! Review the lesson materials and retake the quiz to advance to the next chapter."
            }
          </p>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Object.entries({
              sizing: { correct: 0, total: 0 },
              placement: { correct: 0, total: 0 },
              building: { correct: 0, total: 0 },
              protection: { correct: 0, total: 0 },
              psychology: { correct: 0, total: 0 }
            }).map(([category, stats]) => {
              // Calculate actual stats
              const actualStats = enhancedQuizQuestions.reduce((acc, q, index) => {
                if (q.category === category) {
                  acc.total += 1;
                  if (userAnswers[index] === q.correctAnswer) {
                    acc.correct += 1;
                  }
                }
                return acc;
              }, { correct: 0, total: 0 });

              const categoryScore = actualStats.total > 0 ? Math.round((actualStats.correct / actualStats.total) * 100) : 0;
              const Icon = getCategoryIcon(category);

              return (
                <div key={category} className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center mb-2">
                    <Icon className={`w-5 h-5 ${theme.textColors.primary} mr-2`} />
                    <span className={`font-medium ${theme.textColors.primary}`}>
                      {getCategoryTitle(category)}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${categoryScore >= 80 ? theme.status.success.text : theme.status.error.text}`}>
                    {categoryScore}%
                  </div>
                  <div className={`text-sm ${theme.textColors.muted}`}>
                    {actualStats.correct}/{actualStats.total} correct
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setQuizCompleted(false);
                setCurrentQuestion(0);
                setSelectedAnswer(null);
                setUserAnswers(new Array(enhancedQuizQuestions.length).fill(null));
                setShowExplanation(false);
                setScore(0);
              }}
              className={`w-full px-6 py-3 ${theme.buttons.secondary} rounded-xl transition-all hover-lift`}
            >
              Retake Quiz
            </button>
            
            {score >= 80 && (
              <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
                <p className={`font-bold ${theme.status.success.text} text-center`}>
                  🎯 Chapter 4 Complete! Proceed to Chapter 5: Income & Career Growth
                </p>
              </div>
            )}
          </div>
        </GradientCard>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <GradientCard variant="glass" gradient="red" className="p-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-medium ${theme.textColors.secondary}`}>
              Question {currentQuestion + 1} of {enhancedQuizQuestions.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${theme.textColors.muted}`}>
                {question.category} • {question.difficulty}
              </span>
            </div>
          </div>
          
          <div className={`w-full bg-slate-800/50 rounded-full h-2`}>
            <div
              className={`h-2 ${theme.status.error.bg} rounded-full transition-all duration-300`}
              style={{ width: `${((currentQuestion + 1) / enhancedQuizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="flex items-start mb-6">
            <div className={`flex-shrink-0 w-8 h-8 ${theme.status.error.bg} rounded-full flex items-center justify-center mr-4 mt-1`}>
              <span className={`font-bold ${theme.status.error.text}`}>
                {currentQuestion + 1}
              </span>
            </div>
            <h2 className={`text-xl font-semibold ${theme.textColors.primary} leading-relaxed`}>
              {question.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showResult = showExplanation;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    showResult
                      ? isCorrect
                        ? `${theme.status.success.bg} ${theme.status.success.border} ${theme.status.success.text}`
                        : isSelected
                        ? `${theme.status.error.bg} ${theme.status.error.border} ${theme.status.error.text}`
                        : `${theme.backgrounds.card} ${theme.borderColors.muted} ${theme.textColors.secondary}`
                      : isSelected
                      ? `${theme.status.info.bg} ${theme.status.info.border} ${theme.status.info.text}`
                      : `${theme.backgrounds.card} ${theme.borderColors.muted} ${theme.textColors.secondary} hover:${theme.borderColors.primary} hover:${theme.textColors.primary}`
                  }`}
                >
                  <div className="flex items-center">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium">{option}</span>
                    {showResult && isCorrect && (
                      <CheckCircle className="w-5 h-5 ml-auto flex-shrink-0" />
                    )}
                    {showResult && !isCorrect && isSelected && (
                      <XCircle className="w-5 h-5 ml-auto flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg mb-6`}
            >
              <h3 className={`font-semibold ${theme.status.info.text} mb-2 flex items-center gap-2`}>
                <AlertCircle className="w-5 h-5" />
                Explanation
              </h3>
              <p className={`${theme.textColors.secondary} leading-relaxed`}>
                {question.explanation}
              </p>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {!showExplanation && selectedAnswer !== null && (
              <button
                onClick={() => setShowExplanation(true)}
                className={`px-6 py-3 ${theme.buttons.secondary} rounded-xl transition-all hover-lift`}
              >
                Show Answer
              </button>
            )}
            
            {showExplanation && (
              <button
                onClick={handleNext}
                className={`px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift`}
              >
                {currentQuestion === enhancedQuizQuestions.length - 1 ? 'Complete Quiz' : 'Next Question'}
              </button>
            )}
          </div>
        </div>

        {/* Quiz Progress Summary */}
        <div className={`mt-6 pt-6 border-t ${theme.borderColors.primary} text-center`}>
          <div className={`text-sm ${theme.textColors.muted}`}>
            Answered: {userAnswers.filter(answer => answer !== null).length} of {enhancedQuizQuestions.length} questions
          </div>
        </div>
      </GradientCard>
    </div>
  );
}
