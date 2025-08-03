'use client';

import { useState } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
;
import SuccessCelebration from '@/components/shared/ui/SuccessCelebration';
import { CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { theme } from '@/lib/theme';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the difference between gross pay and net pay?",
    options: [
      "Gross pay is after taxes, net pay is before taxes",
      "Gross pay is before taxes, net pay is after taxes",
      "They are the same thing",
      "Gross pay is monthly, net pay is yearly"
    ],
    correctAnswer: 1,
    explanation: "Gross pay is your total earnings before any deductions (taxes, insurance, etc.). Net pay is what you actually take home after all deductions."
  },
  {
    id: 2,
    question: "What does FICA stand for and what does it fund?",
    options: [
      "Federal Income Credit Association - funds tax credits",
      "Financial Insurance Coverage Act - funds bank insurance",
      "Federal Insurance Contributions Act - funds Social Security and Medicare",
      "Federal Income Collection Agency - funds government operations"
    ],
    correctAnswer: 2,
    explanation: "FICA (Federal Insurance Contributions Act) taxes fund Social Security (6.2%) and Medicare (1.45%). These programs provide retirement and healthcare benefits."
  },
  {
    id: 3,
    question: "Which type of bank account is best for daily expenses and bill paying?",
    options: [
      "Savings account",
      "Checking account",
      "Certificate of deposit",
      "Money market account"
    ],
    correctAnswer: 1,
    explanation: "Checking accounts are designed for frequent transactions like paying bills, making purchases, and daily expenses. They typically offer easy access through debit cards and checks."
  },
  {
    id: 4,
    question: "If you earn $5,000 gross pay monthly, approximately what would your net pay be?",
    options: [
      "$5,000 (same as gross)",
      "$2,500 (50% of gross)",
      "$3,750-$4,000 (75-80% of gross)",
      "$4,500 (90% of gross)"
    ],
    correctAnswer: 2,
    explanation: "Most people take home about 75-80% of their gross pay after federal taxes, state taxes, Social Security, Medicare, and other deductions."
  },
  {
    id: 5,
    question: "What protects your money in FDIC-insured banks?",
    options: [
      "The bank's private insurance",
      "Federal government insurance up to $250,000 per depositor",
      "State government insurance up to $100,000",
      "No protection - you take the risk"
    ],
    correctAnswer: 1,
    explanation: "FDIC (Federal Deposit Insurance Corporation) protects deposits up to $250,000 per depositor, per bank. This means your money is safe even if the bank fails."
  }
];

export default function MoneyFundamentalsQuiz() {
  const { recordQuizScore } = useProgressStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(quizQuestions.length).fill(-1));
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
    if (currentQuestion < quizQuestions.length - 1) {
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
      if (answer === quizQuestions[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quizQuestions.length).fill(-1));
    setShowResults(false);
    setShowExplanation(false);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const passed = percentage >= 80;

    // Record the quiz score
    recordQuizScore('money-fundamentals-quiz', score, quizQuestions.length);

    // Show celebration for passing
    if (passed) {
      setShowCelebration(true);
    }

    return (
      <>
        <SuccessCelebration
          show={showCelebration}
          title="Quiz Mastered!"
          message={`Amazing! You scored ${percentage}% and unlocked Chapter 2!`}
          onComplete={() => setShowCelebration(false)}
          type="quiz"
        />

        <div className={`max-w-2xl mx-auto ${theme.backgrounds.card} rounded-lg shadow-lg p-8 animate-fade-in-up`}>
          <div className="text-center">
            <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>Quiz Results</h2>
            <div className={`text-6xl font-bold mb-4 ${passed ? theme.status.success.text : theme.status.error.text}`}>
              {percentage}%
            </div>
            <p className={`text-xl ${theme.textColors.secondary} mb-6`}>
              You got {score} out of {quizQuestions.length} questions correct
            </p>

            {passed ? (
              <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-6 mb-6`}>
                <h3 className={`text-lg font-semibold ${theme.status.success.text} mb-2 flex items-center gap-2`}>
                  <Sparkles className="w-5 h-5" />
                  Congratulations!
                </h3>
                <p className={theme.status.success.text}>
                  You&apos;ve mastered the fundamentals of money! You can now proceed to Chapter 2: Budgeting Mastery.
                </p>
              </div>
            ) : (
              <div className={`${theme.status.error.bg} border ${theme.status.error.border} rounded-lg p-6 mb-6`}>
                <h3 className={`text-lg font-semibold ${theme.status.error.text} mb-2`}>Keep Learning!</h3>
                <p className={theme.status.error.text}>
                  You need 80% to unlock the next chapter. Review the lessons and try again when you&apos;re ready.
                </p>
              </div>
            )}

            <div className="flex space-x-4 justify-center">
              <button
                onClick={resetQuiz}
                className={`px-6 py-3 ${theme.buttons.primary} rounded-md transition-colors`}
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

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className={`max-w-2xl mx-auto ${theme.backgrounds.card} rounded-lg shadow-lg`}>
      {/* Progress Bar */}
      <div className={`${theme.backgrounds.disabled} rounded-t-lg`}>
        <div
          className={`${theme.status.info.bg} h-2 rounded-t-lg transition-all duration-300`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${theme.textColors.primary}`}>
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className={`text-sm ${theme.textColors.muted}`}>
              Money Fundamentals Quiz
            </span>
          </div>
          <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>{question.question}</h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${selectedAnswer === index
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

        {/* Explanation */}
        {showExplanation && (
          <div className={`mb-6 p-4 rounded-lg ${isCorrect ? `${theme.status.success.bg} border ${theme.status.success.border}` : `${theme.status.error.bg} border ${theme.status.error.border}`}`}>
            <h3 className={`font-semibold mb-2 flex items-center gap-2 ${isCorrect ? theme.status.success.text : theme.status.error.text}`}>
              {isCorrect ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Correct!
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Incorrect
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
                {currentQuestion === quizQuestions.length - 1 ? 'View Results' : 'Next Question'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
