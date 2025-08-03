'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import {
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Award,
  BarChart3,
  DollarSign,
  PieChart,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

interface InvestmentFundamentalsQuizProps {
  onComplete?: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'fundamentals' | 'asset-classes' | 'portfolio-construction' | 'accounts' | 'psychology';
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

const enhancedQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the historical average annual return of the S&P 500 over the past 100 years?",
    options: [
      "6-7%",
      "8-9%",
      "10-11%",
      "12-13%"
    ],
    correctAnswer: 2,
    explanation: "The S&P 500 has averaged approximately 10% annual returns over the past century, though returns vary significantly year to year.",
    category: 'fundamentals',
    difficulty: 'basic'
  },
  {
    id: 2,
    question: "According to the compound interest demonstration, how much more does someone who starts investing at 25 vs 35 end up with?",
    options: [
      "$100,000 more",
      "$240,000 more", 
      "$500,000 more",
      "$1,000,000 more"
    ],
    correctAnswer: 1,
    explanation: "Starting 10 years earlier (age 25 vs 35) with the same monthly contribution results in approximately $240,000 more despite investing $120,000 less total.",
    category: 'fundamentals',
    difficulty: 'intermediate'
  },
  {
    id: 3,
    question: "Which asset class typically provides the best inflation hedge?",
    options: [
      "Government bonds",
      "Cash savings accounts",
      "Real Estate Investment Trusts (REITs)",
      "Corporate bonds"
    ],
    correctAnswer: 2,
    explanation: "REITs typically provide excellent inflation protection because property values and rents tend to rise with inflation, maintaining purchasing power.",
    category: 'asset-classes',
    difficulty: 'basic'
  },
  {
    id: 4,
    question: "What percentage of actively managed funds underperform index funds over 15+ year periods?",
    options: [
      "60%",
      "75%",
      "90%",
      "95%"
    ],
    correctAnswer: 2,
    explanation: "Approximately 90% of actively managed funds underperform index funds over long periods, primarily due to higher fees and inability to consistently beat the market.",
    category: 'asset-classes',
    difficulty: 'advanced'
  },
  {
    id: 5,
    question: "According to the age-based allocation rule, what percentage should a 30-year-old have in stocks?",
    options: [
      "70%",
      "80%",
      "90%",
      "100%"
    ],
    correctAnswer: 2,
    explanation: "The rule of '120 minus your age' suggests a 30-year-old should have 90% in stocks (120 - 30 = 90%), allowing for aggressive growth over their long investment horizon.",
    category: 'portfolio-construction',
    difficulty: 'basic'
  },
  {
    id: 6,
    question: "What is the primary benefit of rebalancing your portfolio annually?",
    options: [
      "It guarantees higher returns",
      "It forces you to buy low and sell high",
      "It eliminates all investment risk",
      "It allows you to time the market perfectly"
    ],
    correctAnswer: 1,
    explanation: "Rebalancing forces disciplined 'buy low, sell high' behavior by selling assets that have performed well and buying those that have underperformed, maintaining target allocation.",
    category: 'portfolio-construction',
    difficulty: 'intermediate'
  },
  {
    id: 7,
    question: "What is the top priority in the investment account hierarchy?",
    options: [
      "Maxing out your 401(k)",
      "Building an emergency fund",
      "Contributing enough to get full employer 401(k) match",
      "Opening a Roth IRA"
    ],
    correctAnswer: 2,
    explanation: "Getting the full employer 401(k) match is priority #1 because it provides an instant 50-100% return on investment - guaranteed money you can't get anywhere else.",
    category: 'accounts',
    difficulty: 'basic'
  },
  {
    id: 8,
    question: "How much can low investment fees save you over 30 years on a $500,000 portfolio?",
    options: [
      "$100,000",
      "$200,000",
      "$300,000",
      "$500,000"
    ],
    correctAnswer: 2,
    explanation: "Low-cost index funds (0.03%) vs high-cost active funds (1.5%) can save approximately $300,000 over 30 years on a $500,000 portfolio due to compound fee impact.",
    category: 'accounts',
    difficulty: 'advanced'
  },
  {
    id: 9,
    question: "What is the biggest risk to long-term investment success?",
    options: [
      "Market crashes and volatility",
      "Inflation eroding purchasing power",
      "Emotional reactions to market movements",
      "Government policy changes"
    ],
    correctAnswer: 2,
    explanation: "Emotional reactions (panic selling during crashes, greed buying at peaks) cause more investment losses than market volatility itself. Psychology trumps strategy.",
    category: 'psychology',
    difficulty: 'intermediate'
  },
  {
    id: 10,
    question: "During the 2020 COVID market crash, what happened to disciplined investors who stayed the course?",
    options: [
      "They lost money permanently",
      "They barely broke even after 2 years",
      "The market recovered in 5 months and hit new highs",
      "They switched to bonds and missed the recovery"
    ],
    correctAnswer: 2,
    explanation: "Despite a 35% crash in 5 weeks, the market recovered within 5 months and went on to new highs. Disciplined investors who stayed invested or bought more were rewarded.",
    category: 'psychology',
    difficulty: 'advanced'
  }
];

export default function InvestmentFundamentalsQuizEnhanced({ onComplete }: InvestmentFundamentalsQuizProps) {
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
      'fundamentals': { correct: 0, total: 0 },
      'asset-classes': { correct: 0, total: 0 },
      'portfolio-construction': { correct: 0, total: 0 },
      'accounts': { correct: 0, total: 0 },
      'psychology': { correct: 0, total: 0 }
    };

    enhancedQuizQuestions.forEach((q, index) => {
      categories[q.category].total += 1;
      if (userAnswers[index] === q.correctAnswer) {
        categories[q.category].correct += 1;
      }
    });

    // Record detailed progress with category breakdown
    recordQuizScore('investment-fundamentals-enhanced-quiz', finalScore, enhancedQuizQuestions.length);

    // Show appropriate feedback
    if (finalScore >= 80) {
      toast.success(`Outstanding! ${finalScore}% - Investment Mastery Achieved! 📈`, {
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
      case 'fundamentals': return Target;
      case 'asset-classes': return BarChart3;
      case 'portfolio-construction': return PieChart;
      case 'accounts': return Shield;
      case 'psychology': return TrendingUp;
      default: return DollarSign;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'fundamentals': return 'Investment Fundamentals';
      case 'asset-classes': return 'Asset Classes';
      case 'portfolio-construction': return 'Portfolio Construction';
      case 'accounts': return 'Investment Accounts';
      case 'psychology': return 'Investment Psychology';
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
              ? "🎉 Excellent! You've mastered investment fundamentals and earned chapter advancement!"
              : "📚 Good effort! Review the lesson materials and retake the quiz to advance to the next chapter."
            }
          </p>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Object.entries({
              'fundamentals': { correct: 0, total: 0 },
              'asset-classes': { correct: 0, total: 0 },
              'portfolio-construction': { correct: 0, total: 0 },
              'accounts': { correct: 0, total: 0 },
              'psychology': { correct: 0, total: 0 }
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
                  🎯 Chapter 7 Complete! Proceed to Chapter 8: Portfolio Construction & Asset Allocation
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
