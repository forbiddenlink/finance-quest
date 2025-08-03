'use client';

import { useState } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import SuccessCelebration from '@/components/shared/ui/SuccessCelebration';
import { CheckCircle, XCircle, Sparkles, Building2, DollarSign, TrendingUp, Shield } from 'lucide-react';
import { theme } from '@/lib/theme';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'account-types' | 'fees' | 'optimization' | 'security' | 'calculation';
}

const enhancedQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "You have $10,000 for an emergency fund. What's the best account setup?",
    options: [
      "Keep it all in checking for easy access",
      "Put it in a traditional bank savings account at 0.01% APY",
      "High-yield savings account online at 4.5% APY",
      "Split between checking ($5,000) and regular savings ($5,000)"
    ],
    correctAnswer: 2,
    explanation: "High-yield savings accounts offer FDIC protection with much higher returns. Your $10,000 earns $450/year vs $1/year at traditional banks - a $449 difference annually.",
    category: 'optimization'
  },
  {
    id: 2,
    question: "Sarah pays $15/month in bank fees. How much is this costing her over 20 years if she invested that money at 7% return?",
    options: [
      "$3,600 (just the fees)",
      "$7,200 (double the fees)",
      "$9,500",
      "$12,000+"
    ],
    correctAnswer: 3,
    explanation: "$15/month = $180/year in fees. Over 20 years with 7% compound growth, this becomes over $12,000 in lost wealth. Banking fees are a major wealth destroyer.",
    category: 'calculation'
  },
  {
    id: 3,
    question: "What's the maximum FDIC insurance coverage for one person at one bank?",
    options: [
      "$100,000 per account",
      "$250,000 per depositor per bank",
      "$500,000 total",
      "$1,000,000 for premium accounts"
    ],
    correctAnswer: 1,
    explanation: "FDIC insures up to $250,000 per depositor, per insured bank, per ownership category. For amounts over $250,000, spread across multiple banks for full protection.",
    category: 'security'
  },
  {
    id: 4,
    question: "Which banking setup demonstrates the optimal 'banking trifecta' strategy?",
    options: [
      "All accounts at one big national bank for convenience",
      "Local checking + online high-yield savings + investment account",
      "Multiple checking accounts at different banks",
      "Cash only, no banks needed"
    ],
    correctAnswer: 1,
    explanation: "The banking trifecta combines local convenience (checking/ATMs) with online rates (savings) and investment growth, maximizing both earnings and accessibility.",
    category: 'optimization'
  },
  {
    id: 5,
    question: "You're choosing between Bank A (0.01% APY, no fees) and Bank B (4.5% APY, $5/month fee). For $5,000 savings, which is better annually?",
    options: [
      "Bank A: earn $0.50, pay $0 = $0.50 net",
      "Bank B: earn $225, pay $60 = $165 net",
      "They're about the same",
      "Need more information to decide"
    ],
    correctAnswer: 1,
    explanation: "Bank B nets $165 vs Bank A's $0.50 - a $164.50 annual difference. Even with fees, high-yield accounts usually beat no-fee low-yield accounts for meaningful balances.",
    category: 'calculation'
  },
  {
    id: 6,
    question: "What's the most effective way to avoid overdraft fees?",
    options: [
      "Opt into overdraft protection from the bank",
      "Set up low-balance alerts and account monitoring",
      "Keep a large buffer in checking always",
      "Use credit cards for everything instead"
    ],
    correctAnswer: 1,
    explanation: "Low-balance alerts (like at $100) give you time to transfer money or modify spending before overdrafts occur. Prevention is better than paying $35 fees.",
    category: 'fees'
  },
  {
    id: 7,
    question: "For someone with $300,000 to protect, what's the best FDIC strategy?",
    options: [
      "Keep it all at one bank - FDIC covers everything",
      "Split: $250,000 at Bank A, $50,000 at Bank B",
      "Use only credit unions instead",
      "Keep $50,000 in cash, rest in banks"
    ],
    correctAnswer: 1,
    explanation: "FDIC covers up to $250,000 per bank. Splitting $250K at Bank A and $50K at Bank B ensures full $300,000 protection across both institutions.",
    category: 'security'
  },
  {
    id: 8,
    question: "Which account type is best for money you need in 6-12 months for a car down payment?",
    options: [
      "High-yield savings account",
      "Stock market investment",
      "Certificate of deposit (CD)",
      "Checking account"
    ],
    correctAnswer: 0,
    explanation: "High-yield savings provides liquidity with decent returns for short-term goals. CDs lock up money, stocks are risky for short timeframes, checking earns nothing.",
    category: 'account-types'
  },
  {
    id: 9,
    question: "What's a major red flag when choosing a bank?",
    options: [
      "No physical branch locations",
      "Offers high interest rates",
      "Not FDIC insured",
      "Requires minimum balance"
    ],
    correctAnswer: 2,
    explanation: "No FDIC insurance means your deposits aren't protected if the bank fails. Always verify FDIC insurance before depositing money. Online-only banks can be excellent if FDIC insured.",
    category: 'security'
  },
  {
    id: 10,
    question: "Digital banking alerts should be set for which scenarios to maximize financial benefit?",
    options: [
      "Only when account balance hits zero",
      "Low balance ($100), large transactions ($500+), monthly transfer confirmations",
      "Just monthly statements",
      "Every single transaction"
    ],
    correctAnswer: 1,
    explanation: "Strategic alerts prevent overdrafts (low balance), catch fraud (large transactions), and confirm automatic savings (transfers). This prevents fees and builds awareness.",
    category: 'optimization'
  }
];

export default function BankingFundamentalsQuizEnhanced() {
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
    const breakdown = { 'account-types': 0, 'fees': 0, 'optimization': 0, 'security': 0, 'calculation': 0 };
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
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / enhancedQuizQuestions.length) * 100);
    const passed = percentage >= 80;
    const breakdown = getCategoryBreakdown();

    // Record the quiz score
    recordQuizScore('banking-fundamentals-enhanced-quiz', score, enhancedQuizQuestions.length);

    if (passed) {
      setShowCelebration(true);
    }

    return (
      <>
        <SuccessCelebration
          show={showCelebration}
          title="Banking Mastery Achieved!"
          message={`Excellent! You scored ${percentage}% and unlocked Chapter 3: Income & Career!`}
          onComplete={() => setShowCelebration(false)}
          type="quiz"
        />

        <div className={`max-w-2xl mx-auto ${theme.backgrounds.card} rounded-lg shadow-lg p-8`}>
          <div className="text-center">
            <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>Banking Quiz Results</h2>
            <div className={`text-6xl font-bold mb-4 ${passed ? theme.status.success.text : theme.status.error.text}`}>
              {percentage}%
            </div>
            <p className={`text-xl ${theme.textColors.secondary} mb-6`}>
              You got {score} out of {enhancedQuizQuestions.length} questions correct
            </p>

            {/* Category Breakdown */}
            <div className={`mb-6 p-4 ${theme.backgrounds.cardDisabled} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3`}>Banking Skill Breakdown</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                    <Building2 className="w-4 h-4" />
                    Account Types
                  </span>
                  <span className={`font-bold ${theme.textColors.primary}`}>{breakdown['account-types']}/2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                    <DollarSign className="w-4 h-4" />
                    Fee Avoidance
                  </span>
                  <span className={`font-bold ${theme.textColors.primary}`}>{breakdown.fees}/1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                    <TrendingUp className="w-4 h-4" />
                    Optimization
                  </span>
                  <span className={`font-bold ${theme.textColors.primary}`}>{breakdown.optimization}/4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                    <Shield className="w-4 h-4" />
                    Security & FDIC
                  </span>
                  <span className={`font-bold ${theme.textColors.primary}`}>{breakdown.security}/3</span>
                </div>
                <div className="flex items-center justify-between col-span-2">
                  <span className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                    <CheckCircle className="w-4 h-4" />
                    Financial Calculations
                  </span>
                  <span className={`font-bold ${theme.textColors.primary}`}>{breakdown.calculation}/2</span>
                </div>
              </div>
            </div>

            {passed ? (
              <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-6 mb-6`}>
                <h3 className={`text-lg font-semibold ${theme.status.success.text} mb-2 flex items-center gap-2 justify-center`}>
                  <Sparkles className="w-5 h-5" />
                  Banking Foundation Solid!
                </h3>
                <p className={theme.status.success.text}>
                  You understand account types, fee avoidance, optimization strategies, and FDIC protection. Ready for Chapter 3: Income & Career Growth!
                </p>
              </div>
            ) : (
              <div className={`${theme.status.error.bg} border ${theme.status.error.border} rounded-lg p-6 mb-6`}>
                <h3 className={`text-lg font-semibold ${theme.status.error.text} mb-2`}>Keep Building Your Banking Knowledge!</h3>
                <p className={theme.status.error.text}>
                  You need 80% to unlock Chapter 3. Focus on the categories where you scored lower, review the lessons, then try again.
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
                  Continue to Chapter 3
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
      case 'account-types': return <Building2 className="w-4 h-4" />;
      case 'fees': return <DollarSign className="w-4 h-4" />;
      case 'optimization': return <TrendingUp className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'calculation': return <CheckCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${theme.backgrounds.card} rounded-lg shadow-lg`}>
      {/* Progress Bar */}
      <div className={`${theme.backgrounds.disabled} rounded-t-lg`}>
        <div
          className={`${theme.status.success.bg} h-3 rounded-t-lg transition-all duration-300`}
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
              <span className="capitalize">{question.category.replace('-', ' ')}</span>
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
                  Perfect!
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Not quite - here&apos;s the insight:
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
