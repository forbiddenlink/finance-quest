'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types for our learning progress
export interface UserProgress {
  currentChapter: number;
  completedLessons: string[];
  quizScores: { [key: string]: number };
  calculatorUsage: string[];
  strugglingTopics: string[];
  totalTimeSpent: number;
  achievementsUnlocked: string[];
  lastActiveDate: string;
}

interface ProgressState {
  userProgress: UserProgress;
  isLoading: boolean;
}

// Action types
type ProgressAction =
  | { type: 'COMPLETE_LESSON'; payload: string }
  | { type: 'RECORD_QUIZ_SCORE'; payload: { quizId: string; score: number } }
  | { type: 'USE_CALCULATOR'; payload: string }
  | { type: 'ADD_STRUGGLING_TOPIC'; payload: string }
  | { type: 'REMOVE_STRUGGLING_TOPIC'; payload: string }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'UPDATE_TIME_SPENT'; payload: number }
  | { type: 'ADVANCE_CHAPTER' }
  | { type: 'LOAD_PROGRESS'; payload: UserProgress }
  | { type: 'RESET_PROGRESS' };

// Initial state
const initialProgress: UserProgress = {
  currentChapter: 1,
  completedLessons: [],
  quizScores: {},
  calculatorUsage: [],
  strugglingTopics: [],
  totalTimeSpent: 0,
  achievementsUnlocked: [],
  lastActiveDate: new Date().toISOString(),
};

const initialState: ProgressState = {
  userProgress: initialProgress,
  isLoading: true,
};

// Reducer
function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case 'COMPLETE_LESSON':
      const newCompletedLessons = [...state.userProgress.completedLessons];
      if (!newCompletedLessons.includes(action.payload)) {
        newCompletedLessons.push(action.payload);
      }
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          completedLessons: newCompletedLessons,
          lastActiveDate: new Date().toISOString(),
        },
      };

    case 'RECORD_QUIZ_SCORE':
      const newQuizScores = {
        ...state.userProgress.quizScores,
        [action.payload.quizId]: action.payload.score,
      };
      
      // Check if user can advance to next chapter (80% on current chapter quiz)
      const canAdvance = action.payload.score >= 80;
      const achievements = [...state.userProgress.achievementsUnlocked];
      
      if (canAdvance && !achievements.includes(`chapter-${state.userProgress.currentChapter}-mastery`)) {
        achievements.push(`chapter-${state.userProgress.currentChapter}-mastery`);
      }

      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          quizScores: newQuizScores,
          achievementsUnlocked: achievements,
          lastActiveDate: new Date().toISOString(),
        },
      };

    case 'USE_CALCULATOR':
      const newCalculatorUsage = [...state.userProgress.calculatorUsage];
      if (!newCalculatorUsage.includes(action.payload)) {
        newCalculatorUsage.push(action.payload);
      }
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          calculatorUsage: newCalculatorUsage,
          lastActiveDate: new Date().toISOString(),
        },
      };

    case 'ADD_STRUGGLING_TOPIC':
      const newStrugglingTopics = [...state.userProgress.strugglingTopics];
      if (!newStrugglingTopics.includes(action.payload)) {
        newStrugglingTopics.push(action.payload);
      }
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          strugglingTopics: newStrugglingTopics,
        },
      };

    case 'REMOVE_STRUGGLING_TOPIC':
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          strugglingTopics: state.userProgress.strugglingTopics.filter(
            topic => topic !== action.payload
          ),
        },
      };

    case 'UNLOCK_ACHIEVEMENT':
      const achievements2 = [...state.userProgress.achievementsUnlocked];
      if (!achievements2.includes(action.payload)) {
        achievements2.push(action.payload);
      }
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          achievementsUnlocked: achievements2,
        },
      };

    case 'UPDATE_TIME_SPENT':
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          totalTimeSpent: state.userProgress.totalTimeSpent + action.payload,
          lastActiveDate: new Date().toISOString(),
        },
      };

    case 'ADVANCE_CHAPTER':
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          currentChapter: state.userProgress.currentChapter + 1,
          lastActiveDate: new Date().toISOString(),
        },
      };

    case 'LOAD_PROGRESS':
      return {
        ...state,
        userProgress: action.payload,
        isLoading: false,
      };

    case 'RESET_PROGRESS':
      return {
        ...state,
        userProgress: initialProgress,
      };

    default:
      return state;
  }
}

// Context
const ProgressContext = createContext<{
  state: ProgressState;
  dispatch: React.Dispatch<ProgressAction>;
} | undefined>(undefined);

// Provider component
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(progressReducer, initialState);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('finance-quest-progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        dispatch({ type: 'LOAD_PROGRESS', payload: parsed });
      } catch (error) {
        console.error('Failed to load saved progress:', error);
        dispatch({ type: 'LOAD_PROGRESS', payload: initialProgress });
      }
    } else {
      dispatch({ type: 'LOAD_PROGRESS', payload: initialProgress });
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('finance-quest-progress', JSON.stringify(state.userProgress));
    }
  }, [state.userProgress, state.isLoading]);

  return (
    <ProgressContext.Provider value={{ state, dispatch }}>
      {children}
    </ProgressContext.Provider>
  );
}

// Hook to use progress context
export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}

// Helper hooks for common actions
export function useProgressActions() {
  const { dispatch } = useProgress();

  return {
    completeLesson: (lessonId: string) => dispatch({ type: 'COMPLETE_LESSON', payload: lessonId }),
    recordQuizScore: (quizId: string, score: number) => 
      dispatch({ type: 'RECORD_QUIZ_SCORE', payload: { quizId, score } }),
    useCalculator: (calculatorId: string) => dispatch({ type: 'USE_CALCULATOR', payload: calculatorId }),
    addStrugglingTopic: (topic: string) => dispatch({ type: 'ADD_STRUGGLING_TOPIC', payload: topic }),
    removeStrugglingTopic: (topic: string) => dispatch({ type: 'REMOVE_STRUGGLING_TOPIC', payload: topic }),
    unlockAchievement: (achievement: string) => dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement }),
    updateTimeSpent: (minutes: number) => dispatch({ type: 'UPDATE_TIME_SPENT', payload: minutes }),
    advanceChapter: () => dispatch({ type: 'ADVANCE_CHAPTER' }),
    resetProgress: () => dispatch({ type: 'RESET_PROGRESS' }),
  };
}
