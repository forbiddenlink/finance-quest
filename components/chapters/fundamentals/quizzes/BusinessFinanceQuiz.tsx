'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw, Building2 } from 'lucide-react';
import { theme } from '@/lib/theme';

interface BusinessFinanceQuizProps {
  onComplete?: (score: number) => void;
}

const BusinessFinanceQuiz: React.FC<BusinessFinanceQuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      question: "Which financial statement shows a company's revenues, expenses, and profit over a specific period?",
      options: [
        "Balance Sheet",
        "Income Statement",
        "Cash Flow Statement",
        "Statement of Equity"
      ],
      correct: 1,
      explanation: "The Income Statement (also called Profit & Loss Statement) shows revenues, expenses, and net income over a specific time period, providing a snapshot of the company's profitability."
    },
    {
      id: 2,
      question: "What is the primary advantage of the DCF (Discounted Cash Flow) valuation method?",
      options: [
        "It's the quickest valuation method",
        "It focuses on future cash generating ability",
        "It requires minimal financial data",
        "It works best for startups without revenue"
      ],
      correct: 1,
      explanation: "DCF values a business based on its projected future cash flows discounted to present value, making it the most comprehensive method for valuing cash-generating businesses."
    },
    {
      id: 3,
      question: "In startup funding, what typically happens to founder equity percentage with each funding round?",
      options: [
        "It stays the same",
        "It increases",
        "It gets diluted (decreases)",
        "It depends on the business model"
      ],
      correct: 2,
      explanation: "Each funding round dilutes existing shareholders' ownership percentage as new shares are issued to investors, though the absolute value of founder equity may increase if valuation grows sufficiently."
    },
    {
      id: 4,
      question: "What is the break-even point in business finance?",
      options: [
        "When revenue equals total assets",
        "When profit margin reaches 20%",
        "When total revenue equals total costs",
        "When cash flow becomes positive"
      ],
      correct: 2,
      explanation: "The break-even point is when total revenue equals total costs (fixed + variable), meaning the business is neither making a profit nor losing money."
    },
    {
      id: 5,
      question: "Which funding stage typically involves the largest investment amounts?",
      options: [
        "Pre-seed",
        "Seed",
        "Series A",
        "Series B and beyond"
      ],
      correct: 3,
      explanation: "Series B and later funding rounds typically involve the largest investment amounts as companies scale operations, expand markets, and require substantial capital for growth."
    },
    {
      id: 6,
      question: "What does a Price-to-Earnings (P/E) ratio measure in business valuation?",
      options: [
        "How much investors pay per dollar of earnings",
        "The company's debt-to-equity ratio",
        "Annual revenue growth rate",
        "Cash flow efficiency"
      ],
      correct: 0,
      explanation: "P/E ratio measures how much investors are willing to pay for each dollar of the company's earnings, indicating market expectations and valuation relative to profitability."
    },
    {
      id: 7,
      question: "In cash flow management, what is working capital?",
      options: [
        "Total cash in bank accounts",
        "Current assets minus current liabilities",
        "Annual operating expenses",
        "Long-term debt obligations"
      ],
      correct: 1,
      explanation: "Working capital is current assets minus current liabilities, representing the short-term liquidity available to fund day-to-day operations."
    },
    {
      id: 8,
      question: "What is typically the primary goal of angel investors?",
      options: [
        "Guaranteed returns with low risk",
        "High growth potential with equity upside",
        "Steady dividend income",
        "Tax deduction benefits"
      ],
      correct: 1,
      explanation: "Angel investors typically seek high growth potential companies where they can provide capital in exchange for equity, hoping for significant returns through future exits or acquisitions."
    },
    {
      id: 9,
      question: "Which business model generates recurring revenue streams?",
      options: [
        "One-time product sales",
        "Subscription model",
        "Commission-based model",
        "Advertising revenue model"
      ],
      correct: 1,
      explanation: "Subscription models generate recurring revenue streams as customers pay regularly (monthly/annually) for continued access to products or services, providing predictable income."
    },
    {
      id: 10,
      question: "What is the primary purpose of a business financial projection?",
      options: [
        "To guarantee future performance",
        "To plan and prepare for various scenarios",
        "To impress potential investors only",
        "To calculate exact future profits"
      ],
      correct: 1,
      explanation: "Financial projections help businesses plan for the future, prepare for various scenarios, make informed decisions, and communicate strategy to stakeholders, though they are estimates, not guarantees."
    }
  ];

  const handleAnswerSelect = (questionIndex: number, answerIndex: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    const correctAnswers = questions.reduce((count, question, index) => {
      const selectedAnswer = selectedAnswers[index];
      return selectedAnswer && parseInt(selectedAnswer) === question.correct ? count + 1 : count;
    }, 0);

    const scorePercentage = (correctAnswers / questions.length) * 100;
    onComplete?.(scorePercentage);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Outstanding! You've mastered business finance fundamentals.";
    if (score >= 80) return "Great job! You have a solid understanding of business finance.";
    if (score >= 70) return "Good work! Review the missed concepts to strengthen your knowledge.";
    if (score >= 60) return "Fair attempt. Consider reviewing the lesson materials for better understanding.";
    return "Needs improvement. Please review the lesson carefully and retake the quiz.";
  };

  if (showResults) {
    const correctAnswers = questions.reduce((count, question, index) => {
      const selectedAnswer = selectedAnswers[index];
      return selectedAnswer && parseInt(selectedAnswer) === question.correct ? count + 1 : count;
    }, 0);
    const scorePercentage = Math.round((correctAnswers / questions.length) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
          <CardHeader className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.backgrounds.glass} rounded-full border ${theme.borderColors.primary} mb-4 mx-auto`}>
              <Building2 className="w-8 h-8 text-blue-400" />
            </div>
            <CardTitle className={`text-3xl font-bold ${theme.textColors.primary}`}>
              Quiz Complete!
            </CardTitle>
            <div className={`text-6xl font-bold ${getScoreColor(scorePercentage)} my-4`}>
              {scorePercentage}%
            </div>
            <p className={`text-lg ${theme.textColors.secondary}`}>
              {getScoreMessage(scorePercentage)}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className={`text-lg ${theme.textColors.secondary} mb-4`}>
                You got <span className="text-blue-400 font-semibold">{correctAnswers}</span> out of{' '}
                <span className="text-blue-400 font-semibold">{questions.length}</span> questions correct.
              </p>
            </div>

            {scorePercentage >= 80 && (
              <div className={`p-4 ${theme.backgrounds.glass} border border-green-200/20 rounded-lg`}>
                <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                  <CheckCircle className="w-5 h-5" />
                  Congratulations!
                </div>
                <p className={theme.textColors.secondary}>
                  You&apos;ve demonstrated strong understanding of business finance fundamentals and are ready for the next chapter!
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>Review Your Answers</h3>
              {questions.map((question, index) => {
                const selectedAnswer = selectedAnswers[index];
                const isCorrect = selectedAnswer && parseInt(selectedAnswer) === question.correct;
                
                return (
                  <Card key={question.id} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className={`font-medium ${theme.textColors.primary}`}>
                            Question {index + 1}: {question.question}
                          </p>
                          <p className={`text-sm mt-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            Your answer: {question.options[parseInt(selectedAnswer || '0')]}
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-400 mt-1">
                              Correct answer: {question.options[question.correct]}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className={`text-sm ${theme.textColors.secondary}`}>
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center pt-6">
              <Button onClick={resetQuiz} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-2xl font-bold ${theme.textColors.primary}`}>
            Business Finance Quiz
          </h1>
          <span className={`text-sm ${theme.textColors.secondary}`}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="mb-2" />
        <p className={`text-sm ${theme.textColors.secondary}`}>
          {Math.round(progress)}% Complete
        </p>
      </div>

      <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
        <CardHeader>
          <CardTitle className={`text-xl ${theme.textColors.primary}`}>
            {currentQ.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index.toString())}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                  selectedAnswers[currentQuestion] === index.toString()
                    ? 'border-blue-400 bg-blue-400/10 text-white'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-300'
                }`}
              >
                <span className="font-medium mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestion]}
          className={currentQuestion === questions.length - 1 ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>
    </motion.div>
  );
};

export default BusinessFinanceQuiz;
