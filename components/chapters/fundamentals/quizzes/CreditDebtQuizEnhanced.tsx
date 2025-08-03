'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Award,
  TrendingUp,
  DollarSign,
  Brain,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CreditDebtQuizProps {
  onComplete?: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'credit-scores' | 'credit-building' | 'utilization' | 'debt-elimination' | 'debt-types';
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

const enhancedQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the most important factor in your credit score calculation?",
    options: [
      "Credit utilization ratio (30%)",
      "Payment history (35%)",
      "Length of credit history (15%)",
      "Types of credit accounts (10%)"
    ],
    correctAnswer: 1,
    explanation: "Payment history accounts for 35% of your credit score and is the most important factor. Never missing payments is crucial for excellent credit.",
    category: 'credit-scores',
    difficulty: 'basic'
  },
  {
    id: 2,
    question: "For maximum credit score benefit, what should your total credit utilization be?",
    options: [
      "Under 30%",
      "Under 10%", 
      "1-9%",
      "Exactly 0%"
    ],
    correctAnswer: 2,
    explanation: "While under 30% is acceptable, 1-9% utilization provides maximum credit score benefit. 0% utilization can sometimes be viewed as inactive credit use.",
    category: 'utilization',
    difficulty: 'advanced'
  },
  {
    id: 3,
    question: "How much more does poor credit (620 score) cost vs excellent credit (760 score) on a $400,000 mortgage?",
    options: [
      "$50,000 more in interest",
      "$100,000 more in interest",
      "$200,000+ more in interest",
      "$500,000 more in interest"
    ],
    correctAnswer: 2,
    explanation: "Poor credit can cost $200,000+ more in interest over 30 years due to higher interest rates. This demonstrates why credit building is crucial for wealth.",
    category: 'credit-scores',
    difficulty: 'intermediate'
  },
  {
    id: 4,
    question: "When building credit from scratch, what is the typical timeline to reach 740+ score?",
    options: [
      "6-12 months",
      "12-18 months",
      "18-24 months",
      "3-5 years"
    ],
    correctAnswer: 2,
    explanation: "Building excellent credit (740+) typically takes 18-24 months with consistent good habits: perfect payments, low utilization, and strategic account management.",
    category: 'credit-building',
    difficulty: 'intermediate'
  },
  {
    id: 5,
    question: "Which debt elimination strategy saves the most money mathematically?",
    options: [
      "Debt Snowball (smallest balances first)",
      "Debt Avalanche (highest interest rates first)",
      "Equal payments to all debts",
      "Focus on newest debts first"
    ],
    correctAnswer: 1,
    explanation: "Debt Avalanche targets highest interest rates first, saving the most money mathematically. However, Debt Snowball may be better for motivation and consistency.",
    category: 'debt-elimination',
    difficulty: 'basic'
  },
  {
    id: 6,
    question: "Which of these is considered 'good debt'?",
    options: [
      "Credit card debt for vacation travel",
      "Car loan for luxury vehicle",
      "Mortgage for primary residence",
      "Personal loan for home entertainment system"
    ],
    correctAnswer: 2,
    explanation: "Mortgages are good debt because they typically have low interest rates, tax benefits, and finance appreciating assets that build equity over time.",
    category: 'debt-types',
    difficulty: 'basic'
  },
  {
    id: 7,
    question: "What should you do if you need to exceed 30% utilization temporarily?",
    options: [
      "Don't worry about it - utilization doesn't matter",
      "Close the credit card to avoid temptation",
      "Pay down the balance before the statement date",
      "Apply for a new credit card immediately"
    ],
    correctAnswer: 2,
    explanation: "Pay down balances before the statement closing date to report lower utilization. Credit cards report your balance on the statement date, not when you pay it off.",
    category: 'utilization',
    difficulty: 'advanced'
  },
  {
    id: 8,
    question: "What credit score range qualifies as 'excellent' credit?",
    options: [
      "650-700",
      "700-740",
      "740-800",
      "800-850"
    ],
    correctAnswer: 2,
    explanation: "740-800 is considered excellent credit, though 800+ is often called 'exceptional.' Excellent credit unlocks the best rates and premium financial products.",
    category: 'credit-scores',
    difficulty: 'basic'
  },
  {
    id: 9,
    question: "How often should you request credit limit increases to optimize your credit profile?",
    options: [
      "Every 3 months",
      "Every 6 months",
      "Once per year",
      "Only when you need more credit"
    ],
    correctAnswer: 1,
    explanation: "Requesting increases every 6 months helps improve your utilization ratio and shows responsible credit management. Most issuers allow this frequency.",
    category: 'credit-building',
    difficulty: 'intermediate'
  },
  {
    id: 10,
    question: "What is the main risk of closing old credit card accounts?",
    options: [
      "You lose access to emergency credit",
      "It reduces your average account age",
      "It increases your utilization ratio",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "Closing old accounts affects multiple credit factors: reduces available credit (higher utilization), decreases average account age, and eliminates emergency credit access.",
    category: 'credit-building',
    difficulty: 'advanced'
  }
];

export default function CreditDebtQuizEnhanced({ onComplete }: CreditDebtQuizProps) {
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
      'credit-scores': { correct: 0, total: 0 },
      'credit-building': { correct: 0, total: 0 },
      'utilization': { correct: 0, total: 0 },
      'debt-elimination': { correct: 0, total: 0 },
      'debt-types': { correct: 0, total: 0 }
    };

    enhancedQuizQuestions.forEach((q, index) => {
      categories[q.category].total += 1;
      if (userAnswers[index] === q.correctAnswer) {
        categories[q.category].correct += 1;
      }
    });

    // Record detailed progress with category breakdown
    recordQuizScore('credit-debt-enhanced-quiz', finalScore, enhancedQuizQuestions.length);

    // Show appropriate feedback
    if (finalScore >= 80) {
      toast.success(`Outstanding! ${finalScore}% - Credit & Debt Mastery Achieved! 💳`, {
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
      case 'credit-scores': return Target;
      case 'credit-building': return TrendingUp;
      case 'utilization': return Shield;
      case 'debt-elimination': return Brain;
      case 'debt-types': return CreditCard;
      default: return DollarSign;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'credit-scores': return 'Credit Scores';
      case 'credit-building': return 'Credit Building';
      case 'utilization': return 'Utilization Management';
      case 'debt-elimination': return 'Debt Elimination';
      case 'debt-types': return 'Debt Types';
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
        <GradientCard variant="glass" gradient="blue" className="p-8 text-center">
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
              ? "🎉 Excellent! You've mastered credit and debt fundamentals and earned chapter advancement!"
              : "📚 Good effort! Review the lesson materials and retake the quiz to advance to the next chapter."
            }
          </p>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Object.entries({
              'credit-scores': { correct: 0, total: 0 },
              'credit-building': { correct: 0, total: 0 },
              'utilization': { correct: 0, total: 0 },
              'debt-elimination': { correct: 0, total: 0 },
              'debt-types': { correct: 0, total: 0 }
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
                  🎯 Foundation Tier Complete! Proceed to Chapter 7: Investment Fundamentals
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
      <GradientCard variant="glass" gradient="blue" className="p-8">
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
              className={`h-2 ${theme.status.info.bg} rounded-full transition-all duration-300`}
              style={{ width: `${((currentQuestion + 1) / enhancedQuizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="flex items-start mb-6">
            <div className={`flex-shrink-0 w-8 h-8 ${theme.status.info.bg} rounded-full flex items-center justify-center mr-4 mt-1`}>
              <span className={`font-bold ${theme.status.info.text}`}>
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
