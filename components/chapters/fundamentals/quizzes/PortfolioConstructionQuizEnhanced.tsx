'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import {
  PieChart,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Award,
  BarChart3,
  DollarSign,
  Globe,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PortfolioConstructionQuizProps {
  onComplete?: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'diversification' | 'allocation' | 'rebalancing' | 'tax-efficiency' | 'implementation';
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

const enhancedQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "According to Modern Portfolio Theory, what primarily drives risk reduction in a portfolio?",
    options: [
      "Holding more individual stocks",
      "Investing in the highest-rated securities",
      "Low correlation between asset classes",
      "Frequent trading and rebalancing"
    ],
    correctAnswer: 2,
    explanation: "Modern Portfolio Theory shows that correlation between assets is key—uncorrelated assets reduce portfolio volatility without sacrificing returns.",
    category: 'diversification',
    difficulty: 'basic'
  },
  {
    id: 2,
    question: "What percentage of investment returns is determined by asset allocation over time?",
    options: [
      "50%",
      "70%",
      "90%",
      "100%"
    ],
    correctAnswer: 2,
    explanation: "Research shows asset allocation determines approximately 90% of portfolio returns over time—far more important than security selection or market timing.",
    category: 'allocation',
    difficulty: 'basic'
  },
  {
    id: 3,
    question: "Using the '120 minus your age' rule, what should a 35-year-old's stock allocation be?",
    options: [
      "75%",
      "80%",
      "85%",
      "90%"
    ],
    correctAnswer: 2,
    explanation: "120 - 35 = 85% in stocks. This rule provides age-appropriate risk tolerance while maintaining growth potential for long-term investors.",
    category: 'allocation',
    difficulty: 'basic'
  },
  {
    id: 4,
    question: "During the 2000-2010 'lost decade' for US stocks, which performed best?",
    options: [
      "US large-cap stocks returned 0%",
      "International developed markets returned 30%",
      "Emerging markets returned 150%",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "This decade perfectly illustrates why geographic diversification matters—US investors who held only domestic stocks missed significant international gains.",
    category: 'diversification',
    difficulty: 'intermediate'
  },
  {
    id: 5,
    question: "What is the primary purpose of rebalancing a portfolio?",
    options: [
      "To time the market effectively",
      "To force 'buy low, sell high' behavior",
      "To minimize all investment losses",
      "To maximize current year returns"
    ],
    correctAnswer: 1,
    explanation: "Rebalancing systematically sells assets that have performed well and buys those that have underperformed, enforcing disciplined contrarian investing.",
    category: 'rebalancing',
    difficulty: 'intermediate'
  },
  {
    id: 6,
    question: "When should you typically rebalance your portfolio?",
    options: [
      "Monthly to capture all opportunities",
      "When allocations drift 5+ percentage points from targets",
      "Only during market crashes",
      "Never—let winners run"
    ],
    correctAnswer: 1,
    explanation: "Rebalance when allocations drift significantly (5+ percentage points) from targets, or annually—this avoids over-trading while maintaining discipline.",
    category: 'rebalancing',
    difficulty: 'intermediate'
  },
  {
    id: 7,
    question: "How much can annual rebalancing add to long-term returns?",
    options: [
      "0.1% per year",
      "0.5% per year",
      "1.0% per year",
      "2.0% per year"
    ],
    correctAnswer: 1,
    explanation: "Historical data shows annual rebalancing adds approximately 0.5% per year—the 'rebalancing bonus' from systematic profit-taking.",
    category: 'rebalancing',
    difficulty: 'advanced'
  },
  {
    id: 8,
    question: "For tax efficiency, which assets should go in taxable accounts?",
    options: [
      "REITs and bonds (high income)",
      "US and international index funds (tax-efficient)",
      "Actively managed funds (high turnover)",
      "High-yield dividend stocks"
    ],
    correctAnswer: 1,
    explanation: "Tax-efficient index funds belong in taxable accounts, while tax-inefficient assets (REITs, bonds) should go in tax-advantaged accounts.",
    category: 'tax-efficiency',
    difficulty: 'intermediate'
  },
  {
    id: 9,
    question: "What is the recommended target allocation for global equity diversification?",
    options: [
      "100% US stocks for simplicity",
      "60% US, 25% International Developed, 15% Emerging Markets",
      "50% US, 50% International total",
      "80% US, 20% International total"
    ],
    correctAnswer: 1,
    explanation: "A balanced global approach: 60% US (home market), 25% developed international markets, 15% emerging markets provides optimal diversification.",
    category: 'diversification',
    difficulty: 'advanced'
  },
  {
    id: 10,
    question: "What was the key lesson from 2022's bond market performance?",
    options: [
      "Bonds always provide positive returns",
      "Duration risk matters—long-term bonds lost 25-30%",
      "Only high-yield bonds are worth holding",
      "Bond funds should be avoided entirely"
    ],
    correctAnswer: 1,
    explanation: "2022 showed that duration matters: long-term bonds lost 25-30% while intermediate-term bonds lost 10-15% when interest rates spiked.",
    category: 'implementation',
    difficulty: 'advanced'
  }
];

export default function PortfolioConstructionQuizEnhanced({ onComplete }: PortfolioConstructionQuizProps) {
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
      'diversification': { correct: 0, total: 0 },
      'allocation': { correct: 0, total: 0 },
      'rebalancing': { correct: 0, total: 0 },
      'tax-efficiency': { correct: 0, total: 0 },
      'implementation': { correct: 0, total: 0 }
    };

    enhancedQuizQuestions.forEach((q, index) => {
      categories[q.category].total += 1;
      if (userAnswers[index] === q.correctAnswer) {
        categories[q.category].correct += 1;
      }
    });

    // Record detailed progress with category breakdown
    recordQuizScore('portfolio-construction-enhanced-quiz', finalScore, enhancedQuizQuestions.length);

    // Show appropriate feedback
    if (finalScore >= 80) {
      toast.success(`Outstanding! ${finalScore}% - Portfolio Construction Mastered! 🎯`, {
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
      case 'diversification': return Globe;
      case 'allocation': return BarChart3;
      case 'rebalancing': return Target;
      case 'tax-efficiency': return Shield;
      case 'implementation': return PieChart;
      default: return DollarSign;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'diversification': return 'Diversification';
      case 'allocation': return 'Asset Allocation';
      case 'rebalancing': return 'Rebalancing';
      case 'tax-efficiency': return 'Tax Efficiency';
      case 'implementation': return 'Implementation';
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
              ? "🎉 Excellent! You've mastered portfolio construction and earned chapter advancement!"
              : "📚 Good effort! Review the lesson materials and retake the quiz to advance to the next chapter."
            }
          </p>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Object.entries({
              'diversification': { correct: 0, total: 0 },
              'allocation': { correct: 0, total: 0 },
              'rebalancing': { correct: 0, total: 0 },
              'tax-efficiency': { correct: 0, total: 0 },
              'implementation': { correct: 0, total: 0 }
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
                  🎯 Chapter 8 Complete! Proceed to Chapter 9: Risk Management & Insurance
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
