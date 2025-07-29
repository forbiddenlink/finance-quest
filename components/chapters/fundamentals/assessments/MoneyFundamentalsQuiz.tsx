'use client';

import { useState } from 'react';
import { useProgressActions } from '@/lib/context/ProgressContext';

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
  const { recordQuizScore, addStrugglingTopic, removeStrugglingTopic } = useProgressActions();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(quizQuestions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

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
    recordQuizScore('money-fundamentals-quiz', percentage);

    // Track struggling topics
    selectedAnswers.forEach((answer, index) => {
      const question = quizQuestions[index];
      if (answer !== question.correctAnswer) {
        // Add struggling topics based on wrong answers
        if (index === 0) addStrugglingTopic('gross-vs-net-pay');
        if (index === 1) addStrugglingTopic('fica-taxes');
        if (index === 2) addStrugglingTopic('banking-basics');
        if (index === 3) addStrugglingTopic('paycheck-calculations');
        if (index === 4) addStrugglingTopic('fdic-insurance');
      } else {
        // Remove from struggling topics if they got it right
        if (index === 0) removeStrugglingTopic('gross-vs-net-pay');
        if (index === 1) removeStrugglingTopic('fica-taxes');
        if (index === 2) removeStrugglingTopic('banking-basics');
        if (index === 3) removeStrugglingTopic('paycheck-calculations');
        if (index === 4) removeStrugglingTopic('fdic-insurance');
      }
    });

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Results</h2>
          <div className={`text-6xl font-bold mb-4 ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {percentage}%
          </div>
          <p className="text-xl text-gray-700 mb-6">
            You got {score} out of {quizQuestions.length} questions correct
          </p>

          {passed ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">🎉 Congratulations!</h3>
              <p className="text-green-800">
                You've mastered the fundamentals of money! You can now proceed to Chapter 2: Budgeting Mastery.
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Keep Learning!</h3>
              <p className="text-red-800">
                You need 80% to unlock the next chapter. Review the lessons and try again when you're ready.
              </p>
            </div>
          )}

          <div className="flex space-x-4 justify-center">
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Retake Quiz
            </button>
            {passed && (
              <button className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                Continue to Chapter 2
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-t-lg">
        <div 
          className="bg-purple-500 h-2 rounded-t-lg transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-600">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm text-gray-500">
              Money Fundamentals Quiz
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{question.question}</h2>
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
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
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
          <div className={`mb-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className={`font-semibold mb-2 ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
              {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </h3>
            <p className={isCorrect ? 'text-green-800' : 'text-red-800'}>
              {question.explanation}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex space-x-3">
            {selectedAnswer !== -1 && !showExplanation && (
              <button
                onClick={checkAnswer}
                className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              >
                Check Answer
              </button>
            )}
            {showExplanation && (
              <button
                onClick={nextQuestion}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
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
