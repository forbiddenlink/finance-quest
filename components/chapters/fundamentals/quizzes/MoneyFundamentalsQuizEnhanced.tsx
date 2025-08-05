'use client';

import { useState } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import SuccessCelebration from '@/components/shared/ui/SuccessCelebration';
import { CheckCircle, XCircle, Sparkles, Brain, DollarSign, TrendingUp } from 'lucide-react';
import { theme } from '@/lib/theme';
import toast from 'react-hot-toast';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'psychology' | 'practical' | 'calculation' | 'application';
}

const enhancedQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Sarah says 'I can't afford that $100 financial course.' Which mindset shift would be most empowering?",
    options: [
      "Accept that she can't afford it and move on",
      "Put it on a credit card since education is important",
      "Ask 'How could I create an extra $100 this month to invest in skills?'",
      "Wait until she has more money saved up"
    ],
    correctAnswer: 2,
    explanation: "Abundance thinking reframes limitations as challenges to solve. This opens up creative solutions like freelancing, selling items, or finding ways to increase income rather than staying stuck in scarcity.",
    category: 'psychology'
  },
  {
    id: 2,
    question: "You see a jacket 'marked down' from $300 to $150. Which cognitive bias should you be most aware of?",
    options: [
      "Loss aversion - fear of missing the sale",
      "Anchoring bias - the $300 'original price' influences your perception of value",
      "Confirmation bias - seeking reasons to justify the purchase",
      "Present bias - wanting immediate gratification"
    ],
    correctAnswer: 1,
    explanation: "Anchoring bias occurs when the first number you see ($300) becomes the reference point, making $150 seem like a great deal even if the jacket was never actually sold at $300.",
    category: 'psychology'
  },
  {
    id: 3,
    question: "If you save $5 per day instead of buying coffee and invest it at 7% annual return, how much would you have after 20 years?",
    options: [
      "About $36,500 ($5 × 365 × 20)",
      "About $50,000",
      "About $66,000", 
      "About $78,139"
    ],
    correctAnswer: 3,
    explanation: "Saving $5/day = $150/month. With compound interest at 7% annually, this becomes approximately $78,139 after 20 years. This shows the power of compound growth over time.",
    category: 'calculation'
  },
  {
    id: 4,
    question: "What's the most important difference between SMART and PACT goal setting for financial success?",
    options: [
      "SMART goals are more specific and measurable",
      "PACT goals focus on process and continuous actions rather than just outcomes",
      "SMART goals are better for short-term planning",
      "PACT goals require less planning and effort"
    ],
    correctAnswer: 1,
    explanation: "PACT goals focus on the process (continuous actions you can control) rather than just outcomes. This builds sustainable habits that compound over time, leading to better long-term results.",
    category: 'application'
  },
  {
    id: 5,
    question: "Which money personality type needs automatic savings systems the most?",
    options: [
      "Savers - they need help growing their money",
      "Investors - they need more security",
      "Spenders - they need to save before they see the money",
      "Avoiders - they need simpler decisions"
    ],
    correctAnswer: 2,
    explanation: "Spenders enjoy purchasing and experiences, so they benefit most from automatic systems that save money before they have a chance to spend it. This works WITH their nature rather than against it.",
    category: 'practical'
  },
  {
    id: 6,
    question: "Your gross monthly pay is $6,000. Approximately what should you expect your net pay to be?",
    options: [
      "$6,000 (same as gross)",
      "$4,200-$4,800 (70-80% of gross)",
      "$3,600 (60% of gross)",
      "$5,400 (90% of gross)"
    ],
    correctAnswer: 1,
    explanation: "Most people take home about 70-80% of gross pay after federal taxes, state taxes, Social Security, Medicare, and other deductions. This varies by location and deductions.",
    category: 'practical'
  },
  {
    id: 7,
    question: "What protects your deposits in FDIC-insured banks?",
    options: [
      "The bank's private insurance",
      "Federal government insurance up to $250,000 per depositor per bank",
      "State government insurance up to $100,000",
      "No protection - deposits are at risk"
    ],
    correctAnswer: 1,
    explanation: "FDIC (Federal Deposit Insurance Corporation) provides federal government backing for deposits up to $250,000 per depositor, per bank. This means your money is protected even if the bank fails.",
    category: 'practical'
  },
  {
    id: 8,
    question: "Which approach demonstrates the compound effect principle best?",
    options: [
      "Saving $1,000 once per year",
      "Saving $83 every month consistently",
      "Saving $20 every week consistently", 
      "Saving random amounts when you remember"
    ],
    correctAnswer: 2,
    explanation: "Smaller, more frequent actions ($20/week = $1,040/year) create better habits and compound more effectively than larger, less frequent actions. Consistency beats perfection.",
    category: 'application'
  },
  {
    id: 9,
    question: "You want to save $5,000 for an emergency fund. Which is the better PACT goal structure?",
    options: [
      "'Save $5,000 by December 31st'",
      "'Save more money for emergencies'",
      "'Transfer $200 to savings every Friday after payday because financial security reduces stress and lets me take career risks'",
      "'Put any extra money into savings when possible'"
    ],
    correctAnswer: 2,
    explanation: "PACT goals are Purposeful (includes the 'why'), Actionable (specific action), Continuous (regular habit), and Trackable (clear amount and timing).",
    category: 'application'
  },
  {
    id: 10,
    question: "Loss aversion bias means you feel losses about twice as strongly as gains. How does this hurt wealth building?",
    options: [
      "It makes you spend more money on insurance",
      "It makes you avoid good investments due to fear of short-term losses",
      "It makes you save too much money in low-return accounts",
      "It makes you focus too much on budgeting"
    ],
    correctAnswer: 1,
    explanation: "Loss aversion causes people to avoid investments with short-term volatility (like stocks) even when they offer better long-term returns. This fear of paper losses prevents wealth building through compound growth.",
    category: 'psychology'
  }
];

interface MoneyFundamentalsQuizProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

export default function MoneyFundamentalsQuizEnhanced({ onComplete }: MoneyFundamentalsQuizProps) {
  const { recordQuizScore } = useProgressStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(enhancedQuizQuestions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(false);
  };

  const checkAnswer = () => {
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < enhancedQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === enhancedQuizQuestions[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getCategoryBreakdown = () => {
    const breakdown = { psychology: 0, practical: 0, calculation: 0, application: 0 };
    selectedAnswers.forEach((answer, index) => {
      if (answer === enhancedQuizQuestions[index].correctAnswer) {
        breakdown[enhancedQuizQuestions[index].category]++;
      }
    });
    return breakdown;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(enhancedQuizQuestions.length).fill(-1));
    setShowResults(false);
    setShowExplanation(false);
    setShowCelebration(false);
    
    toast.success('Quiz reset! Ready for another attempt? 🔄', {
      duration: 2000,
      position: 'top-center',
    });
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / enhancedQuizQuestions.length) * 100);
    const passed = percentage >= 80;
    const breakdown = getCategoryBreakdown();

    // Record the quiz score
    recordQuizScore('money-fundamentals-enhanced-quiz', score, enhancedQuizQuestions.length);

    // Call completion callback if provided
    if (onComplete) {
      onComplete(score, enhancedQuizQuestions.length);
    }

    if (passed) {
      setShowCelebration(true);
    }

    return (
      <>
        <SuccessCelebration
          show={showCelebration}
          title="Money Fundamentals Mastered!"
          message={`Outstanding! You scored ${percentage}% and unlocked Chapter 2: Banking & Savings!`}
          onComplete={() => setShowCelebration(false)}
          type="quiz"
        />

        <div className={`max-w-2xl mx-auto ${theme.backgrounds.card} rounded-lg shadow-lg p-8`}>
          <div className="text-center">
            <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>Enhanced Quiz Results</h2>
            <div className={`text-6xl font-bold mb-4 ${passed ? theme.status.success.text : theme.status.error.text}`}>
              {percentage}%
            </div>
            <p className={`text-xl ${theme.textColors.secondary} mb-6`}>
              You got {score} out of {enhancedQuizQuestions.length} questions correct
            </p>

            {/* Category Breakdown */}
            <div className={`mb-6 p-4 ${theme.backgrounds.cardDisabled} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3`}>Skill Breakdown</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                    <Brain className="w-4 h-4" />
                    Psychology
                  </span>
                  <span className={`font-bold ${theme.textColors.primary}`}>{breakdown.psychology}/4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                    <DollarSign className="w-4 h-4" />
                    Practical
                  </span>
                  <span className={`font-bold ${theme.textColors.primary}`}>{breakdown.practical}/3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                    <TrendingUp className="w-4 h-4" />
                    Calculation
                  </span>
                  <span className={`font-bold ${theme.textColors.primary}`}>{breakdown.calculation}/1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                    <CheckCircle className="w-4 h-4" />
                    Application
                  </span>
                  <span className={`font-bold ${theme.textColors.primary}`}>{breakdown.application}/2</span>
                </div>
              </div>
            </div>

            {passed ? (
              <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-6 mb-6`}>
                <h3 className={`text-lg font-semibold ${theme.status.success.text} mb-2 flex items-center gap-2 justify-center`}>
                  <Sparkles className="w-5 h-5" />
                  Foundation Mastered!
                </h3>
                <p className={theme.status.success.text}>
                  You&apos;ve demonstrated strong understanding of money psychology, practical basics, and goal setting. You&apos;re ready for Chapter 2: Banking Fundamentals!
                </p>
              </div>
            ) : (
              <div className={`${theme.status.error.bg} border ${theme.status.error.border} rounded-lg p-6 mb-6`}>
                <h3 className={`text-lg font-semibold ${theme.status.error.text} mb-2`}>Almost There!</h3>
                <p className={theme.status.error.text}>
                  You need 80% to unlock Chapter 2. Review the enhanced lessons focusing on areas where you scored lower, then try again.
                </p>
              </div>
            )}

            <div className="flex space-x-4 justify-center">
              <button
                onClick={resetQuiz}
                className={`px-6 py-3 ${theme.buttons.secondary} rounded-md transition-colors`}
              >
                Retake Quiz
              </button>
              {passed && (
                <button className={`px-6 py-3 ${theme.buttons.primary} rounded-md transition-colors`}>
                  Continue to Chapter 2
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  const question = enhancedQuizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / enhancedQuizQuestions.length) * 100;
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'psychology': return <Brain className="w-4 h-4" />;
      case 'practical': return <DollarSign className="w-4 h-4" />;
      case 'calculation': return <TrendingUp className="w-4 h-4" />;
      case 'application': return <CheckCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${theme.backgrounds.card} rounded-lg shadow-lg`}>
      {/* Progress Bar */}
      <div className={`${theme.backgrounds.cardDisabled} rounded-t-lg`}>
        <div
          className={`${theme.status.info.bg} h-3 rounded-t-lg transition-all duration-300`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${theme.textColors.primary}`}>
              Question {currentQuestion + 1} of {enhancedQuizQuestions.length}
            </span>
            <div className={`flex items-center gap-2 text-sm ${theme.textColors.muted}`}>
              {getCategoryIcon(question.category)}
              <span className="capitalize">{question.category}</span>
            </div>
          </div>
          <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>{question.question}</h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                selectedAnswer === index
                  ? showExplanation
                    ? index === question.correctAnswer
                      ? `border-2 ${theme.status.success.border} ${theme.status.success.bg} ${theme.status.success.text}`
                      : `border-2 ${theme.status.error.border} ${theme.status.error.bg} ${theme.status.error.text}`
                    : `border-2 ${theme.borderColors.primary} ${theme.backgrounds.card} ${theme.textColors.primary}`
                  : `border-2 ${theme.borderColors.primary} hover:${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.textColors.primary}`
              }`}
            >
              <div className="flex items-center">
                <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current mr-3 flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Enhanced Explanation */}
        {showExplanation && (
          <div className={`mb-6 p-4 rounded-lg ${
            isCorrect 
              ? `${theme.status.success.bg} border ${theme.status.success.border}` 
              : `${theme.status.error.bg} border ${theme.status.error.border}`
          }`}>
            <h3 className={`font-semibold mb-2 flex items-center gap-2 ${
              isCorrect ? theme.status.success.text : theme.status.error.text
            }`}>
              {isCorrect ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Excellent!
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Not quite - here&apos;s why:
                </>
              )}
            </h3>
            <p className={isCorrect ? theme.status.success.text : theme.status.error.text}>
              {question.explanation}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`px-4 py-2 ${theme.textColors.secondary} border ${theme.borderColors.primary} rounded-md hover:${theme.backgrounds.cardHover} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            ← Previous
          </button>

          <div className="flex space-x-3">
            {selectedAnswer !== -1 && !showExplanation && (
              <button
                onClick={checkAnswer}
                className={`px-6 py-2 ${theme.buttons.primary} rounded-md transition-colors`}
              >
                Check Answer
              </button>
            )}
            {showExplanation && (
              <button
                onClick={nextQuestion}
                className={`px-6 py-2 ${theme.buttons.secondary} rounded-md transition-colors`}
              >
                {currentQuestion === enhancedQuizQuestions.length - 1 ? 'View Results' : 'Next Question'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
