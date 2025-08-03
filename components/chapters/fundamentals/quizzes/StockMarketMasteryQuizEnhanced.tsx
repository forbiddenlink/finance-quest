'use client';

import { useState } from 'react';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  BarChart3,
  Shield,
  Building2,
  Coins,
  Brain
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StockMarketMasteryQuizProps {
  onComplete?: (score: number, maxScore: number) => void;
}

interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: "Stock Fundamentals",
    question: "When you buy 100 shares of Apple stock at $180 per share, what do you actually own?",
    options: [
      "A loan to Apple that they must repay with interest",
      "Partial ownership in Apple with rights to future profits and voting",
      "A contract to buy Apple products at a discount",
      "A guarantee that Apple stock price will increase"
    ],
    correctAnswer: 1,
    explanation: "Buying stock makes you a partial owner of the company. You're entitled to your proportional share of profits (dividends) and have voting rights on major company decisions. Stock ownership represents equity, not debt.",
    difficulty: "Easy"
  },
  {
    id: 2,
    category: "Valuation Methods",
    question: "Company XYZ trades at $50 per share with earnings of $2.50 per share and 30% annual earnings growth. What is its PEG ratio?",
    options: [
      "0.67 (undervalued)",
      "1.5 (overvalued)", 
      "20 (extremely overvalued)",
      "Cannot be calculated from this information"
    ],
    correctAnswer: 0,
    explanation: "PEG ratio = P/E ratio ÷ Growth rate. P/E = $50 ÷ $2.50 = 20. PEG = 20 ÷ 30 = 0.67. A PEG under 1.0 suggests the stock may be undervalued relative to its growth rate.",
    difficulty: "Medium"
  },
  {
    id: 3,
    category: "Investment Strategies",
    question: "Which scenario best exemplifies Warren Buffett's value investing approach?",
    options: [
      "Buying Tesla at 100x earnings because electric vehicles are the future",
      "Purchasing Coca-Cola at 15x earnings with consistent 8% annual growth and 3% dividend yield",
      "Day trading technology stocks based on momentum indicators",
      "Investing only in IPOs of companies with no profits but high growth potential"
    ],
    correctAnswer: 1,
    explanation: "Value investing focuses on established companies with consistent earnings, reasonable valuations, and strong fundamentals. Buffett famously bought Coca-Cola at attractive valuations and held for decades, benefiting from steady growth and dividends.",
    difficulty: "Medium"
  },
  {
    id: 4,
    category: "Portfolio Diversification",
    question: "You have $10,000 to invest. Which portfolio allocation provides the best diversification?",
    options: [
      "100% in Apple stock because it's a great company",
      "50% Tesla, 50% Nvidia (both high-growth tech stocks)",
      "40% US total market index, 20% international index, 20% individual stocks, 20% bonds",
      "25% each in four different cryptocurrency funds"
    ],
    correctAnswer: 2,
    explanation: "True diversification spreads risk across asset classes, geographic regions, and company sizes. A mix of broad market indexes with some individual holdings and bonds provides exposure to different economic sectors and reduces concentration risk.",
    difficulty: "Easy"
  },
  {
    id: 5,
    category: "Market Psychology",
    question: "During the March 2020 COVID crash, the S&P 500 fell 34% in 5 weeks. What would be the most rational investor response?",
    options: [
      "Sell everything immediately to avoid further losses",
      "Wait for the market to recover before investing again", 
      "Continue regular investments or increase them if possible, focusing on long-term goals",
      "Put all money in day trading to make quick profits from volatility"
    ],
    correctAnswer: 2,
    explanation: "Market crashes create buying opportunities for long-term investors. Continuing to invest during downturns (dollar-cost averaging) often leads to superior returns. Panic selling locks in losses and misses the recovery.",
    difficulty: "Medium"
  },
  {
    id: 6,
    category: "Risk Management",
    question: "What is the primary risk of investing 50% of your portfolio in your employer's stock?",
    options: [
      "The stock might not pay dividends",
      "Concentration risk - your job and investments are both tied to one company's performance",
      "Employer stocks always underperform the market",
      "You won't get voting rights in company decisions"
    ],
    correctAnswer: 1,
    explanation: "Concentration risk is dangerous because if your employer struggles, you could lose both your job and a large portion of your investments simultaneously. Enron employees experienced this tragedy in 2001 when the company collapsed.",
    difficulty: "Easy"
  },
  {
    id: 7,
    category: "Growth vs Value",
    question: "Which characteristic typically distinguishes growth stocks from value stocks?",
    options: [
      "Growth stocks always pay higher dividends than value stocks",
      "Value stocks have higher P/E ratios than growth stocks",
      "Growth stocks emphasize rapid earnings expansion, often trading at higher valuations",
      "Value stocks are always smaller companies than growth stocks"
    ],
    correctAnswer: 2,
    explanation: "Growth stocks focus on companies with rapid earnings growth potential, often reinvesting profits rather than paying dividends, and typically trade at higher P/E ratios. Value stocks emphasize established companies at lower valuations.",
    difficulty: "Medium"
  },
  {
    id: 8,
    category: "Long-term Wealth Building",
    question: "A 25-year-old invests $300/month in the S&P 500 averaging 10% annual returns. How much will they have at age 65?",
    options: [
      "Around $200,000 (mostly contributions)",
      "Around $600,000 (moderate growth)",
      "Around $1,060,000 (power of compounding)",
      "Around $2,500,000 (unrealistic expectations)"
    ],
    correctAnswer: 2,
    explanation: "$300/month for 40 years at 10% annual returns equals approximately $1,060,000. Total contributions would be only $144,000, showing how compound growth creates most long-term wealth. Starting early is crucial for maximizing this effect.",
    difficulty: "Hard"
  },
  {
    id: 9,
    category: "Behavioral Finance",
    question: "What behavioral bias leads investors to hold losing stocks too long while selling winners too quickly?",
    options: [
      "Confirmation bias",
      "Loss aversion and the disposition effect",
      "Anchoring bias",
      "Herding behavior"
    ],
    correctAnswer: 1,
    explanation: "Loss aversion makes losses feel twice as painful as equivalent gains, leading to the disposition effect - holding losers hoping to break even while selling winners to 'lock in' gains. This behavior often reduces long-term returns.",
    difficulty: "Hard"
  },
  {
    id: 10,
    category: "Market Timing",
    question: "Studies show that missing the 10 best trading days over 20 years in the S&P 500 reduces returns by approximately how much?",
    options: [
      "5% (minimal impact)",
      "15% (moderate impact)",
      "50% (significant impact)", 
      "90% (devastating impact)"
    ],
    correctAnswer: 2,
    explanation: "Missing just the 10 best days over 20 years can cut returns roughly in half, demonstrating why 'time in the market beats timing the market.' The best days often occur during volatile periods when investors are most tempted to stay out.",
    difficulty: "Hard"
  }
];

export default function StockMarketMasteryQuizEnhanced({ onComplete }: StockMarketMasteryQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(quizQuestions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === quizQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const getScorePercentage = () => {
    return Math.round((calculateScore() / quizQuestions.length) * 100);
  };

  const handleQuizComplete = () => {
    const score = calculateScore();
    
    setShowResults(true);
    
    if (onComplete) {
      onComplete(score, quizQuestions.length);
    }

    const percentage = getScorePercentage();
    if (percentage >= 80) {
      toast.success(`Excellent! ${percentage}% - Stock Market Mastery achieved! 🚀`, {
        duration: 4000,
        position: 'top-center',
      });
    } else {
      toast.error(`${percentage}% - Need 80% to pass. Review the material and try again! 📚`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quizQuestions.length).fill(-1));
    setShowResults(false);
  };

  const answeredQuestions = selectedAnswers.filter(answer => answer !== -1).length;
  const progressPercentage = Math.round((answeredQuestions / quizQuestions.length) * 100);

  const categoryIcons: { [key: string]: React.ElementType } = {
    "Stock Fundamentals": TrendingUp,
    "Valuation Methods": BarChart3,
    "Investment Strategies": Target,
    "Portfolio Diversification": Shield,
    "Market Psychology": Brain,
    "Risk Management": Shield,
    "Growth vs Value": Building2,
    "Long-term Wealth Building": Coins,
    "Behavioral Finance": Brain,
    "Market Timing": Clock
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = getScorePercentage();
    const passed = percentage >= 80;

    return (
      <div className="max-w-4xl mx-auto">
        <GradientCard variant="glass" gradient={passed ? "green" : "red"} className="p-8">
          <div className="text-center mb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              passed ? theme.status.success.bg : theme.status.error.bg
            }`}>
              {passed ? (
                <Trophy className={`w-12 h-12 ${theme.status.success.text}`} />
              ) : (
                <RotateCcw className={`w-12 h-12 ${theme.status.error.text}`} />
              )}
            </div>
            
            <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
              Quiz {passed ? 'Complete!' : 'Results'}
            </h2>
            
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center">
                <ProgressRing 
                  progress={percentage} 
                  size={100} 
                  strokeWidth={8}
                  className={passed ? "text-green-400" : "text-red-400"}
                />
                <p className={`text-sm ${theme.textColors.muted} mt-2`}>Score</p>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${theme.textColors.primary}`}>
                  {score}/{quizQuestions.length}
                </div>
                <p className={`text-sm ${theme.textColors.muted}`}>Correct Answers</p>
              </div>
            </div>

            {passed ? (
              <div className={`${theme.status.success.bg} rounded-xl p-6 mb-6`}>
                <h3 className={`text-xl font-bold ${theme.status.success.text} mb-2`}>
                  🎉 Stock Market Mastery Achieved!
                </h3>
                <p className={`${theme.textColors.secondary}`}>
                  Outstanding performance! You&apos;ve demonstrated mastery of stock market fundamentals, 
                  valuation methods, and investment strategies. You&apos;re ready for advanced investing!
                </p>
              </div>
            ) : (
              <div className={`${theme.status.error.bg} rounded-xl p-6 mb-6`}>
                <h3 className={`text-xl font-bold ${theme.status.error.text} mb-2`}>
                  📚 Keep Learning
                </h3>
                <p className={`${theme.textColors.secondary}`}>
                  You need 80% to pass. Review the lessons focusing on areas where you missed questions, 
                  then retake the quiz. Understanding these concepts is crucial for successful investing.
                </p>
              </div>
            )}
          </div>

          {/* Question Review */}
          <div className="space-y-6 mb-8">
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>Review Your Answers</h3>
            {quizQuestions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              const CategoryIcon = categoryIcons[question.category] || Target;

              return (
                <div key={question.id} className={`${theme.backgrounds.card} rounded-xl p-6 border-l-4 ${
                  isCorrect ? 'border-green-400' : 'border-red-400'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <CategoryIcon className={`w-5 h-5 mr-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`} />
                      <span className={`text-sm font-medium ${theme.textColors.muted}`}>
                        {question.category} • {question.difficulty}
                      </span>
                    </div>
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                  
                  <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>
                    {index + 1}. {question.question}
                  </h4>
                  
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border ${
                          optionIndex === question.correctAnswer
                            ? 'border-green-400 bg-green-500/10'
                            : optionIndex === userAnswer && !isCorrect
                            ? 'border-red-400 bg-red-500/10'
                            : 'border-gray-600 bg-gray-800/30'
                        }`}
                      >
                        <div className="flex items-center">
                          {optionIndex === question.correctAnswer && (
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          )}
                          {optionIndex === userAnswer && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-400 mr-2" />
                          )}
                          <span className={`${
                            optionIndex === question.correctAnswer
                              ? 'text-green-300'
                              : optionIndex === userAnswer && !isCorrect
                              ? 'text-red-300'
                              : theme.textColors.secondary
                          }`}>
                            {option}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`bg-blue-500/10 border border-blue-500/20 rounded-lg p-4`}>
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      <strong className="text-blue-300">Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={resetQuiz}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${theme.buttons.secondary} hover:opacity-90 flex items-center`}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </button>
            {passed && (
              <button
                onClick={() => window.location.href = '/chapter13'}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${theme.buttons.primary} hover:opacity-90 flex items-center`}
              >
                Continue to Chapter 13
                <TrendingUp className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </GradientCard>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const CategoryIcon = categoryIcons[question.category] || Target;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-3xl font-bold ${theme.textColors.primary}`}>
            📈 Stock Market Mastery Quiz
          </h2>
          <div className="flex items-center space-x-4">
            <ProgressRing 
              progress={progressPercentage} 
              size={60} 
              strokeWidth={6}
              className="text-blue-400"
            />
            <div className="text-right">
              <div className={`text-sm ${theme.textColors.muted}`}>Progress</div>
              <div className={`font-bold ${theme.textColors.primary}`}>{answeredQuestions}/{quizQuestions.length}</div>
            </div>
          </div>
        </div>

        <div className={`${theme.backgrounds.card} rounded-xl p-4 mb-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CategoryIcon className="w-5 h-5 text-blue-400 mr-2" />
              <span className={`font-medium ${theme.textColors.primary}`}>{question.category}</span>
              <span className={`ml-3 px-2 py-1 rounded-full text-xs ${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
                {question.difficulty}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted}`}>
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Current Question */}
      <GradientCard variant="glass" gradient="blue" className="mb-8">
        <div className="p-8">
          <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6`}>
            {question.question}
          </h3>

          <div className="space-y-4 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? `border-blue-400 ${theme.backgrounds.card} bg-blue-500/10`
                    : `border-gray-600 ${theme.backgrounds.card} hover:border-gray-500`
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-400 bg-blue-400'
                      : 'border-gray-500'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className={theme.textColors.secondary}>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentQuestion === 0
                  ? `${theme.textColors.muted} cursor-not-allowed opacity-50`
                  : `${theme.buttons.secondary} hover:opacity-90`
              }`}
            >
              Previous
            </button>

            {currentQuestion < quizQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={selectedAnswers[currentQuestion] === -1}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedAnswers[currentQuestion] === -1
                    ? `${theme.textColors.muted} cursor-not-allowed opacity-50`
                    : `${theme.buttons.primary} hover:opacity-90`
                }`}
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleQuizComplete}
                disabled={answeredQuestions < quizQuestions.length}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  answeredQuestions < quizQuestions.length
                    ? `${theme.textColors.muted} cursor-not-allowed opacity-50`
                    : `${theme.buttons.primary} hover:opacity-90`
                }`}
              >
                Complete Quiz
              </button>
            )}
          </div>
        </div>
      </GradientCard>

      {/* Question Progress Indicator */}
      <div className="flex justify-center space-x-2">
        {quizQuestions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentQuestion
                ? 'bg-blue-400 scale-125'
                : selectedAnswers[index] !== -1
                ? 'bg-green-400'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
