import { useState, useCallback, useEffect } from 'react';
import {
  QuizState,
  QuizActions,
  UseQuizEnhanced,
  QuizProgress
} from './types';
import {
  QUIZ_QUESTIONS,
  QUIZ_CONFIG
} from './constants';
import {
  calculateScore,
  generateAnalytics,
  shuffleArray,
  calculateTimeSpent
} from './utils';

const initialProgress: QuizProgress = {
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  maxScore: QUIZ_QUESTIONS.reduce((sum, q) => sum + q.points, 0),
  startTime: new Date()
};

const initialState: QuizState = {
  questions: QUIZ_CONFIG.shuffleQuestions ? shuffleArray(QUIZ_QUESTIONS) : QUIZ_QUESTIONS,
  progress: initialProgress,
  analytics: {
    totalQuestions: QUIZ_QUESTIONS.length,
    correctAnswers: 0,
    incorrectAnswers: 0,
    accuracy: 0,
    averageTimePerQuestion: 0,
    categoryBreakdown: {},
    difficultyBreakdown: {},
    weakestCategories: [],
    recommendedTopics: []
  },
  isComplete: false,
  showExplanation: false,
  showHint: false,
  timeRemaining: QUIZ_CONFIG.timeLimit
};

export const useQuizEnhanced: UseQuizEnhanced = () => {
  const [state, setState] = useState<QuizState>(initialState);

  // Timer effect
  useEffect(() => {
    if (state.isComplete || !state.timeRemaining) return;

    const timer = setInterval(() => {
      setState(prev => {
        const newTimeRemaining = (prev.timeRemaining || 0) - 1;
        if (newTimeRemaining <= 0) {
          return {
            ...prev,
            isComplete: true,
            timeRemaining: 0,
            progress: {
              ...prev.progress,
              endTime: new Date()
            }
          };
        }
        return {
          ...prev,
          timeRemaining: newTimeRemaining
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.isComplete, state.timeRemaining]);

  const startQuiz = useCallback(() => {
    setState(prev => ({
      ...prev,
      progress: {
        ...initialProgress,
        startTime: new Date()
      },
      isComplete: false,
      showExplanation: false,
      showHint: false,
      timeRemaining: QUIZ_CONFIG.timeLimit
    }));
  }, []);

  const submitAnswer = useCallback((answer: number) => {
    setState(prev => {
      const currentQuestion = prev.questions[prev.progress.currentQuestionIndex];
      const isCorrect = answer === currentQuestion.correctAnswer;
      const timeSpent = calculateTimeSpent(
        prev.progress.answers.length === 0 ? prev.progress.startTime : new Date()
      );

      const newAnswers = [
        ...prev.progress.answers,
        {
          questionId: currentQuestion.id,
          selectedAnswer: answer,
          isCorrect,
          timeSpent
        }
      ];

      const isLastQuestion = prev.progress.currentQuestionIndex === prev.questions.length - 1;
      const newProgress = {
        ...prev.progress,
        answers: newAnswers,
        score: calculateScore({
          ...prev.progress,
          answers: newAnswers,
          questions: prev.questions
        }),
        endTime: isLastQuestion ? new Date() : undefined
      };

      return {
        ...prev,
        progress: newProgress,
        isComplete: isLastQuestion,
        showExplanation: QUIZ_CONFIG.showExplanations,
        analytics: isLastQuestion ? generateAnalytics(prev.questions, newProgress) : prev.analytics
      };
    });
  }, []);

  const showExplanation = useCallback(() => {
    setState(prev => ({ ...prev, showExplanation: true }));
  }, []);

  const hideExplanation = useCallback(() => {
    setState(prev => ({ ...prev, showExplanation: false }));
  }, []);

  const showHint = useCallback(() => {
    setState(prev => ({ ...prev, showHint: true }));
  }, []);

  const hideHint = useCallback(() => {
    setState(prev => ({ ...prev, showHint: false }));
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      if (prev.progress.currentQuestionIndex >= prev.questions.length - 1) return prev;

      return {
        ...prev,
        progress: {
          ...prev.progress,
          currentQuestionIndex: prev.progress.currentQuestionIndex + 1
        },
        showExplanation: false,
        showHint: false
      };
    });
  }, []);

  const previousQuestion = useCallback(() => {
    setState(prev => {
      if (prev.progress.currentQuestionIndex <= 0) return prev;

      return {
        ...prev,
        progress: {
          ...prev.progress,
          currentQuestionIndex: prev.progress.currentQuestionIndex - 1
        },
        showExplanation: false,
        showHint: false
      };
    });
  }, []);

  const restartQuiz = useCallback(() => {
    setState(prev => ({
      ...initialState,
      questions: QUIZ_CONFIG.shuffleQuestions ? shuffleArray(QUIZ_QUESTIONS) : QUIZ_QUESTIONS
    }));
  }, []);

  const generateAnalytics = useCallback(() => {
    setState(prev => ({
      ...prev,
      analytics: generateAnalytics(prev.questions, prev.progress)
    }));
  }, []);

  const actions: QuizActions = {
    startQuiz,
    submitAnswer,
    showExplanation,
    hideExplanation,
    showHint,
    hideHint,
    nextQuestion,
    previousQuestion,
    restartQuiz,
    generateAnalytics
  };

  return [state, actions];
};
