'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  XCircle,
  Brain,
  Award,
  TrendingUp,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TaxOptimizationQuizProps {
  onComplete: (score: number, totalQuestions: number) => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'Tax-Advantaged Accounts' | 'Deductions & Credits' | 'Investment Tax Efficiency' | 'Business Taxes' | 'Advanced Planning';
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the maximum contribution to a Traditional 401(k) for someone under 50 in 2025?",
    options: [
      "$6,500",
      "$23,500", 
      "$31,000",
      "$7,000"
    ],
    correctAnswer: 1,
    explanation: "The 2025 contribution limit for 401(k) plans is $23,500 for those under 50, with an additional $7,500 catch-up contribution allowed for those 50 and older.",
    category: "Tax-Advantaged Accounts"
  },
  {
    id: 2,
    question: "Which account offers 'triple tax advantages' for healthcare expenses?",
    options: [
      "Traditional IRA",
      "Roth IRA",
      "Health Savings Account (HSA)",
      "529 Plan"
    ],
    correctAnswer: 2,
    explanation: "HSAs offer triple tax advantages: tax-deductible contributions, tax-free growth, and tax-free withdrawals for qualified medical expenses.",
    category: "Tax-Advantaged Accounts"
  },
  {
    id: 3,
    question: "What's the difference between a tax deduction and tax credit?",
    options: [
      "Deductions and credits have the same effect",
      "Credits reduce taxable income, deductions reduce taxes owed",
      "Deductions reduce taxable income, credits reduce taxes owed dollar-for-dollar",
      "Credits are only for businesses"
    ],
    correctAnswer: 2,
    explanation: "Deductions reduce your taxable income (saving your marginal tax rate), while credits reduce your taxes owed dollar-for-dollar, making credits more valuable.",
    category: "Deductions & Credits"
  },
  {
    id: 4,
    question: "What is the maximum annual deduction for state and local taxes (SALT) under current law?",
    options: [
      "$5,000",
      "$10,000",
      "$15,000",
      "No limit"
    ],
    correctAnswer: 1,
    explanation: "The Tax Cuts and Jobs Act capped the SALT deduction at $10,000, significantly affecting taxpayers in high-tax states.",
    category: "Deductions & Credits"
  },
  {
    id: 5,
    question: "What is tax-loss harvesting?",
    options: [
      "Avoiding taxes on all investment gains",
      "Selling losing investments to offset gains and reduce taxable income",
      "Only buying tax-free investments",
      "Deferring all taxes until retirement"
    ],
    correctAnswer: 1,
    explanation: "Tax-loss harvesting involves selling losing investments to offset capital gains, reducing taxable income by up to $3,000 annually (excess losses carry forward).",
    category: "Investment Tax Efficiency"
  },
  {
    id: 6,
    question: "What is the 'wash sale rule'?",
    options: [
      "You must wash your hands before trading stocks",
      "You can't buy the same or substantially identical security within 30 days of selling for a loss",
      "All stock sales must be reported within 30 days",
      "You must wait 30 days between any stock transactions"
    ],
    correctAnswer: 1,
    explanation: "The wash sale rule prevents claiming a tax loss if you buy the same or substantially identical security within 30 days before or after the sale.",
    category: "Investment Tax Efficiency"
  },
  {
    id: 7,
    question: "What is the current standard deduction for married filing jointly (2024)?",
    options: [
      "$14,600",
      "$22,000",
      "$29,200",
      "$32,000"
    ],
    correctAnswer: 2,
    explanation: "The 2024 standard deduction is $29,200 for married filing jointly, $14,600 for single filers. You should itemize only if your total deductions exceed these amounts.",
    category: "Deductions & Credits"
  },
  {
    id: 8,
    question: "For self-employed individuals, what percentage of health insurance premiums can typically be deducted?",
    options: [
      "50%",
      "75%",
      "100%",
      "25%"
    ],
    correctAnswer: 2,
    explanation: "Self-employed individuals can typically deduct 100% of health insurance premiums for themselves and their families, subject to certain limitations.",
    category: "Business Taxes"
  },
  {
    id: 9,
    question: "What is a Roth conversion?",
    options: [
      "Converting a Roth IRA to a Traditional IRA",
      "Converting a Traditional IRA to a Roth IRA and paying taxes now",
      "Converting stocks to bonds in a Roth account",
      "Converting a 401(k) to cash"
    ],
    correctAnswer: 1,
    explanation: "A Roth conversion involves moving money from a Traditional IRA to a Roth IRA, paying taxes on the converted amount now in exchange for tax-free growth and withdrawals later.",
    category: "Advanced Planning"
  },
  {
    id: 10,
    question: "Which strategy involves timing deductible expenses to maximize tax benefits?",
    options: [
      "Asset location",
      "Tax-loss harvesting", 
      "Bunching deductions",
      "Dollar-cost averaging"
    ],
    correctAnswer: 2,
    explanation: "Bunching deductions involves accelerating or delaying deductible expenses into specific years to exceed the standard deduction threshold and maximize tax benefits.",
    category: "Advanced Planning"
  }
];

export default function TaxOptimizationQuizEnhanced({ onComplete }: TaxOptimizationQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(quizQuestions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
    
    const score = calculateScore();
    const percentage = (score / quizQuestions.length) * 100;
    
    onComplete(score, quizQuestions.length);

    if (percentage >= 80) {
      toast.success(`Excellent! ${percentage}% - Tax optimization mastery achieved! 🎯`, {
        duration: 4000,
        position: 'top-center',
      });
    } else if (percentage >= 60) {
      toast.error(`Good start! ${percentage}% - Review concepts and try again for 80%`, {
        duration: 4000,
        position: 'top-center',
      });
    } else {
      toast.error(`${percentage}% - Study the lesson content and retake the quiz`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === quizQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quizQuestions.length).fill(-1));
    setShowResults(false);
  };

  const getScoreByCategory = () => {
    const categories = ['Tax-Advantaged Accounts', 'Deductions & Credits', 'Investment Tax Efficiency', 'Business Taxes', 'Advanced Planning'];
    return categories.map(category => {
      const categoryQuestions = quizQuestions.filter(q => q.category === category);
      const categoryScore = categoryQuestions.reduce((score, question) => {
        const questionIndex = quizQuestions.findIndex(q => q.id === question.id);
        return score + (selectedAnswers[questionIndex] === question.correctAnswer ? 1 : 0);
      }, 0);
      return {
        category,
        score: categoryScore,
        total: categoryQuestions.length,
        percentage: categoryQuestions.length > 0 ? (categoryScore / categoryQuestions.length) * 100 : 0
      };
    });
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const currentQ = quizQuestions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== -1;

  if (showResults) {
    const finalScore = calculateScore();
    const percentage = (finalScore / quizQuestions.length) * 100;
    const categoryScores = getScoreByCategory();
    const passed = percentage >= 80;

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className={`${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
            <CardHeader className="text-center pb-4">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                passed ? theme.status.success.bg : theme.status.error.bg
              }`}>
                {passed ? (
                  <Award className={`w-8 h-8 ${theme.status.success.text}`} />
                ) : (
                  <AlertTriangle className={`w-8 h-8 ${theme.status.error.text}`} />
                )}
              </div>
              <CardTitle className={`text-2xl ${theme.textColors.primary}`}>
                Quiz Results
              </CardTitle>
              <div className={`text-4xl font-bold mb-2 ${
                passed ? theme.status.success.text : theme.status.error.text
              }`}>
                {finalScore}/{quizQuestions.length}
              </div>
              <div className={`text-xl ${theme.textColors.secondary}`}>
                {percentage.toFixed(0)}% Score
              </div>
              {passed && (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${theme.status.success.bg} ${theme.status.success.text} mt-2`}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Chapter 11 Unlocked!
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Breakdown */}
              <div>
                <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
                  Performance by Category
                </h3>
                <div className="space-y-3">
                  {categoryScores.map((category, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${theme.borderColors.primary}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium ${theme.textColors.primary}`}>
                          {category.category}
                        </span>
                        <span className={`text-sm ${theme.textColors.secondary}`}>
                          {category.score}/{category.total}
                        </span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Results */}
              <div>
                <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
                  Question Review
                </h3>
                <div className="space-y-4">
                  {quizQuestions.map((question, index) => {
                    const userAnswer = selectedAnswers[index];
                    const isCorrect = userAnswer === question.correctAnswer;
                    
                    return (
                      <div key={index} className={`p-4 rounded-lg border ${
                        isCorrect ? theme.status.success.border : theme.status.error.border
                      }`}>
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle className={`w-5 h-5 ${theme.status.success.text} mt-0.5`} />
                          ) : (
                            <XCircle className={`w-5 h-5 ${theme.status.error.text} mt-0.5`} />
                          )}
                          <div className="flex-1">
                            <p className={`font-medium ${theme.textColors.primary} mb-2`}>
                              {question.question}
                            </p>
                            <p className={`text-sm ${isCorrect ? theme.status.success.text : theme.status.error.text} mb-2`}>
                              Your answer: {question.options[userAnswer]}
                            </p>
                            {!isCorrect && (
                              <p className={`text-sm ${theme.status.success.text} mb-2`}>
                                Correct answer: {question.options[question.correctAnswer]}
                              </p>
                            )}
                            <p className={`text-sm ${theme.textColors.secondary}`}>
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Button
                  onClick={restartQuiz}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Quiz
                </Button>
                {passed && (
                  <Button
                    onClick={() => window.location.href = '/chapter11'}
                    className={theme.buttons.primary}
                  >
                    Continue to Chapter 11
                    <TrendingUp className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 ${theme.status.info.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <Brain className={`w-8 h-8 ${theme.status.info.text}`} />
          </div>
          <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
            Tax Optimization Knowledge Check
          </h1>
          <p className={`${theme.textColors.secondary} max-w-2xl mx-auto mb-4`}>
            Test your understanding of tax-advantaged accounts, deductions, and strategic tax planning.
          </p>
          <div className={`text-sm ${theme.textColors.muted}`}>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className={`${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme.textColors.muted}`}>
                {currentQ.category}
              </span>
              <span className={`text-sm ${theme.textColors.muted}`}>
                {currentQuestion + 1}/{quizQuestions.length}
              </span>
            </div>
            <CardTitle className={`text-xl ${theme.textColors.primary}`}>
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                    selectedAnswers[currentQuestion] === index
                      ? `${theme.status.info.border} ${theme.status.info.bg}/20`
                      : `${theme.borderColors.primary} hover:border-slate-400`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestion] === index
                        ? `${theme.status.info.border} ${theme.status.info.bg}`
                        : theme.borderColors.primary
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <CheckCircle className={`w-4 h-4 ${theme.status.info.text}`} />
                      )}
                    </div>
                    <span className={theme.textColors.primary}>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-700">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {quizQuestions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      selectedAnswers[index] !== -1
                        ? theme.status.success.bg
                        : index === currentQuestion
                        ? theme.status.info.bg
                        : theme.backgrounds.cardDisabled
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={!isAnswered}
                className={theme.buttons.primary}
              >
                {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className={`text-center text-sm ${theme.textColors.muted}`}>
          Need 80% to unlock Chapter 11 • You can retake this quiz anytime
        </div>
      </motion.div>
    </div>
  );
}
