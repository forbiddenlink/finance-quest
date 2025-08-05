'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { useSpacedRepetition, LearningPerformance } from '@/lib/algorithms/learningAnalytics';
import SuccessCelebration from '@/components/shared/ui/SuccessCelebration';
import { CheckCircle, XCircle, Sparkles, RefreshCw, Clock, Brain } from 'lucide-react';
import { theme } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // seconds
  concept?: string; // For spaced repetition tracking
}

export interface QuizConfig {
  id: string;
  title: string;
  description: string;
  passingScore: number; // percentage
  questions: QuizQuestion[];
  categories: Record<string, { icon: React.ComponentType; label: string }>;
  successMessage?: string;
  failureMessage?: string;
  chapterId?: string; // For spaced repetition
  enableSpacedRepetition?: boolean;
}

interface EnhancedQuizEngineProps {
  config: QuizConfig;
  onComplete?: (score: number, totalQuestions: number, passed: boolean) => void;
  className?: string;
}

export default function EnhancedQuizEngine({ config, onComplete, className = '' }: EnhancedQuizEngineProps) {
  const { recordQuizScore } = useProgressStore();

  // Spaced repetition integration
  const spacedRepetition = config.enableSpacedRepetition && config.chapterId
    ? useSpacedRepetition(config.chapterId)
    : null;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(config.questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [showSpacedRepetitionReview, setShowSpacedRepetitionReview] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(false);
  };

  const checkAnswer = () => {
    setShowExplanation(true);

    // Track spaced repetition performance
    if (spacedRepetition && config.questions[currentQuestion].concept) {
      const question = config.questions[currentQuestion];
      const isCorrect = selectedAnswers[currentQuestion] === question.correctAnswer;
      const responseTime = Date.now() - questionStartTime;

      const performance: LearningPerformance = {
        accuracy: isCorrect ? 1.0 : 0.0,
        speed: responseTime / 1000, // convert to seconds
        confidence: isCorrect ? 4 : 2, // Simple confidence mapping
        responseTime
      };

      // Find or create card for this concept
      const existingCard = spacedRepetition.cards.find(card => card.concept === question.concept);
      if (existingCard) {
        spacedRepetition.updateCard(existingCard.id, performance);
      } else if (question.concept) {
        // Add new concept to spaced repetition
        const difficulty = question.difficulty === 'easy' ? 0 : question.difficulty === 'medium' ? 1 : 2;
        spacedRepetition.addCard(question.concept, difficulty);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < config.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setQuestionStartTime(Date.now()); // Reset timer for next question
      // Reset timer if question has time limit
      const nextQ = config.questions[currentQuestion + 1];
      if (nextQ.timeLimit) {
        setTimeRemaining(nextQ.timeLimit);
      }
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === config.questions[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getCategoryBreakdown = () => {
    const breakdown: Record<string, number> = {};
    Object.keys(config.categories).forEach(cat => breakdown[cat] = 0);

    selectedAnswers.forEach((answer, index) => {
      if (answer === config.questions[index].correctAnswer) {
        breakdown[config.questions[index].category]++;
      }
    });
    return breakdown;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(config.questions.length).fill(-1));
    setShowResults(false);
    setShowExplanation(false);
    setTimeRemaining(null);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / config.questions.length) * 100);
    const passed = percentage >= config.passingScore;
    const breakdown = getCategoryBreakdown();

    // Record the quiz score
    recordQuizScore(config.id, score, config.questions.length);

    // Call completion callback if provided
    if (onComplete) {
      onComplete(score, config.questions.length, passed);
    }

    if (passed) {
      setShowCelebration(true);
    }

    return (
      <>
        <SuccessCelebration
          show={showCelebration}
          title={`${config.title} Mastered!`}
          message={config.successMessage || `Outstanding! You scored ${percentage}%!`}
          onComplete={() => setShowCelebration(false)}
          type="quiz"
        />

        <div className={`max-w-2xl mx-auto ${theme.backgrounds.card} rounded-lg shadow-lg p-8 ${className}`}>
          <div className="text-center">
            <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>{config.title} Results</h2>
            <div className={`text-6xl font-bold mb-4 ${passed ? theme.status.success.text : theme.status.error.text}`}>
              {percentage}%
            </div>
            <p className={`text-xl ${theme.textColors.secondary} mb-6`}>
              You got {score} out of {config.questions.length} questions correct
            </p>

            {/* Category Breakdown */}
            <div className={`mb-6 p-4 ${theme.backgrounds.cardDisabled} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3`}>Skill Breakdown</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(config.categories).map(([categoryKey, categoryInfo]) => {
                  const IconComponent = categoryInfo.icon as React.ComponentType<{ className?: string }>;
                  const categoryQuestions = config.questions.filter(q => q.category === categoryKey);
                  return (
                    <div key={categoryKey} className="flex items-center justify-between">
                      <span className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                        <IconComponent className="w-4 h-4" />
                        {categoryInfo.label}
                      </span>
                      <span className={`font-bold ${theme.textColors.primary}`}>
                        {breakdown[categoryKey]}/{categoryQuestions.length}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {passed ? (
              <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-6 mb-6`}>
                <h3 className={`text-lg font-semibold ${theme.status.success.text} mb-2 flex items-center gap-2 justify-center`}>
                  <Sparkles className="w-5 h-5" />
                  Mastered!
                </h3>
                <p className={theme.status.success.text}>
                  {config.successMessage || "Excellent understanding demonstrated!"}
                </p>
              </div>
            ) : (
              <div className={`${theme.status.error.bg} border ${theme.status.error.border} rounded-lg p-6 mb-6`}>
                <h3 className={`text-lg font-semibold ${theme.status.error.text} mb-2`}>Almost There!</h3>
                <p className={theme.status.error.text}>
                  {config.failureMessage || `You need ${config.passingScore}% to pass. Review the material and try again.`}
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
                  Continue Learning
                </button>
              )}
              {spacedRepetition && spacedRepetition.dueCards.length > 0 && (
                <Button
                  onClick={() => setShowSpacedRepetitionReview(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Review Due Cards ({spacedRepetition.dueCards.length})
                </Button>
              )}
            </div>

            {/* Spaced Repetition Stats */}
            {spacedRepetition && (
              <div className={`mt-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
                <h4 className={`text-sm font-semibold ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                  <Brain className="w-4 h-4" />
                  Learning Progress
                </h4>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                      {spacedRepetition.cards.length}
                    </div>
                    <div className={theme.textColors.muted}>Total Concepts</div>
                  </div>
                  <div>
                    <div className={`text-lg font-bold text-amber-400`}>
                      {spacedRepetition.dueCards.length}
                    </div>
                    <div className={theme.textColors.muted}>Due for Review</div>
                  </div>
                  <div>
                    <div className={`text-lg font-bold text-green-400`}>
                      {spacedRepetition.cards.filter(card => card.repetitions >= 3).length}
                    </div>
                    <div className={theme.textColors.muted}>Mastered</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Spaced Repetition Review Modal
  if (showSpacedRepetitionReview && spacedRepetition) {
    return (
      <div className={`${theme.backgrounds.primary} min-h-screen p-6`}>
        <div className="max-w-2xl mx-auto">
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${theme.textColors.primary} flex items-center gap-2`}>
                <RefreshCw className="w-6 h-6 text-purple-400" />
                Spaced Repetition Review
              </h2>
              <Button
                onClick={() => setShowSpacedRepetitionReview(false)}
                variant="outline"
                size="sm"
              >
                Back to Quiz
              </Button>
            </div>

            {spacedRepetition.dueCards.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-2`}>
                  All Caught Up!
                </h3>
                <p className={theme.textColors.secondary}>
                  No concepts are due for review right now. Great job maintaining your learning!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-6`}>
                  <h3 className={`text-lg font-semibold text-purple-300 mb-2`}>
                    {spacedRepetition.dueCards.length} concepts ready for review
                  </h3>
                  <p className={theme.textColors.secondary}>
                    Regular review helps move information from short-term to long-term memory.
                    Each review strengthens the neural pathways and improves retention.
                  </p>
                </div>

                {spacedRepetition.dueCards.map((card, index) => (
                  <div
                    key={card.id}
                    className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold ${theme.textColors.primary}`}>
                        {card.concept}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span className={`text-sm ${theme.textColors.muted}`}>
                          Next: {Math.ceil((card.nextReview.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${card.difficulty === 0 ? 'bg-green-500/20 text-green-300' :
                          card.difficulty === 1 ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                        }`}>
                        {card.difficulty === 0 ? 'Easy' : card.difficulty === 1 ? 'Medium' : 'Hard'}
                      </span>
                      <span className={theme.textColors.muted}>
                        Repetitions: {card.repetitions}
                      </span>
                      <span className={theme.textColors.muted}>
                        Ease: {card.easeFactor.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="text-center mt-6">
                  <Button
                    onClick={() => {
                      setShowSpacedRepetitionReview(false);
                      toast.success('Review completed! Your learning schedule has been updated.');
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Mark All as Reviewed
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = config.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / config.questions.length) * 100;
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  const getCategoryIcon = (category: string) => {
    const categoryInfo = config.categories[category];
    if (categoryInfo) {
      const IconComponent = categoryInfo.icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className="w-4 h-4" />;
    }
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className={`max-w-2xl mx-auto ${theme.backgrounds.card} rounded-lg shadow-lg ${className}`}>
      {/* Progress Bar */}
      <div className={`${theme.backgrounds.cardDisabled} rounded-t-lg`}>
        <div
          className={`${theme.status.info.bg} h-3 rounded-t-lg transition-all duration-300`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${theme.textColors.primary}`}>
              Question {currentQuestion + 1} of {config.questions.length}
            </span>
            <div className="flex items-center gap-4">
              {/* Category Badge */}
              <div className={`flex items-center gap-2 text-sm ${theme.textColors.muted}`}>
                {getCategoryIcon(question.category)}
                <span className="capitalize">{config.categories[question.category]?.label || question.category}</span>
              </div>

              {/* Difficulty Badge */}
              {question.difficulty && (
                <div className={`px-2 py-1 rounded text-xs font-medium ${question.difficulty === 'easy' ? theme.status.success.bg + ' ' + theme.status.success.text :
                    question.difficulty === 'medium' ? theme.status.warning.bg + ' ' + theme.status.warning.text :
                      theme.status.error.bg + ' ' + theme.status.error.text
                  }`}>
                  {question.difficulty.toUpperCase()}
                </div>
              )}

              {/* Timer */}
              {timeRemaining !== null && (
                <div className={`px-2 py-1 rounded text-xs font-medium ${theme.status.info.bg} ${theme.status.info.text}`}>
                  {timeRemaining}s
                </div>
              )}
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

        {/* Enhanced Explanation */}
        {showExplanation && (
          <div className={`mb-6 p-4 rounded-lg ${isCorrect
              ? `${theme.status.success.bg} border ${theme.status.success.border}`
              : `${theme.status.error.bg} border ${theme.status.error.border}`
            }`}>
            <h3 className={`font-semibold mb-2 flex items-center gap-2 ${isCorrect ? theme.status.success.text : theme.status.error.text
              }`}>
              {isCorrect ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Excellent!
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Not quite - here&apos;s why:
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
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
                setShowExplanation(false);
              }
            }}
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
                {currentQuestion === config.questions.length - 1 ? 'View Results' : 'Next Question'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
