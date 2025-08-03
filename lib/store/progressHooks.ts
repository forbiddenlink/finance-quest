/**
 * Migration utility for transitioning from React Context to Zustand
 * This provides backwards compatibility while we migrate components
 */

import { useProgressStore } from './progressStore';

// Legacy hook for components still using the old context pattern
export const useProgress = () => {
  const store = useProgressStore();
  
  return {
    userProgress: store.userProgress,
    completeLesson: store.completeLesson,
    recordQuizScore: store.recordQuizScore,
    canTakeQuiz: store.canTakeQuiz,
    updateTimeSpent: store.updateTimeSpent,
    isChapterUnlocked: store.isChapterUnlocked,
    getChapterProgress: store.getChapterProgress,
    recordCalculatorUsage: store.recordCalculatorUsage,
    resetProgress: store.resetProgress
  };
};

// Enhanced hooks for new features
export const useEnhancedProgress = () => {
  const store = useProgressStore();
  
  return {
    ...store,
    // Computed values for convenience
    totalQuizzesTaken: Object.keys(store.userProgress.quizScores).length,
    totalLessonsCompleted: store.userProgress.completedLessons.length,
    averageQuizScore: store.userProgress.learningAnalytics.averageQuizScore,
    currentStreak: store.userProgress.streakDays,
    totalTimeSpentHours: Math.round(store.userProgress.totalTimeSpent / 3600 * 10) / 10,
    
    // Helper methods
    hasPassedChapter: (chapterId: number) => {
      const quizId = `chapter${chapterId}-quiz`;
      const score = store.userProgress.quizScores[quizId];
      return score && score >= 80;
    },
    
    getStrugglingAreas: () => store.userProgress.strugglingTopics,
    
    getMasteredConcepts: () => store.userProgress.learningAnalytics.conceptsMastered,
    
    getRecommendedNextAction: () => {
      const { userProgress } = store;
      
      // If struggling with topics, recommend review
      if (userProgress.strugglingTopics.length > 0) {
        return {
          type: 'review',
          message: `Review ${userProgress.strugglingTopics[0]} concepts`,
          action: `Go to ${userProgress.strugglingTopics[0]} lesson`
        };
      }
      
      // If current chapter incomplete, continue it
      const currentChapterProgress = store.getChapterProgress(userProgress.currentChapter);
      if (currentChapterProgress < 100) {
        return {
          type: 'continue',
          message: `Continue Chapter ${userProgress.currentChapter}`,
          action: `You&apos;re ${currentChapterProgress}% done`
        };
      }
      
      // If next chapter available, start it
      if (store.isChapterUnlocked(userProgress.currentChapter + 1)) {
        return {
          type: 'advance',
          message: `Start Chapter ${userProgress.currentChapter + 1}`,
          action: 'Begin new chapter'
        };
      }
      
      // Default: practice with calculators
      return {
        type: 'practice',
        message: 'Practice with financial calculators',
        action: 'Explore tools'
      };
    }
  };
};
