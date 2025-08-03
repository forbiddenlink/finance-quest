'use client';

import { useState } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  Target,
  AlertCircle,
  Home,
  Award,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RealEstateAlternativesQuizProps {
  onComplete?: (score: number, totalQuestions: number, categoryScores: CategoryScore[]) => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'Real Estate Basics' | 'REITs vs Direct' | 'Cryptocurrency' | 'Commodities' | 'Private Markets' | 'Portfolio Construction';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface CategoryScore {
  category: string;
  score: number;
  total: number;
  percentage: number;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the '1% rule' in real estate investing?",
    options: [
      "Monthly rent should be at least 1% of the purchase price",
      "Put down exactly 1% as a down payment",
      "Expect 1% annual appreciation minimum",
      "Limit real estate to 1% of total portfolio"
    ],
    correctAnswer: 0,
    explanation: "The 1% rule is a quick screening tool where monthly rent should be at least 1% of the purchase price. For a $300,000 property, you'd want $3,000+ monthly rent. This helps identify potentially profitable rental properties, though it's just a starting point for analysis.",
    category: "Real Estate Basics",
    difficulty: "easy"
  },
  {
    id: 2,
    question: "What is 'house hacking' and why is it popular with new real estate investors?",
    options: [
      "Illegally modifying property structures",
      "Buying a duplex, living in one unit, renting the other",
      "Flipping houses for quick profits",
      "Using cryptocurrency to buy real estate"
    ],
    correctAnswer: 1,
    explanation: "House hacking involves buying a small multifamily property, living in one unit, and renting out the others. This allows you to qualify for owner-occupied financing (lower down payment) while having rental income offset your housing costs, making it easier to get started in real estate investing.",
    category: "Real Estate Basics",
    difficulty: "medium"
  },
  {
    id: 3,
    question: "What is the main advantage of REITs over direct real estate investment?",
    options: [
      "Higher potential returns",
      "Better tax benefits",
      "Liquidity and professional management",
      "More control over the investment"
    ],
    correctAnswer: 2,
    explanation: "REITs trade like stocks, providing instant liquidity and professional management. You can buy/sell anytime during market hours and get exposure to diversified real estate portfolios managed by professionals, without the hassles of being a landlord.",
    category: "REITs vs Direct",
    difficulty: "easy"
  },
  {
    id: 4,
    question: "During the 2008 financial crisis, how did REITs perform compared to direct real estate?",
    options: [
      "REITs and direct real estate fell equally",
      "REITs fell more severely (60%+) than quality rental properties (20-30%)",
      "REITs held value better than direct real estate",
      "Both asset classes gained value during the crisis"
    ],
    correctAnswer: 1,
    explanation: "REITs are more correlated with stock markets and fell 60%+ during 2008-2009, while quality rental properties typically fell only 20-30%. This shows REITs can be more volatile than direct real estate during financial crises, despite representing the same underlying asset class.",
    category: "REITs vs Direct",
    difficulty: "hard"
  },
  {
    id: 5,
    question: "What is the recommended maximum portfolio allocation to cryptocurrency for most investors?",
    options: [
      "25-30% for diversification",
      "15-20% for growth potential",
      "5-10% maximum due to high volatility",
      "0% - avoid completely"
    ],
    correctAnswer: 2,
    explanation: "Most financial advisors recommend limiting crypto to 5-10% of total portfolio maximum due to extreme volatility and speculative nature. This allows potential upside participation while limiting downside risk to manageable levels if crypto crashes.",
    category: "Cryptocurrency",
    difficulty: "medium"
  },
  {
    id: 6,
    question: "Why should crypto investors use dollar-cost averaging rather than lump sum investing?",
    options: [
      "It guarantees profits",
      "It reduces the impact of crypto's extreme volatility",
      "It's required by law",
      "It provides better tax treatment"
    ],
    correctAnswer: 1,
    explanation: "Dollar-cost averaging (regular small purchases) helps smooth out crypto's extreme price swings. Instead of risking buying at a peak with a lump sum, you buy at various price points over time, reducing the impact of volatility on your average cost basis.",
    category: "Cryptocurrency",
    difficulty: "medium"
  },
  {
    id: 7,
    question: "During the 1970s inflation crisis, what was gold's approximate annual return?",
    options: [
      "6% annually (same as stocks)",
      "15% annually (double stocks)",
      "31% annually (far outpacing inflation)",
      "0% annually (no real protection)"
    ],
    correctAnswer: 2,
    explanation: "During the 1970s high-inflation period, gold returned approximately 31% annually while stocks returned 6.8% and bonds 6.1%. However, from 1980-2000, gold returned 0% while stocks returned 17% annually, showing commodities can have long periods of poor performance.",
    category: "Commodities",
    difficulty: "hard"
  },
  {
    id: 8,
    question: "What is the typical minimum investment requirement for private equity funds?",
    options: [
      "$10,000 - accessible to most investors",
      "$100,000 - for serious investors",
      "$1,000,000+ - for accredited investors only",
      "$10,000,000+ - for institutional investors only"
    ],
    correctAnswer: 2,
    explanation: "Private equity funds typically require $1 million+ minimums and are limited to accredited investors (income $200k+ or net worth $1M+). This high barrier to entry is why most retail investors use liquid alternative funds or interval funds for private market exposure.",
    category: "Private Markets",
    difficulty: "medium"
  },
  {
    id: 9,
    question: "What are the typical fee structures for hedge funds and private equity?",
    options: [
      "0.5% management fee only",
      "1% management + 10% performance fee",
      "2% management + 20% performance fee",
      "5% management + 30% performance fee"
    ],
    correctAnswer: 2,
    explanation: "The standard alternative investment fee structure is '2 and 20' - 2% annual management fee plus 20% of profits above a hurdle rate. These high fees mean alternatives must significantly outperform traditional investments to justify their cost after fees.",
    category: "Private Markets",
    difficulty: "medium"
  },
  {
    id: 10,
    question: "What is the optimal portfolio allocation to alternative investments according to the lesson?",
    options: [
      "5-10% alternatives, focus on traditional assets",
      "15-25% alternatives, 70-80% traditional assets",
      "40-50% alternatives for maximum diversification",
      "75%+ alternatives for highest returns"
    ],
    correctAnswer: 1,
    explanation: "The recommended allocation is 70-80% traditional assets (stocks/bonds) and 15-25% alternatives (real estate, commodities, crypto), with 5-10% speculative/emerging assets. This provides diversification benefits while maintaining traditional assets as the portfolio's foundation for reliable long-term growth.",
    category: "Portfolio Construction",
    difficulty: "easy"
  }
];

export default function RealEstateAlternativesQuizEnhanced({ onComplete }: RealEstateAlternativesQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const { recordQuizScore } = useProgressStore();

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    
    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      toast.success('Correct! Great investment knowledge! 🏠', {
        duration: 2000,
        position: 'top-center',
      });
    } else {
      toast.error('Not quite right. Check the explanation! 📚', {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
    
    // Calculate category scores
    const categoryScores = calculateCategoryScores();
    
    // Record the quiz completion
    recordQuizScore('real-estate-alternatives-enhanced-quiz', score, quizQuestions.length);
    
    // Call onComplete with results
    onComplete?.(score, quizQuestions.length, categoryScores);
    
    if (score >= 8) {
      toast.success(`Outstanding! ${score}/${quizQuestions.length} - You're an alternative investment expert! 🏆`, {
        duration: 4000,
        position: 'top-center',
      });
    } else if (score >= 6) {
      toast.success(`Good work! ${score}/${quizQuestions.length} - Solid alternative investment knowledge! 📈`, {
        duration: 3000,
        position: 'top-center',
      });
    } else {
      toast.error(`${score}/${quizQuestions.length} - Review the material and try again! 📖`, {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const calculateCategoryScores = (): CategoryScore[] => {
    const categories = [...new Set(quizQuestions.map(q => q.category))];
    
    return categories.map(category => {
      const categoryQuestions = quizQuestions.filter(q => q.category === category);
      const categoryAnswers = categoryQuestions.map(q => {
        const answerIndex = answers[quizQuestions.indexOf(q)];
        return answerIndex === q.correctAnswer ? 1 : 0;
      });
      
      const categoryScore = categoryAnswers.reduce((sum: number, score: number) => sum + score, 0);
      
      return {
        category,
        score: categoryScore,
        total: categoryQuestions.length,
        percentage: (categoryScore / categoryQuestions.length) * 100
      };
    });
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setAnswers(new Array(quizQuestions.length).fill(null));
  };

  const currentQ = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (showResults) {
    const categoryScores = calculateCategoryScores();
    const percentage = (score / quizQuestions.length) * 100;
    const passed = score >= 8; // 80% passing threshold

    return (
      <div className="max-w-4xl mx-auto">
        <GradientCard variant="glass" gradient={passed ? "green" : "red"} className="p-8 text-center">
          <div className={`w-20 h-20 ${passed ? theme.status.success.bg : theme.status.warning.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {passed ? (
              <Trophy className={`w-10 h-10 ${theme.status.success.text}`} />
            ) : (
              <AlertCircle className={`w-10 h-10 ${theme.status.warning.text}`} />
            )}
          </div>
          
          <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
            {passed ? 'Alternative Investment Expertise Achieved!' : 'Keep Learning Alternative Investments!'}
          </h2>
          
          <div className={`text-6xl font-bold ${passed ? theme.status.success.text : theme.status.warning.text} mb-4`}>
            {score}/{quizQuestions.length}
          </div>
          
          <p className={`text-xl ${theme.textColors.secondary} mb-8`}>
            {percentage.toFixed(0)}% Score - {passed ? 'Advanced alternative investor level!' : 'Review the concepts and try again!'}
          </p>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {categoryScores.map((category, index) => (
              <GradientCard key={index} variant="glass" gradient="blue" className="p-4">
                <h4 className={`font-semibold ${theme.textColors.primary} mb-2 text-sm`}>{category.category}</h4>
                <div className={`text-2xl font-bold ${category.percentage >= 80 ? theme.status.success.text : theme.status.warning.text}`}>
                  {category.score}/{category.total}
                </div>
                <p className={`text-xs ${theme.textColors.muted}`}>{category.percentage.toFixed(0)}%</p>
              </GradientCard>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className={`flex items-center px-6 py-3 ${theme.status.warning.bg} ${theme.status.warning.text} rounded-xl hover:opacity-90 transition-all`}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Quiz
            </button>
            
            {passed && (
              <button
                onClick={() => onComplete?.(score, quizQuestions.length, categoryScores)}
                className={`flex items-center px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift`}
              >
                <Award className="w-5 h-5 mr-2" />
                Continue to Next Chapter
              </button>
            )}
          </div>
        </GradientCard>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`w-16 h-16 ${theme.status.info.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <Home className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
          Real Estate & Alternative Investments Quiz
        </h1>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Test your knowledge of real estate, REITs, cryptocurrency, commodities, and alternative investment strategies.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${theme.textColors.secondary}`}>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <span className={`text-sm font-medium ${theme.textColors.secondary}`}>
            Score: {score}/{quizQuestions.length}
          </span>
        </div>
        <div className={`w-full bg-slate-800/50 rounded-full h-3`}>
          <div
            className={`h-3 ${theme.status.info.bg} rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <GradientCard variant="glass" gradient="blue" className="p-8 mb-6">
        <div className="flex items-start mb-6">
          <div className={`w-10 h-10 ${theme.status.info.bg} rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}>
            <span className={`font-bold ${theme.status.info.text}`}>{currentQuestion + 1}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <span className={`text-xs px-2 py-1 ${theme.status.warning.bg} ${theme.status.warning.text} rounded-full mr-2`}>
                {currentQ.category}
              </span>
              <span className={`text-xs px-2 py-1 ${
                currentQ.difficulty === 'easy' ? theme.status.success.bg :
                currentQ.difficulty === 'medium' ? theme.status.warning.bg :
                theme.status.error.bg
              } rounded-full`}>
                {currentQ.difficulty}
              </span>
            </div>
            <h2 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
              {currentQ.question}
            </h2>
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQ.correctAnswer;
            const showResult = isAnswered;
            
            let buttonClass = `w-full p-4 text-left rounded-xl border-2 transition-all ${theme.textColors.primary}`;
            
            if (!showResult) {
              buttonClass += ` ${theme.borderColors.muted} hover:${theme.borderColors.primary} hover:${theme.backgrounds.glass}`;
            } else if (isCorrect) {
              buttonClass += ` ${theme.status.success.border} ${theme.status.success.bg}`;
            } else if (isSelected && !isCorrect) {
              buttonClass += ` ${theme.status.error.border} ${theme.status.error.bg}`;
            } else {
              buttonClass += ` ${theme.borderColors.muted} opacity-50`;
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && isCorrect && (
                    <CheckCircle className={`w-5 h-5 ${theme.status.success.text} ml-2`} />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className={`w-5 h-5 ${theme.status.error.text} ml-2`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div className={`p-6 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg mb-6`}>
            <h3 className={`font-semibold ${theme.status.info.text} mb-2 flex items-center`}>
              <Target className="w-5 h-5 mr-2" />
              Explanation
            </h3>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Next Button */}
        {isAnswered && (
          <div className="text-center">
            <button
              onClick={nextQuestion}
              className={`px-8 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift flex items-center mx-auto`}
            >
              {currentQuestion === quizQuestions.length - 1 ? (
                <>
                  <Trophy className="w-5 h-5 mr-2" />
                  View Results
                </>
              ) : (
                <>
                  Next Question
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        )}
      </GradientCard>

      {/* Question Navigation */}
      <div className="flex justify-center">
        <div className="flex space-x-2">
          {quizQuestions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentQuestion
                  ? theme.status.info.bg
                  : answers[index] !== null
                  ? answers[index] === quizQuestions[index].correctAnswer
                    ? theme.status.success.bg
                    : theme.status.error.bg
                  : 'bg-slate-800/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
