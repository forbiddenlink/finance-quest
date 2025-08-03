'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import {
  PiggyBank,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Award,
  Calculator,
  DollarSign,
  Shield,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RetirementPlanningQuizProps {
  onComplete?: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'accounts' | 'withdrawal' | 'calculation' | 'strategies' | 'tax-planning';
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

const enhancedQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the maximum 401(k) contribution limit for 2024?",
    options: [
      "$20,500",
      "$22,500", 
      "$23,000",
      "$25,000"
    ],
    correctAnswer: 2,
    explanation: "For 2024, the 401(k) contribution limit is $23,000, with an additional $7,500 catch-up contribution allowed for those 50 and older.",
    category: 'accounts',
    difficulty: 'basic'
  },
  {
    id: 2,
    question: "According to the 4% rule, if you need $60,000 annually in retirement, how much should you save?",
    options: [
      "$1.2 million",
      "$1.5 million",
      "$1.8 million", 
      "$2.1 million"
    ],
    correctAnswer: 1,
    explanation: "The 4% rule suggests you need 25 times your annual expenses: $60,000 × 25 = $1.5 million to safely withdraw $60,000 annually.",
    category: 'calculation',
    difficulty: 'basic'
  },
  {
    id: 3,
    question: "What percentage of pre-retirement income does Social Security typically replace?",
    options: [
      "20%",
      "40%",
      "60%",
      "80%"
    ],
    correctAnswer: 1,
    explanation: "Social Security replaces approximately 40% of pre-retirement income for average earners, highlighting the need for additional retirement savings.",
    category: 'calculation',
    difficulty: 'basic'
  },
  {
    id: 4,
    question: "When is a Roth conversion most advantageous?",
    options: [
      "When you're in the highest tax bracket",
      "When you expect to be in a lower tax bracket in retirement",
      "When you're in a temporarily low tax bracket",
      "Never—it's always better to keep traditional accounts"
    ],
    correctAnswer: 2,
    explanation: "Roth conversions are most beneficial during low-income years when you can convert at lower tax rates than you expect to pay in retirement.",
    category: 'tax-planning',
    difficulty: 'intermediate'
  },
  {
    id: 5,
    question: "What is the 'mega backdoor Roth' strategy?",
    options: [
      "Contributing to multiple Roth IRAs",
      "Converting large traditional IRA balances to Roth",
      "Using after-tax 401(k) contributions and immediate Roth conversion",
      "Maxing out both 401(k) and IRA contributions"
    ],
    correctAnswer: 2,
    explanation: "The mega backdoor Roth involves making after-tax contributions to your 401(k) beyond the normal limit, then immediately converting to Roth, allowing up to $70,000+ in annual Roth contributions.",
    category: 'strategies',
    difficulty: 'advanced'
  },
  {
    id: 6,
    question: "What is sequence of returns risk?",
    options: [
      "The risk that market returns will be lower than expected",
      "The risk of poor market performance early in retirement",
      "The risk that inflation will erode purchasing power",
      "The risk of outliving your money"
    ],
    correctAnswer: 1,
    explanation: "Sequence of returns risk is the danger that poor market performance in the early years of retirement can devastate portfolio longevity, even if long-term average returns are good.",
    category: 'withdrawal',
    difficulty: 'intermediate'
  },
  {
    id: 7,
    question: "Where should you prioritize holding bonds and REITs for tax efficiency?",
    options: [
      "Taxable investment accounts",
      "Roth IRA accounts",
      "Tax-advantaged accounts (401k/traditional IRA)",
      "It doesn't matter where you hold them"
    ],
    correctAnswer: 2,
    explanation: "Bonds and REITs are tax-inefficient (generate regular taxable income) so they belong in tax-advantaged accounts where that income isn't currently taxable.",
    category: 'strategies',
    difficulty: 'intermediate'
  },
  {
    id: 8,
    question: "A 30-year-old earning $100,000 with $10,000 saved needs $1.5M by 65. How much should they invest monthly?",
    options: [
      "$800/month",
      "$1,100/month",
      "$1,400/month",
      "$1,700/month"
    ],
    correctAnswer: 1,
    explanation: "Using 7% annual returns, they need approximately $1,100/month for 35 years to reach $1.5M, demonstrating the power of starting early and consistent investing.",
    category: 'calculation',
    difficulty: 'advanced'
  },
  {
    id: 9,
    question: "What is the main advantage of a 'bucket strategy' for retirement withdrawals?",
    options: [
      "It guarantees you'll never lose money",
      "It maximizes returns by concentrating in stocks",
      "It reduces sequence risk by segregating assets by time horizon",
      "It eliminates the need for asset allocation"
    ],
    correctAnswer: 2,
    explanation: "The bucket strategy reduces sequence risk by keeping cash for immediate needs, bonds for medium-term, and stocks for long-term growth, reducing the need to sell stocks during market downturns.",
    category: 'withdrawal',
    difficulty: 'advanced'
  },
  {
    id: 10,
    question: "Why might the traditional 4% rule be too aggressive for modern retirees?",
    options: [
      "Stock markets have become more volatile",
      "Life expectancy has increased significantly",
      "Current bond yields are historically low",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "Modern research suggests 3.5% may be safer due to increased longevity (longer retirement periods), lower expected bond returns, and potential for higher market volatility.",
    category: 'withdrawal',
    difficulty: 'advanced'
  }
];

export default function RetirementPlanningQuizEnhanced({ onComplete }: RetirementPlanningQuizProps) {
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
      'accounts': { correct: 0, total: 0 },
      'withdrawal': { correct: 0, total: 0 },
      'calculation': { correct: 0, total: 0 },
      'strategies': { correct: 0, total: 0 },
      'tax-planning': { correct: 0, total: 0 }
    };

    enhancedQuizQuestions.forEach((q, index) => {
      categories[q.category].total += 1;
      if (userAnswers[index] === q.correctAnswer) {
        categories[q.category].correct += 1;
      }
    });

    // Record detailed progress with category breakdown
    recordQuizScore('retirement-planning-enhanced-quiz', finalScore, enhancedQuizQuestions.length);

    // Show appropriate feedback
    if (finalScore >= 80) {
      toast.success(`Outstanding! ${finalScore}% - Retirement Planning Mastered! 🏆`, {
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
      case 'accounts': return Shield;
      case 'withdrawal': return TrendingUp;
      case 'calculation': return Calculator;
      case 'strategies': return Target;
      case 'tax-planning': return PiggyBank;
      default: return DollarSign;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'accounts': return 'Retirement Accounts';
      case 'withdrawal': return 'Withdrawal Strategies';
      case 'calculation': return 'Retirement Calculations';
      case 'strategies': return 'Advanced Strategies';
      case 'tax-planning': return 'Tax Planning';
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
        <GradientCard variant="glass" gradient="green" className="p-8 text-center">
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
              ? "🎉 Excellent! You've mastered retirement planning and earned chapter advancement!"
              : "📚 Good effort! Review the lesson materials and retake the quiz to advance to the next chapter."
            }
          </p>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Object.entries({
              'accounts': { correct: 0, total: 0 },
              'withdrawal': { correct: 0, total: 0 },
              'calculation': { correct: 0, total: 0 },
              'strategies': { correct: 0, total: 0 },
              'tax-planning': { correct: 0, total: 0 }
            }).map(([category]) => {
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
                  🎯 Chapter 9 Complete! Proceed to Chapter 10: Advanced Tax Strategies
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
      <GradientCard variant="glass" gradient="green" className="p-8">
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
              className={`h-2 ${theme.status.success.bg} rounded-full transition-all duration-300`}
              style={{ width: `${((currentQuestion + 1) / enhancedQuizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="flex items-start mb-6">
            <div className={`flex-shrink-0 w-8 h-8 ${theme.status.success.bg} rounded-full flex items-center justify-center mr-4 mt-1`}>
              <span className={`font-bold ${theme.status.success.text}`}>
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
                      ? `${theme.status.success.bg} ${theme.status.success.border} ${theme.status.success.text}`
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
