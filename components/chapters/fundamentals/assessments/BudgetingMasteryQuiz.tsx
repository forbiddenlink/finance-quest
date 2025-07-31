'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Target, TrendingUp, PiggyBank } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

interface BudgetingMasteryQuizProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the primary principle of zero-based budgeting?",
    options: [
      "Every dollar should have a specific purpose assigned",
      "You should never spend more than you earn",
      "All expenses should be reduced to zero",
      "Only essential expenses should be included"
    ],
    correct: "Every dollar should have a specific purpose assigned",
    explanation: "Zero-based budgeting means every dollar of income is allocated to a specific category (spending, saving, or debt payment) so that income minus all allocated dollars equals zero."
  },
  {
    id: 2,
    question: "According to the 50/30/20 budgeting rule, what percentage should go to wants?",
    options: ["20%", "30%", "50%", "40%"],
    correct: "30%",
    explanation: "The 50/30/20 rule allocates 50% to needs, 30% to wants, and 20% to savings and debt repayment."
  },
  {
    id: 3,
    question: "Which expense category should you prioritize first in your budget?",
    options: [
      "Entertainment and hobbies",
      "Essential needs (housing, utilities, food)",
      "Vacation savings",
      "New clothing purchases"
    ],
    correct: "Essential needs (housing, utilities, food)",
    explanation: "Essential needs should always be prioritized first as they are necessary for basic survival and maintaining your livelihood."
  },
  {
    id: 4,
    question: "What is a recommended timeframe for emergency fund coverage?",
    options: ["1-2 months", "3-6 months", "12-18 months", "2-3 years"],
    correct: "3-6 months",
    explanation: "Financial experts recommend 3-6 months of living expenses in an emergency fund to cover unexpected job loss or major expenses."
  },
  {
    id: 5,
    question: "Which budgeting method involves using cash for variable expenses?",
    options: [
      "Zero-based budgeting",
      "Percentage-based budgeting",
      "Envelope method",
      "Pay-yourself-first method"
    ],
    correct: "Envelope method",
    explanation: "The envelope method involves allocating cash to different envelopes for variable expenses like groceries, entertainment, and personal care."
  },
  {
    id: 6,
    question: "How often should you review and adjust your budget?",
    options: ["Once a year", "Every 6 months", "Monthly", "Only when income changes"],
    correct: "Monthly",
    explanation: "Monthly budget reviews allow you to track progress, adjust for changing circumstances, and optimize your financial plan."
  },
  {
    id: 7,
    question: "What should you do first when your expenses exceed your income?",
    options: [
      "Use credit cards to cover the difference",
      "Reduce variable expenses like entertainment",
      "Take out a personal loan",
      "Ignore it for now"
    ],
    correct: "Reduce variable expenses like entertainment",
    explanation: "When expenses exceed income, the first step is to cut non-essential variable expenses before considering other options."
  },
  {
    id: 8,
    question: "Which automation strategy is most effective for saving money?",
    options: [
      "Manually transferring money when you remember",
      "Setting up automatic transfers to savings right after payday",
      "Saving whatever is left at the end of the month",
      "Using credit card rewards for savings"
    ],
    correct: "Setting up automatic transfers to savings right after payday",
    explanation: "Automating savings transfers right after payday ensures you 'pay yourself first' before spending on other things."
  },
  {
    id: 9,
    question: "What is lifestyle inflation?",
    options: [
      "The general increase in cost of living",
      "Increasing spending as income increases",
      "Borrowing money for luxury items",
      "Spending more during holidays"
    ],
    correct: "Increasing spending as income increases",
    explanation: "Lifestyle inflation occurs when spending increases proportionally (or more) as income rises, preventing wealth accumulation."
  },
  {
    id: 10,
    question: "Which budget category should include both minimum payments and extra payments?",
    options: ["Housing", "Transportation", "Debt repayment", "Entertainment"],
    correct: "Debt repayment",
    explanation: "Your debt repayment budget should include minimum required payments plus any extra payments to accelerate debt elimination."
  }
];

export default function BudgetingMasteryQuiz({ onComplete }: BudgetingMasteryQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);

  const { recordQuizScore } = useProgressStore();

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return answer === quizQuestions[index].correct ? count + 1 : count;
    }, 0);

    const finalScore = Math.round((correctAnswers / quizQuestions.length) * 100);
    setScore(finalScore);
    setIsComplete(true);

    // Record in progress store
    recordQuizScore('chapter6-quiz', finalScore, quizQuestions.length);

    // Call completion callback
    if (onComplete) {
      onComplete(finalScore, quizQuestions.length);
    }
  };

  const currentQ = quizQuestions[currentQuestion];
  const isCorrect = selectedAnswers[currentQuestion] === currentQ?.correct;
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (isComplete) {
    const passed = score >= 80;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-8"
      >
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-8 text-center`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              passed ? theme.status.success.bg : theme.status.warning.bg
            }`}
          >
            {passed ? (
              <CheckCircle className={`w-10 h-10 ${theme.status.success.text}`} />
            ) : (
              <Target className={`w-10 h-10 ${theme.status.warning.text}`} />
            )}
          </motion.div>

          <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-4`}>
            Quiz {passed ? 'Completed!' : 'Needs Review'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`${theme.backgrounds.card} p-4 rounded-lg`}>
              <div className={`${theme.typography.small} ${theme.textColors.secondary} mb-1`}>Your Score</div>
              <div className={`${theme.typography.heading3} ${passed ? theme.textColors.success : theme.textColors.warning}`}>
                {score}%
              </div>
            </div>
            <div className={`${theme.backgrounds.card} p-4 rounded-lg`}>
              <div className={`${theme.typography.small} ${theme.textColors.secondary} mb-1`}>Correct Answers</div>
              <div className={`${theme.typography.heading3} ${theme.textColors.primary}`}>
                {Math.round((score / 100) * quizQuestions.length)}/{quizQuestions.length}
              </div>
            </div>
            <div className={`${theme.backgrounds.card} p-4 rounded-lg`}>
              <div className={`${theme.typography.small} ${theme.textColors.secondary} mb-1`}>Result</div>
              <div className={`${theme.typography.heading3} ${passed ? theme.textColors.success : theme.textColors.warning}`}>
                {passed ? 'PASSED' : 'REVIEW'}
              </div>
            </div>
          </div>

          <div className={`${passed ? theme.status.success.bg : theme.status.warning.bg} border ${
            passed ? theme.status.success.border : theme.status.warning.border
          } rounded-lg p-6 mb-6`}>
            <p className={`${passed ? theme.status.success.text : theme.status.warning.text} font-medium`}>
              {passed 
                ? "🎉 Excellent! You've mastered budgeting fundamentals and can advance to Chapter 7 (Credit & Lending)."
                : "📚 Keep learning! Review the lesson and try the budget calculator to strengthen your understanding. You need 80% to advance."
              }
            </p>
          </div>

          {passed && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => window.location.href = '/chapter7'}
              className={`${theme.buttons.primary} px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto`}
            >
              Continue to Chapter 7: Credit & Lending
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8"
    >
      {/* Progress Header */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6 mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <PiggyBank className={`w-6 h-6 ${theme.textColors.accent}`} />
            <h2 className={`${theme.typography.heading3} ${theme.textColors.primary}`}>
              Budgeting Mastery Assessment
            </h2>
          </div>
          <div className={`${theme.typography.small} ${theme.textColors.secondary}`}>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </div>
        </div>

        <div className={`w-full ${theme.progress.background} rounded-full h-2 mb-2`}>
          <motion.div
            className={theme.progress.bar}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            style={{ height: '100%', borderRadius: '9999px' }}
          />
        </div>
        <div className={`${theme.typography.small} ${theme.textColors.secondary}`}>
          {Math.round(progress)}% Complete
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-8`}
      >
        <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-6`}>
          {currentQ.question}
        </h3>

        <div className="space-y-3 mb-6">
          {currentQ.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion] === option;
            const isCorrectOption = option === currentQ.correct;
            
            let buttonClass = `w-full p-4 text-left rounded-lg border transition-all ${theme.typography.body}`;
            
            if (!showExplanation) {
              buttonClass += isSelected 
                ? ` ${theme.status.info.bg} ${theme.status.info.border} ${theme.status.info.text}`
                : ` ${theme.backgrounds.card} ${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.backgrounds.cardHover}`;
            } else {
              if (isCorrectOption) {
                buttonClass += ` ${theme.status.success.bg} ${theme.status.success.border} ${theme.status.success.text}`;
              } else if (isSelected && !isCorrectOption) {
                buttonClass += ` ${theme.status.error.bg} ${theme.status.error.border} ${theme.status.error.text}`;
              } else {
                buttonClass += ` ${theme.backgrounds.card} ${theme.borderColors.primary} ${theme.textColors.muted}`;
              }
            }

            return (
              <button
                key={index}
                onClick={() => !showExplanation && handleAnswerSelect(option)}
                disabled={showExplanation}
                className={buttonClass}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    showExplanation && isCorrectOption ? `border-green-400 ${theme.status.success.bg}` :
                    showExplanation && isSelected && !isCorrectOption ? `border-red-400 ${theme.status.error.bg}` :
                    isSelected ? `border-blue-400 ${theme.status.info.bg}` : `${theme.borderColors.muted}`
                  }`}>
                    {(showExplanation && isCorrectOption) || (isSelected && (!showExplanation || isCorrectOption)) ? (
                      <CheckCircle className={`w-4 h-4 ${theme.textColors.primary}`} />
                    ) : null}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${isCorrect ? theme.status.success.bg : theme.status.warning.bg} border ${
              isCorrect ? theme.status.success.border : theme.status.warning.border
            } rounded-lg p-4 mb-6`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className={`w-5 h-5 ${theme.status.success.text} mt-0.5 flex-shrink-0`} />
              ) : (
                <TrendingUp className={`w-5 h-5 ${theme.status.warning.text} mt-0.5 flex-shrink-0`} />
              )}
              <div>
                <p className={`font-medium ${isCorrect ? theme.status.success.text : theme.status.warning.text} mb-2`}>
                  {isCorrect ? 'Correct!' : 'Not quite right.'}
                </p>
                <p className={`${theme.typography.small} ${isCorrect ? theme.status.success.text : theme.status.warning.text}`}>
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {showExplanation && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleNext}
            className={`${theme.buttons.primary} px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ml-auto`}
          >
            {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
