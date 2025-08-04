'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Trophy, RotateCcw, Building } from 'lucide-react';
import { theme } from '@/lib/theme';

interface AlternativeInvestmentsQuizProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What percentage of a portfolio should typically be allocated to alternative investments?",
    options: [
      "1-3%",
      "5-25%", 
      "30-50%",
      "Over 60%"
    ],
    correctAnswer: 1,
    explanation: "Most portfolios benefit from 5-25% allocation to alternative investments, providing diversification without overwhelming the core stock and bond holdings.",
    category: "Portfolio Allocation"
  },
  {
    id: 2,
    question: "What is the primary benefit of REITs in a portfolio?",
    options: [
      "Guaranteed returns",
      "Tax-free dividends",
      "Real estate exposure with liquidity",
      "Protection from all market volatility"
    ],
    correctAnswer: 2,
    explanation: "REITs provide exposure to real estate markets with stock-like liquidity, allowing investors to access property investments without direct ownership complexities.",
    category: "REITs"
  },
  {
    id: 3,
    question: "Which commodity is traditionally viewed as the best store of value during inflation?",
    options: [
      "Oil",
      "Copper",
      "Gold", 
      "Natural gas"
    ],
    correctAnswer: 2,
    explanation: "Gold has historically been viewed as a store of value and inflation hedge, maintaining purchasing power over long periods during inflationary environments.",
    category: "Commodities"
  },
  {
    id: 4,
    question: "What is a key risk of mortgage REITs compared to equity REITs?",
    options: [
      "Lower dividend yields",
      "Interest rate sensitivity",
      "Less liquidity",
      "Higher management fees"
    ],
    correctAnswer: 1,
    explanation: "Mortgage REITs are particularly sensitive to interest rate changes since they finance real estate rather than own it, making their income streams more volatile.",
    category: "REITs"
  },
  {
    id: 5,
    question: "What is the main advantage of commodity ETFs over direct commodity ownership?",
    options: [
      "Higher returns",
      "Tax advantages",
      "Liquidity and convenience",
      "Lower risk"
    ],
    correctAnswer: 2,
    explanation: "Commodity ETFs provide easy, liquid exposure to commodities without the storage, insurance, and logistical challenges of owning physical commodities.",
    category: "Commodities"
  },
  {
    id: 6,
    question: "Which characteristic is most important when evaluating cryptocurrency investments?",
    options: [
      "Social media popularity",
      "Price volatility tolerance",
      "Celebrity endorsements",
      "Mining difficulty"
    ],
    correctAnswer: 1,
    explanation: "Price volatility tolerance is crucial for cryptocurrency investments, as these assets can experience extreme price swings that may not be suitable for all investors.",
    category: "Cryptocurrency"
  },
  {
    id: 7,
    question: "What is the typical dividend yield range for REITs?",
    options: [
      "1-2%",
      "2-3%",
      "4-8%",
      "10-15%"
    ],
    correctAnswer: 2,
    explanation: "REITs typically yield 4-8% annually, higher than most dividend stocks, due to their requirement to distribute at least 90% of taxable income to shareholders.",
    category: "REITs"
  },
  {
    id: 8,
    question: "Which alternative investment typically has the lowest correlation with traditional stocks?",
    options: [
      "REITs",
      "Commodities",
      "High-yield bonds",
      "International stocks"
    ],
    correctAnswer: 1,
    explanation: "Commodities typically have the lowest correlation with traditional stocks, as they respond to different economic drivers like supply/demand fundamentals and inflation.",
    category: "Portfolio Theory"
  },
  {
    id: 9,
    question: "What is a key consideration when investing in physical gold?",
    options: [
      "Daily price monitoring",
      "Storage and insurance costs",
      "Tax-free status",
      "Guaranteed liquidity"
    ],
    correctAnswer: 1,
    explanation: "Physical gold requires secure storage and insurance, which adds ongoing costs that must be factored into the investment return calculation.",
    category: "Commodities"
  },
  {
    id: 10,
    question: "Which is the most appropriate first step into alternative investments for most investors?",
    options: [
      "Buying physical real estate",
      "Direct commodity futures trading",
      "Broad-based REIT or commodity ETFs",
      "Private equity investments"
    ],
    correctAnswer: 2,
    explanation: "Broad-based ETFs provide diversified, liquid, and cost-effective exposure to alternative asset classes, making them ideal starting points for most investors.",
    category: "Investment Strategy"
  }
];

const AlternativeInvestmentsQuiz: React.FC<AlternativeInvestmentsQuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
    onComplete?.(correctCount, questions.length);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "Excellent! You have mastered alternative investment concepts.";
    if (percentage >= 80) return "Great job! You understand alternative investment fundamentals well.";
    if (percentage >= 70) return "Good work! Review the areas you missed to strengthen your knowledge.";
    if (percentage >= 60) return "You&apos;re making progress. Consider reviewing the lesson materials.";
    return "Keep studying! Alternative investments require careful understanding.";
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className={`inline-flex items-center justify-center w-20 h-20 ${theme.backgrounds.glass} rounded-full border ${theme.borderColors.primary} mb-6`}>
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
            Quiz Complete!
          </h2>
          <div className={`text-6xl font-bold ${getScoreColor(score, questions.length)} mb-4`}>
            {score}/{questions.length}
          </div>
          <div className={`text-xl ${theme.textColors.secondary} mb-6`}>
            {Math.round((score / questions.length) * 100)}% Correct
          </div>
          <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto mb-8`}>
            {getScoreMessage(score, questions.length)}
          </p>
        </motion.div>

        {/* Detailed Results */}
        <div className="space-y-6 mb-8">
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-4`}>Review Your Answers</h3>
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <Card key={question.id} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    Question {index + 1}
                    <span className="ml-auto text-sm text-gray-400">
                      {question.category}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`${theme.textColors.secondary} mb-4`}>{question.question}</p>
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border ${
                          optionIndex === question.correctAnswer
                            ? 'border-green-400 bg-green-400/10'
                            : optionIndex === userAnswer && !isCorrect
                            ? 'border-red-400 bg-red-400/10'
                            : 'border-white/10'
                        }`}
                      >
                        <span className={theme.textColors.secondary}>{option}</span>
                        {optionIndex === question.correctAnswer && (
                          <span className="ml-2 text-green-400 text-sm">✓ Correct</span>
                        )}
                        {optionIndex === userAnswer && !isCorrect && (
                          <span className="ml-2 text-red-400 text-sm">✗ Your answer</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50/10 border border-blue-200/20 rounded-lg p-4">
                    <p className="text-blue-300 text-sm font-medium mb-1">Explanation:</p>
                    <p className={`${theme.textColors.secondary} text-sm`}>{question.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button onClick={resetQuiz} className="bg-blue-600 hover:bg-blue-700">
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold ${theme.textColors.primary} flex items-center gap-2`}>
            <Building className="w-6 h-6" />
            Alternative Investments Quiz
          </h2>
          <span className={`text-sm ${theme.textColors.secondary}`}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="mb-2" />
        <div className="flex justify-between text-sm text-gray-400">
          <span>{Math.round(progress)}% Complete</span>
          <span>{currentQ.category}</span>
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} mb-8`}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} text-xl`}>
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                    selectedAnswers[currentQuestion] === index
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
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
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
          disabled={selectedAnswers[currentQuestion] === undefined}
          className={
            currentQuestion === questions.length - 1
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};

export default AlternativeInvestmentsQuiz;
