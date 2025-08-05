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
  longestStreak: number;
  streakFreezesUsed: number;
  weeklyGoal: number;
  weeklyProgress: number;
  achievements: string[];
  strugglingTopics: string[];
  financialLiteracyScore: number;
  onboardingCompleted: boolean;
  userLevel: number;
  totalXP: number;
  currentXP: number;
  learningAnalytics: {
    averageQuizScore: number;
    lessonCompletionRate: number;
    timeSpentByChapter: Record<string, number>;
    conceptsMastered: string[];
    areasNeedingWork: string[];
    learningVelocity: number; // lessons per week
    retentionRate: number; // quiz improvement over time
    focusScore: number; // consistency in study sessions
  };
  engagementMetrics: {
    sessionsThisWeek: number;
    totalSessions: number;
    averageSessionLength: number;
    lastSessionDate: string;
    preferredStudyTime: 'morning' | 'afternoon' | 'evening' | null;
    studyReminders: boolean;
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

  // Enhanced time and streak tracking
  updateTimeSpent: (seconds: number) => void;
  updateStreak: () => void;
  useStreakFreeze: () => boolean;
  
  // Engagement and gamification
  startStudySession: () => void;
  endStudySession: (sessionLength: number) => void;
  updateWeeklyProgress: () => void;
  awardXP: (amount: number, reason: string) => void;
  checkLevelUp: () => boolean;
  unlockAchievement: (achievementId: string) => void;
  
  // Learning insights
  getStudyRecommendation: () => {
    type: 'continue' | 'review' | 'practice' | 'streak' | 'goal';
    message: string;
    action: string;
    priority: 'low' | 'medium' | 'high';
  };
  getPersonalizedEncouragement: () => string;
  getStreakMotivation: () => {
    message: string;
    streakStatus: 'building' | 'maintaining' | 'at_risk' | 'broken';
    suggestions: string[];
  };
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
  longestStreak: 0,
  streakFreezesUsed: 0,
  weeklyGoal: 3, // Default: 3 lessons per week
  weeklyProgress: 0,
  achievements: [],
  strugglingTopics: [],
  financialLiteracyScore: 0,
  onboardingCompleted: false,
  userLevel: 1,
  totalXP: 0,
  currentXP: 0,
  learningAnalytics: {
    averageQuizScore: 0,
    lessonCompletionRate: 0,
    timeSpentByChapter: {},
    conceptsMastered: [],
    areasNeedingWork: [],
    learningVelocity: 0,
    retentionRate: 100,
    focusScore: 100
  },
  engagementMetrics: {
    sessionsThisWeek: 0,
    totalSessions: 0,
    averageSessionLength: 0,
    lastSessionDate: new Date().toISOString(),
    preferredStudyTime: null,
    studyReminders: true
  }
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      userProgress: initialProgress,

      completeLesson: (lessonId: string, timeSpent: number) => {
        get().startStudySession();

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

        // Award XP for lesson completion
        get().awardXP(100, `Completed ${lessonId}`);
        
        // Check for achievements
        const { userProgress } = get();
        if (userProgress.completedLessons.length === 1) {
          get().unlockAchievement('first-lesson');
        } else if (userProgress.completedLessons.length === 10) {
          get().unlockAchievement('lesson-master');
        } else if (userProgress.completedLessons.length === 50) {
          get().unlockAchievement('scholar');
        }

        get().updateLearningAnalytics();
        get().updateStreak();
        get().endStudySession(timeSpent);
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

        // Award XP based on quiz performance
        const baseXP = 200;
        const bonusXP = Math.floor((percentage - 80) * 5); // Bonus for scores above 80%
        const totalXP = Math.max(baseXP + bonusXP, 50); // Minimum 50 XP even for low scores
        get().awardXP(totalXP, `Quiz: ${quizId} (${percentage}%)`);

        // Check for quiz-related achievements
        if (percentage === 100) {
          get().unlockAchievement('perfect-quiz');
        }
        if (percentage >= 95) {
          get().unlockAchievement('quiz-master');
        }

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

          // Calculate learning velocity (lessons per week)
          const weeksSinceStart = Math.max(1, Math.floor((Date.now() - new Date(state.userProgress.lastActiveDate).getTime()) / (1000 * 60 * 60 * 24 * 7)));
          const learningVelocity = state.userProgress.completedLessons.length / weeksSinceStart;

          // Calculate retention rate based on quiz improvement
          const recentQuizzes = Object.values(state.userProgress.quizScores).slice(-5);
          const earlyQuizzes = Object.values(state.userProgress.quizScores).slice(0, 5);
          let retentionRate = 100;
          if (earlyQuizzes.length > 0 && recentQuizzes.length > 0) {
            const earlyAvg = earlyQuizzes.reduce((a, b) => a + b, 0) / earlyQuizzes.length;
            const recentAvg = recentQuizzes.reduce((a, b) => a + b, 0) / recentQuizzes.length;
            retentionRate = Math.max(0, Math.min(100, (recentAvg / earlyAvg) * 100));
          }

          // Calculate focus score based on consistency
          const focusScore = Math.min(100, state.userProgress.streakDays * 10);

          return {
            userProgress: {
              ...state.userProgress,
              learningAnalytics: {
                ...state.userProgress.learningAnalytics,
                averageQuizScore,
                lessonCompletionRate,
                areasNeedingWork,
                learningVelocity,
                retentionRate,
                focusScore
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

          const newLongestStreak = Math.max(state.userProgress.longestStreak, newStreakDays);

          return {
            userProgress: {
              ...state.userProgress,
              streakDays: newStreakDays,
              longestStreak: newLongestStreak,
              lastActiveDate: new Date().toISOString()
            }
          };
        });
      },

      useStreakFreeze: () => {
        const { userProgress } = get();
        const today = new Date().toDateString();
        const lastActive = new Date(userProgress.lastActiveDate).toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        // Can only use streak freeze if streak would be broken and user hasn't used all freezes
        if (lastActive !== today && lastActive !== yesterday && userProgress.streakFreezesUsed < 3) {
          set((state) => ({
            userProgress: {
              ...state.userProgress,
              streakFreezesUsed: state.userProgress.streakFreezesUsed + 1,
              lastActiveDate: new Date().toISOString()
            }
          }));
          return true;
        }
        return false;
      },

      startStudySession: () => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            engagementMetrics: {
              ...state.userProgress.engagementMetrics,
              lastSessionDate: new Date().toISOString(),
              totalSessions: state.userProgress.engagementMetrics.totalSessions + 1
            }
          }
        }));
        get().updateWeeklyProgress();
      },

      endStudySession: (sessionLength: number) => {
        set((state) => {
          const totalSessions = state.userProgress.engagementMetrics.totalSessions;
          const currentAverage = state.userProgress.engagementMetrics.averageSessionLength;
          const newAverage = ((currentAverage * (totalSessions - 1)) + sessionLength) / totalSessions;

          return {
            userProgress: {
              ...state.userProgress,
              engagementMetrics: {
                ...state.userProgress.engagementMetrics,
                averageSessionLength: newAverage
              }
            }
          };
        });
      },

      updateWeeklyProgress: () => {
        set((state) => {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          weekStart.setHours(0, 0, 0, 0);

          const thisWeekLessons = state.userProgress.completedLessons.filter(lesson => {
            // This is a simplified check - in a real app you'd store lesson completion dates
            return true; // For now, count all recent activity as this week
          });

          return {
            userProgress: {
              ...state.userProgress,
              weeklyProgress: Math.min(thisWeekLessons.length, state.userProgress.weeklyGoal),
              engagementMetrics: {
                ...state.userProgress.engagementMetrics,
                sessionsThisWeek: state.userProgress.engagementMetrics.sessionsThisWeek + 1
              }
            }
          };
        });
      },

      awardXP: (amount: number, reason: string) => {
        set((state) => {
          const newTotalXP = state.userProgress.totalXP + amount;
          const newCurrentXP = state.userProgress.currentXP + amount;

          return {
            userProgress: {
              ...state.userProgress,
              totalXP: newTotalXP,
              currentXP: newCurrentXP
            }
          };
        });
        get().checkLevelUp();
      },

      checkLevelUp: () => {
        const { userProgress } = get();
        const xpForNextLevel = userProgress.userLevel * 1000; // 1000 XP per level

        if (userProgress.currentXP >= xpForNextLevel) {
          set((state) => ({
            userProgress: {
              ...state.userProgress,
              userLevel: state.userProgress.userLevel + 1,
              currentXP: state.userProgress.currentXP - xpForNextLevel,
              achievements: [...state.userProgress.achievements, `level-${state.userProgress.userLevel + 1}`]
            }
          }));
          return true;
        }
        return false;
      },

      unlockAchievement: (achievementId: string) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            achievements: [...new Set([...state.userProgress.achievements, achievementId])]
          }
        }));
      },

      getStudyRecommendation: () => {
        const { userProgress } = get();
        const today = new Date();
        const lastActive = new Date(userProgress.lastActiveDate);
        const daysSinceActive = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

        // Streak at risk
        if (daysSinceActive >= 1 && userProgress.streakDays > 0) {
          return {
            type: 'streak',
            message: `Your ${userProgress.streakDays}-day streak is at risk!`,
            action: 'Complete a quick lesson to maintain your streak',
            priority: 'high'
          };
        }

        // Weekly goal not met
        if (userProgress.weeklyProgress < userProgress.weeklyGoal) {
          return {
            type: 'goal',
            message: `You're ${userProgress.weeklyGoal - userProgress.weeklyProgress} lessons away from your weekly goal`,
            action: 'Complete more lessons this week',
            priority: 'medium'
          };
        }

        // Has struggling topics
        if (userProgress.strugglingTopics.length > 0) {
          return {
            type: 'review',
            message: `Review ${userProgress.strugglingTopics[0]} concepts`,
            action: `Revisit ${userProgress.strugglingTopics[0]} materials`,
            priority: 'medium'
          };
        }

        // Continue current chapter
        const currentChapterProgress = get().getChapterProgress(userProgress.currentChapter);
        if (currentChapterProgress < 100) {
          return {
            type: 'continue',
            message: `Continue Chapter ${userProgress.currentChapter}`,
            action: `You're ${currentChapterProgress}% complete`,
            priority: 'medium'
          };
        }

        // Default: practice
        return {
          type: 'practice',
          message: 'Practice with financial calculators',
          action: 'Explore interactive tools',
          priority: 'low'
        };
      },

      getPersonalizedEncouragement: () => {
        const { userProgress } = get();
        const messages = {
          highStreak: [
            `Amazing! ${userProgress.streakDays} days of consistent learning! 🔥`,
            `You're on fire! ${userProgress.streakDays} days strong! 💪`,
            `Incredible dedication! ${userProgress.streakDays} days of growth! 🚀`
          ],
          mediumStreak: [
            `Great momentum with ${userProgress.streakDays} days! Keep it up! ⭐`,
            `Building strong habits! ${userProgress.streakDays} days and counting! 📈`,
            `Steady progress! ${userProgress.streakDays} days of learning! 🎯`
          ],
          lowStreak: [
            'Every expert was once a beginner! 🌱',
            'Small steps lead to big changes! 👣',
            'Your financial future starts with today! 💡'
          ],
          highScore: [
            `Outstanding! ${Math.round(userProgress.learningAnalytics.averageQuizScore)}% average score! 🏆`,
            `You're mastering this! ${Math.round(userProgress.learningAnalytics.averageQuizScore)}% average! 🎓`,
            `Excellent progress! ${Math.round(userProgress.learningAnalytics.averageQuizScore)}% quiz average! ⚡`
          ]
        };

        if (userProgress.learningAnalytics.averageQuizScore >= 85) {
          return messages.highScore[Math.floor(Math.random() * messages.highScore.length)];
        } else if (userProgress.streakDays >= 7) {
          return messages.highStreak[Math.floor(Math.random() * messages.highStreak.length)];
        } else if (userProgress.streakDays >= 3) {
          return messages.mediumStreak[Math.floor(Math.random() * messages.mediumStreak.length)];
        } else {
          return messages.lowStreak[Math.floor(Math.random() * messages.lowStreak.length)];
        }
      },

      getStreakMotivation: () => {
        const { userProgress } = get();
        const today = new Date();
        const lastActive = new Date(userProgress.lastActiveDate);
        const daysSinceActive = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceActive === 0) {
          return {
            message: `Great job! You're maintaining your ${userProgress.streakDays}-day streak! 🔥`,
            streakStatus: 'maintaining' as const,
            suggestions: [
              'Try a new calculator today',
              'Review previous concepts',
              'Set a higher weekly goal'
            ]
          };
        } else if (daysSinceActive === 1 && userProgress.streakDays > 0) {
          return {
            message: `Your ${userProgress.streakDays}-day streak is at risk! Don't break the chain! ⚠️`,
            streakStatus: 'at_risk' as const,
            suggestions: [
              'Complete a quick 5-minute lesson',
              'Try a financial calculator',
              'Review quiz questions'
            ]
          };
        } else if (userProgress.streakDays >= 7) {
          return {
            message: `Amazing ${userProgress.streakDays}-day streak! You're building life-changing habits! 🚀`,
            streakStatus: 'building' as const,
            suggestions: [
              'Share your progress with friends',
              'Set a new personal record',
              'Explore advanced topics'
            ]
          };
        } else if (daysSinceActive > 1 && userProgress.streakDays === 0) {
          return {
            message: `Ready to start a new streak? Every expert started with day 1! 🌟`,
            streakStatus: 'broken' as const,
            suggestions: [
              'Start with an easy lesson',
              'Review your favorite topic',
              'Try a quick calculator'
            ]
          };
        } else {
          return {
            message: `Building momentum! ${userProgress.streakDays} days strong! 💪`,
            streakStatus: 'building' as const,
            suggestions: [
              'Aim for 7 days in a row',
              'Study at the same time daily',
              'Set daily reminders'
            ]
          };
        }
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
