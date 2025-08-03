'use client';

import { useState } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import toast from 'react-hot-toast';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  RotateCcw,
  PieChart,
  Target,
  Award,
  TrendingUp
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: 'budgeting-basics' | 'cash-flow' | 'categories' | 'irregular-expenses' | 'automation';
}

interface QuizProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Jamie earns $5,000 monthly after taxes. Using the 50/30/20 rule, how much should she allocate to wants?",
    options: [
      "$1,000 (20% for lifestyle flexibility)",
      "$1,500 (30% for entertainment and non-essentials)",
      "$2,000 (40% to enjoy life fully)",
      "$2,500 (50% because you work hard)"
    ],
    correct: 1,
    explanation: "The 50/30/20 rule allocates 30% to wants. $5,000 × 30% = $1,500 for dining out, entertainment, hobbies, and non-essential purchases. This balances enjoyment with financial goals.",
    category: 'budgeting-basics'
  },
  {
    id: 2,
    question: "In zero-based budgeting, what should your income minus all planned expenses equal?",
    options: [
      "A positive number for flexibility",
      "Zero (every dollar assigned a purpose)",
      "10% buffer for unexpected expenses",
      "Whatever is left over for fun"
    ],
    correct: 1,
    explanation: "Zero-based budgeting means Income - All Planned Expenses = $0. Every dollar gets assigned to needs, wants, savings, or debt before spending. This eliminates money 'leaks' and increases control.",
    category: 'budgeting-basics'
  },
  {
    id: 3,
    question: "Alex gets paid on the 15th but rent is due on the 1st. What's the best solution?",
    options: [
      "Use credit cards to bridge the gap",
      "Request rent due date change to the 20th",
      "Take a payday loan for timing issues",
      "Just pay rent late with fees"
    ],
    correct: 1,
    explanation: "Aligning bill due dates with income timing eliminates cash flow stress. Most landlords will change due dates to accommodate tenant cash flow. This prevents overdrafts and late fees.",
    category: 'cash-flow'
  },
  {
    id: 4,
    question: "How much should someone keep in checking as a cash flow timing buffer?",
    options: [
      "Exactly what you need - minimize idle money",
      "1-2 weeks of expenses for timing gaps",
      "One full month of all expenses",
      "Whatever feels comfortable psychologically"
    ],
    correct: 1,
    explanation: "A 1-2 week expense buffer in checking covers timing mismatches between income and bills. This prevents overdrafts while not keeping excessive cash earning low returns.",
    category: 'cash-flow'
  },
  {
    id: 5,
    question: "Which budget category typically causes the most overspending problems?",
    options: [
      "Fixed needs like rent and utilities",
      "Variable needs like groceries and gas",
      "Lifestyle wants like dining and entertainment",
      "Savings and debt payments"
    ],
    correct: 2,
    explanation: "Lifestyle 'wants' cause most budget failures because they're discretionary, emotional, and social. Clear limits and separate 'fun money' accounts help control lifestyle inflation.",
    category: 'categories'
  },
  {
    id: 6,
    question: "Sarah budgets perfectly for monthly expenses but gets hit with a $1,200 car repair. What budgeting concept would have prevented this crisis?",
    options: [
      "Higher emergency fund balance",
      "Sinking fund for car maintenance",
      "Better car insurance coverage",
      "Stricter monthly spending limits"
    ],
    correct: 1,
    explanation: "Sinking funds save monthly for predictable irregular expenses. Cars need ~$1,200/year in repairs on average. Saving $100/month prevents car repair 'emergencies' from destroying budgets.",
    category: 'irregular-expenses'
  },
  {
    id: 7,
    question: "What's the average annual amount most people should budget for car-related irregular expenses?",
    options: [
      "$500 (cars are reliable now)",
      "$800 (basic maintenance only)",
      "$1,200 (repairs, maintenance, registration)",
      "$2,000 (worst-case scenario planning)"
    ],
    correct: 2,
    explanation: "Cars average $1,200/year in repairs, maintenance, registration, and unexpected issues. This equals $100/month in a car sinking fund to avoid budget surprises.",
    category: 'irregular-expenses'
  },
  {
    id: 8,
    question: "Mike manually manages his budget and consistently overspends by $300/month. What's the most effective solution?",
    options: [
      "Try harder to stick to his budget",
      "Reduce all categories by $300",
      "Automate savings and bill payments",
      "Check spending daily instead of weekly"
    ],
    correct: 2,
    explanation: "Automation removes human willpower from budgeting. Automatic transfers to savings and bill payments happen before spending temptation occurs. This typically increases savings rates by 20%.",
    category: 'automation'
  },
  {
    id: 9,
    question: "Which budget categories should be automated first for maximum impact?",
    options: [
      "All variable expenses like groceries and gas",
      "Savings goals and fixed bills like rent",
      "Fun money and entertainment spending",
      "Only debt payments to build good credit"
    ],
    correct: 1,
    explanation: "Automate savings and fixed bills first. Savings automation ensures wealth building happens before spending, while bill automation prevents late fees and builds consistent habits.",
    category: 'automation'
  },
  {
    id: 10,
    question: "Lisa has irregular freelance income ranging from $3,000-$7,000 monthly. How should she budget?",
    options: [
      "Use the average monthly income ($5,000)",
      "Budget based on her best month ($7,000)",
      "Budget based on her worst month ($3,000)",
      "Create different budgets for each income level"
    ],
    correct: 2,
    explanation: "Irregular income requires budgeting for the worst-case scenario ($3,000). Extra income in good months goes to larger emergency fund and accelerated goals, not lifestyle inflation.",
    category: 'cash-flow'
  }
];

export default function BudgetingMasteryQuizEnhanced({ onComplete }: QuizProps) {
  const { recordQuizScore } = useProgressStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showExplanation) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Calculate final score
      const finalScore = userAnswers.reduce((total: number, answer, index) => {
        return total + (answer === questions[index].correct ? 1 : 0);
      }, 0);
      
      const actualFinalScore = selectedAnswer === questions[currentQuestion].correct ? finalScore + 1 : finalScore;
      setScore(actualFinalScore);
      
      setQuizCompleted(true);
      
      // Record the quiz completion
      recordQuizScore('budgeting-mastery-quiz-enhanced', actualFinalScore, questions.length);
      
      // Show completion toast
      if (actualFinalScore >= 8) {
        toast.success('Excellent work! Budgeting mastery achieved! 🏆', { duration: 4000 });
      } else if (actualFinalScore >= 6) {
        toast.success('Good job! You understand the key concepts! 💰', { duration: 4000 });
      } else {
        toast('Review the lessons and try again!', { duration: 4000, icon: '📚' });
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setUserAnswers(new Array(questions.length).fill(null));
    setQuizCompleted(false);
    setScore(0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return theme.status.success.text;
    if (score >= 6) return theme.status.warning.text;
    return theme.status.error.text;
  };

  const getScoreMessage = (score: number) => {
    if (score >= 8) return "Outstanding! You've mastered budgeting and cash flow! 🏆";
    if (score >= 6) return "Great work! You understand the core concepts! 💰";
    return "Review the lessons for better understanding. 📚";
  };

  const calculateCategoryBreakdown = () => {
    const categories = {
      'budgeting-basics': { correct: 0, total: 0, name: 'Budgeting Basics' },
      'cash-flow': { correct: 0, total: 0, name: 'Cash Flow Management' },
      'categories': { correct: 0, total: 0, name: 'Budget Categories' },
      'irregular-expenses': { correct: 0, total: 0, name: 'Irregular Expenses' },
      'automation': { correct: 0, total: 0, name: 'Budget Automation' }
    };

    questions.forEach((question, index) => {
      categories[question.category].total++;
      if (userAnswers[index] === question.correct) {
        categories[question.category].correct++;
      }
    });

    return categories;
  };

  if (quizCompleted) {
    const categoryBreakdown = calculateCategoryBreakdown();
    const percentage = Math.round((score / questions.length) * 100);
    const passed = score >= 8; // 80% passing

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <ProgressRing
            progress={100}
            size={120}
            color={passed ? "#10B981" : "#F59E0B"}
            className="animate-bounce-in"
          />
        </div>

        <GradientCard variant="glass" gradient={passed ? "green" : "yellow"} className="p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 ${passed ? theme.status.success.bg : theme.status.warning.bg} rounded-full mb-4`}>
              {passed ? (
                <Trophy className={`w-8 h-8 ${theme.status.success.text}`} />
              ) : (
                <Target className={`w-8 h-8 ${theme.status.warning.text}`} />
              )}
            </div>
            
            <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
              Quiz Complete!
            </h2>
            
            <div className="mb-6">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
                {score}/{questions.length}
              </div>
              <div className={`text-2xl font-semibold mb-4 ${getScoreColor(score)}`}>
                {percentage}%
              </div>
              <p className={`text-lg ${theme.textColors.secondary}`}>
                {getScoreMessage(score)}
              </p>
            </div>

            {passed && (
              <div className={`inline-flex items-center px-6 py-3 ${theme.status.success.bg} ${theme.status.success.text} rounded-xl font-semibold text-lg mb-6`}>
                <Award className="w-6 h-6 mr-2" />
                Budgeting & Cash Flow Mastery Achieved!
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="mb-8">
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-6 text-center`}>
              Knowledge Area Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categoryBreakdown).map(([key, category]) => {
                const categoryPercentage = category.total > 0 ? Math.round((category.correct / category.total) * 100) : 0;
                const isStrong = categoryPercentage >= 80;
                
                return (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border-2 ${
                      isStrong 
                        ? `${theme.status.success.bg} ${theme.status.success.border}` 
                        : `${theme.status.warning.bg} ${theme.status.warning.border}`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {category.name}
                      </span>
                      {isStrong ? (
                        <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
                      ) : (
                        <AlertCircle className={`w-5 h-5 ${theme.status.warning.text}`} />
                      )}
                    </div>
                    <div className={`text-2xl font-bold ${isStrong ? theme.status.success.text : theme.status.warning.text}`}>
                      {category.correct}/{category.total}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>
                      {categoryPercentage}% correct
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className={`flex items-center justify-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} transition-all`}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Quiz
            </button>
            
            {passed && onComplete && (
              <button
                onClick={() => onComplete(score, questions.length)}
                className={`flex items-center justify-center px-8 py-3 ${theme.buttons.primary} rounded-xl transition-all shadow-lg hover-lift`}
              >
                <PieChart className="w-5 h-5 mr-2" />
                Continue to Next Chapter
              </button>
            )}
          </div>

          {!passed && (
            <div className={`mt-6 p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg text-center`}>
              <p className={`${theme.textColors.secondary} mb-2`}>
                <strong>Need 80% (8/10) to advance to the next chapter.</strong>
              </p>
              <p className={`${theme.textColors.secondary}`}>
                Review the Budgeting & Cash Flow lessons and focus on your weaker areas above.
              </p>
            </div>
          )}
        </GradientCard>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === question.correct;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress */}
      <div className="flex justify-center mb-6">
        <ProgressRing
          progress={progress}
          size={120}
          color="#8B5CF6"
          className="animate-bounce-in"
        />
      </div>

      <GradientCard variant="glass" gradient="purple" className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-medium ${theme.status.info.text}`}>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className={`text-sm ${theme.textColors.muted}`}>
              Budgeting & Cash Flow Quiz
            </span>
          </div>
          
          <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-6`}>
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {question.options.map((option, index) => {
            let buttonClass = `w-full p-4 text-left rounded-xl border-2 transition-all `;
            
            if (!showExplanation) {
              buttonClass += selectedAnswer === index
                ? `${theme.borderColors.primary} ${theme.backgrounds.card}`
                : `${theme.borderColors.muted} hover:${theme.borderColors.primary}`;
            } else {
              if (index === question.correct) {
                buttonClass += `${theme.status.success.bg} ${theme.status.success.border} ${theme.status.success.text}`;
              } else if (index === selectedAnswer && selectedAnswer !== question.correct) {
                buttonClass += `${theme.status.error.bg} ${theme.status.error.border} ${theme.status.error.text}`;
              } else {
                buttonClass += `${theme.borderColors.muted} opacity-50`;
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={buttonClass}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center font-bold ${
                    showExplanation && index === question.correct
                      ? `${theme.status.success.border} ${theme.status.success.text}`
                      : showExplanation && index === selectedAnswer && selectedAnswer !== question.correct
                      ? `${theme.status.error.border} ${theme.status.error.text}`
                      : selectedAnswer === index
                      ? `${theme.borderColors.primary} ${theme.textColors.primary}`
                      : theme.borderColors.muted
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className={`font-medium ${
                    showExplanation && (index === question.correct || (index === selectedAnswer && selectedAnswer !== question.correct))
                      ? ''
                      : theme.textColors.secondary
                  }`}>
                    {option}
                  </span>
                  {showExplanation && index === question.correct && (
                    <CheckCircle className={`w-6 h-6 ml-auto ${theme.status.success.text}`} />
                  )}
                  {showExplanation && index === selectedAnswer && selectedAnswer !== question.correct && (
                    <XCircle className={`w-6 h-6 ml-auto ${theme.status.error.text}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`mb-8 p-6 rounded-xl ${isCorrect ? theme.status.success.bg : theme.status.error.bg} border ${isCorrect ? theme.status.success.border : theme.status.error.border}`}>
            <div className="flex items-start">
              <div className={`flex-shrink-0 mr-4 ${isCorrect ? theme.status.success.text : theme.status.error.text}`}>
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <h4 className={`font-bold mb-2 ${isCorrect ? theme.status.success.text : theme.status.error.text}`}>
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </h4>
                <p className={`${theme.textColors.secondary} leading-relaxed`}>
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center">
          {!showExplanation ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className={`px-8 py-3 ${theme.buttons.primary} rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover-lift`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className={`flex items-center px-8 py-3 ${theme.buttons.primary} rounded-xl transition-all shadow-lg hover-lift`}
            >
              {currentQuestion === questions.length - 1 ? (
                <>
                  <Trophy className="w-5 h-5 mr-2" />
                  Complete Quiz
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Next Question
                </>
              )}
            </button>
          )}
        </div>

        {/* Progress Summary */}
        <div className={`mt-8 pt-6 border-t ${theme.borderColors.primary} text-center`}>
          <div className={`text-sm ${theme.textColors.secondary}`}>
            Progress: {currentQuestion + 1} of {questions.length} questions
            {userAnswers.filter(answer => answer !== null).length > 0 && (
              <span className="ml-4">
                Current Score: {userAnswers.reduce((score: number, answer, index) => 
                  score + (answer === questions[index]?.correct ? 1 : 0), 0
                )}/{userAnswers.filter(answer => answer !== null).length}
              </span>
            )}
          </div>
        </div>
      </GradientCard>
    </div>
  );
}
