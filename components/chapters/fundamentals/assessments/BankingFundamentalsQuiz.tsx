'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { useProgressActions } from '@/lib/context/ProgressContext';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

interface BankingFundamentalsQuizProps {
  onComplete: (score: number) => void;
}

const BankingFundamentalsQuiz = ({ onComplete }: BankingFundamentalsQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const { recordQuizScore, addStrugglingTopic } = useProgressActions();

  const questions: Question[] = [
    {
      id: 'account-types',
      question: 'Which type of account is BEST for your emergency fund that you want to keep liquid but earning interest?',
      options: [
        'Checking account with 0.01% APY',
        'High-yield savings account with 4.5% APY',
        'Certificate of Deposit (CD) with 5% APY',
        'Investment account with stocks'
      ],
      correctAnswer: 1,
      explanation: 'A high-yield savings account offers the best combination of liquidity (easy access) and earning potential for emergency funds. CDs lock up your money, and investments are too risky for emergency funds.',
      category: 'Account Types'
    },
    {
      id: 'banking-fees',
      question: 'Sarah pays $12/month in account maintenance fees and $35 twice per month in overdraft fees. How much could she save annually by switching to a fee-free account with overdraft protection?',
      options: [
        '$144 per year',
        '$840 per year',
        '$984 per year',
        '$1,200 per year'
      ],
      correctAnswer: 2,
      explanation: 'Monthly maintenance: $12 × 12 = $144. Overdraft fees: $35 × 2 × 12 = $840. Total savings: $144 + $840 = $984 per year. This shows how banking fees can cost nearly $1,000 annually!',
      category: 'Banking Fees'
    },
    {
      id: 'interest-rates',
      question: 'You have $10,000 in savings. Moving from a traditional bank (0.01% APY) to a high-yield online bank (4.5% APY) would earn you approximately how much MORE per year?',
      options: [
        '$45 more per year',
        '$200 more per year',
        '$449 more per year',
        '$450 more per year'
      ],
      correctAnswer: 2,
      explanation: 'Traditional bank: $10,000 × 0.01% = $1. High-yield bank: $10,000 × 4.5% = $450. Difference: $450 - $1 = $449 more per year. This is why choosing the right bank matters!',
      category: 'Interest Rates'
    },
    {
      id: 'fdic-insurance',
      question: 'FDIC insurance protects your deposits up to what amount per depositor, per bank?',
      options: [
        '$100,000',
        '$250,000',
        '$500,000',
        '$1,000,000'
      ],
      correctAnswer: 1,
      explanation: 'FDIC insurance protects up to $250,000 per depositor, per insured bank. This means your money is safe even if the bank fails, as long as you stay under this limit.',
      category: 'Banking Safety'
    },
    {
      id: 'optimal-setup',
      question: 'What is the most effective banking setup for someone starting their financial journey?',
      options: [
        'One checking account at a major national bank',
        'Multiple accounts at the same bank for convenience',
        'A checking account at a local bank + high-yield savings at an online bank',
        'All accounts at online banks only'
      ],
      correctAnswer: 2,
      explanation: 'The optimal setup combines local convenience (checking at local bank/credit union) with earning power (high-yield savings online). This gives you ATM access, in-person service, AND the best interest rates.',
      category: 'Account Optimization'
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
    setQuizComplete(true);
    const score = calculateScore();
    const scorePercentage = Math.round(score * 100);

    // Record quiz score in progress tracking
    recordQuizScore('banking-fundamentals', scorePercentage);

    // Track struggling topics for scores below 80%
    if (scorePercentage < 80) {
      const incorrectQuestions = questions.filter((question, index) =>
        selectedAnswers[index] !== question.correctAnswer
      );
      incorrectQuestions.forEach(question => {
        addStrugglingTopic(question.category);
      });
    }

    onComplete(score);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct / questions.length;
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizComplete(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.8) return 'text-blue-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 0.9) return 'Excellent! You\'re ready to optimize your banking setup! 🎉';
    if (score >= 0.8) return 'Great job! You understand banking fundamentals well! 👏';
    if (score >= 0.7) return 'Good work! Review the areas you missed and try again. 📚';
    return 'Keep learning! Banking mastery takes practice. Try the lesson again! 💪';
  };

  if (showResults) {
    const score = calculateScore();
    const correctAnswers = Math.round(score * questions.length);

    return (
      <motion.div
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8" />
            <h2 className="text-3xl font-bold">
              {quizComplete ? 'Quiz Complete!' : 'Banking Fundamentals Quiz'}
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(score)}`}>
              {Math.round(score * 100)}%
            </div>
            <div className="text-xl text-gray-600 mb-2">
              {correctAnswers} out of {questions.length} correct
            </div>
            <div className="text-lg text-gray-700">
              {getScoreMessage(score)}
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Review Your Answers</h3>
            {questions.map((question, index) => {
              const isCorrect = selectedAnswers[index] === question.correctAnswer;
              const userAnswer = selectedAnswers[index];

              return (
                <motion.div
                  key={question.id}
                  className={`border rounded-lg p-4 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-2">{question.question}</h4>
                      {userAnswer !== null && (
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Your answer:</span> {question.options[userAnswer]}
                        </div>
                      )}
                      {!isCorrect && (
                        <div className="text-sm text-green-700 mb-2">
                          <span className="font-medium">Correct answer:</span> {question.options[question.correctAnswer]}
                        </div>
                      )}
                      <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                        <span className="font-medium">Explanation:</span> {question.explanation}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={restartQuiz}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Quiz
            </motion.button>

            {score >= 0.85 && (
              <motion.button
                onClick={() => window.location.href = '/chapter3'}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue to Chapter 3
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            )}
          </div>

          {score < 0.85 && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-center">
                <strong>Almost there!</strong> You need 85% or higher to unlock the next chapter.
                Review the explanations above and try again!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Banking Fundamentals Quiz</h2>
          <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <div className="w-full bg-white/20 rounded-full h-2">
          <motion.div
            className="bg-white h-2 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <div className="text-sm text-blue-600 font-medium mb-2">{currentQ.category}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">{currentQ.question}</h3>
            </div>

            <div className="space-y-3 mb-8">
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${selectedAnswers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                      }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                    <span className="ml-2">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {selectedAnswers[currentQuestion] !== null ? 'Answer selected' : 'Select an answer to continue'}
        </div>

        <motion.button
          onClick={nextQuestion}
          disabled={selectedAnswers[currentQuestion] === null}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          whileHover={{ scale: selectedAnswers[currentQuestion] !== null ? 1.05 : 1 }}
          whileTap={{ scale: selectedAnswers[currentQuestion] !== null ? 0.95 : 1 }}
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BankingFundamentalsQuiz;
