import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Enhanced types for better progress tracking
export interface SimulationResult {
  scenarioId: string;
  totalScore: number;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
  financialOutcome: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  strengths: string[];
  improvements: string[];
  completedAt: Date;
}

export interface UserProgress {
  currentChapter: number;
  completedLessons: string[];
  completedQuizzes: string[];
  quizScores: Record<string, number>;
  calculatorUsage: Record<string, number>;
  simulationResults: Record<string, SimulationResult>;
  totalTimeSpent: number;
  lastActiveDate: string;
  streakDays: number;
  achievements: string[];
  strugglingTopics: string[];
  financialLiteracyScore: number;
  onboardingCompleted: boolean;
  learningAnalytics: {
    averageQuizScore: number;
    lessonCompletionRate: number;
    timeSpentByChapter: Record<string, number>;
    conceptsMastered: string[];
    areasNeedingWork: string[];
  };
}

export interface ProgressStore {
  userProgress: UserProgress;

  // Lesson management
  completeLesson: (lessonId: string, timeSpent: number) => void;
  markChapterComplete: (chapterId: number) => void;

  // Quiz management  
  recordQuizScore: (quizId: string, score: number, totalQuestions: number) => void;
  canTakeQuiz: (quizId: string) => boolean;

  // Calculator tracking
  recordCalculatorUsage: (calculatorId: string) => void;

  // Simulation tracking
  recordSimulationResult: (result: SimulationResult) => void;

  // Onboarding
  completeOnboarding: () => void;

  // Analytics
  updateLearningAnalytics: () => void;
  calculateFinancialLiteracyScore: () => number;

  // Progress utilities
  getChapterProgress: (chapterId: number) => number;
  isChapterUnlocked: (chapterId: number) => boolean;
  resetProgress: () => void;

  // Time tracking
  updateTimeSpent: (seconds: number) => void;
  updateStreak: () => void;
}

const initialProgress: UserProgress = {
  currentChapter: 1,
  completedLessons: [],
  completedQuizzes: [],
  quizScores: {},
  calculatorUsage: {},
  simulationResults: {},
  totalTimeSpent: 0,
  lastActiveDate: new Date().toISOString(),
  streakDays: 0,
  achievements: [],
  strugglingTopics: [],
  financialLiteracyScore: 0,
  onboardingCompleted: false,
  learningAnalytics: {
    averageQuizScore: 0,
    lessonCompletionRate: 0,
    timeSpentByChapter: {},
    conceptsMastered: [],
    areasNeedingWork: []
  }
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      userProgress: initialProgress,

      completeLesson: (lessonId: string, timeSpent: number) => {
        set((state) => {
          const newProgress = {
            ...state.userProgress,
            completedLessons: [...new Set([...state.userProgress.completedLessons, lessonId])],
            totalTimeSpent: state.userProgress.totalTimeSpent + timeSpent,
            lastActiveDate: new Date().toISOString()
          };

          // Update analytics
          const chapterId = lessonId.split('-')[0];
          newProgress.learningAnalytics.timeSpentByChapter[chapterId] =
            (newProgress.learningAnalytics.timeSpentByChapter[chapterId] || 0) + timeSpent;

          return { userProgress: newProgress };
        });
        get().updateLearningAnalytics();
        get().updateStreak();
      },

      markChapterComplete: (chapterId: number) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            currentChapter: Math.max(state.userProgress.currentChapter, chapterId + 1),
            achievements: [...new Set([...state.userProgress.achievements, `chapter-${chapterId}-complete`])]
          }
        }));
        get().updateLearningAnalytics();
      },

      recordQuizScore: (quizId: string, score: number, totalQuestions: number) => {
        const percentage = Math.round((score / totalQuestions) * 100);

        set((state) => {
          const newQuizScores = { ...state.userProgress.quizScores, [quizId]: percentage };
          const newCompletedQuizzes = percentage >= 80
            ? [...new Set([...state.userProgress.completedQuizzes, quizId])]
            : state.userProgress.completedQuizzes;

          const newProgress = {
            ...state.userProgress,
            quizScores: newQuizScores,
            completedQuizzes: newCompletedQuizzes,
            lastActiveDate: new Date().toISOString()
          };

          // Track struggling topics
          if (percentage < 80) {
            const topic = quizId.replace('-quiz', '');
            newProgress.strugglingTopics = [...new Set([...newProgress.strugglingTopics, topic])];
          } else {
            // Remove from struggling topics if passed
            const topic = quizId.replace('-quiz', '');
            newProgress.strugglingTopics = newProgress.strugglingTopics.filter(t => t !== topic);
            newProgress.learningAnalytics.conceptsMastered = [...new Set([...newProgress.learningAnalytics.conceptsMastered, topic])];
          }

          return { userProgress: newProgress };
        });

        get().updateLearningAnalytics();
        get().updateStreak();
      },

      canTakeQuiz: (quizId: string) => {
        const { userProgress } = get();
        const chapterLessons = userProgress.completedLessons.filter(lesson =>
          lesson.startsWith(quizId.replace('-quiz', ''))
        );
        // Require completing at least 50% of chapter lessons to take quiz
        return chapterLessons.length >= 2;
      },

      recordCalculatorUsage: (calculatorId: string) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            calculatorUsage: {
              ...state.userProgress.calculatorUsage,
              [calculatorId]: (state.userProgress.calculatorUsage[calculatorId] || 0) + 1
            },
            lastActiveDate: new Date().toISOString()
          }
        }));
        get().updateStreak();
      },

      recordSimulationResult: (result: SimulationResult) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            simulationResults: {
              ...state.userProgress.simulationResults,
              [result.scenarioId]: result
            },
            achievements: result.grade === 'A'
              ? [...new Set([...state.userProgress.achievements, `simulation-${result.scenarioId}-master`])]
              : state.userProgress.achievements,
            lastActiveDate: new Date().toISOString()
          }
        }));
        get().updateLearningAnalytics();
        get().updateStreak();
      },

      updateLearningAnalytics: () => {
        set((state) => {
          const quizScores = Object.values(state.userProgress.quizScores);
          const averageQuizScore = quizScores.length > 0
            ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length
            : 0;

          const totalPossibleLessons = Math.min(state.userProgress.currentChapter * 6, 102); // 6 lessons per chapter, max 17 chapters = 102 lessons
          const lessonCompletionRate = totalPossibleLessons > 0 ? (state.userProgress.completedLessons.length / totalPossibleLessons) * 100 : 0;

          const areasNeedingWork = state.userProgress.strugglingTopics.length > 0
            ? state.userProgress.strugglingTopics
            : [];

          return {
            userProgress: {
              ...state.userProgress,
              learningAnalytics: {
                ...state.userProgress.learningAnalytics,
                averageQuizScore,
                lessonCompletionRate,
                areasNeedingWork
              },
              financialLiteracyScore: get().calculateFinancialLiteracyScore()
            }
          };
        });
      },

      calculateFinancialLiteracyScore: () => {
        const { userProgress } = get();
        let score = 0;

        // Base score from quiz performance (40% of total)
        const quizScores = Object.values(userProgress.quizScores);
        if (quizScores.length > 0) {
          const avgQuizScore = quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length;
          score += (avgQuizScore / 100) * 400;
        }

        // Lesson completion (30% of total)
        const maxPossibleLessons = Math.min(userProgress.currentChapter * 6, 102); // Up to 17 chapters
        const lessonPoints = maxPossibleLessons > 0 ? (userProgress.completedLessons.length / maxPossibleLessons) * 300 : 0;
        score += lessonPoints;

        // Calculator usage shows practical application (20% of total)
        const maxCalculators = 13; // Current available calculators
        const calculatorUsageCount = Object.keys(userProgress.calculatorUsage).length;
        const calculatorPoints = Math.min(calculatorUsageCount / maxCalculators, 1) * 200;
        score += calculatorPoints;

        // Consistency and engagement (10% of total)
        const streakPoints = Math.min(userProgress.streakDays / 7, 1) * 100;
        score += streakPoints;

        return Math.round(Math.min(score, 1000));
      },

      getChapterProgress: (chapterId: number) => {
        const { userProgress } = get();
        const chapterLessons = userProgress.completedLessons.filter(lesson =>
          lesson.startsWith(`chapter${chapterId}`)
        );
        const quizPassed = userProgress.completedQuizzes.includes(`chapter${chapterId}-quiz`);

        // 6 lessons + 1 quiz = 7 total items per chapter
        const completedItems = chapterLessons.length + (quizPassed ? 1 : 0);
        return Math.round((completedItems / 7) * 100);
      },

      isChapterUnlocked: (chapterId: number) => {
        const { userProgress } = get();
        if (chapterId === 1) return true;

        // Unlock next chapter when previous chapter quiz is passed with 80%+
        const previousChapterQuiz = `chapter${chapterId - 1}-quiz`;
        const previousQuizScore = userProgress.quizScores[previousChapterQuiz];
        return Boolean(previousQuizScore && previousQuizScore >= 80);
      },

      resetProgress: () => {
        set({ userProgress: initialProgress });
      },

      updateTimeSpent: (seconds: number) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            totalTimeSpent: state.userProgress.totalTimeSpent + seconds,
            lastActiveDate: new Date().toISOString()
          }
        }));
      },

      updateStreak: () => {
        set((state) => {
          const today = new Date().toDateString();
          const lastActive = new Date(state.userProgress.lastActiveDate).toDateString();
          const yesterday = new Date(Date.now() - 86400000).toDateString();

          let newStreakDays = state.userProgress.streakDays;

          if (lastActive === today) {
            // Already updated today, no change
            return { userProgress: state.userProgress };
          } else if (lastActive === yesterday) {
            // Continuing streak
            newStreakDays += 1;
          } else {
            // Streak broken, reset to 1
            newStreakDays = 1;
          }

          return {
            userProgress: {
              ...state.userProgress,
              streakDays: newStreakDays,
              lastActiveDate: new Date().toISOString()
            }
          };
        });
      },

      completeOnboarding: () => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            onboardingCompleted: true,
            lastActiveDate: new Date().toISOString()
          }
        }));
      }
    }),
    {
      name: 'finance-quest-progress',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Update analytics when rehydrating from storage
        if (state) {
          state.updateLearningAnalytics();
        }
      }
    }
  )
);

// Convenience hooks for common operations
export const useChapterProgress = (chapterId: number) => {
  return useProgressStore((state) => state.getChapterProgress(chapterId));
};

export const useIsChapterUnlocked = (chapterId: number) => {
  return useProgressStore((state) => state.isChapterUnlocked(chapterId));
};

export const useFinancialLiteracyScore = () => {
  return useProgressStore((state) => state.userProgress.financialLiteracyScore);
};

export const useLearningAnalytics = () => {
  return useProgressStore((state) => state.userProgress.learningAnalytics);
};
