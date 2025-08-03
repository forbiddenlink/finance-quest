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
  Briefcase,
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
  category: 'total-compensation' | 'negotiation' | 'side-hustles' | 'career-strategy' | 'professional-development';
}

interface QuizProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Sarah's base salary is $70,000. Her benefits include health insurance worth $12,000, 401k matching worth $3,500, and 20 days PTO. What's her total compensation value?",
    options: [
      "$70,000 (salary is what matters)",
      "$82,000 (salary + health insurance only)",
      "$85,500 (salary + health + 401k matching)",
      "$89,000+ (including PTO value)"
    ],
    correct: 3,
    explanation: "Total compensation includes ALL benefits. 20 days PTO at $70k salary = ~$3,500 additional value. Total: $70k + $12k + $3.5k + $3.5k = $89k (27% more than base salary!)",
    category: 'total-compensation'
  },
  {
    id: 2,
    question: "What's the best strategy for salary negotiation timing?",
    options: [
      "During the initial job interview",
      "After receiving an offer but before accepting",
      "Only during annual performance reviews",
      "Wait until you're unhappy with current pay"
    ],
    correct: 1,
    explanation: "The best time is after receiving an offer but before accepting. You have leverage because they want you, but haven't committed yet. This gives you maximum negotiating power.",
    category: 'negotiation'
  },
  {
    id: 3,
    question: "Alex earns $60,000 and successfully negotiates a $10,000 raise. With 3% annual increases, what's the approximate 30-year impact?",
    options: [
      "$300,000 (just the extra $10k per year)",
      "$400,000+ (compound effect of higher base)",
      "$150,000 (present value discount)",
      "$50,000 (taxes reduce the benefit)"
    ],
    correct: 1,
    explanation: "The $10k raise becomes your new baseline for all future raises. Over 30 years with compound 3% increases, this single negotiation adds $400,000+ to lifetime earnings.",
    category: 'negotiation'
  },
  {
    id: 4,
    question: "Which side hustle approach has the highest income potential?",
    options: [
      "Trading time for money (freelance hourly work)",
      "Selling physical products on platforms",
      "Creating scalable digital products or services",
      "Participating in the gig economy"
    ],
    correct: 2,
    explanation: "Scalable digital products/services have unlimited upside potential. You create once and can sell infinitely without proportional time increases, unlike hourly work which caps at available hours.",
    category: 'side-hustles'
  },
  {
    id: 5,
    question: "Maria wants to increase her income 50% in 3 years. What's the most effective strategy?",
    options: [
      "Stay at current job and work extra hours",
      "Focus only on internal promotions",
      "Strategic job hopping every 2-3 years",
      "Start a side business immediately"
    ],
    correct: 2,
    explanation: "External job moves typically offer 10-20% salary increases vs 3-5% internal raises. Strategic job hopping can achieve 50% increases much faster than internal advancement alone.",
    category: 'career-strategy'
  },
  {
    id: 6,
    question: "What percentage of total compensation should benefits typically represent?",
    options: [
      "5-10% (benefits are minor)",
      "15-25% (modest benefit value)",
      "20-40% (significant portion)",
      "50%+ (benefits exceed salary)"
    ],
    correct: 2,
    explanation: "Benefits typically represent 20-40% of total compensation. This includes health insurance, retirement matching, PTO, professional development, and other perks - substantial value beyond salary.",
    category: 'total-compensation'
  },
  {
    id: 7,
    question: "John wants to negotiate but his company says 'salaries are fixed.' What should he do?",
    options: [
      "Accept the fixed salary policy",
      "Look for a new job immediately",
      "Negotiate non-salary benefits and perks",
      "Demand to speak with higher management"
    ],
    correct: 2,
    explanation: "Even with 'fixed' salaries, companies often have flexibility with title changes, additional PTO, remote work options, professional development budgets, or start date negotiations.",
    category: 'negotiation'
  },
  {
    id: 8,
    question: "Which professional development investment typically has the highest ROI?",
    options: [
      "Any college degree program",
      "Industry-specific certifications",
      "General leadership courses",
      "Expensive MBA programs"
    ],
    correct: 1,
    explanation: "Industry-specific certifications often provide immediate, measurable value to employers and can increase salary quickly. A $3,000 certification that leads to a $10,000+ raise has 300%+ ROI.",
    category: 'professional-development'
  },
  {
    id: 9,
    question: "What's the biggest risk of relying solely on your day job for income?",
    options: [
      "Limited growth potential",
      "Single point of failure",
      "Less entrepreneurial experience",
      "Lower lifetime earnings"
    ],
    correct: 1,
    explanation: "Single point of failure is the biggest risk. If you lose your job, 100% of income disappears instantly. Multiple income streams provide security and options during economic uncertainty.",
    category: 'side-hustles'
  },
  {
    id: 10,
    question: "Lisa is considering a job that pays $5,000 less but offers amazing learning opportunities. What framework should she use?",
    options: [
      "Always take the higher-paying job",
      "Calculate 3-year earning potential including skill growth",
      "Take the learning opportunity regardless of pay",
      "Negotiate to get both higher pay and learning"
    ],
    correct: 1,
    explanation: "Calculate 3-year impact: Will the skills gained lead to higher future earnings that exceed the $5k short-term loss? Great learning opportunities often pay for themselves within 1-2 years.",
    category: 'career-strategy'
  }
];

export default function IncomeCareerQuizEnhanced({ onComplete }: QuizProps) {
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
      recordQuizScore('income-career-quiz-enhanced', actualFinalScore, questions.length);
      
      // Show completion toast
      if (actualFinalScore >= 8) {
        toast.success('Excellent work! Income mastery achieved! 🏆', { duration: 4000 });
      } else if (actualFinalScore >= 6) {
        toast.success('Good job! You understand the key concepts! 💼', { duration: 4000 });
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
    if (score >= 8) return "Outstanding! You've mastered income and career strategies! 🏆";
    if (score >= 6) return "Great work! You understand the core concepts! 💼";
    return "Review the lessons for better understanding. 📚";
  };

  const calculateCategoryBreakdown = () => {
    const categories = {
      'total-compensation': { correct: 0, total: 0, name: 'Total Compensation' },
      'negotiation': { correct: 0, total: 0, name: 'Salary Negotiation' },
      'side-hustles': { correct: 0, total: 0, name: 'Side Hustles' },
      'career-strategy': { correct: 0, total: 0, name: 'Career Strategy' },
      'professional-development': { correct: 0, total: 0, name: 'Professional Development' }
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
                Income & Career Mastery Achieved!
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
                <Briefcase className="w-5 h-5 mr-2" />
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
                Review the Income & Career lessons and focus on your weaker areas above.
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
          color="#7C3AED"
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
              Income & Career Quiz
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
